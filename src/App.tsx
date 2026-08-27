import React, { useState, useEffect, createContext, useContext } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { HomePage } from './app/routes/home';
import { VisualizerPage } from './app/routes/visualizer.$id';
import { ProjectsPage } from './app/routes/projects';
import { CommunityFeed } from './components/CommunityFeed';
import { AuthState, AuthContextType } from './types';
import { checkPuterAuth, signInWithPuter, signOutPuter } from './lib/puter.action';
import { Box, Sparkles, Layers, ArrowRight } from 'lucide-react';

export const AuthContext = createContext<AuthContextType>({
  isSignedIn: false,
  userName: null,
  userId: null,
  refreshAuth: async () => false,
  signIn: async () => false,
  signOut: async () => false,
});

export const useAuth = () => useContext(AuthContext);

function AppContent() {
  const [auth, setAuth] = useState<AuthState>({
    isSignedIn: false,
    userName: null,
    userId: null,
  });

  const refreshAuth = async (): Promise<boolean> => {
    const res = await checkPuterAuth();
    setAuth(res);
    return res.isSignedIn;
  };

  const handleSignIn = async (): Promise<boolean> => {
    const res = await signInWithPuter();
    setAuth(res);
    return res.isSignedIn;
  };

  const handleSignOut = async (): Promise<boolean> => {
    await signOutPuter();
    setAuth({
      isSignedIn: false,
      userName: null,
      userId: null,
    });
    return true;
  };

  useEffect(() => {
    refreshAuth();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        isSignedIn: auth.isSignedIn,
        userName: auth.userName,
        userId: auth.userId,
        refreshAuth,
        signIn: handleSignIn,
        signOut: handleSignOut,
      }}
    >
      <div className="min-h-screen bg-white text-[#0d253d] flex flex-col selection:bg-[#533afd] selection:text-white font-sans antialiased">
        {/* Navigation Bar */}
        <Navbar
          auth={auth}
          onSignIn={handleSignIn}
          onSignOut={handleSignOut}
        />

        {/* Dynamic Route Pages */}
        <main className="flex-1 flex flex-col">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/visualizer/:id" element={<VisualizerPage />} />
            <Route path="/projects" element={<ProjectsPage />} />
            <Route path="/community" element={<CommunityFeed />} />
          </Routes>
        </main>

        {/* Global Stripe Architectural SaaS Footer */}
        <footer className="w-full border-t border-[#e3e8ee] bg-[#f6f9fc] py-10 px-4 sm:px-6 mt-16">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 text-xs text-[#64748d]">
            <div className="flex items-center gap-3">
              <div className="w-7 h-7 rounded-lg bg-[#533afd] flex items-center justify-center text-white shadow-sm">
                <Box className="w-4 h-4" />
              </div>
              <span className="font-semibold text-[#0d253d] text-sm tracking-tight">
                Perspective<span className="text-[#533afd]">.ai</span>
              </span>
              <span className="hidden sm:inline text-[#64748d]">
                Architectural Spatial Synthesis Engine
              </span>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-6">
              <span className="flex items-center gap-1.5 text-[#273951]">
                <Sparkles className="w-3.5 h-3.5 text-[#533afd]" />
                Gemini 2.5 Neural Daylighting + Three.js 3D Mesh
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-white border border-[#e3e8ee] text-[#0d253d] font-mono tnum text-[11px] shadow-sm">
                v2.4.0
              </span>
            </div>
          </div>
        </footer>
      </div>
    </AuthContext.Provider>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

