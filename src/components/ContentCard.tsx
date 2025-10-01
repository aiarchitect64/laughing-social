import { useState } from 'react';
import { Smile, Laugh, Heart, Skull, MessageCircle, Share2, MoreHorizontal } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

interface Profile {
  username: string;
  display_name: string;
  avatar_url: string | null;
}

interface ContentCardProps {
  content: {
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
    profiles: Profile;
  };
  onReactionUpdate?: () => void;
}

const reactionTypes = [
  { type: 'chuckle', icon: Smile, label: 'Chuckle', color: 'text-yellow-400' },
  { type: 'laugh', icon: Laugh, label: 'Laugh', color: 'text-orange-400' },
  { type: 'rofl', icon: Heart, label: 'ROFL', color: 'text-pink-400' },
  { type: 'dying', icon: Skull, label: 'Dying', color: 'text-red-400' },
];

export function ContentCard({ content, onReactionUpdate }: ContentCardProps) {
  const { user } = useAuth();
  const [selectedReaction, setSelectedReaction] = useState<string | null>(null);
  const [showReactions, setShowReactions] = useState(false);
  const [reactionCount, setReactionCount] = useState(content.laugh_score);

  const handleReaction = async (reactionType: string) => {
    if (!user) return;

    try {
      if (selectedReaction === reactionType) {
        await supabase
          .from('reactions')
          .delete()
          .eq('user_id', user.id)
          .eq('content_id', content.id);
        setSelectedReaction(null);
        setReactionCount((prev) => prev - 1);
      } else {
        if (selectedReaction) {
          await supabase
            .from('reactions')
            .delete()
            .eq('user_id', user.id)
            .eq('content_id', content.id);
        }

        await supabase.from('reactions').insert({
          user_id: user.id,
          content_id: content.id,
          reaction_type: reactionType,
        });

        setSelectedReaction(reactionType);
        if (!selectedReaction) {
          setReactionCount((prev) => prev + 1);
        }
      }

      if (onReactionUpdate) {
        onReactionUpdate();
      }
    } catch (error) {
      console.error('Error handling reaction:', error);
    }

    setShowReactions(false);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(hours / 24);

    if (days > 0) return `${days}d ago`;
    if (hours > 0) return `${hours}h ago`;
    return 'Just now';
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden hover:border-slate-700 transition-colors">
      <div className="p-4">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center text-white font-bold">
              {content.profiles.display_name[0].toUpperCase()}
            </div>
            <div>
              <h3 className="text-white font-semibold">{content.profiles.display_name}</h3>
              <p className="text-slate-400 text-sm">
                @{content.profiles.username} · {formatDate(content.created_at)}
              </p>
            </div>
          </div>
          <button className="text-slate-400 hover:text-white transition-colors">
            <MoreHorizontal size={20} />
          </button>
        </div>

        {content.title && (
          <h2 className="text-xl font-bold text-white mb-2">{content.title}</h2>
        )}

        {content.text_content && (
          <p className="text-white text-lg leading-relaxed mb-4">{content.text_content}</p>
        )}

        {content.description && (
          <p className="text-slate-300 mb-4">{content.description}</p>
        )}

        {content.media_url && content.media_type === 'image' && (
          <img
            src={content.media_url}
            alt={content.title || 'Content'}
            className="w-full rounded-lg mb-4"
          />
        )}

        {content.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {content.tags.map((tag) => (
              <span
                key={tag}
                className="px-2 py-1 bg-slate-800 text-slate-300 text-xs rounded-full"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        <div className="flex items-center gap-6 pt-4 border-t border-slate-800">
          <div className="relative">
            <button
              onClick={() => setShowReactions(!showReactions)}
              className="flex items-center gap-2 text-slate-400 hover:text-cyan-400 transition-colors group"
            >
              {selectedReaction ? (
                <>
                  {reactionTypes.find((r) => r.type === selectedReaction)?.icon && (
                    <span className={reactionTypes.find((r) => r.type === selectedReaction)?.color}>
                      {reactionTypes
                        .find((r) => r.type === selectedReaction)
                        ?.icon({ size: 20 })}
                    </span>
                  )}
                </>
              ) : (
                <Smile size={20} />
              )}
              <span className="font-medium">{reactionCount}</span>
            </button>

            {showReactions && (
              <div className="absolute bottom-full left-0 mb-2 bg-slate-800 border border-slate-700 rounded-lg p-2 flex gap-2 shadow-xl">
                {reactionTypes.map((reaction) => (
                  <button
                    key={reaction.type}
                    onClick={() => handleReaction(reaction.type)}
                    className={`p-2 hover:bg-slate-700 rounded-lg transition-colors ${
                      selectedReaction === reaction.type ? reaction.color : 'text-slate-400'
                    }`}
                    title={reaction.label}
                  >
                    <reaction.icon size={20} />
                  </button>
                ))}
              </div>
            )}
          </div>

          <button className="flex items-center gap-2 text-slate-400 hover:text-blue-400 transition-colors">
            <MessageCircle size={20} />
            <span className="font-medium">0</span>
          </button>

          <button className="flex items-center gap-2 text-slate-400 hover:text-green-400 transition-colors">
            <Share2 size={20} />
          </button>
        </div>
      </div>
    </div>
  );
}
