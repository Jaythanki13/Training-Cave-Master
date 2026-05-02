import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload, BookOpen, Users, Shield, Download, ChevronRight, Mail, Lock, User, Check, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const TrainingCaveLanding = () => {
  const [showLogin, setShowLogin] = useState(false);
  const [showSignup, setShowSignup] = useState(false);
  const [signupRole, setSignupRole] = useState('learner');

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Navigation */}
      <nav className="border-b border-slate-700/50 bg-slate-900/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-orange-600 rounded-lg flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold text-white">Training Cave</span>
            </div>
            <div className="flex items-center space-x-4">
              <button 
                onClick={() => { setShowLogin(true); setShowSignup(false); }}
                className="text-slate-300 hover:text-white transition-colors"
              >
                Sign In
              </button>
              <button 
                onClick={() => { setShowSignup(true); setShowLogin(false); }}
                className="bg-gradient-to-r from-amber-500 to-orange-600 text-white px-6 py-2 rounded-lg hover:from-amber-600 hover:to-orange-700 transition-all shadow-lg shadow-orange-500/30"
              >
                Get Started
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
        <div className="text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
            Your Central Hub for
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-500">
              Training Excellence
            </span>
          </h1>
          <p className="text-xl text-slate-300 mb-8 max-w-2xl mx-auto">
            A secure platform where trainers share knowledge and learners access quality training materials — all in one place.
          </p>
          <div className="flex justify-center space-x-4">
            <button 
              onClick={() => { setShowSignup(true); setShowLogin(false); }}
              className="bg-gradient-to-r from-amber-500 to-orange-600 text-white px-8 py-4 rounded-lg hover:from-amber-600 hover:to-orange-700 transition-all shadow-xl shadow-orange-500/30 flex items-center space-x-2 text-lg font-semibold"
            >
              <span>Start Learning</span>
              <ChevronRight className="w-5 h-5" />
            </button>
            <button 
              onClick={() => { setShowSignup(true); setShowLogin(false); setSignupRole('trainer'); }}
              className="bg-slate-700/50 backdrop-blur-sm border border-slate-600 text-white px-8 py-4 rounded-lg hover:bg-slate-700 transition-all flex items-center space-x-2 text-lg"
            >
              <Upload className="w-5 h-5" />
              <span>I'm a Trainer</span>
            </button>
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          <FeatureCard 
            icon={<Upload className="w-8 h-8" />}
            title="Easy Upload"
            description="Trainers can upload materials in seconds. PDFs, slides, videos — we support it all."
          />
          <FeatureCard 
            icon={<BookOpen className="w-8 h-8" />}
            title="Rich Library"
            description="Access training materials across soft skills, technical, leadership, and more."
          />
          <FeatureCard 
            icon={<Shield className="w-8 h-8" />}
            title="Secure & Private"
            description="Your content is protected. Materials are for internal use only, not public distribution."
          />
          <FeatureCard 
            icon={<Users className="w-8 h-8" />}
            title="Controlled Access"
            description="Trainer approval system ensures quality. Only verified trainers can contribute."
          />
        </div>
      </div>

      {/* How It Works */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-3xl font-bold text-white text-center mb-12">How It Works</h2>
        <div className="grid md:grid-cols-3 gap-8">
          <StepCard 
            number="1"
            title="Sign Up"
            description="Choose your role: Learner or Trainer. Trainers go through a quick approval process."
          />
          <StepCard 
            number="2"
            title="Explore or Upload"
            description="Learners browse the library. Trainers upload and manage their training materials."
          />
          <StepCard 
            number="3"
            title="Learn & Grow"
            description="Access materials anytime. Download, learn, and apply knowledge in your organization."
          />
        </div>
      </div>

      {/* Stats Section */}
      <div className="bg-gradient-to-r from-amber-500/10 to-orange-600/10 border-y border-amber-500/20 py-16 my-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-amber-400 mb-2">Free Access</div>
              <div className="text-slate-300">All materials available at no cost</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-amber-400 mb-2">1GB Limit</div>
              <div className="text-slate-300">Per file upload for quality content</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-amber-400 mb-2">Secure</div>
              <div className="text-slate-300">Login-protected, tracked downloads</div>
            </div>
          </div>
        </div>
      </div>

      {/* Login Modal */}
      {showLogin && (
        <Modal onClose={() => setShowLogin(false)} title="Sign In to Training Cave">
          <LoginForm onSwitchToSignup={() => { setShowLogin(false); setShowSignup(true); }} />
        </Modal>
      )}

      {/* Signup Modal */}
      {showSignup && (
        <Modal onClose={() => setShowSignup(false)} title="Join Training Cave">
          <SignupForm 
            initialRole={signupRole}
            onSwitchToLogin={() => { setShowSignup(false); setShowLogin(true); }} 
          />
        </Modal>
      )}

      {/* Footer */}
      <footer className="border-t border-slate-700/50 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-amber-500 to-orange-600 rounded-lg flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-white" />
              </div>
              <span className="text-slate-400">© 2024 Training Cave. Built for learners & trainers.</span>
            </div>
            <div className="text-slate-400">
              Contact: <a href="mailto:jay.thanki@cognixia.com" className="text-amber-400 hover:text-amber-300">jay.thanki@cognixia.com</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

const FeatureCard = ({ icon, title, description }) => (
  <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-6 hover:border-amber-500/50 transition-all">
    <div className="w-12 h-12 bg-gradient-to-br from-amber-500/20 to-orange-600/20 rounded-lg flex items-center justify-center mb-4 text-amber-400">
      {icon}
    </div>
    <h3 className="text-xl font-semibold text-white mb-2">{title}</h3>
    <p className="text-slate-400">{description}</p>
  </div>
);

const StepCard = ({ number, title, description }) => (
  <div className="text-center">
    <div className="w-16 h-16 bg-gradient-to-br from-amber-500 to-orange-600 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold text-white shadow-lg shadow-orange-500/30">
      {number}
    </div>
    <h3 className="text-xl font-semibold text-white mb-2">{title}</h3>
    <p className="text-slate-400">{description}</p>
  </div>
);

const Modal = ({ children, onClose, title }) => (
  <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
    <div className="bg-slate-800 border border-slate-700 rounded-2xl max-w-md w-full p-8 relative">
      <button 
        onClick={onClose}
        className="absolute top-4 right-4 text-slate-400 hover:text-white"
      >
        ✕
      </button>
      <h2 className="text-2xl font-bold text-white mb-6">{title}</h2>
      {children}
    </div>
  </div>
);

const LoginForm = ({ onSwitchToSignup }) => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const user = await login(email, password);
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
        <div className="flex items-center space-x-2 bg-red-500/10 border border-red-500/30 rounded-lg px-4 py-3">
          <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
          <span className="text-sm text-red-400">{error}</span>
        </div>
      )}
      <div>
        <label className="block text-sm font-medium text-slate-300 mb-2">Email</label>
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full bg-slate-900 border border-slate-600 rounded-lg pl-10 pr-4 py-3 text-white focus:outline-none focus:border-amber-500 transition-colors"
            placeholder="you@example.com"
            required
          />
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-slate-300 mb-2">Password</label>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full bg-slate-900 border border-slate-600 rounded-lg pl-10 pr-4 py-3 text-white focus:outline-none focus:border-amber-500 transition-colors"
            placeholder="••••••••"
            required
          />
        </div>
      </div>
      <button
        type="submit"
        disabled={loading}
        className="w-full bg-gradient-to-r from-amber-500 to-orange-600 text-white py-3 rounded-lg hover:from-amber-600 hover:to-orange-700 transition-all shadow-lg shadow-orange-500/30 font-semibold disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {loading ? 'Signing in...' : 'Sign In'}
      </button>
      <p className="text-center text-slate-400 text-sm">
        Don't have an account?{' '}
        <button
          type="button"
          onClick={onSwitchToSignup}
          className="text-amber-400 hover:text-amber-300"
        >
          Sign up
        </button>
      </p>
    </form>
  );
};

const SignupForm = ({ onSwitchToLogin, initialRole }) => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    role: initialRole || 'learner',
    bio: '',
    expertise: '',
    agreeTerms: false,
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.agreeTerms) { setError('Please agree to the terms of use'); return; }
    setError('');
    setLoading(true);
    try {
      const result = await register({
        fullName: formData.fullName,
        email: formData.email,
        password: formData.password,
        role: formData.role,
        bio: formData.bio || undefined,
        expertise: formData.expertise || undefined,
      });
      if (result?.pending) {
        setSuccess('Account created! Your trainer request has been sent to the admin. You\'ll receive an email once approved.');
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
      <div className="space-y-6">
        <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-5 flex items-start space-x-3">
          <Check className="w-6 h-6 text-green-400 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-slate-300">{success}</p>
        </div>
        <button
          type="button"
          onClick={onSwitchToLogin}
          className="w-full bg-gradient-to-r from-amber-500 to-orange-600 text-white py-3 rounded-lg hover:from-amber-600 hover:to-orange-700 transition-all font-semibold"
        >
          Back to Sign In
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="flex items-center space-x-2 bg-red-500/10 border border-red-500/30 rounded-lg px-4 py-3">
          <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
          <span className="text-sm text-red-400">{error}</span>
        </div>
      )}
      <div>
        <label className="block text-sm font-medium text-slate-300 mb-2">I am a...</label>
        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => setFormData({ ...formData, role: 'learner' })}
            className={`py-3 rounded-lg border-2 transition-all ${
              formData.role === 'learner'
                ? 'border-amber-500 bg-amber-500/10 text-white'
                : 'border-slate-600 bg-slate-900 text-slate-400 hover:border-slate-500'
            }`}
          >
            <Download className="w-5 h-5 mx-auto mb-1" />
            Learner
          </button>
          <button
            type="button"
            onClick={() => setFormData({ ...formData, role: 'trainer' })}
            className={`py-3 rounded-lg border-2 transition-all ${
              formData.role === 'trainer'
                ? 'border-amber-500 bg-amber-500/10 text-white'
                : 'border-slate-600 bg-slate-900 text-slate-400 hover:border-slate-500'
            }`}
          >
            <Upload className="w-5 h-5 mx-auto mb-1" />
            Trainer
          </button>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-300 mb-2">Full Name</label>
        <div className="relative">
          <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input
            type="text"
            value={formData.fullName}
            onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
            className="w-full bg-slate-900 border border-slate-600 rounded-lg pl-10 pr-4 py-3 text-white focus:outline-none focus:border-amber-500 transition-colors"
            placeholder="John Doe"
            required
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-300 mb-2">Email</label>
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className="w-full bg-slate-900 border border-slate-600 rounded-lg pl-10 pr-4 py-3 text-white focus:outline-none focus:border-amber-500 transition-colors"
            placeholder="you@example.com"
            required
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-300 mb-2">Password</label>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input
            type="password"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            className="w-full bg-slate-900 border border-slate-600 rounded-lg pl-10 pr-4 py-3 text-white focus:outline-none focus:border-amber-500 transition-colors"
            placeholder="••••••••"
            minLength={6}
            required
          />
        </div>
      </div>

      {formData.role === 'trainer' && (
        <>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Bio (Optional)</label>
            <textarea
              value={formData.bio}
              onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
              className="w-full bg-slate-900 border border-slate-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-amber-500 transition-colors"
              rows="2"
              placeholder="Tell us about your training experience..."
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Expertise Areas (Optional)</label>
            <input
              type="text"
              value={formData.expertise}
              onChange={(e) => setFormData({ ...formData, expertise: e.target.value })}
              className="w-full bg-slate-900 border border-slate-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-amber-500 transition-colors"
              placeholder="e.g., Leadership, Soft Skills, Technical"
            />
          </div>
        </>
      )}

      <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-4">
        <label className="flex items-start space-x-3 cursor-pointer">
          <input
            type="checkbox"
            checked={formData.agreeTerms}
            onChange={(e) => setFormData({ ...formData, agreeTerms: e.target.checked })}
            className="mt-1 w-5 h-5 rounded border-slate-600 bg-slate-900 text-amber-500 focus:ring-amber-500"
          />
          <span className="text-sm text-slate-300">
            I understand that materials uploaded are for{' '}
            <span className="text-amber-400 font-semibold">internal client use only</span>, not public distribution.
            My content remains my intellectual property.
          </span>
        </label>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-gradient-to-r from-amber-500 to-orange-600 text-white py-3 rounded-lg hover:from-amber-600 hover:to-orange-700 transition-all shadow-lg shadow-orange-500/30 font-semibold disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {loading
          ? 'Creating account...'
          : formData.role === 'trainer'
          ? 'Request Trainer Access'
          : 'Create Account'}
      </button>

      {formData.role === 'trainer' && (
        <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-3 flex items-start space-x-2">
          <Check className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-slate-300">
            Trainer accounts require approval. You'll receive an email once your account is verified.
          </p>
        </div>
      )}

      <p className="text-center text-slate-400 text-sm">
        Already have an account?{' '}
        <button
          type="button"
          onClick={onSwitchToLogin}
          className="text-amber-400 hover:text-amber-300"
        >
          Sign in
        </button>
      </p>
    </form>
  );
};

export default TrainingCaveLanding;
