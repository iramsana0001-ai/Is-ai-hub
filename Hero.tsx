import React from 'react';
import { Search, Sparkles, Video, Image as ImageIcon, PenTool, BookOpen, Moon, X, ArrowRight } from 'lucide-react';
import { MainCategory } from '../types';

interface HeroProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  activeCategory: MainCategory;
  setActiveCategory: (cat: MainCategory) => void;
  onOpenWizard: () => void;
  onAskAI: (query: string) => void;
}

export const Hero: React.FC<HeroProps> = ({
  searchQuery,
  setSearchQuery,
  activeCategory,
  setActiveCategory,
  onOpenWizard,
  onAskAI,
}) => {
  return (
    <div className="relative overflow-hidden bg-radial-dark border-b border-[#FFD700]/20 pt-10 pb-12 sm:pt-16 sm:pb-20">
      
      {/* Background Decorative Ambient Glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[320px] bg-[#FFD700]/10 blur-[130px] rounded-full pointer-events-none" />
      <div className="absolute -top-10 left-10 w-80 h-80 bg-[#10B981]/15 blur-[110px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 right-10 w-96 h-96 bg-[#0B6E4F]/30 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
        
        {/* Top Badge */}
        <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-[#111827]/90 border border-[#FFD700]/40 text-yellow-300 text-xs font-semibold tracking-wide shadow-[0_0_15px_rgba(255,215,0,0.15)] mb-6 animate-fade-in">
          <Moon className="w-3.5 h-3.5 text-[#FFD700] fill-[#FFD700]/20" />
          <span>✨ IS AI Hub • Premium Free Directory</span>
        </div>

        {/* Hero Main Heading */}
        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-tight mb-4 font-serif">
          Discover <span className="text-gold-gradient drop-shadow-md">Free AI Tools</span> in One Place
        </h1>

        {/* Subtitle */}
        <p className="max-w-2xl mx-auto text-sm sm:text-base text-emerald-100/90 font-normal leading-relaxed mb-8">
          Explore powerful video generators, image creators, writing assistants, and authentic Islamic digital resources — curated for beginners and non-technical users.
        </p>

        {/* Search Bar */}
        <div className="max-w-2xl mx-auto mb-10">
          <div className="relative flex items-center bg-[#111827] border-2 border-[#FFD700]/50 rounded-2xl p-1.5 shadow-[0_0_30px_rgba(255,215,0,0.2)] hover:border-[#FFD700] transition-all group">
            <Search className="w-5 h-5 text-[#FFD700] ml-3.5 shrink-0" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') onAskAI(searchQuery);
              }}
              placeholder="Search AI Tools (e.g., Veo, ChatGPT, Ideogram, Books)..."
              className="w-full bg-transparent px-3 py-2.5 text-sm sm:text-base text-white placeholder-emerald-300/50 focus:outline-none"
            />
            {searchQuery ? (
              <button
                onClick={() => setSearchQuery('')}
                className="p-1.5 text-emerald-300 hover:text-white mr-1"
                title="Clear Search"
              >
                <X className="w-4 h-4" />
              </button>
            ) : null}
            <button
              onClick={() => onAskAI(searchQuery)}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#FFD700] to-yellow-400 text-slate-950 font-bold text-xs sm:text-sm shadow-md shadow-[#FFD700]/25 hover:from-yellow-200 hover:to-[#FFD700] transition-all shrink-0 hidden sm:block"
            >
              Search
            </button>
          </div>
        </div>

        {/* Quick Category Jump Buttons */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-3xl mx-auto">
          
          <button
            onClick={() => setActiveCategory('video')}
            className={`p-3.5 rounded-2xl border transition-all duration-200 flex flex-col items-center justify-center group ${
              activeCategory === 'video'
                ? 'bg-[#FFD700]/20 border-[#FFD700] shadow-[0_0_25px_rgba(255,215,0,0.3)]'
                : 'bg-[#111827]/90 border-[#0B6E4F]/80 hover:border-[#FFD700]/60 hover:bg-[#0B6E4F]/30'
            }`}
          >
            <div className="w-10 h-10 rounded-xl bg-[#FFD700]/10 border border-[#FFD700]/40 flex items-center justify-center text-yellow-300 mb-2 group-hover:scale-110 transition-transform">
              <Video className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold text-white tracking-wide">AI Video Tools</span>
            <span className="text-[10px] text-yellow-200/70 mt-0.5">Veo, Runway, Pika...</span>
          </button>

          <button
            onClick={() => setActiveCategory('image')}
            className={`p-3.5 rounded-2xl border transition-all duration-200 flex flex-col items-center justify-center group ${
              activeCategory === 'image'
                ? 'bg-[#FFD700]/20 border-[#FFD700] shadow-[0_0_25px_rgba(255,215,0,0.3)]'
                : 'bg-[#111827]/90 border-[#0B6E4F]/80 hover:border-[#FFD700]/60 hover:bg-[#0B6E4F]/30'
            }`}
          >
            <div className="w-10 h-10 rounded-xl bg-[#FFD700]/10 border border-[#FFD700]/40 flex items-center justify-center text-yellow-300 mb-2 group-hover:scale-110 transition-transform">
              <ImageIcon className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold text-white tracking-wide">AI Image Tools</span>
            <span className="text-[10px] text-yellow-200/70 mt-0.5">DALL-E, Gemini, Ideogram...</span>
          </button>

          <button
            onClick={() => setActiveCategory('islamic')}
            className={`p-3.5 rounded-2xl border transition-all duration-200 flex flex-col items-center justify-center group ${
              activeCategory === 'islamic'
                ? 'bg-[#FFD700]/20 border-[#FFD700] shadow-[0_0_25px_rgba(255,215,0,0.3)]'
                : 'bg-[#111827]/90 border-[#0B6E4F]/80 hover:border-[#FFD700]/60 hover:bg-[#0B6E4F]/30'
            }`}
          >
            <div className="w-10 h-10 rounded-xl bg-[#FFD700]/10 border border-[#FFD700]/40 flex items-center justify-center text-yellow-300 mb-2 group-hover:scale-110 transition-transform">
              <BookOpen className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold text-white tracking-wide">Islamic Resources</span>
            <span className="text-[10px] text-yellow-200/70 mt-0.5">Books, Quran, Duas...</span>
          </button>

          <button
            onClick={() => setActiveCategory('writing')}
            className={`p-3.5 rounded-2xl border transition-all duration-200 flex flex-col items-center justify-center group ${
              activeCategory === 'writing'
                ? 'bg-[#FFD700]/20 border-[#FFD700] shadow-[0_0_25px_rgba(255,215,0,0.3)]'
                : 'bg-[#111827]/90 border-[#0B6E4F]/80 hover:border-[#FFD700]/60 hover:bg-[#0B6E4F]/30'
            }`}
          >
            <div className="w-10 h-10 rounded-xl bg-[#FFD700]/10 border border-[#FFD700]/40 flex items-center justify-center text-yellow-300 mb-2 group-hover:scale-110 transition-transform">
              <PenTool className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold text-white tracking-wide">AI Writing Tools</span>
            <span className="text-[10px] text-yellow-200/70 mt-0.5">ChatGPT, Claude, Gemini...</span>
          </button>

        </div>

        {/* Beginner Helper Banner */}
        <div className="mt-8 pt-4 flex flex-wrap items-center justify-center gap-2 text-xs text-emerald-200/80">
          <span>Not sure where to start?</span>
          <button
            onClick={onOpenWizard}
            className="text-[#FFD700] hover:text-yellow-200 font-bold underline underline-offset-4 flex items-center space-x-1"
          >
            <span>Try our 1-Minute AI Tool Finder</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>
    </div>
  );
};
