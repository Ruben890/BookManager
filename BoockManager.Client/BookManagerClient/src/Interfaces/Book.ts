export interface Book {
  id?: number;
  title?: string;
  description?: string;
  author?: string;
  portalSrc?: string;
  image?: File | null;
  releaseDate?: string; 
  publishDate?: string;
  updateDate: string; 
}

