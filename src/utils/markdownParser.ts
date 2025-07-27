
import { OutlineData, OutlineSection } from '@/types/outline';

export const parseMarkdownContent = (content: string): OutlineData => {
  const lines = content.split('\n').filter(line => line.trim());
  const sections: OutlineSection[] = [];
  let title = '';
  
  lines.forEach((line, index) => {
    const trimmed = line.trim();
    if (!trimmed) return;
    
    // Extract title from first H1
    if (trimmed.startsWith('# ') && !title) {
      title = trimmed.replace('# ', '').replace(/^H1:\s*/, '');
      return;
    }
    
    // Parse headings with H1:, H2:, H3:, H4:, H5: prefixes
    if (trimmed.startsWith('##### ')) {
      const sectionTitle = trimmed.replace('##### ', '').replace(/^H5:\s*/, '');
      sections.push({
        id: `section-${index}`,
        level: 5,
        title: sectionTitle
      });
    } else if (trimmed.startsWith('#### ')) {
      const sectionTitle = trimmed.replace('#### ', '').replace(/^H4:\s*/, '');
      sections.push({
        id: `section-${index}`,
        level: 4,
        title: sectionTitle
      });
    } else if (trimmed.startsWith('### ')) {
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
  });
  
  return {
    title: title || 'Untitled',
    sections
  };
};

export const generateMarkdownFromContent = (content: string): string => {
  // Clean up the content and ensure proper markdown formatting
  return content
    .replace(/^##### H5:\s*/gm, '##### ')
    .replace(/^#### H4:\s*/gm, '#### ')
    .replace(/^### H3:\s*/gm, '### ')
    .replace(/^## H2:\s*/gm, '## ')
    .replace(/^# H1:\s*/gm, '# ');
};
