import React from 'react';
import { AITool } from '../types';
import { ExternalLink, Bookmark, Sparkles, Star, CheckCircle2, Info, Edit, Trash2 } from 'lucide-react';

interface ToolCardProps {
  tool: AITool;
  isSaved: boolean;
  onToggleSave: (id: string) => void;
  onSelectTool: (tool: AITool) => void;
  onEdit?: (tool: AITool) => void;
  onDelete?: (id: string) => void;
  isAdmin?: boolean;
}

export const ToolCard: React.FC<ToolCardProps> = ({
  tool,
  isSaved,
  onToggleSave,
  onSelectTool,
  onEdit,
  onDelete,
  isAdmin = false,
}) => {
  // Determine pricing badge color
  const getPricingStyle = (pricing: string) => {
    switch (pricing) {
      case 'Free Plan':
        return 'bg-[#0B6E4F]/40 text-emerald-300 border-[#10B981]/50';
      case 'Free Credits':
        return 'bg-[#FFD700]/15 text-yellow-300 border-[#FFD700]/50';
      case 'Free Trial':
        return 'bg-[#111827] text-yellow-200 border-[#FFD700]/40';
      default:
        return 'bg-[#111827] text-slate-300 border-slate-700';
    }
  };

  // Get stylized icon gradient based on tool category
  const getIconGradient = (category: string) => {
    switch (category) {
      case 'video':
        return 'from-[#FFD700] via-yellow-300 to-[#0B6E4F]';
      case 'image':
        return 'from-[#10B981] via-[#0B6E4F] to-[#FFD700]';
      case 'writing':
        return 'from-yellow-300 via-[#10B981] to-[#0B6E4F]';
      default:
        return 'from-[#FFD700] to-[#10B981]';
    }
  };

  return (
    <div className="group relative bg-[#111827]/95 rounded-2xl border border-[#0B6E4F] hover:border-[#FFD700] p-5 shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_0_25px_rgba(255,215,0,0.25)] flex flex-col justify-between">
      
      {/* Featured Star Badge */}
      {tool.isFeatured && (
        <div className="absolute -top-3 left-4 bg-gradient-to-r from-[#FFD700] to-yellow-400 text-slate-950 font-bold text-[10px] px-2.5 py-0.5 rounded-full shadow-md border border-yellow-200 flex items-center space-x-1 z-10">
          <Star className="w-3 h-3 fill-current text-slate-950" />
          <span>Featured Tool</span>
        </div>
      )}

      {/* Card Header Top */}
      <div>
        <div className="flex items-start justify-between mb-3.5 pt-1">
          
          {/* Logo / Badge Icon */}
          <div className="flex items-center space-x-3">
            <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${getIconGradient(tool.category)} p-0.5 shadow-md shrink-0`}>
              <div className="w-full h-full bg-[#0A0A0A] rounded-[10px] flex items-center justify-center font-bold text-[#FFD700] text-lg overflow-hidden">
                {tool.logoUrl ? (
                  <img src={tool.logoUrl} alt={tool.name} className="w-full h-full object-cover" />
                ) : (
                  tool.name.charAt(0)
                )}
              </div>
            </div>
            <div>
              <h3 className="text-base font-bold text-white group-hover:text-yellow-300 transition-colors line-clamp-1">
                {tool.name}
              </h3>
              <span className={`inline-block text-[10px] font-semibold px-2 py-0.5 rounded-full border mt-1 ${getPricingStyle(tool.pricing)}`}>
                {tool.pricing}
              </span>
            </div>
          </div>

          {/* Bookmark Button */}
          <button
            onClick={() => onToggleSave(tool.id)}
            className={`p-2 rounded-xl border transition-colors shrink-0 ${
              isSaved
                ? 'bg-[#FFD700] border-yellow-300 text-slate-950 shadow-[0_0_15px_rgba(255,215,0,0.3)]'
                : 'bg-[#0A0A0A] border-[#0B6E4F] text-emerald-300 hover:text-yellow-300 hover:border-[#FFD700]/50'
            }`}
            title={isSaved ? 'Remove from Saved' : 'Save Tool'}
          >
            <Bookmark className="w-4 h-4 fill-current" />
          </button>
        </div>

        {/* Short Description */}
        <p className="text-xs text-emerald-100/90 leading-relaxed mb-4 line-clamp-2 min-h-[36px]">
          {tool.shortDescription}
        </p>

        {/* Feature Pills */}
        <div className="flex flex-wrap gap-1.5 mb-5">
          {tool.features.slice(0, 3).map((feat, idx) => (
            <span
              key={idx}
              className="inline-flex items-center space-x-1 text-[10px] font-medium px-2 py-0.5 rounded-md bg-[#0B6E4F]/30 text-emerald-200 border border-[#0B6E4F]/70"
            >
              <CheckCircle2 className="w-2.5 h-2.5 text-[#FFD700] shrink-0" />
              <span>{feat}</span>
            </span>
          ))}
        </div>
      </div>

      {/* Card Footer Actions */}
      <div className="pt-3 border-t border-[#0B6E4F]/60 flex items-center justify-between gap-2">
        <div className="flex items-center space-x-1">
          <button
            onClick={() => onSelectTool(tool)}
            className="text-xs font-semibold text-emerald-300 hover:text-yellow-300 flex items-center space-x-1 py-1 px-2 rounded-lg hover:bg-[#0B6E4F]/30 transition-colors"
          >
            <Info className="w-3.5 h-3.5" />
            <span>Details</span>
          </button>

          {/* Direct Admin Edit & Delete Actions */}
          {isAdmin && onEdit && (
            <button
              onClick={() => onEdit(tool)}
              className="p-1.5 rounded-lg bg-[#0A0A0A] hover:bg-[#111827] text-yellow-300 border border-[#0B6E4F] hover:border-[#FFD700] transition-colors"
              title="Edit AI Tool"
            >
              <Edit className="w-3.5 h-3.5" />
            </button>
          )}
          {isAdmin && onDelete && (
            <button
              onClick={() => {
                if (confirm(`Are you sure you want to delete "${tool.name}"?`)) {
                  onDelete(tool.id);
                }
              }}
              className="p-1.5 rounded-lg bg-rose-950/60 hover:bg-rose-900 text-rose-300 border border-rose-800 transition-colors"
              title="Delete AI Tool"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* "Use Now" Primary Button */}
        <a
          href={tool.url}
          target="_blank"
          rel="noopener noreferrer"
          className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#FFD700] to-yellow-400 hover:from-yellow-200 hover:to-[#FFD700] text-slate-950 text-xs font-bold transition-all shadow-md shadow-[#FFD700]/20 flex items-center space-x-1.5 hover:shadow-[#FFD700]/30 shrink-0"
        >
          <span>Use Now</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </div>

    </div>
  );
};
