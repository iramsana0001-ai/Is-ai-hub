import React from 'react';
import { AITool } from '../types';
import { X, ExternalLink, CheckCircle2, Sparkles, Star, Lightbulb, Copy, Check, ArrowLeft } from 'lucide-react';

interface ToolDetailModalProps {
  tool: AITool | null;
  onClose: () => void;
}

export const ToolDetailModal: React.FC<ToolDetailModalProps> = ({
  tool,
  onClose,
}) => {
  const [copiedSample, setCopiedSample] = React.useState(false);

  if (!tool) return null;

  const samplePrompt = tool.category === 'video'
    ? 'Cinematic slow-motion shot of golden sunlight filtering through trees, 4k ultra realistic, smooth motion, 60fps'
    : tool.category === 'image'
    ? 'Photorealistic portrait of a modern workspace with golden geometric decorations, natural lighting, 8k resolution'
    : 'Draft a friendly 3-paragraph introductory overview explaining artificial intelligence in simple, beginner terms.';

  const handleCopySample = () => {
    navigator.clipboard.writeText(samplePrompt);
    setCopiedSample(true);
    setTimeout(() => setCopiedSample(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-[#111827] border border-[#FFD700]/40 rounded-3xl p-6 sm:p-8 max-w-xl w-full relative shadow-2xl max-h-[90vh] overflow-y-auto">
        
        {/* Back Arrow & Close */}
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={onClose}
            className="px-3 py-1.5 rounded-xl bg-[#0A0A0A] border border-[#0B6E4F] text-emerald-200 hover:text-white text-xs font-semibold flex items-center space-x-1.5 transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>← Back</span>
          </button>
          <button
            onClick={onClose}
            className="p-2 text-emerald-300 hover:text-white"
            title="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tool Title & Header */}
        <div className="flex items-center space-x-4 mb-6">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#FFD700] via-yellow-400 to-[#0B6E4F] p-0.5 shadow-lg shrink-0">
            <div className="w-full h-full bg-[#0A0A0A] rounded-[14px] flex items-center justify-center font-bold text-[#FFD700] text-2xl">
              {tool.name.charAt(0)}
            </div>
          </div>
          <div>
            <h3 className="text-xl font-bold text-white font-serif">{tool.name}</h3>
            <span className="inline-block text-xs font-semibold px-2.5 py-0.5 rounded-full bg-[#0A0A0A] text-yellow-300 border border-[#FFD700]/40 mt-1">
              {tool.pricing} ({tool.pricingDetail || 'Generous tier'})
            </span>
          </div>
        </div>

        {/* Long / Short Description */}
        <div className="space-y-4 mb-6">
          <p className="text-xs sm:text-sm text-emerald-100/90 leading-relaxed bg-[#0A0A0A] p-4 rounded-2xl border border-[#0B6E4F]">
            {tool.longDescription || tool.shortDescription}
          </p>

          {/* Key Capabilities */}
          <div>
            <h4 className="text-xs font-bold text-yellow-300 uppercase tracking-wider mb-2">Key Features</h4>
            <div className="grid grid-cols-2 gap-2">
              {tool.features.map((feat, idx) => (
                <div key={idx} className="flex items-center space-x-2 bg-[#0A0A0A] p-2 rounded-xl border border-[#0B6E4F] text-xs text-emerald-100">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#FFD700] shrink-0" />
                  <span>{feat}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Recommended Beginner Prompt */}
          <div className="bg-[#0A0A0A] p-4 rounded-2xl border border-[#FFD700]/30 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#FFD700] flex items-center space-x-1">
                <Lightbulb className="w-3.5 h-3.5" />
                <span>Beginner Sample Prompt</span>
              </span>
              <button
                onClick={handleCopySample}
                className="text-[11px] font-bold text-yellow-300 hover:text-white flex items-center space-x-1"
              >
                {copiedSample ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedSample ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
            <p className="text-xs text-emerald-200 font-mono italic">"{samplePrompt}"</p>
          </div>
        </div>

        {/* Action Button */}
        <div className="pt-2 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-3 rounded-xl bg-[#0A0A0A] text-emerald-200 text-xs font-semibold border border-[#0B6E4F]"
          >
            Close
          </button>
          <a
            href={tool.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 py-3 rounded-xl bg-gradient-to-r from-[#FFD700] to-yellow-400 hover:from-yellow-200 hover:to-[#FFD700] text-slate-950 font-bold text-xs text-center flex items-center justify-center space-x-2 shadow-md shadow-[#FFD700]/20"
          >
            <span>Open Tool Official Site</span>
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>

      </div>
    </div>
  );
};
