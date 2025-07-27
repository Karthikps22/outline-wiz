
import React from 'react';
import ReactMarkdown from 'react-markdown';

interface BlogPostRendererProps {
  content: string;
  className?: string;
}

const BlogPostRenderer: React.FC<BlogPostRendererProps> = ({ content, className = '' }) => {
  return (
    <div className={`prose prose-lg max-w-none ${className}`}>
      <ReactMarkdown
        components={{
          h1: ({ children }) => (
            <h1 className="text-4xl font-bold mb-6 text-foreground border-b border-border pb-4">
              {children}
            </h1>
          ),
          h2: ({ children }) => (
            <h2 className="text-3xl font-semibold mb-4 text-foreground mt-8">
              {children}
            </h2>
          ),
          h3: ({ children }) => (
            <h3 className="text-2xl font-medium mb-3 text-foreground mt-6">
              {children}
            </h3>
          ),
          h4: ({ children }) => (
            <h4 className="text-xl font-medium mb-2 text-foreground mt-5">
              {children}
            </h4>
          ),
          h5: ({ children }) => (
            <h5 className="text-lg font-medium mb-2 text-foreground mt-4">
              {children}
            </h5>
          ),
          p: ({ children }) => (
            <p className="text-base leading-relaxed mb-4 text-muted-foreground">
              {children}
            </p>
          ),
          strong: ({ children }) => (
            <strong className="font-semibold text-foreground">
              {children}
            </strong>
          ),
          em: ({ children }) => (
            <em className="italic text-foreground">
              {children}
            </em>
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
};

export default BlogPostRenderer;
