import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Upload, BookOpen, BarChart3, Download, Edit, Trash2,
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

const inputCls = 'w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-3 text-slate-900 text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent transition-colors';

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
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl flex items-center justify-center flex-shrink-0">
                <BookOpen className="w-5 h-5 text-white" />
              </div>
              <span className="hidden sm:block text-xl font-bold text-slate-900">Training Cave</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="hidden sm:block text-xs font-semibold text-violet-600 bg-violet-100 px-2.5 py-1 rounded-full">Trainer</span>
              <div className="w-9 h-9 bg-gradient-to-br from-violet-500 to-violet-600 rounded-full flex items-center justify-center text-white font-semibold text-sm flex-shrink-0">
                {initials(user?.full_name)}
              </div>
              <span className="hidden md:block text-sm font-medium text-slate-700 truncate max-w-[120px]">
                {user?.full_name?.split(' ')[0]}
              </span>
              <button onClick={handleLogout} className="p-1.5 text-slate-400 hover:text-slate-700 transition-colors" title="Sign out">
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome + Upload button */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-1">
              Welcome back, {user?.full_name?.split(' ')[0] || 'Trainer'}!
            </h1>
            <p className="text-slate-500">Manage your training materials and track engagement</p>
          </div>
          <button
            onClick={() => setShowUploadModal(true)}
            className="flex items-center gap-2 bg-gradient-to-r from-amber-500 to-orange-600 text-white px-5 py-3 rounded-xl hover:from-amber-600 hover:to-orange-700 transition-all shadow-sm hover:shadow-md font-semibold whitespace-nowrap self-start sm:self-auto"
          >
            <Plus className="w-5 h-5" />
            <span>Upload Material</span>
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard icon={<Upload className="w-5 h-5" />} label="Total Uploads" value={stats.totalUploads} iconBg="bg-amber-100" iconColor="text-amber-600" />
          <StatCard icon={<Download className="w-5 h-5" />} label="Total Downloads" value={stats.totalDownloads.toLocaleString()} iconBg="bg-sky-100" iconColor="text-sky-600" />
          <StatCard icon={<Star className="w-5 h-5" />} label="Avg. Rating" value={stats.avgRating ?? '—'} suffix={stats.avgRating ? '/5' : ''} iconBg="bg-amber-100" iconColor="text-amber-500" />
          <StatCard icon={<TrendingUp className="w-5 h-5" />} label="This Month" value={stats.thisMonthDownloads} suffix=" dl" iconBg="bg-emerald-100" iconColor="text-emerald-600" />
        </div>

        {/* Tabs */}
        <div className="flex gap-1 mb-6 border-b border-slate-200">
          {['my-materials', 'stats'].map(tab => (
            <button
              key={tab}
              onClick={() => setSelectedTab(tab)}
              className={`px-4 py-3 font-semibold text-sm transition-colors relative ${
                selectedTab === tab ? 'text-amber-600' : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              {tab === 'my-materials' ? 'My Materials' : 'Analytics'}
              {selectedTab === tab && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-amber-500 rounded-t" />}
            </button>
          ))}
        </div>

        {/* Error */}
        {error && (
          <div className="flex items-center gap-2 bg-red-50 border border-red-200 rounded-xl px-4 py-3 mb-6">
            <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
            <span className="text-sm text-red-600">{error}</span>
            <button onClick={fetchMaterials} className="ml-auto text-sm text-red-600 underline">Retry</button>
          </div>
        )}

        {/* My Materials Tab */}
        {selectedTab === 'my-materials' && (
          <>
            {loading && (
              <div className="space-y-4">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="bg-white border border-slate-200 rounded-2xl p-6 animate-pulse shadow-sm">
                    <div className="flex gap-4">
                      <div className="w-14 h-14 bg-slate-200 rounded-xl flex-shrink-0" />
                      <div className="flex-1 space-y-3">
                        <div className="h-5 bg-slate-200 rounded-lg w-2/3" />
                        <div className="h-4 bg-slate-200 rounded-lg w-1/2" />
                        <div className="h-4 bg-slate-200 rounded-lg w-1/3" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {!loading && materials.length === 0 && !error && (
              <div className="text-center py-16 bg-white rounded-2xl border border-slate-200 shadow-sm">
                <div className="w-20 h-20 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Upload className="w-10 h-10 text-slate-400" />
                </div>
                <h3 className="text-xl font-semibold text-slate-900 mb-2">No materials yet</h3>
                <p className="text-slate-500 mb-6">Upload your first training material to get started</p>
                <button
                  onClick={() => setShowUploadModal(true)}
                  className="bg-gradient-to-r from-amber-500 to-orange-500 text-white px-6 py-3 rounded-xl font-semibold hover:from-amber-600 hover:to-orange-600 transition-all"
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

        {selectedTab === 'stats' && <AnalyticsTab materials={materials} />}
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
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white border border-slate-200 rounded-2xl shadow-2xl max-w-sm w-full p-6">
            <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center mx-auto mb-4">
              <Trash2 className="w-6 h-6 text-red-500" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 text-center mb-2">Delete Material</h3>
            <p className="text-slate-500 text-center mb-6 text-sm">
              This will permanently remove the material and its file. This cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeletingId(null)}
                disabled={deleteLoading}
                className="flex-1 px-4 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl transition-colors font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={deleteLoading}
                className="flex-1 px-4 py-3 bg-red-500 hover:bg-red-600 text-white rounded-xl transition-colors font-semibold disabled:opacity-60"
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
    active:   { bgCls: 'bg-emerald-100 text-emerald-700 border-emerald-200', Icon: CheckCircle, text: 'Active' },
    pending:  { bgCls: 'bg-amber-100 text-amber-700 border-amber-200',       Icon: Clock,       text: 'Pending' },
    inactive: { bgCls: 'bg-red-100 text-red-600 border-red-200',             Icon: AlertCircle, text: 'Inactive' },
  };
  const { bgCls, Icon, text } = statusConfig[material.status] || statusConfig.active;

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-5 hover:shadow-md transition-all shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-4 flex-1 min-w-0">
          <div className="w-14 h-14 bg-amber-50 rounded-xl flex items-center justify-center text-amber-500 flex-shrink-0">
            {getFileIcon(material.file_type)}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-start gap-3 mb-2">
              <h3 className="text-base font-semibold text-slate-900 leading-snug">{material.title}</h3>
              <span className={`flex items-center gap-1 text-xs px-2.5 py-1 rounded-full border font-medium whitespace-nowrap ${bgCls}`}>
                <Icon className="w-3 h-3" />
                <span>{text}</span>
              </span>
            </div>
            <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 mb-3">
              <span className="bg-slate-100 px-2 py-1 rounded-lg">{material.category_name}</span>
              <span className="flex items-center gap-1">
                <FileText className="w-3.5 h-3.5" />
                <span>{(material.file_type || '?').toUpperCase()}</span>
              </span>
              <span>{formatFileSize(material.file_size)}</span>
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" />
                <span>{formatDate(material.uploaded_at)}</span>
              </span>
            </div>
            <div className="flex items-center gap-5 text-sm">
              <span className="flex items-center gap-1 text-sky-600">
                <Download className="w-3.5 h-3.5" />
                <span className="font-semibold">{material.download_count ?? 0}</span>
                <span className="text-slate-400 font-normal">downloads</span>
              </span>
              {material.rating_avg > 0 && (
                <span className="flex items-center gap-1 text-amber-500">
                  <Star className="w-3.5 h-3.5 fill-amber-400" />
                  <span className="font-semibold">{Number(material.rating_avg).toFixed(1)}</span>
                  <span className="text-slate-400 font-normal">rating</span>
                </span>
              )}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <button
            onClick={onEdit}
            className="p-2 bg-slate-50 hover:bg-slate-100 rounded-xl transition-colors text-slate-500 hover:text-slate-900 border border-slate-200"
            title="Edit"
          >
            <Edit className="w-4 h-4" />
          </button>
          <button
            onClick={onDelete}
            className="p-2 bg-red-50 hover:bg-red-100 rounded-xl transition-colors text-red-500 border border-red-200"
            title="Delete"
          >
            <Trash2 className="w-4 h-4" />
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
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white border border-slate-200 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-slate-200 px-6 py-4 flex justify-between items-center">
          <h2 className="text-xl font-bold text-slate-900">Upload Training Material</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-700 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {error && (
            <div className="flex items-center gap-2 bg-red-50 border border-red-200 rounded-xl px-4 py-3">
              <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
              <span className="text-sm text-red-600">{error}</span>
            </div>
          )}

          {/* Drop zone */}
          <div
            onDragEnter={handleDrag} onDragLeave={handleDrag}
            onDragOver={handleDrag} onDrop={handleDrop}
            className={`border-2 border-dashed rounded-2xl p-8 text-center transition-all ${
              dragActive ? 'border-amber-400 bg-amber-50'
              : formData.file ? 'border-emerald-400 bg-emerald-50'
              : 'border-slate-300 bg-slate-50 hover:border-amber-300 hover:bg-amber-50/30'
            }`}
          >
            <input
              type="file" id="file-upload"
              onChange={(e) => set('file', e.target.files?.[0] || null)}
              className="hidden"
              accept=".pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx,.mp4,.mp3,.zip"
            />
            {formData.file ? (
              <div className="space-y-2">
                <CheckCircle className="w-12 h-12 text-emerald-500 mx-auto" />
                <p className="text-slate-900 font-semibold">{formData.file.name}</p>
                <p className="text-sm text-slate-500">{(formData.file.size / 1048576).toFixed(2)} MB</p>
                <button type="button" onClick={() => set('file', null)} className="text-sm text-red-500 hover:text-red-600 font-medium">
                  Remove file
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                <Upload className="w-12 h-12 text-slate-400 mx-auto" />
                <div>
                  <label htmlFor="file-upload" className="text-amber-600 hover:text-amber-700 cursor-pointer font-semibold">
                    Click to upload
                  </label>
                  <span className="text-slate-500"> or drag and drop</span>
                </div>
                <p className="text-sm text-slate-400">PDF, DOCX, PPTX, XLSX, MP4, MP3, ZIP (max 1GB)</p>
              </div>
            )}
          </div>

          {/* Form fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Title *</label>
              <input
                type="text" value={formData.title}
                onChange={e => set('title', e.target.value)}
                className={inputCls}
                placeholder="e.g., Leadership Skills Workshop 2024" required
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Description *</label>
              <textarea
                value={formData.description}
                onChange={e => set('description', e.target.value)}
                className={`${inputCls} resize-none`}
                rows="3"
                placeholder="Describe what learners will gain from this material..." required
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Category *</label>
              <select
                value={formData.categoryId}
                onChange={e => set('categoryId', e.target.value)}
                className={inputCls} required
              >
                <option value="">Select a category</option>
                {categories.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Tags (Optional)</label>
              <input
                type="text" value={formData.tags}
                onChange={e => set('tags', e.target.value)}
                className={inputCls}
                placeholder="leadership, communication, teamwork"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Training Date *</label>
              <input
                type="date" value={formData.trainingDate}
                onChange={e => set('trainingDate', e.target.value)}
                className={inputCls} required
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Training Type *</label>
              <select
                value={formData.trainingType}
                onChange={e => set('trainingType', e.target.value)}
                className={inputCls} required
              >
                <option value="delivered">Already Delivered</option>
                <option value="upcoming">Upcoming</option>
              </select>
            </div>
          </div>

          <div className="bg-sky-50 border border-sky-200 rounded-xl p-4">
            <p className="text-sm text-sky-800">
              By uploading, you confirm this material is for{' '}
              <span className="text-amber-600 font-semibold">internal client use only</span>.
              Your content remains your intellectual property.
            </p>
          </div>

          <div className="flex justify-end gap-3 pt-1">
            <button type="button" onClick={onClose}
              className="px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl transition-colors font-medium">
              Cancel
            </button>
            <button
              type="submit"
              disabled={uploading || !formData.file || !formData.title || !formData.description || !formData.categoryId}
              className="px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-600 text-white rounded-xl hover:from-amber-600 hover:to-orange-700 transition-all shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
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
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white border border-slate-200 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-slate-200 px-6 py-4 flex justify-between items-center">
          <h2 className="text-xl font-bold text-slate-900">Edit Material</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-700 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="flex items-center gap-2 bg-red-50 border border-red-200 rounded-xl px-4 py-3">
              <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
              <span className="text-sm text-red-600">{error}</span>
            </div>
          )}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">Title *</label>
            <input type="text" value={formData.title}
              onChange={e => set('title', e.target.value)}
              className={inputCls} required />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">Description *</label>
            <textarea
              value={formData.description}
              onChange={e => set('description', e.target.value)}
              className={`${inputCls} resize-none`}
              rows="3" required />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Category</label>
              <select value={formData.categoryId} onChange={e => set('categoryId', e.target.value)} className={inputCls}>
                <option value="">Keep current</option>
                {categories.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Tags</label>
              <input type="text" value={formData.tags}
                onChange={e => set('tags', e.target.value)}
                className={inputCls}
                placeholder="leadership, communication" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Training Date</label>
              <input type="date" value={formData.trainingDate}
                onChange={e => set('trainingDate', e.target.value)}
                className={inputCls} />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Training Type</label>
              <select value={formData.trainingType} onChange={e => set('trainingType', e.target.value)} className={inputCls}>
                <option value="delivered">Already Delivered</option>
                <option value="upcoming">Upcoming</option>
              </select>
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-1">
            <button type="button" onClick={onClose}
              className="px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl transition-colors font-medium">
              Cancel
            </button>
            <button type="submit" disabled={saving}
              className="px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-600 text-white rounded-xl hover:from-amber-600 hover:to-orange-700 transition-all font-semibold disabled:opacity-60">
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
      <div className="bg-white border border-slate-200 rounded-2xl p-8 text-center shadow-sm">
        <BarChart3 className="w-16 h-16 mx-auto mb-4 text-slate-300" />
        <p className="text-slate-500">No data yet. Upload some materials to see analytics.</p>
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
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white border border-slate-200 rounded-2xl p-5 text-center shadow-sm">
          <div className="text-3xl font-bold text-amber-600 mb-1">{materials.length}</div>
          <div className="text-slate-500 text-sm">Total Materials</div>
        </div>
        <div className="bg-white border border-slate-200 rounded-2xl p-5 text-center shadow-sm">
          <div className="text-3xl font-bold text-sky-600 mb-1">{totalDownloads.toLocaleString()}</div>
          <div className="text-slate-500 text-sm">Total Downloads</div>
        </div>
        <div className="bg-white border border-slate-200 rounded-2xl p-5 text-center shadow-sm">
          <div className="text-3xl font-bold text-violet-600 mb-1">{avgRating}</div>
          <div className="text-slate-500 text-sm">Average Rating</div>
        </div>
      </div>

      {/* Downloads bar chart */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
        <h3 className="text-lg font-bold text-slate-900 mb-6">Downloads by Material</h3>
        <div className="space-y-4">
          {sorted.map(m => (
            <div key={m.id}>
              <div className="flex justify-between text-sm mb-1.5">
                <span className="text-slate-700 truncate max-w-xs">{m.title}</span>
                <span className="text-slate-500 ml-4 flex-shrink-0 font-semibold">{m.download_count ?? 0}</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2">
                <div
                  className="bg-gradient-to-r from-amber-500 to-orange-500 h-2 rounded-full transition-all"
                  style={{ width: `${((m.download_count || 0) / maxDownloads) * 100}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Category breakdown */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
        <h3 className="text-lg font-bold text-slate-900 mb-6">Materials by Category</h3>
        <div className="space-y-3">
          {Object.entries(
            materials.reduce((acc, m) => {
              const cat = m.category_name || 'Uncategorized';
              acc[cat] = (acc[cat] || 0) + 1;
              return acc;
            }, {})
          ).sort((a, b) => b[1] - a[1]).map(([cat, count]) => (
            <div key={cat} className="flex items-center justify-between">
              <span className="text-slate-700 text-sm">{cat}</span>
              <div className="flex items-center gap-3">
                <div className="w-32 bg-slate-100 rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-violet-500 to-violet-600 h-2 rounded-full"
                    style={{ width: `${(count / materials.length) * 100}%` }}
                  />
                </div>
                <span className="text-slate-500 text-sm w-4">{count}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// ─── StatCard ────────────────────────────────────────────────────────────────

const StatCard = ({ icon, label, value, iconBg, iconColor, suffix = '' }) => (
  <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
    <div className={`w-10 h-10 ${iconBg} rounded-xl flex items-center justify-center ${iconColor} mb-3`}>
      {icon}
    </div>
    <div className="text-2xl font-bold text-slate-900 mb-0.5">
      {value}{suffix && <span className="text-base text-slate-400">{suffix}</span>}
    </div>
    <div className="text-xs text-slate-500 font-medium">{label}</div>
  </div>
);

export default TrainerDashboard;
