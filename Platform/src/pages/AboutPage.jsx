import React from 'react';
import { Link } from 'react-router-dom';
import {
  BookOpen, Users, Shield, Star, Target, Heart, Zap, Globe,
  CheckCircle, ArrowRight, Award, TrendingUp, Lock
} from 'lucide-react';
import PublicNavbar from '../components/PublicNavbar';
import PublicFooter from '../components/PublicFooter';
import SEO from '../components/SEO';

/* ── Mission & Vision ── */
const MissionVision = () => (
  <section className="py-20 bg-white">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-14">
        <span className="inline-block text-xs font-semibold tracking-widest text-amber-600 uppercase mb-3">Our Story</span>
        <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 mb-4">
          Built for Learners,<br />
          <span className="bg-gradient-to-r from-amber-500 to-orange-500 bg-clip-text text-transparent">Powered by Trainers</span>
        </h1>
        <p className="text-slate-500 text-lg max-w-2xl mx-auto leading-relaxed">
          Training Cave was created to close the gap between expert trainers and eager learners — giving both a trusted, distraction-free space to grow.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {[
          {
            icon: Target,
            bgClass: 'bg-amber-50/40 border-amber-100',
            iconBg: 'bg-amber-100',
            iconColor: 'text-amber-600',
            title: 'Our Mission',
            text: 'To democratise access to high-quality training materials by connecting certified trainers with motivated learners on a secure, curated platform.',
          },
          {
            icon: Globe,
            bgClass: 'bg-sky-50/40 border-sky-100',
            iconBg: 'bg-sky-100',
            iconColor: 'text-sky-600',
            title: 'Our Vision',
            text: 'A world where anyone, anywhere can access expert knowledge without barriers — and where trainers are empowered to share their skills at scale.',
          },
        ].map(({ icon: Icon, bgClass, iconBg, iconColor, title, text }) => (
          <div key={title} className={`rounded-2xl p-8 border ${bgClass} shadow-sm`}>
            <div className={`w-12 h-12 rounded-xl ${iconBg} flex items-center justify-center mb-5`}>
              <Icon className={`w-6 h-6 ${iconColor}`} />
            </div>
            <h2 className="text-xl font-bold text-slate-900 mb-3">{title}</h2>
            <p className="text-slate-600 leading-relaxed">{text}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

/* ── Values ── */
const VALUES = [
  {
    icon: Shield, iconBg: 'bg-violet-100', iconColor: 'text-violet-600',
    title: 'Trust & Safety', text: 'Every trainer is verified. Every file is scanned. Your data is encrypted end-to-end.'
  },
  {
    icon: Star, iconBg: 'bg-amber-100', iconColor: 'text-amber-600',
    title: 'Quality First', text: 'Materials are curated and peer-rated so only the best content rises to the top.'
  },
  {
    icon: Heart, iconBg: 'bg-rose-100', iconColor: 'text-rose-600',
    title: 'Community Driven', text: 'Ratings, reviews, and feedback loops make Training Cave better for everyone.'
  },
  {
    icon: Zap, iconBg: 'bg-sky-100', iconColor: 'text-sky-600',
    title: 'Always Improving', text: 'We ship new features regularly, guided by the learners and trainers who use the platform.'
  },
];

const Values = () => (
  <section className="py-20 bg-slate-50">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-14">
        <span className="inline-block text-xs font-semibold tracking-widest text-amber-600 uppercase mb-3">What We Stand For</span>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900">Our Core Values</h2>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {VALUES.map(({ icon: Icon, iconBg, iconColor, title, text }) => (
          <div key={title} className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
            <div className={`w-11 h-11 rounded-xl ${iconBg} flex items-center justify-center mb-4`}>
              <Icon className={`w-5 h-5 ${iconColor}`} />
            </div>
            <h3 className="font-bold text-slate-900 mb-2">{title}</h3>
            <p className="text-slate-500 text-sm leading-relaxed">{text}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

/* ── Stats Strip ── */
const STATS = [
  { value: '500+', label: 'Training Materials' },
  { value: '50+', label: 'Expert Trainers' },
  { value: '2,000+', label: 'Learners Enrolled' },
  { value: '4.8★', label: 'Average Rating' },
];

const StatsStrip = () => (
  <section className="py-16 bg-gradient-to-r from-amber-500 to-orange-500">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center text-white">
        {STATS.map(({ value, label }) => (
          <div key={label}>
            <div className="text-4xl font-extrabold mb-1">{value}</div>
            <div className="text-amber-100 text-sm font-medium">{label}</div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

/* ── Capabilities ── */
const CAPABILITIES = [
  { icon: BookOpen, iconBg: 'bg-amber-100', iconColor: 'text-amber-600', title: 'Curated Library', text: 'Browse hundreds of training materials across technical, business, and soft-skill domains.' },
  { icon: Users, iconBg: 'bg-sky-100', iconColor: 'text-sky-600', title: 'Expert Trainers', text: 'Learn from verified professionals who bring real-world experience to every material.' },
  { icon: Lock, iconBg: 'bg-violet-100', iconColor: 'text-violet-600', title: 'Secure Downloads', text: 'Files are served via time-limited signed URLs — your content is always protected.' },
  { icon: Award, iconBg: 'bg-rose-100', iconColor: 'text-rose-600', title: 'Ratings & Reviews', text: 'Community-powered ratings help you pick the best materials every time.' },
  { icon: TrendingUp, iconBg: 'bg-emerald-100', iconColor: 'text-emerald-600', title: 'Track Progress', text: 'Bookmark favourites, track downloads, and build your personal learning library.' },
  { icon: CheckCircle, iconBg: 'bg-teal-100', iconColor: 'text-teal-600', title: 'Always Available', text: 'Access your saved materials anytime, from any device, at your own pace.' },
];

const Capabilities = () => (
  <section className="py-20 bg-white">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-14">
        <span className="inline-block text-xs font-semibold tracking-widest text-amber-600 uppercase mb-3">Platform</span>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900">Everything You Need to Grow</h2>
        <p className="text-slate-500 mt-3 max-w-xl mx-auto">One platform. All the tools to share, discover, and master knowledge.</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {CAPABILITIES.map(({ icon: Icon, iconBg, iconColor, title, text }) => (
          <div key={title} className="flex gap-4 p-6 rounded-2xl border border-slate-100 bg-slate-50/60 hover:bg-white hover:shadow-sm transition-all">
            <div className={`w-10 h-10 rounded-xl ${iconBg} flex items-center justify-center flex-shrink-0`}>
              <Icon className={`w-5 h-5 ${iconColor}`} />
            </div>
            <div>
              <h3 className="font-semibold text-slate-900 mb-1">{title}</h3>
              <p className="text-slate-500 text-sm leading-relaxed">{text}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

/* ── CTA ── */
const CTA = () => (
  <section className="py-20 bg-slate-50">
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
      <div className="bg-gradient-to-r from-amber-500 to-orange-500 rounded-3xl p-12 shadow-lg">
        <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-4">Ready to Start Learning?</h2>
        <p className="text-amber-100 text-lg mb-8">Join thousands of learners already growing with Training Cave.</p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/register"
            className="inline-flex items-center justify-center gap-2 bg-white text-amber-600 font-semibold px-8 py-3 rounded-xl hover:bg-amber-50 transition-colors shadow-sm">
            Get Started Free <ArrowRight className="w-4 h-4" />
          </Link>
          <Link to="/contact"
            className="inline-flex items-center justify-center gap-2 bg-white/20 border border-white/30 text-white font-semibold px-8 py-3 rounded-xl hover:bg-white/30 transition-colors">
            Contact Us
          </Link>
        </div>
      </div>
    </div>
  </section>
);

/* ── Page ── */
const AboutPage = () => (
  <div className="min-h-screen bg-white">
    <SEO
      title="About Us"
      description="Learn about Training Cave — our mission to connect expert trainers with motivated learners on a secure, curated platform."
      path="/about"
    />
    <PublicNavbar />
    <MissionVision />
    <Values />
    <StatsStrip />
    <Capabilities />
    <CTA />
    <PublicFooter />
  </div>
);

export default AboutPage;
