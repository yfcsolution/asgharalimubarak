export type FacebookPost = {
  id: string;
  message: string;
  createdAt: string;
  permalink: string;
  imageUrl?: string;
};

export type FacebookFeedResult = {
  posts: FacebookPost[];
  configured: boolean;
  message?: string;
};

export type InstagramMedia = {
  id: string;
  caption: string;
  timestamp: string;
  permalink: string;
  mediaType: string;
  mediaUrl?: string;
  thumbnailUrl?: string;
};

export type InstagramFeedResult = {
  media: InstagramMedia[];
  configured: boolean;
  message?: string;
};
