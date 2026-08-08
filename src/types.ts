export type MainCategory = 'all' | 'video' | 'image' | 'writing' | 'islamic' | 'prompts' | 'saved';

export type ToolCategory = 'video' | 'image' | 'writing';

export type PricingType = 'Free Plan' | 'Free Credits' | 'Free Trial' | 'Freemium' | 'Paid';

export interface AITool {
  id: string;
  name: string;
  category: ToolCategory;
  shortDescription: string;
  longDescription?: string;
  logoUrl?: string;
  imageUrl?: string;
  iconName?: string;
  pricing: PricingType;
  pricingDetail?: string;
  url: string;
  features: string[];
  isFeatured?: boolean;
  rating?: number;
}

export interface IslamicBook {
  id: string;
  title: string;
  author: string;
  category: string;
  pages: string;
  fileSize: string;
  pdfUrl: string;
  pdfPath?: string;
  coverImage?: string;
  coverPath?: string;
  description: string;
  coverColor?: string;
  icon?: string;
  downloadCount: number;
}

export interface QuranResource {
  id: string;
  title: string;
  type: string;
  url: string;
  description: string;
  featureTags: string[];
  icon: string;
}

export interface QuranVideoRecitation {
  id: string;
  title: string;
  reciter: string;
  surah: string;
  duration: string;
  youtubeEmbedUrl?: string;
  videoUrl: string;
  description: string;
  thumbnailIcon?: string;
  thumbnailImage?: string;
}

export interface DuaItem {
  id: string;
  title: string;
  category: 'Morning & Evening' | 'Protection & Safety' | 'Daily Life' | 'Praise & Gratitude';
  arabic: string;
  transliteration: string;
  english: string;
  virtue?: string;
  reference?: string;
  audioUrl?: string;
}

export interface IslamicArticle {
  id: string;
  title: string;
  category: string;
  author: string;
  readTime: string;
  summary: string;
  content: string;
  date: string;
  coverImage?: string;
}

export interface PromptItem {
  id: string;
  title: string;
  category: 'video' | 'image' | 'business';
  promptText: string;
  targetTool: string;
  tags: string[];
  previewUrl?: string;
  attachedFileName?: string;
}

export interface UserState {
  isLoggedIn: boolean;
  isAdmin: boolean;
  username: string;
  savedToolIds: string[];
  savedPromptIds: string[];
}
