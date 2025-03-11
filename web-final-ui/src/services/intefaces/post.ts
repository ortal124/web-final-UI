export interface Post {
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