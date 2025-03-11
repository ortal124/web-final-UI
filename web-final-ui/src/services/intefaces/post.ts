export interface Post {
    
    _id?: string;
    text: string;
    image: File;
    userId: string;
    likes: string[];
    file?: string;
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