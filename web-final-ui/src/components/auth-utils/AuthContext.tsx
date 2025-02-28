import { createContext, useContext, useState, ReactNode } from "react";

type AuthContextType = {
  user: string | null;
  login: (userId: string, accessToken: string, refreshToken: string) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<string | null>(
    localStorage.getItem("userId")
  );

  const login = (userId: string, accessToken: string, refreshToken:string) => {
    localStorage.setItem("userId", userId);
    localStorage.setItem("accessToken", accessToken);
    localStorage.setItem("refreshToken", refreshToken);    
    setUser(userId);
  };

  const logout = () => {
    localStorage.removeItem("userId");
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
