import React, { useState } from 'react';
import { PromptItem, UserState } from '../types';
import { Copy, Check, Sparkles, Video, Image as ImageIcon, Briefcase, Plus, Filter } from 'lucide-react';

interface PromptLibraryProps {
  prompts: PromptItem[];
  userState: UserState;
  onOpenAddModal: () => void;
}

export const PromptLibrarySection: React.FC<PromptLibraryProps> = ({
  prompts,
  userState,
  onOpenAddModal,
}) => {
  const [activePromptCategory, setActivePromptCategory] = useState<'all' | 'video' | 'image' | 'business'>('all');
  const [copiedPromptId, setCopiedPromptId] = useState<string | null>(null);

  const handleCopy = (prompt: PromptItem) => {
    navigator.clipboard.writeText(prompt.promptText);
    setCopiedPromptId(prompt.id);
    setTimeout(() => setCopiedPromptId(null), 2000);
  };

  const filteredPrompts = activePromptCategory === 'all'
    ? prompts
    : prompts.filter(p => p.category === activePromptCategory);

  return (
    <div className="bg-[#111827] border border-[#FFD700]/30 rounded-3xl p-5 sm:p-8 shadow-2xl relative overflow-hidden my-8">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 pb-6 border-b border-[#0B6E4F]">
        <div>
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-[#0B6E4F]/40 border border-[#FFD700]/40 text-yellow-300 text-xs font-semibold mb-2">
            <Sparkles className="w-3.5 h-3.5 text-[#FFD700]" />
            <span>Tested & Verified Prompts</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white font-serif tracking-tight">
            AI <span className="text-gold-gradient">Prompt Library</span>
          </h2>
          <p className="text-xs sm:text-sm text-emerald-200/80 mt-1">
            Copy high-converting prompts for Google Veo, Runway, ChatGPT, Imagen 3, Ideogram, and business tasks.
          </p>
        </div>

        {userState.isAdmin && (
          <button
            onClick={onOpenAddModal}
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#FFD700] to-yellow-400 text-slate-950 font-bold text-xs flex items-center space-x-2 shadow-md shadow-[#FFD700]/20 hover:from-yellow-200 hover:to-[#FFD700] transition-all self-start md:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Prompt</span>
          </button>
        )}
      </div>

      {/* Category Filter Pills */}
      <div className="flex flex-wrap gap-2 mb-8 bg-[#0A0A0A] p-1.5 rounded-2xl border border-[#0B6E4F]">
        <button
          onClick={() => setActivePromptCategory('all')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center space-x-1.5 ${
            activePromptCategory === 'all'
              ? 'bg-[#FFD700] text-slate-950 shadow-sm'
              : 'text-emerald-100 hover:bg-[#0B6E4F]/40'
          }`}
        >
          <span>✨ All Prompts ({prompts.length})</span>
        </button>

        <button
          onClick={() => setActivePromptCategory('video')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center space-x-1.5 ${
            activePromptCategory === 'video'
              ? 'bg-[#FFD700] text-slate-950 shadow-sm'
              : 'text-emerald-100 hover:bg-[#0B6E4F]/40'
          }`}
        >
          <Video className="w-3.5 h-3.5" />
          <span>🎬 Video Prompts</span>
        </button>

        <button
          onClick={() => setActivePromptCategory('image')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center space-x-1.5 ${
            activePromptCategory === 'image'
              ? 'bg-[#FFD700] text-slate-950 shadow-sm'
              : 'text-emerald-100 hover:bg-[#0B6E4F]/40'
          }`}
        >
          <ImageIcon className="w-3.5 h-3.5" />
          <span>🖼 Image Prompts</span>
        </button>

        <button
          onClick={() => setActivePromptCategory('business')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center space-x-1.5 ${
            activePromptCategory === 'business'
              ? 'bg-[#FFD700] text-slate-950 shadow-sm'
              : 'text-emerald-100 hover:bg-[#0B6E4F]/40'
          }`}
        >
          <Briefcase className="w-3.5 h-3.5" />
          <span>💼 Business Prompts</span>
        </button>
      </div>

      {/* Prompts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredPrompts.map((prompt) => (
          <div
            key={prompt.id}
            className="bg-[#111827]/95 rounded-2xl border border-[#0B6E4F] hover:border-[#FFD700]/60 p-5 shadow-lg flex flex-col justify-between transition-all"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-[10px] font-bold uppercase tracking-wider text-yellow-300 bg-[#FFD700]/15 px-2.5 py-0.5 rounded-full border border-[#FFD700]/40">
                  {prompt.category}
                </span>
                <span className="text-[11px] text-emerald-300/80 font-mono">
                  Target: {prompt.targetTool}
                </span>
              </div>

              <h3 className="text-sm font-bold text-white mb-2 leading-snug">
                {prompt.title}
              </h3>

              {/* Prompt Text Container */}
              <div className="bg-[#0A0A0A] p-3.5 rounded-xl border border-[#0B6E4F]/60 text-xs text-emerald-100 font-mono leading-relaxed mb-4 relative group">
                <p className="line-clamp-4 select-all">"{prompt.promptText}"</p>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-1 mb-4">
                {prompt.tags.map((tag, idx) => (
                  <span key={idx} className="text-[10px] font-medium px-2 py-0.5 rounded bg-[#0B6E4F]/30 text-emerald-300/90 border border-[#0B6E4F]/60">
                    #{tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Action Copy Button */}
            <button
              onClick={() => handleCopy(prompt)}
              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-[#FFD700] to-yellow-400 hover:from-yellow-200 hover:to-[#FFD700] text-slate-950 font-bold text-xs flex items-center justify-center space-x-2 shadow-md shadow-[#FFD700]/20 transition-all"
            >
              {copiedPromptId === prompt.id ? (
                <>
                  <Check className="w-4 h-4 text-slate-950" />
                  <span>Prompt Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 text-slate-950" />
                  <span>Copy Prompt</span>
                </>
              )}
            </button>
          </div>
        ))}
      </div>

    </div>
  );
};
