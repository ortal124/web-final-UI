export interface User {
    _id?: string;
    username: string;
    password: string;
    email: string;
    profileImage?: string;
    refreshToken?: String;
    file?: string;
  }