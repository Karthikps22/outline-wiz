
import { OutlineSection, OutlineData } from '@/types/outline';

export const parseGeneratedContent = (content: string, title: string): OutlineData => {
  const lines = content.split('\n').filter(line => line.trim());
  const sections: OutlineSection[] = [];
  
  lines.forEach((line, index) => {
    const trimmed = line.trim();
    if (!trimmed) return;
    
    // Detect markdown-style headings
    if (trimmed.startsWith('### ')) {
      const sectionTitle = trimmed.replace('### ', '').replace(/^H3:\s*/, '');
      sections.push({
        id: `section-${index}`,
        level: 3,
        title: sectionTitle
      });
    } else if (trimmed.startsWith('## ')) {
      const sectionTitle = trimmed.replace('## ', '').replace(/^H2:\s*/, '');
      sections.push({
        id: `section-${index}`,
        level: 2,
        title: sectionTitle
      });
    } else if (trimmed.startsWith('# ')) {
      const sectionTitle = trimmed.replace('# ', '').replace(/^H1:\s*/, '');
      sections.push({
        id: `section-${index}`,
        level: 1,
        title: sectionTitle
      });
    }
    // Detect Roman numerals (I., II., III., etc.) - Level 1
    else if (/^[IVX]+\.\s/.test(trimmed)) {
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
    else if (trimmed.length > 3 && !trimmed.startsWith('Keywords:') && !trimmed.startsWith('Content Brief:')) {
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
