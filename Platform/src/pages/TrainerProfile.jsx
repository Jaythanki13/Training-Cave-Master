import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  BookOpen, ArrowLeft, Download, Star, FileText, Video, Music,
  Archive, Calendar, User, Tag, AlertCircle, Briefcase
} from 'lucide-react';
import { trainers as trainersApi, materials as materialsApi } from '../services/api';

// ─── helpers ─────────────────────────────────────────────────────────────────

function formatFileSize(bytes) {
  if (!bytes) return '—';
  if (bytes >= 1073741824) return `${(bytes / 1073741824).toFixed(1)} GB`;
  if (bytes >= 1048576) return `${(bytes / 1048576).toFixed(1)} MB`;
  return `${(bytes / 1024).toFixed(1)} KB`;
}

function formatDate(iso) {
  if (!iso) return '—';
  return new Date(iso).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
}

function initials(name = '') {
  return name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2) || '?';
}

function getFileIcon(type) {
  switch (type) {
    case 'video': case 'mp4': case 'mov': case 'avi': return <Video className="w-5 h-5" />;
    case 'audio': case 'mp3': return <Music className="w-5 h-5" />;
    case 'zip': case 'rar': return <Archive className="w-5 h-5" />;
    default: return <FileText className="w-5 h-5" />;
  }
}

// ─── main component ───────────────────────────────────────────────────────────

const TrainerProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [trainer, setTrainer] = useState(null);
  const [materials, setMaterials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [downloading, setDownloading] = useState(null);

  useEffect(() => {
    setLoading(true);
    trainersApi.getProfile(id)
      .then(data => {
        setTrainer(data.trainer);
        setMaterials(data.materials || []);
      })
      .catch(err => setError(err.message || 'Failed to load trainer profile'))
      .finally(() => setLoading(false));
  }, [id]);

  const handleDownload = async (materialId) => {
    setDownloading(materialId);
    try {
      const data = await materialsApi.getDownloadUrl(materialId);
      window.open(data.downloadUrl, '_blank', 'noopener,noreferrer');
    } catch (err) {
      alert(err.message || 'Failed to generate download link');
    } finally {
      setDownloading(null);
    }
  };

  const totalDownloads = materials.reduce((sum, m) => sum + (m.download_count || 0), 0);
  const avgRating = materials.length > 0
    ? (materials.reduce((sum, m) => sum + (parseFloat(m.rating_avg) || 0), 0) / materials.length).toFixed(1)
    : '—';

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-amber-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">Trainer not found</h2>
          <p className="text-slate-400 mb-6">{error}</p>
          <button
            onClick={() => navigate(-1)}
            className="bg-amber-500 hover:bg-amber-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <header className="border-b border-slate-700/50 bg-slate-900/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-16 space-x-4">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center space-x-2 text-slate-400 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="text-sm">Back</span>
            </button>
            <div className="h-6 w-px bg-slate-700" />
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-amber-500 to-orange-600 rounded-lg flex items-center justify-center">
                <BookOpen className="w-4 h-4 text-white" />
              </div>
              <span className="text-lg font-bold text-white">Training Cave</span>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Trainer card */}
        <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-2xl p-8 mb-8">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
            {/* Avatar */}
            <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white text-3xl font-bold flex-shrink-0">
              {initials(trainer.full_name)}
            </div>

            {/* Info */}
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-white mb-1">{trainer.full_name}</h1>
              <div className="flex items-center space-x-2 text-slate-400 text-sm mb-4">
                <User className="w-4 h-4" />
                <span>Trainer since {formatDate(trainer.created_at)}</span>
              </div>
              {trainer.profile_bio && (
                <p className="text-slate-300 leading-relaxed mb-4">{trainer.profile_bio}</p>
              )}
              {trainer.expertise_areas && (
                <div className="flex items-start space-x-2">
                  <Briefcase className="w-4 h-4 text-amber-400 mt-0.5 flex-shrink-0" />
                  <p className="text-slate-400 text-sm">{trainer.expertise_areas}</p>
                </div>
              )}
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 md:grid-cols-1 gap-3 md:min-w-[120px]">
              {[
                { label: 'Materials', value: materials.length, color: 'text-amber-400' },
                { label: 'Downloads', value: totalDownloads, color: 'text-blue-400' },
                { label: 'Avg Rating', value: avgRating, color: 'text-green-400' },
              ].map(({ label, value, color }) => (
                <div key={label} className="bg-slate-900 rounded-xl p-3 text-center">
                  <div className={`text-xl font-bold ${color}`}>{value}</div>
                  <div className="text-slate-500 text-xs mt-1">{label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Materials */}
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-xl font-bold text-white">
            Training Materials <span className="text-slate-500 font-normal text-base">({materials.length})</span>
          </h2>
        </div>

        {materials.length === 0 && (
          <div className="text-center py-16 bg-slate-800/50 border border-slate-700 rounded-2xl">
            <FileText className="w-16 h-16 text-slate-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-white mb-2">No materials yet</h3>
            <p className="text-slate-400">This trainer hasn't uploaded any materials yet.</p>
          </div>
        )}

        <div className="space-y-4">
          {materials.map(material => (
            <div
              key={material.id}
              className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-6 hover:border-amber-500/50 transition-all"
            >
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 bg-gradient-to-br from-amber-500/20 to-orange-600/20 rounded-lg flex items-center justify-center text-amber-400 flex-shrink-0">
                  {getFileIcon(material.file_type)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-4 mb-2">
                    <h3 className="text-lg font-semibold text-white">{material.title}</h3>
                    <span className="text-xs text-slate-400 bg-slate-900 px-3 py-1 rounded whitespace-nowrap flex-shrink-0">
                      {material.category_name}
                    </span>
                  </div>
                  <p className="text-slate-400 text-sm mb-3 line-clamp-2">{material.description}</p>

                  {material.tags?.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-3">
                      {material.tags.slice(0, 4).map(tag => (
                        <span key={tag} className="flex items-center space-x-1 bg-slate-700 text-slate-400 text-xs px-2 py-0.5 rounded">
                          <Tag className="w-3 h-3" />
                          <span>{tag}</span>
                        </span>
                      ))}
                    </div>
                  )}

                  <div className="flex items-center justify-between flex-wrap gap-3">
                    <div className="flex items-center space-x-4 text-sm text-slate-500">
                      <span className="flex items-center space-x-1">
                        <Download className="w-4 h-4" />
                        <span>{material.download_count ?? 0} downloads</span>
                      </span>
                      {material.rating_avg > 0 && (
                        <span className="flex items-center space-x-1">
                          <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                          <span>{Number(material.rating_avg).toFixed(1)} ({material.rating_count})</span>
                        </span>
                      )}
                      <span className="flex items-center space-x-1">
                        <Calendar className="w-4 h-4" />
                        <span>{formatDate(material.uploaded_at)}</span>
                      </span>
                      <span>{formatFileSize(material.file_size)}</span>
                    </div>
                    <button
                      onClick={() => handleDownload(material.id)}
                      disabled={downloading === material.id}
                      className="bg-gradient-to-r from-amber-500 to-orange-600 text-white px-6 py-2 rounded-lg hover:from-amber-600 hover:to-orange-700 transition-all font-semibold flex items-center space-x-2 disabled:opacity-60"
                    >
                      <Download className="w-4 h-4" />
                      <span>{downloading === material.id ? 'Getting link...' : 'Download'}</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TrainerProfile;
