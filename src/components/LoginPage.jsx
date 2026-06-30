import { useState } from 'react';
import api from '../api/axios';

export default function LoginPage({ onLogin }) {
  const [mode,            setMode]            = useState('login'); // 'login' | 'signup' | 'forgot'
  const [email,           setEmail]           = useState('');
  const [password,        setPassword]        = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fullName,        setFullName]        = useState('');
  const [loading,         setLoading]         = useState(false);
  const [error,           setError]           = useState('');
  const [message,         setMessage]         = useState('');

  const clearMessages = () => { setError(''); setMessage(''); };

  // ── Sign In ──────────────────────────────────────────────────────────────
  const handleLogin = async () => {
    clearMessages();
    if (!email || !password) { setError('Please enter your email and password.'); return; }
    setLoading(true);
    try {
      const { data } = await api.post('/auth/login', { email, password });
      localStorage.setItem('veloride_token', data.token);
      onLogin(data.user);
    } catch (err) {
      setError(err.response?.data?.message ?? 'Login failed. Please try again.');
    }
    setLoading(false);
  };

  // ── Sign Up ──────────────────────────────────────────────────────────────
  const handleSignup = async () => {
    clearMessages();
    if (!fullName || !email || !password || !confirmPassword) {
      setError('Please fill in all fields.'); return;
    }
    if (password !== confirmPassword) { setError('Passwords do not match.'); return; }
    if (password.length < 6) { setError('Password must be at least 6 characters.'); return; }
    setLoading(true);
    try {
      const { data } = await api.post('/auth/signup', { fullName, email, password });
      localStorage.setItem('veloride_token', data.token);
      onLogin(data.user);
    } catch (err) {
      setError(err.response?.data?.message ?? 'Signup failed. Please try again.');
    }
    setLoading(false);
  };

  // ── Forgot Password ──────────────────────────────────────────────────────
  // Note: this just shows a message for now.
  // To make it actually send emails you need nodemailer on the backend.
  const handleForgot = async () => {
    clearMessages();
    if (!email) { setError('Enter your email address first.'); return; }
    setLoading(true);
    try {
      await api.post('/auth/forgot-password', { email });
      setMessage('If an account exists for that email, a reset link has been sent.');
    } catch (err) {
      setError(err.response?.data?.message ?? 'Something went wrong. Try again.');
    }
    setLoading(false);
  };

  // ── Enter key support ────────────────────────────────────────────────────
  const handleKeyDown = (e) => {
    if (e.key !== 'Enter') return;
    if (mode === 'login')  handleLogin();
    if (mode === 'signup') handleSignup();
    if (mode === 'forgot') handleForgot();
  };

  return (
    <div className="login-screen">
      <div className="login-card">

        {/* Logo */}
        <div className="login-logo">
          <div className="icon"><i className="ti ti-scooter"></i></div>
          <h2>VeloRide</h2>
          <p>Bike &amp; Scooter Rental Platform</p>
        </div>

        {/* Mode heading */}
        <div style={{ textAlign: 'center', marginBottom: '20px' }}>
          <h3 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text)' }}>
            {mode === 'login'  && 'Welcome back'}
            {mode === 'signup' && 'Create your account'}
            {mode === 'forgot' && 'Reset your password'}
          </h3>
          <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '2px' }}>
            {mode === 'login'  && 'Sign in to continue riding'}
            {mode === 'signup' && "Join VeloRide today — it's free"}
            {mode === 'forgot' && "We'll send a reset link to your inbox"}
          </p>
        </div>

        {/* Error banner */}
        {error && (
          <div style={{
            background: 'var(--danger-pale)', color: 'var(--danger)',
            border: '1px solid var(--danger)', borderRadius: '8px',
            padding: '10px 12px', fontSize: '12px', marginBottom: '14px',
            display: 'flex', alignItems: 'center', gap: '8px'
          }}>
            <i className="ti ti-alert-circle" style={{ fontSize: '15px', flexShrink: 0 }}></i>
            {error}
          </div>
        )}

        {/* Success / info banner */}
        {message && (
          <div style={{
            background: 'var(--primary-pale)', color: 'var(--primary)',
            border: '1px solid var(--primary)', borderRadius: '8px',
            padding: '10px 12px', fontSize: '12px', marginBottom: '14px',
            display: 'flex', alignItems: 'center', gap: '8px'
          }}>
            <i className="ti ti-circle-check" style={{ fontSize: '15px', flexShrink: 0 }}></i>
            {message}
          </div>
        )}

        {/* Full name — signup only */}
        {mode === 'signup' && (
          <div className="form-group">
            <label className="form-label">Full Name</label>
            <input
              className="form-control"
              type="text"
              placeholder="Alex Johnson"
              value={fullName}
              onChange={e => setFullName(e.target.value)}
              onKeyDown={handleKeyDown}
              autoFocus
            />
          </div>
        )}

        {/* Email */}
        <div className="form-group">
          <label className="form-label">Email Address</label>
          <input
            className="form-control"
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={e => setEmail(e.target.value)}
            onKeyDown={handleKeyDown}
            autoFocus={mode !== 'signup'}
          />
        </div>

        {/* Password — login + signup only */}
        {mode !== 'forgot' && (
          <div className="form-group">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '5px' }}>
              <label className="form-label" style={{ margin: 0 }}>Password</label>
              {mode === 'login' && (
                <button
                  style={{ fontSize: '11px', color: 'var(--primary)', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
                  onClick={() => { clearMessages(); setMode('forgot'); }}
                >
                  Forgot password?
                </button>
              )}
            </div>
            <input
              className="form-control"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={e => setPassword(e.target.value)}
              onKeyDown={handleKeyDown}
            />
          </div>
        )}

        {/* Confirm password — signup only */}
        {mode === 'signup' && (
          <div className="form-group">
            <label className="form-label">Confirm Password</label>
            <input
              className="form-control"
              type="password"
              placeholder="••••••••"
              value={confirmPassword}
              onChange={e => setConfirmPassword(e.target.value)}
              onKeyDown={handleKeyDown}
            />
          </div>
        )}

        {/* Primary action button */}
        <button
          className="btn btn-primary"
          style={{ width: '100%', justifyContent: 'center', padding: '10px', opacity: loading ? 0.7 : 1 }}
          onClick={
            mode === 'login'  ? handleLogin  :
            mode === 'signup' ? handleSignup :
            handleForgot
          }
          disabled={loading}
        >
          {loading ? (
            <>
              <i className="ti ti-loader-2" style={{ animation: 'spin 1s linear infinite' }}></i>
              Please wait…
            </>
          ) : (
            <>
              <i className={`ti ${
                mode === 'login'  ? 'ti-login'    :
                mode === 'signup' ? 'ti-user-plus' :
                'ti-send'
              }`}></i>
              {mode === 'login'  && 'Sign In'}
              {mode === 'signup' && 'Create Account'}
              {mode === 'forgot' && 'Send Reset Link'}
            </>
          )}
        </button>

        {/* Mode switcher links */}
        <div style={{ textAlign: 'center', marginTop: '16px', fontSize: '12px', color: 'var(--text-muted)' }}>
          {mode === 'login' && (
            <>Don't have an account?{' '}
              <button
                style={{ color: 'var(--primary)', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 600, fontSize: '12px' }}
                onClick={() => { clearMessages(); setMode('signup'); }}
              >
                Sign up free
              </button>
            </>
          )}
          {mode === 'signup' && (
            <>Already have an account?{' '}
              <button
                style={{ color: 'var(--primary)', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 600, fontSize: '12px' }}
                onClick={() => { clearMessages(); setMode('login'); }}
              >
                Sign in
              </button>
            </>
          )}
          {mode === 'forgot' && (
            <button
              style={{ color: 'var(--primary)', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 600, fontSize: '12px' }}
              onClick={() => { clearMessages(); setMode('login'); }}
            >
              ← Back to sign in
            </button>
          )}
        </div>

      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}