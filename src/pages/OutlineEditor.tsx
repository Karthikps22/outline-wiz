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

// And your render tree node component:
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

  const [isEditingOutline, setIsEditingOutline] = useState(false);
  const [editableOutlineText, setEditableOutlineText] = useState('');

  // Visualization modes - Tree & Markdown only
  const VISUALIZATION_MODES = ['Tree View', 'Markdown'];
  const [viewMode, setViewMode] = useState(VISUALIZATION_MODES[0]);

  useEffect(() => {
    if (location.state?.outline) {
      const initialOutline = location.state.outline;
      setOutline(initialOutline);
      setHistory([initialOutline]);
      setCurrentHistoryIndex(0);
      setEditableOutlineText(generateOutlineText(initialOutline));
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
    if (isEditingOutline) return;
    if (currentHistoryIndex > 0) {
      const prevIndex = currentHistoryIndex - 1;
      const prevOutline = history[prevIndex];
      setOutline(prevOutline);
      setEditableOutlineText(generateOutlineText(prevOutline));
      setCurrentHistoryIndex(prevIndex);
    }
  };

  const redo = () => {
    if (isEditingOutline) return;
    if (currentHistoryIndex < history.length - 1) {
      const nextIndex = currentHistoryIndex + 1;
      const nextOutline = history[nextIndex];
      setOutline(nextOutline);
      setEditableOutlineText(generateOutlineText(nextOutline));
      setCurrentHistoryIndex(nextIndex);
    }
  };

  const resetOutline = () => {
    if (isEditingOutline) return;
    if (history.length > 0) {
      const initial = history[0];
      setOutline(initial);
      setEditableOutlineText(generateOutlineText(initial));
      setCurrentHistoryIndex(0);
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
    setEditableOutlineText(generateOutlineText(updatedOutline));
  };

  const generateOutlineText = (outline: OutlineData): string => {
    if (!outline) return '';
    let text = `- ${outline.title}\n`;
    outline.sections.forEach((section) => {
      const indent = '    '.repeat(section.level - 1);
      const prefix = '|' + '-'.repeat(section.level + 1);
      text += `${indent}${prefix} ${section.title}\n`;
    });
    return text;
  };

  const generateMarkdown = (outline: OutlineData): string => {
    if (!outline) return '';
    let markdown = `# ${outline.title}\n\n`;
    outline.sections.forEach((section) => {
      const prefix = '#'.repeat(section.level + 1);
      markdown += `${prefix} ${section.title}\n`;
    });
    return markdown;
  };

  const parseOutlineTextToOutline = (text: string, originalOutline: OutlineData): OutlineData => {
    const lines = text.split('\n').filter(Boolean);
    if (lines.length === 0) return originalOutline;
    const titleLine = lines[0];
    let newTitle = titleLine.startsWith('- ') ? titleLine.substring(2).trim() : originalOutline.title;

    // Parse sections
    const sections: typeof originalOutline.sections = [];
    lines.slice(1).forEach((line, idx) => {
      // Detect indentation, prefix '|---', then title
      const match = line.match(/^( *)(\|[-]+) (.+)$/);
      if (match) {
        const indentStr = match[1];
        const prefixStr = match[2];
        const title = match[3];
        const level = prefixStr.length - 1; // because prefix has | + dashes count
        sections.push({
          id: `section-id-${idx}`, // new unique id placeholder
          level,
          title,
          brief: '', // blank, parsing brief would be more complex
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
    // Parse text back to outline object to update structured state and history
    const parsedOutline = parseOutlineTextToOutline(editableOutlineText, outline);
    setOutline(parsedOutline);
    addToHistory(parsedOutline);
    setIsEditingOutline(false);
    toast({
      title: 'Outline edited',
      description: 'Your edits have been saved and history updated.',
    });
  };

  const copyToClipboard = () => {
    if (!outline) return;

    let textToCopy = '';
    if (viewMode === 'Markdown') {
      textToCopy = generateMarkdown(outline);
    } else if (viewMode === 'Tree View') {
      textToCopy = editableOutlineText;
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
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-slate-50 flex items-center justify-center">
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
    case 'Tree View':
      outlineView = renderTreeView(outline.sections);
      break;
    case 'Markdown':
      outlineView = (
        <div
          className="prose max-w-none bg-card p-6 rounded-lg shadow-sm border border-border"
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
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-slate-50">
      {/* Header */}
      <div className="border-b border-border bg-card/80 backdrop-blur-sm">
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
              disabled={currentHistoryIndex <= 0 || isEditingOutline}
              className="p-2"
              title="Undo"
            >
              <Undo className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              onClick={redo}
              disabled={currentHistoryIndex >= history.length - 1 || isEditingOutline}
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
              disabled={isEditingOutline}
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
              className="border border-border rounded-md px-3 py-2 ml-3 bg-card text-foreground"
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
        <Card className="p-8 shadow-lg border-0 bg-card/50 backdrop-blur-sm">
          <div className="mb-8">
            <Input
              value={outline.title}
              onChange={(e) => updateTitle(e.target.value)}
              className="text-3xl font-bold border-none p-0 focus-visible:ring-0 bg-transparent"
              aria-label="Edit outline title"
              disabled={isEditingOutline}
            />
          </div>
          <div>
            {!isEditingOutline ? (
              <div className="bg-card/30 rounded-lg p-6 border border-border/50">{outlineView}</div>
            ) : (
              <>
                <Textarea
                  value={editableOutlineText}
                  onChange={(e) => setEditableOutlineText(e.target.value)}
                  rows={20}
                  className="font-mono text-base p-4 border border-border rounded-lg bg-card/50"
                  aria-label="Edit outline content"
                />
                <div className="mt-4 flex space-x-4">
                  <Button onClick={saveEditedOutlineText}>Save</Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      if (outline) setEditableOutlineText(generateOutlineText(outline));
                      setIsEditingOutline(false);
                    }}
                  >
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
