
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card } from '@/components/ui/card';
import { Loader2, Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { apiService } from '@/services/api';
import { parseGeneratedContent } from '@/utils/outlineParser';

const Dashboard = () => {
  const [keyword, setKeyword] = useState('');
  const [outputType, setOutputType] = useState('');
  const [audience, setAudience] = useState('');
  const [tone, setTone] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const outputTypes = [
    { value: 'outline', label: 'Outline Only' },
    { value: 'outline-brief', label: 'Outline + Content Brief' },
    { value: 'outline-brief-intro', label: 'Outline + Brief + Intro Paragraph' }
  ];

  const audiences = [
    { value: 'general', label: 'General' },
    { value: 'tech-savvy', label: 'Tech-savvy' },
    { value: 'marketing', label: 'Marketing' },
    { value: 'students', label: 'Students' },
    { value: 'professionals', label: 'Professionals' }
  ];

  const tones = [
    { value: 'friendly', label: 'Friendly' },
    { value: 'formal', label: 'Formal' },
    { value: 'technical', label: 'Technical' },
    { value: 'persuasive', label: 'Persuasive' },
    { value: 'conversational', label: 'Conversational' }
  ];

  const handleKeywordChange = async (value: string) => {
    setKeyword(value);
    if (value.length > 2) {
      setIsLoadingSuggestions(true);
      try {
        const suggestions = await apiService.getSuggestions(value);
        setSuggestions(suggestions);
        setShowSuggestions(true);
      } catch (error) {
        console.error('Error fetching suggestions:', error);
        toast({
          title: 'Error',
          description: 'Failed to fetch keyword suggestions',
          variant: 'destructive'
        });
        setSuggestions([]);
      } finally {
        setIsLoadingSuggestions(false);
      }
    } else {
      setShowSuggestions(false);
    }
  };

  const handleGenerateOutline = async () => {
    if (!keyword || !outputType || !audience || !tone) {
      toast({
        title: 'Error',
        description: 'Please fill in all fields before generating an outline',
        variant: 'destructive'
      });
      return;
    }

    setIsLoading(true);
    
    try {
      const data = await apiService.generateOutline({
        topic: keyword,
        output_type: outputType,
        audience: audience,
        tone: tone
      });
      
      console.log('Full API Response:', JSON.stringify(data, null, 2));
      
      // Check if we have the expected data structure
      if (!data.generated_content) {
        console.error('No generated_content in API response');
        throw new Error('Invalid API response format');
      }
      
      // Parse the generated_content into structured outline format
      const parsedOutline = parseGeneratedContent(data.generated_content, data.topic || keyword);
      
      console.log('Parsed outline:', JSON.stringify(parsedOutline, null, 2));
      
      // Ensure we have sections before navigating
      if (!parsedOutline.sections || parsedOutline.sections.length === 0) {
        console.warn('No sections found in parsed outline');
        // Create a fallback outline with the raw content
        const fallbackOutline = {
          title: data.topic || keyword,
          sections: [{
            id: 'section-0',
            level: 1,
            title: 'Generated Content',
            brief: data.generated_content
          }]
        };
        
        navigate('/editor', { 
          state: { 
            keyword, 
            outputType, 
            audience, 
            tone,
            outline: fallbackOutline
          } 
        });
      } else {
        navigate('/editor', { 
          state: { 
            keyword, 
            outputType, 
            audience, 
            tone,
            outline: parsedOutline
          } 
        });
      }
      
      toast({
        title: 'Success',
        description: 'Outline generated successfully! Redirecting to editor...',
      });
      
    } catch (error) {
      console.error('Error generating outline:', error);
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to generate outline. Please try again.',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const selectSuggestion = (suggestion: string) => {
    setKeyword(suggestion);
    setShowSuggestions(false);
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-4">
            AI Smart SEO Blog Outline Generator
          </h1>
          <p className="text-xl text-muted-foreground">
            Create SEO-optimized blog outlines in minutes with AI assistance
          </p>
        </div>

        <Card className="p-8 bg-card">
          <div className="space-y-6">
            {/* Keyword Input */}
            <div className="relative">
              <label htmlFor="keyword" className="block text-sm font-medium text-foreground mb-2">
                Topic or Keyword
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                {isLoadingSuggestions && (
                  <Loader2 className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4 animate-spin" />
                )}
                <Input
                  id="keyword"
                  type="text"
                  placeholder="Enter your blog topic or main keyword..."
                  value={keyword}
                  onChange={(e) => handleKeywordChange(e.target.value)}
                  className="pl-10 pr-10"
                />
                {showSuggestions && suggestions.length > 0 && (
                  <div className="absolute z-10 w-full mt-1 bg-popover border border-border rounded-md shadow-lg">
                    {suggestions.map((suggestion, index) => (
                      <button
                        key={index}
                        onClick={() => selectSuggestion(suggestion)}
                        className="w-full text-left px-4 py-2 hover:bg-accent hover:text-accent-foreground transition-colors"
                      >
                        {suggestion}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Output Type */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Output Type
                </label>
                <Select value={outputType} onValueChange={setOutputType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select output type" />
                  </SelectTrigger>
                  <SelectContent>
                    {outputTypes.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Target Audience */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Target Audience
                </label>
                <Select value={audience} onValueChange={setAudience}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select audience" />
                  </SelectTrigger>
                  <SelectContent>
                    {audiences.map((aud) => (
                      <SelectItem key={aud.value} value={aud.value}>
                        {aud.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Content Tone */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Content Tone
                </label>
                <Select value={tone} onValueChange={setTone}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select tone" />
                  </SelectTrigger>
                  <SelectContent>
                    {tones.map((t) => (
                      <SelectItem key={t.value} value={t.value}>
                        {t.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Generate Button */}
            <div className="flex justify-center pt-4">
              <Button 
                onClick={handleGenerateOutline}
                disabled={!keyword || !outputType || !audience || !tone || isLoading}
                size="lg"
                className="w-full md:w-auto min-w-48"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating Outline...
                  </>
                ) : (
                  'Generate Outline'
                )}
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
