import React, { useState } from 'react';
import { MainCategory, UserState } from '../types';
import { Sparkles, Search, Bookmark, LogIn, LogOut, Menu, X, Compass, Moon, ShieldCheck } from 'lucide-react';
import { InstallPWAButton } from './InstallPWAButton';

interface HeaderProps {
  activeCategory: MainCategory;
  setActiveCategory: (cat: MainCategory) => void;
  savedCount: number;
  userState: UserState;
  onOpenLogin: () => void;
  onLogout: () => void;
  onOpenWizard: () => void;
  onOpenAdminDashboard: () => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeCategory,
  setActiveCategory,
  savedCount,
  userState,
  onOpenLogin,
  onLogout,
  onOpenWizard,
  onOpenAdminDashboard,
  searchQuery,
  setSearchQuery,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems: { id: MainCategory; label: string; icon: string }[] = [
    { id: 'all', label: 'All Resources', icon: '✨' },
    { id: 'video', label: 'AI Video', icon: '🎬' },
    { id: 'image', label: 'AI Image', icon: '🖼' },
    { id: 'islamic', label: 'Islamic Resources', icon: '🕌' },
    { id: 'writing', label: 'AI Writing', icon: '✍️' },
    { id: 'prompts', label: 'Prompt Library', icon: '💡' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-[#0A0A0A]/90 backdrop-blur-md border-b border-[#FFD700]/25 shadow-2xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo */}
          <div 
            className="flex items-center space-x-3 cursor-pointer group"
            onClick={() => setActiveCategory('all')}
          >
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-[#FFD700] via-yellow-300 to-[#10B981] p-0.5 shadow-[0_0_20px_rgba(255,215,0,0.35)] transition-transform duration-300 group-hover:scale-105">
              <div className="w-full h-full bg-[#0A0A0A] rounded-[10px] flex items-center justify-center">
                <div className="relative flex items-center justify-center">
                  <Moon className="w-6 h-6 text-[#FFD700] fill-[#FFD700]/20" />
                  <Sparkles className="w-3 h-3 text-yellow-200 absolute -top-1 -right-1 animate-pulse" />
                </div>
              </div>
            </div>
            <div>
              <div className="flex items-center space-x-1">
                <span className="text-2xl font-bold tracking-tight text-white font-serif">IS</span>
                <span className="text-2xl font-extrabold tracking-tight text-gold-gradient">AI HUB</span>
              </div>
              <p className="text-[10px] text-yellow-300/80 font-medium tracking-wider uppercase">Free AI & Islamic Directory</p>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center space-x-1 bg-[#111827]/90 p-1.5 rounded-full border border-[#0B6E4F]/70 shadow-inner">
            {navItems.map((item) => {
              const isActive = activeCategory === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveCategory(item.id)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 flex items-center space-x-2 ${
                    isActive
                      ? 'bg-gradient-to-r from-[#FFD700] to-yellow-400 text-slate-950 font-bold shadow-lg shadow-[#FFD700]/25 scale-[1.02]'
                      : 'text-emerald-100/90 hover:text-white hover:bg-[#0B6E4F]/40'
                  }`}
                >
                  <span>{item.icon}</span>
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Right Action Buttons */}
          <div className="hidden md:flex items-center space-x-3">
            {/* Install App Button (only renders when the browser reports the app is installable) */}
            <InstallPWAButton variant="desktop" />

            {/* AI Tool Wizard Button */}
            <button
              onClick={onOpenWizard}
              className="px-3.5 py-2 rounded-xl bg-[#0B6E4F]/40 border border-[#FFD700]/30 text-yellow-300 text-xs font-semibold hover:border-[#FFD700] hover:bg-[#0B6E4F]/70 transition-all flex items-center space-x-1.5 shadow-sm hover:shadow-[0_0_15px_rgba(255,215,0,0.2)]"
              title="Find the right tool for your needs"
            >
              <Compass className="w-4 h-4 text-[#FFD700]" />
              <span>Tool Finder</span>
            </button>

            {/* Saved Items Button */}
            <button
              onClick={() => setActiveCategory('saved')}
              className={`relative p-2.5 rounded-xl border transition-all flex items-center justify-center ${
                activeCategory === 'saved'
                  ? 'bg-[#FFD700] border-yellow-300 text-slate-950 shadow-[0_0_20px_rgba(255,215,0,0.4)]'
                  : 'bg-[#111827] border-[#0B6E4F] text-yellow-300 hover:border-[#FFD700]/50'
              }`}
              title="View Saved Items"
            >
              <Bookmark className="w-4 h-4" />
              {savedCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-[#FFD700] text-slate-950 font-bold text-[10px] w-5 h-5 rounded-full flex items-center justify-center border-2 border-[#0A0A0A]">
                  {savedCount}
                </span>
              )}
            </button>

            {/* User / Admin Login Button */}
            {userState.isLoggedIn ? (
              <div className="flex items-center space-x-2 bg-[#111827] border border-[#0B6E4F] rounded-xl p-1 pl-2.5">
                {userState.isAdmin ? (
                  <button
                    onClick={onOpenAdminDashboard}
                    className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-[#FFD700] to-yellow-400 text-slate-950 text-xs font-bold flex items-center space-x-1.5 hover:from-yellow-300 hover:to-[#FFD700] shadow-md shadow-[#FFD700]/20 transition-all"
                  >
                    <ShieldCheck className="w-4 h-4 text-slate-950" />
                    <span>👑 Admin Dashboard</span>
                  </button>
                ) : (
                  <span className="text-xs font-semibold text-yellow-300 px-1">
                    👤 {userState.username}
                  </span>
                )}
                <button
                  onClick={onLogout}
                  className="p-1.5 rounded-lg text-emerald-300 hover:text-rose-400 hover:bg-[#0B6E4F]/40 transition-colors"
                  title="Logout"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <button
                  onClick={onOpenLogin}
                  className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-[#FFD700] to-yellow-400 hover:from-yellow-300 hover:to-[#FFD700] text-slate-950 text-xs font-bold tracking-wide transition-all shadow-md shadow-[#FFD700]/20 flex items-center space-x-1.5"
                >
                  <LogIn className="w-3.5 h-3.5" />
                  <span>Login</span>
                </button>
              </div>
            )}
          </div>

          {/* Mobile Menu Toggle Button */}
          <div className="flex lg:hidden items-center space-x-2">
            <button
              onClick={() => setActiveCategory('saved')}
              className="relative p-2 rounded-lg bg-[#111827] border border-[#0B6E4F] text-yellow-300"
            >
              <Bookmark className="w-4 h-4" />
              {savedCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#FFD700] text-slate-950 text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                  {savedCount}
                </span>
              )}
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg bg-[#111827] text-emerald-200 hover:text-white border border-[#0B6E4F]"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#0A0A0A] border-b border-[#FFD700]/25 px-4 pt-3 pb-6 space-y-3">
          <div className="grid grid-cols-2 gap-2">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setActiveCategory(item.id);
                  setMobileMenuOpen(false);
                }}
                className={`px-3 py-2.5 rounded-xl text-xs font-medium flex items-center space-x-2 transition-colors ${
                  activeCategory === item.id
                    ? 'bg-[#FFD700] text-slate-950 font-bold'
                    : 'bg-[#111827] text-emerald-100 hover:bg-[#0B6E4F]/50'
                }`}
              >
                <span className="text-base">{item.icon}</span>
                <span>{item.label}</span>
              </button>
            ))}
          </div>

          <div className="pt-2 border-t border-[#0B6E4F] flex flex-wrap items-center gap-2 justify-between">
            <button
              onClick={() => {
                onOpenWizard();
                setMobileMenuOpen(false);
              }}
              className="px-3.5 py-2 rounded-xl bg-[#0B6E4F]/50 border border-[#FFD700]/40 text-yellow-300 text-xs font-semibold flex items-center space-x-1.5"
            >
              <Compass className="w-4 h-4 text-[#FFD700]" />
              <span>AI Tool Finder</span>
            </button>

            <InstallPWAButton variant="mobile" />

            {userState.isLoggedIn ? (
              <button
                onClick={() => {
                  onLogout();
                  setMobileMenuOpen(false);
                }}
                className="px-3 py-2 rounded-xl bg-rose-950/60 text-rose-300 border border-rose-800/50 text-xs font-semibold flex items-center space-x-1"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Logout ({userState.username})</span>
              </button>
            ) : (
              <button
                onClick={() => {
                  onOpenLogin();
                  setMobileMenuOpen(false);
                }}
                className="px-4 py-2 rounded-xl bg-[#FFD700] text-slate-950 text-xs font-bold flex items-center space-x-1.5"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>Login</span>
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
