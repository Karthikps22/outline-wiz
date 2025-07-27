
import React, { useState, useRef, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

interface AutocompleteInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  isTextarea?: boolean;
  rows?: number;
}

const AutocompleteInput: React.FC<AutocompleteInputProps> = ({
  value,
  onChange,
  placeholder,
  className,
  disabled,
  isTextarea = false,
  rows = 3
}) => {
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement>(null);

  // Frontend suggestion keywords for outline content
  const suggestionKeywords = [
    'Introduction to',
    'Overview of',
    'Benefits of',
    'Challenges in',
    'Best practices for',
    'How to implement',
    'Step-by-step guide to',
    'Common mistakes in',
    'Future trends in',
    'Case study:',
    'Comparison between',
    'Tools and resources for',
    'Getting started with',
    'Advanced techniques in',
    'Troubleshooting',
    'Performance optimization',
    'Security considerations',
    'Cost analysis of',
    'ROI of',
    'Implementation strategy',
    'Key features of',
    'Pros and cons of',
    'Market analysis',
    'User experience',
    'Technical requirements',
    'Integration with',
    'Scalability of',
    'Maintenance of',
    'Training and support',
    'Migration to',
    'Monitoring and analytics',
    'Backup and recovery',
    'Compliance and regulations',
    'Industry standards',
    'Emerging technologies',
    'Digital transformation',
    'Cloud computing',
    'Artificial intelligence',
    'Machine learning',
    'Data analytics',
    'Cybersecurity',
    'Mobile development',
    'Web development',
    'DevOps practices',
    'Agile methodology',
    'Project management',
    'Team collaboration',
    'Remote work strategies',
    'Customer engagement',
    'Brand building',
    'Content marketing',
    'Social media strategy',
    'Email marketing',
    'SEO optimization',
    'Conversion optimization',
    'User acquisition',
    'Customer retention',
    'Market research',
    'Competitive analysis'
  ];

  const generateSuggestions = (input: string) => {
    if (input.length < 2) return [];
    
    const inputLower = input.toLowerCase();
    const matches = suggestionKeywords.filter(keyword => 
      keyword.toLowerCase().includes(inputLower)
    );
    
    return matches.slice(0, 5); // Limit to 5 suggestions
  };

  const handleInputChange = (newValue: string) => {
    onChange(newValue);
    const newSuggestions = generateSuggestions(newValue);
    setSuggestions(newSuggestions);
    setShowSuggestions(newSuggestions.length > 0);
    setSelectedIndex(-1);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!showSuggestions) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => 
          prev < suggestions.length - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => prev > 0 ? prev - 1 : -1);
        break;
      case 'Enter':
        if (selectedIndex >= 0) {
          e.preventDefault();
          selectSuggestion(suggestions[selectedIndex]);
        }
        break;
      case 'Escape':
        setShowSuggestions(false);
        setSelectedIndex(-1);
        break;
    }
  };

  const selectSuggestion = (suggestion: string) => {
    onChange(suggestion);
    setShowSuggestions(false);
    setSelectedIndex(-1);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (inputRef.current && !inputRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative">
      {isTextarea ? (
        <Textarea
          ref={inputRef as React.RefObject<HTMLTextAreaElement>}
          value={value}
          onChange={(e) => handleInputChange(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className={className}
          disabled={disabled}
          rows={rows}
        />
      ) : (
        <Input
          ref={inputRef as React.RefObject<HTMLInputElement>}
          value={value}
          onChange={(e) => handleInputChange(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className={className}
          disabled={disabled}
        />
      )}
      
      {showSuggestions && suggestions.length > 0 && (
        <div className="absolute z-10 w-full mt-1 bg-popover border border-border rounded-md shadow-lg max-h-40 overflow-y-auto">
          {suggestions.map((suggestion, index) => (
            <button
              key={index}
              onClick={() => selectSuggestion(suggestion)}
              className={`w-full text-left px-3 py-2 hover:bg-accent hover:text-accent-foreground transition-colors ${
                selectedIndex === index ? 'bg-accent text-accent-foreground' : ''
              }`}
            >
              {suggestion}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default AutocompleteInput;
