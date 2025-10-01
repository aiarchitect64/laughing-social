import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { ContentCard } from './ContentCard';
import { Loader2 } from 'lucide-react';

interface Content {
  id: string;
  creator_id: string;
  content_type: string;
  title: string | null;
  description: string | null;
  text_content: string | null;
  media_url: string | null;
  media_type: string | null;
  tags: string[];
  laugh_score: number;
  created_at: string;
  profiles: {
    username: string;
    display_name: string;
    avatar_url: string | null;
  };
}

export function ContentFeed() {
  const [content, setContent] = useState<Content[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchContent = async () => {
    try {
      const { data, error } = await supabase
        .from('content')
        .select(
          `
          *,
          profiles (
            username,
            display_name,
            avatar_url
          )
        `
        )
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) throw error;
      setContent(data || []);
    } catch (error) {
      console.error('Error fetching content:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContent();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="text-cyan-400 animate-spin" size={40} />
      </div>
    );
  }

  if (content.length === 0) {
    return (
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-12 text-center">
        <h3 className="text-2xl font-bold text-white mb-2">No content yet</h3>
        <p className="text-slate-400">Be the first to share something funny!</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {content.map((item) => (
        <ContentCard key={item.id} content={item} onReactionUpdate={fetchContent} />
      ))}
    </div>
  );
}
