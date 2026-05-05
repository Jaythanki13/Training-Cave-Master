import React from 'react';
import { Link } from 'react-router-dom';
import {
  Upload, BookOpen, Users, Shield, Download, ChevronRight,
  Star, TrendingUp, CheckCircle, Zap, Lock, Globe,
  FileText, Video, Archive, BookMarked, ArrowRight, Sparkles
} from 'lucide-react';
import PublicNavbar from '../components/PublicNavbar';
import PublicFooter from '../components/PublicFooter';
import SEO from '../components/SEO';

// ─── Hero ─────────────────────────────────────────────────────────────────────

const Hero = () => (
  <section className="relative min-h-screen flex items-center justify-center pt-16 overflow-hidden bg-white">
    {/* Soft decorative blobs */}
    <div className="absolute top-20 right-0 w-[500px] h-[500px] bg-amber-100 rounded-full blur-3xl opacity-60 -translate-y-1/4 translate-x-1/3 pointer-events-none" />
    <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-orange-50 rounded-full blur-3xl opacity-80 translate-y-1/4 -translate-x-1/4 pointer-events-none" />

    <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
      <div className="text-center max-w-4xl mx-auto">
        {/* Badge */}
        <div className="inline-flex items-center space-x-2 bg-amber-50 border border-amber-200 text-amber-700 text-sm px-4 py-1.5 rounded-full mb-8 font-medium">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Free training platform for every team member</span>
        </div>

        {/* Headline */}
        <h1 className="text-5xl sm:text-6xl md:text-7xl font-extrabold text-slate-900 leading-[1.1] tracking-tight mb-6">
          Your Central Hub for
          <span className="block text-transparent bg-clip-text bg-gradient-to-r from-amber-500 to-orange-600 mt-2">
            Training Excellence
          </span>
        </h1>

        <p className="text-lg sm:text-xl text-slate-600 max-w-2xl mx-auto mb-10 leading-relaxed">
          A secure, curated platform where expert trainers share knowledge and learners access premium training materials — anytime, from any device.
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-14">
          <button
            onClick={() => document.getElementById('get-started-btn')?.click()}
            className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 bg-gradient-to-r from-amber-500 to-orange-600 text-white px-8 py-4 rounded-2xl font-semibold text-lg hover:from-amber-600 hover:to-orange-700 transition-all shadow-xl shadow-orange-200 hover:shadow-orange-300 hover:-translate-y-0.5">
            <span>Start Learning Free</span>
            <ChevronRight className="w-5 h-5" />
          </button>
          <Link to="/about"
            className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 bg-white text-slate-700 px-8 py-4 rounded-2xl font-semibold text-lg border-2 border-slate-200 hover:border-amber-300 hover:text-amber-700 transition-all hover:-translate-y-0.5">
            <span>Learn More</span>
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>

        {/* Trust signals */}
        <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-sm text-slate-500">
          {[
            { icon: Shield, text: 'Secure & Private' },
            { icon: Lock, text: 'Login Protected' },
            { icon: Globe, text: 'Access Anywhere' },
            { icon: CheckCircle, text: 'Verified Trainers' },
          ].map(({ icon: Icon, text }) => (
            <div key={text} className="flex items-center space-x-1.5">
              <Icon className="w-4 h-4 text-amber-500" />
              <span>{text}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Feature preview cards */}
      <div className="mt-20 grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-3xl mx-auto">
        {[
          { icon: BookMarked, label: '7+ Categories', sub: 'From AI to Healthcare', color: 'bg-amber-50 text-amber-700 border-amber-200' },
          { icon: Download, label: 'Free Downloads', sub: 'No subscription needed', color: 'bg-blue-50 text-blue-700 border-blue-200' },
          { icon: Star, label: 'Rated Content', sub: 'Community-reviewed', color: 'bg-green-50 text-green-700 border-green-200' },
        ].map(({ icon: Icon, label, sub, color }) => (
          <div key={label} className={`flex items-center space-x-3 border rounded-2xl px-5 py-4 ${color}`}>
            <Icon className="w-6 h-6 flex-shrink-0" />
            <div>
              <div className="font-semibold text-sm">{label}</div>
              <div className="text-xs opacity-70">{sub}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

// ─── Stats ────────────────────────────────────────────────────────────────────

const Stats = () => (
  <section className="bg-gradient-to-r from-amber-500 to-orange-600 py-14">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center text-white">
        {[
          { value: '7+', label: 'Training Categories', sub: 'Soft Skills to AI & Beyond' },
          { value: 'Free', label: 'Access for All', sub: 'No subscription required' },
          { value: '1 GB', label: 'Per Upload', sub: 'Video, PDF, Slides & more' },
          { value: '100%', label: 'Secure Downloads', sub: 'Signed URLs, no public links' },
        ].map(({ value, label, sub }) => (
          <div key={label}>
            <div className="text-3xl sm:text-4xl font-extrabold mb-1">{value}</div>
            <div className="font-semibold text-sm sm:text-base text-white/90">{label}</div>
            <div className="text-white/70 text-xs mt-0.5 hidden sm:block">{sub}</div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

// ─── Features ─────────────────────────────────────────────────────────────────

const features = [
  { icon: Upload, title: 'Easy Upload', desc: 'Trainers upload in seconds. PDFs, PowerPoints, Videos, Spreadsheets — all supported up to 1 GB.', color: 'bg-blue-100 text-blue-600' },
  { icon: BookMarked, title: 'Rich Library', desc: 'Browse a curated library across 7 categories — Technical, AI, Soft Skills, Security, Healthcare & more.', color: 'bg-amber-100 text-amber-600' },
  { icon: Shield, title: 'Secure & Private', desc: 'All downloads use signed AWS S3 URLs. Content is never exposed publicly — every access is tracked.', color: 'bg-green-100 text-green-600' },
  { icon: Users, title: 'Verified Trainers', desc: 'Trainer approval system ensures only qualified contributors can upload materials.', color: 'bg-purple-100 text-purple-600' },
  { icon: Star, title: 'Ratings & Reviews', desc: 'Rate materials after downloading. Find the highest-quality content instantly with star ratings.', color: 'bg-yellow-100 text-yellow-600' },
  { icon: TrendingUp, title: 'Track & Bookmark', desc: 'Trainers see download stats. Learners bookmark favourites and revisit their personal library anytime.', color: 'bg-pink-100 text-pink-600' },
];

const Features = () => (
  <section className="py-20 bg-white">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-14">
        <div className="inline-flex items-center space-x-2 bg-slate-100 text-slate-600 text-sm px-3 py-1 rounded-full mb-4 font-medium">
          <Zap className="w-3.5 h-3.5" />
          <span>Platform capabilities</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">Everything you need to learn & teach</h2>
        <p className="text-slate-600 text-lg max-w-xl mx-auto">From uploading materials to tracking engagement — Training Cave covers the full lifecycle.</p>
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {features.map(({ icon: Icon, title, desc, color }) => (
          <div key={title} className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 group">
            <div className={`w-12 h-12 ${color} rounded-xl flex items-center justify-center mb-4`}>
              <Icon className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-semibold text-slate-900 mb-2 group-hover:text-amber-600 transition-colors">{title}</h3>
            <p className="text-slate-500 text-sm leading-relaxed">{desc}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

// ─── How It Works ─────────────────────────────────────────────────────────────

const HowItWorks = () => (
  <section className="py-20 bg-slate-50">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-14">
        <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">How it works</h2>
        <p className="text-slate-600 text-lg">Get up and running in three simple steps</p>
      </div>
      <div className="grid sm:grid-cols-3 gap-8 relative">
        {/* Dashed connector — desktop */}
        <div className="hidden lg:block absolute top-12 left-[calc(16.66%+2rem)] right-[calc(16.66%+2rem)] border-t-2 border-dashed border-amber-200" />
        {[
          { num: '01', icon: Users, title: 'Create Your Account', desc: 'Sign up as a Learner to browse or as a Trainer to share. Trainer accounts go through a quick approval step.', bg: 'bg-amber-500', shadow: 'shadow-amber-200' },
          { num: '02', icon: BookOpen, title: 'Explore or Upload', desc: 'Learners search, filter, bookmark and download. Trainers upload files up to 1 GB in any supported format.', bg: 'bg-blue-500', shadow: 'shadow-blue-200' },
          { num: '03', icon: TrendingUp, title: 'Learn & Grow', desc: 'Rate what you found valuable, revisit your saved collection, and track your engagement — from any device.', bg: 'bg-green-500', shadow: 'shadow-green-200' },
        ].map(({ num, icon: Icon, title, desc, bg, shadow }) => (
          <div key={num} className="flex flex-col items-center text-center relative">
            <div className={`relative w-20 h-20 ${bg} rounded-2xl flex items-center justify-center mb-6 shadow-xl ${shadow}`}>
              <Icon className="w-9 h-9 text-white" />
              <span className="absolute -top-2 -right-2 w-7 h-7 bg-white border-2 border-slate-100 rounded-full flex items-center justify-center text-xs font-bold text-slate-700 shadow-sm">{num}</span>
            </div>
            <h3 className="text-xl font-semibold text-slate-900 mb-3">{title}</h3>
            <p className="text-slate-500 text-sm leading-relaxed max-w-xs">{desc}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

// ─── Categories ───────────────────────────────────────────────────────────────

const categories = [
  { label: 'Soft Skills', color: 'bg-purple-100 text-purple-700 border-purple-200' },
  { label: 'Technical Training', color: 'bg-blue-100 text-blue-700 border-blue-200' },
  { label: 'AI & Trending Technologies', color: 'bg-amber-100 text-amber-700 border-amber-200' },
  { label: 'Security Training', color: 'bg-red-100 text-red-700 border-red-200' },
  { label: 'Tool-Based Training', color: 'bg-cyan-100 text-cyan-700 border-cyan-200' },
  { label: 'Official Certifications', color: 'bg-green-100 text-green-700 border-green-200' },
  { label: 'Healthcare Training', color: 'bg-pink-100 text-pink-700 border-pink-200' },
];

const Categories = () => (
  <section className="py-16 bg-white border-t border-slate-100">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
      <p className="text-slate-500 text-sm uppercase tracking-widest font-medium mb-8">Training Categories</p>
      <div className="flex flex-wrap justify-center gap-3">
        {categories.map(({ label, color }) => (
          <span key={label} className={`border rounded-full px-4 py-2 text-sm font-medium ${color}`}>
            {label}
          </span>
        ))}
      </div>
    </div>
  </section>
);

// ─── File Formats ─────────────────────────────────────────────────────────────

const FileFormats = () => (
  <section className="py-14 bg-slate-50 border-t border-slate-100">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
      <p className="text-slate-500 text-sm uppercase tracking-widest font-medium mb-8">Supported file formats</p>
      <div className="flex flex-wrap justify-center gap-3">
        {[
          { icon: FileText, label: 'PDF', color: 'text-red-500' },
          { icon: FileText, label: 'PowerPoint', color: 'text-orange-500' },
          { icon: FileText, label: 'Word', color: 'text-blue-500' },
          { icon: FileText, label: 'Excel', color: 'text-green-500' },
          { icon: Video, label: 'MP4 / Video', color: 'text-purple-500' },
          { icon: Archive, label: 'ZIP', color: 'text-yellow-600' },
        ].map(({ icon: Icon, label, color }) => (
          <div key={label} className="flex items-center space-x-2 bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-sm shadow-sm">
            <Icon className={`w-4 h-4 ${color}`} />
            <span className="text-slate-700 font-medium">{label}</span>
          </div>
        ))}
      </div>
    </div>
  </section>
);

// ─── CTA ──────────────────────────────────────────────────────────────────────

const CTA = () => (
  <section className="py-20 bg-white">
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
      <div className="bg-gradient-to-br from-amber-500 to-orange-600 rounded-3xl px-8 py-14 sm:px-14 relative overflow-hidden shadow-2xl shadow-orange-200">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(255,255,255,0.15)_0%,_transparent_60%)]" />
        <div className="relative">
          <div className="inline-flex items-center space-x-2 bg-white/20 text-white text-sm px-4 py-1.5 rounded-full mb-6 font-medium">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Free forever — no credit card required</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">Ready to start learning?</h2>
          <p className="text-white/85 text-lg mb-8 max-w-lg mx-auto">
            Join Training Cave today. Access the full library as a Learner or share your expertise as a Trainer.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            {/* Hidden trigger that the Navbar modal intercepts */}
            <button id="get-started-btn"
              className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 bg-white text-orange-600 px-8 py-4 rounded-2xl font-bold text-lg hover:bg-orange-50 transition-all shadow-lg hover:-translate-y-0.5">
              <span>Create Free Account</span>
              <ChevronRight className="w-5 h-5" />
            </button>
            <Link to="/contact"
              className="w-full sm:w-auto inline-flex items-center justify-center border-2 border-white/40 text-white px-8 py-4 rounded-2xl font-semibold text-lg hover:bg-white/10 transition-all">
              Have Questions?
            </Link>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-6 mt-8 text-white/70 text-sm">
            {['No credit card required', 'Free forever', 'Instant access'].map(text => (
              <div key={text} className="flex items-center space-x-1.5">
                <CheckCircle className="w-4 h-4 text-white/80" />
                <span>{text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  </section>
);

// ─── Main ─────────────────────────────────────────────────────────────────────

const LandingPage = () => (
  <div className="min-h-screen bg-white">
    <SEO path="/" />
    <PublicNavbar />
    <Hero />
    <Stats />
    <Features />
    <HowItWorks />
    <Categories />
    <FileFormats />
    <CTA />
    <PublicFooter />
  </div>
);

export default LandingPage;
