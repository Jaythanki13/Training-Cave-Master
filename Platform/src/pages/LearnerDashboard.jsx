import React, { useState } from 'react';
import { Search, Filter, Download, BookOpen, Calendar, User, Star, TrendingUp, Clock, FileText, Video, Music, Archive, ChevronDown, Grid, List, X } from 'lucide-react';

const LearnerDashboard = () => {
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedFileType, setSelectedFileType] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [showFilters, setShowFilters] = useState(false);

  // Mock data - will be replaced with real API data
  const materials = [
    {
      id: 1,
      title: "Effective Communication Skills for Leaders",
      description: "Master the art of clear, persuasive communication in leadership roles. Learn active listening, feedback techniques, and presentation skills.",
      trainer: "Sarah Johnson",
      category: "Soft Skills",
      fileType: "pdf",
      fileSize: "12.5 MB",
      uploadDate: "2024-04-15",
      downloads: 234,
      rating: 4.8
    },
    {
      id: 2,
      title: "Python for Data Analysis - Complete Course",
      description: "Comprehensive guide to Python programming for data science. Covers pandas, NumPy, matplotlib, and real-world projects.",
      trainer: "Michael Chen",
      category: "Technical Training",
      fileType: "video",
      fileSize: "856 MB",
      uploadDate: "2024-04-18",
      downloads: 567,
      rating: 4.9
    },
    {
      id: 3,
      title: "Agile Project Management Workshop",
      description: "Learn Scrum, Kanban, and agile methodologies. Includes templates, case studies, and certification prep materials.",
      trainer: "Rachel Williams",
      category: "Leadership & Management",
      fileType: "pptx",
      fileSize: "45.2 MB",
      uploadDate: "2024-04-20",
      downloads: 189,
      rating: 4.7
    },
    {
      id: 4,
      title: "Sales Negotiation Masterclass",
      description: "Advanced negotiation tactics for closing deals. Role-play scenarios, objection handling, and value-based selling.",
      trainer: "David Martinez",
      category: "Sales & Marketing",
      fileType: "pdf",
      fileSize: "8.9 MB",
      uploadDate: "2024-04-19",
      downloads: 423,
      rating: 4.6
    },
    {
      id: 5,
      title: "HR Compliance & Labor Laws 2024",
      description: "Updated guide to employment law, workplace safety regulations, and HR best practices for 2024.",
      trainer: "Jennifer Park",
      category: "HR & Compliance",
      fileType: "docx",
      fileSize: "3.2 MB",
      uploadDate: "2024-04-21",
      downloads: 156,
      rating: 4.5
    },
    {
      id: 6,
      title: "Workplace Safety Training Videos",
      description: "Complete video series covering OSHA standards, emergency procedures, and safety protocols.",
      trainer: "Robert Thompson",
      category: "Health & Safety",
      fileType: "video",
      fileSize: "1.2 GB",
      uploadDate: "2024-04-17",
      downloads: 312,
      rating: 4.8
    }
  ];

  const categories = [
    'All Categories',
    'Soft Skills',
    'Technical Training',
    'AI & Trending Technologies',
    'Security Training',
    'Tool-Based Training',
    'Official Certifications',
    'Healthcare Training'
  ];

  const fileTypes = [
    { value: 'all', label: 'All Types', icon: FileText },
    { value: 'pdf', label: 'PDF', icon: FileText },
    { value: 'pptx', label: 'Presentation', icon: FileText },
    { value: 'docx', label: 'Document', icon: FileText },
    { value: 'video', label: 'Video', icon: Video },
    { value: 'audio', label: 'Audio', icon: Music },
    { value: 'archive', label: 'Archive', icon: Archive }
  ];

  const sortOptions = [
    { value: 'newest', label: 'Newest First' },
    { value: 'oldest', label: 'Oldest First' },
    { value: 'popular', label: 'Most Downloaded' },
    { value: 'rating', label: 'Highest Rated' }
  ];

  const filteredMaterials = materials.filter(material => {
    const matchesSearch = material.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         material.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         material.trainer.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || material.category === selectedCategory;
    const matchesFileType = selectedFileType === 'all' || material.fileType === selectedFileType;
    return matchesSearch && matchesCategory && matchesFileType;
  });

  const getFileIcon = (type) => {
    switch(type) {
      case 'pdf':
      case 'docx':
      case 'pptx':
        return <FileText className="w-5 h-5" />;
      case 'video':
        return <Video className="w-5 h-5" />;
      case 'audio':
        return <Music className="w-5 h-5" />;
      case 'archive':
        return <Archive className="w-5 h-5" />;
      default:
        return <FileText className="w-5 h-5" />;
    }
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
              <button className="text-slate-300 hover:text-white transition-colors">
                <Clock className="w-5 h-5" />
              </button>
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-semibold">
                JD
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Welcome back, John!</h1>
          <p className="text-slate-400">Explore our training library and continue learning</p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <StatCard icon={<BookOpen className="w-6 h-6" />} label="Total Materials" value="1,245" color="amber" />
          <StatCard icon={<Download className="w-6 h-6" />} label="Your Downloads" value="23" color="blue" />
          <StatCard icon={<Star className="w-6 h-6" />} label="Saved" value="12" color="purple" />
          <StatCard icon={<TrendingUp className="w-6 h-6" />} label="New This Week" value="45" color="green" />
        </div>

        {/* Search and Filters */}
        <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search Bar */}
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

            {/* Category Dropdown */}
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="bg-slate-900 border border-slate-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-amber-500 transition-colors"
            >
              {categories.map(cat => (
                <option key={cat} value={cat === 'All Categories' ? 'all' : cat}>
                  {cat}
                </option>
              ))}
            </select>

            {/* Filter Button */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="bg-slate-700 border border-slate-600 rounded-lg px-6 py-3 text-white hover:bg-slate-600 transition-all flex items-center space-x-2"
            >
              <Filter className="w-5 h-5" />
              <span>Filters</span>
            </button>
          </div>

          {/* Expanded Filters */}
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
                  {sortOptions.map(option => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                  ))}
                </select>
              </div>
            </div>
          )}
        </div>

        {/* View Mode Toggle and Results Count */}
        <div className="flex justify-between items-center mb-6">
          <p className="text-slate-400">
            Showing <span className="text-white font-semibold">{filteredMaterials.length}</span> materials
          </p>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-lg transition-all ${
                viewMode === 'grid'
                  ? 'bg-amber-500 text-white'
                  : 'bg-slate-700 text-slate-400 hover:bg-slate-600'
              }`}
            >
              <Grid className="w-5 h-5" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-lg transition-all ${
                viewMode === 'list'
                  ? 'bg-amber-500 text-white'
                  : 'bg-slate-700 text-slate-400 hover:bg-slate-600'
              }`}
            >
              <List className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Materials Grid/List */}
        <div className={viewMode === 'grid' 
          ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
          : 'space-y-4'
        }>
          {filteredMaterials.map(material => (
            viewMode === 'grid' 
              ? <MaterialCard key={material.id} material={material} getFileIcon={getFileIcon} />
              : <MaterialListItem key={material.id} material={material} getFileIcon={getFileIcon} />
          ))}
        </div>

        {/* Empty State */}
        {filteredMaterials.length === 0 && (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-12 h-12 text-slate-600" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">No materials found</h3>
            <p className="text-slate-400 mb-4">Try adjusting your search or filters</p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('all');
                setSelectedFileType('all');
              }}
              className="bg-amber-500 hover:bg-amber-600 text-white px-6 py-2 rounded-lg transition-colors"
            >
              Clear Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

const StatCard = ({ icon, label, value, color }) => {
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
      <div className="text-2xl font-bold text-white mb-1">{value}</div>
      <div className="text-sm text-slate-400">{label}</div>
    </div>
  );
};

const MaterialCard = ({ material, getFileIcon }) => {
  return (
    <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-6 hover:border-amber-500/50 transition-all group">
      <div className="flex items-start justify-between mb-4">
        <div className={`w-12 h-12 bg-gradient-to-br from-amber-500/20 to-orange-600/20 rounded-lg flex items-center justify-center text-amber-400`}>
          {getFileIcon(material.fileType)}
        </div>
        <span className="text-xs text-slate-400 bg-slate-900 px-2 py-1 rounded">{material.category}</span>
      </div>
      
      <h3 className="text-lg font-semibold text-white mb-2 line-clamp-2 group-hover:text-amber-400 transition-colors">
        {material.title}
      </h3>
      
      <p className="text-sm text-slate-400 mb-4 line-clamp-2">
        {material.description}
      </p>

      <div className="flex items-center space-x-2 mb-4">
        <User className="w-4 h-4 text-slate-500" />
        <span className="text-sm text-slate-400">{material.trainer}</span>
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-slate-700">
        <div className="flex items-center space-x-4 text-xs text-slate-500">
          <span className="flex items-center space-x-1">
            <Download className="w-3 h-3" />
            <span>{material.downloads}</span>
          </span>
          <span className="flex items-center space-x-1">
            <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
            <span>{material.rating}</span>
          </span>
        </div>
        <button className="bg-gradient-to-r from-amber-500 to-orange-600 text-white px-4 py-2 rounded-lg hover:from-amber-600 hover:to-orange-700 transition-all text-sm font-semibold flex items-center space-x-1">
          <Download className="w-4 h-4" />
          <span>Download</span>
        </button>
      </div>
    </div>
  );
};

const MaterialListItem = ({ material, getFileIcon }) => {
  return (
    <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-6 hover:border-amber-500/50 transition-all">
      <div className="flex items-start gap-4">
        <div className={`w-16 h-16 bg-gradient-to-br from-amber-500/20 to-orange-600/20 rounded-lg flex items-center justify-center text-amber-400 flex-shrink-0`}>
          {getFileIcon(material.fileType)}
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-4 mb-2">
            <h3 className="text-xl font-semibold text-white hover:text-amber-400 transition-colors">
              {material.title}
            </h3>
            <span className="text-xs text-slate-400 bg-slate-900 px-3 py-1 rounded whitespace-nowrap">
              {material.category}
            </span>
          </div>
          
          <p className="text-slate-400 mb-3">
            {material.description}
          </p>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-6 text-sm text-slate-500">
              <span className="flex items-center space-x-2">
                <User className="w-4 h-4" />
                <span>{material.trainer}</span>
              </span>
              <span className="flex items-center space-x-1">
                <Download className="w-4 h-4" />
                <span>{material.downloads} downloads</span>
              </span>
              <span className="flex items-center space-x-1">
                <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                <span>{material.rating}</span>
              </span>
              <span className="flex items-center space-x-1">
                <Calendar className="w-4 h-4" />
                <span>{material.uploadDate}</span>
              </span>
            </div>
            
            <button className="bg-gradient-to-r from-amber-500 to-orange-600 text-white px-6 py-2 rounded-lg hover:from-amber-600 hover:to-orange-700 transition-all font-semibold flex items-center space-x-2">
              <Download className="w-4 h-4" />
              <span>Download</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LearnerDashboard;
