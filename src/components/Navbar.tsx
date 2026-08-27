import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Box, Plus, LogOut, User, Sparkles } from 'lucide-react';
import { Button } from './ui/Button';
import { AuthState } from '../types';

interface NavbarProps {
  auth: AuthState;
  onSignIn: () => void;
  onSignOut: () => void;
  onNewProject?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  auth,
  onSignIn,
  onSignOut,
  onNewProject,
}) => {
  const location = useLocation();

  const isHome = location.pathname === '/';
  const isProjects = location.pathname === '/projects';
  const isCommunity = location.pathname === '/community';

  return (
    <header className="sticky top-0 z-50 w-full bg-white/90 backdrop-blur-md border-b border-[#e3e8ee] transition-all duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        {/* Left: Brand Identity */}
        <Link to="/" className="flex items-center gap-3 group select-none">
          <div className="w-8 h-8 rounded-lg bg-[#533afd] flex items-center justify-center text-white shadow-[0_1px_3px_rgba(0,55,112,0.15)] group-hover:bg-[#4434d4] transition-colors duration-200">
            <Box className="w-4 h-4 text-white" />
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="text-base font-semibold tracking-tight text-[#0d253d]">
                Perspective<span className="text-[#533afd]">.ai</span>
              </span>
              <span className="px-2 py-0.5 text-[10px] font-medium tracking-tight bg-[#f6f9fc] text-[#533afd] border border-[#e3e8ee] rounded-full">
                Spatial 3D
              </span>
            </div>
            <span className="text-[11px] text-[#64748d] font-normal hidden sm:inline leading-none">
              Floor Plan → 3D Model SaaS
            </span>
          </div>
        </Link>

        {/* Center: Navigation Links */}
        <nav className="hidden md:flex items-center gap-1 bg-[#f6f9fc] border border-[#e3e8ee] p-1 rounded-full">
          <Link
            to="/"
            className={`px-4 py-1.5 rounded-full text-xs font-normal transition-all ${
              isHome
                ? 'bg-white text-[#0d253d] shadow-[0_1px_2px_rgba(0,55,112,0.08)] font-medium'
                : 'text-[#64748d] hover:text-[#0d253d]'
            }`}
          >
            Create & Upload
          </Link>
          <Link
            to="/projects"
            className={`px-4 py-1.5 rounded-full text-xs font-normal transition-all ${
              isProjects
                ? 'bg-white text-[#0d253d] shadow-[0_1px_2px_rgba(0,55,112,0.08)] font-medium'
                : 'text-[#64748d] hover:text-[#0d253d]'
            }`}
          >
            Project History
          </Link>
          <Link
            to="/community"
            className={`px-4 py-1.5 rounded-full text-xs font-normal transition-all ${
              isCommunity
                ? 'bg-white text-[#0d253d] shadow-[0_1px_2px_rgba(0,55,112,0.08)] font-medium'
                : 'text-[#64748d] hover:text-[#0d253d]'
            }`}
          >
            Community Feed
          </Link>
        </nav>

        {/* Right: Actions & User Auth */}
        <div className="flex items-center gap-3">
          {onNewProject && (
            <Button
              size="sm"
              variant="secondary"
              onClick={onNewProject}
              leftIcon={<Plus className="w-3.5 h-3.5 text-[#533afd]" />}
              className="hidden sm:inline-flex"
            >
              New Render
            </Button>
          )}

          {auth.isSignedIn ? (
            <div className="flex items-center gap-2 pl-2 border-l border-[#e3e8ee]">
              <div className="flex items-center gap-2 bg-[#f6f9fc] border border-[#e3e8ee] px-3 py-1 rounded-full">
                <div className="w-5 h-5 rounded-full bg-[#533afd] flex items-center justify-center text-white text-[10px] font-medium">
                  {auth.userName ? auth.userName.charAt(0).toUpperCase() : 'U'}
                </div>
                <span className="text-xs font-medium text-[#0d253d] max-w-[110px] truncate hidden sm:inline">
                  {auth.userName || 'Architect'}
                </span>
              </div>
              <button
                onClick={onSignOut}
                className="p-2 text-[#64748d] hover:text-red-600 hover:bg-red-50 rounded-full transition-colors"
                title="Sign Out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <Button
              size="sm"
              variant="primary"
              onClick={onSignIn}
              leftIcon={<User className="w-3.5 h-3.5 text-white" />}
            >
              Sign In
            </Button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;

