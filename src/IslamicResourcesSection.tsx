import React, { useState } from 'react';
import { IslamicBook, QuranResource, DuaItem, IslamicArticle, UserState, QuranVideoRecitation } from '../types';
import { INITIAL_QURAN_VIDEOS } from '../data/initialData';
import { BookOpen, Download, ExternalLink, Copy, Check, Volume2, Plus, Sparkles, Heart, FileText, Search, Moon, Play, Video, X, Trash2, Edit, Info } from 'lucide-react';

interface IslamicResourcesProps {
  books: IslamicBook[];
  quranResources: QuranResource[];
  quranVideos?: QuranVideoRecitation[];
  duas: DuaItem[];
  articles: IslamicArticle[];
  userState: UserState;
  onOpenAddModal: (resourceType: 'book' | 'dua' | 'article') => void;
  onDeleteBook?: (id: string) => void;
  onEditBook?: (book: IslamicBook) => void;
}

export const IslamicResourcesSection: React.FC<IslamicResourcesProps> = ({
  books,
  quranResources,
  quranVideos = INITIAL_QURAN_VIDEOS,
  duas,
  articles,
  userState,
  onOpenAddModal,
  onDeleteBook,
  onEditBook,
}) => {
  const [activeTab, setActiveTab] = useState<'books' | 'quran' | 'quran-videos' | 'duas' | 'articles'>('books');
  const [selectedBook, setSelectedBook] = useState<IslamicBook | null>(null);
  const [selectedArticle, setSelectedArticle] = useState<IslamicArticle | null>(null);
  const [selectedVideo, setSelectedVideo] = useState<QuranVideoRecitation | null>(null);
  const [copiedDuaId, setCopiedDuaId] = useState<string | null>(null);
  const [playingAudioId, setPlayingAudioId] = useState<string | null>(null);
  const [duaFilter, setDuaFilter] = useState<string>('All');
  
  // Book Search state
  const [bookSearchQuery, setBookSearchQuery] = useState('');

  const handleCopyDua = (dua: DuaItem) => {
    const textToCopy = `${dua.title}\n\nArabic:\n${dua.arabic}\n\nTransliteration:\n${dua.transliteration}\n\nTranslation:\n${dua.english}\n\nReference: ${dua.reference || 'Islamic Supplications'}`;
    navigator.clipboard.writeText(textToCopy);
    setCopiedDuaId(dua.id);
    setTimeout(() => setCopiedDuaId(null), 2000);
  };

  const handlePlayAudio = (id: string) => {
    setPlayingAudioId(id);
    setTimeout(() => setPlayingAudioId(null), 3000);
  };

  const filteredDuas = duaFilter === 'All' 
    ? duas 
    : duas.filter(d => d.category === duaFilter);

  // Filter books by bookSearchQuery. Guards each field with `|| ''` so a
  // book missing a field (e.g. no description yet) can't throw and break
  // search for every other book.
  const filteredBooks = books.filter((b) => {
    if (!bookSearchQuery.trim()) return true;
    const q = bookSearchQuery.toLowerCase();
    return (
      (b.title || '').toLowerCase().includes(q) ||
      (b.author || '').toLowerCase().includes(q) ||
      (b.category || '').toLowerCase().includes(q) ||
      (b.description || '').toLowerCase().includes(q)
    );
  });

  return (
    <div id="islamic-section" className="bg-[#111827] border border-[#FFD700]/30 rounded-3xl p-5 sm:p-8 shadow-[0_0_30px_rgba(255,215,0,0.12)] relative overflow-hidden my-8">
      
      {/* Decorative Gold Glow Accent */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-[#FFD700]/10 blur-[120px] rounded-full pointer-events-none" />

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 pb-6 border-b border-[#0B6E4F]">
        <div>
          <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-[#0B6E4F]/40 border border-[#FFD700]/40 text-yellow-300 text-xs font-semibold mb-2 shadow-inner">
            <Moon className="w-3.5 h-3.5 text-[#FFD700] fill-[#FFD700]/20" />
            <span>Islamic Resources</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white font-serif tracking-tight">
            Authentic <span className="text-gold-gradient">Islamic Digital Library</span>
          </h2>
          <p className="text-xs sm:text-sm text-emerald-200/80 mt-1">
            Free PDF ebooks, Quran recitations, audio & video, daily Azkar, and authentic articles.
          </p>
        </div>

        {/* Admin Add Button (Duas / Articles) */}
        {userState.isAdmin && activeTab !== 'books' && (
          <div className="flex flex-col items-start md:items-end gap-1.5 self-start md:self-auto">
            <button
              onClick={() => onOpenAddModal(activeTab === 'duas' ? 'dua' : 'article')}
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#FFD700] to-yellow-400 hover:from-yellow-200 hover:to-[#FFD700] text-slate-950 font-bold text-xs flex items-center space-x-2 shadow-md shadow-[#FFD700]/20 transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Add Resource</span>
            </button>
          </div>
        )}
      </div>

      {/* Navigation Tabs */}
      <div className="flex flex-wrap gap-2 mb-8 bg-[#0A0A0A] p-1.5 rounded-2xl border border-[#0B6E4F]">
        <button
          onClick={() => setActiveTab('books')}
          className={`flex-1 min-w-[130px] px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center justify-center space-x-2 ${
            activeTab === 'books'
              ? 'bg-gradient-to-r from-[#FFD700] to-yellow-400 text-slate-950 shadow-md shadow-[#FFD700]/20 scale-[1.02]'
              : 'text-emerald-100 hover:bg-[#0B6E4F]/40'
          }`}
        >
          <span>📚</span>
          <span>Islamic Books (PDF)</span>
        </button>

        <button
          onClick={() => setActiveTab('quran')}
          className={`flex-1 min-w-[130px] px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center justify-center space-x-2 ${
            activeTab === 'quran'
              ? 'bg-gradient-to-r from-[#FFD700] to-yellow-400 text-slate-950 shadow-md shadow-[#FFD700]/20 scale-[1.02]'
              : 'text-emerald-100 hover:bg-[#0B6E4F]/40'
          }`}
        >
          <span>📖</span>
          <span>Quran Resources</span>
        </button>

        <button
          onClick={() => setActiveTab('quran-videos')}
          className={`flex-1 min-w-[130px] px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center justify-center space-x-2 ${
            activeTab === 'quran-videos'
              ? 'bg-gradient-to-r from-[#FFD700] to-yellow-400 text-slate-950 shadow-md shadow-[#FFD700]/20 scale-[1.02]'
              : 'text-emerald-100 hover:bg-[#0B6E4F]/40'
          }`}
        >
          <span>🎬</span>
          <span>Quran Video Recitation</span>
        </button>

        <button
          onClick={() => setActiveTab('duas')}
          className={`flex-1 min-w-[130px] px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center justify-center space-x-2 ${
            activeTab === 'duas'
              ? 'bg-gradient-to-r from-[#FFD700] to-yellow-400 text-slate-950 shadow-md shadow-[#FFD700]/20 scale-[1.02]'
              : 'text-emerald-100 hover:bg-[#0B6E4F]/40'
          }`}
        >
          <span>🤲</span>
          <span>Duas & Azkar</span>
        </button>

        <button
          onClick={() => setActiveTab('articles')}
          className={`flex-1 min-w-[130px] px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center justify-center space-x-2 ${
            activeTab === 'articles'
              ? 'bg-gradient-to-r from-[#FFD700] to-yellow-400 text-slate-950 shadow-md shadow-[#FFD700]/20 scale-[1.02]'
              : 'text-emerald-100 hover:bg-[#0B6E4F]/40'
          }`}
        >
          <span>📝</span>
          <span>Islamic Articles</span>
        </button>
      </div>

      {/* --- TAB 1: ISLAMIC BOOKS WITH SEARCH FEATURE --- */}
      {activeTab === 'books' && (
        <div className="space-y-6">

          {/* Section Header — styled to match the AI Video Tools section */}
          <div className="flex items-center justify-between pb-3 border-b border-emerald-900/80 flex-wrap gap-2">
            <div className="flex items-center space-x-2.5">
              <div className="p-2 bg-amber-500/10 rounded-xl border border-amber-500/30 text-amber-400">
                <BookOpen className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-white font-serif">
                  📚 Islamic Books
                </h2>
                <p className="text-xs text-amber-200/70">Free authentic PDF ebooks you can read or download anytime</p>
              </div>
            </div>

            {userState.isAdmin && (
              <button
                onClick={() => onOpenAddModal('book')}
                className="px-3.5 py-2 rounded-xl bg-[#0B6E4F]/40 hover:bg-[#0B6E4F] border border-[#FFD700]/50 text-yellow-300 font-bold text-xs flex items-center space-x-1.5 transition-all shadow-md cursor-pointer"
              >
                <Plus className="w-4 h-4 text-[#FFD700]" />
                <span>Add Book</span>
              </button>
            )}
          </div>

          {/* Book Search Bar */}
          <div className="bg-[#0A0A0A] p-4 rounded-2xl border border-[#FFD700]/30 flex flex-col sm:flex-row items-center gap-3 shadow-inner">
            <div className="relative flex-1 w-full flex items-center bg-[#111827] border border-[#0B6E4F] rounded-xl px-3 py-2">
              <Search className="w-4 h-4 text-[#FFD700] mr-2 shrink-0" />
              <input
                type="text"
                value={bookSearchQuery}
                onChange={(e) => setBookSearchQuery(e.target.value)}
                placeholder="Search Islamic Books by name, author, or keyword (e.g., Fortress, Nawawi, Seerah)..."
                className="w-full bg-transparent text-xs sm:text-sm text-white placeholder-emerald-300/50 focus:outline-none"
              />
              {bookSearchQuery && (
                <button
                  onClick={() => setBookSearchQuery('')}
                  className="p-1 text-emerald-300 hover:text-white"
                  title="Clear Book Search"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          {/* Books Grid */}
          {filteredBooks.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {filteredBooks.map((book) => (
                <div
                  key={book.id}
                  className="group relative bg-[#111827]/95 rounded-2xl border border-[#0B6E4F] hover:border-[#FFD700] p-5 shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_0_25px_rgba(255,215,0,0.25)] flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-start space-x-3 mb-3">
                      <div className="w-12 h-14 rounded-xl bg-gradient-to-b from-[#FFD700] to-[#0B6E4F] flex items-center justify-center text-2xl shadow-inner shrink-0 text-slate-950 font-bold">
                        {book.icon || '📚'}
                      </div>
                      <div>
                        <h3 className="text-sm font-bold text-white group-hover:text-yellow-300 transition-colors line-clamp-2 leading-snug">
                          {book.title}
                        </h3>
                        <p className="text-xs text-yellow-300/90 mt-0.5 font-medium">By {book.author}</p>
                        <span className="inline-block text-[10px] text-emerald-300 bg-[#0A0A0A] px-2 py-0.5 rounded-md border border-[#0B6E4F] mt-1">
                          {book.category}
                        </span>
                      </div>
                    </div>

                    <p className="text-xs text-emerald-100/90 leading-relaxed mb-4 line-clamp-3">
                      {book.description}
                    </p>

                    <div className="flex items-center space-x-3 text-[11px] text-emerald-300/80 mb-4 font-mono">
                      <span>📄 {book.pages} Pages</span>
                      <span>•</span>
                      <span>💾 {book.fileSize}</span>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-[#0B6E4F]/60 flex items-center justify-between gap-2">
                    <div className="flex items-center space-x-1">
                      <button
                        onClick={() => setSelectedBook(book)}
                        className="text-xs font-semibold text-emerald-300 hover:text-yellow-300 flex items-center space-x-1 py-1 px-2 rounded-lg hover:bg-[#0B6E4F]/30 transition-colors"
                      >
                        <Info className="w-3.5 h-3.5" />
                        <span>Details</span>
                      </button>

                      {/* Direct Admin Edit & Delete Actions */}
                      {userState.isAdmin && onEditBook && (
                        <button
                          onClick={() => onEditBook(book)}
                          className="p-1.5 rounded-lg bg-[#0A0A0A] hover:bg-[#111827] text-yellow-300 border border-[#0B6E4F] hover:border-[#FFD700] transition-colors"
                          title="Edit Book"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                      )}
                      {userState.isAdmin && onDeleteBook && (
                        <button
                          onClick={() => {
                            if (confirm(`Are you sure you want to delete "${book.title}"?`)) {
                              onDeleteBook(book.id);
                            }
                          }}
                          className="p-1.5 rounded-lg bg-rose-950/60 hover:bg-rose-900 text-rose-300 border border-rose-800 transition-colors"
                          title="Delete Book"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>

                    <a
                      href={book.pdfUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#FFD700] to-yellow-400 hover:from-yellow-200 hover:to-[#FFD700] text-slate-950 text-xs font-bold transition-all shadow-md shadow-[#FFD700]/20 flex items-center space-x-1.5 hover:shadow-[#FFD700]/30 shrink-0"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Download</span>
                    </a>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-[#0A0A0A] rounded-2xl border border-[#0B6E4F] p-6 space-y-3">
              <Search className="w-10 h-10 text-[#FFD700]/50 mx-auto" />
              <h3 className="text-base font-bold text-white">
                {bookSearchQuery.trim() ? `No books found matching "${bookSearchQuery}".` : 'No books found.'}
              </h3>
              <p className="text-xs text-emerald-200/70">
                {bookSearchQuery.trim()
                  ? 'Try searching for another book title, author, or category.'
                  : 'There are no books in the library yet. Please check back soon.'}
              </p>
              {bookSearchQuery.trim() && (
                <button
                  onClick={() => setBookSearchQuery('')}
                  className="px-4 py-2 rounded-xl bg-[#FFD700] text-slate-950 font-bold text-xs inline-block"
                >
                  Clear Search Filter
                </button>
              )}
            </div>
          )}
        </div>
      )}

      {/* --- TAB 2: QURAN RESOURCES --- */}
      {activeTab === 'quran' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {quranResources.map((res) => (
            <div
              key={res.id}
              className="bg-[#111827]/95 rounded-2xl border border-[#0B6E4F] hover:border-[#FFD700]/60 p-6 shadow-lg flex flex-col justify-between transition-all"
            >
              <div>
                <div className="flex items-center space-x-3 mb-3">
                  <span className="text-3xl p-2 bg-[#0A0A0A] rounded-xl border border-[#0B6E4F]">{res.icon}</span>
                  <div>
                    <h3 className="text-base font-bold text-white">{res.title}</h3>
                    <p className="text-xs text-yellow-300/90 font-medium">{res.type}</p>
                  </div>
                </div>

                <p className="text-xs text-emerald-100/90 leading-relaxed mb-4">
                  {res.description}
                </p>

                <div className="flex flex-wrap gap-1.5 mb-5">
                  {res.featureTags.map((tag, idx) => (
                    <span key={idx} className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-[#0B6E4F]/30 text-emerald-300 border border-[#0B6E4F]">
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>

              <a
                href={res.url}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-[#FFD700] to-yellow-400 hover:from-yellow-200 hover:to-[#FFD700] text-slate-950 text-xs font-bold transition-all shadow-md shadow-[#FFD700]/20 flex items-center justify-center space-x-2"
              >
                <span>Explore Resource</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          ))}
        </div>
      )}

      {/* --- TAB 3: QURAN RECITATION VIDEO --- */}
      {activeTab === 'quran-videos' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {quranVideos.map((vid) => (
              <div
                key={vid.id}
                className="bg-[#111827]/95 rounded-2xl border border-[#0B6E4F] hover:border-[#FFD700]/60 p-5 shadow-lg flex flex-col justify-between transition-all"
              >
                <div>
                  <div className="relative rounded-xl overflow-hidden bg-black/60 aspect-video mb-4 flex items-center justify-center border border-[#0B6E4F] group">
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent z-10" />
                    <span className="text-4xl z-0">{vid.thumbnailIcon || '🕌'}</span>
                    <button
                      onClick={() => setSelectedVideo(vid)}
                      className="absolute z-20 w-12 h-12 rounded-full bg-[#FFD700] text-slate-950 flex items-center justify-center shadow-lg hover:scale-110 transition-transform"
                      title="Play Recitation Video"
                    >
                      <Play className="w-6 h-6 fill-current ml-0.5 text-slate-950" />
                    </button>
                    <span className="absolute bottom-2 right-2 z-20 text-[10px] font-mono bg-black/80 px-2 py-0.5 rounded text-yellow-300 border border-[#FFD700]/30">
                      ⏱ {vid.duration}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-white mb-1 leading-snug">{vid.title}</h3>
                  <p className="text-xs text-yellow-300 font-semibold mb-2">🎙 {vid.reciter}</p>
                  <p className="text-xs text-emerald-100/90 leading-relaxed mb-4">{vid.description}</p>
                </div>

                <div className="pt-3 border-t border-[#0B6E4F]/60 flex items-center gap-2">
                  <button
                    onClick={() => setSelectedVideo(vid)}
                    className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-[#FFD700] to-yellow-400 hover:from-yellow-200 hover:to-[#FFD700] text-slate-950 font-bold text-xs flex items-center justify-center space-x-1.5 shadow-md shadow-[#FFD700]/20"
                  >
                    <Play className="w-3.5 h-3.5 fill-current" />
                    <span>Watch Recitation Video</span>
                  </button>
                  <a
                    href={vid.videoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2.5 rounded-xl bg-[#0A0A0A] text-emerald-200 hover:text-white border border-[#0B6E4F]"
                    title="Open on YouTube"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* --- TAB 4: DUAS & AZKAR --- */}
      {activeTab === 'duas' && (
        <div>
          {/* Dua Category Filter Pills */}
          <div className="flex flex-wrap gap-2 mb-6">
            {['All', 'Morning & Evening', 'Protection & Safety', 'Daily Life', 'Praise & Gratitude'].map((cat) => (
              <button
                key={cat}
                onClick={() => setDuaFilter(cat)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${
                  duaFilter === cat
                    ? 'bg-[#FFD700] text-slate-950 shadow-sm font-bold'
                    : 'bg-[#0A0A0A] text-emerald-200 border border-[#0B6E4F] hover:bg-[#0B6E4F]/40'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="space-y-4">
            {filteredDuas.map((dua) => (
              <div
                key={dua.id}
                className="bg-[#111827]/95 rounded-2xl border border-[#0B6E4F] p-5 shadow-lg space-y-4"
              >
                <div className="flex items-center justify-between pb-3 border-b border-[#0B6E4F]/60">
                  <div className="flex items-center space-x-2">
                    <span className="p-1.5 bg-[#FFD700]/10 rounded-lg text-yellow-300">🤲</span>
                    <h3 className="text-sm font-bold text-white">{dua.title}</h3>
                  </div>
                  <span className="text-[10px] font-semibold text-yellow-300 bg-[#FFD700]/15 px-2.5 py-1 rounded-full border border-[#FFD700]/40">
                    {dua.category}
                  </span>
                </div>

                {/* Arabic Text */}
                <div className="bg-[#0A0A0A] p-4 rounded-xl border border-[#0B6E4F]/70 text-right">
                  <p className="text-xl sm:text-2xl font-serif text-yellow-200 leading-loose tracking-wide dir-rtl" style={{ fontFamily: 'Georgia, serif' }}>
                    {dua.arabic}
                  </p>
                </div>

                {/* Transliteration & English */}
                <div className="space-y-1.5">
                  <p className="text-xs text-yellow-200/90 italic font-sans">
                    <span className="font-semibold not-italic text-emerald-300">Transliteration:</span> "{dua.transliteration}"
                  </p>
                  <p className="text-xs sm:text-sm text-emerald-100/90 leading-relaxed">
                    <span className="font-semibold text-emerald-300">Translation:</span> {dua.english}
                  </p>
                </div>

                {dua.virtue && (
                  <p className="text-[11px] text-yellow-300/90 bg-[#FFD700]/10 p-2.5 rounded-lg border border-[#FFD700]/30">
                    ✨ <span className="font-semibold">Virtue:</span> {dua.virtue}
                  </p>
                )}

                <div className="flex items-center justify-between pt-2 border-t border-[#0B6E4F]/60 text-xs text-emerald-400">
                  <span className="text-[11px] text-emerald-300/80">{dua.reference || 'Quran / Authentic Hadith'}</span>
                  
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handlePlayAudio(dua.id)}
                      className={`p-2 rounded-lg border transition-colors flex items-center space-x-1 ${
                        playingAudioId === dua.id
                          ? 'bg-[#10B981] text-slate-950 border-emerald-400 animate-pulse font-bold'
                          : 'bg-[#0A0A0A] text-emerald-300 border-[#0B6E4F] hover:bg-[#0B6E4F]/40'
                      }`}
                      title="Listen to recitation preview"
                    >
                      <Volume2 className="w-3.5 h-3.5" />
                      <span className="text-[10px]">{playingAudioId === dua.id ? 'Playing...' : 'Audio'}</span>
                    </button>

                    <button
                      onClick={() => handleCopyDua(dua)}
                      className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-[#FFD700] to-yellow-400 hover:from-yellow-200 hover:to-[#FFD700] text-slate-950 font-bold text-xs flex items-center space-x-1 transition-all shadow-sm"
                    >
                      {copiedDuaId === dua.id ? (
                        <>
                          <Check className="w-3.5 h-3.5" />
                          <span>Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>Copy Dua</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

              </div>
            ))}
          </div>
        </div>
      )}

      {/* --- TAB 5: ISLAMIC ARTICLES --- */}
      {activeTab === 'articles' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {articles.map((art) => (
            <div
              key={art.id}
              className="bg-[#111827]/95 rounded-2xl border border-[#0B6E4F] hover:border-[#FFD700]/60 p-6 shadow-lg flex flex-col justify-between transition-all"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-semibold text-yellow-300 bg-[#FFD700]/15 px-2.5 py-0.5 rounded-full border border-[#FFD700]/40">
                    {art.category}
                  </span>
                  <span className="text-[11px] text-emerald-300/70 font-mono">{art.readTime}</span>
                </div>

                <h3 className="text-base font-bold text-white mb-2 leading-snug">
                  {art.title}
                </h3>

                <p className="text-xs text-emerald-100/90 leading-relaxed mb-4">
                  {art.summary}
                </p>
              </div>

              <div className="pt-3 border-t border-[#0B6E4F]/60 flex items-center justify-between">
                <span className="text-[11px] text-emerald-300/70">By {art.author}</span>
                <button
                  onClick={() => setSelectedArticle(art)}
                  className="px-4 py-1.5 rounded-xl bg-gradient-to-r from-[#FFD700] to-yellow-400 hover:from-yellow-200 hover:to-[#FFD700] text-slate-950 font-bold text-xs flex items-center space-x-1 shadow-sm"
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>Read Article</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* BOOK PREVIEW MODAL */}
      {selectedBook && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#111827] border border-[#FFD700]/50 rounded-3xl p-6 max-w-lg w-full space-y-4 relative shadow-2xl">
            <button
              onClick={() => setSelectedBook(null)}
              className="absolute top-4 right-4 p-2 text-emerald-300 hover:text-white"
            >
              ✕
            </button>
            <div className="flex items-center space-x-3">
              <span className="text-3xl p-3 bg-[#0A0A0A] rounded-2xl border border-[#0B6E4F]">{selectedBook.icon || '📚'}</span>
              <div>
                <h3 className="text-lg font-bold text-white">{selectedBook.title}</h3>
                <p className="text-xs text-yellow-300">By {selectedBook.author}</p>
              </div>
            </div>
            <p className="text-xs text-emerald-100/90 leading-relaxed bg-[#0A0A0A] p-4 rounded-xl border border-[#0B6E4F]">
              {selectedBook.description}
            </p>
            <div className="flex justify-between text-xs text-emerald-300 font-mono pt-2">
              <span>Category: {selectedBook.category}</span>
              <span>Pages: {selectedBook.pages}</span>
            </div>
            <div className="pt-4 flex gap-3">
              <button
                onClick={() => setSelectedBook(null)}
                className="flex-1 py-2.5 rounded-xl bg-[#0A0A0A] text-emerald-300 text-xs font-semibold border border-[#0B6E4F]"
              >
                Close
              </button>
              <a
                href={selectedBook.pdfUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-[#FFD700] to-yellow-400 text-slate-950 text-xs font-bold text-center flex items-center justify-center space-x-2 shadow-md shadow-[#FFD700]/20"
              >
                <Download className="w-4 h-4" />
                <span>Download PDF Ebook</span>
              </a>
            </div>
          </div>
        </div>
      )}

      {/* QURAN VIDEO RECITATION MODAL */}
      {selectedVideo && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#111827] border border-[#FFD700]/50 rounded-3xl p-5 max-w-2xl w-full space-y-4 relative shadow-2xl">
            <button
              onClick={() => setSelectedVideo(null)}
              className="absolute top-4 right-4 p-2 text-emerald-300 hover:text-white z-10"
            >
              ✕
            </button>
            <h3 className="text-lg font-bold text-white pr-8 font-serif">{selectedVideo.title}</h3>
            <p className="text-xs text-yellow-300 font-semibold">🎙 {selectedVideo.reciter} • {selectedVideo.surah}</p>
            
            <div className="relative rounded-2xl overflow-hidden aspect-video bg-black border border-[#0B6E4F]">
              <iframe
                src={selectedVideo.youtubeEmbedUrl || selectedVideo.videoUrl}
                title={selectedVideo.title}
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>

            <p className="text-xs text-emerald-100/90">{selectedVideo.description}</p>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setSelectedVideo(null)}
                className="px-6 py-2 rounded-xl bg-[#FFD700] text-slate-950 font-bold text-xs"
              >
                Close Player
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ARTICLE READER MODAL */}
      {selectedArticle && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#111827] border border-[#FFD700]/50 rounded-3xl p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto space-y-4 relative shadow-2xl">
            <button
              onClick={() => setSelectedArticle(null)}
              className="absolute top-4 right-4 p-2 text-emerald-300 hover:text-white"
            >
              ✕
            </button>
            <span className="text-xs text-yellow-300 font-semibold uppercase tracking-wider">{selectedArticle.category}</span>
            <h3 className="text-xl font-bold text-white font-serif">{selectedArticle.title}</h3>
            <p className="text-xs text-emerald-300/80">By {selectedArticle.author} • {selectedArticle.date}</p>
            <div className="bg-[#0A0A0A] p-5 rounded-2xl border border-[#0B6E4F] text-emerald-100 text-sm leading-relaxed whitespace-pre-line font-sans">
              {selectedArticle.content}
            </div>
            <div className="pt-2 text-right">
              <button
                onClick={() => setSelectedArticle(null)}
                className="px-6 py-2.5 rounded-xl bg-[#FFD700] text-slate-950 text-xs font-bold"
              >
                Done Reading
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
