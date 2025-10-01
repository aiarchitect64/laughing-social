import { Laugh, Search, Plus, User, LogOut } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface HeaderProps {
  onAuthClick: () => void;
  onCreateClick: () => void;
}

export function Header({ onAuthClick, onCreateClick }: HeaderProps) {
  const { user, signOut } = useAuth();

  return (
    <header className="sticky top-0 z-40 bg-slate-900/95 backdrop-blur-sm border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <Laugh className="text-cyan-400" size={32} />
              <h1 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                LaughLink
              </h1>
            </div>
            <span className="text-slate-500 text-sm hidden sm:block">Where Comedy Connects</span>
          </div>

          <div className="flex-1 max-w-md mx-8 hidden md:block">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={20} />
              <input
                type="text"
                placeholder="Search comedy, creators..."
                className="w-full pl-10 pr-4 py-2 bg-slate-800 border border-slate-700 rounded-full text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-colors"
              />
            </div>
          </div>

          <div className="flex items-center gap-3">
            {user ? (
              <>
                <button
                  onClick={onCreateClick}
                  className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white font-semibold rounded-full transition-all"
                >
                  <Plus size={20} />
                  <span className="hidden sm:inline">Create</span>
                </button>
                <button className="p-2 text-slate-400 hover:text-white transition-colors">
                  <User size={24} />
                </button>
                <button
                  onClick={() => signOut()}
                  className="p-2 text-slate-400 hover:text-red-400 transition-colors"
                >
                  <LogOut size={24} />
                </button>
              </>
            ) : (
              <button
                onClick={onAuthClick}
                className="px-6 py-2 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white font-semibold rounded-full transition-all"
              >
                Sign In
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
