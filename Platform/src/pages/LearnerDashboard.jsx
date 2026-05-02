import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search, Filter, Download, BookOpen, Calendar, User, Star,
  TrendingUp, Clock, FileText, Video, Music, Archive,
  Grid, List, LogOut, AlertCircle, ChevronLeft, ChevronRight
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

function getFileIcon(type) {
  switch (type) {
    case 'video': case 'mp4': case 'mov': return <Video className="w-5 h-5" />;
    case 'audio': case 'mp3': return <Music className="w-5 h-5" />;
    case 'zip': case 'rar': return <Archive className="w-5 h-5" />;
    default: return <FileText className="w-5 h-5" />;
  }
}

// ─── main component ──────────────────────────────────────────────────────────

const LearnerDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [viewMode, setViewMode] = useState('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedFileType, setSelectedFileType] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [showFilters, setShowFilters] = useState(false);
  const [page, setPage] = useState(1);

  const [materials, setMaterials] = useState([]);
  const [pagination, setPagination] = useState({ total: 0, totalPages: 1 });
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [downloading, setDownloading] = useState(null);

  // Debounce search input by 400ms
  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(searchQuery), 400);
    return () => clearTimeout(t);
  }, [searchQuery]);

  // Reset to page 1 when filters change
  useEffect(() => { setPage(1); }, [debouncedSearch, selectedCategory, selectedFileType, sortBy]);

  // Load categories once
  useEffect(() => {
    materialsApi.getCategories()
      .then(data => setCategories(data.categories || []))
      .catch(() => {});
  }, []);

  // Fetch materials whenever filters / page change
  const fetchMaterials = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const params = { page, limit: 12, sortBy };
      if (debouncedSearch) params.search = debouncedSearch;
      if (selectedCategory !== 'all') params.category = selectedCategory;
      if (selectedFileType !== 'all') params.fileType = selectedFileType;

      const data = await materialsApi.getAll(params);
      setMaterials(data.materials || []);
      setPagination(data.pagination || { total: 0, totalPages: 1 });
    } catch (err) {
      setError(err.message || 'Failed to load materials');
    } finally {
      setLoading(false);
    }
  }, [debouncedSearch, selectedCategory, selectedFileType, sortBy, page]);

  useEffect(() => { fetchMaterials(); }, [fetchMaterials]);

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

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedCategory('all');
    setSelectedFileType('all');
    setSortBy('newest');
  };

  const fileTypes = [
    { value: 'all', label: 'All Types', icon: FileText },
    { value: 'pdf', label: 'PDF', icon: FileText },
    { value: 'pptx', label: 'Presentation', icon: FileText },
    { value: 'docx', label: 'Document', icon: FileText },
    { value: 'video', label: 'Video', icon: Video },
    { value: 'audio', label: 'Audio', icon: Music },
    { value: 'zip', label: 'Archive', icon: Archive },
  ];

  const sortOptions = [
    { value: 'newest', label: 'Newest First' },
    { value: 'oldest', label: 'Oldest First' },
    { value: 'popular', label: 'Most Downloaded' },
    { value: 'rating', label: 'Highest Rated' },
  ];

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
              <Clock className="w-5 h-5 text-slate-400" />
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
            Welcome back, {user?.full_name?.split(' ')[0] || 'Learner'}!
          </h1>
          <p className="text-slate-400">Explore our training library and continue learning</p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <StatCard icon={<BookOpen className="w-6 h-6" />} label="Total Materials" value={pagination.total || '—'} color="amber" />
          <StatCard icon={<Download className="w-6 h-6" />} label="Showing" value={materials.length} color="blue" />
          <StatCard icon={<TrendingUp className="w-6 h-6" />} label="Pages" value={pagination.totalPages || 1} color="green" />
          <StatCard icon={<Star className="w-6 h-6" />} label="Categories" value={categories.length || '—'} color="purple" />
        </div>

        {/* Search and Filters */}
        <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search materials, trainers, topics..."
                className="w-full bg-slate-900 border border-slate-600 rounded-lg pl-10 pr-4 py-3 text-white focus:outline-none focus:border-amber-500 transition-colors"
              />
            </div>

            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="bg-slate-900 border border-slate-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-amber-500 transition-colors"
            >
              <option value="all">All Categories</option>
              {categories.map(cat => (
                <option key={cat.id} value={cat.slug}>{cat.name}</option>
              ))}
            </select>

            <button
              onClick={() => setShowFilters(!showFilters)}
              className="bg-slate-700 border border-slate-600 rounded-lg px-6 py-3 text-white hover:bg-slate-600 transition-all flex items-center space-x-2"
            >
              <Filter className="w-5 h-5" />
              <span>Filters</span>
            </button>
          </div>

          {showFilters && (
            <div className="mt-4 pt-4 border-t border-slate-700 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">File Type</label>
                <div className="flex flex-wrap gap-2">
                  {fileTypes.map(type => (
                    <button
                      key={type.value}
                      onClick={() => setSelectedFileType(type.value)}
                      className={`px-4 py-2 rounded-lg border-2 transition-all flex items-center space-x-2 ${
                        selectedFileType === type.value
                          ? 'border-amber-500 bg-amber-500/10 text-white'
                          : 'border-slate-600 bg-slate-900 text-slate-400 hover:border-slate-500'
                      }`}
                    >
                      <type.icon className="w-4 h-4" />
                      <span className="text-sm">{type.label}</span>
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Sort By</label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-amber-500"
                >
                  {sortOptions.map(opt => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </div>
            </div>
          )}
        </div>

        {/* Error banner */}
        {error && (
          <div className="flex items-center space-x-2 bg-red-500/10 border border-red-500/30 rounded-lg px-4 py-3 mb-6">
            <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
            <span className="text-sm text-red-400">{error}</span>
            <button onClick={fetchMaterials} className="ml-auto text-sm text-red-400 underline">Retry</button>
          </div>
        )}

        {/* View toggle + count */}
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

        {/* Loading skeleton */}
        {loading && (
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

        {/* Materials */}
        {!loading && materials.length > 0 && (
          <div className={viewMode === 'grid'
            ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
            : 'space-y-4'
          }>
            {materials.map(material => (
              viewMode === 'grid'
                ? <MaterialCard key={material.id} material={material} onDownload={handleDownload} downloading={downloading} />
                : <MaterialListItem key={material.id} material={material} onDownload={handleDownload} downloading={downloading} />
            ))}
          </div>
        )}

        {/* Empty state */}
        {!loading && materials.length === 0 && !error && (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-12 h-12 text-slate-600" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">No materials found</h3>
            <p className="text-slate-400 mb-4">Try adjusting your search or filters</p>
            <button onClick={clearFilters} className="bg-amber-500 hover:bg-amber-600 text-white px-6 py-2 rounded-lg transition-colors">
              Clear Filters
            </button>
          </div>
        )}

        {/* Pagination */}
        {!loading && pagination.totalPages > 1 && (
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

const DownloadButton = ({ materialId, onDownload, downloading, className = '' }) => (
  <button
    onClick={() => onDownload(materialId)}
    disabled={downloading === materialId}
    className={`bg-gradient-to-r from-amber-500 to-orange-600 text-white rounded-lg hover:from-amber-600 hover:to-orange-700 transition-all font-semibold flex items-center space-x-1 disabled:opacity-60 disabled:cursor-not-allowed ${className}`}
  >
    <Download className="w-4 h-4" />
    <span>{downloading === materialId ? 'Getting link...' : 'Download'}</span>
  </button>
);

const MaterialCard = ({ material, onDownload, downloading }) => (
  <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-6 hover:border-amber-500/50 transition-all group">
    <div className="flex items-start justify-between mb-4">
      <div className="w-12 h-12 bg-gradient-to-br from-amber-500/20 to-orange-600/20 rounded-lg flex items-center justify-center text-amber-400">
        {getFileIcon(material.file_type)}
      </div>
      <span className="text-xs text-slate-400 bg-slate-900 px-2 py-1 rounded">{material.category_name}</span>
    </div>

    <h3 className="text-lg font-semibold text-white mb-2 line-clamp-2 group-hover:text-amber-400 transition-colors">
      {material.title}
    </h3>
    <p className="text-sm text-slate-400 mb-4 line-clamp-2">{material.description}</p>

    <div className="flex items-center space-x-2 mb-4">
      <User className="w-4 h-4 text-slate-500" />
      <span className="text-sm text-slate-400">{material.trainer_name}</span>
    </div>

    <div className="flex items-center justify-between pt-4 border-t border-slate-700">
      <div className="flex items-center space-x-4 text-xs text-slate-500">
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
      <DownloadButton materialId={material.id} onDownload={onDownload} downloading={downloading} className="px-4 py-2 text-sm" />
    </div>
  </div>
);

const MaterialListItem = ({ material, onDownload, downloading }) => (
  <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-6 hover:border-amber-500/50 transition-all">
    <div className="flex items-start gap-4">
      <div className="w-16 h-16 bg-gradient-to-br from-amber-500/20 to-orange-600/20 rounded-lg flex items-center justify-center text-amber-400 flex-shrink-0">
        {getFileIcon(material.file_type)}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-4 mb-2">
          <h3 className="text-xl font-semibold text-white hover:text-amber-400 transition-colors">
            {material.title}
          </h3>
          <span className="text-xs text-slate-400 bg-slate-900 px-3 py-1 rounded whitespace-nowrap">
            {material.category_name}
          </span>
        </div>
        <p className="text-slate-400 mb-3">{material.description}</p>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-6 text-sm text-slate-500">
            <span className="flex items-center space-x-2">
              <User className="w-4 h-4" />
              <span>{material.trainer_name}</span>
            </span>
            <span className="flex items-center space-x-1">
              <Download className="w-4 h-4" />
              <span>{material.download_count ?? 0} downloads</span>
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
          <DownloadButton materialId={material.id} onDownload={onDownload} downloading={downloading} className="px-6 py-2" />
        </div>
      </div>
    </div>
  </div>
);

export default LearnerDashboard;
