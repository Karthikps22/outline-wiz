
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { ArrowLeft, Copy, Download, Undo, Redo, RotateCcw, Eye, Edit } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface OutlineSection {
  id: string;
  level: number;
  title: string;
  brief?: string;
}

interface OutlineData {
  title: string;
  sections: OutlineSection[];
}

const OutlineEditor = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [outline, setOutline] = useState<OutlineData | null>(null);
  const [editingSection, setEditingSection] = useState<string | null>(null);
  const [previewMode, setPreviewMode] = useState(false);
  const [history, setHistory] = useState<OutlineData[]>([]);
  const [currentHistoryIndex, setCurrentHistoryIndex] = useState(-1);

  useEffect(() => {
    if (location.state?.outline) {
      const initialOutline = location.state.outline;
      setOutline(initialOutline);
      setHistory([initialOutline]);
      setCurrentHistoryIndex(0);
    } else {
      navigate('/');
    }
  }, [location.state, navigate]);

  const addToHistory = (newOutline: OutlineData) => {
    const newHistory = history.slice(0, currentHistoryIndex + 1);
    newHistory.push(newOutline);
    setHistory(newHistory);
    setCurrentHistoryIndex(newHistory.length - 1);
  };

  const undo = () => {
    if (currentHistoryIndex > 0) {
      setCurrentHistoryIndex(currentHistoryIndex - 1);
      setOutline(history[currentHistoryIndex - 1]);
    }
  };

  const redo = () => {
    if (currentHistoryIndex < history.length - 1) {
      setCurrentHistoryIndex(currentHistoryIndex + 1);
      setOutline(history[currentHistoryIndex + 1]);
    }
  };

  const resetOutline = () => {
    if (history.length > 0) {
      setOutline(history[0]);
      setCurrentHistoryIndex(0);
    }
  };

  const updateSection = (sectionId: string, field: string, value: string) => {
    if (!outline) return;

    const updatedOutline = {
      ...outline,
      sections: outline.sections.map(section =>
        section.id === sectionId ? { ...section, [field]: value } : section
      )
    };
    
    setOutline(updatedOutline);
    addToHistory(updatedOutline);
  };

  const updateTitle = (newTitle: string) => {
    if (!outline) return;

    const updatedOutline = { ...outline, title: newTitle };
    setOutline(updatedOutline);
    addToHistory(updatedOutline);
  };

  const copyToClipboard = () => {
    if (!outline) return;

    let markdown = `# ${outline.title}\n\n`;
    outline.sections.forEach(section => {
      const prefix = '#'.repeat(section.level + 1);
      markdown += `${prefix} ${section.title}\n`;
      if (section.brief) {
        markdown += `\n${section.brief}\n\n`;
      } else {
        markdown += '\n';
      }
    });

    navigator.clipboard.writeText(markdown);
    toast({
      title: 'Copied to clipboard',
      description: 'Outline has been copied as Markdown',
    });
  };

  const downloadMarkdown = () => {
    if (!outline) return;

    let markdown = `# ${outline.title}\n\n`;
    outline.sections.forEach(section => {
      const prefix = '#'.repeat(section.level + 1);
      markdown += `${prefix} ${section.title}\n`;
      if (section.brief) {
        markdown += `\n${section.brief}\n\n`;
      } else {
        markdown += '\n';
      }
    });

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
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-card">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
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
              >
                <Undo className="h-4 w-4" />
              </Button>
              
              <Button
                variant="outline"
                onClick={redo}
                disabled={currentHistoryIndex >= history.length - 1}
                className="p-2"
              >
                <Redo className="h-4 w-4" />
              </Button>
              
              <Button variant="outline" onClick={resetOutline} className="p-2">
                <RotateCcw className="h-4 w-4" />
              </Button>
              
              <Button
                variant="outline"
                onClick={() => setPreviewMode(!previewMode)}
                className="p-2"
              >
                {previewMode ? <Edit className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </Button>
              
              <Button variant="outline" onClick={copyToClipboard} className="p-2">
                <Copy className="h-4 w-4" />
              </Button>
              
              <Button onClick={downloadMarkdown} className="p-2">
                <Download className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto p-6">
        <Card className="p-8">
          {/* Title */}
          <div className="mb-8">
            {previewMode ? (
              <h1 className="text-3xl font-bold text-foreground">{outline.title}</h1>
            ) : (
              <Input
                value={outline.title}
                onChange={(e) => updateTitle(e.target.value)}
                className="text-3xl font-bold border-none p-0 focus-visible:ring-0"
                placeholder="Enter outline title..."
              />
            )}
          </div>

          {/* Sections */}
          <div className="space-y-4">
            {outline.sections.map((section) => (
              <div key={section.id} className="border-l-2 border-border pl-4">
                <div className={`flex items-start space-x-3 ${section.level > 1 ? 'ml-6' : ''}`}>
                  <div className="flex-1">
                    {previewMode ? (
                      <div>
                        <div 
                          className={`font-semibold text-foreground ${
                            section.level === 1 ? 'text-2xl' :
                            section.level === 2 ? 'text-xl' :
                            section.level === 3 ? 'text-lg' : 'text-base'
                          }`}
                        >
                          {section.title}
                        </div>
                        {section.brief && (
                          <p className="text-muted-foreground mt-2">{section.brief}</p>
                        )}
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <Input
                          value={section.title}
                          onChange={(e) => updateSection(section.id, 'title', e.target.value)}
                          className={`font-semibold ${
                            section.level === 1 ? 'text-2xl' :
                            section.level === 2 ? 'text-xl' :
                            section.level === 3 ? 'text-lg' : 'text-base'
                          }`}
                          placeholder="Section title..."
                        />
                        <Textarea
                          value={section.brief || ''}
                          onChange={(e) => updateSection(section.id, 'brief', e.target.value)}
                          placeholder="Brief description (optional)..."
                          rows={2}
                          className="text-muted-foreground"
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default OutlineEditor;
