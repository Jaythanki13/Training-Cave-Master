import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Mail, Shield, Users, BookMarked, MessageSquare } from 'lucide-react';

const PublicFooter = () => (
  <footer className="bg-slate-900 border-t border-slate-700/50">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-10">
        {/* Brand */}
        <div className="sm:col-span-2 lg:col-span-1">
          <Link to="/" className="flex items-center space-x-3 mb-4">
            <div className="w-9 h-9 bg-gradient-to-br from-amber-500 to-orange-600 rounded-lg flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-white" />
            </div>
            <span className="text-lg font-bold text-white">Training Cave</span>
          </Link>
          <p className="text-slate-400 text-sm leading-relaxed">
            A secure platform where trainers share knowledge and learners access quality training materials — all in one place.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Platform</h4>
          <ul className="space-y-2.5">
            {[
              { to: '/', label: 'Home' },
              { to: '/about', label: 'About Us' },
              { to: '/contact', label: 'Contact' },
            ].map(({ to, label }) => (
              <li key={to}>
                <Link to={to} className="text-slate-400 hover:text-amber-400 text-sm transition-colors">
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Features */}
        <div>
          <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Features</h4>
          <ul className="space-y-2.5">
            {[
              { icon: BookMarked, label: 'Training Library' },
              { icon: Users, label: 'Expert Trainers' },
              { icon: Shield, label: 'Secure Access' },
              { icon: MessageSquare, label: 'Ratings & Reviews' },
            ].map(({ icon: Icon, label }) => (
              <li key={label} className="flex items-center space-x-2 text-slate-400 text-sm">
                <Icon className="w-3.5 h-3.5 text-amber-500/70 flex-shrink-0" />
                <span>{label}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Support</h4>
          <div className="space-y-3">
            <a
              href="mailto:trainingcave013@gmail.com"
              className="flex items-center space-x-2 text-slate-400 hover:text-amber-400 text-sm transition-colors"
            >
              <Mail className="w-4 h-4 flex-shrink-0" />
              <span>trainingcave013@gmail.com</span>
            </a>
            <p className="text-slate-500 text-xs">Response time: 24–48 hours</p>
            <Link to="/contact"
              className="inline-block mt-2 text-xs text-amber-400 hover:text-amber-300 border border-amber-500/30 hover:border-amber-400/50 px-3 py-1.5 rounded-lg transition-all">
              Send us a message →
            </Link>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-slate-700/50 pt-6 flex flex-col sm:flex-row justify-between items-center space-y-3 sm:space-y-0">
        <p className="text-slate-500 text-sm">
          © {new Date().getFullYear()} Training Cave. All rights reserved.
        </p>
        <div className="flex items-center space-x-1 text-slate-500 text-xs">
          <Shield className="w-3.5 h-3.5" />
          <span>Secure &amp; Private Platform</span>
        </div>
      </div>
    </div>
  </footer>
);

export default PublicFooter;
