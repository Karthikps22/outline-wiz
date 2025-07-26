
import { OutlineSection, OutlineData } from '@/types/outline';

export const parseGeneratedContent = (content: string, title: string): OutlineData => {
  const lines = content.split('\n').filter(line => line.trim());
  const sections: OutlineSection[] = [];
  
  lines.forEach((line, index) => {
    const trimmed = line.trim();
    if (!trimmed) return;
    
    // Detect Roman numerals (I., II., III., etc.) - Level 1
    if (/^[IVX]+\.\s/.test(trimmed)) {
      const title = trimmed.replace(/^[IVX]+\.\s/, '');
      sections.push({
        id: `section-${index}`,
        level: 1,
        title: title
      });
    }
    // Detect capital letters (A., B., C., etc.) - Level 2
    else if (/^[A-Z]\.\s/.test(trimmed)) {
      const title = trimmed.replace(/^[A-Z]\.\s/, '');
      sections.push({
        id: `section-${index}`,
        level: 2,
        title: title
      });
    }
    // Detect numbers (1., 2., 3., etc.) - Level 3
    else if (/^\d+\.\s/.test(trimmed)) {
      const title = trimmed.replace(/^\d+\.\s/, '');
      sections.push({
        id: `section-${index}`,
        level: 3,
        title: title
      });
    }
    // Handle other content as level 1 sections if they don't match patterns above
    else if (trimmed.length > 3 && !trimmed.startsWith('Keywords:')) {
      sections.push({
        id: `section-${index}`,
        level: 1,
        title: trimmed
      });
    }
  });
  
  return {
    title,
    sections
  };
};
