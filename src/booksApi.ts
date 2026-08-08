import { supabase } from './supabaseClient';
import { IslamicBook } from '../types';

const BOOKS_TABLE = 'books';
const PDF_BUCKET = 'book-pdfs';
const COVER_BUCKET = 'book-covers';

// --- Row <-> App model mapping -------------------------------------------------

interface BookRow {
  id: string;
  title: string;
  author: string;
  category: string;
  pages: string;
  file_size: string;
  pdf_url: string;
  pdf_path: string | null;
  cover_image: string | null;
  cover_path: string | null;
  description: string;
  cover_color: string | null;
  icon: string | null;
  download_count: number;
  created_at?: string;
}

function rowToBook(row: BookRow): IslamicBook {
  return {
    id: row.id,
    title: row.title,
    author: row.author,
    category: row.category,
    pages: row.pages,
    fileSize: row.file_size,
    pdfUrl: row.pdf_url,
    pdfPath: row.pdf_path || undefined,
    coverImage: row.cover_image || undefined,
    coverPath: row.cover_path || undefined,
    description: row.description,
    coverColor: row.cover_color || undefined,
    icon: row.icon || undefined,
    downloadCount: row.download_count,
  };
}

function bookToRow(book: IslamicBook): BookRow {
  return {
    id: book.id,
    title: book.title,
    author: book.author,
    category: book.category,
    pages: book.pages,
    file_size: book.fileSize,
    pdf_url: book.pdfUrl,
    pdf_path: book.pdfPath || null,
    cover_image: book.coverImage || null,
    cover_path: book.coverPath || null,
    description: book.description,
    cover_color: book.coverColor || null,
    icon: book.icon || null,
    download_count: book.downloadCount,
  };
}

// --- Asset upload helpers -------------------------------------------------

function dataUrlToBlob(dataUrl: string): { blob: Blob; contentType: string } {
  const [header, base64] = dataUrl.split(',');
  const contentType = header.match(/data:(.*);base64/)?.[1] || 'application/octet-stream';
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return { blob: new Blob([bytes], { type: contentType }), contentType };
}

function extensionForContentType(contentType: string, fallback: string): string {
  const map: Record<string, string> = {
    'application/pdf': 'pdf',
    'image/jpeg': 'jpg',
    'image/png': 'png',
    'image/webp': 'webp',
    'image/gif': 'gif',
  };
  return map[contentType] || fallback;
}

/**
 * Uploads a book asset (PDF or cover image) that is currently held in the
 * browser as a base64 data URL (produced by FileReader) to Supabase Storage,
 * and returns its public URL + storage path. If the value passed in is
 * already a regular http(s) URL (e.g. an admin pasted a link instead of
 * uploading a file), it is left untouched and no upload happens.
 */
async function uploadAssetIfNeeded(
  value: string | undefined,
  bucket: string,
  idHint: string,
  fallbackExt: string
): Promise<{ url: string | undefined; path: string | undefined }> {
  if (!value) return { url: undefined, path: undefined };
  if (!value.startsWith('data:')) {
    // Already a hosted URL (e.g. pasted link) — nothing to upload.
    return { url: value, path: undefined };
  }

  const { blob, contentType } = dataUrlToBlob(value);
  const ext = extensionForContentType(contentType, fallbackExt);
  const path = `${idHint}-${Date.now()}.${ext}`;

  const { error: uploadError } = await supabase.storage.from(bucket).upload(path, blob, {
    contentType,
    upsert: true,
  });
  if (uploadError) throw uploadError;

  const { data: publicUrlData } = supabase.storage.from(bucket).getPublicUrl(path);
  return { url: publicUrlData.publicUrl, path };
}

async function deleteAsset(bucket: string, path?: string) {
  if (!path) return;
  const { error } = await supabase.storage.from(bucket).remove([path]);
  if (error) {
    // Non-fatal: log and continue so the DB row can still be removed.
    // eslint-disable-next-line no-console
    console.warn(`Failed to delete ${bucket}/${path} from Supabase Storage:`, error.message);
  }
}

// --- Public API -------------------------------------------------

export async function fetchBooks(): Promise<IslamicBook[]> {
  const { data, error } = await supabase
    .from(BOOKS_TABLE)
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return (data as BookRow[]).map(rowToBook);
}

/**
 * Uploads any pending file data (PDF / cover image) to Supabase Storage and
 * inserts the book row into the `books` table. Returns the saved book with
 * its final hosted URLs.
 */
export async function createBook(book: IslamicBook): Promise<IslamicBook> {
  const pdf = await uploadAssetIfNeeded(book.pdfUrl, PDF_BUCKET, `${book.id}-pdf`, 'pdf');
  const cover = await uploadAssetIfNeeded(book.coverImage, COVER_BUCKET, `${book.id}-cover`, 'jpg');

  const toSave: IslamicBook = {
    ...book,
    pdfUrl: pdf.url || book.pdfUrl,
    pdfPath: pdf.path,
    coverImage: cover.url,
    coverPath: cover.path,
  };

  const { data, error } = await supabase
    .from(BOOKS_TABLE)
    .insert(bookToRow(toSave))
    .select()
    .single();

  if (error) throw error;
  return rowToBook(data as BookRow);
}

/**
 * Updates a book's metadata, uploading any newly attached file data first.
 * If the PDF or cover was replaced, the previous storage object is removed.
 */
export async function updateBook(book: IslamicBook, previous?: IslamicBook): Promise<IslamicBook> {
  const pdf = await uploadAssetIfNeeded(book.pdfUrl, PDF_BUCKET, `${book.id}-pdf`, 'pdf');
  const cover = await uploadAssetIfNeeded(book.coverImage, COVER_BUCKET, `${book.id}-cover`, 'jpg');

  if (previous?.pdfPath && pdf.path && previous.pdfPath !== pdf.path) {
    await deleteAsset(PDF_BUCKET, previous.pdfPath);
  }
  if (previous?.coverPath && cover.path && previous.coverPath !== cover.path) {
    await deleteAsset(COVER_BUCKET, previous.coverPath);
  }

  const toSave: IslamicBook = {
    ...book,
    pdfUrl: pdf.url || book.pdfUrl,
    pdfPath: pdf.path ?? previous?.pdfPath,
    coverImage: cover.url ?? book.coverImage,
    coverPath: cover.path ?? previous?.coverPath,
  };

  const { data, error } = await supabase
    .from(BOOKS_TABLE)
    .update(bookToRow(toSave))
    .eq('id', book.id)
    .select()
    .single();

  if (error) throw error;
  return rowToBook(data as BookRow);
}

/**
 * Deletes a book's PDF and cover image from Supabase Storage, then removes
 * its row from the `books` table.
 */
export async function deleteBook(book: IslamicBook): Promise<void> {
  await Promise.all([deleteAsset(PDF_BUCKET, book.pdfPath), deleteAsset(COVER_BUCKET, book.coverPath)]);

  const { error } = await supabase.from(BOOKS_TABLE).delete().eq('id', book.id);
  if (error) throw error;
}
