import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Shield, Users, BookOpen, Download, TrendingUp, CheckCircle, XCircle,
  Clock, Search, Eye, Trash2, UserCheck, UserX, BarChart3, Calendar,
  AlertTriangle, LogOut, AlertCircle, Star, FileText
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { admin as adminApi } from '../services/api';

// ─── helpers ─────────────────────────────────────────────────────────────────

function formatDate(iso) {
  if (!iso) return '—';
  return new Date(iso).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
}

function initials(name = '') {
  return name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2) || '?';
}

// ─── main component ──────────────────────────────────────────────────────────

const AdminPanel = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [selectedTab, setSelectedTab] = useState('pending-trainers');
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');

  const [stats, setStats] = useState(null);
  const [pendingTrainers, setPendingTrainers] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [allMaterials, setAllMaterials] = useState([]);

  const [statsLoading, setStatsLoading] = useState(true);
  const [trainersLoading, setTrainersLoading] = useState(true);
  const [usersLoading, setUsersLoading] = useState(false);
  const [materialsLoading, setMaterialsLoading] = useState(false);

  const [error, setError] = useState('');
  const [deletingId, setDeletingId] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // Debounce user search
  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(searchQuery), 400);
    return () => clearTimeout(t);
  }, [searchQuery]);

  // Load stats + pending trainers on mount
  useEffect(() => {
    adminApi.getStats()
      .then(data => setStats(data.stats))
      .catch(() => {})
      .finally(() => setStatsLoading(false));

    adminApi.getPendingTrainers()
      .then(data => setPendingTrainers(data.trainers || []))
      .catch(() => {})
      .finally(() => setTrainersLoading(false));
  }, []);

  // Load users when tab is active or search changes
  useEffect(() => {
    if (selectedTab !== 'all-users') return;
    setUsersLoading(true);
    const params = debouncedSearch ? { search: debouncedSearch } : {};
    adminApi.getUsers(params)
      .then(data => setAllUsers(data.users || []))
      .catch(() => {})
      .finally(() => setUsersLoading(false));
  }, [selectedTab, debouncedSearch]);

  // Load materials when tab is active
  useEffect(() => {
    if (selectedTab !== 'all-materials') return;
    setMaterialsLoading(true);
    adminApi.getMaterials()
      .then(data => setAllMaterials(data.materials || []))
      .catch(() => {})
      .finally(() => setMaterialsLoading(false));
  }, [selectedTab]);

  const handleApproveTrainer = async (id) => {
    try {
      await adminApi.approveTrainer(id);
      setPendingTrainers(prev => prev.filter(t => t.id !== id));
      setStats(prev => prev ? {
        ...prev,
        users: { ...prev.users, pending_trainers: Math.max(0, (prev.users.pending_trainers || 1) - 1) }
      } : prev);
    } catch (err) {
      alert(err.message || 'Failed to approve trainer');
    }
  };

  const handleRejectTrainer = async (id) => {
    if (!window.confirm('Reject this trainer application? They can re-register later.')) return;
    try {
      await adminApi.rejectTrainer(id);
      setPendingTrainers(prev => prev.filter(t => t.id !== id));
      setStats(prev => prev ? {
        ...prev,
        users: { ...prev.users, pending_trainers: Math.max(0, (prev.users.pending_trainers || 1) - 1) }
      } : prev);
    } catch (err) {
      alert(err.message || 'Failed to reject trainer');
    }
  };

  const handleToggleBan = async (user) => {
    const isBanned = user.status === 'banned';
    const action = isBanned ? 'unban' : 'ban';
    if (!isBanned && !window.confirm(`Ban ${user.full_name}? They won't be able to log in.`)) return;
    try {
      if (isBanned) {
        await adminApi.unbanUser(user.id);
      } else {
        await adminApi.banUser(user.id);
      }
      setAllUsers(prev => prev.map(u =>
        u.id === user.id ? { ...u, status: isBanned ? 'active' : 'banned' } : u
      ));
    } catch (err) {
      alert(err.message || `Failed to ${action} user`);
    }
  };

  const handleDeleteMaterial = async () => {
    if (!deletingId) return;
    setDeleteLoading(true);
    try {
      await adminApi.deleteMaterial(deletingId);
      setAllMaterials(prev => prev.filter(m => m.id !== deletingId));
    } catch (err) {
      alert(err.message || 'Failed to delete material');
    } finally {
      setDeleteLoading(false);
      setDeletingId(null);
    }
  };

  const handleLogout = () => { logout(); navigate('/'); };

  const pendingCount = pendingTrainers.length;

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
              <span className="ml-2 px-3 py-1 bg-purple-500/20 border border-purple-500/40 rounded-lg text-purple-300 text-sm font-semibold flex items-center space-x-1">
                <Shield className="w-4 h-4" />
                <span>Admin</span>
              </span>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-slate-400">{user?.email}</span>
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
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Admin Dashboard</h1>
          <p className="text-slate-400">Monitor platform activity and manage users</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <AdminStatCard
            icon={<Users className="w-6 h-6" />}
            label="Total Users"
            value={statsLoading ? '…' : Number(stats?.users?.total_users || 0).toLocaleString()}
            subtext={stats ? `${stats.users.trainers} trainers · ${stats.users.learners} learners` : ''}
            color="blue"
          />
          <AdminStatCard
            icon={<Clock className="w-6 h-6" />}
            label="Pending Approvals"
            value={statsLoading ? '…' : (stats?.users?.pending_trainers || 0)}
            subtext="Trainer applications"
            color="amber"
            alert={pendingCount > 0}
          />
          <AdminStatCard
            icon={<BookOpen className="w-6 h-6" />}
            label="Total Materials"
            value={statsLoading ? '…' : (stats?.materials || 0)}
            subtext={stats ? `+${stats.thisWeek?.new_materials || 0} this week` : ''}
            color="purple"
          />
          <AdminStatCard
            icon={<Download className="w-6 h-6" />}
            label="Total Downloads"
            value={statsLoading ? '…' : Number(stats?.downloads || 0).toLocaleString()}
            subtext={stats ? `+${stats.thisWeek?.week_downloads || 0} this week` : ''}
            color="green"
          />
        </div>

        {/* Tabs */}
        <div className="flex space-x-2 mb-6 border-b border-slate-700 overflow-x-auto">
          <TabButton active={selectedTab === 'pending-trainers'} onClick={() => setSelectedTab('pending-trainers')}
            icon={<Clock className="w-4 h-4" />} label="Pending Trainers"
            count={pendingCount} alert={pendingCount > 0} />
          <TabButton active={selectedTab === 'all-users'} onClick={() => setSelectedTab('all-users')}
            icon={<Users className="w-4 h-4" />} label="All Users" />
          <TabButton active={selectedTab === 'all-materials'} onClick={() => setSelectedTab('all-materials')}
            icon={<BookOpen className="w-4 h-4" />} label="All Materials" />
          <TabButton active={selectedTab === 'analytics'} onClick={() => setSelectedTab('analytics')}
            icon={<BarChart3 className="w-4 h-4" />} label="Analytics" />
        </div>

        {/* ── Pending Trainers ── */}
        {selectedTab === 'pending-trainers' && (
          <div className="space-y-4">
            {trainersLoading && (
              <div className="space-y-4">
                {[1, 2].map(i => (
                  <div key={i} className="bg-slate-800/50 border border-slate-700 rounded-xl p-6 animate-pulse">
                    <div className="flex gap-4">
                      <div className="w-16 h-16 bg-slate-700 rounded-full flex-shrink-0" />
                      <div className="flex-1 space-y-3">
                        <div className="h-5 bg-slate-700 rounded w-1/3" />
                        <div className="h-4 bg-slate-700 rounded w-1/4" />
                        <div className="h-4 bg-slate-700 rounded w-2/3" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
            {!trainersLoading && pendingTrainers.length === 0 && (
              <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-12 text-center">
                <CheckCircle className="w-16 h-16 text-green-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">All caught up!</h3>
                <p className="text-slate-400">No pending trainer applications at the moment.</p>
              </div>
            )}
            {!trainersLoading && pendingTrainers.map(trainer => (
              <PendingTrainerCard
                key={trainer.id}
                trainer={trainer}
                onApprove={() => handleApproveTrainer(trainer.id)}
                onReject={() => handleRejectTrainer(trainer.id)}
              />
            ))}
          </div>
        )}

        {/* ── All Users ── */}
        {selectedTab === 'all-users' && (
          <div>
            <div className="mb-4 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search users by name or email..."
                className="w-full bg-slate-800 border border-slate-700 rounded-lg pl-10 pr-4 py-3 text-white focus:outline-none focus:border-amber-500 transition-colors"
              />
            </div>
            <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl overflow-hidden">
              <table className="w-full">
                <thead className="bg-slate-900/50 border-b border-slate-700">
                  <tr>
                    {['User', 'Role', 'Status', 'Joined', 'Last Login', 'Actions'].map(h => (
                      <th key={h} className={`px-6 py-4 text-sm font-semibold text-slate-300 ${h === 'Actions' ? 'text-right' : 'text-left'}`}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-700">
                  {usersLoading && (
                    <tr><td colSpan={6} className="px-6 py-8 text-center text-slate-400">Loading users…</td></tr>
                  )}
                  {!usersLoading && allUsers.length === 0 && (
                    <tr><td colSpan={6} className="px-6 py-8 text-center text-slate-400">No users found</td></tr>
                  )}
                  {!usersLoading && allUsers.map(u => (
                    <tr key={u.id} className="hover:bg-slate-800/30 transition-colors">
                      <td className="px-6 py-4">
                        <div className="font-semibold text-white">{u.full_name}</div>
                        <div className="text-sm text-slate-400">{u.email}</div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          u.role === 'trainer' ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                          : u.role === 'super_admin' ? 'bg-red-500/20 text-red-300 border border-red-500/30'
                          : 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                        }`}>
                          {u.role}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`flex items-center space-x-1 ${
                          u.status === 'active' ? 'text-green-400'
                          : u.status === 'banned' ? 'text-red-400'
                          : 'text-amber-400'
                        }`}>
                          {u.status === 'active' ? <CheckCircle className="w-4 h-4" />
                           : u.status === 'banned' ? <XCircle className="w-4 h-4" />
                           : <Clock className="w-4 h-4" />}
                          <span className="text-sm capitalize">{u.status}</span>
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-400">{formatDate(u.created_at)}</td>
                      <td className="px-6 py-4 text-sm text-slate-400">{formatDate(u.last_login) || 'Never'}</td>
                      <td className="px-6 py-4 text-right">
                        {u.role !== 'super_admin' && (
                          <button
                            onClick={() => handleToggleBan(u)}
                            className={`p-2 rounded-lg transition-colors border ${
                              u.status === 'banned'
                                ? 'bg-green-500/10 hover:bg-green-500/20 text-green-400 border-green-500/30'
                                : 'bg-red-500/10 hover:bg-red-500/20 text-red-400 border-red-500/30'
                            }`}
                            title={u.status === 'banned' ? 'Unban user' : 'Ban user'}
                          >
                            {u.status === 'banned' ? <UserCheck className="w-4 h-4" /> : <UserX className="w-4 h-4" />}
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ── All Materials ── */}
        {selectedTab === 'all-materials' && (
          <div className="space-y-4">
            {materialsLoading && (
              <div className="space-y-4">
                {[1, 2, 3].map(i => (
                  <div key={i} className="bg-slate-800/50 border border-slate-700 rounded-xl p-6 animate-pulse">
                    <div className="h-5 bg-slate-700 rounded w-1/2 mb-3" />
                    <div className="h-4 bg-slate-700 rounded w-1/3" />
                  </div>
                ))}
              </div>
            )}
            {!materialsLoading && allMaterials.length === 0 && (
              <div className="text-center py-12 text-slate-400">No materials found</div>
            )}
            {!materialsLoading && allMaterials.map(material => (
              <div key={material.id} className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-6 hover:border-amber-500/50 transition-all">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="text-lg font-semibold text-white">{material.title}</h3>
                      <span className="text-xs text-slate-400 bg-slate-900 px-3 py-1 rounded whitespace-nowrap ml-4">
                        {material.category_name}
                      </span>
                    </div>
                    <div className="flex flex-wrap items-center gap-4 text-sm text-slate-400">
                      <span className="flex items-center space-x-1">
                        <Users className="w-4 h-4" />
                        <span>{material.trainer_name}</span>
                      </span>
                      <span className="flex items-center space-x-1">
                        <FileText className="w-4 h-4" />
                        <span>{(material.file_type || '?').toUpperCase()}</span>
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
                  </div>
                  <button
                    onClick={() => setDeletingId(material.id)}
                    className="p-2 bg-red-500/10 hover:bg-red-500/20 rounded-lg transition-colors text-red-400 border border-red-500/30 flex-shrink-0"
                    title="Delete material"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ── Analytics ── */}
        {selectedTab === 'analytics' && (
          <AnalyticsTab stats={stats} loading={statsLoading} />
        )}
      </div>

      {/* Delete confirmation */}
      {deletingId && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-slate-800 border border-slate-700 rounded-2xl max-w-sm w-full p-6">
            <div className="w-12 h-12 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Trash2 className="w-6 h-6 text-red-400" />
            </div>
            <h3 className="text-xl font-bold text-white text-center mb-2">Delete Material</h3>
            <p className="text-slate-400 text-center mb-6">This will permanently delete the material and its file from storage.</p>
            <div className="flex space-x-3">
              <button onClick={() => setDeletingId(null)} disabled={deleteLoading}
                className="flex-1 px-4 py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors">
                Cancel
              </button>
              <button onClick={handleDeleteMaterial} disabled={deleteLoading}
                className="flex-1 px-4 py-3 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors font-semibold disabled:opacity-60">
                {deleteLoading ? 'Deleting…' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// ─── AnalyticsTab ─────────────────────────────────────────────────────────────

const AnalyticsTab = ({ stats, loading }) => {
  if (loading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {[1, 2, 3, 4].map(i => (
          <div key={i} className="bg-slate-800/50 border border-slate-700 rounded-xl p-6 animate-pulse h-48" />
        ))}
      </div>
    );
  }
  if (!stats) return <div className="text-center text-slate-400 py-12">No stats available</div>;

  const userBreakdown = [
    { label: 'Learners', value: Number(stats.users.learners || 0), color: 'blue' },
    { label: 'Active Trainers', value: Number(stats.users.trainers || 0), color: 'purple' },
    { label: 'Pending Trainers', value: Number(stats.users.pending_trainers || 0), color: 'amber' },
  ];
  const maxUsers = Math.max(...userBreakdown.map(u => u.value), 1);

  const barColor = { blue: 'from-blue-500 to-blue-600', purple: 'from-purple-500 to-purple-600', amber: 'from-amber-500 to-orange-600' };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* User breakdown */}
      <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-6">
        <h3 className="text-xl font-bold text-white mb-6">User Breakdown</h3>
        <div className="space-y-5">
          {userBreakdown.map(({ label, value, color }) => (
            <div key={label}>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-slate-300">{label}</span>
                <span className="text-slate-400 font-semibold">{value.toLocaleString()}</span>
              </div>
              <div className="w-full bg-slate-700 rounded-full h-2.5">
                <div
                  className={`bg-gradient-to-r ${barColor[color]} h-2.5 rounded-full transition-all`}
                  style={{ width: `${(value / maxUsers) * 100}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Key numbers */}
      <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-6">
        <h3 className="text-xl font-bold text-white mb-6">Platform Summary</h3>
        <div className="space-y-4">
          {[
            { label: 'Total Users', value: Number(stats.users.total_users || 0).toLocaleString(), icon: <Users className="w-5 h-5 text-blue-400" /> },
            { label: 'Total Materials', value: Number(stats.materials || 0).toLocaleString(), icon: <BookOpen className="w-5 h-5 text-purple-400" /> },
            { label: 'Total Downloads', value: Number(stats.downloads || 0).toLocaleString(), icon: <Download className="w-5 h-5 text-green-400" /> },
            { label: 'Avg. Rating', value: stats.averageRating ? `${stats.averageRating} / 5.0` : '—', icon: <Star className="w-5 h-5 text-amber-400" /> },
          ].map(({ label, value, icon }) => (
            <div key={label} className="flex items-center justify-between py-2 border-b border-slate-700 last:border-0">
              <div className="flex items-center space-x-3">
                {icon}
                <span className="text-slate-300">{label}</span>
              </div>
              <span className="font-bold text-white">{value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* This week */}
      <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-6 lg:col-span-2">
        <h3 className="text-xl font-bold text-white mb-6">This Week</h3>
        <div className="grid grid-cols-3 gap-6 text-center">
          {[
            { label: 'New Users', value: stats.thisWeek?.new_users || 0, color: 'text-blue-400' },
            { label: 'New Materials', value: stats.thisWeek?.new_materials || 0, color: 'text-purple-400' },
            { label: 'Downloads', value: Number(stats.thisWeek?.week_downloads || 0).toLocaleString(), color: 'text-green-400' },
          ].map(({ label, value, color }) => (
            <div key={label} className="bg-slate-900/50 rounded-xl p-4">
              <div className={`text-3xl font-bold ${color} mb-1`}>{value}</div>
              <div className="text-slate-400 text-sm">{label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// ─── PendingTrainerCard ───────────────────────────────────────────────────────

const PendingTrainerCard = ({ trainer, onApprove, onReject }) => {
  const [showFullBio, setShowFullBio] = useState(false);
  const [approving, setApproving] = useState(false);
  const [rejecting, setRejecting] = useState(false);

  const bio = trainer.profile_bio || 'No bio provided.';
  const expertise = trainer.expertise_areas || '';
  const skills = typeof expertise === 'string'
    ? expertise.split(',').map(s => s.trim()).filter(Boolean)
    : (Array.isArray(expertise) ? expertise : []);

  const handleApprove = async () => {
    setApproving(true);
    await onApprove();
    setApproving(false);
  };

  const handleReject = async () => {
    setRejecting(true);
    await onReject();
    setRejecting(false);
  };

  return (
    <div className="bg-slate-800/50 backdrop-blur-sm border border-amber-500/30 rounded-xl p-6 shadow-lg shadow-amber-500/10">
      <div className="flex items-start justify-between gap-4 mb-4">
        <div className="flex items-start gap-4 flex-1">
          <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center text-white text-xl font-bold flex-shrink-0">
            {initials(trainer.full_name)}
          </div>
          <div className="flex-1">
            <h3 className="text-xl font-bold text-white mb-1">{trainer.full_name}</h3>
            <p className="text-slate-400 text-sm mb-2">{trainer.email}</p>
            <div className="flex items-center space-x-2 text-xs text-slate-500">
              <Clock className="w-3 h-3" />
              <span>Applied {formatDate(trainer.created_at)}</span>
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
          {showFullBio || bio.length <= 120 ? bio : `${bio.substring(0, 120)}…`}
          {bio.length > 120 && (
            <button onClick={() => setShowFullBio(!showFullBio)} className="text-amber-400 hover:text-amber-300 ml-1">
              {showFullBio ? 'Show less' : 'Read more'}
            </button>
          )}
        </p>
      </div>

      {skills.length > 0 && (
        <div className="mb-6">
          <h4 className="text-sm font-semibold text-slate-300 mb-2">Expertise Areas</h4>
          <div className="flex flex-wrap gap-2">
            {skills.map((skill, idx) => (
              <span key={idx} className="px-3 py-1 bg-slate-700 rounded-full text-slate-300 text-sm">{skill}</span>
            ))}
          </div>
        </div>
      )}

      <div className="flex items-center space-x-3">
        <button
          onClick={handleApprove} disabled={approving || rejecting}
          className="flex-1 bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-3 rounded-lg hover:from-green-600 hover:to-green-700 transition-all shadow-lg shadow-green-500/30 font-semibold flex items-center justify-center space-x-2 disabled:opacity-60"
        >
          <UserCheck className="w-5 h-5" />
          <span>{approving ? 'Approving…' : 'Approve Trainer'}</span>
        </button>
        <button
          onClick={handleReject} disabled={approving || rejecting}
          className="flex-1 bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-red-400 hover:text-red-300 px-6 py-3 rounded-lg transition-all font-semibold flex items-center justify-center space-x-2 disabled:opacity-60"
        >
          <XCircle className="w-5 h-5" />
          <span>{rejecting ? 'Rejecting…' : 'Reject'}</span>
        </button>
      </div>
    </div>
  );
};

// ─── AdminStatCard & TabButton ────────────────────────────────────────────────

const AdminStatCard = ({ icon, label, value, subtext, color, alert = false }) => {
  const colorClasses = {
    blue: 'from-blue-500/20 to-blue-600/20 text-blue-400',
    amber: 'from-amber-500/20 to-orange-600/20 text-amber-400',
    purple: 'from-purple-500/20 to-purple-600/20 text-purple-400',
    green: 'from-green-500/20 to-green-600/20 text-green-400',
  };
  return (
    <div className={`bg-slate-800/50 backdrop-blur-sm border rounded-xl p-4 relative ${alert ? 'border-amber-500/50 shadow-lg shadow-amber-500/20' : 'border-slate-700'}`}>
      {alert && (
        <div className="absolute -top-2 -right-2">
          <span className="relative flex h-6 w-6">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
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

const TabButton = ({ active, onClick, icon, label, count, alert = false }) => (
  <button
    onClick={onClick}
    className={`px-4 py-3 font-semibold transition-colors relative flex items-center space-x-2 whitespace-nowrap ${active ? 'text-amber-400' : 'text-slate-400 hover:text-white'}`}
  >
    {icon}
    <span>{label}</span>
    {count !== undefined && (
      <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${alert ? 'bg-amber-500 text-white' : 'bg-slate-700 text-slate-300'}`}>
        {count}
      </span>
    )}
    {active && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-amber-500" />}
  </button>
);

export default AdminPanel;
