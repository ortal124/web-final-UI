export interface Post {
    text: string;
    image: File;
    userId: string;
    likes: string[];
  }

export interface generatedPostText {
    text: {
      quote: string;
    }
  }