import React from 'react';
import { Link } from 'react-router-dom';
import {
  BookOpen, Target, Heart, Lightbulb, Shield, Users,
  CheckCircle, Star, TrendingUp, Globe, ChevronRight, Zap
} from 'lucide-react';
import PublicNavbar from '../components/PublicNavbar';
import PublicFooter from '../components/PublicFooter';

const AboutPage = () => (
  <div className="min-h-screen bg-slate-950">
    <PublicNavbar />

    {/* Hero */}
    <section className="relative pt-32 pb-20 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-amber-500/5 rounded-full blur-3xl" />
      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="inline-flex items-center space-x-2 bg-amber-500/10 border border-amber-500/30 text-amber-400 text-sm px-4 py-1.5 rounded-full mb-6">
          <Heart className="w-3.5 h-3.5" />
          <span>Our Story</span>
        </div>
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-white leading-tight mb-6">
          Built for learning.
          <span className="block text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-500">
            Driven by community.
          </span>
        </h1>
        <p className="text-xl text-slate-400 leading-relaxed max-w-2xl mx-auto">
          Training Cave was born from a simple idea: every organisation deserves a single, secure place to store, share, and discover training knowledge.
        </p>
      </div>
    </section>

    {/* Mission & Vision */}
    <section className="py-16 bg-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-8 hover:border-amber-500/30 transition-all">
            <div className="w-12 h-12 bg-gradient-to-br from-amber-500/20 to-orange-600/20 rounded-xl flex items-center justify-center mb-5">
              <Target className="w-6 h-6 text-amber-400" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-4">Our Mission</h3>
            <p className="text-slate-400 leading-relaxed">
              To create a centralised, secure, and accessible training platform that empowers organisations to share knowledge efficiently — breaking down silos and connecting learners with the right materials at the right time.
            </p>
          </div>
          <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-8 hover:border-blue-500/30 transition-all">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500/20 to-blue-600/20 rounded-xl flex items-center justify-center mb-5">
              <Lightbulb className="w-6 h-6 text-blue-400" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-4">Our Vision</h3>
            <p className="text-slate-400 leading-relaxed">
              A world where every employee has instant access to quality training materials — regardless of department, location, or role. Training Cave is the infrastructure that makes continuous learning the default, not the exception.
            </p>
          </div>
        </div>
      </div>
    </section>

    {/* Values */}
    <section className="py-20 bg-slate-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">What we stand for</h2>
          <p className="text-slate-400 text-lg max-w-xl mx-auto">Four principles guide every decision we make on this platform.</p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { icon: Shield, title: 'Security First', desc: 'Content is protected at every layer. Signed download URLs, JWT authentication, and role-based access ensure materials stay private.', color: 'from-green-500/20 to-green-600/20 text-green-400' },
            { icon: Users, title: 'Community Driven', desc: 'Trainers and learners shape the platform together. Ratings, reviews and bookmarks surface the content that truly makes a difference.', color: 'from-blue-500/20 to-blue-600/20 text-blue-400' },
            { icon: Star, title: 'Quality Over Quantity', desc: 'Trainer approval ensures only verified, knowledgeable contributors can upload. Every piece of content is intentional.', color: 'from-amber-500/20 to-orange-600/20 text-amber-400' },
            { icon: Globe, title: 'Accessible Everywhere', desc: 'Mobile-first, responsive design means learners can access materials from any device, in any location, at any time.', color: 'from-purple-500/20 to-purple-600/20 text-purple-400' },
          ].map(({ icon: Icon, title, desc, color }) => (
            <div key={title} className="bg-slate-800/50 border border-slate-700 rounded-2xl p-6 hover:border-amber-500/30 hover:-translate-y-1 transition-all duration-300 text-center">
              <div className={`w-14 h-14 bg-gradient-to-br ${color} rounded-2xl flex items-center justify-center mx-auto mb-4`}>
                <Icon className="w-7 h-7" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">{title}</h3>
              <p className="text-slate-400 text-sm leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>

    {/* What We Offer */}
    <section className="py-20 bg-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <div className="inline-flex items-center space-x-2 bg-amber-500/10 border border-amber-500/30 text-amber-400 text-sm px-3 py-1 rounded-full mb-6">
              <Zap className="w-3.5 h-3.5" />
              <span>Platform capabilities</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">Everything in one place</h2>
            <p className="text-slate-400 text-lg mb-8 leading-relaxed">
              Training Cave is not just a file store — it's a full learning ecosystem with curated content, smart discovery, and engagement tracking.
            </p>
            <ul className="space-y-4">
              {[
                'Browse 7+ training categories with advanced search & filtering',
                'Download-protected materials via signed secure URLs',
                'Rate and review content; see what peers recommend',
                'Bookmark materials and revisit your personal library',
                'Explore trainer profiles and their full catalog',
                'Admin oversight: approve trainers, manage users & content',
              ].map(item => (
                <li key={item} className="flex items-start space-x-3">
                  <CheckCircle className="w-5 h-5 text-amber-500 mt-0.5 flex-shrink-0" />
                  <span className="text-slate-300 text-sm">{item}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {[
              { icon: BookOpen, label: 'Training Library', value: '7+ Categories', color: 'amber' },
              { icon: Users, label: 'Verified Trainers', value: 'Approval Required', color: 'blue' },
              { icon: TrendingUp, label: 'Analytics', value: 'Download Tracking', color: 'green' },
              { icon: Star, label: 'Quality Control', value: 'Ratings & Reviews', color: 'purple' },
            ].map(({ icon: Icon, label, value, color }) => {
              const colors = {
                amber: 'border-amber-500/30 bg-amber-500/5 text-amber-400',
                blue: 'border-blue-500/30 bg-blue-500/5 text-blue-400',
                green: 'border-green-500/30 bg-green-500/5 text-green-400',
                purple: 'border-purple-500/30 bg-purple-500/5 text-purple-400',
              };
              return (
                <div key={label} className={`border rounded-2xl p-5 ${colors[color]}`}>
                  <Icon className="w-8 h-8 mb-3 opacity-80" />
                  <div className="text-white font-semibold text-sm mb-1">{label}</div>
                  <div className="text-xs opacity-70">{value}</div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>

    {/* CTA */}
    <section className="py-20 bg-slate-950">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">Join the community</h2>
        <p className="text-slate-400 text-lg mb-8">
          Whether you're here to learn or to teach — Training Cave welcomes you.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link to="/"
            className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 bg-gradient-to-r from-amber-500 to-orange-600 text-white px-8 py-4 rounded-xl font-semibold hover:from-amber-600 hover:to-orange-700 transition-all shadow-xl shadow-orange-500/25">
            <span>Get Started Free</span>
            <ChevronRight className="w-5 h-5" />
          </Link>
          <Link to="/contact"
            className="w-full sm:w-auto inline-flex items-center justify-center border border-slate-600 text-slate-300 px-8 py-4 rounded-xl font-medium hover:border-slate-500 hover:text-white transition-all">
            Talk to Us
          </Link>
        </div>
      </div>
    </section>

    <PublicFooter />
  </div>
);

export default AboutPage;
