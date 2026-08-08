import React, { useState } from 'react';
import { AITool, IslamicBook, DuaItem, PromptItem, ToolCategory, PricingType } from '../types';
import { X, Plus, BookOpen, Video, Sparkles, FileText, Upload, Image as ImageIcon, Music, CheckCircle2 } from 'lucide-react';

interface AddResourceModalProps {
  isOpen: boolean;
  resourceType: 'tool' | 'book' | 'dua' | 'article' | 'prompt';
  onClose: () => void;
  onAddTool: (tool: AITool) => void;
  onAddBook: (book: IslamicBook) => void;
  onAddDua: (dua: DuaItem) => void;
  onAddPrompt: (prompt: PromptItem) => void;
}

export const AddResourceModal: React.FC<AddResourceModalProps> = ({
  isOpen,
  resourceType,
  onClose,
  onAddTool,
  onAddBook,
  onAddDua,
  onAddPrompt,
}) => {
  const [activeTab, setActiveTab] = useState<'tool' | 'book' | 'dua' | 'prompt'>(
    resourceType === 'book' ? 'book' : resourceType === 'dua' ? 'dua' : resourceType === 'prompt' ? 'prompt' : 'tool'
  );

  // Tool Form state
  const [toolName, setToolName] = useState('');
  const [toolCategory, setToolCategory] = useState<ToolCategory>('video');
  const [toolShortDesc, setToolShortDesc] = useState('');
  const [toolPricing, setToolPricing] = useState<PricingType>('Free Plan');
  const [toolUrl, setToolUrl] = useState('');
  const [toolLogoUrl, setToolLogoUrl] = useState('');
  const [toolImageUrl, setToolImageUrl] = useState('');
  const [toolFeatures, setToolFeatures] = useState('');

  // Book Form state
  const [bookTitle, setBookTitle] = useState('');
  const [bookAuthor, setBookAuthor] = useState('');
  const [bookCategory, setBookCategory] = useState('Islamic Studies');
  const [bookPages, setBookPages] = useState('150');
  const [bookPdfUrl, setBookPdfUrl] = useState('');
  const [bookCoverImage, setBookCoverImage] = useState('');
  const [bookDesc, setBookDesc] = useState('');

  // Dua Form state
  const [duaTitle, setDuaTitle] = useState('');
  const [duaArabic, setDuaArabic] = useState('');
  const [duaTranslit, setDuaTranslit] = useState('');
  const [duaEnglish, setDuaEnglish] = useState('');
  const [duaAudioUrl, setDuaAudioUrl] = useState('');

  // Prompt Form state
  const [promptTitle, setPromptTitle] = useState('');
  const [promptCategory, setPromptCategory] = useState<'video' | 'image' | 'business'>('video');
  const [promptTargetTool, setPromptTargetTool] = useState('Google Veo');
  const [promptText, setPromptText] = useState('');
  const [promptFileName, setPromptFileName] = useState('');

  // Toast status
  const [uploadStatus, setUploadStatus] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, setter: (url: string) => void, nameSetter?: (name: string) => void) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type.startsWith('text/') || file.name.endsWith('.prompt') || file.name.endsWith('.txt')) {
      const textReader = new FileReader();
      textReader.onload = () => {
        if (textReader.result) {
          setter(textReader.result.toString());
          if (nameSetter) nameSetter(file.name);
          setUploadStatus(`Uploaded file "${file.name}"!`);
          setTimeout(() => setUploadStatus(null), 3000);
        }
      };
      textReader.readAsText(file);
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (reader.result) {
        setter(reader.result.toString());
        if (nameSetter) nameSetter(file.name);
        setUploadStatus(`File "${file.name}" attached successfully!`);
        setTimeout(() => setUploadStatus(null), 3000);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSubmitTool = (e: React.FormEvent) => {
    e.preventDefault();
    if (!toolName || !toolUrl) return;

    const newTool: AITool = {
      id: `custom-tool-${Date.now()}`,
      name: toolName,
      category: toolCategory,
      shortDescription: toolShortDesc || 'Newly added AI tool',
      pricing: toolPricing,
      url: toolUrl.startsWith('http') ? toolUrl : `https://${toolUrl}`,
      logoUrl: toolLogoUrl || undefined,
      imageUrl: toolImageUrl || undefined,
      features: toolFeatures ? toolFeatures.split(',').map((f) => f.trim()) : ['AI Powered', 'Free Access'],
      rating: 4.8,
    };

    onAddTool(newTool);
    onClose();
  };

  const handleSubmitBook = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bookTitle || !bookPdfUrl) return;

    const newBook: IslamicBook = {
      id: `custom-book-${Date.now()}`,
      title: bookTitle,
      author: bookAuthor || 'Islamic Scholar',
      category: bookCategory,
      pages: bookPages,
      fileSize: 'Uploaded PDF',
      pdfUrl: bookPdfUrl,
      coverImage: bookCoverImage || undefined,
      description: bookDesc || 'Authentic Islamic reference book in PDF format.',
      icon: '📚',
      downloadCount: 1,
    };

    onAddBook(newBook);
    onClose();
  };

  const handleSubmitDua = (e: React.FormEvent) => {
    e.preventDefault();
    if (!duaTitle || !duaArabic) return;

    const newDua: DuaItem = {
      id: `custom-dua-${Date.now()}`,
      title: duaTitle,
      category: 'Daily Life',
      arabic: duaArabic,
      transliteration: duaTranslit,
      english: duaEnglish,
      audioUrl: duaAudioUrl || undefined,
    };

    onAddDua(newDua);
    onClose();
  };

  const handleSubmitPrompt = (e: React.FormEvent) => {
    e.preventDefault();
    if (!promptTitle || !promptText) return;

    const newPrompt: PromptItem = {
      id: `custom-prompt-${Date.now()}`,
      title: promptTitle,
      category: promptCategory,
      targetTool: promptTargetTool,
      promptText: promptText,
      tags: ['Custom', promptCategory],
      attachedFileName: promptFileName || undefined,
    };

    onAddPrompt(newPrompt);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-[#111827] border border-[#FFD700]/40 rounded-3xl p-6 sm:p-8 max-w-lg w-full relative shadow-2xl max-h-[90vh] overflow-y-auto">
        
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-emerald-300 hover:text-white"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center space-x-2.5 mb-4">
          <div className="p-2 bg-[#0A0A0A] border border-[#FFD700]/30 rounded-xl text-[#FFD700]">
            <Plus className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white font-serif">Admin Portal: Add Resource</h3>
            <p className="text-xs text-yellow-300">Upload files directly from gallery or paste links</p>
          </div>
        </div>

        {uploadStatus && (
          <div className="mb-4 bg-[#FFD700] text-slate-950 font-bold text-xs p-2.5 rounded-xl flex items-center justify-between">
            <span className="flex items-center space-x-1">
              <CheckCircle2 className="w-4 h-4 text-slate-950" />
              <span>{uploadStatus}</span>
            </span>
          </div>
        )}

        {/* Resource Type Tabs */}
        <div className="grid grid-cols-4 gap-1.5 bg-[#0A0A0A] p-1 rounded-xl border border-[#0B6E4F] mb-6">
          <button
            type="button"
            onClick={() => setActiveTab('tool')}
            className={`py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'tool' ? 'bg-[#FFD700] text-slate-950 shadow-sm' : 'text-emerald-300 hover:text-white'
            }`}
          >
            AI Tool
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('book')}
            className={`py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'book' ? 'bg-[#FFD700] text-slate-950 shadow-sm' : 'text-emerald-300 hover:text-white'
            }`}
          >
            PDF Book
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('dua')}
            className={`py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'dua' ? 'bg-[#FFD700] text-slate-950 shadow-sm' : 'text-emerald-300 hover:text-white'
            }`}
          >
            Dua
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('prompt')}
            className={`py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'prompt' ? 'bg-[#FFD700] text-slate-950 shadow-sm' : 'text-emerald-300 hover:text-white'
            }`}
          >
            Prompt
          </button>
        </div>

        {/* --- FORM 1: AI TOOL --- */}
        {activeTab === 'tool' && (
          <form onSubmit={handleSubmitTool} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-emerald-200 mb-1">Tool Name *</label>
              <input
                type="text"
                required
                value={toolName}
                onChange={(e) => setToolName(e.target.value)}
                placeholder="e.g., Sora AI, Midjourney..."
                className="w-full bg-[#0A0A0A] border border-[#0B6E4F] rounded-xl px-3.5 py-2 text-xs text-white placeholder-emerald-500/40 focus:outline-none focus:border-[#FFD700]"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-emerald-200 mb-1">Category</label>
                <select
                  value={toolCategory}
                  onChange={(e) => setToolCategory(e.target.value as ToolCategory)}
                  className="w-full bg-[#0A0A0A] border border-[#0B6E4F] rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                >
                  <option value="video">🎬 AI Video</option>
                  <option value="image">🖼 AI Image</option>
                  <option value="writing">✍️ AI Writing</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-emerald-200 mb-1">Pricing Model</label>
                <select
                  value={toolPricing}
                  onChange={(e) => setToolPricing(e.target.value as PricingType)}
                  className="w-full bg-[#0A0A0A] border border-[#0B6E4F] rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                >
                  <option value="Free Plan">Free Plan</option>
                  <option value="Free Credits">Free Credits</option>
                  <option value="Free Trial">Free Trial</option>
                  <option value="Freemium">Freemium</option>
                  <option value="Paid">Paid</option>
                </select>
              </div>
            </div>

            {/* Gallery Upload for Tool Logo */}
            <div>
              <label className="block text-xs font-semibold text-emerald-200 mb-1">Upload Tool Logo / Icon from Gallery</label>
              <div className="flex items-center space-x-2">
                <label className="flex-1 px-3 py-2 bg-[#0A0A0A] border border-[#0B6E4F] hover:border-[#FFD700] rounded-xl text-yellow-300 text-xs font-bold cursor-pointer flex items-center justify-center space-x-2 transition-all">
                  <Upload className="w-4 h-4 text-[#FFD700]" />
                  <span>Choose File from Device Gallery</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileUpload(e, setToolLogoUrl)}
                    className="hidden"
                  />
                </label>
                {toolLogoUrl && (
                  <span className="text-[10px] text-emerald-300 font-mono bg-[#0A0A0A] px-2 py-1 rounded border border-[#0B6E4F]">
                    ✓ Logo Attached
                  </span>
                )}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-emerald-200 mb-1">Official Website URL *</label>
              <input
                type="url"
                required
                value={toolUrl}
                onChange={(e) => setToolUrl(e.target.value)}
                placeholder="https://..."
                className="w-full bg-[#0A0A0A] border border-[#0B6E4F] rounded-xl px-3.5 py-2 text-xs text-white placeholder-emerald-500/40 focus:outline-none focus:border-[#FFD700]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-emerald-200 mb-1">Short Description</label>
              <textarea
                rows={2}
                value={toolShortDesc}
                onChange={(e) => setToolShortDesc(e.target.value)}
                placeholder="Brief summary of what this tool does..."
                className="w-full bg-[#0A0A0A] border border-[#0B6E4F] rounded-xl px-3.5 py-2 text-xs text-white placeholder-emerald-500/40 focus:outline-none focus:border-[#FFD700]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-emerald-200 mb-1">Features (comma separated)</label>
              <input
                type="text"
                value={toolFeatures}
                onChange={(e) => setToolFeatures(e.target.value)}
                placeholder="Text to video, Cinematic, 1080p..."
                className="w-full bg-[#0A0A0A] border border-[#0B6E4F] rounded-xl px-3.5 py-2 text-xs text-white placeholder-emerald-500/40 focus:outline-none focus:border-[#FFD700]"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-gradient-to-r from-[#FFD700] to-yellow-400 hover:from-yellow-200 hover:to-[#FFD700] text-slate-950 font-bold text-xs shadow-md shadow-[#FFD700]/20 transition-all cursor-pointer"
            >
              Add AI Tool to Platform
            </button>
          </form>
        )}

        {/* --- FORM 2: ISLAMIC BOOK --- */}
        {activeTab === 'book' && (
          <form onSubmit={handleSubmitBook} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-emerald-200 mb-1">Book Title *</label>
              <input
                type="text"
                required
                value={bookTitle}
                onChange={(e) => setBookTitle(e.target.value)}
                placeholder="e.g., Stories of the Prophets..."
                className="w-full bg-[#0A0A0A] border border-[#0B6E4F] rounded-xl px-3.5 py-2 text-xs text-white placeholder-emerald-500/40 focus:outline-none focus:border-[#FFD700]"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-emerald-200 mb-1">Author</label>
                <input
                  type="text"
                  value={bookAuthor}
                  onChange={(e) => setBookAuthor(e.target.value)}
                  placeholder="Author name..."
                  className="w-full bg-[#0A0A0A] border border-[#0B6E4F] rounded-xl px-3.5 py-2 text-xs text-white placeholder-emerald-500/40 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-emerald-200 mb-1">Pages Count</label>
                <input
                  type="text"
                  value={bookPages}
                  onChange={(e) => setBookPages(e.target.value)}
                  placeholder="e.g., 220"
                  className="w-full bg-[#0A0A0A] border border-[#0B6E4F] rounded-xl px-3.5 py-2 text-xs text-white placeholder-emerald-500/40 focus:outline-none"
                />
              </div>
            </div>

            {/* PDF File Upload from Gallery / Storage */}
            <div>
              <label className="block text-xs font-semibold text-emerald-200 mb-1">Upload PDF File from Gallery / Phone Storage *</label>
              <div className="flex items-center space-x-2">
                <label className="flex-1 px-3 py-2.5 bg-[#0A0A0A] border border-[#FFD700]/50 hover:border-[#FFD700] rounded-xl text-yellow-300 text-xs font-bold cursor-pointer flex items-center justify-center space-x-2 transition-all">
                  <Upload className="w-4 h-4 text-[#FFD700]" />
                  <span>Choose PDF File from Gallery / Device</span>
                  <input
                    type="file"
                    accept="application/pdf"
                    onChange={(e) => handleFileUpload(e, setBookPdfUrl)}
                    className="hidden"
                  />
                </label>
              </div>
              {bookPdfUrl && (
                <p className="text-[10px] text-emerald-300 font-mono mt-1 line-clamp-1">
                  ✓ PDF File Loaded ({bookPdfUrl.slice(0, 40)}...)
                </p>
              )}
            </div>

            {/* Book Cover Upload */}
            <div>
              <label className="block text-xs font-semibold text-emerald-200 mb-1">Upload Book Cover Image from Gallery</label>
              <label className="w-full px-3 py-2 bg-[#0A0A0A] border border-[#0B6E4F] hover:border-[#FFD700] rounded-xl text-yellow-300 text-xs font-bold cursor-pointer flex items-center justify-center space-x-2 transition-all">
                <ImageIcon className="w-4 h-4 text-[#FFD700]" />
                <span>Upload Cover Image</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFileUpload(e, setBookCoverImage)}
                  className="hidden"
                />
              </label>
              {bookCoverImage && (
                <p className="text-[10px] text-emerald-300 font-mono mt-1">✓ Cover Image Loaded</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-emerald-200 mb-1">Description</label>
              <textarea
                rows={2}
                value={bookDesc}
                onChange={(e) => setBookDesc(e.target.value)}
                placeholder="Brief summary of the book content..."
                className="w-full bg-[#0A0A0A] border border-[#0B6E4F] rounded-xl px-3.5 py-2 text-xs text-white placeholder-emerald-500/40 focus:outline-none focus:border-[#FFD700]"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-gradient-to-r from-[#FFD700] to-yellow-400 hover:from-yellow-200 hover:to-[#FFD700] text-slate-950 font-bold text-xs shadow-md shadow-[#FFD700]/20 transition-all cursor-pointer"
            >
              Add PDF Book to Library
            </button>
          </form>
        )}

        {/* --- FORM 3: DUA --- */}
        {activeTab === 'dua' && (
          <form onSubmit={handleSubmitDua} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-emerald-200 mb-1">Dua Title *</label>
              <input
                type="text"
                required
                value={duaTitle}
                onChange={(e) => setDuaTitle(e.target.value)}
                placeholder="e.g., Dua before sleeping..."
                className="w-full bg-[#0A0A0A] border border-[#0B6E4F] rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-emerald-200 mb-1">Arabic Text *</label>
              <textarea
                rows={2}
                required
                value={duaArabic}
                onChange={(e) => setDuaArabic(e.target.value)}
                placeholder="Arabic text..."
                className="w-full bg-[#0A0A0A] border border-[#0B6E4F] rounded-xl px-3.5 py-2 text-xs text-yellow-200 font-serif text-right focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-emerald-200 mb-1">English Transliteration</label>
              <input
                type="text"
                value={duaTranslit}
                onChange={(e) => setDuaTranslit(e.target.value)}
                placeholder="Transliteration..."
                className="w-full bg-[#0A0A0A] border border-[#0B6E4F] rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-emerald-200 mb-1">English Translation</label>
              <textarea
                rows={2}
                value={duaEnglish}
                onChange={(e) => setDuaEnglish(e.target.value)}
                placeholder="Translation..."
                className="w-full bg-[#0A0A0A] border border-[#0B6E4F] rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none"
              />
            </div>

            {/* Audio Recitation Upload */}
            <div>
              <label className="block text-xs font-semibold text-emerald-200 mb-1">Upload Recitation Audio (MP3/WAV) from Gallery</label>
              <label className="w-full px-3 py-2 bg-[#0A0A0A] border border-[#0B6E4F] hover:border-[#FFD700] rounded-xl text-yellow-300 text-xs font-bold cursor-pointer flex items-center justify-center space-x-2 transition-all">
                <Music className="w-4 h-4 text-[#FFD700]" />
                <span>Upload Audio File</span>
                <input
                  type="file"
                  accept="audio/*"
                  onChange={(e) => handleFileUpload(e, setDuaAudioUrl)}
                  className="hidden"
                />
              </label>
              {duaAudioUrl && (
                <p className="text-[10px] text-emerald-300 font-mono mt-1">✓ Recitation Audio Loaded</p>
              )}
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-gradient-to-r from-[#FFD700] to-yellow-400 hover:from-yellow-200 hover:to-[#FFD700] text-slate-950 font-bold text-xs shadow-md shadow-[#FFD700]/20 transition-all cursor-pointer"
            >
              Add Dua
            </button>
          </form>
        )}

        {/* --- FORM 4: PROMPT --- */}
        {activeTab === 'prompt' && (
          <form onSubmit={handleSubmitPrompt} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-emerald-200 mb-1">Prompt Title *</label>
              <input
                type="text"
                required
                value={promptTitle}
                onChange={(e) => setPromptTitle(e.target.value)}
                placeholder="e.g., Ultra Cinematic Sunset Video..."
                className="w-full bg-[#0A0A0A] border border-[#0B6E4F] rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-emerald-200 mb-1">Category</label>
                <select
                  value={promptCategory}
                  onChange={(e) => setPromptCategory(e.target.value as any)}
                  className="w-full bg-[#0A0A0A] border border-[#0B6E4F] rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                >
                  <option value="video">🎬 Video Prompt</option>
                  <option value="image">🖼 Image Prompt</option>
                  <option value="business">💼 Business Prompt</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-emerald-200 mb-1">Target AI Tool</label>
                <input
                  type="text"
                  value={promptTargetTool}
                  onChange={(e) => setPromptTargetTool(e.target.value)}
                  placeholder="e.g., Google Veo, ChatGPT..."
                  className="w-full bg-[#0A0A0A] border border-[#0B6E4F] rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none"
                />
              </div>
            </div>

            {/* Prompt File Upload from Gallery */}
            <div>
              <label className="block text-xs font-semibold text-emerald-200 mb-1">Upload Prompt File (.txt / .prompt) from Gallery</label>
              <label className="w-full px-3 py-2 bg-[#0A0A0A] border border-[#0B6E4F] hover:border-[#FFD700] rounded-xl text-yellow-300 text-xs font-bold cursor-pointer flex items-center justify-center space-x-2 transition-all">
                <FileText className="w-4 h-4 text-[#FFD700]" />
                <span>Choose Prompt Text File</span>
                <input
                  type="file"
                  accept=".txt,.prompt,.json,text/plain"
                  onChange={(e) => handleFileUpload(e, setPromptText, setPromptFileName)}
                  className="hidden"
                />
              </label>
            </div>

            <div>
              <label className="block text-xs font-semibold text-emerald-200 mb-1">Full Prompt Text *</label>
              <textarea
                rows={3}
                required
                value={promptText}
                onChange={(e) => setPromptText(e.target.value)}
                placeholder="Paste or upload prompt text here..."
                className="w-full bg-[#0A0A0A] border border-[#0B6E4F] rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-gradient-to-r from-[#FFD700] to-yellow-400 hover:from-yellow-200 hover:to-[#FFD700] text-slate-950 font-bold text-xs shadow-md shadow-[#FFD700]/20 transition-all cursor-pointer"
            >
              Add Prompt to Library
            </button>
          </form>
        )}

      </div>
    </div>
  );
};
