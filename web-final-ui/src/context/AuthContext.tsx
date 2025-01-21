import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { jwtDecode } from 'jwt-decode';
import axios from 'axios';

interface AuthContextType {
  user: any;
  access_token: string | null;
  refresh_token: string | null;
  login: (username: string, password: string) => void;
  register: (username: string, password: string, email: string) => void;
  logout: () => void;
  setUser: (user: any) => void;
  setTokens: (accessToken: string, refreshToken: string) => void;
  refreshToken: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<any>(null);
  const [access_token, setAccessToken] = useState<string | null>(localStorage.getItem('accessToken'));
  const [refresh_token, setRefreshToken] = useState<string | null>(localStorage.getItem('refreshToken'));

  useEffect(() => {
    if (access_token) {
      const decoded: any = jwtDecode(access_token);
      setUserData(decoded.userID); 
    }
  }, [access_token]);

  const setUserData = async (userID: string) => {
    try {
      const response = await axios.get(`/user/${userID}`);
      setUser(response.data); 
    } catch (error) {
      console.error('Failed to fetch user data', error);
    }
  };

  const login = async (username: string, password: string) => {
    try {
      const response = await axios.post('/auth/login', { username, password });
      const { accessToken, refreshToken, userId } = response.data;

      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);
      setTokens(accessToken, refreshToken);
      setUserData(userId); 
    } catch (error) {
      console.error('Login failed', error);
    }
  };

  const register = async (username: string, password: string, email: string) => {
    try {
      await axios.post('/auth/register', { username, password, email });
    } catch (error) {
      console.error('Registration failed', error);
    }
  };

  const logout = async () => {
    try {
        await axios.post('/auth/logout', { refreshToken });
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        setAccessToken(null);
        setRefreshToken(null);
        setUser(null);
      } catch (error) {
        console.error('logout failed', error);
      }
  };

  const refreshToken = async () => {
    try {
      const storedRefreshToken = localStorage.getItem('refreshToken');
      if (!storedRefreshToken) throw new Error('No refresh token available');

      const response = await axios.post('/auth/refresh', { refreshToken: storedRefreshToken });
      const { accessToken } = response.data;

      localStorage.setItem('accessToken', accessToken);
      setAccessToken(accessToken);
    } catch (error) {
      console.error('Failed to refresh token', error);
      logout();
    }
  };

  const setTokens = (accessToken: string, refreshToken: string) => {
    setAccessToken(accessToken);
    setRefreshToken(refreshToken);
  };

  useEffect(() => {
    const interceptor = axios.interceptors.response.use(
      (response) => response,
      async (error) => {
        if (error.response?.status === 401) {
          // Token expired or invalid, attempt to refresh token
          await refreshToken();

          // Retry the original request with the new token
          const originalRequest = error.config;
          originalRequest.headers['Authorization'] = `Bearer ${localStorage.getItem('access_token')}`;
          return axios(originalRequest);
        }
        return Promise.reject(error); // Reject if not 401 error
      }
    );

    // Cleanup the interceptor on component unmount
    return () => {
      axios.interceptors.response.eject(interceptor);
    };
  });

  return (
    <AuthContext.Provider value={{ user, access_token, refresh_token, login, register, logout, setUser, setTokens, refreshToken }}>
      {children}
    </AuthContext.Provider>
  );
};

const useAuth = () => {
  const context = React.useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export { AuthProvider, useAuth };