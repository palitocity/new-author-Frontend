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

