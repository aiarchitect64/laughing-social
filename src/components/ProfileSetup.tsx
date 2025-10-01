import { useState } from 'react';
import { X } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

interface ProfileSetupProps {
  isOpen: boolean;
  onClose: () => void;
}

const comedyStyleOptions = [
  'Observational',
  'Dark Humor',
  'Physical Comedy',
  'Wordplay',
  'Satire',
  'Absurdist',
  'Self-Deprecating',
  'Political',
  'Improvisational',
  'Surreal',
];

export function ProfileSetup({ isOpen, onClose }: ProfileSetupProps) {
  const { user } = useAuth();
  const [bio, setBio] = useState('');
  const [isCreator, setIsCreator] = useState(false);
  const [selectedStyles, setSelectedStyles] = useState<string[]>([]);
  const [location, setLocation] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const toggleStyle = (style: string) => {
    setSelectedStyles((prev) =>
      prev.includes(style)
        ? prev.filter((s) => s !== style)
        : [...prev, style]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const { error: updateError } = await supabase
        .from('profiles')
        .update({
          bio,
          is_creator: isCreator,
          comedy_styles: selectedStyles,
          location: location || null,
          updated_at: new Date().toISOString(),
        })
        .eq('id', user?.id);

      if (updateError) throw updateError;

      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to update profile');
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

        <h2 className="text-3xl font-bold text-white mb-2">Complete Your Profile</h2>
        <p className="text-slate-400 mb-6">
          Tell us about your comedy style and preferences
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={isCreator}
                onChange={(e) => setIsCreator(e.target.checked)}
                className="w-5 h-5 rounded bg-slate-800 border-slate-700 text-cyan-500 focus:ring-cyan-500"
              />
              <div>
                <span className="text-white font-medium">I'm a comedy creator</span>
                <p className="text-sm text-slate-400">
                  Get access to creator tools and analytics
                </p>
              </div>
            </label>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Bio
            </label>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              rows={3}
              className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-colors resize-none"
              placeholder="Tell everyone about yourself..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Location (optional)
            </label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-colors"
              placeholder="New York, NY"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-3">
              Comedy Styles You {isCreator ? 'Create' : 'Enjoy'}
            </label>
            <div className="flex flex-wrap gap-2">
              {comedyStyleOptions.map((style) => (
                <button
                  key={style}
                  type="button"
                  onClick={() => toggleStyle(style)}
                  className={`px-4 py-2 rounded-full font-medium transition-all ${
                    selectedStyles.includes(style)
                      ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white'
                      : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  {style}
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
            {loading ? 'Saving...' : 'Complete Setup'}
          </button>
        </form>
      </div>
    </div>
  );
}
