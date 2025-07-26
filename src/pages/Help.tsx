
import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronRight, MessageCircle, Mail, Book } from 'lucide-react';

const Help = () => {
  const faqs = [
    {
      question: "How does the AI outline generation work?",
      answer: "Our AI analyzes your keywords, target audience, and content tone to create SEO-optimized blog outlines. It considers search trends, content structure best practices, and audience preferences to generate comprehensive outlines."
    },
    {
      question: "Can I edit the generated outlines?",
      answer: "Yes! All generated outlines are fully editable. You can modify headings, add or remove sections, edit briefs, and restructure the content hierarchy to match your needs."
    },
    {
      question: "What export options are available?",
      answer: "You can copy your outline to clipboard or download it as a Markdown file. We're also working on direct integrations with popular publishing platforms like WordPress, Medium, and Ghost."
    },
    {
      question: "How do I choose the right tone and audience?",
      answer: "Consider your target readers and brand voice. 'Technical' works for expert audiences, 'Friendly' for general readers, 'Formal' for business content, 'Persuasive' for marketing materials, and 'Conversational' for casual blogs."
    },
    {
      question: "What's the difference between output types?",
      answer: "'Outline Only' gives you the structure, 'Outline + Brief' adds content summaries, and 'Outline + Brief + Intro' includes a complete introduction paragraph to get you started."
    }
  ];

  const guides = [
    {
      title: "Getting Started Guide",
      description: "Learn the basics of creating your first SEO-optimized outline",
      icon: Book
    },
    {
      title: "SEO Best Practices",
      description: "Tips for creating search engine friendly content structures",
      icon: ChevronRight
    },
    {
      title: "Advanced Features",
      description: "Unlock the full potential of the outline generator",
      icon: ChevronRight
    }
  ];

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Help & Support</h1>
          <p className="text-muted-foreground">Everything you need to master the AI Smart SEO Blog Outline Generator</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* FAQ Section */}
            <Card className="p-6">
              <h2 className="text-2xl font-semibold text-foreground mb-4">Frequently Asked Questions</h2>
              <div className="space-y-4">
                {faqs.map((faq, index) => (
                  <div key={index} className="border-b border-border pb-4 last:border-b-0">
                    <h3 className="font-medium text-foreground mb-2">{faq.question}</h3>
                    <p className="text-muted-foreground text-sm">{faq.answer}</p>
                  </div>
                ))}
              </div>
            </Card>

            {/* User Guides */}
            <Card className="p-6">
              <h2 className="text-2xl font-semibold text-foreground mb-4">User Guides</h2>
              <div className="space-y-3">
                {guides.map((guide, index) => (
                  <div key={index} className="flex items-center justify-between p-3 rounded-lg hover:bg-accent transition-colors cursor-pointer">
                    <div className="flex items-center space-x-3">
                      <guide.icon className="h-5 w-5 text-primary" />
                      <div>
                        <h3 className="font-medium text-foreground">{guide.title}</h3>
                        <p className="text-sm text-muted-foreground">{guide.description}</p>
                      </div>
                    </div>
                    <ChevronRight className="h-4 w-4 text-muted-foreground" />
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Contact Support */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-foreground mb-4">Need More Help?</h3>
              <div className="space-y-3">
                <Button variant="outline" className="w-full justify-start">
                  <MessageCircle className="mr-2 h-4 w-4" />
                  Live Chat Support
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Mail className="mr-2 h-4 w-4" />
                  Email Support
                </Button>
              </div>
            </Card>

            {/* Tips */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-foreground mb-4">Pro Tips</h3>
              <div className="space-y-3 text-sm">
                <div className="p-3 bg-accent rounded-lg">
                  <p className="font-medium text-accent-foreground mb-1">Keyword Research</p>
                  <p className="text-muted-foreground">Use long-tail keywords for better SEO results</p>
                </div>
                <div className="p-3 bg-accent rounded-lg">
                  <p className="font-medium text-accent-foreground mb-1">Structure Matters</p>
                  <p className="text-muted-foreground">Organize content with clear hierarchies</p>
                </div>
                <div className="p-3 bg-accent rounded-lg">
                  <p className="font-medium text-accent-foreground mb-1">Audience Focus</p>
                  <p className="text-muted-foreground">Always consider your reader's knowledge level</p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Help;
