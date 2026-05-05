import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  BookOpen, ArrowLeft, Download, Star, FileText, Video, Music,
  Archive, Calendar, User, Tag, AlertCircle, Briefcase,
  Award, TrendingUp, Mail, ExternalLink
} from 'lucide-react';
import PublicNavbar from '../components/PublicNavbar';
import PublicFooter from '../components/PublicFooter';
import SEO from '../components/SEO';
import { trainers as trainersApi, materials as materialsApi } from '../services/api';
import { useAuth } from '../context/AuthContext';

/* ── helpers ── */
const fileIcon = (type) => {
  const icons = { video: Video, audio: Music, archive: Archive };
  const Icon = icons[type] || FileText;
  return <Icon className="w-4 h-4" />;
};

const fileTypeColor = (type) => ({
  pdf: 'bg-red-100 text-red-600',
  video: 'bg-violet-100 text-violet-600',
  audio: 'bg-emerald-100 text-emerald-600',
  archive: 'bg-sky-100 text-sky-600',
  document: 'bg-amber-100 text-amber-600',
  spreadsheet: 'bg-teal-100 text-teal-600',
  presentation: 'bg-orange-100 text-orange-600',
}[type] || 'bg-slate-100 text-slate-600');

const StarRating = ({ rating }) => (
  <div className="flex items-center gap-0.5">
    {[1, 2, 3, 4, 5].map(n => (
      <Star key={n} className={`w-3.5 h-3.5 ${n <= Math.round(rating) ? 'fill-amber-400 text-amber-400' : 'text-slate-300'}`} />
    ))}
  </div>
);

/* ── Material card ── */
const MaterialCard = ({ material, onDownload }) => (
  <div className="bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow p-5">
    <div className="flex items-start justify-between gap-3 mb-3">
      <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${fileTypeColor(material.file_type)}`}>
        {fileIcon(material.file_type)}
      </div>
      <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${fileTypeColor(material.file_type)}`}>
        {material.file_type?.toUpperCase()}
      </span>
    </div>

    <h3 className="font-semibold text-slate-900 text-sm leading-snug mb-1 line-clamp-2">{material.title}</h3>
    {material.description && (
      <p className="text-slate-400 text-xs leading-relaxed mb-3 line-clamp-2">{material.description}</p>
    )}

    <div className="flex items-center gap-3 text-xs text-slate-400 mb-3">
      {material.category_name && (
        <span className="flex items-center gap-1">
          <Tag className="w-3 h-3" />{material.category_name}
        </span>
      )}
      <span className="flex items-center gap-1">
        <Download className="w-3 h-3" />{material.download_count ?? 0}
      </span>
      {material.avg_rating > 0 && (
        <span className="flex items-center gap-1">
          <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
          {Number(material.avg_rating).toFixed(1)}
        </span>
      )}
    </div>

    <button
      onClick={() => onDownload(material.id)}
      className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white text-xs font-semibold py-2.5 rounded-xl transition-all"
    >
      <Download className="w-3.5 h-3.5" /> Download
    </button>
  </div>
);

/* ── Page ── */
const TrainerProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    trainersApi.getProfile(id)
      .then(setData)
      .catch(err => setError(err.message || 'Trainer not found'))
      .finally(() => setLoading(false));
  }, [id]);

  const handleDownload = async (materialId) => {
    if (!user) { navigate('/login'); return; }
    try {
      const { url } = await materialsApi.download(materialId);
      window.open(url, '_blank', 'noopener');
    } catch (err) {
      alert(err.message || 'Download failed');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50">
        <PublicNavbar />
        <div className="flex items-center justify-center py-32">
          <div className="w-10 h-10 border-4 border-amber-500/30 border-t-amber-500 rounded-full animate-spin" />
        </div>
        <PublicFooter />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen bg-slate-50">
        <PublicNavbar />
        <div className="max-w-xl mx-auto px-4 py-32 text-center">
          <div className="w-16 h-16 bg-red-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-8 h-8 text-red-500" />
          </div>
          <h2 className="text-xl font-bold text-slate-900 mb-2">Trainer Not Found</h2>
          <p className="text-slate-500 mb-6">{error || 'This trainer profile does not exist or has been removed.'}</p>
          <button onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-white font-semibold px-6 py-3 rounded-xl transition-colors">
            <ArrowLeft className="w-4 h-4" /> Go Back
          </button>
        </div>
        <PublicFooter />
      </div>
    );
  }

  const { trainer, materials } = data;
  const fullName = `${trainer.first_name} ${trainer.last_name}`;
  const initials = `${trainer.first_name?.[0] ?? ''}${trainer.last_name?.[0] ?? ''}`.toUpperCase();
  const totalDownloads = materials?.reduce((s, m) => s + (m.download_count ?? 0), 0) ?? 0;
  const avgRating = materials?.length
    ? (materials.reduce((s, m) => s + (Number(m.avg_rating) || 0), 0) / materials.length).toFixed(1)
    : null;

  return (
    <div className="min-h-screen bg-slate-50">
      <SEO
        title={`${fullName} — Trainer`}
        description={trainer.bio || `Browse training materials by ${fullName} on Training Cave.`}
      />
      <PublicNavbar />

      {/* Hero */}
      <section className="bg-white border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <button onClick={() => navigate(-1)}
            className="inline-flex items-center gap-1.5 text-slate-400 hover:text-slate-700 text-sm mb-8 transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back
          </button>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
            {/* Avatar */}
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center flex-shrink-0 shadow-lg">
              <span className="text-white font-extrabold text-2xl">{initials}</span>
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-3 mb-1">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">{fullName}</h1>
                <span className="inline-flex items-center gap-1 bg-emerald-100 text-emerald-700 text-xs font-semibold px-2.5 py-1 rounded-full">
                  <Award className="w-3 h-3" /> Verified Trainer
                </span>
              </div>
              {trainer.expertise && (
                <p className="text-amber-600 font-medium text-sm mb-2 flex items-center gap-1.5">
                  <Briefcase className="w-4 h-4" /> {trainer.expertise}
                </p>
              )}
              {trainer.bio && <p className="text-slate-500 text-sm leading-relaxed max-w-2xl">{trainer.bio}</p>}
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 flex-shrink-0">
              {[
                { icon: BookOpen, value: materials?.length ?? 0, label: 'Materials', color: 'text-amber-600', bg: 'bg-amber-50' },
                { icon: TrendingUp, value: totalDownloads, label: 'Downloads', color: 'text-sky-600', bg: 'bg-sky-50' },
                { icon: Star, value: avgRating ?? '—', label: 'Avg Rating', color: 'text-amber-500', bg: 'bg-amber-50' },
              ].map(({ icon: Icon, value, label, color, bg }) => (
                <div key={label} className={`${bg} rounded-xl px-4 py-3 text-center`}>
                  <div className={`text-xl font-extrabold ${color}`}>{value}</div>
                  <div className="text-slate-500 text-xs font-medium">{label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Materials grid */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-xl font-bold text-slate-900 mb-6">
            Training Materials
            {materials?.length > 0 && (
              <span className="ml-2 text-sm font-normal text-slate-400">({materials.length} available)</span>
            )}
          </h2>

          {!materials || materials.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-2xl border border-slate-100 shadow-sm">
              <div className="w-14 h-14 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <BookOpen className="w-7 h-7 text-slate-400" />
              </div>
              <p className="text-slate-500 font-medium">No materials published yet.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {materials.map(m => (
                <MaterialCard key={m.id} material={m} onDownload={handleDownload} />
              ))}
            </div>
          )}

          {!user && materials?.length > 0 && (
            <div className="mt-8 p-6 bg-amber-50 border border-amber-100 rounded-2xl text-center">
              <p className="text-slate-700 font-medium mb-3">
                Create a free account to download materials from {trainer.first_name}.
              </p>
              <Link to="/register"
                className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-semibold px-6 py-3 rounded-xl transition-all text-sm">
                Get Started Free
              </Link>
            </div>
          )}
        </div>
      </section>

      <PublicFooter />
    </div>
  );
};

export default TrainerProfile;
