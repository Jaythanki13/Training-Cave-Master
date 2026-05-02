import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Upload, BookOpen, BarChart3, Download, Edit, Trash2, Eye,
  Plus, X, Calendar, FileText, Video, Music, Archive,
  CheckCircle, Clock, AlertCircle, Star, LogOut, TrendingUp
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { materials as materialsApi } from '../services/api';

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
    case 'video': case 'mp4': case 'mov': return <Video className="w-6 h-6" />;
    case 'audio': case 'mp3': return <Music className="w-6 h-6" />;
    case 'zip': case 'rar': return <Archive className="w-6 h-6" />;
    default: return <FileText className="w-6 h-6" />;
  }
}

// ─── main component ──────────────────────────────────────────────────────────

const TrainerDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [selectedTab, setSelectedTab] = useState('my-materials');
  const [materials, setMaterials] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [showUploadModal, setShowUploadModal] = useState(false);
  const [editingMaterial, setEditingMaterial] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const fetchMaterials = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const data = await materialsApi.getMine();
      setMaterials(data.materials || []);
    } catch (err) {
      setError(err.message || 'Failed to load materials');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    materialsApi.getCategories()
      .then(data => setCategories(data.categories || []))
      .catch(() => {});
    fetchMaterials();
  }, [fetchMaterials]);

  const handleDelete = async () => {
    if (!deletingId) return;
    setDeleteLoading(true);
    try {
      await materialsApi.delete(deletingId);
      setMaterials(prev => prev.filter(m => m.id !== deletingId));
    } catch (err) {
      alert(err.message || 'Failed to delete material');
    } finally {
      setDeleteLoading(false);
      setDeletingId(null);
    }
  };

  const handleLogout = () => { logout(); navigate('/'); };

  // Compute stats from materials list
  const stats = {
    totalUploads: materials.length,
    totalDownloads: materials.reduce((s, m) => s + (m.download_count || 0), 0),
    avgRating: (() => {
      const rated = materials.filter(m => m.rating_avg > 0);
      if (!rated.length) return null;
      return (rated.reduce((s, m) => s + Number(m.rating_avg), 0) / rated.length).toFixed(1);
    })(),
    thisMonthDownloads: (() => {
      const now = new Date();
      return materials
        .filter(m => {
          const d = new Date(m.uploaded_at);
          return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
        })
        .reduce((s, m) => s + (m.download_count || 0), 0);
    })(),
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <header className="border-b border-slate-700/50 bg-slate-900/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-orange-600 rounded-lg flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold text-white">Training Cave</span>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-slate-400">Trainer</span>
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                {initials(user?.full_name)}
              </div>
              <button onClick={handleLogout} className="text-slate-400 hover:text-white transition-colors" title="Sign out">
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome + Upload button */}
        <div className="flex justify-between items-start mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">
              Welcome back, {user?.full_name?.split(' ')[0] || 'Trainer'}!
            </h1>
            <p className="text-slate-400">Manage your training materials and track engagement</p>
          </div>
          <button
            onClick={() => setShowUploadModal(true)}
            className="bg-gradient-to-r from-amber-500 to-orange-600 text-white px-6 py-3 rounded-lg hover:from-amber-600 hover:to-orange-700 transition-all shadow-lg shadow-orange-500/30 flex items-center space-x-2 font-semibold"
          >
            <Plus className="w-5 h-5" />
            <span>Upload Material</span>
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <StatCard icon={<Upload className="w-6 h-6" />} label="Total Uploads" value={stats.totalUploads} color="amber" />
          <StatCard icon={<Download className="w-6 h-6" />} label="Total Downloads" value={stats.totalDownloads.toLocaleString()} color="blue" />
          <StatCard icon={<Star className="w-6 h-6" />} label="Avg. Rating" value={stats.avgRating ?? '—'} suffix={stats.avgRating ? '/5.0' : ''} color="purple" />
          <StatCard icon={<TrendingUp className="w-6 h-6" />} label="This Month" value={stats.thisMonthDownloads} suffix=" dl" color="green" />
        </div>

        {/* Tabs */}
        <div className="flex space-x-4 mb-6 border-b border-slate-700">
          {['my-materials', 'stats'].map(tab => (
            <button
              key={tab}
              onClick={() => setSelectedTab(tab)}
              className={`px-4 py-3 font-semibold transition-colors relative ${
                selectedTab === tab ? 'text-amber-400' : 'text-slate-400 hover:text-white'
              }`}
            >
              {tab === 'my-materials' ? 'My Materials' : 'Analytics'}
              {selectedTab === tab && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-amber-500" />}
            </button>
          ))}
        </div>

        {/* Error */}
        {error && (
          <div className="flex items-center space-x-2 bg-red-500/10 border border-red-500/30 rounded-lg px-4 py-3 mb-6">
            <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
            <span className="text-sm text-red-400">{error}</span>
            <button onClick={fetchMaterials} className="ml-auto text-sm text-red-400 underline">Retry</button>
          </div>
        )}

        {/* My Materials Tab */}
        {selectedTab === 'my-materials' && (
          <>
            {loading && (
              <div className="space-y-4">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="bg-slate-800/50 border border-slate-700 rounded-xl p-6 animate-pulse">
                    <div className="flex gap-4">
                      <div className="w-14 h-14 bg-slate-700 rounded-lg flex-shrink-0" />
                      <div className="flex-1 space-y-3">
                        <div className="h-5 bg-slate-700 rounded w-2/3" />
                        <div className="h-4 bg-slate-700 rounded w-1/2" />
                        <div className="h-4 bg-slate-700 rounded w-1/3" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {!loading && materials.length === 0 && !error && (
              <div className="text-center py-16">
                <div className="w-24 h-24 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Upload className="w-12 h-12 text-slate-600" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">No materials yet</h3>
                <p className="text-slate-400 mb-6">Upload your first training material to get started</p>
                <button
                  onClick={() => setShowUploadModal(true)}
                  className="bg-gradient-to-r from-amber-500 to-orange-600 text-white px-6 py-3 rounded-lg font-semibold"
                >
                  Upload Material
                </button>
              </div>
            )}

            {!loading && materials.length > 0 && (
              <div className="space-y-4">
                {materials.map(material => (
                  <MaterialRow
                    key={material.id}
                    material={material}
                    onEdit={() => setEditingMaterial(material)}
                    onDelete={() => setDeletingId(material.id)}
                  />
                ))}
              </div>
            )}
          </>
        )}

        {/* Analytics Tab */}
        {selectedTab === 'stats' && (
          <AnalyticsTab materials={materials} />
        )}
      </div>

      {/* Upload Modal */}
      {showUploadModal && (
        <UploadModal
          categories={categories}
          onClose={() => setShowUploadModal(false)}
          onSuccess={() => { setShowUploadModal(false); fetchMaterials(); }}
        />
      )}

      {/* Edit Modal */}
      {editingMaterial && (
        <EditModal
          material={editingMaterial}
          categories={categories}
          onClose={() => setEditingMaterial(null)}
          onSuccess={(updated) => {
            setMaterials(prev => prev.map(m => m.id === updated.id ? { ...m, ...updated } : m));
            setEditingMaterial(null);
          }}
        />
      )}

      {/* Delete Confirmation */}
      {deletingId && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-slate-800 border border-slate-700 rounded-2xl max-w-sm w-full p-6">
            <div className="w-12 h-12 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Trash2 className="w-6 h-6 text-red-400" />
            </div>
            <h3 className="text-xl font-bold text-white text-center mb-2">Delete Material</h3>
            <p className="text-slate-400 text-center mb-6">
              This will permanently remove the material and its file. This cannot be undone.
            </p>
            <div className="flex space-x-3">
              <button
                onClick={() => setDeletingId(null)}
                disabled={deleteLoading}
                className="flex-1 px-4 py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={deleteLoading}
                className="flex-1 px-4 py-3 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors font-semibold disabled:opacity-60"
              >
                {deleteLoading ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// ─── MaterialRow ─────────────────────────────────────────────────────────────

const MaterialRow = ({ material, onEdit, onDelete }) => {
  const statusConfig = {
    active: { color: 'green', Icon: CheckCircle, text: 'Active' },
    pending: { color: 'yellow', Icon: Clock, text: 'Pending' },
    inactive: { color: 'red', Icon: AlertCircle, text: 'Inactive' },
  };
  const { color, Icon, text } = statusConfig[material.status] || statusConfig.active;

  return (
    <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-6 hover:border-amber-500/50 transition-all">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-4 flex-1">
          <div className="w-14 h-14 bg-gradient-to-br from-amber-500/20 to-orange-600/20 rounded-lg flex items-center justify-center text-amber-400 flex-shrink-0">
            {getFileIcon(material.file_type)}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-4 mb-2">
              <h3 className="text-lg font-semibold text-white">{material.title}</h3>
              <span className={`flex items-center space-x-1 text-xs px-2 py-1 rounded bg-${color}-500/10 text-${color}-400 border border-${color}-500/30 whitespace-nowrap`}>
                <Icon className="w-3 h-3" />
                <span>{text}</span>
              </span>
            </div>
            <div className="flex flex-wrap items-center gap-4 text-sm text-slate-400 mb-3">
              <span className="bg-slate-900 px-2 py-1 rounded text-xs">{material.category_name}</span>
              <span className="flex items-center space-x-1">
                <FileText className="w-4 h-4" />
                <span>{(material.file_type || '?').toUpperCase()}</span>
              </span>
              <span>{formatFileSize(material.file_size)}</span>
              <span className="flex items-center space-x-1">
                <Calendar className="w-4 h-4" />
                <span>{formatDate(material.uploaded_at)}</span>
              </span>
            </div>
            <div className="flex items-center space-x-6 text-sm">
              <span className="flex items-center space-x-1 text-blue-400">
                <Download className="w-4 h-4" />
                <span className="font-semibold">{material.download_count ?? 0}</span>
                <span className="text-slate-500">downloads</span>
              </span>
              {material.rating_avg > 0 && (
                <span className="flex items-center space-x-1 text-amber-400">
                  <Star className="w-4 h-4 fill-amber-400" />
                  <span className="font-semibold">{Number(material.rating_avg).toFixed(1)}</span>
                  <span className="text-slate-500">rating</span>
                </span>
              )}
            </div>
          </div>
        </div>
        <div className="flex items-center space-x-2 flex-shrink-0">
          <button
            onClick={onEdit}
            className="p-2 bg-slate-700 hover:bg-slate-600 rounded-lg transition-colors text-slate-300 hover:text-white"
            title="Edit"
          >
            <Edit className="w-5 h-5" />
          </button>
          <button
            onClick={onDelete}
            className="p-2 bg-red-500/10 hover:bg-red-500/20 rounded-lg transition-colors text-red-400 hover:text-red-300 border border-red-500/30"
            title="Delete"
          >
            <Trash2 className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

// ─── UploadModal ─────────────────────────────────────────────────────────────

const UploadModal = ({ categories, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    title: '', description: '', categoryId: '', tags: '',
    trainingDate: '', trainingType: 'delivered', file: null,
  });
  const [dragActive, setDragActive] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  const set = (key, val) => setFormData(prev => ({ ...prev, [key]: val }));

  const handleDrag = (e) => {
    e.preventDefault(); e.stopPropagation();
    setDragActive(e.type === 'dragenter' || e.type === 'dragover');
  };

  const handleDrop = (e) => {
    e.preventDefault(); e.stopPropagation(); setDragActive(false);
    if (e.dataTransfer.files?.[0]) set('file', e.dataTransfer.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.file) { setError('Please select a file'); return; }
    if (!formData.categoryId) { setError('Please select a category'); return; }
    setError('');
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append('file', formData.file);
      fd.append('title', formData.title);
      fd.append('description', formData.description);
      fd.append('categoryId', formData.categoryId);
      fd.append('tags', formData.tags);
      fd.append('trainingDate', formData.trainingDate);
      fd.append('trainingType', formData.trainingType);
      await materialsApi.upload(fd);
      onSuccess();
    } catch (err) {
      setError(err.message || 'Upload failed. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-slate-800 border border-slate-700 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-slate-800 border-b border-slate-700 p-6 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-white">Upload Training Material</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {error && (
            <div className="flex items-center space-x-2 bg-red-500/10 border border-red-500/30 rounded-lg px-4 py-3">
              <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
              <span className="text-sm text-red-400">{error}</span>
            </div>
          )}

          {/* Drop zone */}
          <div
            onDragEnter={handleDrag} onDragLeave={handleDrag}
            onDragOver={handleDrag} onDrop={handleDrop}
            className={`border-2 border-dashed rounded-xl p-8 text-center transition-all ${
              dragActive ? 'border-amber-500 bg-amber-500/10'
              : formData.file ? 'border-green-500 bg-green-500/10'
              : 'border-slate-600 bg-slate-900/50'
            }`}
          >
            <input
              type="file" id="file-upload" onChange={(e) => set('file', e.target.files?.[0] || null)}
              className="hidden"
              accept=".pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx,.mp4,.mp3,.zip"
            />
            {formData.file ? (
              <div className="space-y-2">
                <CheckCircle className="w-12 h-12 text-green-400 mx-auto" />
                <p className="text-white font-semibold">{formData.file.name}</p>
                <p className="text-sm text-slate-400">{(formData.file.size / 1048576).toFixed(2)} MB</p>
                <button type="button" onClick={() => set('file', null)} className="text-sm text-red-400 hover:text-red-300">
                  Remove file
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                <Upload className="w-12 h-12 text-slate-500 mx-auto" />
                <div>
                  <label htmlFor="file-upload" className="text-amber-400 hover:text-amber-300 cursor-pointer font-semibold">
                    Click to upload
                  </label>
                  <span className="text-slate-400"> or drag and drop</span>
                </div>
                <p className="text-sm text-slate-500">PDF, DOCX, PPTX, XLSX, MP4, MP3, ZIP (max 1GB)</p>
              </div>
            )}
          </div>

          {/* Form fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-slate-300 mb-2">Title *</label>
              <input
                type="text" value={formData.title} onChange={e => set('title', e.target.value)}
                className="w-full bg-slate-900 border border-slate-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-amber-500 transition-colors"
                placeholder="e.g., Leadership Skills Workshop 2024" required
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-slate-300 mb-2">Description *</label>
              <textarea
                value={formData.description} onChange={e => set('description', e.target.value)}
                className="w-full bg-slate-900 border border-slate-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-amber-500 transition-colors"
                rows="3" placeholder="Describe what learners will gain from this material..." required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Category *</label>
              <select
                value={formData.categoryId} onChange={e => set('categoryId', e.target.value)}
                className="w-full bg-slate-900 border border-slate-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-amber-500 transition-colors"
                required
              >
                <option value="">Select a category</option>
                {categories.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Tags (Optional)</label>
              <input
                type="text" value={formData.tags} onChange={e => set('tags', e.target.value)}
                className="w-full bg-slate-900 border border-slate-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-amber-500 transition-colors"
                placeholder="leadership, communication, teamwork"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Training Date *</label>
              <input
                type="date" value={formData.trainingDate} onChange={e => set('trainingDate', e.target.value)}
                className="w-full bg-slate-900 border border-slate-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-amber-500 transition-colors"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Training Type *</label>
              <select
                value={formData.trainingType} onChange={e => set('trainingType', e.target.value)}
                className="w-full bg-slate-900 border border-slate-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-amber-500 transition-colors"
                required
              >
                <option value="delivered">Already Delivered</option>
                <option value="upcoming">Upcoming</option>
              </select>
            </div>
          </div>

          <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
            <p className="text-sm text-slate-300">
              By uploading, you confirm this material is for{' '}
              <span className="text-amber-400 font-semibold">internal client use only</span>.
              Your content remains your intellectual property.
            </p>
          </div>

          <div className="flex justify-end space-x-3 pt-2">
            <button type="button" onClick={onClose} className="px-6 py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors">
              Cancel
            </button>
            <button
              type="submit"
              disabled={uploading || !formData.file || !formData.title || !formData.description || !formData.categoryId}
              className="px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-600 text-white rounded-lg hover:from-amber-600 hover:to-orange-700 transition-all shadow-lg shadow-orange-500/30 disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
            >
              {uploading ? 'Uploading...' : 'Upload Material'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// ─── EditModal ────────────────────────────────────────────────────────────────

const EditModal = ({ material, categories, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    title: material.title || '',
    description: material.description || '',
    categoryId: material.category_id || '',
    tags: Array.isArray(material.tags) ? material.tags.join(', ') : (material.tags || ''),
    trainingDate: material.training_date?.split('T')[0] || '',
    trainingType: material.training_type || 'delivered',
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const set = (key, val) => setFormData(prev => ({ ...prev, [key]: val }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSaving(true);
    try {
      await materialsApi.update(material.id, {
        title: formData.title,
        description: formData.description,
        categoryId: formData.categoryId || undefined,
        tags: formData.tags,
        trainingDate: formData.trainingDate,
        trainingType: formData.trainingType,
      });
      onSuccess({
        id: material.id,
        title: formData.title,
        description: formData.description,
        training_type: formData.trainingType,
        training_date: formData.trainingDate,
        category_name: categories.find(c => String(c.id) === String(formData.categoryId))?.name || material.category_name,
      });
    } catch (err) {
      setError(err.message || 'Failed to save changes');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-slate-800 border border-slate-700 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-slate-800 border-b border-slate-700 p-6 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-white">Edit Material</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="flex items-center space-x-2 bg-red-500/10 border border-red-500/30 rounded-lg px-4 py-3">
              <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
              <span className="text-sm text-red-400">{error}</span>
            </div>
          )}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Title *</label>
            <input
              type="text" value={formData.title} onChange={e => set('title', e.target.value)}
              className="w-full bg-slate-900 border border-slate-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-amber-500 transition-colors"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Description *</label>
            <textarea
              value={formData.description} onChange={e => set('description', e.target.value)}
              className="w-full bg-slate-900 border border-slate-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-amber-500 transition-colors"
              rows="3" required
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Category</label>
              <select
                value={formData.categoryId} onChange={e => set('categoryId', e.target.value)}
                className="w-full bg-slate-900 border border-slate-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-amber-500 transition-colors"
              >
                <option value="">Keep current</option>
                {categories.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Tags</label>
              <input
                type="text" value={formData.tags} onChange={e => set('tags', e.target.value)}
                className="w-full bg-slate-900 border border-slate-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-amber-500 transition-colors"
                placeholder="leadership, communication"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Training Date</label>
              <input
                type="date" value={formData.trainingDate} onChange={e => set('trainingDate', e.target.value)}
                className="w-full bg-slate-900 border border-slate-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-amber-500 transition-colors"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Training Type</label>
              <select
                value={formData.trainingType} onChange={e => set('trainingType', e.target.value)}
                className="w-full bg-slate-900 border border-slate-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-amber-500 transition-colors"
              >
                <option value="delivered">Already Delivered</option>
                <option value="upcoming">Upcoming</option>
              </select>
            </div>
          </div>
          <div className="flex justify-end space-x-3 pt-2">
            <button type="button" onClick={onClose} className="px-6 py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors">
              Cancel
            </button>
            <button
              type="submit" disabled={saving}
              className="px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-600 text-white rounded-lg hover:from-amber-600 hover:to-orange-700 transition-all font-semibold disabled:opacity-60"
            >
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// ─── AnalyticsTab ─────────────────────────────────────────────────────────────

const AnalyticsTab = ({ materials }) => {
  if (materials.length === 0) {
    return (
      <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-8 text-center">
        <BarChart3 className="w-16 h-16 mx-auto mb-4 text-slate-600" />
        <p className="text-slate-400">No data yet. Upload some materials to see analytics.</p>
      </div>
    );
  }

  const maxDownloads = Math.max(...materials.map(m => m.download_count || 0), 1);
  const sorted = [...materials].sort((a, b) => (b.download_count || 0) - (a.download_count || 0));

  const totalDownloads = materials.reduce((s, m) => s + (m.download_count || 0), 0);
  const rated = materials.filter(m => m.rating_avg > 0);
  const avgRating = rated.length
    ? (rated.reduce((s, m) => s + Number(m.rating_avg), 0) / rated.length).toFixed(1)
    : '—';

  return (
    <div className="space-y-6">
      {/* Summary row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-5 text-center">
          <div className="text-3xl font-bold text-amber-400 mb-1">{materials.length}</div>
          <div className="text-slate-400 text-sm">Total Materials</div>
        </div>
        <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-5 text-center">
          <div className="text-3xl font-bold text-blue-400 mb-1">{totalDownloads.toLocaleString()}</div>
          <div className="text-slate-400 text-sm">Total Downloads</div>
        </div>
        <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-5 text-center">
          <div className="text-3xl font-bold text-purple-400 mb-1">{avgRating}</div>
          <div className="text-slate-400 text-sm">Average Rating</div>
        </div>
      </div>

      {/* Downloads bar chart */}
      <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-6">
        <h3 className="text-lg font-bold text-white mb-6">Downloads by Material</h3>
        <div className="space-y-4">
          {sorted.map(m => (
            <div key={m.id}>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-slate-300 truncate max-w-xs">{m.title}</span>
                <span className="text-slate-400 ml-4 flex-shrink-0">{m.download_count ?? 0}</span>
              </div>
              <div className="w-full bg-slate-700 rounded-full h-2">
                <div
                  className="bg-gradient-to-r from-amber-500 to-orange-600 h-2 rounded-full transition-all"
                  style={{ width: `${((m.download_count || 0) / maxDownloads) * 100}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Category breakdown */}
      <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-6">
        <h3 className="text-lg font-bold text-white mb-6">Materials by Category</h3>
        <div className="space-y-3">
          {Object.entries(
            materials.reduce((acc, m) => {
              const cat = m.category_name || 'Uncategorized';
              acc[cat] = (acc[cat] || 0) + 1;
              return acc;
            }, {})
          ).sort((a, b) => b[1] - a[1]).map(([cat, count]) => (
            <div key={cat} className="flex items-center justify-between">
              <span className="text-slate-300 text-sm">{cat}</span>
              <div className="flex items-center space-x-3">
                <div className="w-32 bg-slate-700 rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-purple-500 to-purple-600 h-2 rounded-full"
                    style={{ width: `${(count / materials.length) * 100}%` }}
                  />
                </div>
                <span className="text-slate-400 text-sm w-4">{count}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// ─── StatCard ────────────────────────────────────────────────────────────────

const StatCard = ({ icon, label, value, color, suffix = '' }) => {
  const colorClasses = {
    amber: 'from-amber-500/20 to-orange-600/20 text-amber-400',
    blue: 'from-blue-500/20 to-blue-600/20 text-blue-400',
    purple: 'from-purple-500/20 to-purple-600/20 text-purple-400',
    green: 'from-green-500/20 to-green-600/20 text-green-400',
  };
  return (
    <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-4">
      <div className={`w-12 h-12 bg-gradient-to-br ${colorClasses[color]} rounded-lg flex items-center justify-center mb-3`}>
        {icon}
      </div>
      <div className="text-2xl font-bold text-white mb-1">
        {value}{suffix && <span className="text-lg text-slate-400">{suffix}</span>}
      </div>
      <div className="text-sm text-slate-400">{label}</div>
    </div>
  );
};

export default TrainerDashboard;
