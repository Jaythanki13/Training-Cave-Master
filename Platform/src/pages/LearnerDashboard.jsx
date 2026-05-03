import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Search, Filter, Download, BookOpen, Calendar, User, Star,
  TrendingUp, Clock, FileText, Video, Music, Archive,
  Grid, List, LogOut, AlertCircle, ChevronLeft, ChevronRight,
  Bookmark, BookmarkCheck, Eye, X, Tag, ChevronDown
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { materials as materialsApi } from '../services/api';

// ─── helpers ────────────────────────────────────────────────────────────────

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

function getFileIcon(type, size = 'w-5 h-5') {
  switch (type) {
    case 'video': case 'mp4': case 'mov': case 'avi': return <Video className={size} />;
    case 'audio': case 'mp3': return <Music className={size} />;
    case 'zip': case 'rar': return <Archive className={size} />;
    default: return <FileText className={size} />;
  }
}

function StarRating({ value, max = 5, size = 'w-4 h-4', interactive = false, onChange }) {
  const [hovered, setHovered] = useState(0);
  return (
    <div className="flex items-center space-x-0.5">
      {Array.from({ length: max }, (_, i) => i + 1).map(star => (
        <button
          key={star}
          type="button"
          onClick={interactive ? () => onChange(star) : undefined}
          onMouseEnter={interactive ? () => setHovered(star) : undefined}
          onMouseLeave={interactive ? () => setHovered(0) : undefined}
          className={interactive ? 'cursor-pointer' : 'cursor-default pointer-events-none'}
        >
          <Star
            className={`${size} transition-colors ${
              star <= (hovered || value)
                ? 'fill-amber-400 text-amber-400'
                : 'text-slate-600'
            }`}
          />
        </button>
      ))}
    </div>
  );
}

// ─── Rating Modal ─────────────────────────────────────────────────────────────

const RatingModal = ({ material, onClose, onSubmit }) => {
  const [rating, setRating] = useState(material.userRating?.rating || 0);
  const [review, setReview] = useState(material.userRating?.review || '');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    if (!rating) { setError('Please select a rating'); return; }
    setSubmitting(true);
    setError('');
    try {
      await onSubmit(material.id, rating, review);
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to submit rating');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-slate-800 border border-slate-700 rounded-2xl w-full max-w-md p-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-lg font-bold text-white">Rate this material</h3>
            <p className="text-sm text-slate-400 mt-1 line-clamp-1">{material.title}</p>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors ml-4">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex items-center justify-center py-4">
          <StarRating value={rating} size="w-10 h-10" interactive onChange={setRating} />
        </div>

        <div className="text-center text-sm text-slate-400 mb-4">
          {rating === 0 && 'Tap a star to rate'}
          {rating === 1 && 'Poor'}
          {rating === 2 && 'Fair'}
          {rating === 3 && 'Good'}
          {rating === 4 && 'Very Good'}
          {rating === 5 && 'Excellent!'}
        </div>

        <textarea
          value={review}
          onChange={e => setReview(e.target.value)}
          placeholder="Share your thoughts (optional)..."
          rows={3}
          className="w-full bg-slate-900 border border-slate-600 rounded-lg px-4 py-3 text-white text-sm resize-none focus:outline-none focus:border-amber-500 transition-colors"
        />

        {error && <p className="text-red-400 text-sm mt-2">{error}</p>}

        <div className="flex space-x-3 mt-4">
          <button
            onClick={onClose}
            className="flex-1 bg-slate-700 hover:bg-slate-600 text-white py-2 rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={submitting || !rating}
            className="flex-1 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white py-2 rounded-lg font-semibold transition-all disabled:opacity-50"
          >
            {submitting ? 'Submitting...' : 'Submit Rating'}
          </button>
        </div>
      </div>
    </div>
  );
};

// ─── Material Preview Modal ───────────────────────────────────────────────────

const PreviewModal = ({ material, bookmarked, onClose, onDownload, onBookmark, onRate, downloading }) => (
  <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
    <div className="bg-slate-800 border border-slate-700 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
      {/* Header */}
      <div className="flex items-start justify-between p-6 border-b border-slate-700">
        <div className="flex items-start space-x-4 flex-1 min-w-0">
          <div className="w-14 h-14 bg-gradient-to-br from-amber-500/20 to-orange-600/20 rounded-xl flex items-center justify-center text-amber-400 flex-shrink-0">
            {getFileIcon(material.file_type, 'w-7 h-7')}
          </div>
          <div className="min-w-0">
            <h2 className="text-xl font-bold text-white leading-snug">{material.title}</h2>
            <span className="text-xs text-slate-400 bg-slate-900 px-2 py-1 rounded mt-2 inline-block">
              {material.category_name}
            </span>
          </div>
        </div>
        <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors ml-4 flex-shrink-0">
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Body */}
      <div className="p-6 space-y-5">
        {/* Trainer */}
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-blue-500/20 rounded-full flex items-center justify-center text-blue-400 text-xs font-semibold">
            {initials(material.trainer_name)}
          </div>
          <Link
            to={`/trainers/${material.trainer_id}`}
            onClick={onClose}
            className="text-blue-400 hover:text-blue-300 font-medium transition-colors"
          >
            {material.trainer_name}
          </Link>
        </div>

        {/* Description */}
        <p className="text-slate-300 leading-relaxed">{material.description}</p>

        {/* Tags */}
        {material.tags?.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {material.tags.map(tag => (
              <span key={tag} className="flex items-center space-x-1 bg-slate-700 text-slate-300 text-xs px-3 py-1 rounded-full">
                <Tag className="w-3 h-3" />
                <span>{tag}</span>
              </span>
            ))}
          </div>
        )}

        {/* Metadata grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { label: 'File Type', value: material.file_type?.toUpperCase() || '—' },
            { label: 'File Size', value: formatFileSize(material.file_size) },
            { label: 'Downloads', value: material.download_count ?? 0 },
            { label: 'Uploaded', value: formatDate(material.uploaded_at) },
          ].map(({ label, value }) => (
            <div key={label} className="bg-slate-900 rounded-lg p-3 text-center">
              <div className="text-slate-400 text-xs mb-1">{label}</div>
              <div className="text-white font-semibold text-sm">{value}</div>
            </div>
          ))}
        </div>

        {/* Rating */}
        <div className="flex items-center space-x-3">
          <StarRating value={Math.round(material.rating_avg || 0)} />
          <span className="text-slate-300 font-semibold">
            {material.rating_avg > 0 ? Number(material.rating_avg).toFixed(1) : '—'}
          </span>
          <span className="text-slate-500 text-sm">({material.rating_count || 0} ratings)</span>
        </div>

        {/* Training type badge */}
        {material.training_type && (
          <div>
            <span className={`text-xs px-3 py-1 rounded-full font-medium ${
              material.training_type === 'upcoming'
                ? 'bg-blue-500/20 text-blue-400'
                : 'bg-green-500/20 text-green-400'
            }`}>
              {material.training_type === 'upcoming' ? 'Upcoming Training' : 'Delivered Training'}
            </span>
            {material.training_date && (
              <span className="text-slate-500 text-sm ml-2">{formatDate(material.training_date)}</span>
            )}
          </div>
        )}
      </div>

      {/* Footer actions */}
      <div className="flex items-center space-x-3 p-6 border-t border-slate-700">
        <button
          onClick={() => onBookmark(material.id)}
          className={`p-3 rounded-lg border transition-all ${
            bookmarked
              ? 'border-amber-500 bg-amber-500/10 text-amber-400'
              : 'border-slate-600 bg-slate-900 text-slate-400 hover:border-slate-500'
          }`}
          title={bookmarked ? 'Remove bookmark' : 'Save for later'}
        >
          {bookmarked ? <BookmarkCheck className="w-5 h-5" /> : <Bookmark className="w-5 h-5" />}
        </button>
        <button
          onClick={() => { onClose(); onRate(material); }}
          className="p-3 rounded-lg border border-slate-600 bg-slate-900 text-slate-400 hover:border-amber-500 hover:text-amber-400 transition-all"
          title="Rate this material"
        >
          <Star className="w-5 h-5" />
        </button>
        <button
          onClick={() => onDownload(material.id)}
          disabled={downloading === material.id}
          className="flex-1 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white py-3 rounded-lg font-semibold transition-all disabled:opacity-60 flex items-center justify-center space-x-2"
        >
          <Download className="w-5 h-5" />
          <span>{downloading === material.id ? 'Getting link...' : 'Download'}</span>
        </button>
      </div>
    </div>
  </div>
);

// ─── main component ──────────────────────────────────────────────────────────

const LearnerDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  // Tab
  const [activeTab, setActiveTab] = useState('browse');

  // Browse state
  const [viewMode, setViewMode] = useState('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedFileType, setSelectedFileType] = useState('all');
  const [selectedTrainingType, setSelectedTrainingType] = useState('all');
  const [minRating, setMinRating] = useState(0);
  const [sortBy, setSortBy] = useState('newest');
  const [showFilters, setShowFilters] = useState(false);
  const [page, setPage] = useState(1);

  const [materials, setMaterials] = useState([]);
  const [pagination, setPagination] = useState({ total: 0, totalPages: 1 });
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [downloading, setDownloading] = useState(null);

  // Saved tab state
  const [savedMaterials, setSavedMaterials] = useState([]);
  const [savedLoading, setSavedLoading] = useState(false);

  // Bookmarks (Set of IDs for quick lookup)
  const [bookmarkedIds, setBookmarkedIds] = useState(new Set());

  // Modals
  const [previewMaterial, setPreviewMaterial] = useState(null);
  const [ratingTarget, setRatingTarget] = useState(null);

  // Debounce search input
  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(searchQuery), 400);
    return () => clearTimeout(t);
  }, [searchQuery]);

  // Reset page when filters change
  useEffect(() => { setPage(1); }, [debouncedSearch, selectedCategory, selectedFileType, selectedTrainingType, minRating, sortBy]);

  // Load categories once
  useEffect(() => {
    materialsApi.getCategories()
      .then(data => setCategories(data.categories || []))
      .catch(() => {});
  }, []);

  // Load bookmarked IDs once on mount (if logged in)
  useEffect(() => {
    if (user) {
      materialsApi.getBookmarkedIds()
        .then(data => setBookmarkedIds(new Set(data.ids || [])))
        .catch(() => {});
    }
  }, [user]);

  // Fetch materials
  const fetchMaterials = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const params = { page, limit: 12, sortBy };
      if (debouncedSearch) params.search = debouncedSearch;
      if (selectedCategory !== 'all') params.category = selectedCategory;
      if (selectedFileType !== 'all') params.fileType = selectedFileType;
      if (selectedTrainingType !== 'all') params.trainingType = selectedTrainingType;
      if (minRating > 0) params.minRating = minRating;

      const data = await materialsApi.getAll(params);
      setMaterials(data.materials || []);
      setPagination(data.pagination || { total: 0, totalPages: 1 });
    } catch (err) {
      setError(err.message || 'Failed to load materials');
    } finally {
      setLoading(false);
    }
  }, [debouncedSearch, selectedCategory, selectedFileType, selectedTrainingType, minRating, sortBy, page]);

  useEffect(() => { fetchMaterials(); }, [fetchMaterials]);

  // Load saved materials when switching to Saved tab
  useEffect(() => {
    if (activeTab === 'saved') {
      setSavedLoading(true);
      materialsApi.getBookmarked()
        .then(data => setSavedMaterials(data.materials || []))
        .catch(() => {})
        .finally(() => setSavedLoading(false));
    }
  }, [activeTab]);

  const handleDownload = async (id) => {
    setDownloading(id);
    try {
      const data = await materialsApi.getDownloadUrl(id);
      window.open(data.downloadUrl, '_blank', 'noopener,noreferrer');
    } catch (err) {
      alert(err.message || 'Failed to generate download link');
    } finally {
      setDownloading(null);
    }
  };

  const handleToggleBookmark = async (id) => {
    try {
      const data = await materialsApi.toggleBookmark(id);
      setBookmarkedIds(prev => {
        const next = new Set(prev);
        data.bookmarked ? next.add(id) : next.delete(id);
        return next;
      });
      // Remove from saved list immediately if on saved tab
      if (activeTab === 'saved' && !data.bookmarked) {
        setSavedMaterials(prev => prev.filter(m => m.id !== id));
      }
    } catch (err) {
      alert(err.message || 'Failed to update bookmark');
    }
  };

  const handleRate = async (materialId, rating, review) => {
    const data = await materialsApi.rate(materialId, rating, review);
    // Update rating in materials list
    const update = m => m.id === materialId
      ? { ...m, rating_avg: data.rating_avg, rating_count: data.rating_count }
      : m;
    setMaterials(prev => prev.map(update));
    setSavedMaterials(prev => prev.map(update));
    if (previewMaterial?.id === materialId) {
      setPreviewMaterial(prev => ({ ...prev, rating_avg: data.rating_avg, rating_count: data.rating_count }));
    }
  };

  const handleLogout = () => { logout(); navigate('/'); };

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedCategory('all');
    setSelectedFileType('all');
    setSelectedTrainingType('all');
    setMinRating(0);
    setSortBy('newest');
  };

  const activeFiltersCount = [
    selectedCategory !== 'all',
    selectedFileType !== 'all',
    selectedTrainingType !== 'all',
    minRating > 0,
    sortBy !== 'newest',
  ].filter(Boolean).length;

  const fileTypes = [
    { value: 'all', label: 'All Types' },
    { value: 'pdf', label: 'PDF' },
    { value: 'pptx', label: 'Presentation' },
    { value: 'docx', label: 'Document' },
    { value: 'mp4', label: 'Video' },
    { value: 'mp3', label: 'Audio' },
    { value: 'zip', label: 'Archive' },
  ];

  const sortOptions = [
    { value: 'newest', label: 'Newest First' },
    { value: 'oldest', label: 'Oldest First' },
    { value: 'popular', label: 'Most Downloaded' },
    { value: 'rating', label: 'Highest Rated' },
  ];

  const displayMaterials = activeTab === 'saved' ? savedMaterials : materials;
  const displayLoading = activeTab === 'saved' ? savedLoading : loading;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <header className="border-b border-slate-700/50 bg-slate-900/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-orange-600 rounded-lg flex items-center justify-center">
                  <BookOpen className="w-6 h-6 text-white" />
                </div>
                <span className="text-2xl font-bold text-white">Training Cave</span>
              </div>
              {/* Tab navigation */}
              <nav className="hidden md:flex items-center space-x-1">
                {[
                  { id: 'browse', label: 'Browse' },
                  { id: 'saved', label: `Saved${bookmarkedIds.size > 0 ? ` (${bookmarkedIds.size})` : ''}` },
                ].map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                      activeTab === tab.id
                        ? 'bg-amber-500/20 text-amber-400'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </nav>
            </div>
            <div className="flex items-center space-x-4">
              {/* Mobile tab buttons */}
              <div className="flex md:hidden items-center space-x-1">
                <button
                  onClick={() => setActiveTab('browse')}
                  className={`p-2 rounded-lg text-xs transition-all ${activeTab === 'browse' ? 'bg-amber-500/20 text-amber-400' : 'text-slate-400'}`}
                >
                  Browse
                </button>
                <button
                  onClick={() => setActiveTab('saved')}
                  className={`p-2 rounded-lg transition-all ${activeTab === 'saved' ? 'bg-amber-500/20 text-amber-400' : 'text-slate-400'}`}
                >
                  <Bookmark className="w-4 h-4" />
                </button>
              </div>
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                {initials(user?.full_name)}
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center space-x-1 text-slate-400 hover:text-white transition-colors"
                title="Sign out"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">
            {activeTab === 'saved'
              ? 'Saved Materials'
              : `Welcome back, ${user?.full_name?.split(' ')[0] || 'Learner'}!`}
          </h1>
          <p className="text-slate-400">
            {activeTab === 'saved'
              ? 'Your bookmarked materials in one place'
              : 'Explore our training library and continue learning'}
          </p>
        </div>

        {/* Quick Stats — browse tab only */}
        {activeTab === 'browse' && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <StatCard icon={<BookOpen className="w-6 h-6" />} label="Total Materials" value={pagination.total || '—'} color="amber" />
            <StatCard icon={<Download className="w-6 h-6" />} label="Showing" value={materials.length} color="blue" />
            <StatCard icon={<TrendingUp className="w-6 h-6" />} label="Pages" value={pagination.totalPages || 1} color="green" />
            <StatCard icon={<Bookmark className="w-6 h-6" />} label="Saved" value={bookmarkedIds.size} color="purple" />
          </div>
        )}

        {/* Search and Filters — browse tab only */}
        {activeTab === 'browse' && (
          <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-6 mb-8">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder="Search materials, trainers, topics..."
                  className="w-full bg-slate-900 border border-slate-600 rounded-lg pl-10 pr-4 py-3 text-white focus:outline-none focus:border-amber-500 transition-colors"
                />
              </div>
              <select
                value={selectedCategory}
                onChange={e => setSelectedCategory(e.target.value)}
                className="bg-slate-900 border border-slate-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-amber-500 transition-colors"
              >
                <option value="all">All Categories</option>
                {categories.map(cat => (
                  <option key={cat.id} value={cat.slug}>{cat.name}</option>
                ))}
              </select>
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`border rounded-lg px-6 py-3 text-white transition-all flex items-center space-x-2 ${
                  activeFiltersCount > 0
                    ? 'border-amber-500 bg-amber-500/10 text-amber-400'
                    : 'bg-slate-700 border-slate-600 hover:bg-slate-600'
                }`}
              >
                <Filter className="w-5 h-5" />
                <span>Filters{activeFiltersCount > 0 ? ` (${activeFiltersCount})` : ''}</span>
                <ChevronDown className={`w-4 h-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
              </button>
            </div>

            {showFilters && (
              <div className="mt-4 pt-4 border-t border-slate-700 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* File Type */}
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">File Type</label>
                  <select
                    value={selectedFileType}
                    onChange={e => setSelectedFileType(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-amber-500"
                  >
                    {fileTypes.map(t => (
                      <option key={t.value} value={t.value}>{t.label}</option>
                    ))}
                  </select>
                </div>
                {/* Training Type */}
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Training Type</label>
                  <select
                    value={selectedTrainingType}
                    onChange={e => setSelectedTrainingType(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-amber-500"
                  >
                    <option value="all">All Types</option>
                    <option value="upcoming">Upcoming</option>
                    <option value="delivered">Delivered</option>
                  </select>
                </div>
                {/* Min Rating */}
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Min Rating {minRating > 0 && <span className="text-amber-400">{minRating}★+</span>}
                  </label>
                  <div className="flex items-center space-x-3">
                    <input
                      type="range"
                      min={0}
                      max={5}
                      step={1}
                      value={minRating}
                      onChange={e => setMinRating(parseInt(e.target.value))}
                      className="flex-1 accent-amber-500"
                    />
                    {minRating > 0 && (
                      <button onClick={() => setMinRating(0)} className="text-slate-400 hover:text-white">
                        <X className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
                {/* Sort + Clear */}
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Sort By</label>
                  <select
                    value={sortBy}
                    onChange={e => setSortBy(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-amber-500"
                  >
                    {sortOptions.map(opt => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                </div>
                {activeFiltersCount > 0 && (
                  <div className="col-span-full flex justify-end">
                    <button
                      onClick={clearFilters}
                      className="text-sm text-slate-400 hover:text-white underline"
                    >
                      Clear all filters
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Error banner */}
        {error && (
          <div className="flex items-center space-x-2 bg-red-500/10 border border-red-500/30 rounded-lg px-4 py-3 mb-6">
            <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
            <span className="text-sm text-red-400">{error}</span>
            <button onClick={fetchMaterials} className="ml-auto text-sm text-red-400 underline">Retry</button>
          </div>
        )}

        {/* View toggle + count — browse tab only */}
        {activeTab === 'browse' && (
          <div className="flex justify-between items-center mb-6">
            <p className="text-slate-400">
              {loading ? 'Loading...' : (
                <>Showing <span className="text-white font-semibold">{materials.length}</span> of <span className="text-white font-semibold">{pagination.total}</span> materials</>
              )}
            </p>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-amber-500 text-white' : 'bg-slate-700 text-slate-400 hover:bg-slate-600'}`}
              >
                <Grid className="w-5 h-5" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-lg transition-all ${viewMode === 'list' ? 'bg-amber-500 text-white' : 'bg-slate-700 text-slate-400 hover:bg-slate-600'}`}
              >
                <List className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}

        {/* Loading skeleton */}
        {displayLoading && (
          <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-4'}>
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="bg-slate-800/50 border border-slate-700 rounded-xl p-6 animate-pulse">
                <div className="flex justify-between mb-4">
                  <div className="w-12 h-12 bg-slate-700 rounded-lg" />
                  <div className="w-24 h-6 bg-slate-700 rounded" />
                </div>
                <div className="h-5 bg-slate-700 rounded mb-2" />
                <div className="h-4 bg-slate-700 rounded w-3/4 mb-4" />
                <div className="h-4 bg-slate-700 rounded w-1/2" />
              </div>
            ))}
          </div>
        )}

        {/* Materials grid/list */}
        {!displayLoading && displayMaterials.length > 0 && (
          <div className={
            activeTab === 'saved' || viewMode === 'list'
              ? 'space-y-4'
              : 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
          }>
            {displayMaterials.map(material =>
              (activeTab === 'saved' || viewMode === 'list')
                ? (
                  <MaterialListItem
                    key={material.id}
                    material={material}
                    bookmarked={bookmarkedIds.has(material.id)}
                    onDownload={handleDownload}
                    onBookmark={handleToggleBookmark}
                    onRate={setRatingTarget}
                    onPreview={setPreviewMaterial}
                    downloading={downloading}
                  />
                ) : (
                  <MaterialCard
                    key={material.id}
                    material={material}
                    bookmarked={bookmarkedIds.has(material.id)}
                    onDownload={handleDownload}
                    onBookmark={handleToggleBookmark}
                    onRate={setRatingTarget}
                    onPreview={setPreviewMaterial}
                    downloading={downloading}
                  />
                )
            )}
          </div>
        )}

        {/* Empty state */}
        {!displayLoading && displayMaterials.length === 0 && !error && (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
              {activeTab === 'saved'
                ? <Bookmark className="w-12 h-12 text-slate-600" />
                : <Search className="w-12 h-12 text-slate-600" />
              }
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">
              {activeTab === 'saved' ? 'No saved materials yet' : 'No materials found'}
            </h3>
            <p className="text-slate-400 mb-4">
              {activeTab === 'saved'
                ? 'Bookmark materials to find them here quickly'
                : 'Try adjusting your search or filters'}
            </p>
            {activeTab === 'browse' && (
              <button onClick={clearFilters} className="bg-amber-500 hover:bg-amber-600 text-white px-6 py-2 rounded-lg transition-colors">
                Clear Filters
              </button>
            )}
          </div>
        )}

        {/* Pagination — browse tab only */}
        {activeTab === 'browse' && !loading && pagination.totalPages > 1 && (
          <div className="flex items-center justify-center space-x-4 mt-10">
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              className="p-2 rounded-lg bg-slate-700 text-slate-300 hover:bg-slate-600 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <span className="text-slate-300">
              Page <span className="text-white font-semibold">{page}</span> of <span className="text-white font-semibold">{pagination.totalPages}</span>
            </span>
            <button
              onClick={() => setPage(p => Math.min(pagination.totalPages, p + 1))}
              disabled={page === pagination.totalPages}
              className="p-2 rounded-lg bg-slate-700 text-slate-300 hover:bg-slate-600 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>

      {/* Preview Modal */}
      {previewMaterial && (
        <PreviewModal
          material={previewMaterial}
          bookmarked={bookmarkedIds.has(previewMaterial.id)}
          onClose={() => setPreviewMaterial(null)}
          onDownload={handleDownload}
          onBookmark={handleToggleBookmark}
          onRate={m => { setPreviewMaterial(null); setRatingTarget(m); }}
          downloading={downloading}
        />
      )}

      {/* Rating Modal */}
      {ratingTarget && (
        <RatingModal
          material={ratingTarget}
          onClose={() => setRatingTarget(null)}
          onSubmit={handleRate}
        />
      )}
    </div>
  );
};

// ─── sub-components ───────────────────────────────────────────────────────────

const StatCard = ({ icon, label, value, color }) => {
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
      <div className="text-2xl font-bold text-white mb-1">{value}</div>
      <div className="text-sm text-slate-400">{label}</div>
    </div>
  );
};

const MaterialCard = ({ material, bookmarked, onDownload, onBookmark, onRate, onPreview, downloading }) => (
  <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-6 hover:border-amber-500/50 transition-all group flex flex-col">
    <div className="flex items-start justify-between mb-4">
      <div className="w-12 h-12 bg-gradient-to-br from-amber-500/20 to-orange-600/20 rounded-lg flex items-center justify-center text-amber-400">
        {getFileIcon(material.file_type)}
      </div>
      <div className="flex items-center space-x-2">
        <button
          onClick={() => onBookmark(material.id)}
          className={`p-1.5 rounded-lg transition-all ${bookmarked ? 'text-amber-400' : 'text-slate-500 hover:text-amber-400'}`}
          title={bookmarked ? 'Remove bookmark' : 'Save for later'}
        >
          {bookmarked ? <BookmarkCheck className="w-4 h-4" /> : <Bookmark className="w-4 h-4" />}
        </button>
        <span className="text-xs text-slate-400 bg-slate-900 px-2 py-1 rounded">{material.category_name}</span>
      </div>
    </div>

    <button
      onClick={() => onPreview(material)}
      className="text-left mb-2"
    >
      <h3 className="text-lg font-semibold text-white line-clamp-2 group-hover:text-amber-400 transition-colors">
        {material.title}
      </h3>
    </button>
    <p className="text-sm text-slate-400 mb-4 line-clamp-2 flex-1">{material.description}</p>

    <div className="flex items-center space-x-2 mb-4">
      <Link
        to={`/trainers/${material.trainer_id}`}
        className="flex items-center space-x-2 text-sm text-slate-400 hover:text-blue-400 transition-colors"
      >
        <User className="w-4 h-4" />
        <span>{material.trainer_name}</span>
      </Link>
    </div>

    <div className="flex items-center justify-between pt-4 border-t border-slate-700">
      <div className="flex items-center space-x-3 text-xs text-slate-500">
        <span className="flex items-center space-x-1">
          <Download className="w-3 h-3" />
          <span>{material.download_count ?? 0}</span>
        </span>
        {material.rating_avg > 0 && (
          <span className="flex items-center space-x-1">
            <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
            <span>{Number(material.rating_avg).toFixed(1)}</span>
          </span>
        )}
        <span>{formatFileSize(material.file_size)}</span>
      </div>
      <div className="flex items-center space-x-2">
        <button
          onClick={() => onPreview(material)}
          className="p-2 rounded-lg bg-slate-700 text-slate-400 hover:bg-slate-600 hover:text-white transition-all"
          title="Preview details"
        >
          <Eye className="w-4 h-4" />
        </button>
        <button
          onClick={() => onDownload(material.id)}
          disabled={downloading === material.id}
          className="bg-gradient-to-r from-amber-500 to-orange-600 text-white px-4 py-2 rounded-lg hover:from-amber-600 hover:to-orange-700 transition-all text-sm font-semibold flex items-center space-x-1 disabled:opacity-60"
        >
          <Download className="w-4 h-4" />
          <span>{downloading === material.id ? '...' : 'Get'}</span>
        </button>
      </div>
    </div>
  </div>
);

const MaterialListItem = ({ material, bookmarked, onDownload, onBookmark, onRate, onPreview, downloading }) => (
  <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-6 hover:border-amber-500/50 transition-all">
    <div className="flex items-start gap-4">
      <div className="w-16 h-16 bg-gradient-to-br from-amber-500/20 to-orange-600/20 rounded-lg flex items-center justify-center text-amber-400 flex-shrink-0">
        {getFileIcon(material.file_type, 'w-7 h-7')}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-4 mb-1">
          <button onClick={() => onPreview(material)} className="text-left">
            <h3 className="text-xl font-semibold text-white hover:text-amber-400 transition-colors">
              {material.title}
            </h3>
          </button>
          <div className="flex items-center space-x-2 flex-shrink-0">
            <button
              onClick={() => onBookmark(material.id)}
              className={`p-1.5 transition-all ${bookmarked ? 'text-amber-400' : 'text-slate-500 hover:text-amber-400'}`}
            >
              {bookmarked ? <BookmarkCheck className="w-4 h-4" /> : <Bookmark className="w-4 h-4" />}
            </button>
            <span className="text-xs text-slate-400 bg-slate-900 px-3 py-1 rounded whitespace-nowrap">
              {material.category_name}
            </span>
          </div>
        </div>
        <p className="text-slate-400 mb-3 line-clamp-2">{material.description}</p>
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center space-x-4 text-sm text-slate-500">
            <Link
              to={`/trainers/${material.trainer_id}`}
              className="flex items-center space-x-1 hover:text-blue-400 transition-colors"
            >
              <User className="w-4 h-4" />
              <span>{material.trainer_name}</span>
            </Link>
            <span className="flex items-center space-x-1">
              <Download className="w-4 h-4" />
              <span>{material.download_count ?? 0}</span>
            </span>
            {material.rating_avg > 0 && (
              <span className="flex items-center space-x-1">
                <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                <span>{Number(material.rating_avg).toFixed(1)}</span>
              </span>
            )}
            <span className="flex items-center space-x-1">
              <Calendar className="w-4 h-4" />
              <span>{formatDate(material.uploaded_at)}</span>
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => onRate(material)}
              className="p-2 rounded-lg bg-slate-700 text-slate-400 hover:text-amber-400 hover:bg-slate-600 transition-all"
              title="Rate this material"
            >
              <Star className="w-4 h-4" />
            </button>
            <button
              onClick={() => onDownload(material.id)}
              disabled={downloading === material.id}
              className="bg-gradient-to-r from-amber-500 to-orange-600 text-white px-6 py-2 rounded-lg hover:from-amber-600 hover:to-orange-700 transition-all font-semibold flex items-center space-x-2 disabled:opacity-60"
            >
              <Download className="w-4 h-4" />
              <span>{downloading === material.id ? 'Getting...' : 'Download'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default LearnerDashboard;
