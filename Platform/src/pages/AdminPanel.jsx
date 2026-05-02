import React, { useState } from 'react';
import { Shield, Users, BookOpen, Download, TrendingUp, CheckCircle, XCircle, Clock, Search, Filter, Eye, Trash2, UserCheck, UserX, BarChart3, Calendar, AlertTriangle } from 'lucide-react';

const AdminPanel = () => {
  const [selectedTab, setSelectedTab] = useState('pending-trainers'); // 'pending-trainers', 'all-users', 'all-materials', 'analytics'
  const [searchQuery, setSearchQuery] = useState('');

  // Mock data - will be replaced with real API data
  const dashboardStats = {
    totalUsers: 1245,
    totalTrainers: 87,
    totalLearners: 1158,
    pendingApprovals: 12,
    totalMaterials: 456,
    totalDownloads: 45678,
    avgRating: 4.7,
    thisWeek: {
      newUsers: 34,
      newMaterials: 23,
      downloads: 1234
    }
  };

  const pendingTrainers = [
    {
      id: 1,
      name: "Alex Kumar",
      email: "alex.kumar@example.com",
      bio: "Corporate trainer with 10+ years experience in leadership development and team building.",
      expertise: "Leadership, Team Building, Communication",
      registeredDate: "2024-04-20",
      status: "pending"
    },
    {
      id: 2,
      name: "Maria Garcia",
      email: "maria.garcia@example.com",
      bio: "Tech instructor specializing in Python, data analytics, and cloud computing.",
      expertise: "Python, Data Science, Cloud",
      registeredDate: "2024-04-21",
      status: "pending"
    },
    {
      id: 3,
      name: "James Wilson",
      email: "james.wilson@example.com",
      bio: "Sales coach helping teams improve negotiation and closing techniques.",
      expertise: "Sales, Negotiation, Business Development",
      registeredDate: "2024-04-22",
      status: "pending"
    }
  ];

  const allUsers = [
    { id: 1, name: "John Doe", email: "john@example.com", role: "learner", status: "active", joined: "2024-03-15", downloads: 23 },
    { id: 2, name: "Sarah Johnson", email: "sarah@example.com", role: "trainer", status: "active", joined: "2024-02-10", uploads: 12 },
    { id: 3, name: "Mike Brown", email: "mike@example.com", role: "learner", status: "active", joined: "2024-04-01", downloads: 8 },
    { id: 4, name: "Rachel Williams", email: "rachel@example.com", role: "trainer", status: "active", joined: "2024-01-20", uploads: 18 },
  ];

  const allMaterials = [
    {
      id: 1,
      title: "Effective Communication Skills",
      trainer: "Sarah Johnson",
      category: "Soft Skills",
      uploadDate: "2024-04-15",
      downloads: 234,
      rating: 4.8,
      status: "active"
    },
    {
      id: 2,
      title: "Python for Data Analysis",
      trainer: "Michael Chen",
      category: "Technical Training",
      uploadDate: "2024-04-18",
      downloads: 567,
      rating: 4.9,
      status: "active"
    },
    {
      id: 3,
      title: "Sales Negotiation Tactics",
      trainer: "David Martinez",
      category: "Sales & Marketing",
      uploadDate: "2024-04-19",
      downloads: 423,
      rating: 4.6,
      status: "active"
    }
  ];

  const handleApproveTrainer = (trainerId) => {
    alert(`Trainer ${trainerId} approved! Email notification will be sent to jay.thanki@cognixia.com and the trainer.`);
  };

  const handleRejectTrainer = (trainerId) => {
    if (confirm('Are you sure you want to reject this trainer application?')) {
      alert(`Trainer ${trainerId} rejected. Notification email will be sent.`);
    }
  };

  const handleBanUser = (userId) => {
    if (confirm('Are you sure you want to ban this user? This action can be reversed later.')) {
      alert(`User ${userId} has been banned.`);
    }
  };

  const handleDeleteMaterial = (materialId) => {
    if (confirm('Are you sure you want to delete this material? This action cannot be undone.')) {
      alert(`Material ${materialId} has been deleted.`);
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
              <span className="ml-3 px-3 py-1 bg-purple-500/20 border border-purple-500/40 rounded-lg text-purple-300 text-sm font-semibold flex items-center space-x-1">
                <Shield className="w-4 h-4" />
                <span>Admin</span>
              </span>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-slate-400">jay.thanki@cognixia.com</span>
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
                JT
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Admin Dashboard</h1>
          <p className="text-slate-400">Monitor platform activity and manage users</p>
        </div>

        {/* Top Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <AdminStatCard
            icon={<Users className="w-6 h-6" />}
            label="Total Users"
            value={dashboardStats.totalUsers.toLocaleString()}
            subtext={`${dashboardStats.totalTrainers} trainers, ${dashboardStats.totalLearners} learners`}
            color="blue"
          />
          <AdminStatCard
            icon={<Clock className="w-6 h-6" />}
            label="Pending Approvals"
            value={dashboardStats.pendingApprovals}
            subtext="Trainer applications"
            color="amber"
            alert={dashboardStats.pendingApprovals > 0}
          />
          <AdminStatCard
            icon={<BookOpen className="w-6 h-6" />}
            label="Total Materials"
            value={dashboardStats.totalMaterials}
            subtext={`+${dashboardStats.thisWeek.newMaterials} this week`}
            color="purple"
          />
          <AdminStatCard
            icon={<Download className="w-6 h-6" />}
            label="Total Downloads"
            value={dashboardStats.totalDownloads.toLocaleString()}
            subtext={`+${dashboardStats.thisWeek.downloads} this week`}
            color="green"
          />
        </div>

        {/* Tabs */}
        <div className="flex space-x-2 mb-6 border-b border-slate-700 overflow-x-auto">
          <TabButton
            active={selectedTab === 'pending-trainers'}
            onClick={() => setSelectedTab('pending-trainers')}
            icon={<Clock className="w-4 h-4" />}
            label="Pending Trainers"
            count={pendingTrainers.length}
            alert={true}
          />
          <TabButton
            active={selectedTab === 'all-users'}
            onClick={() => setSelectedTab('all-users')}
            icon={<Users className="w-4 h-4" />}
            label="All Users"
          />
          <TabButton
            active={selectedTab === 'all-materials'}
            onClick={() => setSelectedTab('all-materials')}
            icon={<BookOpen className="w-4 h-4" />}
            label="All Materials"
          />
          <TabButton
            active={selectedTab === 'analytics'}
            onClick={() => setSelectedTab('analytics')}
            icon={<BarChart3 className="w-4 h-4" />}
            label="Analytics"
          />
        </div>

        {/* Pending Trainers Tab */}
        {selectedTab === 'pending-trainers' && (
          <div className="space-y-4">
            {pendingTrainers.length === 0 ? (
              <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-12 text-center">
                <CheckCircle className="w-16 h-16 text-green-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">All caught up!</h3>
                <p className="text-slate-400">No pending trainer applications at the moment.</p>
              </div>
            ) : (
              pendingTrainers.map(trainer => (
                <PendingTrainerCard
                  key={trainer.id}
                  trainer={trainer}
                  onApprove={() => handleApproveTrainer(trainer.id)}
                  onReject={() => handleRejectTrainer(trainer.id)}
                />
              ))
            )}
          </div>
        )}

        {/* All Users Tab */}
        {selectedTab === 'all-users' && (
          <div>
            <div className="mb-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search users by name or email..."
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg pl-10 pr-4 py-3 text-white focus:outline-none focus:border-amber-500 transition-colors"
                />
              </div>
            </div>
            <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl overflow-hidden">
              <table className="w-full">
                <thead className="bg-slate-900/50 border-b border-slate-700">
                  <tr>
                    <th className="text-left px-6 py-4 text-sm font-semibold text-slate-300">User</th>
                    <th className="text-left px-6 py-4 text-sm font-semibold text-slate-300">Role</th>
                    <th className="text-left px-6 py-4 text-sm font-semibold text-slate-300">Status</th>
                    <th className="text-left px-6 py-4 text-sm font-semibold text-slate-300">Joined</th>
                    <th className="text-left px-6 py-4 text-sm font-semibold text-slate-300">Activity</th>
                    <th className="text-right px-6 py-4 text-sm font-semibold text-slate-300">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-700">
                  {allUsers.map(user => (
                    <tr key={user.id} className="hover:bg-slate-800/30 transition-colors">
                      <td className="px-6 py-4">
                        <div>
                          <div className="font-semibold text-white">{user.name}</div>
                          <div className="text-sm text-slate-400">{user.email}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          user.role === 'trainer'
                            ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                            : 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                        }`}>
                          {user.role}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="flex items-center space-x-1 text-green-400">
                          <CheckCircle className="w-4 h-4" />
                          <span className="text-sm">{user.status}</span>
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-400">{user.joined}</td>
                      <td className="px-6 py-4 text-sm text-slate-400">
                        {user.role === 'trainer' ? `${user.uploads} uploads` : `${user.downloads} downloads`}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end space-x-2">
                          <button className="p-2 bg-slate-700 hover:bg-slate-600 rounded-lg transition-colors text-slate-300">
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleBanUser(user.id)}
                            className="p-2 bg-red-500/10 hover:bg-red-500/20 rounded-lg transition-colors text-red-400 border border-red-500/30"
                          >
                            <UserX className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* All Materials Tab */}
        {selectedTab === 'all-materials' && (
          <div className="space-y-4">
            {allMaterials.map(material => (
              <div key={material.id} className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-6 hover:border-amber-500/50 transition-all">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="text-lg font-semibold text-white">{material.title}</h3>
                      <span className="text-xs text-slate-400 bg-slate-900 px-3 py-1 rounded whitespace-nowrap">
                        {material.category}
                      </span>
                    </div>
                    <div className="flex items-center space-x-6 text-sm text-slate-400 mb-3">
                      <span className="flex items-center space-x-1">
                        <Users className="w-4 h-4" />
                        <span>{material.trainer}</span>
                      </span>
                      <span className="flex items-center space-x-1">
                        <Download className="w-4 h-4" />
                        <span>{material.downloads} downloads</span>
                      </span>
                      <span className="flex items-center space-x-1">
                        <BarChart3 className="w-4 h-4" />
                        <span>{material.rating} rating</span>
                      </span>
                      <span className="flex items-center space-x-1">
                        <Calendar className="w-4 h-4" />
                        <span>{material.uploadDate}</span>
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button className="p-2 bg-slate-700 hover:bg-slate-600 rounded-lg transition-colors text-slate-300">
                      <Eye className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => handleDeleteMaterial(material.id)}
                      className="p-2 bg-red-500/10 hover:bg-red-500/20 rounded-lg transition-colors text-red-400 border border-red-500/30"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Analytics Tab */}
        {selectedTab === 'analytics' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-6">
              <h3 className="text-xl font-bold text-white mb-6">User Growth</h3>
              <div className="text-slate-400 text-center py-12">
                <TrendingUp className="w-16 h-16 mx-auto mb-4 text-slate-600" />
                <p>User growth chart will be displayed here</p>
              </div>
            </div>
            <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-6">
              <h3 className="text-xl font-bold text-white mb-6">Downloads Trend</h3>
              <div className="text-slate-400 text-center py-12">
                <BarChart3 className="w-16 h-16 mx-auto mb-4 text-slate-600" />
                <p>Download trend chart will be displayed here</p>
              </div>
            </div>
            <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-6">
              <h3 className="text-xl font-bold text-white mb-6">Popular Categories</h3>
              <div className="text-slate-400 text-center py-12">
                <BookOpen className="w-16 h-16 mx-auto mb-4 text-slate-600" />
                <p>Category distribution chart will be displayed here</p>
              </div>
            </div>
            <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-6">
              <h3 className="text-xl font-bold text-white mb-6">Top Trainers</h3>
              <div className="text-slate-400 text-center py-12">
                <Users className="w-16 h-16 mx-auto mb-4 text-slate-600" />
                <p>Top trainers leaderboard will be displayed here</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const AdminStatCard = ({ icon, label, value, subtext, color, alert = false }) => {
  const colorClasses = {
    blue: 'from-blue-500/20 to-blue-600/20 text-blue-400',
    amber: 'from-amber-500/20 to-orange-600/20 text-amber-400',
    purple: 'from-purple-500/20 to-purple-600/20 text-purple-400',
    green: 'from-green-500/20 to-green-600/20 text-green-400'
  };

  return (
    <div className={`bg-slate-800/50 backdrop-blur-sm border rounded-xl p-4 relative ${
      alert ? 'border-amber-500/50 shadow-lg shadow-amber-500/20' : 'border-slate-700'
    }`}>
      {alert && (
        <div className="absolute -top-2 -right-2">
          <span className="relative flex h-6 w-6">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-6 w-6 bg-amber-500 items-center justify-center">
              <AlertTriangle className="w-4 h-4 text-white" />
            </span>
          </span>
        </div>
      )}
      <div className={`w-12 h-12 bg-gradient-to-br ${colorClasses[color]} rounded-lg flex items-center justify-center mb-3`}>
        {icon}
      </div>
      <div className="text-2xl font-bold text-white mb-1">{value}</div>
      <div className="text-sm text-slate-400">{label}</div>
      {subtext && <div className="text-xs text-slate-500 mt-1">{subtext}</div>}
    </div>
  );
};

const TabButton = ({ active, onClick, icon, label, count, alert = false }) => {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-3 font-semibold transition-colors relative flex items-center space-x-2 whitespace-nowrap ${
        active ? 'text-amber-400' : 'text-slate-400 hover:text-white'
      }`}
    >
      {icon}
      <span>{label}</span>
      {count !== undefined && (
        <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${
          alert
            ? 'bg-amber-500 text-white'
            : 'bg-slate-700 text-slate-300'
        }`}>
          {count}
        </span>
      )}
      {active && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-amber-500"></div>}
    </button>
  );
};

const PendingTrainerCard = ({ trainer, onApprove, onReject }) => {
  const [showFullBio, setShowFullBio] = useState(false);

  return (
    <div className="bg-slate-800/50 backdrop-blur-sm border border-amber-500/30 rounded-xl p-6 shadow-lg shadow-amber-500/10">
      <div className="flex items-start justify-between gap-4 mb-4">
        <div className="flex items-start gap-4 flex-1">
          <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center text-white text-xl font-bold flex-shrink-0">
            {trainer.name.split(' ').map(n => n[0]).join('')}
          </div>
          <div className="flex-1">
            <h3 className="text-xl font-bold text-white mb-1">{trainer.name}</h3>
            <p className="text-slate-400 text-sm mb-2">{trainer.email}</p>
            <div className="flex items-center space-x-2 text-xs text-slate-500">
              <Clock className="w-3 h-3" />
              <span>Applied on {trainer.registeredDate}</span>
            </div>
          </div>
        </div>
        <span className="px-3 py-1 bg-amber-500/20 border border-amber-500/40 rounded-lg text-amber-300 text-sm font-semibold whitespace-nowrap">
          Pending Review
        </span>
      </div>

      <div className="mb-4">
        <h4 className="text-sm font-semibold text-slate-300 mb-2">Bio</h4>
        <p className="text-slate-400 text-sm">
          {showFullBio ? trainer.bio : `${trainer.bio.substring(0, 120)}...`}
          {trainer.bio.length > 120 && (
            <button
              onClick={() => setShowFullBio(!showFullBio)}
              className="text-amber-400 hover:text-amber-300 ml-1"
            >
              {showFullBio ? 'Show less' : 'Read more'}
            </button>
          )}
        </p>
      </div>

      <div className="mb-6">
        <h4 className="text-sm font-semibold text-slate-300 mb-2">Expertise Areas</h4>
        <div className="flex flex-wrap gap-2">
          {trainer.expertise.split(',').map((skill, idx) => (
            <span key={idx} className="px-3 py-1 bg-slate-700 rounded-full text-slate-300 text-sm">
              {skill.trim()}
            </span>
          ))}
        </div>
      </div>

      <div className="flex items-center space-x-3">
        <button
          onClick={onApprove}
          className="flex-1 bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-3 rounded-lg hover:from-green-600 hover:to-green-700 transition-all shadow-lg shadow-green-500/30 font-semibold flex items-center justify-center space-x-2"
        >
          <UserCheck className="w-5 h-5" />
          <span>Approve Trainer</span>
        </button>
        <button
          onClick={onReject}
          className="flex-1 bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-red-400 hover:text-red-300 px-6 py-3 rounded-lg transition-all font-semibold flex items-center justify-center space-x-2"
        >
          <XCircle className="w-5 h-5" />
          <span>Reject</span>
        </button>
      </div>
    </div>
  );
};

export default AdminPanel;
