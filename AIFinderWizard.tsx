import React, { useState } from 'react';
import { AITool, ToolCategory } from '../types';
import { Compass, Sparkles, X, Check, ArrowRight, RefreshCw, ExternalLink } from 'lucide-react';

interface AIFinderWizardProps {
  isOpen: boolean;
  onClose: () => void;
  tools: AITool[];
  onSelectCategory: (cat: any) => void;
}

export const AIFinderWizard: React.FC<AIFinderWizardProps> = ({
  isOpen,
  onClose,
  tools,
  onSelectCategory,
}) => {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [selectedGoal, setSelectedGoal] = useState<ToolCategory | 'islamic' | null>(null);
  const [selectedPricing, setSelectedPricing] = useState<'free' | 'credits' | 'any'>('any');

  if (!isOpen) return null;

  const handleGoalSelect = (goal: ToolCategory | 'islamic') => {
    setSelectedGoal(goal);
    setStep(2);
  };

  const handlePricingSelect = (pricing: 'free' | 'credits' | 'any') => {
    setSelectedPricing(pricing);
    setStep(3);
  };

  const resetWizard = () => {
    setStep(1);
    setSelectedGoal(null);
    setSelectedPricing('any');
  };

  // Filter recommendations based on user picks
  const recommendations = tools.filter((tool) => {
    if (selectedGoal && selectedGoal !== 'islamic' && tool.category !== selectedGoal) return false;
    if (selectedPricing === 'free' && tool.pricing !== 'Free Plan') return false;
    if (selectedPricing === 'credits' && tool.pricing !== 'Free Credits') return false;
    return true;
  });

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-[#0A0A0A] border border-[#FFD700]/50 rounded-3xl p-6 sm:p-8 max-w-lg w-full relative shadow-2xl shadow-[#10B981]/10 overflow-hidden">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-emerald-300 hover:text-white"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Wizard Header */}
        <div className="flex items-center space-x-2.5 mb-6">
          <div className="p-2 bg-[#111827] border border-[#0B6E4F] rounded-xl text-[#FFD700]">
            <Compass className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white font-serif">1-Minute AI Tool Finder</h3>
            <p className="text-xs text-yellow-300">Answer 2 simple questions to find your tool</p>
          </div>
        </div>

        {/* STEP 1: Goal Selection */}
        {step === 1 && (
          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-emerald-100">Step 1: What do you want to create or find today?</h4>
            <div className="grid grid-cols-1 gap-2.5">
              
              <button
                onClick={() => handleGoalSelect('video')}
                className="p-3.5 rounded-xl bg-[#111827] border border-[#0B6E4F] hover:border-[#FFD700] text-left transition-all flex items-center justify-between group"
              >
                <div>
                  <span className="text-sm font-bold text-white block">🎬 AI Video Clips & Motion</span>
                  <span className="text-xs text-emerald-300/70">Text-to-video, cinematic scenes, animations</span>
                </div>
                <ArrowRight className="w-4 h-4 text-[#FFD700] group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                onClick={() => handleGoalSelect('image')}
                className="p-3.5 rounded-xl bg-[#111827] border border-[#0B6E4F] hover:border-[#FFD700] text-left transition-all flex items-center justify-between group"
              >
                <div>
                  <span className="text-sm font-bold text-white block">🖼 AI Images, Logos & Artwork</span>
                  <span className="text-xs text-emerald-300/70">Photorealistic photos, graphics, typography</span>
                </div>
                <ArrowRight className="w-4 h-4 text-[#FFD700] group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                onClick={() => handleGoalSelect('writing')}
                className="p-3.5 rounded-xl bg-[#111827] border border-[#0B6E4F] hover:border-[#FFD700] text-left transition-all flex items-center justify-between group"
              >
                <div>
                  <span className="text-sm font-bold text-white block">✍️ AI Writing, Articles & Essays</span>
                  <span className="text-xs text-emerald-300/70">Draft emails, essays, summaries, copy</span>
                </div>
                <ArrowRight className="w-4 h-4 text-[#FFD700] group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                onClick={() => {
                  onSelectCategory('islamic');
                  onClose();
                }}
                className="p-3.5 rounded-xl bg-[#111827] border border-[#0B6E4F] hover:border-[#FFD700] text-left transition-all flex items-center justify-between group"
              >
                <div>
                  <span className="text-sm font-bold text-white block">🕌 Islamic Books, Quran & Duas</span>
                  <span className="text-xs text-emerald-300/70">Free PDF ebooks, Azkar & Quranic tools</span>
                </div>
                <ArrowRight className="w-4 h-4 text-[#FFD700] group-hover:translate-x-1 transition-transform" />
              </button>

            </div>
          </div>
        )}

        {/* STEP 2: Pricing Model */}
        {step === 2 && (
          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-emerald-100">Step 2: What pricing preference do you have?</h4>
            <div className="grid grid-cols-1 gap-2.5">
              
              <button
                onClick={() => handlePricingSelect('free')}
                className="p-3.5 rounded-xl bg-[#111827] border border-[#0B6E4F] hover:border-[#FFD700] text-left transition-all flex items-center justify-between group"
              >
                <div>
                  <span className="text-sm font-bold text-emerald-300 block">🎁 100% Free Always</span>
                  <span className="text-xs text-emerald-300/70">Tools with full free plans and no cost</span>
                </div>
                <Check className="w-4 h-4 text-[#FFD700]" />
              </button>

              <button
                onClick={() => handlePricingSelect('credits')}
                className="p-3.5 rounded-xl bg-[#111827] border border-[#0B6E4F] hover:border-[#FFD700] text-left transition-all flex items-center justify-between group"
              >
                <div>
                  <span className="text-sm font-bold text-yellow-300 block">🪙 Daily Free Credits</span>
                  <span className="text-xs text-emerald-300/70">Generous recurring free generations</span>
                </div>
                <Check className="w-4 h-4 text-[#FFD700]" />
              </button>

              <button
                onClick={() => handlePricingSelect('any')}
                className="p-3.5 rounded-xl bg-[#111827] border border-[#0B6E4F] hover:border-[#FFD700] text-left transition-all flex items-center justify-between group"
              >
                <div>
                  <span className="text-sm font-bold text-white block">⚡ Any Pricing / Show Best Results</span>
                  <span className="text-xs text-emerald-300/70">Show all top-rated tools</span>
                </div>
                <Check className="w-4 h-4 text-[#FFD700]" />
              </button>

            </div>
            <button
              onClick={() => setStep(1)}
              className="text-xs text-emerald-300 underline pt-2 block cursor-pointer"
            >
              ← Back to Question 1
            </button>
          </div>
        )}

        {/* STEP 3: Results */}
        {step === 3 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-bold text-yellow-300">🎉 Top Recommended Tools ({recommendations.length})</h4>
              <button
                onClick={resetWizard}
                className="text-xs text-emerald-300 flex items-center space-x-1 hover:text-white cursor-pointer"
              >
                <RefreshCw className="w-3 h-3" />
                <span>Start Over</span>
              </button>
            </div>

            <div className="max-h-[300px] overflow-y-auto space-y-2.5 pr-1">
              {recommendations.length > 0 ? (
                recommendations.map((rec) => (
                  <div
                    key={rec.id}
                    className="p-3.5 rounded-xl bg-[#111827] border border-[#0B6E4F] flex items-center justify-between gap-3"
                  >
                    <div>
                      <h5 className="text-sm font-bold text-white">{rec.name}</h5>
                      <p className="text-xs text-emerald-200/70 line-clamp-1">{rec.shortDescription}</p>
                      <span className="text-[10px] text-yellow-300 bg-[#0A0A0A] px-2 py-0.5 rounded border border-[#0B6E4F] mt-1 inline-block">
                        {rec.pricing}
                      </span>
                    </div>
                    <a
                      href={rec.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-[#FFD700] to-yellow-400 hover:from-yellow-200 hover:to-[#FFD700] text-slate-950 font-bold text-xs shrink-0 flex items-center space-x-1 shadow transition-all"
                    >
                      <span>Use</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                ))
              ) : (
                <div className="text-center py-6 text-emerald-300 text-xs">
                  No exact match found. Try selecting "Any Pricing" for more options!
                </div>
              )}
            </div>

            <div className="pt-2 text-right">
              <button
                onClick={onClose}
                className="px-5 py-2 rounded-xl bg-gradient-to-r from-[#FFD700] to-yellow-400 text-slate-950 font-bold text-xs hover:from-yellow-200 hover:to-[#FFD700] transition-all cursor-pointer"
              >
                Done
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
