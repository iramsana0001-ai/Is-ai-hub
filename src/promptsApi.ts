import { supabase } from './supabaseClient';
import { PromptItem } from '../types';

const PROMPTS_TABLE = 'prompts';

// --- Row <-> App model mapping -------------------------------------------------

interface PromptRow {
  id: string;
  title: string;
  category: string;
  prompt_text: string;
  target_tool: string | null;
  tags: string[] | null;
  preview_url: string | null;
  attached_file_name: string | null;
  created_at?: string;
}

function rowToPrompt(row: PromptRow): PromptItem {
  return {
    id: row.id,
    title: row.title,
    category: row.category as PromptItem['category'],
    promptText: row.prompt_text,
    targetTool: row.target_tool || '',
    tags: row.tags || [],
    previewUrl: row.preview_url || undefined,
    attachedFileName: row.attached_file_name || undefined,
  };
}

function promptToRow(prompt: PromptItem): PromptRow {
  return {
    id: prompt.id,
    title: prompt.title,
    category: prompt.category,
    prompt_text: prompt.promptText,
    target_tool: prompt.targetTool || null,
    tags: prompt.tags || [],
    preview_url: prompt.previewUrl || null,
    attached_file_name: prompt.attachedFileName || null,
  };
}

// --- Public API -------------------------------------------------

/**
 * Loads the current Tool Prompt library from Supabase. Called on app
 * startup (and whenever the app is reopened) so every member — including
 * those who already have the PWA installed — always sees whatever the
 * Admin most recently added, edited, or removed, without needing to
 * reinstall or update the app.
 */
export async function fetchPrompts(): Promise<PromptItem[]> {
  const { data, error } = await supabase
    .from(PROMPTS_TABLE)
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return (data as PromptRow[]).map(rowToPrompt);
}

/** Inserts a new Tool Prompt row so it becomes available to every member. */
export async function createPrompt(prompt: PromptItem): Promise<PromptItem> {
  const { data, error } = await supabase
    .from(PROMPTS_TABLE)
    .insert(promptToRow(prompt))
    .select()
    .single();

  if (error) throw error;
  return rowToPrompt(data as PromptRow);
}

/** Updates an existing Tool Prompt's fields. */
export async function updatePrompt(prompt: PromptItem): Promise<PromptItem> {
  const { data, error } = await supabase
    .from(PROMPTS_TABLE)
    .update(promptToRow(prompt))
    .eq('id', prompt.id)
    .select()
    .single();

  if (error) throw error;
  return rowToPrompt(data as PromptRow);
}

/** Removes a Tool Prompt from the shared library. */
export async function deletePrompt(id: string): Promise<void> {
  const { error } = await supabase.from(PROMPTS_TABLE).delete().eq('id', id);
  if (error) throw error;
}
