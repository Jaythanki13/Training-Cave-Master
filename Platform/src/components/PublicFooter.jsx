import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Mail, Shield, Users, BookMarked, MessageSquare, ArrowRight } from 'lucide-react';

const SUPPORT_EMAIL = 'trainingcave013@gmail.com';

const PublicFooter = () => (
  <footer className="bg-slate-900 text-white">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-14 pb-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">

        {/* Brand */}
        <div className="sm:col-span-2 lg:col-span-1">
          <Link to="/" className="flex items-center space-x-2.5 mb-4">
            <div className="w-9 h-9 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-white" />
            </div>
            <span className="text-lg font-bold">Training Cave</span>
          </Link>
          <p className="text-slate-400 text-sm leading-relaxed">
            A secure, curated platform where trainers share knowledge and learners access quality training materials — anytime, anywhere.
          </p>
        </div>

        {/* Navigation */}
        <div>
          <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Navigate</h4>
          <ul className="space-y-3">
            {[
              { to: '/', label: 'Home' },
              { to: '/about', label: 'About Us' },
              { to: '/contact', label: 'Contact' },
            ].map(({ to, label }) => (
              <li key={to}>
                <Link to={to} className="text-slate-400 hover:text-amber-400 text-sm transition-colors flex items-center space-x-1 group">
                  <span>{label}</span>
                  <ArrowRight className="w-3 h-3 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Features */}
        <div>
          <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Features</h4>
          <ul className="space-y-3">
            {[
              { icon: BookMarked, label: 'Training Library' },
              { icon: Users, label: 'Expert Trainers' },
              { icon: Shield, label: 'Secure Access' },
              { icon: MessageSquare, label: 'Ratings & Reviews' },
            ].map(({ icon: Icon, label }) => (
              <li key={label} className="flex items-center space-x-2 text-slate-400 text-sm">
                <Icon className="w-3.5 h-3.5 text-amber-500/60 flex-shrink-0" />
                <span>{label}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Support */}
        <div>
          <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Support</h4>
          <div className="space-y-3">
            <a href={`mailto:${SUPPORT_EMAIL}`}
              className="flex items-start space-x-2 text-slate-400 hover:text-amber-400 text-sm transition-colors group">
              <Mail className="w-4 h-4 mt-0.5 flex-shrink-0" />
              <span className="break-all">{SUPPORT_EMAIL}</span>
            </a>
            <p className="text-slate-500 text-xs pl-6">Response within 24–48 hours</p>

            {/* "Send us a message" → navigates to /contact form */}
            <Link to="/contact"
              className="inline-flex items-center space-x-1.5 mt-2 text-xs font-medium text-amber-400 hover:text-amber-300 border border-amber-500/30 hover:border-amber-400/60 px-3 py-2 rounded-lg transition-all group">
              <MessageSquare className="w-3.5 h-3.5" />
              <span>Send us a message</span>
              <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-slate-800 pt-6 flex flex-col sm:flex-row justify-between items-center gap-3">
        <p className="text-slate-500 text-sm">
          © {new Date().getFullYear()} Training Cave. All rights reserved.
        </p>
        <div className="flex items-center space-x-1.5 text-slate-500 text-xs">
          <Shield className="w-3.5 h-3.5" />
          <span>Secure &amp; Private Platform</span>
        </div>
      </div>
    </div>
  </footer>
);

export default PublicFooter;
