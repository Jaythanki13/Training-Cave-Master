import React from 'react';
import { Link } from 'react-router-dom';
import {
  Upload, BookOpen, Users, Shield, Download, ChevronRight,
  Star, TrendingUp, CheckCircle, Zap, Lock, Globe,
  FileText, Video, Archive, BookMarked, ArrowRight
} from 'lucide-react';
import PublicNavbar from '../components/PublicNavbar';
import PublicFooter from '../components/PublicFooter';

// ─── Section: Hero ────────────────────────────────────────────────────────────

const Hero = () => (
  <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
    {/* Background layers */}
    <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950" />
    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-amber-900/20 via-transparent to-transparent" />
    <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-amber-500/5 rounded-full blur-3xl" />
    <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-orange-500/5 rounded-full blur-3xl" />

    <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
      {/* Badge */}
      <div className="inline-flex items-center space-x-2 bg-amber-500/10 border border-amber-500/30 text-amber-400 text-sm px-4 py-1.5 rounded-full mb-8">
        <Zap className="w-3.5 h-3.5" />
        <span>Your internal training hub — free for all members</span>
      </div>

      {/* Headline */}
      <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold text-white leading-tight mb-6">
        One Place for All
        <span className="block mt-1 text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-orange-400 to-amber-500">
          Training Excellence
        </span>
      </h1>

      <p className="text-lg sm:text-xl text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed">
        A secure, curated platform where expert trainers share knowledge and learners access premium training materials — anytime, anywhere.
      </p>

      {/* CTA buttons */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
        <a href="#get-started"
          className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 bg-gradient-to-r from-amber-500 to-orange-600 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:from-amber-600 hover:to-orange-700 transition-all shadow-xl shadow-orange-500/30 hover:shadow-orange-500/40 hover:-translate-y-0.5">
          <span>Start Learning Free</span>
          <ChevronRight className="w-5 h-5" />
        </a>
        <Link to="/about"
          className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 bg-slate-800/60 backdrop-blur border border-slate-700 text-white px-8 py-4 rounded-xl font-medium text-lg hover:bg-slate-700/60 hover:border-slate-600 transition-all">
          <span>Learn More</span>
          <ArrowRight className="w-5 h-5" />
        </Link>
      </div>

      {/* Trust signals */}
      <div className="flex flex-wrap items-center justify-center gap-6 mt-14 text-sm text-slate-500">
        {[
          { icon: Shield, text: 'Secure & Private' },
          { icon: Lock, text: 'Login Protected' },
          { icon: Globe, text: 'Access Anywhere' },
          { icon: CheckCircle, text: 'Verified Trainers' },
        ].map(({ icon: Icon, text }) => (
          <div key={text} className="flex items-center space-x-2">
            <Icon className="w-4 h-4 text-amber-500/70" />
            <span>{text}</span>
          </div>
        ))}
      </div>
    </div>
  </section>
);

// ─── Section: Stats ───────────────────────────────────────────────────────────

const Stats = () => (
  <section className="bg-gradient-to-r from-amber-500/10 to-orange-500/10 border-y border-amber-500/20 py-12">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
        {[
          { value: '7+', label: 'Training Categories', sub: 'Soft Skills to AI & Beyond' },
          { value: 'Free', label: 'Access for All', sub: 'No subscription required' },
          { value: '1 GB', label: 'Per Upload', sub: 'Video, PDF, Slides & more' },
          { value: '100%', label: 'Secure Downloads', sub: 'Signed URLs, no public links' },
        ].map(({ value, label, sub }) => (
          <div key={label} className="space-y-1">
            <div className="text-3xl sm:text-4xl font-extrabold text-amber-400">{value}</div>
            <div className="text-white font-semibold text-sm sm:text-base">{label}</div>
            <div className="text-slate-500 text-xs hidden sm:block">{sub}</div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

// ─── Section: Features ────────────────────────────────────────────────────────

const features = [
  { icon: Upload, title: 'Easy Upload', description: 'Trainers upload in seconds. PDFs, PowerPoints, Videos, Spreadsheets — we support everything.', color: 'from-blue-500/20 to-blue-600/20 text-blue-400' },
  { icon: BookMarked, title: 'Rich Library', description: 'Browse a curated library across 7 categories — Technical, AI, Soft Skills, Security, Healthcare & more.', color: 'from-amber-500/20 to-orange-600/20 text-amber-400' },
  { icon: Shield, title: 'Secure & Private', description: 'All downloads are protected with signed S3 URLs. Content never exposed publicly.', color: 'from-green-500/20 to-green-600/20 text-green-400' },
  { icon: Users, title: 'Verified Trainers', description: 'Trainer approval system ensures only qualified contributors can upload materials.', color: 'from-purple-500/20 to-purple-600/20 text-purple-400' },
  { icon: Star, title: 'Ratings & Reviews', description: 'Learners rate materials after downloading. Find the highest-quality content instantly.', color: 'from-amber-500/20 to-yellow-600/20 text-yellow-400' },
  { icon: TrendingUp, title: 'Track Progress', description: 'Trainers see download counts and ratings. Learners bookmark favourites for later.', color: 'from-pink-500/20 to-rose-600/20 text-pink-400' },
];

const Features = () => (
  <section className="py-20 bg-slate-900">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-14">
        <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">Everything you need to learn & teach</h2>
        <p className="text-slate-400 text-lg max-w-xl mx-auto">From uploading materials to tracking engagement — Training Cave covers the full lifecycle.</p>
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {features.map(({ icon: Icon, title, description, color }) => (
          <div key={title} className="bg-slate-800/50 border border-slate-700 rounded-2xl p-6 hover:border-amber-500/40 hover:-translate-y-1 transition-all duration-300 group">
            <div className={`w-12 h-12 bg-gradient-to-br ${color} rounded-xl flex items-center justify-center mb-4`}>
              <Icon className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-amber-400 transition-colors">{title}</h3>
            <p className="text-slate-400 text-sm leading-relaxed">{description}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

// ─── Section: How It Works ────────────────────────────────────────────────────

const HowItWorks = () => (
  <section className="py-20 bg-slate-950">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-14">
        <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">How it works</h2>
        <p className="text-slate-400 text-lg">Get started in three simple steps</p>
      </div>
      <div className="relative">
        {/* Connecting line — desktop only */}
        <div className="hidden lg:block absolute top-10 left-1/6 right-1/6 h-0.5 bg-gradient-to-r from-transparent via-amber-500/30 to-transparent" />
        <div className="grid sm:grid-cols-3 gap-8">
          {[
            { num: '01', icon: Users, title: 'Create Your Account', desc: 'Sign up as a Learner to browse materials or as a Trainer to share knowledge. Trainer accounts go through a quick approval step.', color: 'from-amber-500 to-orange-600' },
            { num: '02', icon: BookOpen, title: 'Explore or Upload', desc: 'Learners search, filter by category, type or rating, bookmark favourites. Trainers upload files up to 1 GB in any supported format.', color: 'from-blue-500 to-blue-600' },
            { num: '03', icon: TrendingUp, title: 'Learn & Grow', desc: 'Download materials, rate what you found valuable, and revisit your saved collection anytime — from any device.', color: 'from-green-500 to-green-600' },
          ].map(({ num, icon: Icon, title, desc, color }) => (
            <div key={num} className="flex flex-col items-center text-center">
              <div className={`relative w-20 h-20 bg-gradient-to-br ${color} rounded-2xl flex items-center justify-center mb-6 shadow-lg`}>
                <Icon className="w-9 h-9 text-white" />
                <span className="absolute -top-2 -right-2 w-7 h-7 bg-slate-950 border border-slate-700 rounded-full flex items-center justify-center text-xs font-bold text-amber-400">{num}</span>
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">{title}</h3>
              <p className="text-slate-400 text-sm leading-relaxed max-w-xs">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  </section>
);

// ─── Section: File Formats ────────────────────────────────────────────────────

const fileFormats = [
  { icon: FileText, label: 'PDF', color: 'text-red-400' },
  { icon: FileText, label: 'PowerPoint', color: 'text-orange-400' },
  { icon: FileText, label: 'Word Docs', color: 'text-blue-400' },
  { icon: FileText, label: 'Excel', color: 'text-green-400' },
  { icon: Video, label: 'MP4 Video', color: 'text-purple-400' },
  { icon: Archive, label: 'ZIP Archive', color: 'text-yellow-400' },
];

const FileFormats = () => (
  <section className="py-16 bg-slate-900 border-t border-slate-800">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
      <p className="text-slate-500 text-sm uppercase tracking-widest mb-8 font-medium">Supported file formats</p>
      <div className="flex flex-wrap justify-center gap-4 sm:gap-6">
        {fileFormats.map(({ icon: Icon, label, color }) => (
          <div key={label} className="flex items-center space-x-2 bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-sm">
            <Icon className={`w-4 h-4 ${color}`} />
            <span className="text-slate-300">{label}</span>
          </div>
        ))}
      </div>
    </div>
  </section>
);

// ─── Section: CTA ─────────────────────────────────────────────────────────────

const CTA = () => (
  <section id="get-started" className="py-20 bg-slate-950">
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
      <div className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 border border-amber-500/20 rounded-3xl p-10 sm:p-14 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-amber-500/10 via-transparent to-transparent" />
        <div className="relative">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">Ready to start learning?</h2>
          <p className="text-slate-400 text-lg mb-8 max-w-lg mx-auto">
            Join Training Cave today — it's completely free. Access the full library as a Learner or share your expertise as a Trainer.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a href="#get-started" onClick={e => { e.preventDefault(); document.querySelector('[data-open-signup]')?.click(); }}
              className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 bg-gradient-to-r from-amber-500 to-orange-600 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:from-amber-600 hover:to-orange-700 transition-all shadow-xl shadow-orange-500/25">
              <span>Create Free Account</span>
              <ChevronRight className="w-5 h-5" />
            </a>
            <Link to="/contact"
              className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 border border-slate-600 text-slate-300 px-8 py-4 rounded-xl font-medium text-lg hover:border-slate-500 hover:text-white transition-all">
              <span>Have Questions?</span>
            </Link>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-4 mt-8 text-sm text-slate-500">
            {['No credit card required', 'Free forever', 'Cancel anytime'].map(text => (
              <div key={text} className="flex items-center space-x-1.5">
                <CheckCircle className="w-4 h-4 text-green-500/70" />
                <span>{text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  </section>
);

// ─── Main Landing Page ────────────────────────────────────────────────────────

const LandingPage = () => (
  <div className="min-h-screen bg-slate-950">
    <PublicNavbar />
    <Hero />
    <Stats />
    <Features />
    <HowItWorks />
    <FileFormats />
    <CTA />
    <PublicFooter />
  </div>
);

export default LandingPage;
