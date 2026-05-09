import React, { useState } from 'react';
import {
  Mail, MessageSquare, Clock, CheckCircle, AlertCircle,
  ChevronDown, ChevronUp, Send, User, BookOpen, ArrowRight
} from 'lucide-react';
import PublicNavbar from '../components/PublicNavbar';
import PublicFooter from '../components/PublicFooter';
import SEO from '../components/SEO';
import { contact as contactApi } from '../services/api';

const SUPPORT_EMAIL = 'trainingcave013@gmail.com';

/* ── Info cards ── */
const INFO_CARDS = [
  {
    icon: Mail,
    iconBg: 'bg-amber-100', iconColor: 'text-amber-600',
    title: 'Email Us',
    content: SUPPORT_EMAIL,
    href: `mailto:${SUPPORT_EMAIL}`,
    sub: 'We reply within 24–48 hours',
  },
  {
    icon: Clock,
    iconBg: 'bg-sky-100', iconColor: 'text-sky-600',
    title: 'Response Time',
    content: '24–48 Hours',
    sub: 'Monday – Friday',
  },
  {
    icon: MessageSquare,
    iconBg: 'bg-emerald-100', iconColor: 'text-emerald-600',
    title: 'Send a Message',
    content: 'Use the form below',
    sub: "We'll get right back to you",
  },
];

const InfoCards = () => (
  <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-14">
    {INFO_CARDS.map(({ icon: Icon, iconBg, iconColor, title, content, href, sub }) => (
      <div key={title} className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 text-center">
        <div className={`w-12 h-12 rounded-xl ${iconBg} flex items-center justify-center mx-auto mb-4`}>
          <Icon className={`w-6 h-6 ${iconColor}`} />
        </div>
        <h3 className="font-semibold text-slate-900 mb-1">{title}</h3>
        {href ? (
          <a href={href} className="text-amber-600 hover:text-amber-700 text-sm font-medium break-all">{content}</a>
        ) : (
          <p className="text-slate-700 text-sm font-medium">{content}</p>
        )}
        <p className="text-slate-400 text-xs mt-1">{sub}</p>
      </div>
    ))}
  </div>
);

/* ── Contact Form ── */
const SUBJECTS = [
  { value: '', label: 'Select a subject…' },
  { value: 'general', label: 'General Enquiry' },
  { value: 'technical', label: 'Technical Support' },
  { value: 'trainer', label: 'Become a Trainer' },
  { value: 'content', label: 'Content Issue' },
  { value: 'billing', label: 'Billing / Account' },
  { value: 'other', label: 'Other' },
];

const ContactForm = () => {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(false);

  const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.subject || !form.message) {
      setStatus({ type: 'error', text: 'Please fill in all fields.' });
      return;
    }
    setLoading(true);
    setStatus(null);
    try {
      await contactApi.submit(form);
      setStatus({ type: 'success', text: "Message sent! We'll get back to you within 24–48 hours." });
      setForm({ name: '', email: '', subject: '', message: '' });
    } catch (err) {
      setStatus({ type: 'error', text: err.message || 'Failed to send message. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  const inputCls = 'w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent transition';

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {status && (
        <div className={`flex items-start gap-3 p-4 rounded-xl text-sm ${
          status.type === 'success'
            ? 'bg-emerald-50 border border-emerald-200 text-emerald-700'
            : 'bg-red-50 border border-red-200 text-red-700'
        }`}>
          {status.type === 'success'
            ? <CheckCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
            : <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />}
          <span>{status.text}</span>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">
            <span className="flex items-center gap-1.5"><User className="w-3.5 h-3.5" /> Your Name</span>
          </label>
          <input type="text" placeholder="Jane Smith" value={form.name} onChange={set('name')} className={inputCls} />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">
            <span className="flex items-center gap-1.5"><Mail className="w-3.5 h-3.5" /> Email Address</span>
          </label>
          <input type="email" placeholder="jane@example.com" value={form.email} onChange={set('email')} className={inputCls} />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1.5">Subject</label>
        <select value={form.subject} onChange={set('subject')} className={inputCls}>
          {SUBJECTS.map(({ value, label }) => (
            <option key={value} value={value}>{label}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1.5">
          <span className="flex items-center gap-1.5"><MessageSquare className="w-3.5 h-3.5" /> Message</span>
        </label>
        <textarea
          rows={5}
          placeholder="How can we help you today?"
          value={form.message}
          onChange={set('message')}
          className={`${inputCls} resize-none`}
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-semibold py-3 px-6 rounded-xl transition-all disabled:opacity-60 shadow-sm hover:shadow-md"
      >
        {loading ? (
          <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Sending…</>
        ) : (
          <><Send className="w-4 h-4" /> Send Message</>
        )}
      </button>
    </form>
  );
};

/* ── FAQ ── */
const FAQS = [
  { q: 'How do I become a trainer?', a: 'Apply via the Contact form selecting "Become a Trainer". Our team will review your application and get back within 48 hours.' },
  { q: 'Are the materials free to download?', a: 'Access to materials requires a free learner account. Once registered and approved, you can download any active material.' },
  { q: 'What file types are supported?', a: 'Trainers can upload PDF, DOCX, PPTX, XLSX, MP4, and ZIP files. All uploads are virus-scanned before publishing.' },
  { q: 'How long do signed download links last?', a: 'Download links are valid for 60 minutes from the moment you click "Download". This keeps your content secure.' },
  { q: 'Can I rate a material I downloaded?', a: 'Yes! After downloading, a rating button appears on every material card so you can leave a 1–5 star review.' },
];

const FAQ = () => {
  const [open, setOpen] = useState(null);
  return (
    <div className="space-y-3">
      {FAQS.map((faq, i) => (
        <div key={i} className="border border-slate-200 rounded-xl overflow-hidden">
          <button
            onClick={() => setOpen(open === i ? null : i)}
            className="w-full flex items-center justify-between px-5 py-4 text-left bg-white hover:bg-slate-50 transition-colors"
          >
            <span className="font-medium text-slate-900 text-sm pr-4">{faq.q}</span>
            {open === i
              ? <ChevronUp className="w-4 h-4 text-amber-500 flex-shrink-0" />
              : <ChevronDown className="w-4 h-4 text-slate-400 flex-shrink-0" />}
          </button>
          {open === i && (
            <div className="px-5 pb-4 bg-white">
              <p className="text-slate-500 text-sm leading-relaxed">{faq.a}</p>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

/* ── Page ── */
const ContactPage = () => (
  <div className="min-h-screen bg-slate-50">
    <SEO
      title="Contact Us"
      description="Get in touch with the Training Cave team. We're here to help with any questions about our platform."
      path="/contact"
    />
    <PublicNavbar />

    {/* Hero */}
    <section className="py-16 bg-white border-b border-slate-100">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <span className="inline-block text-xs font-semibold tracking-widest text-amber-600 uppercase mb-3">Get in Touch</span>
        <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 mb-4">
          We'd Love to{' '}
          <span className="bg-gradient-to-r from-amber-500 to-orange-500 bg-clip-text text-transparent">Hear From You</span>
        </h1>
        <p className="text-slate-500 text-lg">Have a question, suggestion, or want to join as a trainer? Drop us a line and we'll be back within 48 hours.</p>
      </div>
    </section>

    <section className="py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <InfoCards />

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
          {/* Form */}
          <div className="lg:col-span-3 bg-white rounded-2xl shadow-sm border border-slate-100 p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center">
                <Send className="w-5 h-5 text-amber-600" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-slate-900">Send a Message</h2>
                <p className="text-slate-400 text-xs">We reply within 24–48 hours</p>
              </div>
            </div>
            <ContactForm />
          </div>

          {/* FAQ */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-sky-100 flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-sky-600" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-slate-900">FAQ</h2>
                <p className="text-slate-400 text-xs">Quick answers to common questions</p>
              </div>
            </div>
            <FAQ />

            {/* Direct email nudge */}
            <div className="mt-6 p-5 bg-amber-50 border border-amber-100 rounded-2xl">
              <p className="text-sm font-semibold text-slate-900 mb-1">Prefer email?</p>
              <a href={`mailto:${SUPPORT_EMAIL}`} className="text-amber-600 hover:text-amber-700 text-sm font-medium flex items-center gap-1.5 group">
                <Mail className="w-4 h-4" />
                {SUPPORT_EMAIL}
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
              </a>
              <p className="text-slate-400 text-xs mt-1">Response within 24–48 hours</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <PublicFooter />
  </div>
);

export default ContactPage;
