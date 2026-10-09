export type MediaKind = "pdf" | "audio" | "video";

export interface Book {
  _id: string;
  title: string;
  subtitle?: string;
  author?: string;
  narrator?: string;
  summary?: string;
  downloads?: number;
  views?: number;
  category?: string;
  tags?: string[];
  historicalPeriod?: string;
  location?: string;
  readingTime?: string;
  ageRating?: string;
  coverImage?: string;
  // Which media the story has. File URLs are never sent to readers.
  media?: MediaKind[];
  hasPdf?: boolean;
  hasAudio?: boolean;
  hasVideo?: boolean;
  // Admin-only (GET /book/admin/all); absent on public/reader responses.
  pdfFile?: string;
  audioFile?: string;
  videoFile?: string;
  mediaUrl?: string;
  images?: string[];
  price?: number;
  status?: string;
  createdBy?: string;
  createdAt?: string;
  updatedAt?: string;
  content?: string;
}

