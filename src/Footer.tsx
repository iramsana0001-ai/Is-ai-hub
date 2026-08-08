import React, { useState } from 'react';
import { MainCategory } from '../types';
import { Moon, Sparkles, Mail, Copy, Check, Send, Youtube, Twitter, Facebook, MessageSquare } from 'lucide-react';

interface FooterProps {
  setActiveCategory: (cat: MainCategory) => void;
  onOpenAdmin?: () => void;
  onOpenPrivacyPolicy?: () => void;
  onOpenTerms?: () => void;
}

export const Footer: React.FC<FooterProps> = ({ setActiveCategory, onOpenAdmin, onOpenPrivacyPolicy, onOpenTerms }) => {
  const [contactEmail, setContactEmail] = useState('contact@isaihub.com');
  const [isEditingEmail, setIsEditingEmail] = useState(false);
  const [newEmail, setNewEmail] = useState(contactEmail);
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [messageSent, setMessageSent] = useState(false);
  const [senderEmail, setSenderEmail] = useState('');
  const [senderMsg, setSenderMsg] = useState('');

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(contactEmail);
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(null as any), 2000);
  };

  const handleSaveEmail = (e: React.FormEvent) => {
    e.preventDefault();
    if (newEmail.trim()) {
      setContactEmail(newEmail.trim());
    }
    setIsEditingEmail(false);
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (senderMsg.trim()) {
      setMessageSent(true);
      setTimeout(() => {
        setMessageSent(false);
        setIsContactModalOpen(false);
        setSenderMsg('');
        setSenderEmail('');
      }, 2000);
    }
  };

  return (
    <footer className="bg-[#0A0A0A] border-t border-[#FFD700]/30 text-emerald-200/80 pt-12 pb-8 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-10 border-b border-[#0B6E4F]">
          
          {/* Brand & Editable Email Contact */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center space-x-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#FFD700] via-yellow-300 to-[#0B6E4F] p-0.5 flex items-center justify-center shadow-[0_0_15px_rgba(255,215,0,0.25)]">
                <div className="w-full h-full bg-[#0A0A0A] rounded-[10px] flex items-center justify-center">
                  <Moon className="w-5 h-5 text-[#FFD700] fill-[#FFD700]/20" />
                </div>
              </div>
              <span className="text-xl font-bold font-serif text-white">
                IS <span className="text-gold-gradient">AI HUB</span>
              </span>
            </div>

            <p className="text-xs text-emerald-200/80 max-w-md leading-relaxed">
              A modern, elegant platform discovering top free AI tools and authentic Islamic digital resources. Built with speed, simplicity, and accessibility in mind.
            </p>

            {/* Editable Contact Email Section */}
            <div className="bg-[#111827] p-3.5 rounded-2xl border border-[#FFD700]/30 max-w-md space-y-2">
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center space-x-2 text-yellow-300 font-semibold">
                  <Mail className="w-4 h-4 text-[#FFD700]" />
                  <span>Contact & Support Email:</span>
                </div>
                <button
                  onClick={() => setIsEditingEmail(!isEditingEmail)}
                  className="text-[10px] text-emerald-300 hover:text-yellow-300 underline"
                >
                  {isEditingEmail ? 'Cancel' : 'Edit Email'}
                </button>
              </div>

              {isEditingEmail ? (
                <form onSubmit={handleSaveEmail} className="flex gap-2">
                  <input
                    type="email"
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                    className="flex-1 bg-[#0A0A0A] text-xs text-white px-2.5 py-1.5 rounded-xl border border-[#0B6E4F] focus:outline-none"
                  />
                  <button
                    type="submit"
                    className="px-3 py-1.5 rounded-xl bg-[#FFD700] text-slate-950 font-bold text-xs"
                  >
                    Save
                  </button>
                </form>
              ) : (
                <div className="flex items-center justify-between pt-1">
                  <span className="text-xs font-mono font-bold text-white">{contactEmail}</span>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={handleCopyEmail}
                      className="p-1.5 rounded-lg bg-[#0A0A0A] border border-[#0B6E4F] text-emerald-300 hover:text-yellow-300"
                      title="Copy email"
                    >
                      {copiedEmail ? <Check className="w-3.5 h-3.5 text-[#FFD700]" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                    <button
                      onClick={() => setIsContactModalOpen(true)}
                      className="px-2.5 py-1 rounded-lg bg-gradient-to-r from-[#FFD700] to-yellow-400 hover:from-yellow-200 hover:to-[#FFD700] text-slate-950 text-[11px] font-bold flex items-center space-x-1 shadow-sm"
                    >
                      <Send className="w-3 h-3" />
                      <span>Send Message</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Social Media Icons */}
            <div className="pt-2">
              <span className="text-[11px] uppercase font-bold tracking-wider text-yellow-300/90 block mb-2">Connect With Us</span>
              <div className="flex items-center space-x-3">
                <a
                  href="https://youtube.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 rounded-xl bg-[#111827] border border-[#0B6E4F] text-emerald-300 hover:text-yellow-300 hover:border-[#FFD700]/50 flex items-center justify-center transition-all"
                  title="YouTube"
                >
                  <Youtube className="w-4 h-4" />
                </a>
                <a
                  href="https://x.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 rounded-xl bg-[#111827] border border-[#0B6E4F] text-emerald-300 hover:text-yellow-300 hover:border-[#FFD700]/50 flex items-center justify-center transition-all"
                  title="Twitter / X"
                >
                  <Twitter className="w-4 h-4" />
                </a>
                <a
                  href="https://facebook.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 rounded-xl bg-[#111827] border border-[#0B6E4F] text-emerald-300 hover:text-yellow-300 hover:border-[#FFD700]/50 flex items-center justify-center transition-all"
                  title="Facebook"
                >
                  <Facebook className="w-4 h-4" />
                </a>
                <a
                  href="https://telegram.org"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 rounded-xl bg-[#111827] border border-[#0B6E4F] text-emerald-300 hover:text-yellow-300 hover:border-[#FFD700]/50 flex items-center justify-center transition-all"
                  title="Telegram"
                >
                  <MessageSquare className="w-4 h-4" />
                </a>
              </div>
            </div>

          </div>

          {/* Navigation Links */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-yellow-300 mb-3">AI Discovery</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={() => setActiveCategory('video')} className="hover:text-yellow-300 transition-colors">
                  🎬 AI Video Tools
                </button>
              </li>
              <li>
                <button onClick={() => setActiveCategory('image')} className="hover:text-yellow-300 transition-colors">
                  🖼 AI Image Generators
                </button>
              </li>
              <li>
                <button onClick={() => setActiveCategory('writing')} className="hover:text-yellow-300 transition-colors">
                  ✍️ AI Writing Assistants
                </button>
              </li>
              <li>
                <button onClick={() => setActiveCategory('prompts')} className="hover:text-yellow-300 transition-colors">
                  💡 Verified Prompt Library
                </button>
              </li>
            </ul>
          </div>

          {/* Islamic Hub Links */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-yellow-300 mb-3">Islamic Library</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={() => setActiveCategory('islamic')} className="hover:text-yellow-300 transition-colors">
                  📚 Free Islamic Books (PDF)
                </button>
              </li>
              <li>
                <button onClick={() => setActiveCategory('islamic')} className="hover:text-yellow-300 transition-colors">
                  📖 Quran Audio & Recitation
                </button>
              </li>
              <li>
                <button onClick={() => setActiveCategory('islamic')} className="hover:text-yellow-300 transition-colors">
                  🤲 Daily Duas & Azkar
                </button>
              </li>
              <li>
                <button onClick={() => setActiveCategory('islamic')} className="hover:text-yellow-300 transition-colors">
                  📝 Islamic Ethics Articles
                </button>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-emerald-400/80 gap-3">
          <div className="flex items-center flex-wrap justify-center gap-x-4 gap-y-1">
            <p>© IS AI Hub • All Rights Reserved</p>
            <button
              onClick={onOpenPrivacyPolicy}
              className="hover:text-yellow-300 transition-colors underline underline-offset-2"
            >
              Privacy Policy
            </button>
            <button
              onClick={onOpenTerms}
              className="hover:text-yellow-300 transition-colors underline underline-offset-2"
            >
              Terms &amp; Conditions
            </button>
          </div>
          <div className="flex items-center space-x-4">
            <button
              onClick={onOpenAdmin}
              className="text-yellow-300 hover:text-white font-bold flex items-center space-x-1"
            >
              <span>👑 Admin Management Panel</span>
            </button>
            <p className="flex items-center space-x-1">
              <span>Designed with elegance & excellence</span>
              <Sparkles className="w-3.5 h-3.5 text-[#FFD700] ml-1" />
            </p>
          </div>
        </div>

      </div>

      {/* CONTACT MESSAGING MODAL */}
      {isContactModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#111827] border border-[#FFD700]/40 rounded-3xl p-6 max-w-md w-full space-y-4 relative shadow-2xl">
            <button
              onClick={() => setIsContactModalOpen(false)}
              className="absolute top-4 right-4 p-2 text-emerald-300 hover:text-white"
            >
              ✕
            </button>
            <h3 className="text-lg font-bold text-white font-serif">Contact IS AI Hub</h3>
            <p className="text-xs text-emerald-200/80">
              Send us a direct message or tool suggestion to <span className="text-yellow-300 font-mono">{contactEmail}</span>.
            </p>

            {messageSent ? (
              <div className="p-4 bg-[#0A0A0A] border border-[#0B6E4F] rounded-xl text-center text-yellow-300 text-xs font-bold space-y-2">
                <Check className="w-8 h-8 text-[#FFD700] mx-auto" />
                <p>Thank you! Your message has been sent successfully.</p>
              </div>
            ) : (
              <form onSubmit={handleSendMessage} className="space-y-3">
                <div>
                  <label className="block text-[11px] text-yellow-300 font-semibold mb-1">Your Email</label>
                  <input
                    type="email"
                    required
                    placeholder="you@example.com"
                    value={senderEmail}
                    onChange={(e) => setSenderEmail(e.target.value)}
                    className="w-full bg-[#0A0A0A] text-xs text-white p-2.5 rounded-xl border border-[#0B6E4F] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-yellow-300 font-semibold mb-1">Your Message or Suggestion</label>
                  <textarea
                    required
                    rows={4}
                    placeholder="Type your feedback, feature request, or inquiry..."
                    value={senderMsg}
                    onChange={(e) => setSenderMsg(e.target.value)}
                    className="w-full bg-[#0A0A0A] text-xs text-white p-2.5 rounded-xl border border-[#0B6E4F] focus:outline-none"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl bg-gradient-to-r from-[#FFD700] to-yellow-400 hover:from-yellow-200 hover:to-[#FFD700] text-slate-950 font-bold text-xs shadow-md shadow-[#FFD700]/20"
                >
                  Send Message
                </button>
              </form>
            )}
          </div>
        </div>
      )}

    </footer>
  );
};
