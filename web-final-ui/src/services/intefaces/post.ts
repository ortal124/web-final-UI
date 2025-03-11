import { Comment } from './comment';

export interface Post {
    _id?: string;
    text: string;
    image: File;
    userId: string;
    likes: string[];
    file?: string;
    username?: string;
    comments?: Comment[];
  }

export interface generatedPostText {
    text: {
      quote: string;
    }
  }

export interface getPostsResponse {
  downloadedPosts: Post[];
  totalPosts: number;
  totalPages: number;
  currentPage: number;
  }