import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Mail, MessageSquare, Clock, CheckCircle, AlertCircle,
  ChevronDown, ChevronUp, Send, BookOpen, User
} from 'lucide-react';
import PublicNavbar from '../components/PublicNavbar';
import PublicFooter from '../components/PublicFooter';

const SUPPORT_EMAIL = 'trainingcave013@gmail.com';

// ─── Contact Form ─────────────────────────────────────────────────────────────

const ContactForm = () => {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [status, setStatus] = useState('idle'); // idle | loading | success | error
  const [errorMsg, setErrorMsg] = useState('');

  const set = (k, v) => setForm(prev => ({ ...prev, [k]: v }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('loading');
    setErrorMsg('');
    try {
      const BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
      const res = await fetch(`${BASE}/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || 'Failed to send message');
      setStatus('success');
      setForm({ name: '', email: '', subject: '', message: '' });
    } catch (err) {
      setStatus('error');
      setErrorMsg(err.message || 'Something went wrong. Please try again.');
    }
  };

  if (status === 'success') {
    return (
      <div className="text-center py-12">
        <div className="w-20 h-20 bg-green-500/10 border border-green-500/30 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="w-10 h-10 text-green-400" />
        </div>
        <h3 className="text-2xl font-bold text-white mb-3">Message sent!</h3>
        <p className="text-slate-400 mb-6 max-w-sm mx-auto">We've received your message and will get back to you within 24–48 hours. Check your inbox for a confirmation.</p>
        <button onClick={() => setStatus('idle')}
          className="bg-slate-700 hover:bg-slate-600 text-white px-6 py-3 rounded-xl transition-colors font-medium">
          Send another message
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {status === 'error' && (
        <div className="flex items-start space-x-2 bg-red-500/10 border border-red-500/30 rounded-xl px-4 py-3">
          <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
          <span className="text-sm text-red-400">{errorMsg}</span>
        </div>
      )}

      <div className="grid sm:grid-cols-2 gap-5">
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1.5">Your Name</label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input type="text" value={form.name} onChange={e => set('name', e.target.value)} required placeholder="John Doe"
              className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-10 pr-4 py-3 text-white text-sm focus:outline-none focus:border-amber-500 transition-colors placeholder:text-slate-600" />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1.5">Email Address</label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input type="email" value={form.email} onChange={e => set('email', e.target.value)} required placeholder="you@example.com"
              className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-10 pr-4 py-3 text-white text-sm focus:outline-none focus:border-amber-500 transition-colors placeholder:text-slate-600" />
          </div>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-300 mb-1.5">Subject</label>
        <select value={form.subject} onChange={e => set('subject', e.target.value)} required
          className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-amber-500 transition-colors appearance-none text-white">
          <option value="" disabled className="text-slate-500">Select a topic...</option>
          <option value="General Enquiry">General Enquiry</option>
          <option value="Trainer Application">Trainer Application</option>
          <option value="Technical Issue">Technical Issue</option>
          <option value="Content Report">Content Report</option>
          <option value="Account Help">Account Help</option>
          <option value="Partnership / Collaboration">Partnership / Collaboration</option>
          <option value="Other">Other</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-300 mb-1.5">Message</label>
        <textarea value={form.message} onChange={e => set('message', e.target.value)} required rows={5}
          placeholder="Tell us how we can help..."
          className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white text-sm resize-none focus:outline-none focus:border-amber-500 transition-colors placeholder:text-slate-600" />
      </div>

      <button type="submit" disabled={status === 'loading'}
        className="w-full bg-gradient-to-r from-amber-500 to-orange-600 text-white py-3.5 rounded-xl font-semibold hover:from-amber-600 hover:to-orange-700 transition-all shadow-lg shadow-orange-500/20 disabled:opacity-60 flex items-center justify-center space-x-2">
        <Send className="w-4 h-4" />
        <span>{status === 'loading' ? 'Sending...' : 'Send Message'}</span>
      </button>
    </form>
  );
};

// ─── FAQ ──────────────────────────────────────────────────────────────────────

const faqs = [
  { q: 'How do I become a trainer on Training Cave?', a: 'Click "Get Started" on the home page, choose "Trainer" as your role, fill in your details, and submit. Our team reviews all trainer applications and will notify you by email once approved — usually within 1–2 business days.' },
  { q: 'Is Training Cave free to use?', a: 'Yes, completely. Learners can browse and download all materials for free. There are no subscription fees, no hidden charges. Trainers can upload content at no cost.' },
  { q: 'What file formats are supported?', a: 'We support PDF, PowerPoint (PPTX), Word (DOCX), Excel (XLSX), MP4 video, AVI, MOV, MP3 audio, ZIP archives, and common code/data files (JSON, CSV, SQL, Python, JavaScript, Java). Each file can be up to 1 GB.' },
  { q: 'How are downloads secured?', a: 'All files are stored on AWS S3 with no public access. When you click download, we generate a time-limited signed URL (valid for 1 hour) that only you can use. This means your content is never accessible without authentication.' },
  { q: 'Can I upload content as a learner?', a: 'No. Only approved trainers and administrators can upload materials. This ensures quality control and that every piece of content comes from a verified source.' },
  { q: 'How do I report inappropriate content?', a: "Use the Contact form on this page and select 'Content Report' as the subject. Describe the material in question and we'll review it promptly." },
];

const FAQ = () => {
  const [open, setOpen] = useState(null);
  return (
    <section className="py-20 bg-slate-950">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-white mb-3">Frequently Asked Questions</h2>
          <p className="text-slate-400">Can't find your answer? <a href={`mailto:${SUPPORT_EMAIL}`} className="text-amber-400 hover:text-amber-300">Email us directly.</a></p>
        </div>
        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <div key={i} className={`bg-slate-800/50 border rounded-2xl transition-all overflow-hidden ${open === i ? 'border-amber-500/40' : 'border-slate-700'}`}>
              <button onClick={() => setOpen(open === i ? null : i)}
                className="w-full flex items-center justify-between px-6 py-4 text-left">
                <span className={`font-medium text-sm sm:text-base ${open === i ? 'text-amber-400' : 'text-white'}`}>{faq.q}</span>
                {open === i ? <ChevronUp className="w-4 h-4 text-amber-400 flex-shrink-0 ml-4" /> : <ChevronDown className="w-4 h-4 text-slate-400 flex-shrink-0 ml-4" />}
              </button>
              {open === i && (
                <div className="px-6 pb-5">
                  <p className="text-slate-400 text-sm leading-relaxed">{faq.a}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// ─── Main Page ────────────────────────────────────────────────────────────────

const ContactPage = () => (
  <div className="min-h-screen bg-slate-950">
    <PublicNavbar />

    {/* Hero */}
    <section className="relative pt-32 pb-16 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[300px] bg-amber-500/5 rounded-full blur-3xl" />
      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="inline-flex items-center space-x-2 bg-amber-500/10 border border-amber-500/30 text-amber-400 text-sm px-4 py-1.5 rounded-full mb-6">
          <MessageSquare className="w-3.5 h-3.5" />
          <span>We're here to help</span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-extrabold text-white mb-4">Get in Touch</h1>
        <p className="text-xl text-slate-400 max-w-xl mx-auto">Have a question, feedback, or need support? We read every message and respond within 24–48 hours.</p>
      </div>
    </section>

    {/* Contact info cards */}
    <section className="py-10 bg-slate-900">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid sm:grid-cols-3 gap-4">
          {[
            { icon: Mail, title: 'Email Support', value: SUPPORT_EMAIL, sub: 'Direct inbox, no bot', href: `mailto:${SUPPORT_EMAIL}`, color: 'text-amber-400 border-amber-500/30 bg-amber-500/5' },
            { icon: Clock, title: 'Response Time', value: '24 – 48 hours', sub: 'Monday to Friday', color: 'text-blue-400 border-blue-500/30 bg-blue-500/5' },
            { icon: BookOpen, title: 'Platform Help', value: 'Check the FAQ below', sub: 'Most answers are there', color: 'text-green-400 border-green-500/30 bg-green-500/5' },
          ].map(({ icon: Icon, title, value, sub, href, color }) => (
            <div key={title} className={`border rounded-2xl p-5 ${color}`}>
              <Icon className="w-7 h-7 mb-3 opacity-80" />
              <div className="text-white font-semibold text-sm mb-1">{title}</div>
              {href
                ? <a href={href} className="text-sm hover:opacity-80 transition-opacity block truncate">{value}</a>
                : <div className="text-sm">{value}</div>
              }
              <div className="text-xs opacity-50 mt-0.5">{sub}</div>
            </div>
          ))}
        </div>
      </div>
    </section>

    {/* Form + FAQ side-by-side */}
    <section className="py-16 bg-slate-950">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-slate-800/50 border border-slate-700 rounded-3xl p-6 sm:p-10">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-white mb-2">Send us a message</h2>
            <p className="text-slate-400 text-sm">We'll send you a confirmation email and follow up shortly.</p>
          </div>
          <ContactForm />
        </div>
      </div>
    </section>

    <FAQ />
    <PublicFooter />
  </div>
);

export default ContactPage;
