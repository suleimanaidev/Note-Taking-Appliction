import React from 'react';
import { Shield, Sparkles, Pin, Search, Trash2, Moon, ArrowRight, CheckCircle, Zap } from 'lucide-react';

export default function LandingPage({ onGetStarted, onSignIn }) {
  return (
    <div style={{ position: 'relative', zIndex: 1, minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Ambient Background Blobs */}
      <div className="bg-blobs">
        <div className="blob blob-1"></div>
        <div className="blob blob-2"></div>
        <div className="blob blob-3"></div>
      </div>

      {/* Top Navigation Bar */}
      <header style={{
        position: 'sticky',
        top: 0,
        zIndex: 100,
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        background: 'rgba(15,15,20,0.85)',
        borderBottom: '1px solid var(--border)',
        padding: '16px 40px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <h2 style={{ fontSize: '24px', fontWeight: 700, letterSpacing: '-0.5px' }}>
            Note<span style={{ color: 'var(--accent)' }}>Vault</span>
          </h2>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button className="btn btn-ghost" onClick={onSignIn}>Sign In</button>
          <button className="btn btn-primary" onClick={onGetStarted}>
            Get Started <ArrowRight size={16} />
          </button>
        </div>
      </header>

      {/* Main Hero Container with Vision Board / Office Background Image */}
      <section style={{
        maxWidth: '1140px',
        width: '92%',
        margin: '50px auto 70px',
        padding: '0'
      }}>
        <div style={{
          position: 'relative',
          borderRadius: '24px',
          overflow: 'hidden',
          backgroundImage: 'url("/landing_hero.png")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          border: '1px solid var(--border)',
          boxShadow: '0 24px 70px rgba(0,0,0,0.7), 0 0 60px rgba(232,168,73,0.22)'
        }}>
          {/* Slightly Darkened Glassmorphism Overlay (Slightly Reduced Transparency) */}
          <div style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(180deg, rgba(15,15,20,0.54) 0%, rgba(15,15,20,0.74) 65%, rgba(15,15,20,0.92) 100%)',
            backdropFilter: 'blur(2px)',
            WebkitBackdropFilter: 'blur(2px)',
            zIndex: 1
          }} />

          {/* Foreground Hero Content rendered ON TOP of Background Image */}
          <div style={{
            position: 'relative',
            zIndex: 2,
            padding: '90px 32px 80px',
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center'
          }}>
            {/* Top Pill Badge */}
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '8px 20px',
              borderRadius: '30px',
              background: 'rgba(15, 15, 20, 0.75)',
              border: '1px solid rgba(232,168,73,0.5)',
              color: 'var(--accent)',
              fontSize: '13px',
              fontWeight: 600,
              marginBottom: '28px',
              backdropFilter: 'blur(12px)',
              boxShadow: '0 4px 20px rgba(0,0,0,0.5)'
            }}>
              <Sparkles size={16} /> Fast, Secure & Intelligent Note Taking
            </div>

            {/* Primary Headline text on top of Background Image */}
            <h1 style={{
              fontSize: 'clamp(36px, 5.5vw, 62px)',
              fontWeight: 700,
              lineHeight: 1.15,
              letterSpacing: '-1px',
              marginBottom: '22px',
              maxWidth: '850px',
              textShadow: '0 4px 30px rgba(0,0,0,0.95), 0 2px 10px rgba(0,0,0,0.9)'
            }}>
              Capture Ideas. Organize Notes. <br />
              <span style={{ color: 'var(--accent)' }}>Secured in NoteVault.</span>
            </h1>

            {/* Secondary Paragraph text on top of Background Image */}
            <p style={{
              fontSize: 'clamp(16px, 2vw, 20px)',
              color: '#ffffff',
              maxWidth: '720px',
              lineHeight: 1.6,
              marginBottom: '40px',
              textShadow: '0 3px 16px rgba(0,0,0,0.95), 0 1px 6px rgba(0,0,0,0.9)',
              fontWeight: 400
            }}>
              A lightning-fast note-taking platform designed for ultimate clarity. Built with real-time search, category tagging, note pinning, and soft trash recovery.
            </p>

            {/* CTA Buttons */}
            <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', justifyContent: 'center', marginBottom: '44px' }}>
              <button
                className="btn btn-primary"
                style={{ padding: '14px 34px', fontSize: '16px', borderRadius: '10px', boxShadow: '0 4px 24px rgba(232,168,73,0.5)' }}
                onClick={onGetStarted}
              >
                Create Account Free <ArrowRight size={18} />
              </button>
              <button
                className="btn btn-secondary"
                style={{
                  padding: '14px 34px',
                  fontSize: '16px',
                  borderRadius: '10px',
                  background: 'rgba(15,15,20,0.75)',
                  backdropFilter: 'blur(12px)',
                  borderColor: 'rgba(255,255,255,0.2)'
                }}
                onClick={onSignIn}
              >
                Sign In to Dashboard
              </button>
            </div>

            {/* Feature Pill Badges */}
            <div style={{
              display: 'flex',
              gap: '24px',
              flexWrap: 'wrap',
              justifyContent: 'center',
              color: '#e0e0f0',
              fontSize: '13px',
              fontWeight: 500,
              textShadow: '0 2px 10px rgba(0,0,0,0.9)'
            }}>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                <CheckCircle size={15} color="var(--accent)" /> Encrypted Data Storage
              </span>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                <CheckCircle size={15} color="var(--accent)" /> JWT Cookie Security
              </span>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                <CheckCircle size={15} color="var(--accent)" /> Real-Time Search & Tags
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Cards Grid */}
      <section style={{ maxWidth: '1100px', margin: '0 auto 80px', padding: '0 24px', width: '100%' }}>
        <h3 style={{ textTransform: 'uppercase', letterSpacing: '1px', fontSize: '12px', color: 'var(--text-secondary)', textAlign: 'center', marginBottom: '30px' }}>
          Everything You Need To Stay Organized
        </h3>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '20px'
        }}>
          <div style={{
            background: 'var(--bg-card)',
            border: '1px solid var(--border)',
            borderRadius: '16px',
            padding: '28px',
            transition: 'all 0.2s'
          }}>
            <div style={{ width: '44px', height: '44px', borderRadius: '10px', background: 'var(--accent-dim)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent)', marginBottom: '16px' }}>
              <Zap size={22} />
            </div>
            <h4 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '8px' }}>Real-Time Live Search</h4>
            <p style={{ color: 'var(--text-secondary)', fontSize: '14px', lineHeight: 1.5 }}>
              Instant debounced search across titles, contents, and categories with server-side pagination.
            </p>
          </div>

          <div style={{
            background: 'var(--bg-card)',
            border: '1px solid var(--border)',
            borderRadius: '16px',
            padding: '28px',
            transition: 'all 0.2s'
          }}>
            <div style={{ width: '44px', height: '44px', borderRadius: '10px', background: 'rgba(78,205,196,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#4ecdc4', marginBottom: '16px' }}>
              <Shield size={22} />
            </div>
            <h4 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '8px' }}>Cookie-Based Auth</h4>
            <p style={{ color: 'var(--text-secondary)', fontSize: '14px', lineHeight: 1.5 }}>
              Secure user authentication stored in httpOnly cookies with bcrypt password encryption.
            </p>
          </div>

          <div style={{
            background: 'var(--bg-card)',
            border: '1px solid var(--border)',
            borderRadius: '16px',
            padding: '28px',
            transition: 'all 0.2s'
          }}>
            <div style={{ width: '44px', height: '44px', borderRadius: '10px', background: 'rgba(255,107,107,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ff6b6b', marginBottom: '16px' }}>
              <Pin size={22} />
            </div>
            <h4 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '8px' }}>Pinned Notes & Sorting</h4>
            <p style={{ color: 'var(--text-secondary)', fontSize: '14px', lineHeight: 1.5 }}>
              Pin critical notes to top, sort by newest/oldest/A-Z, and tag with 8 vibrant color strips.
            </p>
          </div>

          <div style={{
            background: 'var(--bg-card)',
            border: '1px solid var(--border)',
            borderRadius: '16px',
            padding: '28px',
            transition: 'all 0.2s'
          }}>
            <div style={{ width: '44px', height: '44px', borderRadius: '10px', background: 'rgba(168,216,234,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#a8d8ea', marginBottom: '16px' }}>
              <Trash2 size={22} />
            </div>
            <h4 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '8px' }}>Trash Bin & Restore</h4>
            <p style={{ color: 'var(--text-secondary)', fontSize: '14px', lineHeight: 1.5 }}>
              Soft deletion recovery bin allows restoring accidentally deleted notes or permanently emptying trash.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{
        marginTop: 'auto',
        borderTop: '1px solid var(--border)',
        padding: '24px 40px',
        textAlign: 'center',
        color: 'var(--text-secondary)',
        fontSize: '13px'
      }}>
        NoteVault © 2026 — All rights reserved.
      </footer>
    </div>
  );
}
