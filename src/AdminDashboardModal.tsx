import React, { useState } from 'react';
import {
  AITool,
  IslamicBook,
  DuaItem,
  PromptItem,
  IslamicArticle,
  QuranVideoRecitation,
  ToolCategory,
  PricingType
} from '../types';
import {
  X,
  Plus,
  Edit,
  Trash2,
  Search,
  Check,
  Upload,
  BookOpen,
  Video,
  FileText,
  Sparkles,
  ShieldCheck,
  ExternalLink,
  Film,
  Music,
  Globe,
  Tag,
  Star,
  RefreshCw,
  FolderPlus,
  ArrowUpRight,
  ArrowUp,
  ArrowDown,
  Eye
} from 'lucide-react';

interface AdminDashboardModalProps {
  isOpen: boolean;
  onClose: () => void;
  // AI Tools
  aiTools: AITool[];
  onAddTool: (tool: AITool) => void;
  onUpdateTool: (tool: AITool) => void;
  onDeleteTool: (id: string) => void;
  onReorderTools?: (tools: AITool[]) => void;
  // Islamic Books
  books: IslamicBook[];
  onAddBook: (book: IslamicBook) => void;
  onUpdateBook: (book: IslamicBook) => void;
  onDeleteBook: (id: string) => void;
  onReorderBooks?: (books: IslamicBook[]) => void;
  // Prompts
  prompts: PromptItem[];
  onAddPrompt: (prompt: PromptItem) => void;
  onUpdatePrompt: (prompt: PromptItem) => void;
  onDeletePrompt: (id: string) => void;
  onReorderPrompts?: (prompts: PromptItem[]) => void;
  // Quran Videos
  quranVideos: QuranVideoRecitation[];
  onAddQuranVideo: (video: QuranVideoRecitation) => void;
  onUpdateQuranVideo: (video: QuranVideoRecitation) => void;
  onDeleteQuranVideo: (id: string) => void;
  onReorderQuranVideos?: (videos: QuranVideoRecitation[]) => void;
  // Islamic Articles
  articles: IslamicArticle[];
  onAddArticle: (article: IslamicArticle) => void;
  onUpdateArticle: (article: IslamicArticle) => void;
  onDeleteArticle: (id: string) => void;
  onReorderArticles?: (articles: IslamicArticle[]) => void;
  // Duas
  duas: DuaItem[];
  onAddDua: (dua: DuaItem) => void;
  onUpdateDua: (dua: DuaItem) => void;
  onDeleteDua: (id: string) => void;
  onReorderDuas?: (duas: DuaItem[]) => void;
}

export const AdminDashboardModal: React.FC<AdminDashboardModalProps> = ({
  isOpen,
  onClose,
  aiTools,
  onAddTool,
  onUpdateTool,
  onDeleteTool,
  books,
  onAddBook,
  onUpdateBook,
  onDeleteBook,
  prompts,
  onAddPrompt,
  onUpdatePrompt,
  onDeletePrompt,
  quranVideos,
  onAddQuranVideo,
  onUpdateQuranVideo,
  onDeleteQuranVideo,
  articles,
  onAddArticle,
  onUpdateArticle,
  onDeleteArticle,
  duas,
  onAddDua,
  onUpdateDua,
  onDeleteDua,
  onReorderTools,
  onReorderBooks,
  onReorderPrompts,
  onReorderQuranVideos,
  onReorderArticles,
  onReorderDuas,
}) => {
  const [activeTab, setActiveTab] = useState<'tools' | 'books' | 'prompts' | 'videos' | 'articles' | 'duas'>('tools');
  const [searchQuery, setSearchQuery] = useState('');
  const [editItem, setEditItem] = useState<{ type: string; data: any } | null>(null);
  const [previewItem, setPreviewItem] = useState<{ type: string; data: any } | null>(null);
  const [isAddMode, setIsAddMode] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const showStatus = (msg: string) => {
    setStatusMessage(msg);
    setTimeout(() => setStatusMessage(null), 3000);
  };

  // --- FILE HELPER FOR LOCAL UPLOAD TO DATA URL ---
  const handleFileUploadToUrl = (e: React.ChangeEvent<HTMLInputElement>, callback: (url: string, name?: string) => void) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      if (reader.result) {
        callback(reader.result.toString(), file.name);
        showStatus(`File "${file.name}" uploaded successfully!`);
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-hidden">
      <div className="bg-[#111827] border border-[#FFD700]/40 rounded-3xl w-full max-w-6xl h-[92vh] flex flex-col relative shadow-[0_0_50px_rgba(255,215,0,0.15)] overflow-hidden">
        
        {/* --- HEADER --- */}
        <div className="bg-[#0A0A0A] p-4 sm:p-6 border-b border-[#0B6E4F] flex flex-col md:flex-row md:items-center justify-between gap-4 shrink-0">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#FFD700] via-yellow-400 to-[#0B6E4F] p-0.5 flex items-center justify-center shadow-lg">
              <div className="w-full h-full bg-[#0A0A0A] rounded-[14px] flex items-center justify-center text-[#FFD700]">
                <ShieldCheck className="w-6 h-6" />
              </div>
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-xl sm:text-2xl font-bold text-white font-serif tracking-tight">
                  Admin <span className="text-gold-gradient">Master Control Dashboard</span>
                </h2>
                <span className="bg-[#111827] text-yellow-300 text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full border border-[#FFD700]/30 flex items-center space-x-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span>Live Website Sync</span>
                </span>
              </div>
              <p className="text-xs text-emerald-200/70 mt-0.5">
                Manage, edit, delete, or upload AI tools, PDF books, Quran videos, articles, and prompts with instant website updates.
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={() => {
                setIsAddMode(true);
                setEditItem(null);
              }}
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#FFD700] to-yellow-400 hover:from-yellow-200 hover:to-[#FFD700] text-slate-950 font-bold text-xs flex items-center space-x-2 shadow-md shadow-[#FFD700]/20 transition-all shrink-0"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Item</span>
            </button>

            <button
              onClick={onClose}
              className="p-2.5 rounded-xl bg-[#0A0A0A] border border-[#0B6E4F] text-emerald-300 hover:text-white transition-all"
              title="Close Admin Panel"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* --- STATS SUMMARY BAR --- */}
        <div className="bg-[#0A0A0A] border-b border-[#0B6E4F] p-3 px-6 grid grid-cols-2 sm:grid-cols-5 gap-3 text-center shrink-0">
          <div className="bg-[#111827] p-2 rounded-xl border border-[#0B6E4F]">
            <span className="text-[10px] text-emerald-300/80 font-medium block">AI Tools</span>
            <span className="text-sm font-bold text-yellow-300">{aiTools.length}</span>
          </div>
          <div className="bg-[#111827] p-2 rounded-xl border border-[#0B6E4F]">
            <span className="text-[10px] text-emerald-300/80 font-medium block">Islamic PDF Books</span>
            <span className="text-sm font-bold text-yellow-300">{books.length}</span>
          </div>
          <div className="bg-[#111827] p-2 rounded-xl border border-[#0B6E4F]">
            <span className="text-[10px] text-emerald-300/80 font-medium block">Quran Videos</span>
            <span className="text-sm font-bold text-yellow-300">{quranVideos.length}</span>
          </div>
          <div className="bg-[#111827] p-2 rounded-xl border border-[#0B6E4F]">
            <span className="text-[10px] text-emerald-300/80 font-medium block">Islamic Articles</span>
            <span className="text-sm font-bold text-yellow-300">{articles.length}</span>
          </div>
          <div className="bg-[#111827] p-2 rounded-xl border border-[#0B6E4F]">
            <span className="text-[10px] text-emerald-300/80 font-medium block">Prompts</span>
            <span className="text-sm font-bold text-yellow-300">{prompts.length}</span>
          </div>
        </div>

        {/* --- ACTION NOTIFICATION TOAST --- */}
        {statusMessage && (
          <div className="bg-[#FFD700] text-slate-950 font-bold text-xs p-2 text-center shadow-lg transition-all">
            ✨ {statusMessage}
          </div>
        )}

        {/* --- TABS & SEARCH ROW --- */}
        <div className="p-4 bg-[#0A0A0A] border-b border-[#0B6E4F] flex flex-col md:flex-row items-center justify-between gap-3 shrink-0">
          {/* Tabs */}
          <div className="flex flex-wrap gap-1.5 bg-[#111827] p-1 rounded-2xl border border-[#0B6E4F] w-full md:w-auto">
            <button
              onClick={() => { setActiveTab('tools'); setIsAddMode(false); setEditItem(null); }}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 ${
                activeTab === 'tools' ? 'bg-[#FFD700] text-slate-950 shadow-sm' : 'text-emerald-300 hover:text-white'
              }`}
            >
              <span>🎬</span>
              <span>AI Tools ({aiTools.length})</span>
            </button>
            <button
              onClick={() => { setActiveTab('books'); setIsAddMode(false); setEditItem(null); }}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 ${
                activeTab === 'books' ? 'bg-[#FFD700] text-slate-950 shadow-sm' : 'text-emerald-300 hover:text-white'
              }`}
            >
              <span>📚</span>
              <span>PDF Books ({books.length})</span>
            </button>
            <button
              onClick={() => { setActiveTab('videos'); setIsAddMode(false); setEditItem(null); }}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 ${
                activeTab === 'videos' ? 'bg-[#FFD700] text-slate-950 shadow-sm' : 'text-emerald-300 hover:text-white'
              }`}
            >
              <span>🎥</span>
              <span>Quran Videos ({quranVideos.length})</span>
            </button>
            <button
              onClick={() => { setActiveTab('articles'); setIsAddMode(false); setEditItem(null); }}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 ${
                activeTab === 'articles' ? 'bg-[#FFD700] text-slate-950 shadow-sm' : 'text-emerald-300 hover:text-white'
              }`}
            >
              <span>📝</span>
              <span>Articles ({articles.length})</span>
            </button>
            <button
              onClick={() => { setActiveTab('prompts'); setIsAddMode(false); setEditItem(null); }}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 ${
                activeTab === 'prompts' ? 'bg-[#FFD700] text-slate-950 shadow-sm' : 'text-emerald-300 hover:text-white'
              }`}
            >
              <span>💡</span>
              <span>Prompts ({prompts.length})</span>
            </button>
            <button
              onClick={() => { setActiveTab('duas'); setIsAddMode(false); setEditItem(null); }}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 ${
                activeTab === 'duas' ? 'bg-[#FFD700] text-slate-950 shadow-sm' : 'text-emerald-300 hover:text-white'
              }`}
            >
              <span>🤲</span>
              <span>Duas ({duas.length})</span>
            </button>
          </div>

          {/* Search Box */}
          <div className="relative w-full md:w-64 flex items-center bg-[#111827] border border-[#0B6E4F] rounded-xl px-3 py-2">
            <Search className="w-4 h-4 text-[#FFD700] mr-2 shrink-0" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={`Search ${activeTab}...`}
              className="w-full bg-transparent text-xs text-white placeholder-emerald-500/50 focus:outline-none"
            />
          </div>
        </div>

        {/* --- MAIN BODY CONTENT AREA --- */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">

          {/* ADD / EDIT FORM VIEW */}
          {(isAddMode || editItem) && (
            <div className="bg-[#0A0A0A] border border-[#FFD700]/50 rounded-2xl p-5 sm:p-6 space-y-5 shadow-2xl relative">
              <div className="flex items-center justify-between border-b border-[#0B6E4F] pb-3">
                <h3 className="text-base font-bold text-white flex items-center space-x-2">
                  <Sparkles className="w-4 h-4 text-[#FFD700]" />
                  <span>{editItem ? `Edit ${editItem.type}` : `Add New Item to ${activeTab.toUpperCase()}`}</span>
                </h3>
                <button
                  onClick={() => { setIsAddMode(false); setEditItem(null); }}
                  className="text-xs text-emerald-300 hover:text-white px-2.5 py-1 rounded-lg bg-[#111827] border border-[#0B6E4F]"
                >
                  Cancel
                </button>
              </div>

              {/* FORM: AI TOOLS */}
              {activeTab === 'tools' && (
                <ToolForm
                  initialData={editItem?.data}
                  onSubmit={(data) => {
                    if (editItem) {
                      onUpdateTool(data);
                      showStatus(`Updated AI Tool "${data.name}"`);
                    } else {
                      onAddTool({ ...data, id: `tool-${Date.now()}` });
                      showStatus(`Added AI Tool "${data.name}"`);
                    }
                    setIsAddMode(false);
                    setEditItem(null);
                  }}
                  onFileUpload={(e, setter) => handleFileUploadToUrl(e, setter)}
                />
              )}

              {/* FORM: BOOKS */}
              {activeTab === 'books' && (
                <BookForm
                  initialData={editItem?.data}
                  onSubmit={(data) => {
                    if (editItem) {
                      onUpdateBook(data);
                      showStatus(`Updated Islamic Book "${data.title}"`);
                    } else {
                      onAddBook({ ...data, id: `book-${Date.now()}` });
                      showStatus(`Added Islamic Book "${data.title}"`);
                    }
                    setIsAddMode(false);
                    setEditItem(null);
                  }}
                  onFileUpload={(e, setter) => handleFileUploadToUrl(e, setter)}
                />
              )}

              {/* FORM: QURAN VIDEOS */}
              {activeTab === 'videos' && (
                <QuranVideoForm
                  initialData={editItem?.data}
                  onSubmit={(data) => {
                    if (editItem) {
                      onUpdateQuranVideo(data);
                      showStatus(`Updated Quran Video "${data.title}"`);
                    } else {
                      onAddQuranVideo({ ...data, id: `qvid-${Date.now()}` });
                      showStatus(`Added Quran Video "${data.title}"`);
                    }
                    setIsAddMode(false);
                    setEditItem(null);
                  }}
                  onFileUpload={(e, setter) => handleFileUploadToUrl(e, setter)}
                />
              )}

              {/* FORM: ARTICLES */}
              {activeTab === 'articles' && (
                <ArticleForm
                  initialData={editItem?.data}
                  onSubmit={(data) => {
                    if (editItem) {
                      onUpdateArticle(data);
                      showStatus(`Updated Article "${data.title}"`);
                    } else {
                      onAddArticle({ ...data, id: `art-${Date.now()}` });
                      showStatus(`Added Article "${data.title}"`);
                    }
                    setIsAddMode(false);
                    setEditItem(null);
                  }}
                />
              )}

              {/* FORM: PROMPTS */}
              {activeTab === 'prompts' && (
                <PromptForm
                  initialData={editItem?.data}
                  onSubmit={(data) => {
                    if (editItem) {
                      onUpdatePrompt(data);
                      showStatus(`Updated Prompt "${data.title}"`);
                    } else {
                      onAddPrompt({ ...data, id: `prompt-${Date.now()}` });
                      showStatus(`Added Prompt "${data.title}"`);
                    }
                    setIsAddMode(false);
                    setEditItem(null);
                  }}
                />
              )}

              {/* FORM: DUAS */}
              {activeTab === 'duas' && (
                <DuaForm
                  initialData={editItem?.data}
                  onSubmit={(data) => {
                    if (editItem) {
                      onUpdateDua(data);
                      showStatus(`Updated Dua "${data.title}"`);
                    } else {
                      onAddDua({ ...data, id: `dua-${Date.now()}` });
                      showStatus(`Added Dua "${data.title}"`);
                    }
                    setIsAddMode(false);
                    setEditItem(null);
                  }}
                />
              )}
            </div>
          )}

          {/* LIST VIEWS */}

          {/* TAB 1: AI TOOLS MANAGEMENT */}
          {activeTab === 'tools' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs text-yellow-300 font-semibold px-1">
                <span>Manage All Live AI Tools ({aiTools.length})</span>
                <span>Click Star to Feature, Reorder Up/Down, Edit or Delete</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {aiTools
                  .filter(
                    (t) =>
                      !searchQuery ||
                      t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                      t.category.toLowerCase().includes(searchQuery.toLowerCase())
                  )
                  .map((tool, idx) => (
                    <div
                      key={tool.id}
                      className={`bg-[#0A0A0A] border ${tool.isFeatured ? 'border-[#FFD700] shadow-md shadow-[#FFD700]/10' : 'border-[#0B6E4F]'} rounded-2xl p-4 flex flex-col justify-between space-y-3 hover:border-[#FFD700]/50 transition-all`}
                    >
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-[10px] font-bold uppercase tracking-wide bg-[#111827] text-yellow-300 px-2.5 py-0.5 rounded-md border border-[#0B6E4F]">
                            {tool.category}
                          </span>
                          <div className="flex items-center space-x-1.5">
                            <button
                              onClick={() => {
                                onUpdateTool({ ...tool, isFeatured: !tool.isFeatured });
                                showStatus(tool.isFeatured ? `Unfeatured ${tool.name}` : `Featured ${tool.name}!`);
                              }}
                              className="p-1 rounded-md bg-[#111827] border border-[#0B6E4F] text-yellow-300 hover:scale-110 transition-transform"
                              title="Toggle Featured on Homepage"
                            >
                              <Star className={`w-3.5 h-3.5 ${tool.isFeatured ? 'fill-[#FFD700] text-[#FFD700]' : 'text-slate-500'}`} />
                            </button>
                            <span className="text-[10px] text-emerald-200/80 font-mono">
                              {tool.pricing}
                            </span>
                          </div>
                        </div>
                        <h4 className="text-sm font-bold text-white line-clamp-1">{tool.name}</h4>
                        <p className="text-xs text-emerald-100/70 line-clamp-2 mt-1">{tool.shortDescription}</p>
                      </div>

                      <div className="pt-2 border-t border-[#0B6E4F] flex items-center justify-between gap-2">
                        {/* Reorder Buttons */}
                        <div className="flex items-center space-x-1">
                          <button
                            disabled={idx === 0}
                            onClick={() => {
                              if (!onReorderTools) return;
                              const newArr = [...aiTools];
                              const temp = newArr[idx];
                              newArr[idx] = newArr[idx - 1];
                              newArr[idx - 1] = temp;
                              onReorderTools(newArr);
                            }}
                            className="p-1 rounded-md bg-[#111827] border border-[#0B6E4F] text-emerald-300 disabled:opacity-30 hover:bg-black"
                            title="Move Up"
                          >
                            <ArrowUp className="w-3 h-3" />
                          </button>
                          <button
                            disabled={idx === aiTools.length - 1}
                            onClick={() => {
                              if (!onReorderTools) return;
                              const newArr = [...aiTools];
                              const temp = newArr[idx];
                              newArr[idx] = newArr[idx + 1];
                              newArr[idx + 1] = temp;
                              onReorderTools(newArr);
                            }}
                            className="p-1 rounded-md bg-[#111827] border border-[#0B6E4F] text-emerald-300 disabled:opacity-30 hover:bg-black"
                            title="Move Down"
                          >
                            <ArrowDown className="w-3 h-3" />
                          </button>
                        </div>

                        <div className="flex items-center space-x-1.5">
                          <a
                            href={tool.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1.5 rounded-lg bg-[#111827] text-emerald-300 hover:text-white border border-[#0B6E4F]"
                            title="Visit website"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                          </a>
                          <button
                            onClick={() => {
                              setEditItem({ type: 'AI Tool', data: tool });
                              setIsAddMode(false);
                            }}
                            className="px-2.5 py-1.5 rounded-lg bg-[#111827] hover:bg-black border border-[#0B6E4F] text-yellow-300 text-xs font-semibold flex items-center space-x-1"
                          >
                            <Edit className="w-3 h-3" />
                            <span>Edit</span>
                          </button>
                          <button
                            onClick={() => {
                              if (confirm(`Are you sure you want to delete "${tool.name}"?`)) {
                                onDeleteTool(tool.id);
                                showStatus(`Deleted "${tool.name}"`);
                              }
                            }}
                            className="p-1.5 rounded-lg bg-rose-950/60 hover:bg-rose-900 text-rose-300 border border-rose-800"
                            title="Delete Tool"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          )}

          {/* TAB 2: ISLAMIC BOOKS MANAGEMENT */}
          {activeTab === 'books' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs text-yellow-300 font-semibold px-1">
                <span>Manage Islamic PDF Books ({books.length})</span>
                <span>Direct PDF download or phone/computer gallery file upload</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {books
                  .filter(
                    (b) =>
                      !searchQuery ||
                      b.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                      b.author.toLowerCase().includes(searchQuery.toLowerCase())
                  )
                  .map((book, idx) => (
                    <div
                      key={book.id}
                      className="bg-[#0A0A0A] border border-[#0B6E4F] rounded-2xl p-4 flex flex-col justify-between space-y-3 hover:border-[#FFD700]/50 transition-all"
                    >
                      <div>
                        <div className="flex items-start space-x-3 mb-2">
                          <span className="text-2xl p-2 bg-[#111827] rounded-xl border border-[#0B6E4F]">
                            {book.icon || '📚'}
                          </span>
                          <div>
                            <h4 className="text-sm font-bold text-white line-clamp-1">{book.title}</h4>
                            <p className="text-xs text-yellow-300 font-medium">By {book.author}</p>
                          </div>
                        </div>
                        <p className="text-xs text-emerald-100/70 line-clamp-2">{book.description}</p>
                      </div>

                      <div className="pt-2 border-t border-[#0B6E4F] flex items-center justify-between gap-2">
                        {/* Reorder Buttons */}
                        <div className="flex items-center space-x-1">
                          <button
                            disabled={idx === 0}
                            onClick={() => {
                              if (!onReorderBooks) return;
                              const newArr = [...books];
                              const temp = newArr[idx];
                              newArr[idx] = newArr[idx - 1];
                              newArr[idx - 1] = temp;
                              onReorderBooks(newArr);
                            }}
                            className="p-1 rounded-md bg-[#111827] border border-[#0B6E4F] text-emerald-300 disabled:opacity-30 hover:bg-black"
                            title="Move Up"
                          >
                            <ArrowUp className="w-3 h-3" />
                          </button>
                          <button
                            disabled={idx === books.length - 1}
                            onClick={() => {
                              if (!onReorderBooks) return;
                              const newArr = [...books];
                              const temp = newArr[idx];
                              newArr[idx] = newArr[idx + 1];
                              newArr[idx + 1] = temp;
                              onReorderBooks(newArr);
                            }}
                            className="p-1 rounded-md bg-[#111827] border border-[#0B6E4F] text-emerald-300 disabled:opacity-30 hover:bg-black"
                            title="Move Down"
                          >
                            <ArrowDown className="w-3 h-3" />
                          </button>
                        </div>

                        <div className="flex items-center space-x-1.5">
                          <button
                            onClick={() => {
                              setEditItem({ type: 'PDF Book', data: book });
                              setIsAddMode(false);
                            }}
                            className="px-2.5 py-1.5 rounded-lg bg-[#111827] hover:bg-black border border-[#0B6E4F] text-yellow-300 text-xs font-semibold flex items-center space-x-1"
                          >
                            <Edit className="w-3 h-3" />
                            <span>Edit</span>
                          </button>
                          <button
                            onClick={() => {
                              if (confirm(`Are you sure you want to delete "${book.title}"?`)) {
                                onDeleteBook(book.id);
                                showStatus(`Deleted "${book.title}"`);
                              }
                            }}
                            className="p-1.5 rounded-lg bg-rose-950/60 hover:bg-rose-900 text-rose-300 border border-rose-800"
                            title="Delete Book"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          )}

          {/* TAB 3: QURAN VIDEOS MANAGEMENT */}
          {activeTab === 'videos' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs text-yellow-300 font-semibold px-1">
                <span>Manage Quran Video & Audio Recitations ({quranVideos.length})</span>
                <span>YouTube embeds and video gallery uploads supported</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {quranVideos
                  .filter(
                    (v) =>
                      !searchQuery ||
                      v.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                      v.reciter.toLowerCase().includes(searchQuery.toLowerCase())
                  )
                  .map((video, idx) => (
                    <div
                      key={video.id}
                      className="bg-[#0A0A0A] border border-[#0B6E4F] rounded-2xl p-4 flex flex-col justify-between space-y-3 hover:border-[#FFD700]/50 transition-all"
                    >
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs font-bold text-yellow-300">🎙 {video.reciter}</span>
                          <span className="text-[10px] font-mono text-emerald-300 bg-[#111827] px-2 py-0.5 rounded border border-[#0B6E4F]">
                            ⏱ {video.duration}
                          </span>
                        </div>
                        <h4 className="text-sm font-bold text-white mb-1">{video.title}</h4>
                        <p className="text-xs text-emerald-100/70 line-clamp-2">{video.description}</p>
                      </div>

                      <div className="pt-2 border-t border-[#0B6E4F] flex items-center justify-between">
                        {/* Reorder Buttons */}
                        <div className="flex items-center space-x-1">
                          <button
                            disabled={idx === 0}
                            onClick={() => {
                              if (!onReorderQuranVideos) return;
                              const newArr = [...quranVideos];
                              const temp = newArr[idx];
                              newArr[idx] = newArr[idx - 1];
                              newArr[idx - 1] = temp;
                              onReorderQuranVideos(newArr);
                            }}
                            className="p-1 rounded-md bg-[#111827] border border-[#0B6E4F] text-emerald-300 disabled:opacity-30 hover:bg-black"
                            title="Move Up"
                          >
                            <ArrowUp className="w-3 h-3" />
                          </button>
                          <button
                            disabled={idx === quranVideos.length - 1}
                            onClick={() => {
                              if (!onReorderQuranVideos) return;
                              const newArr = [...quranVideos];
                              const temp = newArr[idx];
                              newArr[idx] = newArr[idx + 1];
                              newArr[idx + 1] = temp;
                              onReorderQuranVideos(newArr);
                            }}
                            className="p-1 rounded-md bg-[#111827] border border-[#0B6E4F] text-emerald-300 disabled:opacity-30 hover:bg-black"
                            title="Move Down"
                          >
                            <ArrowDown className="w-3 h-3" />
                          </button>
                        </div>

                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => {
                              setEditItem({ type: 'Quran Video', data: video });
                              setIsAddMode(false);
                            }}
                            className="px-3 py-1.5 rounded-lg bg-[#111827] hover:bg-black border border-[#0B6E4F] text-yellow-300 text-xs font-semibold flex items-center space-x-1"
                          >
                            <Edit className="w-3 h-3" />
                            <span>Edit</span>
                          </button>
                          <button
                            onClick={() => {
                              if (confirm(`Are you sure you want to delete "${video.title}"?`)) {
                                onDeleteQuranVideo(video.id);
                                showStatus(`Deleted "${video.title}"`);
                              }
                            }}
                            className="p-1.5 rounded-lg bg-rose-950/60 hover:bg-rose-900 text-rose-300 border border-rose-800"
                            title="Delete Quran Video"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          )}

          {/* TAB 4: ISLAMIC ARTICLES MANAGEMENT */}
          {activeTab === 'articles' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs text-yellow-300 font-semibold px-1">
                <span>Manage Islamic Ethics Articles ({articles.length})</span>
                <span>Publish articles with custom rich content</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {articles
                  .filter(
                    (a) =>
                      !searchQuery ||
                      a.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                      a.category.toLowerCase().includes(searchQuery.toLowerCase())
                  )
                  .map((article, idx) => (
                    <div
                      key={article.id}
                      className="bg-[#0A0A0A] border border-[#0B6E4F] rounded-2xl p-4 flex flex-col justify-between space-y-3 hover:border-[#FFD700]/50 transition-all"
                    >
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-[10px] font-bold text-yellow-300 bg-[#111827] px-2 py-0.5 rounded border border-[#0B6E4F]">
                            {article.category}
                          </span>
                          <span className="text-[10px] text-emerald-300/70 font-mono">{article.readTime}</span>
                        </div>
                        <h4 className="text-sm font-bold text-white mb-1">{article.title}</h4>
                        <p className="text-xs text-emerald-100/70 line-clamp-2">{article.summary}</p>
                      </div>

                      <div className="pt-2 border-t border-[#0B6E4F] flex items-center justify-between">
                        {/* Reorder Buttons */}
                        <div className="flex items-center space-x-1">
                          <button
                            disabled={idx === 0}
                            onClick={() => {
                              if (!onReorderArticles) return;
                              const newArr = [...articles];
                              const temp = newArr[idx];
                              newArr[idx] = newArr[idx - 1];
                              newArr[idx - 1] = temp;
                              onReorderArticles(newArr);
                            }}
                            className="p-1 rounded-md bg-[#111827] border border-[#0B6E4F] text-emerald-300 disabled:opacity-30 hover:bg-black"
                            title="Move Up"
                          >
                            <ArrowUp className="w-3 h-3" />
                          </button>
                          <button
                            disabled={idx === articles.length - 1}
                            onClick={() => {
                              if (!onReorderArticles) return;
                              const newArr = [...articles];
                              const temp = newArr[idx];
                              newArr[idx] = newArr[idx + 1];
                              newArr[idx + 1] = temp;
                              onReorderArticles(newArr);
                            }}
                            className="p-1 rounded-md bg-[#111827] border border-[#0B6E4F] text-emerald-300 disabled:opacity-30 hover:bg-black"
                            title="Move Down"
                          >
                            <ArrowDown className="w-3 h-3" />
                          </button>
                        </div>

                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => {
                              setEditItem({ type: 'Article', data: article });
                              setIsAddMode(false);
                            }}
                            className="px-3 py-1.5 rounded-lg bg-[#111827] hover:bg-black border border-[#0B6E4F] text-yellow-300 text-xs font-semibold flex items-center space-x-1"
                          >
                            <Edit className="w-3 h-3" />
                            <span>Edit</span>
                          </button>
                          <button
                            onClick={() => {
                              if (confirm(`Are you sure you want to delete "${article.title}"?`)) {
                                onDeleteArticle(article.id);
                                showStatus(`Deleted "${article.title}"`);
                              }
                            }}
                            className="p-1.5 rounded-lg bg-rose-950/60 hover:bg-rose-900 text-rose-300 border border-rose-800"
                            title="Delete Article"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          )}

          {/* TAB 5: PROMPTS MANAGEMENT */}
          {activeTab === 'prompts' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs text-yellow-300 font-semibold px-1">
                <span>Manage AI Prompts Library ({prompts.length})</span>
                <span>Update text prompts for Veo, ChatGPT, Midjourney</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {prompts
                  .filter(
                    (p) =>
                      !searchQuery ||
                      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                      p.targetTool.toLowerCase().includes(searchQuery.toLowerCase())
                  )
                  .map((prompt, idx) => (
                    <div
                      key={prompt.id}
                      className="bg-[#0A0A0A] border border-[#0B6E4F] rounded-2xl p-4 flex flex-col justify-between space-y-3 hover:border-[#FFD700]/50 transition-all"
                    >
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-[10px] font-bold text-yellow-300 bg-[#111827] px-2.5 py-0.5 rounded border border-[#0B6E4F] capitalize">
                            {prompt.category}
                          </span>
                          <span className="text-[10px] text-emerald-200/80 font-mono">
                            Target: {prompt.targetTool}
                          </span>
                        </div>
                        <h4 className="text-sm font-bold text-white mb-1">{prompt.title}</h4>
                        <p className="text-xs text-emerald-100/70 font-mono bg-[#111827] p-2.5 rounded-xl border border-[#0B6E4F] line-clamp-3">
                          "{prompt.promptText}"
                        </p>
                      </div>

                      <div className="pt-2 border-t border-[#0B6E4F] flex items-center justify-between">
                        {/* Reorder Buttons */}
                        <div className="flex items-center space-x-1">
                          <button
                            disabled={idx === 0}
                            onClick={() => {
                              if (!onReorderPrompts) return;
                              const newArr = [...prompts];
                              const temp = newArr[idx];
                              newArr[idx] = newArr[idx - 1];
                              newArr[idx - 1] = temp;
                              onReorderPrompts(newArr);
                            }}
                            className="p-1 rounded-md bg-[#111827] border border-[#0B6E4F] text-emerald-300 disabled:opacity-30 hover:bg-black"
                            title="Move Up"
                          >
                            <ArrowUp className="w-3 h-3" />
                          </button>
                          <button
                            disabled={idx === prompts.length - 1}
                            onClick={() => {
                              if (!onReorderPrompts) return;
                              const newArr = [...prompts];
                              const temp = newArr[idx];
                              newArr[idx] = newArr[idx + 1];
                              newArr[idx + 1] = temp;
                              onReorderPrompts(newArr);
                            }}
                            className="p-1 rounded-md bg-[#111827] border border-[#0B6E4F] text-emerald-300 disabled:opacity-30 hover:bg-black"
                            title="Move Down"
                          >
                            <ArrowDown className="w-3 h-3" />
                          </button>
                        </div>

                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => {
                              setEditItem({ type: 'Prompt', data: prompt });
                              setIsAddMode(false);
                            }}
                            className="px-3 py-1.5 rounded-lg bg-[#111827] hover:bg-black border border-[#0B6E4F] text-yellow-300 text-xs font-semibold flex items-center space-x-1"
                          >
                            <Edit className="w-3 h-3" />
                            <span>Edit</span>
                          </button>
                          <button
                            onClick={() => {
                              if (confirm(`Are you sure you want to delete "${prompt.title}"?`)) {
                                onDeletePrompt(prompt.id);
                                showStatus(`Deleted "${prompt.title}"`);
                              }
                            }}
                            className="p-1.5 rounded-lg bg-rose-950/60 hover:bg-rose-900 text-rose-300 border border-rose-800"
                            title="Delete Prompt"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          )}

          {/* TAB 6: DUAS MANAGEMENT */}
          {activeTab === 'duas' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs text-yellow-300 font-semibold px-1">
                <span>Manage Duas & Azkar ({duas.length})</span>
                <span>Arabic, transliteration, and translation editing</span>
              </div>
              <div className="space-y-3">
                {duas
                  .filter(
                    (d) =>
                      !searchQuery ||
                      d.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                      d.category.toLowerCase().includes(searchQuery.toLowerCase())
                  )
                  .map((dua, idx) => (
                    <div
                      key={dua.id}
                      className="bg-[#0A0A0A] border border-[#0B6E4F] rounded-2xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:border-[#FFD700]/50 transition-all"
                    >
                      <div className="space-y-1 flex-1">
                        <div className="flex items-center space-x-2">
                          <span className="text-xs font-bold text-white">{dua.title}</span>
                          <span className="text-[10px] text-yellow-300 bg-[#111827] px-2 py-0.5 rounded border border-[#0B6E4F]">
                            {dua.category}
                          </span>
                        </div>
                        <p className="text-sm font-serif text-yellow-200 dir-rtl text-right font-semibold">{dua.arabic}</p>
                        <p className="text-xs text-emerald-200/80">{dua.english}</p>
                      </div>

                      <div className="flex items-center space-x-2 shrink-0">
                        {/* Reorder Buttons */}
                        <div className="flex items-center space-x-1 mr-2">
                          <button
                            disabled={idx === 0}
                            onClick={() => {
                              if (!onReorderDuas) return;
                              const newArr = [...duas];
                              const temp = newArr[idx];
                              newArr[idx] = newArr[idx - 1];
                              newArr[idx - 1] = temp;
                              onReorderDuas(newArr);
                            }}
                            className="p-1 rounded-md bg-[#111827] border border-[#0B6E4F] text-emerald-300 disabled:opacity-30 hover:bg-black"
                            title="Move Up"
                          >
                            <ArrowUp className="w-3 h-3" />
                          </button>
                          <button
                            disabled={idx === duas.length - 1}
                            onClick={() => {
                              if (!onReorderDuas) return;
                              const newArr = [...duas];
                              const temp = newArr[idx];
                              newArr[idx] = newArr[idx + 1];
                              newArr[idx + 1] = temp;
                              onReorderDuas(newArr);
                            }}
                            className="p-1 rounded-md bg-[#111827] border border-[#0B6E4F] text-emerald-300 disabled:opacity-30 hover:bg-black"
                            title="Move Down"
                          >
                            <ArrowDown className="w-3 h-3" />
                          </button>
                        </div>

                        <button
                          onClick={() => {
                            setEditItem({ type: 'Dua', data: dua });
                            setIsAddMode(false);
                          }}
                          className="px-3 py-1.5 rounded-lg bg-[#111827] hover:bg-black border border-[#0B6E4F] text-yellow-300 text-xs font-semibold flex items-center space-x-1"
                        >
                          <Edit className="w-3 h-3" />
                          <span>Edit</span>
                        </button>
                        <button
                          onClick={() => {
                            if (confirm(`Are you sure you want to delete "${dua.title}"?`)) {
                              onDeleteDua(dua.id);
                              showStatus(`Deleted "${dua.title}"`);
                            }
                          }}
                          className="p-1.5 rounded-lg bg-rose-950/60 hover:bg-rose-900 text-rose-300 border border-rose-800"
                          title="Delete Dua"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
};

// --- SUB-COMPONENTS FOR EDITING FORMS ---

function ToolForm({
  initialData,
  onSubmit,
  onFileUpload
}: {
  initialData?: AITool;
  onSubmit: (tool: AITool) => void;
  onFileUpload: (e: React.ChangeEvent<HTMLInputElement>, callback: (url: string) => void) => void;
}) {
  const [name, setName] = useState(initialData?.name || '');
  const [category, setCategory] = useState<ToolCategory>(initialData?.category || 'video');
  const [pricing, setPricing] = useState<PricingType>(initialData?.pricing || 'Free Plan');
  const [url, setUrl] = useState(initialData?.url || '');
  const [shortDesc, setShortDesc] = useState(initialData?.shortDescription || '');
  const [features, setFeatures] = useState(initialData?.features ? initialData.features.join(', ') : '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !url) return;
    onSubmit({
      id: initialData?.id || `tool-${Date.now()}`,
      name,
      category,
      pricing,
      url,
      shortDescription: shortDesc,
      features: features ? features.split(',').map((f) => f.trim()) : ['AI Tool'],
      rating: initialData?.rating || 4.8
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 text-xs">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="block text-emerald-200 font-semibold mb-1">Tool Name *</label>
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full bg-[#111827] border border-[#0B6E4F] rounded-xl p-2.5 text-white focus:outline-none focus:border-[#FFD700]"
          />
        </div>
        <div>
          <label className="block text-emerald-200 font-semibold mb-1">Category</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value as ToolCategory)}
            className="w-full bg-[#111827] border border-[#0B6E4F] rounded-xl p-2.5 text-white focus:outline-none"
          >
            <option value="video">🎬 AI Video</option>
            <option value="image">🖼 AI Image</option>
            <option value="writing">✍️ AI Writing</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="block text-emerald-200 font-semibold mb-1">Pricing Model</label>
          <select
            value={pricing}
            onChange={(e) => setPricing(e.target.value as PricingType)}
            className="w-full bg-[#111827] border border-[#0B6E4F] rounded-xl p-2.5 text-white focus:outline-none"
          >
            <option value="Free Plan">Free Plan</option>
            <option value="Free Credits">Free Credits</option>
            <option value="Free Trial">Free Trial</option>
            <option value="Freemium">Freemium</option>
          </select>
        </div>
        <div>
          <label className="block text-emerald-200 font-semibold mb-1">Official Website URL *</label>
          <input
            type="url"
            required
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="w-full bg-[#111827] border border-[#0B6E4F] rounded-xl p-2.5 text-white focus:outline-none focus:border-[#FFD700]"
          />
        </div>
      </div>

      <div>
        <label className="block text-emerald-200 font-semibold mb-1">Short Description</label>
        <textarea
          rows={2}
          value={shortDesc}
          onChange={(e) => setShortDesc(e.target.value)}
          className="w-full bg-[#111827] border border-[#0B6E4F] rounded-xl p-2.5 text-white focus:outline-none focus:border-[#FFD700]"
        />
      </div>

      <div>
        <label className="block text-emerald-200 font-semibold mb-1">Features (comma separated)</label>
        <input
          type="text"
          value={features}
          onChange={(e) => setFeatures(e.target.value)}
          placeholder="Cinematic, 1080p export, Fast rendering"
          className="w-full bg-[#111827] border border-[#0B6E4F] rounded-xl p-2.5 text-white focus:outline-none focus:border-[#FFD700]"
        />
      </div>

      <button
        type="submit"
        className="w-full py-2.5 rounded-xl bg-gradient-to-r from-[#FFD700] to-yellow-400 hover:from-yellow-200 hover:to-[#FFD700] text-slate-950 font-bold shadow-md shadow-[#FFD700]/20 transition-all cursor-pointer"
      >
        Save AI Tool
      </button>
    </form>
  );
}

function BookForm({
  initialData,
  onSubmit,
  onFileUpload
}: {
  initialData?: IslamicBook;
  onSubmit: (book: IslamicBook) => void;
  onFileUpload: (e: React.ChangeEvent<HTMLInputElement>, callback: (url: string, name?: string) => void) => void;
}) {
  const [title, setTitle] = useState(initialData?.title || '');
  const [author, setAuthor] = useState(initialData?.author || '');
  const [category, setCategory] = useState(initialData?.category || 'Islamic Studies');
  const [pages, setPages] = useState(initialData?.pages || '150');
  const [pdfUrl, setPdfUrl] = useState(initialData?.pdfUrl || '');
  const [description, setDescription] = useState(initialData?.description || '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !pdfUrl) return;
    onSubmit({
      id: initialData?.id || `book-${Date.now()}`,
      title,
      author: author || 'Islamic Scholar',
      category,
      pages,
      fileSize: initialData?.fileSize || '3.2 MB',
      pdfUrl,
      description: description || 'Authentic Islamic ebook.',
      icon: initialData?.icon || '📚',
      downloadCount: initialData?.downloadCount || 10
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 text-xs">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="block text-emerald-200 font-semibold mb-1">Book Title *</label>
          <input
            type="text"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full bg-[#111827] border border-[#0B6E4F] rounded-xl p-2.5 text-white focus:outline-none focus:border-[#FFD700]"
          />
        </div>
        <div>
          <label className="block text-emerald-200 font-semibold mb-1">Author Name</label>
          <input
            type="text"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            className="w-full bg-[#111827] border border-[#0B6E4F] rounded-xl p-2.5 text-white focus:outline-none"
          />
        </div>
      </div>

      <div>
        <label className="block text-emerald-200 font-semibold mb-1">PDF File URL or Local Upload *</label>
        <div className="flex gap-2">
          <input
            type="text"
            required
            value={pdfUrl}
            onChange={(e) => setPdfUrl(e.target.value)}
            placeholder="https://... .pdf"
            className="flex-1 bg-[#111827] border border-[#0B6E4F] rounded-xl p-2.5 text-white focus:outline-none focus:border-[#FFD700]"
          />
          <label className="px-3 py-2.5 rounded-xl bg-[#111827] border border-[#0B6E4F] text-yellow-300 font-bold text-xs cursor-pointer hover:bg-black flex items-center space-x-1 shrink-0">
            <Upload className="w-3.5 h-3.5 text-[#FFD700]" />
            <span>Upload PDF</span>
            <input
              type="file"
              accept=".pdf"
              className="hidden"
              onChange={(e) => onFileUpload(e, (url) => setPdfUrl(url))}
            />
          </label>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="block text-emerald-200 font-semibold mb-1">Category</label>
          <input
            type="text"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full bg-[#111827] border border-[#0B6E4F] rounded-xl p-2.5 text-white focus:outline-none"
          />
        </div>
        <div>
          <label className="block text-emerald-200 font-semibold mb-1">Pages Count</label>
          <input
            type="text"
            value={pages}
            onChange={(e) => setPages(e.target.value)}
            className="w-full bg-[#111827] border border-[#0B6E4F] rounded-xl p-2.5 text-white focus:outline-none"
          />
        </div>
      </div>

      <div>
        <label className="block text-emerald-200 font-semibold mb-1">Description</label>
        <textarea
          rows={2}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full bg-[#111827] border border-[#0B6E4F] rounded-xl p-2.5 text-white focus:outline-none"
        />
      </div>

      <button
        type="submit"
        className="w-full py-2.5 rounded-xl bg-gradient-to-r from-[#FFD700] to-yellow-400 hover:from-yellow-200 hover:to-[#FFD700] text-slate-950 font-bold shadow-md shadow-[#FFD700]/20 transition-all cursor-pointer"
      >
        Save PDF Book
      </button>
    </form>
  );
}

function QuranVideoForm({
  initialData,
  onSubmit,
  onFileUpload
}: {
  initialData?: QuranVideoRecitation;
  onSubmit: (video: QuranVideoRecitation) => void;
  onFileUpload: (e: React.ChangeEvent<HTMLInputElement>, callback: (url: string) => void) => void;
}) {
  const [title, setTitle] = useState(initialData?.title || '');
  const [reciter, setReciter] = useState(initialData?.reciter || '');
  const [surah, setSurah] = useState(initialData?.surah || '');
  const [duration, setDuration] = useState(initialData?.duration || '12:00');
  const [videoUrl, setVideoUrl] = useState(initialData?.videoUrl || '');
  const [youtubeEmbedUrl, setYoutubeEmbedUrl] = useState(initialData?.youtubeEmbedUrl || '');
  const [description, setDescription] = useState(initialData?.description || '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !reciter) return;

    // Convert standard youtube link to embed if needed
    let finalEmbed = youtubeEmbedUrl;
    if (!finalEmbed && videoUrl.includes('youtube.com/watch?v=')) {
      const vId = videoUrl.split('v=')[1]?.split('&')[0];
      if (vId) finalEmbed = `https://www.youtube-nocookie.com/embed/${vId}`;
    }

    onSubmit({
      id: initialData?.id || `qvid-${Date.now()}`,
      title,
      reciter,
      surah: surah || 'Surah Recitation',
      duration,
      videoUrl: videoUrl || 'https://www.youtube.com',
      youtubeEmbedUrl: finalEmbed || videoUrl,
      description: description || 'Visual Quran recitation video.',
      thumbnailIcon: initialData?.thumbnailIcon || '🕌'
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 text-xs">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="block text-emerald-200 font-semibold mb-1">Recitation Title *</label>
          <input
            type="text"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full bg-[#111827] border border-[#0B6E4F] rounded-xl p-2.5 text-white focus:outline-none focus:border-[#FFD700]"
          />
        </div>
        <div>
          <label className="block text-emerald-200 font-semibold mb-1">Reciter Name *</label>
          <input
            type="text"
            required
            value={reciter}
            onChange={(e) => setReciter(e.target.value)}
            placeholder="e.g. Mishary Rashid Alafasy"
            className="w-full bg-[#111827] border border-[#0B6E4F] rounded-xl p-2.5 text-white focus:outline-none focus:border-[#FFD700]"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="block text-emerald-200 font-semibold mb-1">Surah & Verse Reference</label>
          <input
            type="text"
            value={surah}
            onChange={(e) => setSurah(e.target.value)}
            placeholder="e.g. Surah Ar-Rahman (55)"
            className="w-full bg-[#111827] border border-[#0B6E4F] rounded-xl p-2.5 text-white focus:outline-none"
          />
        </div>
        <div>
          <label className="block text-emerald-200 font-semibold mb-1">Duration</label>
          <input
            type="text"
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
            placeholder="e.g. 14:20"
            className="w-full bg-[#111827] border border-[#0B6E4F] rounded-xl p-2.5 text-white focus:outline-none"
          />
        </div>
      </div>

      <div>
        <label className="block text-emerald-200 font-semibold mb-1">YouTube Video / Embed Link</label>
        <input
          type="text"
          value={videoUrl}
          onChange={(e) => setVideoUrl(e.target.value)}
          placeholder="https://www.youtube.com/watch?v=..."
          className="w-full bg-[#111827] border border-[#0B6E4F] rounded-xl p-2.5 text-white focus:outline-none focus:border-[#FFD700]"
        />
      </div>

      <div>
        <label className="block text-emerald-200 font-semibold mb-1">Description</label>
        <textarea
          rows={2}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full bg-[#111827] border border-[#0B6E4F] rounded-xl p-2.5 text-white focus:outline-none"
        />
      </div>

      <button
        type="submit"
        className="w-full py-2.5 rounded-xl bg-gradient-to-r from-[#FFD700] to-yellow-400 hover:from-yellow-200 hover:to-[#FFD700] text-slate-950 font-bold shadow-md shadow-[#FFD700]/20 transition-all cursor-pointer"
      >
        Save Quran Video
      </button>
    </form>
  );
}

function ArticleForm({
  initialData,
  onSubmit
}: {
  initialData?: IslamicArticle;
  onSubmit: (article: IslamicArticle) => void;
}) {
  const [title, setTitle] = useState(initialData?.title || '');
  const [category, setCategory] = useState(initialData?.category || 'AI & Islamic Ethics');
  const [author, setAuthor] = useState(initialData?.author || 'Islamic Tech Council');
  const [summary, setSummary] = useState(initialData?.summary || '');
  const [content, setContent] = useState(initialData?.content || '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !content) return;
    onSubmit({
      id: initialData?.id || `art-${Date.now()}`,
      title,
      category,
      author,
      readTime: initialData?.readTime || '4 min read',
      summary: summary || title,
      content,
      date: initialData?.date || new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 text-xs">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="block text-emerald-200 font-semibold mb-1">Article Title *</label>
          <input
            type="text"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full bg-[#111827] border border-[#0B6E4F] rounded-xl p-2.5 text-white focus:outline-none focus:border-[#FFD700]"
          />
        </div>
        <div>
          <label className="block text-emerald-200 font-semibold mb-1">Author / Scholar</label>
          <input
            type="text"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            className="w-full bg-[#111827] border border-[#0B6E4F] rounded-xl p-2.5 text-white focus:outline-none"
          />
        </div>
      </div>

      <div>
        <label className="block text-emerald-200 font-semibold mb-1">Short Summary</label>
        <input
          type="text"
          value={summary}
          onChange={(e) => setSummary(e.target.value)}
          className="w-full bg-[#111827] border border-[#0B6E4F] rounded-xl p-2.5 text-white focus:outline-none"
        />
      </div>

      <div>
        <label className="block text-emerald-200 font-semibold mb-1">Full Article Content *</label>
        <textarea
          rows={5}
          required
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Write or paste full article body..."
          className="w-full bg-[#111827] border border-[#0B6E4F] rounded-xl p-2.5 text-white focus:outline-none focus:border-[#FFD700]"
        />
      </div>

      <button
        type="submit"
        className="w-full py-2.5 rounded-xl bg-gradient-to-r from-[#FFD700] to-yellow-400 hover:from-yellow-200 hover:to-[#FFD700] text-slate-950 font-bold shadow-md shadow-[#FFD700]/20 transition-all cursor-pointer"
      >
        Publish Article
      </button>
    </form>
  );
}

function PromptForm({
  initialData,
  onSubmit
}: {
  initialData?: PromptItem;
  onSubmit: (prompt: PromptItem) => void;
}) {
  const [title, setTitle] = useState(initialData?.title || '');
  const [category, setCategory] = useState<'video' | 'image' | 'business'>(initialData?.category || 'video');
  const [targetTool, setTargetTool] = useState(initialData?.targetTool || 'Google Veo');
  const [promptText, setPromptText] = useState(initialData?.promptText || '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !promptText) return;
    onSubmit({
      id: initialData?.id || `prompt-${Date.now()}`,
      title,
      category,
      targetTool,
      promptText,
      tags: ['Verified', category]
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 text-xs">
      <div>
        <label className="block text-emerald-200 font-semibold mb-1">Prompt Title *</label>
        <input
          type="text"
          required
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full bg-[#111827] border border-[#0B6E4F] rounded-xl p-2.5 text-white focus:outline-none focus:border-[#FFD700]"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="block text-emerald-200 font-semibold mb-1">Category</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value as any)}
            className="w-full bg-[#111827] border border-[#0B6E4F] rounded-xl p-2.5 text-white focus:outline-none"
          >
            <option value="video">🎬 Video Prompt</option>
            <option value="image">🖼 Image Prompt</option>
            <option value="business">💼 Business Prompt</option>
          </select>
        </div>
        <div>
          <label className="block text-emerald-200 font-semibold mb-1">Target AI Tool</label>
          <input
            type="text"
            value={targetTool}
            onChange={(e) => setTargetTool(e.target.value)}
            placeholder="Google Veo, ChatGPT, Midjourney..."
            className="w-full bg-[#111827] border border-[#0B6E4F] rounded-xl p-2.5 text-white focus:outline-none"
          />
        </div>
      </div>

      <div>
        <label className="block text-emerald-200 font-semibold mb-1">Full Prompt Text *</label>
        <textarea
          rows={3}
          required
          value={promptText}
          onChange={(e) => setPromptText(e.target.value)}
          className="w-full bg-[#111827] border border-[#0B6E4F] rounded-xl p-2.5 text-white focus:outline-none font-mono focus:border-[#FFD700]"
        />
      </div>

      <button
        type="submit"
        className="w-full py-2.5 rounded-xl bg-gradient-to-r from-[#FFD700] to-yellow-400 hover:from-yellow-200 hover:to-[#FFD700] text-slate-950 font-bold shadow-md shadow-[#FFD700]/20 transition-all cursor-pointer"
      >
        Save Prompt
      </button>
    </form>
  );
}

function DuaForm({
  initialData,
  onSubmit
}: {
  initialData?: DuaItem;
  onSubmit: (dua: DuaItem) => void;
}) {
  const [title, setTitle] = useState(initialData?.title || '');
  const [category, setCategory] = useState<any>(initialData?.category || 'Daily Life');
  const [arabic, setArabic] = useState(initialData?.arabic || '');
  const [transliteration, setTransliteration] = useState(initialData?.transliteration || '');
  const [english, setEnglish] = useState(initialData?.english || '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !arabic) return;
    onSubmit({
      id: initialData?.id || `dua-${Date.now()}`,
      title,
      category,
      arabic,
      transliteration,
      english
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 text-xs">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="block text-emerald-200 font-semibold mb-1">Dua Title *</label>
          <input
            type="text"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full bg-[#111827] border border-[#0B6E4F] rounded-xl p-2.5 text-white focus:outline-none focus:border-[#FFD700]"
          />
        </div>
        <div>
          <label className="block text-emerald-200 font-semibold mb-1">Category</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full bg-[#111827] border border-[#0B6E4F] rounded-xl p-2.5 text-white focus:outline-none"
          >
            <option value="Morning & Evening">Morning & Evening</option>
            <option value="Protection & Safety">Protection & Safety</option>
            <option value="Daily Life">Daily Life</option>
            <option value="Praise & Gratitude">Praise & Gratitude</option>
          </select>
        </div>
      </div>

      <div>
        <label className="block text-emerald-200 font-semibold mb-1">Arabic Text *</label>
        <textarea
          rows={2}
          required
          value={arabic}
          onChange={(e) => setArabic(e.target.value)}
          className="w-full bg-[#111827] border border-[#0B6E4F] rounded-xl p-2.5 text-yellow-200 text-right focus:outline-none font-serif"
        />
      </div>

      <div>
        <label className="block text-emerald-200 font-semibold mb-1">Transliteration</label>
        <input
          type="text"
          value={transliteration}
          onChange={(e) => setTransliteration(e.target.value)}
          className="w-full bg-[#111827] border border-[#0B6E4F] rounded-xl p-2.5 text-white focus:outline-none"
        />
      </div>

      <div>
        <label className="block text-emerald-200 font-semibold mb-1">English Translation</label>
        <textarea
          rows={2}
          value={english}
          onChange={(e) => setEnglish(e.target.value)}
          className="w-full bg-[#111827] border border-[#0B6E4F] rounded-xl p-2.5 text-white focus:outline-none"
        />
      </div>

      <button
        type="submit"
        className="w-full py-2.5 rounded-xl bg-gradient-to-r from-[#FFD700] to-yellow-400 hover:from-yellow-200 hover:to-[#FFD700] text-slate-950 font-bold shadow-md shadow-[#FFD700]/20 transition-all cursor-pointer"
      >
        Save Dua
      </button>
    </form>
  );
}
