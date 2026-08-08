import React, { useState, useEffect } from 'react';
import { MainCategory, AITool, IslamicBook, DuaItem, PromptItem, UserState, IslamicArticle, QuranResource, QuranVideoRecitation } from './types';
import {
  INITIAL_AI_TOOLS,
  INITIAL_ISLAMIC_BOOKS,
  INITIAL_QURAN_RESOURCES,
  INITIAL_QURAN_VIDEOS,
  INITIAL_DUAS,
  INITIAL_ARTICLES,
  INITIAL_PROMPTS,
} from './data/initialData';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { ToolCard } from './components/ToolCard';
import { IslamicResourcesSection } from './components/IslamicResourcesSection';
import { PromptLibrarySection } from './components/PromptLibrarySection';
import { AIFinderWizard } from './components/AIFinderWizard';
import { LoginModal } from './components/LoginModal';
import { AddResourceModal } from './components/AddResourceModal';
import { ToolDetailModal } from './components/ToolDetailModal';
import { AdminDashboardModal } from './components/AdminDashboardModal';
import { LegalPageModal } from './components/LegalPageModal';
import { Footer } from './components/Footer';
import { Sparkles, Video, Image as ImageIcon, PenTool, Bookmark, Search, Moon, Heart, ArrowLeft, Plus } from 'lucide-react';
import { fetchBooks, createBook, updateBook, deleteBook } from './lib/booksApi';
import { fetchPrompts, createPrompt, updatePrompt, deletePrompt } from './lib/promptsApi';
import { supabase } from './lib/supabaseClient';
import { getCurrentUserState, signOut, userStateFromSession } from './lib/authApi';

export default function App() {
  const [activeCategory, setActiveCategory] = useState<MainCategory>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // AI Search — sends the query to Gemini via the secure server-side route
  // at /api/ai-search (src/../api/ai-search.ts), which reads the API key
  // from the ISAI__KEY environment variable on the server. The key is
  // never present in this frontend code or the built browser bundle.
  const [aiAnswer, setAiAnswer] = useState<string | null>(null);
  const [aiAnswerQuery, setAiAnswerQuery] = useState('');
  const [aiAnswerLoading, setAiAnswerLoading] = useState(false);
  const [aiAnswerError, setAiAnswerError] = useState<string | null>(null);

  const handleAskAI = async (query: string) => {
    const trimmed = query.trim();
    if (!trimmed) return;

    setAiAnswerLoading(true);
    setAiAnswerError(null);
    setAiAnswer(null);
    setAiAnswerQuery(trimmed);

    try {
      const response = await fetch(`/api/ai-search?q=${encodeURIComponent(trimmed)}`);
      const data = await response.json().catch(() => null);

      if (!response.ok) {
        // Surface the server's specific error message (e.g. missing
        // ISAI__KEY, or a Gemini failure) instead of failing silently.
        throw new Error(data?.error || `AI Search failed (status ${response.status}).`);
      }
      if (!data?.text) {
        throw new Error('AI Search returned an empty response. Please try again.');
      }

      setAiAnswer(data.text);
    } catch (err) {
      setAiAnswerError(err instanceof Error ? err.message : 'AI Search failed. Please try again.');
    } finally {
      setAiAnswerLoading(false);
    }
  };

  // Clear any AI answer/error once the search box itself is cleared, so a
  // stale answer doesn't linger after the user backs out of a search.
  useEffect(() => {
    if (!searchQuery) {
      setAiAnswer(null);
      setAiAnswerError(null);
      setAiAnswerLoading(false);
    }
  }, [searchQuery]);

  // Persistent State
  const [aiTools, setAiTools] = useState<AITool[]>(() => {
    const local = localStorage.getItem('isaihub_tools');
    return local ? JSON.parse(local) : INITIAL_AI_TOOLS;
  });

  const [books, setBooks] = useState<IslamicBook[]>(INITIAL_ISLAMIC_BOOKS);

  const [duas, setDuas] = useState<DuaItem[]>(() => {
    const local = localStorage.getItem('isaihub_duas');
    return local ? JSON.parse(local) : INITIAL_DUAS;
  });

  // Tool Prompts are persisted in Supabase (see src/lib/promptsApi.ts), not
  // localStorage, so an Admin's Add/Edit/Delete is saved online and reaches
  // every member the next time the app loads — including members who
  // already have the PWA installed, with no reinstall or update needed.
  const [prompts, setPrompts] = useState<PromptItem[]>(INITIAL_PROMPTS);

  const [articles, setArticles] = useState<IslamicArticle[]>(() => {
    const local = localStorage.getItem('isaihub_articles');
    return local ? JSON.parse(local) : INITIAL_ARTICLES;
  });

  const [quranVideos, setQuranVideos] = useState<QuranVideoRecitation[]>(() => {
    const local = localStorage.getItem('isaihub_quran_videos');
    return local ? JSON.parse(local) : INITIAL_QURAN_VIDEOS;
  });

  const [savedToolIds, setSavedToolIds] = useState<string[]>(() => {
    const local = localStorage.getItem('isaihub_saved_tools');
    return local ? JSON.parse(local) : [];
  });

  // Auth state (who's logged in, and whether they're Admin) is NOT trusted
  // from localStorage — anyone could edit that in devtools. It is always
  // re-derived from the live Supabase Auth session + that session's row in
  // the `profiles` table (see src/lib/authApi.ts), so "isAdmin" here can
  // only ever be true if the database itself says so.
  const [userState, setUserState] = useState<UserState>({
    isLoggedIn: false,
    isAdmin: false,
    username: '',
    savedToolIds: [],
    savedPromptIds: [],
  });

  // On first load, restore any existing Supabase session and look up its
  // role from the database. Also subscribe so login/logout in another tab
  // (or a token refresh) keeps this in sync.
  useEffect(() => {
    let cancelled = false;

    getCurrentUserState().then((restored) => {
      if (!cancelled && restored) setUserState(restored);
    });

    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_OUT' || !session) {
        setUserState({ isLoggedIn: false, isAdmin: false, username: '', savedToolIds: [], savedPromptIds: [] });
        return;
      }
      userStateFromSession(session.user.id, session.user.email || 'Member').then((next) => {
        if (!cancelled) setUserState(next);
      });
    });

    return () => {
      cancelled = true;
      authListener.subscription.unsubscribe();
    };
  }, []);

  // Modal Controls
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isWizardOpen, setIsWizardOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isAdminDashboardOpen, setIsAdminDashboardOpen] = useState(false);
  const [legalPageOpen, setLegalPageOpen] = useState<'privacy' | 'terms' | null>(null);
  const [addResourceType, setAddResourceType] = useState<'tool' | 'book' | 'dua' | 'article' | 'prompt'>('tool');
  const [selectedToolForModal, setSelectedToolForModal] = useState<AITool | null>(null);

  // Sync state to LocalStorage
  useEffect(() => {
    localStorage.setItem('isaihub_tools', JSON.stringify(aiTools));
  }, [aiTools]);

  // Islamic Books are persisted in Supabase (see src/lib/booksApi.ts), not
  // localStorage. Fetch the current library once on mount so it reflects
  // whatever is stored in the `books` table / Storage buckets.
  useEffect(() => {
    let cancelled = false;
    fetchBooks()
      .then((remoteBooks) => {
        if (!cancelled) setBooks(remoteBooks);
      })
      .catch((err) => {
        // eslint-disable-next-line no-console
        console.warn('Could not load Islamic Books from Supabase, showing defaults:', err.message || err);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  // Fetch the current Tool Prompt library from Supabase once on mount so it
  // reflects whatever the Admin most recently saved — this is what makes
  // already-installed member PWAs pick up new/updated prompts automatically.
  useEffect(() => {
    let cancelled = false;
    fetchPrompts()
      .then((remotePrompts) => {
        if (!cancelled) setPrompts(remotePrompts);
      })
      .catch((err) => {
        // eslint-disable-next-line no-console
        console.warn('Could not load Tool Prompts from Supabase, showing defaults:', err.message || err);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    localStorage.setItem('isaihub_duas', JSON.stringify(duas));
  }, [duas]);

  useEffect(() => {
    localStorage.setItem('isaihub_articles', JSON.stringify(articles));
  }, [articles]);

  useEffect(() => {
    localStorage.setItem('isaihub_quran_videos', JSON.stringify(quranVideos));
  }, [quranVideos]);

  useEffect(() => {
    localStorage.setItem('isaihub_saved_tools', JSON.stringify(savedToolIds));
  }, [savedToolIds]);

  // Toggle Save Tool
  const handleToggleSaveTool = (id: string) => {
    setSavedToolIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  // --- FULL CRUD & REORDER HANDLERS FOR ADMIN ---
  // AI Tools
  const handleAddTool = (newTool: AITool) => {
    setAiTools((prev) => [newTool, ...prev]);
  };
  const handleUpdateTool = (updated: AITool) => {
    setAiTools((prev) => prev.map((item) => (item.id === updated.id ? updated : item)));
  };
  const handleDeleteTool = (id: string) => {
    setAiTools((prev) => prev.filter((item) => item.id !== id));
  };
  const handleReorderTools = (reordered: AITool[]) => {
    setAiTools(reordered);
  };

  // Books — persisted to Supabase (table `books`, storage buckets
  // `book-pdfs` and `book-covers`). Uploaded files are read as data URLs by
  // the UI and are uploaded to Storage here before saving the row.
  const handleAddBook = (newBook: IslamicBook) => {
    // Optimistic UI update so the admin sees the book immediately.
    setBooks((prev) => [newBook, ...prev]);
    createBook(newBook)
      .then((saved) => {
        setBooks((prev) => prev.map((item) => (item.id === newBook.id ? saved : item)));
      })
      .catch((err) => {
        // eslint-disable-next-line no-console
        console.error('Failed to save book to Supabase:', err.message || err);
      });
  };
  const handleUpdateBook = (updated: IslamicBook) => {
    const previous = books.find((item) => item.id === updated.id);
    setBooks((prev) => prev.map((item) => (item.id === updated.id ? updated : item)));
    updateBook(updated, previous)
      .then((saved) => {
        setBooks((prev) => prev.map((item) => (item.id === saved.id ? saved : item)));
      })
      .catch((err) => {
        // eslint-disable-next-line no-console
        console.error('Failed to update book in Supabase:', err.message || err);
      });
  };
  const handleDeleteBook = (id: string) => {
    const target = books.find((item) => item.id === id);
    setBooks((prev) => prev.filter((item) => item.id !== id));
    if (!target) return;
    deleteBook(target).catch((err) => {
      // eslint-disable-next-line no-console
      console.error('Failed to delete book from Supabase:', err.message || err);
    });
  };
  const handleReorderBooks = (reordered: IslamicBook[]) => {
    setBooks(reordered);
  };

  // Prompts — persisted to Supabase (table `prompts`) so every Add/Edit/
  // Delete the Admin makes is saved online and shows up for existing
  // members' installed PWAs without needing a reinstall or update.
  const handleAddPrompt = (newPrompt: PromptItem) => {
    // Optimistic UI update so the admin sees the new prompt immediately.
    setPrompts((prev) => [newPrompt, ...prev]);
    createPrompt(newPrompt)
      .then((saved) => {
        setPrompts((prev) => prev.map((item) => (item.id === newPrompt.id ? saved : item)));
      })
      .catch((err) => {
        // eslint-disable-next-line no-console
        console.error('Failed to save Tool Prompt to Supabase:', err.message || err);
      });
  };
  const handleUpdatePrompt = (updated: PromptItem) => {
    setPrompts((prev) => prev.map((item) => (item.id === updated.id ? updated : item)));
    updatePrompt(updated)
      .then((saved) => {
        setPrompts((prev) => prev.map((item) => (item.id === saved.id ? saved : item)));
      })
      .catch((err) => {
        // eslint-disable-next-line no-console
        console.error('Failed to update Tool Prompt in Supabase:', err.message || err);
      });
  };
  const handleDeletePrompt = (id: string) => {
    setPrompts((prev) => prev.filter((item) => item.id !== id));
    deletePrompt(id).catch((err) => {
      // eslint-disable-next-line no-console
      console.error('Failed to delete Tool Prompt from Supabase:', err.message || err);
    });
  };
  const handleReorderPrompts = (reordered: PromptItem[]) => {
    setPrompts(reordered);
  };

  // Quran Videos
  const handleAddQuranVideo = (newVideo: QuranVideoRecitation) => {
    setQuranVideos((prev) => [newVideo, ...prev]);
  };
  const handleUpdateQuranVideo = (updated: QuranVideoRecitation) => {
    setQuranVideos((prev) => prev.map((item) => (item.id === updated.id ? updated : item)));
  };
  const handleDeleteQuranVideo = (id: string) => {
    setQuranVideos((prev) => prev.filter((item) => item.id !== id));
  };
  const handleReorderQuranVideos = (reordered: QuranVideoRecitation[]) => {
    setQuranVideos(reordered);
  };

  // Articles
  const handleAddArticle = (newArt: IslamicArticle) => {
    setArticles((prev) => [newArt, ...prev]);
  };
  const handleUpdateArticle = (updated: IslamicArticle) => {
    setArticles((prev) => prev.map((item) => (item.id === updated.id ? updated : item)));
  };
  const handleDeleteArticle = (id: string) => {
    setArticles((prev) => prev.filter((item) => item.id !== id));
  };
  const handleReorderArticles = (reordered: IslamicArticle[]) => {
    setArticles(reordered);
  };

  // Duas
  const handleAddDua = (newDua: DuaItem) => {
    setDuas((prev) => [newDua, ...prev]);
  };
  const handleUpdateDua = (updated: DuaItem) => {
    setDuas((prev) => prev.map((item) => (item.id === updated.id ? updated : item)));
  };
  const handleDeleteDua = (id: string) => {
    setDuas((prev) => prev.filter((item) => item.id !== id));
  };
  const handleReorderDuas = (reordered: DuaItem[]) => {
    setDuas(reordered);
  };

  const handleOpenAddModal = (type: 'tool' | 'book' | 'dua' | 'article' | 'prompt') => {
    setAddResourceType(type);
    setIsAddModalOpen(true);
  };

  const handleOpenAdminPanel = () => {
    if (userState.isAdmin) {
      setIsAdminDashboardOpen(true);
    } else {
      setIsLoginOpen(true);
    }
  };

  const handleLogout = () => {
    signOut();
    setUserState({ isLoggedIn: false, isAdmin: false, username: '', savedToolIds: [], savedPromptIds: [] });
    setIsAdminDashboardOpen(false);
  };

  // Filter tools by search query and category
  const filterTools = (category?: 'video' | 'image' | 'writing') => {
    return aiTools.filter((tool) => {
      if (category && tool.category !== category) return false;
      if (!searchQuery) return true;
      const q = searchQuery.toLowerCase();
      return (
        tool.name.toLowerCase().includes(q) ||
        tool.shortDescription.toLowerCase().includes(q) ||
        tool.features.some((f) => f.toLowerCase().includes(q))
      );
    });
  };

  const videoTools = filterTools('video');
  const imageTools = filterTools('image');
  const writingTools = filterTools('writing');
  const savedToolsList = aiTools.filter((t) => savedToolIds.includes(t.id));

  return (
    <div className="min-h-screen bg-[#050b08] text-emerald-100 flex flex-col font-sans selection:bg-amber-500 selection:text-black">
      
      {/* Header */}
      <Header
        activeCategory={activeCategory}
        setActiveCategory={setActiveCategory}
        savedCount={savedToolIds.length}
        userState={userState}
        onOpenLogin={() => setIsLoginOpen(true)}
        onLogout={handleLogout}
        onOpenWizard={() => setIsWizardOpen(true)}
        onOpenAdminDashboard={handleOpenAdminPanel}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />

      {/* Hero Section */}
      <Hero
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        activeCategory={activeCategory}
        setActiveCategory={setActiveCategory}
        onOpenWizard={() => setIsWizardOpen(true)}
        onAskAI={handleAskAI}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
        
        {/* Clear Back Arrow Header when filtering or searching */}
        {(activeCategory !== 'all' || searchQuery) && (
          <div className="flex items-center justify-between bg-[#07251a] border border-amber-500/30 rounded-2xl p-3.5 px-5 shadow-lg mb-4">
            <button
              onClick={() => {
                setActiveCategory('all');
                setSearchQuery('');
              }}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-bold text-xs flex items-center space-x-2 shadow transition-all"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>← Back to All Resources</span>
            </button>
            <span className="text-xs font-bold text-amber-300 capitalize">
              Viewing: {activeCategory === 'saved' ? 'Saved Bookmarks' : activeCategory === 'video' ? 'AI Video Tools' : activeCategory === 'image' ? 'AI Image Tools' : activeCategory === 'islamic' ? 'Islamic Resources' : activeCategory === 'writing' ? 'AI Writing Tools' : activeCategory === 'prompts' ? 'Prompt Library' : 'Search Results'}
            </span>
          </div>
        )}

        {/* AI Search — answer/loading/error for a submitted AI Search query */}
        {(aiAnswerLoading || aiAnswer || aiAnswerError) && (
          <div className="bg-[#111827] border border-[#FFD700]/30 rounded-2xl p-5 sm:p-6 shadow-[0_0_25px_rgba(255,215,0,0.12)] space-y-2">
            <div className="flex items-center space-x-2 text-amber-300 text-xs font-bold uppercase tracking-wide">
              <Sparkles className="w-4 h-4" />
              <span>AI Search{aiAnswerQuery ? `: "${aiAnswerQuery}"` : ''}</span>
            </div>
            {aiAnswerLoading && (
              <p className="text-sm text-emerald-200/80 animate-pulse">Asking Gemini…</p>
            )}
            {aiAnswerError && (
              <p className="text-sm text-red-400">{aiAnswerError}</p>
            )}
            {aiAnswer && !aiAnswerLoading && (
              <p className="text-sm text-emerald-100 whitespace-pre-wrap leading-relaxed">{aiAnswer}</p>
            )}
          </div>
        )}

        {/* --- CATEGORY 1: AI VIDEO TOOLS --- */}
        {(activeCategory === 'all' || activeCategory === 'video') && videoTools.length > 0 && (
          <section id="video-section" className="space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-emerald-900/80 flex-wrap gap-2">
              <div className="flex items-center space-x-2.5">
                <div className="p-2 bg-amber-500/10 rounded-xl border border-amber-500/30 text-amber-400">
                  <Video className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold text-white font-serif">
                    🎬 AI Video Tools
                  </h2>
                  <p className="text-xs text-amber-200/70">Text-to-video, cinematic clips, and automated editing</p>
                </div>
              </div>

              {userState.isAdmin && (
                <button
                  onClick={() => {
                    setAddResourceType('tool');
                    setIsAddModalOpen(true);
                  }}
                  className="px-3.5 py-2 rounded-xl bg-[#0B6E4F]/40 hover:bg-[#0B6E4F] border border-[#FFD700]/50 text-yellow-300 font-bold text-xs flex items-center space-x-1.5 transition-all shadow-md cursor-pointer"
                >
                  <Plus className="w-4 h-4 text-[#FFD700]" />
                  <span>Add AI Video Tool</span>
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {videoTools.map((tool) => (
                <ToolCard
                  key={tool.id}
                  tool={tool}
                  isSaved={savedToolIds.includes(tool.id)}
                  onToggleSave={handleToggleSaveTool}
                  onSelectTool={(t) => setSelectedToolForModal(t)}
                  onEdit={(t) => {
                    handleOpenAdminPanel();
                  }}
                  onDelete={(id) => handleDeleteTool(id)}
                  isAdmin={userState.isAdmin}
                />
              ))}
            </div>
          </section>
        )}

        {/* --- CATEGORY 2: AI IMAGE TOOLS --- */}
        {(activeCategory === 'all' || activeCategory === 'image') && imageTools.length > 0 && (
          <section id="image-section" className="space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-emerald-900/80 flex-wrap gap-2">
              <div className="flex items-center space-x-2.5">
                <div className="p-2 bg-amber-500/10 rounded-xl border border-amber-500/30 text-amber-400">
                  <ImageIcon className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold text-white font-serif">
                    🖼 AI Image Tools
                  </h2>
                  <p className="text-xs text-amber-200/70">Generative artwork, typography, logos, and photos</p>
                </div>
              </div>

              {userState.isAdmin && (
                <button
                  onClick={() => {
                    setAddResourceType('tool');
                    setIsAddModalOpen(true);
                  }}
                  className="px-3.5 py-2 rounded-xl bg-[#0B6E4F]/40 hover:bg-[#0B6E4F] border border-[#FFD700]/50 text-yellow-300 font-bold text-xs flex items-center space-x-1.5 transition-all shadow-md cursor-pointer"
                >
                  <Plus className="w-4 h-4 text-[#FFD700]" />
                  <span>Add AI Image Tool</span>
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {imageTools.map((tool) => (
                <ToolCard
                  key={tool.id}
                  tool={tool}
                  isSaved={savedToolIds.includes(tool.id)}
                  onToggleSave={handleToggleSaveTool}
                  onSelectTool={(t) => setSelectedToolForModal(t)}
                  onEdit={(t) => {
                    handleOpenAdminPanel();
                  }}
                  onDelete={(id) => handleDeleteTool(id)}
                  isAdmin={userState.isAdmin}
                />
              ))}
            </div>
          </section>
        )}

        {/* --- CATEGORY 3: ISLAMIC RESOURCES SECTION --- */}
        {(activeCategory === 'all' || activeCategory === 'islamic') && (
          <IslamicResourcesSection
            books={books}
            quranResources={INITIAL_QURAN_RESOURCES}
            quranVideos={quranVideos}
            duas={duas}
            articles={articles}
            userState={userState}
            onOpenAddModal={(type) => handleOpenAddModal(type)}
            onDeleteBook={handleDeleteBook}
            onEditBook={() => handleOpenAdminPanel()}
          />
        )}

        {/* --- CATEGORY 4: AI WRITING TOOLS --- */}
        {(activeCategory === 'all' || activeCategory === 'writing') && writingTools.length > 0 && (
          <section id="writing-section" className="space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-emerald-900/80 flex-wrap gap-2">
              <div className="flex items-center space-x-2.5">
                <div className="p-2 bg-amber-500/10 rounded-xl border border-amber-500/30 text-amber-400">
                  <PenTool className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold text-white font-serif">
                    ✍️ AI Writing Tools
                  </h2>
                  <p className="text-xs text-amber-200/70">Smart conversational assistants, research & copywriting</p>
                </div>
              </div>

              {userState.isAdmin && (
                <button
                  onClick={() => {
                    setAddResourceType('tool');
                    setIsAddModalOpen(true);
                  }}
                  className="px-3.5 py-2 rounded-xl bg-[#0B6E4F]/40 hover:bg-[#0B6E4F] border border-[#FFD700]/50 text-yellow-300 font-bold text-xs flex items-center space-x-1.5 transition-all shadow-md cursor-pointer"
                >
                  <Plus className="w-4 h-4 text-[#FFD700]" />
                  <span>Add AI Writing Tool</span>
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {writingTools.map((tool) => (
                <ToolCard
                  key={tool.id}
                  tool={tool}
                  isSaved={savedToolIds.includes(tool.id)}
                  onToggleSave={handleToggleSaveTool}
                  onSelectTool={(t) => setSelectedToolForModal(t)}
                  onEdit={(t) => {
                    handleOpenAdminPanel();
                  }}
                  onDelete={(id) => handleDeleteTool(id)}
                  isAdmin={userState.isAdmin}
                />
              ))}
            </div>
          </section>
        )}

        {/* --- CATEGORY 5: PROMPT LIBRARY SECTION --- */}
        {(activeCategory === 'all' || activeCategory === 'prompts') && (
          <PromptLibrarySection
            prompts={prompts}
            userState={userState}
            onOpenAddModal={() => handleOpenAddModal('prompt')}
          />
        )}

        {/* --- CATEGORY 6: SAVED ITEMS VIEW --- */}
        {activeCategory === 'saved' && (
          <section className="space-y-6 min-h-[50vh]">
            <div className="flex items-center justify-between pb-3 border-b border-emerald-900/80">
              <div className="flex items-center space-x-2.5">
                <Bookmark className="w-6 h-6 text-amber-400" />
                <div>
                  <h2 className="text-2xl font-bold text-white font-serif">⭐ Your Saved Items</h2>
                  <p className="text-xs text-amber-200/70">Quick bookmark list of your favorite AI tools</p>
                </div>
              </div>
            </div>

            {savedToolsList.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                {savedToolsList.map((tool) => (
                  <ToolCard
                    key={tool.id}
                    tool={tool}
                    isSaved={true}
                    onToggleSave={handleToggleSaveTool}
                    onSelectTool={(t) => setSelectedToolForModal(t)}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-16 bg-[#08261b] rounded-3xl border border-emerald-800 p-8 space-y-4">
                <Bookmark className="w-12 h-12 text-emerald-600 mx-auto" />
                <h3 className="text-lg font-bold text-white">No Saved Items Yet</h3>
                <p className="text-xs text-emerald-200/70 max-w-md mx-auto">
                  Click the bookmark icon on any AI tool card to save it here for fast access.
                </p>
                <button
                  onClick={() => setActiveCategory('all')}
                  className="px-6 py-2.5 rounded-xl bg-amber-400 text-slate-950 font-bold text-xs inline-block"
                >
                  Explore Free AI Tools
                </button>
              </div>
            )}
          </section>
        )}

      </main>

      {/* Footer */}
      <Footer
        setActiveCategory={setActiveCategory}
        onOpenAdmin={handleOpenAdminPanel}
        onOpenPrivacyPolicy={() => setLegalPageOpen('privacy')}
        onOpenTerms={() => setLegalPageOpen('terms')}
      />

      {/* MODALS */}
      <AIFinderWizard
        isOpen={isWizardOpen}
        onClose={() => setIsWizardOpen(false)}
        tools={aiTools}
        onSelectCategory={setActiveCategory}
      />

      <LoginModal
        isOpen={isLoginOpen}
        onClose={() => setIsLoginOpen(false)}
        onLoginSuccess={(u) => setUserState(u)}
      />

      <AddResourceModal
        isOpen={isAddModalOpen}
        resourceType={addResourceType}
        onClose={() => setIsAddModalOpen(false)}
        onAddTool={handleAddTool}
        onAddBook={handleAddBook}
        onAddDua={handleAddDua}
        onAddPrompt={handleAddPrompt}
      />

      <ToolDetailModal
        tool={selectedToolForModal}
        onClose={() => setSelectedToolForModal(null)}
      />

      <AdminDashboardModal
        isOpen={isAdminDashboardOpen}
        onClose={() => setIsAdminDashboardOpen(false)}
        aiTools={aiTools}
        onAddTool={handleAddTool}
        onUpdateTool={handleUpdateTool}
        onDeleteTool={handleDeleteTool}
        onReorderTools={handleReorderTools}
        books={books}
        onAddBook={handleAddBook}
        onUpdateBook={handleUpdateBook}
        onDeleteBook={handleDeleteBook}
        onReorderBooks={handleReorderBooks}
        prompts={prompts}
        onAddPrompt={handleAddPrompt}
        onUpdatePrompt={handleUpdatePrompt}
        onDeletePrompt={handleDeletePrompt}
        onReorderPrompts={handleReorderPrompts}
        quranVideos={quranVideos}
        onAddQuranVideo={handleAddQuranVideo}
        onUpdateQuranVideo={handleUpdateQuranVideo}
        onDeleteQuranVideo={handleDeleteQuranVideo}
        onReorderQuranVideos={handleReorderQuranVideos}
        articles={articles}
        onAddArticle={handleAddArticle}
        onUpdateArticle={handleUpdateArticle}
        onDeleteArticle={handleDeleteArticle}
        onReorderArticles={handleReorderArticles}
        duas={duas}
        onAddDua={handleAddDua}
        onUpdateDua={handleUpdateDua}
        onDeleteDua={handleDeleteDua}
        onReorderDuas={handleReorderDuas}
      />

      <LegalPageModal
        type={legalPageOpen}
        onClose={() => setLegalPageOpen(null)}
      />

    </div>
  );
}
