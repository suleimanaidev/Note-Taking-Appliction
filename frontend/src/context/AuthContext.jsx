import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem('token') || null);
  const [loading, setLoading] = useState(true);
  const [theme, setTheme] = useState('dark');

  const fetchMe = async () => {
    try {
      const headers = {};
      const savedToken = localStorage.getItem('token');
      if (savedToken) headers['Authorization'] = `Bearer ${savedToken}`;

      const res = await fetch('/api/auth/me', { headers, credentials: 'include' });
      const data = await res.json();
      if (res.ok && data.success) {
        setUser(data.user);
        if (data.token) {
          setToken(data.token);
          localStorage.setItem('token', data.token);
        }
        setTheme(data.user.theme || 'dark');
        document.documentElement.className = data.user.theme || 'dark';
      } else {
        setUser(null);
        setToken(null);
        localStorage.removeItem('token');
      }
    } catch (err) {
      setUser(null);
      setToken(null);
      localStorage.removeItem('token');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMe();
  }, []);

  const loginUser = (userData, jwtToken) => {
    setUser(userData);
    if (jwtToken) {
      setToken(jwtToken);
      localStorage.setItem('token', jwtToken);
    }
    setTheme(userData.theme || 'dark');
    document.documentElement.className = userData.theme || 'dark';
  };

  const logoutUser = async () => {
    try {
      const headers = {};
      if (token) headers['Authorization'] = `Bearer ${token}`;
      await fetch('/api/auth/logout', { method: 'POST', headers, credentials: 'include' });
    } catch (err) {}
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
  };

  const toggleTheme = async () => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);
    document.documentElement.className = nextTheme;
    try {
      const headers = { 'Content-Type': 'application/json' };
      if (token) headers['Authorization'] = `Bearer ${token}`;
      await fetch('/api/auth/theme', {
        method: 'PUT',
        headers,
        credentials: 'include',
        body: JSON.stringify({ theme: nextTheme })
      });
    } catch (err) {}
  };

  const getAuthHeaders = () => {
    const headers = { 'Content-Type': 'application/json' };
    const curToken = token || localStorage.getItem('token');
    if (curToken) headers['Authorization'] = `Bearer ${curToken}`;
    return headers;
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, theme, loginUser, logoutUser, toggleTheme, getAuthHeaders }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}

