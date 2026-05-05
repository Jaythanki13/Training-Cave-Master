import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  BookOpen, Menu, X, Mail, Lock, User, Upload, Download,
  Check, AlertCircle, Eye, EyeOff
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

// ─── Modal Shell ──────────────────────────────────────────────────────────────

const Modal = ({ children, onClose, title }) => {
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  return (
    <div
      className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={e => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8 relative max-h-[92vh] overflow-y-auto">
        <button onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 transition-colors p-1 rounded-lg hover:bg-slate-100">
          <X className="w-5 h-5" />
        </button>
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-9 h-9 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl flex items-center justify-center shadow-md shadow-orange-200">
            <BookOpen className="w-5 h-5 text-white" />
          </div>
          <h2 className="text-xl font-bold text-slate-900">{title}</h2>
        </div>
        {children}
      </div>
    </div>
  );
};

// ─── Login Form ────────────────────────────────────────────────────────────────

const LoginForm = ({ onSwitchToSignup, onClose }) => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const user = await login(email, password);
      onClose();
      if (user.role === 'trainer') navigate('/trainer');
      else if (user.role === 'super_admin') navigate('/admin');
      else navigate('/learner');
    } catch (err) {
      setError(err.message || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="flex items-center space-x-2 bg-red-50 border border-red-200 rounded-xl px-4 py-3">
          <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
          <span className="text-sm text-red-600">{error}</span>
        </div>
      )}
      <div>
        <label className="block text-sm font-semibold text-slate-700 mb-1.5">Email address</label>
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input type="email" value={email} onChange={e => setEmail(e.target.value)} required placeholder="you@example.com"
            className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-3 text-slate-900 text-sm focus:outline-none focus:border-amber-400 focus:bg-white focus:ring-2 focus:ring-amber-100 transition-all" />
        </div>
      </div>
      <div>
        <label className="block text-sm font-semibold text-slate-700 mb-1.5">Password</label>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input type={showPass ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)} required placeholder="••••••••"
            className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-10 py-3 text-slate-900 text-sm focus:outline-none focus:border-amber-400 focus:bg-white focus:ring-2 focus:ring-amber-100 transition-all" />
          <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
            {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>
      </div>
      <button type="submit" disabled={loading}
        className="w-full bg-gradient-to-r from-amber-500 to-orange-600 text-white py-3 rounded-xl font-semibold hover:from-amber-600 hover:to-orange-700 transition-all shadow-lg shadow-orange-200 disabled:opacity-60 disabled:cursor-not-allowed mt-2">
        {loading ? 'Signing in...' : 'Sign In'}
      </button>
      <p className="text-center text-slate-500 text-sm">
        Don't have an account?{' '}
        <button type="button" onClick={onSwitchToSignup} className="text-amber-600 hover:text-amber-700 font-semibold">Create one</button>
      </p>
    </form>
  );
};

// ─── Signup Form ──────────────────────────────────────────────────────────────

const SignupForm = ({ onSwitchToLogin, initialRole = 'learner' }) => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ fullName: '', email: '', password: '', role: initialRole, bio: '', expertise: '', agreeTerms: false });
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const set = (k, v) => setForm(p => ({ ...p, [k]: v }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.agreeTerms) { setError('Please agree to the terms of use'); return; }
    if (form.password.length < 6) { setError('Password must be at least 6 characters'); return; }
    setError(''); setLoading(true);
    try {
      const result = await register({ fullName: form.fullName, email: form.email, password: form.password, role: form.role, bio: form.bio || undefined, expertise: form.expertise || undefined });
      if (result?.pending) {
        setSuccess("Your trainer application has been submitted! We'll email you once it's approved.");
      } else {
        navigate('/learner');
      }
    } catch (err) {
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="space-y-5 text-center">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
          <Check className="w-8 h-8 text-green-600" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-slate-900 mb-2">Application submitted!</h3>
          <p className="text-sm text-slate-600">{success}</p>
        </div>
        <button onClick={onSwitchToLogin}
          className="w-full bg-gradient-to-r from-amber-500 to-orange-600 text-white py-3 rounded-xl font-semibold hover:from-amber-600 hover:to-orange-700 transition-all">
          Back to Sign In
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="flex items-center space-x-2 bg-red-50 border border-red-200 rounded-xl px-4 py-3">
          <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
          <span className="text-sm text-red-600">{error}</span>
        </div>
      )}
      <div>
        <label className="block text-sm font-semibold text-slate-700 mb-2">I want to...</label>
        <div className="grid grid-cols-2 gap-3">
          {[
            { role: 'learner', icon: Download, label: 'Learn', sub: 'Browse & download' },
            { role: 'trainer', icon: Upload, label: 'Teach', sub: 'Upload materials' },
          ].map(({ role, icon: Icon, label, sub }) => (
            <button key={role} type="button" onClick={() => set('role', role)}
              className={`py-3 px-4 rounded-xl border-2 transition-all text-left ${form.role === role ? 'border-amber-500 bg-amber-50' : 'border-slate-200 bg-white hover:border-slate-300'}`}>
              <Icon className={`w-5 h-5 mb-1 ${form.role === role ? 'text-amber-600' : 'text-slate-400'}`} />
              <div className={`font-semibold text-sm ${form.role === role ? 'text-amber-700' : 'text-slate-700'}`}>{label}</div>
              <div className="text-xs text-slate-400">{sub}</div>
            </button>
          ))}
        </div>
      </div>
      <div>
        <label className="block text-sm font-semibold text-slate-700 mb-1.5">Full Name</label>
        <div className="relative">
          <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input type="text" value={form.fullName} onChange={e => set('fullName', e.target.value)} required placeholder="John Doe"
            className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-3 text-slate-900 text-sm focus:outline-none focus:border-amber-400 focus:bg-white focus:ring-2 focus:ring-amber-100 transition-all" />
        </div>
      </div>
      <div>
        <label className="block text-sm font-semibold text-slate-700 mb-1.5">Email address</label>
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input type="email" value={form.email} onChange={e => set('email', e.target.value)} required placeholder="you@example.com"
            className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-3 text-slate-900 text-sm focus:outline-none focus:border-amber-400 focus:bg-white focus:ring-2 focus:ring-amber-100 transition-all" />
        </div>
      </div>
      <div>
        <label className="block text-sm font-semibold text-slate-700 mb-1.5">Password</label>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input type={showPass ? 'text' : 'password'} value={form.password} onChange={e => set('password', e.target.value)} required placeholder="Min. 6 characters" minLength={6}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-10 py-3 text-slate-900 text-sm focus:outline-none focus:border-amber-400 focus:bg-white focus:ring-2 focus:ring-amber-100 transition-all" />
          <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
            {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>
      </div>
      {form.role === 'trainer' && (
        <>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">Bio <span className="text-slate-400 font-normal">(optional)</span></label>
            <textarea value={form.bio} onChange={e => set('bio', e.target.value)} rows={2} placeholder="Brief description of your training background..."
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-900 text-sm resize-none focus:outline-none focus:border-amber-400 focus:bg-white focus:ring-2 focus:ring-amber-100 transition-all" />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">Expertise Areas <span className="text-slate-400 font-normal">(optional)</span></label>
            <input type="text" value={form.expertise} onChange={e => set('expertise', e.target.value)} placeholder="e.g., Leadership, Soft Skills, Technical"
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-900 text-sm focus:outline-none focus:border-amber-400 focus:bg-white focus:ring-2 focus:ring-amber-100 transition-all" />
          </div>
        </>
      )}
      <label className="flex items-start space-x-3 cursor-pointer bg-amber-50 border border-amber-200 rounded-xl p-3">
        <input type="checkbox" checked={form.agreeTerms} onChange={e => set('agreeTerms', e.target.checked)}
          className="mt-0.5 w-4 h-4 rounded border-slate-300 accent-amber-500 flex-shrink-0" />
        <span className="text-xs text-slate-600">
          I understand materials are for <span className="text-amber-700 font-semibold">internal use only</span>, not public distribution.
        </span>
      </label>
      <button type="submit" disabled={loading}
        className="w-full bg-gradient-to-r from-amber-500 to-orange-600 text-white py-3 rounded-xl font-semibold hover:from-amber-600 hover:to-orange-700 transition-all shadow-lg shadow-orange-200 disabled:opacity-60 mt-1">
        {loading ? 'Creating account...' : form.role === 'trainer' ? 'Request Trainer Access' : 'Create Free Account'}
      </button>
      {form.role === 'trainer' && (
        <p className="text-xs text-slate-400 text-center">Trainer accounts require admin approval. You'll be notified by email.</p>
      )}
      <p className="text-center text-slate-500 text-sm">
        Already have an account?{' '}
        <button type="button" onClick={onSwitchToLogin} className="text-amber-600 hover:text-amber-700 font-semibold">Sign in</button>
      </p>
    </form>
  );
};

// ─── Public Navbar ─────────────────────────────────────────────────────────────

const PublicNavbar = ({ defaultModal = null }) => {
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [modal, setModal] = useState(defaultModal);
  const [signupRole, setSignupRole] = useState('learner');
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => { setMenuOpen(false); }, [location.pathname]);

  const navLinks = [
    { to: '/', label: 'Home' },
    { to: '/about', label: 'About' },
    { to: '/contact', label: 'Contact' },
  ];

  const openSignup = (role = 'learner') => {
    setSignupRole(role);
    setModal('signup');
    setMenuOpen(false);
  };

  const isActive = (to) => location.pathname === to;

  return (
    <>
      <nav className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        scrolled || menuOpen
          ? 'bg-white shadow-sm border-b border-slate-100'
          : 'bg-white/80 backdrop-blur-md'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-2.5 flex-shrink-0">
              <div className="w-9 h-9 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl flex items-center justify-center shadow-md shadow-orange-200">
                <BookOpen className="w-5 h-5 text-white" />
              </div>
              <span className="text-lg font-bold text-slate-900 tracking-tight">Training Cave</span>
            </Link>

            {/* Desktop links */}
            <div className="hidden md:flex items-center space-x-1">
              {navLinks.map(({ to, label }) => (
                <Link key={to} to={to}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    isActive(to)
                      ? 'text-amber-600 bg-amber-50'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}>
                  {label}
                </Link>
              ))}
            </div>

            {/* Desktop auth */}
            <div className="hidden md:flex items-center space-x-3">
              <button onClick={() => setModal('login')}
                className="text-slate-600 hover:text-slate-900 text-sm font-medium transition-colors px-4 py-2 rounded-lg hover:bg-slate-100">
                Sign In
              </button>
              <button onClick={() => openSignup('learner')}
                className="bg-gradient-to-r from-amber-500 to-orange-600 text-white px-5 py-2 rounded-xl text-sm font-semibold hover:from-amber-600 hover:to-orange-700 transition-all shadow-md shadow-orange-200">
                Get Started Free
              </button>
            </div>

            {/* Mobile hamburger */}
            <button onClick={() => setMenuOpen(!menuOpen)}
              className="md:hidden p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-all">
              {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="md:hidden bg-white border-t border-slate-100 px-4 pb-5 pt-3 space-y-1">
            {navLinks.map(({ to, label }) => (
              <Link key={to} to={to}
                className={`flex items-center px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                  isActive(to) ? 'text-amber-600 bg-amber-50' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}>
                {label}
              </Link>
            ))}
            <div className="pt-3 border-t border-slate-100 grid grid-cols-2 gap-3">
              <button onClick={() => { setModal('login'); setMenuOpen(false); }}
                className="py-2.5 text-sm font-semibold text-slate-700 border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors">
                Sign In
              </button>
              <button onClick={() => openSignup('learner')}
                className="py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-amber-500 to-orange-600 rounded-xl shadow-md shadow-orange-200">
                Get Started
              </button>
            </div>
          </div>
        )}
      </nav>

      {modal === 'login' && (
        <Modal title="Welcome back" onClose={() => setModal(null)}>
          <LoginForm onClose={() => setModal(null)} onSwitchToSignup={() => setModal('signup')} />
        </Modal>
      )}
      {modal === 'signup' && (
        <Modal title="Join Training Cave" onClose={() => setModal(null)}>
          <SignupForm initialRole={signupRole} onSwitchToLogin={() => setModal('login')} />
        </Modal>
      )}
    </>
  );
};

export default PublicNavbar;
