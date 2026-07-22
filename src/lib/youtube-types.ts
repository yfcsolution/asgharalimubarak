export type YouTubeThumbnail = {
  url: string;
  width?: number;
  height?: number;
};

export type YouTubeVideo = {
  id: string;
  title: string;
  description: string;
  publishedAt: string;
  thumbnail: YouTubeThumbnail | null;
  url: string;
  embedUrl: string;
};

export type YouTubeChannel = {
  id: string;
  title: string;
  description: string;
  customUrl?: string;
  uploadsPlaylistId?: string;
};

export type YouTubeVideoPage = {
  videos: YouTubeVideo[];
  nextPageToken?: string;
  prevPageToken?: string;
  totalResults?: number;
  configured: boolean;
  fromCache?: boolean;
  message?: string;
};
