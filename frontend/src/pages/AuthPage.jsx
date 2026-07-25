import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { ArrowLeft } from 'lucide-react';

export default function AuthPage({ onBackToLanding }) {
  const [isLogin, setIsLogin] = useState(true);
  const [form, setForm] = useState({ email: '', password: '', name: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const { loginUser } = useAuth();
  const addToast = useToast();

  const validate = () => {
    const e = {};
    if (!form.email || !/\S+@\S+\.\S+/.test(form.email)) e.email = 'Valid email required';
    if (!form.password || form.password.length < 6) e.password = 'Password must be at least 6 characters';
    if (!isLogin && (!form.name || form.name.trim().length < 2)) e.name = 'Name must be at least 2 characters';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    setErrors({});

    try {
      const endpoint = isLogin ? '/api/auth/login' : '/api/auth/register';
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(form)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Authentication failed');

      addToast(isLogin ? 'Welcome back!' : 'Account created successfully!', 'success');
      loginUser(data.user, data.token);
    } catch (err) {
      addToast(err.message, 'error');
      setErrors({ submit: err.message });
    } finally {
      setLoading(false);
    }
  };

  const toggleMode = (e) => {
    e.preventDefault();
    setIsLogin(prev => !prev);
    setErrors({});
    setForm({ email: '', password: '', name: '' });
  };

  return (
    <div className="auth-page">
      <div className="bg-blobs">
        <div className="blob blob-1"></div>
        <div className="blob blob-2"></div>
        <div className="blob blob-3"></div>
      </div>
      <div className="auth-card">
        {onBackToLanding && (
          <button
            className="btn btn-ghost btn-sm"
            style={{ marginBottom: '16px', paddingLeft: 0 }}
            onClick={onBackToLanding}
          >
            <ArrowLeft size={14} /> Back to Home
          </button>
        )}
        <h1>Note<span>Vault</span></h1>
        <p className="subtitle">{isLogin ? 'Sign in to access your notes' : 'Create an account to get started'}</p>
        <form onSubmit={handleSubmit}>
          {!isLogin && (
            <div className="form-group">
              <label>Name</label>
              <input
                className="input-field"
                type="text"
                placeholder="Your name"
                value={form.name}
                onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
              />
              {errors.name && <div className="form-error">{errors.name}</div>}
            </div>
          )}
          <div className="form-group">
            <label>Email</label>
            <input
              className="input-field"
              type="email"
              placeholder="you@example.com"
              value={form.email}
              onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
            />
            {errors.email && <div className="form-error">{errors.email}</div>}
          </div>
          <div className="form-group">
            <label>Password</label>
            <input
              className="input-field"
              type="password"
              placeholder="Min 6 characters"
              value={form.password}
              onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
            />
            {errors.password && <div className="form-error">{errors.password}</div>}
          </div>
          {errors.submit && (
            <div className="form-error" style={{ marginBottom: '12px', textAlign: 'center' }}>
              {errors.submit}
            </div>
          )}
          <button className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', padding: '12px' }} disabled={loading}>
            {loading ? 'Please wait...' : (isLogin ? 'Sign In' : 'Create Account')}
          </button>
        </form>
        <div className="auth-toggle">
          {isLogin ? "Don't have an account?" : "Already have an account?"}
          <a onClick={toggleMode}>{isLogin ? ' Sign Up' : ' Sign In'}</a>
        </div>
      </div>
    </div>
  );
}
