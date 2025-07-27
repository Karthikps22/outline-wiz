
import React from 'react';
import { TrendingUp } from 'lucide-react';

interface TrendingTopicsProps {
  onTopicSelect: (topic: string) => void;
}

const TrendingTopics: React.FC<TrendingTopicsProps> = ({ onTopicSelect }) => {
  const trendingTopics = [
    {
      id: 1,
      title: 'AI & Machine Learning',
      logo: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=40&h=40&fit=crop&crop=center'
    },
    {
      id: 2,
      title: 'Web Development',
      logo: 'https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7?w=40&h=40&fit=crop&crop=center'
    },
    {
      id: 3,
      title: 'Digital Marketing',
      logo: 'https://images.unsplash.com/photo-1581092795360-fd1ca04f0952?w=40&h=40&fit=crop&crop=center'
    },
    {
      id: 4,
      title: 'Remote Work',
      logo: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=40&h=40&fit=crop&crop=center'
    },
    {
      id: 5,
      title: 'Tech Trends',
      logo: 'https://images.unsplash.com/photo-1581090464777-f3220bbe1b8b?w=40&h=40&fit=crop&crop=center'
    }
  ];

  return (
    <div className="mt-4">
      <div className="flex items-center gap-2 mb-3">
        <TrendingUp className="h-4 w-4 text-muted-foreground" />
        <h3 className="text-sm font-medium text-muted-foreground">Trending Topics</h3>
      </div>
      <div className="flex flex-wrap gap-2">
        {trendingTopics.map((topic) => (
          <button
            key={topic.id}
            onClick={() => onTopicSelect(topic.title)}
            className="flex items-center gap-2 px-3 py-2 bg-secondary hover:bg-accent rounded-md transition-colors text-sm"
          >
            <img 
              src={topic.logo} 
              alt={topic.title}
              className="w-5 h-5 rounded-full object-cover"
            />
            <span className="text-secondary-foreground">{topic.title}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default TrendingTopics;
