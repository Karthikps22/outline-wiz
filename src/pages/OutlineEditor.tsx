import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import {
  ArrowLeft,
  Copy,
  Download,
  Undo,
  Redo,
  RotateCcw,
  Eye,
  Edit,
  Loader2,
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { OutlineData } from '@/types/outline';
import ReactMarkdown from 'react-markdown';
import AutocompleteInput from '@/components/AutocompleteInput';
import BlogPostRenderer from '@/components/BlogPostRenderer';
import { parseMarkdownContent, generateMarkdownFromContent } from '@/utils/markdownParser';

// Helper component to render headings with correct tag based on level
const Heading = ({ level, children }: { level: number; children: React.ReactNode }) => {
  switch (level) {
    case 1:
      return <h1 style={{ marginLeft: 0, marginTop: 12 }}>{children}</h1>;
    case 2:
      return <h2 style={{ marginLeft: 20, marginTop: 10 }}>{children}</h2>;
    case 3:
      return <h3 style={{ marginLeft: 40, marginTop: 8 }}>{children}</h3>;
    case 4:
      return <h4 style={{ marginLeft: 60, marginTop: 6 }}>{children}</h4>;
    case 5:
      return <h5 style={{ marginLeft: 80, marginTop: 4 }}>{children}</h5>;
    default:
      return <div style={{ marginLeft: (level - 1) * 20, marginTop: 4 }}>{children}</div>;
  }
};

const TreeNodeSemantic = ({ section }: { section: any }) => {
  return <Heading level={section.level}>{section.title}</Heading>;
};

const OutlineEditor = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [outline, setOutline] = useState<OutlineData | null>(null);
  const [history, setHistory] = useState<OutlineData[]>([]);
  const [currentHistoryIndex, setCurrentHistoryIndex] = useState(-1);
  const [rawContent, setRawContent] = useState('');

  const [isEditingOutline, setIsEditingOutline] = useState(false);
  const [editableOutlineText, setEditableOutlineText] = useState('');
  const [originalOutlineText, setOriginalOutlineText] = useState('');

  // Visualization modes - Tree & Markdown only
  const VISUALIZATION_MODES = ['Blog View', 'Tree View', 'Markdown'];
  const [viewMode, setViewMode] = useState(VISUALIZATION_MODES[0]);

  useEffect(() => {
    if (location.state?.outline) {
      const initialOutline = location.state.outline;
      setOutline(initialOutline);
      setHistory([initialOutline]);
      setCurrentHistoryIndex(0);
      
      // Check if we have raw content from API
      const rawApiContent = location.state.rawContent || '';
      setRawContent(rawApiContent);
      
      // Use raw content if available, otherwise generate from outline
      const initialText = rawApiContent || generateOutlineText(initialOutline);
      setEditableOutlineText(initialText);
      setOriginalOutlineText(initialText);
      
      toast({
        title: 'Outline loaded',
        description: 'Your generated outline is ready for editing!',
      });
    } else {
      toast({
        title: 'No outline data',
        description: 'Redirecting to dashboard...',
        variant: 'destructive',
      });
      navigate('/');
    }
  }, [location.state, navigate, toast]);

  const addToHistory = (newOutline: OutlineData) => {
    const newHistory = history.slice(0, currentHistoryIndex + 1);
    newHistory.push(newOutline);
    setHistory(newHistory);
    setCurrentHistoryIndex(newHistory.length - 1);
  };

  const undo = () => {
    if (currentHistoryIndex > 0) {
      const prevIndex = currentHistoryIndex - 1;
      const prevOutline = history[prevIndex];
      setOutline(prevOutline);
      const prevText = generateOutlineText(prevOutline);
      setEditableOutlineText(prevText);
      setOriginalOutlineText(prevText);
      setCurrentHistoryIndex(prevIndex);
      
      // Exit edit mode if currently editing
      if (isEditingOutline) {
        setIsEditingOutline(false);
      }
    }
  };

  const redo = () => {
    if (currentHistoryIndex < history.length - 1) {
      const nextIndex = currentHistoryIndex + 1;
      const nextOutline = history[nextIndex];
      setOutline(nextOutline);
      const nextText = generateOutlineText(nextOutline);
      setEditableOutlineText(nextText);
      setOriginalOutlineText(nextText);
      setCurrentHistoryIndex(nextIndex);
      
      // Exit edit mode if currently editing
      if (isEditingOutline) {
        setIsEditingOutline(false);
      }
    }
  };

  const resetOutline = () => {
    if (history.length > 0) {
      const initial = history[0];
      setOutline(initial);
      const initialText = generateOutlineText(initial);
      setEditableOutlineText(initialText);
      setOriginalOutlineText(initialText);
      setCurrentHistoryIndex(0);
      
      // Exit edit mode if currently editing
      if (isEditingOutline) {
        setIsEditingOutline(false);
      }
      
      toast({
        title: 'Outline reset',
        description: 'Reverted to the original generated outline.',
      });
    }
  };

  const updateTitle = (newTitle: string) => {
    if (!outline) return;
    const updatedOutline = { ...outline, title: newTitle };
    setOutline(updatedOutline);
    addToHistory(updatedOutline);
    
    // Update raw content title if it exists
    if (rawContent) {
      const updatedRawContent = rawContent.replace(/^# .*$/m, `# H1: ${newTitle}`);
      setRawContent(updatedRawContent);
      setEditableOutlineText(updatedRawContent);
      setOriginalOutlineText(updatedRawContent);
    } else {
      const updatedText = generateOutlineText(updatedOutline);
      setEditableOutlineText(updatedText);
      setOriginalOutlineText(updatedText);
    }
  };

  // Generate editable text format with H1:, H2:, etc. prefixes
  const generateOutlineText = (outline: OutlineData): string => {
    if (!outline) return '';
    let text = `# H1: ${outline.title}\n\n`;
    outline.sections.forEach((section) => {
      const prefix = '#'.repeat(section.level);
      text += `${prefix} H${section.level}: ${section.title}\n`;
    });
    return text;
  };

  const generateMarkdown = (outline: OutlineData): string => {
    if (!outline) return '';
    
    // If we have raw content, use it for markdown generation
    if (rawContent) {
      return generateMarkdownFromContent(rawContent);
    }
    
    // Otherwise, generate from outline structure
    let markdown = `# ${outline.title}\n\n`;
    outline.sections.forEach((section) => {
      const prefix = '#'.repeat(section.level);
      markdown += `${prefix} ${section.title}\n`;
    });
    return markdown;
  };

  const parseOutlineTextToOutline = (text: string, originalOutline: OutlineData): OutlineData => {
    const lines = text.split('\n').filter(Boolean);
    if (lines.length === 0) return originalOutline;
    
    const titleLine = lines[0];
    let newTitle = titleLine.replace(/^# H1:\s*/, '').trim() || originalOutline.title;

    // Parse sections
    const sections: typeof originalOutline.sections = [];
    lines.slice(1).forEach((line, idx) => {
      const trimmed = line.trim();
      if (!trimmed) return;
      
      // Match H1: through H5: patterns
      const h5Match = trimmed.match(/^##### H5:\s*(.+)$/);
      const h4Match = trimmed.match(/^#### H4:\s*(.+)$/);
      const h3Match = trimmed.match(/^### H3:\s*(.+)$/);
      const h2Match = trimmed.match(/^## H2:\s*(.+)$/);
      const h1Match = trimmed.match(/^# H1:\s*(.+)$/);
      
      if (h5Match) {
        sections.push({
          id: `section-${idx}`,
          level: 5,
          title: h5Match[1]
        });
      } else if (h4Match) {
        sections.push({
          id: `section-${idx}`,
          level: 4,
          title: h4Match[1]
        });
      } else if (h3Match) {
        sections.push({
          id: `section-${idx}`,
          level: 3,
          title: h3Match[1]
        });
      } else if (h2Match) {
        sections.push({
          id: `section-${idx}`,
          level: 2,
          title: h2Match[1]
        });
      } else if (h1Match) {
        sections.push({
          id: `section-${idx}`,
          level: 1,
          title: h1Match[1]
        });
      }
    });

    return {
      title: newTitle,
      sections,
    };
  };

  const saveEditedOutlineText = () => {
    if (!outline) return;
    
    // Update raw content if we're working with markdown content
    if (rawContent) {
      setRawContent(editableOutlineText);
      // Parse the content to update the outline structure
      const parsedOutline = parseMarkdownContent(editableOutlineText);
      setOutline(parsedOutline);
      addToHistory(parsedOutline);
    } else {
      // Parse text back to outline object for structured content
      const parsedOutline = parseOutlineTextToOutline(editableOutlineText, outline);
      setOutline(parsedOutline);
      addToHistory(parsedOutline);
    }
    
    setIsEditingOutline(false);
    setOriginalOutlineText(editableOutlineText);
    toast({
      title: 'Outline edited',
      description: 'Your edits have been saved and history updated.',
    });
  };

  const cancelEdit = () => {
    setEditableOutlineText(originalOutlineText);
    setIsEditingOutline(false);
  };

  const copyToClipboard = () => {
    if (!outline) return;

    let textToCopy = '';
    if (viewMode === 'Markdown') {
      textToCopy = generateMarkdown(outline);
    } else if (viewMode === 'Blog View' && rawContent) {
      textToCopy = generateMarkdownFromContent(rawContent);
    } else {
      textToCopy = editableOutlineText;
    }

    navigator.clipboard.writeText(textToCopy);
    toast({
      title: 'Copied to clipboard',
      description: 'Outline has been copied.',
    });
  };

  const downloadMarkdown = () => {
    if (!outline) return;

    const markdown = generateMarkdown(outline);
    const blob = new Blob([markdown], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${outline.title.replace(/\s+/g, '-').toLowerCase()}.md`;
    a.click();
    URL.revokeObjectURL(url);

    toast({
      title: 'Download started',
      description: 'Markdown file is being downloaded',
    });
  };

  if (!outline) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading outline...</p>
        </div>
      </div>
    );
  }

  // Render tree view with proper heading tags
  const renderTreeView = (sections: OutlineData['sections']) => {
    return sections.map(section => <TreeNodeSemantic key={section.id} section={section} />);
  };

  let outlineView = null;
  switch (viewMode) {
    case 'Blog View':
      if (rawContent) {
        const cleanedContent = generateMarkdownFromContent(rawContent);
        outlineView = (
          <div className="bg-white p-8 rounded-lg shadow-sm border border-border">
            <BlogPostRenderer content={cleanedContent} />
          </div>
        );
      } else {
        outlineView = (
          <div className="bg-white p-8 rounded-lg shadow-sm border border-border">
            <BlogPostRenderer content={generateMarkdown(outline)} />
          </div>
        );
      }
      break;
    case 'Tree View':
      outlineView = renderTreeView(outline.sections);
      break;
    case 'Markdown':
      outlineView = (
        <div
          className="prose max-w-none bg-white p-4 rounded shadow border border-gray-200"
          aria-label="Markdown formatted outline"
        >
          <ReactMarkdown>{generateMarkdown(outline)}</ReactMarkdown>
        </div>
      );
      break;
    default:
      outlineView = <div />;
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-card">
        <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" onClick={() => navigate('/')} className="p-2">
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <h1 className="text-xl font-semibold text-foreground">Outline Editor</h1>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              onClick={undo}
              disabled={currentHistoryIndex <= 0}
              className="p-2"
              title="Undo"
            >
              <Undo className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              onClick={redo}
              disabled={currentHistoryIndex >= history.length - 1}
              className="p-2"
              title="Redo"
            >
              <Redo className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              onClick={resetOutline}
              className="p-2"
              title="Reset Outline"
            >
              <RotateCcw className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              onClick={() => setIsEditingOutline(!isEditingOutline)}
              className="p-2"
              title={isEditingOutline ? 'Preview Outline' : 'Edit Outline'}
            >
              {isEditingOutline ? <Eye className="h-4 w-4" /> : <Edit className="h-4 w-4" />}
            </Button>
            <Button variant="outline" onClick={copyToClipboard} className="p-2" title="Copy Outline">
              <Copy className="h-4 w-4" />
            </Button>
            <Button onClick={downloadMarkdown} className="p-2" title="Download Markdown">
              <Download className="h-4 w-4" />
            </Button>

            <select
              className="border rounded px-2 py-1 ml-3"
              value={viewMode}
              onChange={(e) => setViewMode(e.target.value)}
              aria-label="Change visualization mode"
              disabled={isEditingOutline}
            >
              {VISUALIZATION_MODES.map((mode) => (
                <option key={mode} value={mode}>
                  {mode}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto p-6">
        <Card className="p-8">
          <div className="mb-8">
            <AutocompleteInput
              value={outline.title}
              onChange={updateTitle}
              placeholder="Enter outline title..."
              className="text-3xl font-bold border-none p-0 focus-visible:ring-0"
              disabled={isEditingOutline}
            />
          </div>
          <div>
            {!isEditingOutline ? (
              <div>{outlineView}</div>
            ) : (
              <>
                <AutocompleteInput
                  value={editableOutlineText}
                  onChange={setEditableOutlineText}
                  placeholder="Edit your outline content..."
                  className="font-mono text-base p-4 border border-border rounded"
                  isTextarea={true}
                  rows={25}
                />
                <div className="mt-4 flex space-x-4">
                  <Button onClick={saveEditedOutlineText}>Save</Button>
                  <Button variant="outline" onClick={cancelEdit}>
                    Cancel
                  </Button>
                </div>
              </>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default OutlineEditor;
