import React, { useState } from 'react';
import { Upload, BookOpen, BarChart3, Download, Edit, Trash2, Eye, Plus, X, Calendar, FileText, Image as ImageIcon, CheckCircle, Clock, AlertCircle } from 'lucide-react';

const TrainerDashboard = () => {
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [selectedTab, setSelectedTab] = useState('my-materials'); // 'my-materials' or 'stats'

  // Mock data - will be replaced with real API data
  const trainerStats = {
    totalUploads: 12,
    totalDownloads: 1845,
    averageRating: 4.7,
    thisMonth: 234
  };

  const myMaterials = [
    {
      id: 1,
      title: "Effective Communication Skills for Leaders",
      category: "Soft Skills",
      fileType: "pdf",
      fileSize: "12.5 MB",
      uploadDate: "2024-04-15",
      downloads: 234,
      rating: 4.8,
      status: "active"
    },
    {
      id: 2,
      title: "Advanced Excel Formulas Workshop",
      category: "Technical Training",
      fileType: "pptx",
      fileSize: "45.2 MB",
      uploadDate: "2024-04-10",
      downloads: 156,
      rating: 4.6,
      status: "active"
    },
    {
      id: 3,
      title: "Team Building Activities Guide",
      category: "Leadership & Management",
      fileType: "docx",
      fileSize: "8.9 MB",
      uploadDate: "2024-03-28",
      downloads: 423,
      rating: 4.9,
      status: "active"
    },
    {
      id: 4,
      title: "Sales Pipeline Management 2024",
      category: "Sales & Marketing",
      fileType: "pdf",
      fileSize: "15.3 MB",
      uploadDate: "2024-04-01",
      downloads: 189,
      rating: 4.5,
      status: "active"
    }
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
              <span className="text-sm text-slate-400">Trainer</span>
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
                SJ
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section with Upload Button */}
        <div className="flex justify-between items-start mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Welcome back, Sarah!</h1>
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

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <TrainerStatCard
            icon={<Upload className="w-6 h-6" />}
            label="Total Uploads"
            value={trainerStats.totalUploads}
            color="amber"
          />
          <TrainerStatCard
            icon={<Download className="w-6 h-6" />}
            label="Total Downloads"
            value={trainerStats.totalDownloads.toLocaleString()}
            color="blue"
          />
          <TrainerStatCard
            icon={<BarChart3 className="w-6 h-6" />}
            label="Avg. Rating"
            value={trainerStats.averageRating}
            color="purple"
            suffix="/5.0"
          />
          <TrainerStatCard
            icon={<Calendar className="w-6 h-6" />}
            label="This Month"
            value={trainerStats.thisMonth}
            color="green"
            suffix=" downloads"
          />
        </div>

        {/* Tabs */}
        <div className="flex space-x-4 mb-6 border-b border-slate-700">
          <button
            onClick={() => setSelectedTab('my-materials')}
            className={`px-4 py-3 font-semibold transition-colors relative ${
              selectedTab === 'my-materials'
                ? 'text-amber-400'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            My Materials
            {selectedTab === 'my-materials' && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-amber-500"></div>
            )}
          </button>
          <button
            onClick={() => setSelectedTab('stats')}
            className={`px-4 py-3 font-semibold transition-colors relative ${
              selectedTab === 'stats'
                ? 'text-amber-400'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Analytics
            {selectedTab === 'stats' && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-amber-500"></div>
            )}
          </button>
        </div>

        {/* My Materials Tab */}
        {selectedTab === 'my-materials' && (
          <div className="space-y-4">
            {myMaterials.map(material => (
              <MaterialRow key={material.id} material={material} />
            ))}
          </div>
        )}

        {/* Stats Tab */}
        {selectedTab === 'stats' && (
          <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-8">
            <h3 className="text-xl font-bold text-white mb-6">Download Analytics</h3>
            <div className="text-slate-400 text-center py-12">
              <BarChart3 className="w-16 h-16 mx-auto mb-4 text-slate-600" />
              <p>Analytics charts will be displayed here</p>
              <p className="text-sm mt-2">Track downloads over time, popular materials, and engagement metrics</p>
            </div>
          </div>
        )}
      </div>

      {/* Upload Modal */}
      {showUploadModal && (
        <UploadModal onClose={() => setShowUploadModal(false)} />
      )}
    </div>
  );
};

const TrainerStatCard = ({ icon, label, value, color, suffix = '' }) => {
  const colorClasses = {
    amber: 'from-amber-500/20 to-orange-600/20 text-amber-400',
    blue: 'from-blue-500/20 to-blue-600/20 text-blue-400',
    purple: 'from-purple-500/20 to-purple-600/20 text-purple-400',
    green: 'from-green-500/20 to-green-600/20 text-green-400'
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

const MaterialRow = ({ material }) => {
  const [showActions, setShowActions] = useState(false);

  const getStatusBadge = (status) => {
    const badges = {
      active: { color: 'green', icon: CheckCircle, text: 'Active' },
      pending: { color: 'yellow', icon: Clock, text: 'Pending' },
      inactive: { color: 'red', icon: AlertCircle, text: 'Inactive' }
    };
    const badge = badges[status] || badges.active;
    const Icon = badge.icon;

    return (
      <span className={`flex items-center space-x-1 text-xs px-2 py-1 rounded bg-${badge.color}-500/10 text-${badge.color}-400 border border-${badge.color}-500/30`}>
        <Icon className="w-3 h-3" />
        <span>{badge.text}</span>
      </span>
    );
  };

  return (
    <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-6 hover:border-amber-500/50 transition-all">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-4 flex-1">
          <div className="w-14 h-14 bg-gradient-to-br from-amber-500/20 to-orange-600/20 rounded-lg flex items-center justify-center text-amber-400 flex-shrink-0">
            <FileText className="w-7 h-7" />
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-4 mb-2">
              <h3 className="text-lg font-semibold text-white">
                {material.title}
              </h3>
              {getStatusBadge(material.status)}
            </div>
            
            <div className="flex items-center space-x-6 text-sm text-slate-400 mb-3">
              <span className="bg-slate-900 px-2 py-1 rounded text-xs">{material.category}</span>
              <span className="flex items-center space-x-1">
                <FileText className="w-4 h-4" />
                <span>{material.fileType.toUpperCase()}</span>
              </span>
              <span>{material.fileSize}</span>
              <span className="flex items-center space-x-1">
                <Calendar className="w-4 h-4" />
                <span>{material.uploadDate}</span>
              </span>
            </div>

            <div className="flex items-center space-x-6 text-sm">
              <span className="flex items-center space-x-1 text-blue-400">
                <Download className="w-4 h-4" />
                <span className="font-semibold">{material.downloads}</span>
                <span className="text-slate-500">downloads</span>
              </span>
              <span className="flex items-center space-x-1 text-amber-400">
                <BarChart3 className="w-4 h-4" />
                <span className="font-semibold">{material.rating}</span>
                <span className="text-slate-500">rating</span>
              </span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center space-x-2">
          <button className="p-2 bg-slate-700 hover:bg-slate-600 rounded-lg transition-colors text-slate-300 hover:text-white">
            <Eye className="w-5 h-5" />
          </button>
          <button className="p-2 bg-slate-700 hover:bg-slate-600 rounded-lg transition-colors text-slate-300 hover:text-white">
            <Edit className="w-5 h-5" />
          </button>
          <button className="p-2 bg-red-500/10 hover:bg-red-500/20 rounded-lg transition-colors text-red-400 hover:text-red-300 border border-red-500/30">
            <Trash2 className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

const UploadModal = ({ onClose }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'Soft Skills',
    tags: '',
    trainingDate: '',
    trainingType: 'delivered',
    file: null
  });

  const [dragActive, setDragActive] = useState(false);

  const categories = [
    'Soft Skills',
    'Technical Training',
    'AI & Trending Technologies',
    'Security Training',
    'Tool-Based Training',
    'Official Certifications',
    'Healthcare Training'
  ];

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFormData({...formData, file: e.dataTransfer.files[0]});
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFormData({...formData, file: e.target.files[0]});
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert('Upload functionality will be connected to backend!');
    onClose();
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
          {/* File Upload Area */}
          <div
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            className={`border-2 border-dashed rounded-xl p-8 text-center transition-all ${
              dragActive
                ? 'border-amber-500 bg-amber-500/10'
                : formData.file
                ? 'border-green-500 bg-green-500/10'
                : 'border-slate-600 bg-slate-900/50'
            }`}
          >
            <input
              type="file"
              id="file-upload"
              onChange={handleFileChange}
              className="hidden"
              accept=".pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx,.mp4,.mp3,.zip"
            />
            
            {formData.file ? (
              <div className="space-y-3">
                <CheckCircle className="w-12 h-12 text-green-400 mx-auto" />
                <p className="text-white font-semibold">{formData.file.name}</p>
                <p className="text-sm text-slate-400">
                  {(formData.file.size / (1024 * 1024)).toFixed(2)} MB
                </p>
                <button
                  type="button"
                  onClick={() => setFormData({...formData, file: null})}
                  className="text-sm text-red-400 hover:text-red-300"
                >
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
                <p className="text-sm text-slate-500">
                  PDF, DOCX, PPTX, XLSX, MP4, MP3, ZIP (max 1GB)
                </p>
              </div>
            )}
          </div>

          {/* Form Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-slate-300 mb-2">Title *</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
                className="w-full bg-slate-900 border border-slate-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-amber-500 transition-colors"
                placeholder="e.g., Leadership Skills Workshop 2024"
                required
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-slate-300 mb-2">Description *</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                className="w-full bg-slate-900 border border-slate-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-amber-500 transition-colors"
                rows="3"
                placeholder="Describe what learners will gain from this material..."
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Category *</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({...formData, category: e.target.value})}
                className="w-full bg-slate-900 border border-slate-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-amber-500 transition-colors"
                required
              >
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Tags (Optional)</label>
              <input
                type="text"
                value={formData.tags}
                onChange={(e) => setFormData({...formData, tags: e.target.value})}
                className="w-full bg-slate-900 border border-slate-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-amber-500 transition-colors"
                placeholder="leadership, communication, teamwork"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Training Date *</label>
              <input
                type="date"
                value={formData.trainingDate}
                onChange={(e) => setFormData({...formData, trainingDate: e.target.value})}
                className="w-full bg-slate-900 border border-slate-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-amber-500 transition-colors"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Training Type *</label>
              <select
                value={formData.trainingType}
                onChange={(e) => setFormData({...formData, trainingType: e.target.value})}
                className="w-full bg-slate-900 border border-slate-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-amber-500 transition-colors"
                required
              >
                <option value="delivered">Already Delivered</option>
                <option value="upcoming">Upcoming</option>
              </select>
            </div>
          </div>

          {/* Terms Notice */}
          <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
            <p className="text-sm text-slate-300">
              By uploading, you confirm this material is for <span className="text-amber-400 font-semibold">internal client use only</span>. Your content remains your intellectual property.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!formData.file || !formData.title || !formData.description}
              className="px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-600 text-white rounded-lg hover:from-amber-600 hover:to-orange-700 transition-all shadow-lg shadow-orange-500/30 disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
            >
              Upload Material
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TrainerDashboard;
