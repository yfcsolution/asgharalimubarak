export interface WpRendered {
  rendered: string;
  protected?: boolean;
}

export interface WpMediaSize {
  file?: string;
  width: number;
  height: number;
  mime_type?: string;
  source_url: string;
}

export interface WpFeaturedMedia {
  id: number;
  source_url: string;
  alt_text?: string;
  caption?: WpRendered;
  media_details?: {
    width?: number;
    height?: number;
    sizes?: Record<string, WpMediaSize>;
  };
}

export interface WpTerm {
  id: number;
  name: string;
  slug: string;
  taxonomy: string;
  count?: number;
  description?: string;
  link?: string;
}

export interface WpAuthor {
  id: number;
  name: string;
  slug?: string;
  description?: string;
  avatar_urls?: Record<string, string>;
}

export interface WpPost {
  id: number;
  date: string;
  date_gmt?: string;
  modified: string;
  modified_gmt?: string;
  slug: string;
  status: string;
  type?: string;
  link: string;
  title: WpRendered;
  content?: WpRendered;
  excerpt: WpRendered;
  author: number;
  featured_media: number;
  categories: number[];
  tags: number[];
  jetpack_featured_media_url?: string;
  _embedded?: {
    author?: WpAuthor[];
    "wp:featuredmedia"?: WpFeaturedMedia[];
    "wp:term"?: WpTerm[][];
  };
}

export interface WpCategory {
  id: number;
  count: number;
  description: string;
  link: string;
  name: string;
  slug: string;
  taxonomy: string;
  parent: number;
}

export interface WpTag {
  id: number;
  count: number;
  description: string;
  link: string;
  name: string;
  slug: string;
  taxonomy: string;
}

export interface PaginatedPosts {
  posts: WpPost[];
  total: number;
  totalPages: number;
  page: number;
  perPage: number;
  fromSnapshot?: boolean;
  feedUnavailable?: boolean;
  snapshotMessage?: string;
}

export interface FeaturedImageData {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  caption?: string;
}

export interface AuthorProfile {
  id: number;
  name: string;
  description: string;
  shortBio: string;
  avatarUrl: string | null;
  localPhotoAvailable: boolean;
}
