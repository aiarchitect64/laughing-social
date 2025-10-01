import { Home, TrendingUp, Users, Sparkles, Film, MessageCircle } from 'lucide-react';

const navigationItems = [
  { icon: Home, label: 'Home', active: true },
  { icon: TrendingUp, label: 'Trending', active: false },
  { icon: Sparkles, label: 'Rising Stars', active: false },
  { icon: Film, label: 'Sketches', active: false },
  { icon: MessageCircle, label: 'Bits', active: false },
  { icon: Users, label: 'Circles', active: false },
];

const comedyStyles = [
  'Observational',
  'Dark Humor',
  'Physical Comedy',
  'Wordplay',
  'Satire',
  'Absurdist',
  'Self-Deprecating',
  'Political',
];

export function Sidebar() {
  return (
    <aside className="hidden lg:block w-64 bg-slate-900 border-r border-slate-800 min-h-screen sticky top-16">
      <nav className="p-4 space-y-2">
        {navigationItems.map((item) => (
          <button
            key={item.label}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
              item.active
                ? 'bg-gradient-to-r from-blue-500/20 to-cyan-500/20 text-cyan-400 border border-cyan-500/30'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <item.icon size={20} />
            <span className="font-medium">{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="p-4 mt-6">
        <h3 className="text-sm font-semibold text-slate-400 uppercase mb-3">Comedy Styles</h3>
        <div className="flex flex-wrap gap-2">
          {comedyStyles.map((style) => (
            <button
              key={style}
              className="px-3 py-1 text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-full transition-colors"
            >
              {style}
            </button>
          ))}
        </div>
      </div>

      <div className="p-4 mt-6">
        <div className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border border-blue-500/30 rounded-xl p-4">
          <h3 className="text-white font-semibold mb-2">Open Mic Night</h3>
          <p className="text-slate-400 text-sm mb-3">Join tonight's live comedy session</p>
          <button className="w-full py-2 bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-medium rounded-lg hover:from-blue-600 hover:to-cyan-600 transition-all">
            Join Live
          </button>
        </div>
      </div>
    </aside>
  );
}
