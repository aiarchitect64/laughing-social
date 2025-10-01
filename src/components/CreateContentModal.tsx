import { useState } from 'react';
import { X, Type, Image, Video, Mic } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

interface CreateContentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const contentTypes = [
  { value: 'bit', label: 'Bit', icon: Type, description: 'Short joke or one-liner' },
  { value: 'meme', label: 'Meme', icon: Image, description: 'Image-based humor' },
  { value: 'sketch', label: 'Sketch', icon: Video, description: 'Video comedy' },
  { value: 'roast', label: 'Roast', icon: Mic, description: 'Friendly roast' },
];

const comedyStyleTags = [
  'Observational',
  'Dark Humor',
  'Physical Comedy',
  'Wordplay',
  'Satire',
  'Absurdist',
  'Self-Deprecating',
  'Political',
];

export function CreateContentModal({ isOpen, onClose, onSuccess }: CreateContentModalProps) {
  const { user } = useAuth();
  const [contentType, setContentType] = useState<'bit' | 'meme' | 'sketch' | 'roast'>('bit');
  const [title, setTitle] = useState('');
  const [textContent, setTextContent] = useState('');
  const [description, setDescription] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [mediaUrl, setMediaUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const { error: insertError } = await supabase.from('content').insert({
        creator_id: user?.id!,
        content_type: contentType,
        title: title || null,
        description: description || null,
        text_content: textContent || null,
        media_url: mediaUrl || null,
        media_type: mediaUrl ? (contentType === 'sketch' ? 'video' : 'image') : 'none',
        tags: selectedTags,
        is_remix: false,
      });

      if (insertError) throw insertError;

      setTitle('');
      setTextContent('');
      setDescription('');
      setMediaUrl('');
      setSelectedTags([]);
      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to create content');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
      <div className="relative w-full max-w-2xl bg-slate-900 rounded-2xl shadow-2xl p-8 max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors"
        >
          <X size={24} />
        </button>

        <h2 className="text-3xl font-bold text-white mb-2">Create Comedy</h2>
        <p className="text-slate-400 mb-6">Share your humor with the world</p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-3">Content Type</label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {contentTypes.map((type) => (
                <button
                  key={type.value}
                  type="button"
                  onClick={() => setContentType(type.value as any)}
                  className={`p-4 rounded-xl border-2 transition-all ${
                    contentType === type.value
                      ? 'border-cyan-500 bg-cyan-500/10'
                      : 'border-slate-700 hover:border-slate-600'
                  }`}
                >
                  <type.icon
                    className={`mx-auto mb-2 ${
                      contentType === type.value ? 'text-cyan-400' : 'text-slate-400'
                    }`}
                    size={24}
                  />
                  <div className="text-sm font-medium text-white">{type.label}</div>
                  <div className="text-xs text-slate-400 mt-1">{type.description}</div>
                </button>
              ))}
            </div>
          </div>

          {(contentType === 'sketch' || contentType === 'meme') && (
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-colors"
                placeholder="Give your content a catchy title"
              />
            </div>
          )}

          {contentType === 'bit' || contentType === 'roast' ? (
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                {contentType === 'bit' ? 'Your Joke' : 'Your Roast'}
              </label>
              <textarea
                value={textContent}
                onChange={(e) => setTextContent(e.target.value)}
                rows={4}
                className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-colors resize-none"
                placeholder={contentType === 'bit' ? 'Write your joke here...' : 'Write your roast here...'}
                required
              />
            </div>
          ) : (
            <>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  {contentType === 'sketch' ? 'Video URL' : 'Image URL'}
                </label>
                <input
                  type="url"
                  value={mediaUrl}
                  onChange={(e) => setMediaUrl(e.target.value)}
                  className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-colors"
                  placeholder="https://..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Description
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                  className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-colors resize-none"
                  placeholder="Describe your content..."
                />
              </div>
            </>
          )}

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-3">Comedy Style Tags</label>
            <div className="flex flex-wrap gap-2">
              {comedyStyleTags.map((tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => toggleTag(tag)}
                  className={`px-3 py-1 rounded-full text-sm font-medium transition-all ${
                    selectedTags.includes(tag)
                      ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white'
                      : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>

          {error && (
            <div className="p-3 bg-red-500/10 border border-red-500 rounded-lg text-red-500 text-sm">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white font-semibold rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Publishing...' : 'Publish'}
          </button>
        </form>
      </div>
    </div>
  );
}
