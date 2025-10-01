import { useState } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { ContentFeed } from './components/ContentFeed';
import { AuthModal } from './components/AuthModal';
import { ProfileSetup } from './components/ProfileSetup';
import { CreateContentModal } from './components/CreateContentModal';

function AppContent() {
  const { user, loading } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showProfileSetup, setShowProfileSetup] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [feedKey, setFeedKey] = useState(0);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-400">Loading LaughLink...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950">
      <Header
        onAuthClick={() => setShowAuthModal(true)}
        onCreateClick={() => {
          if (user) {
            setShowCreateModal(true);
          } else {
            setShowAuthModal(true);
          }
        }}
      />

      <div className="flex">
        <Sidebar />

        <main className="flex-1 p-6 max-w-4xl mx-auto">
          {!user ? (
            <div className="bg-gradient-to-br from-slate-900 to-slate-800 border border-slate-700 rounded-2xl p-12 text-center mb-6">
              <h2 className="text-4xl font-bold text-white mb-4">Welcome to Humor Hub</h2>
              <p className="text-slate-300 text-lg mb-6">
                Where Comedy Connects - Join the funniest community on the internet
              </p>
              <button
                onClick={() => setShowAuthModal(true)}
                className="px-8 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white font-semibold rounded-full transition-all"
              >
                Get Started
              </button>
            </div>
          ) : (
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-white mb-2">Your Feed</h2>
              <p className="text-slate-400">Discover the latest comedy from creators you follow</p>
            </div>
          )}

          <ContentFeed key={feedKey} />
        </main>
      </div>

      <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />
      <ProfileSetup isOpen={showProfileSetup} onClose={() => setShowProfileSetup(false)} />
      <CreateContentModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSuccess={() => setFeedKey((prev) => prev + 1)}
      />
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
