import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Shield, Users, BookOpen, Download, TrendingUp, CheckCircle, XCircle,
  Clock, Search, Trash2, UserCheck, UserX, BarChart3, Calendar,
  AlertTriangle, LogOut, AlertCircle, Star, FileText, Plus,
  Upload, X, Video, Music, Archive
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { admin as adminApi, materials as materialsApi } from '../services/api';

// ─── helpers ─────────────────────────────────────────────────────────────────

function formatDate(iso) {
  if (!iso) return '—';
  return new Date(iso).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
}

function initials(name = '') {
  return name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2) || '?';
}

const inputCls = 'w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-3 text-slate-900 text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent transition-colors';

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
  const [showCreateTrainer, setShowCreateTrainer] = useState(false);
  const [showUploadOnBehalf, setShowUploadOnBehalf] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(searchQuery), 400);
    return () => clearTimeout(t);
  }, [searchQuery]);

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

  useEffect(() => {
    if (selectedTab !== 'all-users') return;
    setUsersLoading(true);
    const params = debouncedSearch ? { search: debouncedSearch } : {};
    adminApi.getUsers(params)
      .then(data => setAllUsers(data.users || []))
      .catch(() => {})
      .finally(() => setUsersLoading(false));
  }, [selectedTab, debouncedSearch]);

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
      alert(err.message || `Failed to ${isBanned ? 'unban' : 'ban'} user`);
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
              <span className="flex items-center gap-1.5 px-2.5 py-1 bg-violet-100 border border-violet-200 rounded-lg text-violet-700 text-xs font-semibold">
                <Shield className="w-3.5 h-3.5" />
                <span>Admin</span>
              </span>
            </div>
            <div className="flex items-center gap-3">
              <span className="hidden sm:block text-xs text-slate-500 truncate max-w-[160px]">{user?.email}</span>
              <div className="w-9 h-9 bg-gradient-to-br from-violet-500 to-violet-600 rounded-full flex items-center justify-center text-white font-semibold text-sm flex-shrink-0">
                {initials(user?.full_name)}
              </div>
              <button onClick={handleLogout} className="p-1.5 text-slate-400 hover:text-slate-700 transition-colors" title="Sign out">
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-1">Admin Dashboard</h1>
          <p className="text-slate-500">Monitor platform activity and manage users</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <AdminStatCard
            icon={<Users className="w-5 h-5" />}
            label="Total Users"
            value={statsLoading ? '…' : Number(stats?.users?.total_users || 0).toLocaleString()}
            subtext={stats ? `${stats.users.trainers} trainers · ${stats.users.learners} learners` : ''}
            iconBg="bg-sky-100" iconColor="text-sky-600"
          />
          <AdminStatCard
            icon={<Clock className="w-5 h-5" />}
            label="Pending Approvals"
            value={statsLoading ? '…' : (stats?.users?.pending_trainers || 0)}
            subtext="Trainer applications"
            iconBg="bg-amber-100" iconColor="text-amber-600"
            alert={pendingCount > 0}
          />
          <AdminStatCard
            icon={<BookOpen className="w-5 h-5" />}
            label="Total Materials"
            value={statsLoading ? '…' : (stats?.materials || 0)}
            subtext={stats ? `+${stats.thisWeek?.new_materials || 0} this week` : ''}
            iconBg="bg-violet-100" iconColor="text-violet-600"
          />
          <AdminStatCard
            icon={<Download className="w-5 h-5" />}
            label="Total Downloads"
            value={statsLoading ? '…' : Number(stats?.downloads || 0).toLocaleString()}
            subtext={stats ? `+${stats.thisWeek?.week_downloads || 0} this week` : ''}
            iconBg="bg-emerald-100" iconColor="text-emerald-600"
          />
        </div>

        {/* Tabs */}
        <div className="flex gap-1 mb-6 border-b border-slate-200 overflow-x-auto">
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
                  <div key={i} className="bg-white border border-slate-200 rounded-2xl p-6 animate-pulse shadow-sm">
                    <div className="flex gap-4">
                      <div className="w-16 h-16 bg-slate-200 rounded-full flex-shrink-0" />
                      <div className="flex-1 space-y-3">
                        <div className="h-5 bg-slate-200 rounded-lg w-1/3" />
                        <div className="h-4 bg-slate-200 rounded-lg w-1/4" />
                        <div className="h-4 bg-slate-200 rounded-lg w-2/3" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
            {!trainersLoading && pendingTrainers.length === 0 && (
              <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center shadow-sm">
                <div className="w-16 h-16 bg-emerald-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-8 h-8 text-emerald-500" />
                </div>
                <h3 className="text-xl font-semibold text-slate-900 mb-2">All caught up!</h3>
                <p className="text-slate-500">No pending trainer applications at the moment.</p>
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
            <div className="flex gap-3 mb-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder="Search users by name or email..."
                  className={`${inputCls} pl-10`}
                />
              </div>
              <button
                onClick={() => setShowCreateTrainer(true)}
                className="flex items-center gap-2 bg-gradient-to-r from-amber-500 to-orange-600 text-white px-5 py-3 rounded-xl hover:from-amber-600 hover:to-orange-700 transition-all font-semibold shadow-sm hover:shadow-md whitespace-nowrap"
              >
                <Plus className="w-5 h-5" />
                <span>Create Trainer</span>
              </button>
            </div>
            <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-slate-50 border-b border-slate-200">
                    <tr>
                      {['User', 'Role', 'Status', 'Joined', 'Last Login', 'Actions'].map(h => (
                        <th key={h} className={`px-5 py-3.5 text-xs font-semibold text-slate-600 uppercase tracking-wide ${h === 'Actions' ? 'text-right' : 'text-left'}`}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {usersLoading && (
                      <tr><td colSpan={6} className="px-5 py-8 text-center text-slate-400 text-sm">Loading users…</td></tr>
                    )}
                    {!usersLoading && allUsers.length === 0 && (
                      <tr><td colSpan={6} className="px-5 py-8 text-center text-slate-400 text-sm">No users found</td></tr>
                    )}
                    {!usersLoading && allUsers.map(u => (
                      <tr key={u.id} className="hover:bg-slate-50 transition-colors">
                        <td className="px-5 py-4">
                          <div className="font-semibold text-slate-900 text-sm">{u.full_name}</div>
                          <div className="text-xs text-slate-400 mt-0.5">{u.email}</div>
                        </td>
                        <td className="px-5 py-4">
                          <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                            u.role === 'trainer'     ? 'bg-violet-100 text-violet-700'
                            : u.role === 'super_admin' ? 'bg-red-100 text-red-700'
                            : 'bg-sky-100 text-sky-700'
                          }`}>
                            {u.role}
                          </span>
                        </td>
                        <td className="px-5 py-4">
                          <span className={`flex items-center gap-1.5 w-fit text-xs font-medium ${
                            u.status === 'active' ? 'text-emerald-600'
                            : u.status === 'banned' ? 'text-red-600'
                            : 'text-amber-600'
                          }`}>
                            {u.status === 'active' ? <CheckCircle className="w-3.5 h-3.5" />
                             : u.status === 'banned' ? <XCircle className="w-3.5 h-3.5" />
                             : <Clock className="w-3.5 h-3.5" />}
                            <span className="capitalize">{u.status}</span>
                          </span>
                        </td>
                        <td className="px-5 py-4 text-xs text-slate-500">{formatDate(u.created_at)}</td>
                        <td className="px-5 py-4 text-xs text-slate-500">{formatDate(u.last_login) || 'Never'}</td>
                        <td className="px-5 py-4 text-right">
                          {u.role !== 'super_admin' && (
                            <button
                              onClick={() => handleToggleBan(u)}
                              className={`p-2 rounded-xl transition-colors border ${
                                u.status === 'banned'
                                  ? 'bg-emerald-50 hover:bg-emerald-100 text-emerald-600 border-emerald-200'
                                  : 'bg-red-50 hover:bg-red-100 text-red-500 border-red-200'
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
          </div>
        )}

        {/* ── All Materials ── */}
        {selectedTab === 'all-materials' && (
          <div className="space-y-4">
            <div className="flex justify-end">
              <button
                onClick={() => setShowUploadOnBehalf(true)}
                className="flex items-center gap-2 bg-gradient-to-r from-amber-500 to-orange-600 text-white px-5 py-3 rounded-xl hover:from-amber-600 hover:to-orange-700 transition-all font-semibold shadow-sm hover:shadow-md"
              >
                <Upload className="w-5 h-5" />
                <span>Upload on Behalf of Trainer</span>
              </button>
            </div>
            {materialsLoading && (
              <div className="space-y-4">
                {[1, 2, 3].map(i => (
                  <div key={i} className="bg-white border border-slate-200 rounded-2xl p-6 animate-pulse shadow-sm">
                    <div className="h-5 bg-slate-200 rounded-lg w-1/2 mb-3" />
                    <div className="h-4 bg-slate-200 rounded-lg w-1/3" />
                  </div>
                ))}
              </div>
            )}
            {!materialsLoading && allMaterials.length === 0 && (
              <div className="text-center py-12 text-slate-400 text-sm">No materials found</div>
            )}
            {!materialsLoading && allMaterials.map(material => (
              <div key={material.id} className="bg-white border border-slate-200 rounded-2xl p-5 hover:shadow-md transition-all shadow-sm">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-start justify-between gap-3 mb-2">
                      <h3 className="text-base font-semibold text-slate-900 leading-snug">{material.title}</h3>
                      <span className="text-xs text-slate-500 bg-slate-100 px-2.5 py-1 rounded-lg whitespace-nowrap">
                        {material.category_name}
                      </span>
                    </div>
                    <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500">
                      <span className="flex items-center gap-1">
                        <Users className="w-3.5 h-3.5" />
                        <span>{material.trainer_name}</span>
                      </span>
                      <span className="flex items-center gap-1">
                        <FileText className="w-3.5 h-3.5" />
                        <span>{(material.file_type || '?').toUpperCase()}</span>
                      </span>
                      <span className="flex items-center gap-1">
                        <Download className="w-3.5 h-3.5" />
                        <span>{material.download_count ?? 0} downloads</span>
                      </span>
                      {material.rating_avg > 0 && (
                        <span className="flex items-center gap-1">
                          <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                          <span>{Number(material.rating_avg).toFixed(1)}</span>
                        </span>
                      )}
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5" />
                        <span>{formatDate(material.uploaded_at)}</span>
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => setDeletingId(material.id)}
                    className="p-2 bg-red-50 hover:bg-red-100 rounded-xl transition-colors text-red-500 border border-red-200 flex-shrink-0"
                    title="Delete material"
                  >
                    <Trash2 className="w-4 h-4" />
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

      {/* Create Trainer Modal */}
      {showCreateTrainer && (
        <CreateTrainerModal
          onClose={() => setShowCreateTrainer(false)}
          onSuccess={(newUser) => {
            setAllUsers(prev => [newUser, ...prev]);
            setShowCreateTrainer(false);
          }}
        />
      )}

      {/* Upload on Behalf Modal */}
      {showUploadOnBehalf && (
        <UploadOnBehalfModal
          onClose={() => setShowUploadOnBehalf(false)}
          onSuccess={(material) => {
            setAllMaterials(prev => [material, ...prev]);
            setShowUploadOnBehalf(false);
          }}
        />
      )}

      {/* Delete confirmation */}
      {deletingId && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white border border-slate-200 rounded-2xl shadow-2xl max-w-sm w-full p-6">
            <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center mx-auto mb-4">
              <Trash2 className="w-6 h-6 text-red-500" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 text-center mb-2">Delete Material</h3>
            <p className="text-slate-500 text-sm text-center mb-6">This will permanently delete the material and its file from storage.</p>
            <div className="flex gap-3">
              <button onClick={() => setDeletingId(null)} disabled={deleteLoading}
                className="flex-1 px-4 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl transition-colors font-medium">
                Cancel
              </button>
              <button onClick={handleDeleteMaterial} disabled={deleteLoading}
                className="flex-1 px-4 py-3 bg-red-500 hover:bg-red-600 text-white rounded-xl transition-colors font-semibold disabled:opacity-60">
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
          <div key={i} className="bg-white border border-slate-200 rounded-2xl p-6 animate-pulse shadow-sm h-48" />
        ))}
      </div>
    );
  }
  if (!stats) return <div className="text-center text-slate-400 py-12 text-sm">No stats available</div>;

  const userBreakdown = [
    { label: 'Learners',         value: Number(stats.users.learners || 0),         barCls: 'from-sky-500 to-sky-600' },
    { label: 'Active Trainers',  value: Number(stats.users.trainers || 0),          barCls: 'from-violet-500 to-violet-600' },
    { label: 'Pending Trainers', value: Number(stats.users.pending_trainers || 0),  barCls: 'from-amber-500 to-orange-500' },
  ];
  const maxUsers = Math.max(...userBreakdown.map(u => u.value), 1);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* User breakdown */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
        <h3 className="text-lg font-bold text-slate-900 mb-6">User Breakdown</h3>
        <div className="space-y-5">
          {userBreakdown.map(({ label, value, barCls }) => (
            <div key={label}>
              <div className="flex justify-between text-sm mb-1.5">
                <span className="text-slate-700">{label}</span>
                <span className="text-slate-500 font-semibold">{value.toLocaleString()}</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2.5">
                <div
                  className={`bg-gradient-to-r ${barCls} h-2.5 rounded-full transition-all`}
                  style={{ width: `${(value / maxUsers) * 100}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Platform summary */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
        <h3 className="text-lg font-bold text-slate-900 mb-6">Platform Summary</h3>
        <div className="space-y-1">
          {[
            { label: 'Total Users',     value: Number(stats.users.total_users || 0).toLocaleString(), icon: <Users className="w-5 h-5 text-sky-500" /> },
            { label: 'Total Materials', value: Number(stats.materials || 0).toLocaleString(),          icon: <BookOpen className="w-5 h-5 text-violet-500" /> },
            { label: 'Total Downloads', value: Number(stats.downloads || 0).toLocaleString(),          icon: <Download className="w-5 h-5 text-emerald-500" /> },
            { label: 'Avg. Rating',     value: stats.averageRating ? `${stats.averageRating} / 5.0` : '—', icon: <Star className="w-5 h-5 text-amber-500" /> },
          ].map(({ label, value, icon }) => (
            <div key={label} className="flex items-center justify-between py-3 border-b border-slate-100 last:border-0">
              <div className="flex items-center gap-3">
                {icon}
                <span className="text-slate-700 text-sm">{label}</span>
              </div>
              <span className="font-bold text-slate-900 text-sm">{value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* This week */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm lg:col-span-2">
        <h3 className="text-lg font-bold text-slate-900 mb-6">This Week</h3>
        <div className="grid grid-cols-3 gap-6 text-center">
          {[
            { label: 'New Users',     value: stats.thisWeek?.new_users || 0,                                  color: 'text-sky-600',     bg: 'bg-sky-50' },
            { label: 'New Materials', value: stats.thisWeek?.new_materials || 0,                              color: 'text-violet-600',  bg: 'bg-violet-50' },
            { label: 'Downloads',     value: Number(stats.thisWeek?.week_downloads || 0).toLocaleString(),    color: 'text-emerald-600', bg: 'bg-emerald-50' },
          ].map(({ label, value, color, bg }) => (
            <div key={label} className={`${bg} rounded-2xl p-5`}>
              <div className={`text-3xl font-bold ${color} mb-1`}>{value}</div>
              <div className="text-slate-500 text-sm">{label}</div>
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

  const handleApprove = async () => { setApproving(true); await onApprove(); setApproving(false); };
  const handleReject  = async () => { setRejecting(true); await onReject();  setRejecting(false); };

  return (
    <div className="bg-white border border-amber-200 rounded-2xl p-6 shadow-sm">
      <div className="flex items-start justify-between gap-4 mb-4">
        <div className="flex items-start gap-4 flex-1 min-w-0">
          <div className="w-14 h-14 bg-gradient-to-br from-violet-500 to-violet-600 rounded-full flex items-center justify-center text-white text-lg font-bold flex-shrink-0">
            {initials(trainer.full_name)}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-bold text-slate-900 mb-0.5 truncate">{trainer.full_name}</h3>
            <p className="text-slate-500 text-sm mb-1 truncate">{trainer.email}</p>
            <div className="flex items-center gap-1.5 text-xs text-slate-400">
              <Clock className="w-3 h-3" />
              <span>Applied {formatDate(trainer.created_at)}</span>
            </div>
          </div>
        </div>
        <span className="px-2.5 py-1 bg-amber-100 border border-amber-200 rounded-lg text-amber-700 text-xs font-semibold whitespace-nowrap flex-shrink-0">
          Pending Review
        </span>
      </div>

      <div className="mb-4">
        <h4 className="text-xs font-semibold text-slate-600 uppercase tracking-wide mb-2">Bio</h4>
        <p className="text-slate-600 text-sm leading-relaxed">
          {showFullBio || bio.length <= 120 ? bio : `${bio.substring(0, 120)}…`}
          {bio.length > 120 && (
            <button onClick={() => setShowFullBio(!showFullBio)} className="text-amber-600 hover:text-amber-700 ml-1 font-medium">
              {showFullBio ? 'Show less' : 'Read more'}
            </button>
          )}
        </p>
      </div>

      {skills.length > 0 && (
        <div className="mb-6">
          <h4 className="text-xs font-semibold text-slate-600 uppercase tracking-wide mb-2">Expertise Areas</h4>
          <div className="flex flex-wrap gap-2">
            {skills.map((skill, idx) => (
              <span key={idx} className="px-3 py-1 bg-slate-100 rounded-full text-slate-700 text-sm">{skill}</span>
            ))}
          </div>
        </div>
      )}

      <div className="flex items-center gap-3">
        <button
          onClick={handleApprove} disabled={approving || rejecting}
          className="flex-1 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white px-6 py-3 rounded-xl hover:from-emerald-600 hover:to-emerald-700 transition-all font-semibold flex items-center justify-center gap-2 disabled:opacity-60 shadow-sm"
        >
          <UserCheck className="w-5 h-5" />
          <span>{approving ? 'Approving…' : 'Approve Trainer'}</span>
        </button>
        <button
          onClick={handleReject} disabled={approving || rejecting}
          className="flex-1 bg-red-50 hover:bg-red-100 border border-red-200 text-red-600 px-6 py-3 rounded-xl transition-all font-semibold flex items-center justify-center gap-2 disabled:opacity-60"
        >
          <XCircle className="w-5 h-5" />
          <span>{rejecting ? 'Rejecting…' : 'Reject'}</span>
        </button>
      </div>
    </div>
  );
};

// ─── AdminStatCard & TabButton ────────────────────────────────────────────────

const AdminStatCard = ({ icon, label, value, subtext, iconBg, iconColor, alert = false }) => (
  <div className={`bg-white border rounded-2xl p-4 shadow-sm relative ${alert ? 'border-amber-300' : 'border-slate-200'}`}>
    {alert && (
      <div className="absolute -top-2 -right-2">
        <span className="relative flex h-6 w-6">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
          <span className="relative inline-flex rounded-full h-6 w-6 bg-amber-500 items-center justify-center shadow-sm">
            <AlertTriangle className="w-3.5 h-3.5 text-white" />
          </span>
        </span>
      </div>
    )}
    <div className={`w-10 h-10 ${iconBg} rounded-xl flex items-center justify-center ${iconColor} mb-3`}>
      {icon}
    </div>
    <div className="text-2xl font-bold text-slate-900 mb-0.5">{value}</div>
    <div className="text-xs text-slate-500 font-medium">{label}</div>
    {subtext && <div className="text-xs text-slate-400 mt-0.5">{subtext}</div>}
  </div>
);

// ─── CreateTrainerModal ───────────────────────────────────────────────────────

const CreateTrainerModal = ({ onClose, onSuccess }) => {
  const [formData, setFormData] = useState({ fullName: '', email: '', password: '', bio: '', expertise: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const set = (k, v) => setFormData(p => ({ ...p, [k]: v }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const data = await adminApi.createTrainer(formData);
      onSuccess(data.user);
    } catch (err) {
      setError(err.message || 'Failed to create trainer');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white border border-slate-200 rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-slate-200 px-6 py-4 flex justify-between items-center">
          <h2 className="text-xl font-bold text-slate-900">Create Trainer Account</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-700 transition-colors"><X className="w-5 h-5" /></button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="flex items-center gap-2 bg-red-50 border border-red-200 rounded-xl px-4 py-3">
              <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
              <span className="text-sm text-red-600">{error}</span>
            </div>
          )}
          <div className="bg-sky-50 border border-sky-200 rounded-xl p-4">
            <p className="text-sm text-sky-800">
              The account will be <span className="text-emerald-600 font-semibold">immediately active</span> — no approval needed.
              Share the credentials and ask the trainer to change their password after first login.
            </p>
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">Full Name *</label>
            <input type="text" value={formData.fullName} onChange={e => set('fullName', e.target.value)}
              className={inputCls} placeholder="e.g. Sarah Johnson" required />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">Email *</label>
            <input type="email" value={formData.email} onChange={e => set('email', e.target.value)}
              className={inputCls} placeholder="trainer@example.com" required />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">Temporary Password *</label>
            <input type="text" value={formData.password} onChange={e => set('password', e.target.value)}
              className={inputCls} placeholder="min 6 characters" minLength={6} required />
            <p className="text-xs text-slate-400 mt-1">Share this — they should change it after first login.</p>
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">Expertise Areas (Optional)</label>
            <input type="text" value={formData.expertise} onChange={e => set('expertise', e.target.value)}
              className={inputCls} placeholder="e.g. Leadership, Soft Skills, Python" />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">Bio (Optional)</label>
            <textarea value={formData.bio} onChange={e => set('bio', e.target.value)}
              className={`${inputCls} resize-none`} rows="2"
              placeholder="Brief background about the trainer..." />
          </div>
          <div className="flex justify-end gap-3 pt-1">
            <button type="button" onClick={onClose}
              className="px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl transition-colors font-medium">Cancel</button>
            <button type="submit" disabled={loading}
              className="px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-600 text-white rounded-xl hover:from-amber-600 hover:to-orange-700 transition-all font-semibold disabled:opacity-60">
              {loading ? 'Creating…' : 'Create Trainer'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// ─── UploadOnBehalfModal ──────────────────────────────────────────────────────

const UploadOnBehalfModal = ({ onClose, onSuccess }) => {
  const [trainers, setTrainers] = useState([]);
  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState({
    trainerId: '', title: '', description: '', categoryId: '',
    tags: '', trainingDate: '', trainingType: 'delivered', file: null,
  });
  const [dragActive, setDragActive] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const set = (k, v) => setFormData(p => ({ ...p, [k]: v }));

  useEffect(() => {
    adminApi.getActiveTrainers().then(d => setTrainers(d.users || [])).catch(() => {});
    materialsApi.getCategories().then(d => setCategories(d.categories || [])).catch(() => {});
  }, []);

  const handleDrag = (e) => { e.preventDefault(); e.stopPropagation(); setDragActive(e.type === 'dragenter' || e.type === 'dragover'); };
  const handleDrop = (e) => { e.preventDefault(); e.stopPropagation(); setDragActive(false); if (e.dataTransfer.files?.[0]) set('file', e.dataTransfer.files[0]); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.file) { setError('Please select a file'); return; }
    if (!formData.trainerId) { setError('Please select a trainer'); return; }
    if (!formData.categoryId) { setError('Please select a category'); return; }
    setError(''); setUploading(true);
    try {
      const fd = new FormData();
      ['file','title','description','categoryId','tags','trainingDate','trainingType','trainerId']
        .forEach(k => fd.append(k, formData[k]));
      const data = await materialsApi.upload(fd);
      onSuccess(data.material || {});
    } catch (err) {
      setError(err.message || 'Upload failed. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const selectedTrainer = trainers.find(t => t.id === formData.trainerId);

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white border border-slate-200 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-slate-200 px-6 py-4 flex justify-between items-center">
          <h2 className="text-xl font-bold text-slate-900">Upload on Behalf of Trainer</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-700 transition-colors"><X className="w-5 h-5" /></button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {error && (
            <div className="flex items-center gap-2 bg-red-50 border border-red-200 rounded-xl px-4 py-3">
              <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
              <span className="text-sm text-red-600">{error}</span>
            </div>
          )}

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">Assign to Trainer *</label>
            <select value={formData.trainerId} onChange={e => set('trainerId', e.target.value)} className={inputCls} required>
              <option value="">Select a trainer</option>
              {trainers.map(t => <option key={t.id} value={t.id}>{t.full_name} — {t.email}</option>)}
            </select>
            {selectedTrainer && (
              <p className="text-xs text-emerald-600 mt-1 font-medium">
                ✓ Material will appear under {selectedTrainer.full_name}'s account
              </p>
            )}
          </div>

          <div onDragEnter={handleDrag} onDragLeave={handleDrag} onDragOver={handleDrag} onDrop={handleDrop}
            className={`border-2 border-dashed rounded-2xl p-8 text-center transition-all ${
              dragActive ? 'border-amber-400 bg-amber-50'
              : formData.file ? 'border-emerald-400 bg-emerald-50'
              : 'border-slate-300 bg-slate-50 hover:border-amber-300 hover:bg-amber-50/30'
            }`}>
            <input type="file" id="behalf-file-upload" onChange={e => set('file', e.target.files?.[0] || null)}
              className="hidden" accept=".pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx,.mp4,.mp3,.zip" />
            {formData.file ? (
              <div className="space-y-2">
                <CheckCircle className="w-12 h-12 text-emerald-500 mx-auto" />
                <p className="text-slate-900 font-semibold">{formData.file.name}</p>
                <p className="text-sm text-slate-500">{(formData.file.size / 1048576).toFixed(2)} MB</p>
                <button type="button" onClick={() => set('file', null)} className="text-sm text-red-500 hover:text-red-600 font-medium">Remove file</button>
              </div>
            ) : (
              <div className="space-y-3">
                <Upload className="w-12 h-12 text-slate-400 mx-auto" />
                <div>
                  <label htmlFor="behalf-file-upload" className="text-amber-600 hover:text-amber-700 cursor-pointer font-semibold">Click to upload</label>
                  <span className="text-slate-500"> or drag and drop</span>
                </div>
                <p className="text-sm text-slate-400">PDF, DOCX, PPTX, XLSX, MP4, MP3, ZIP (max 1GB)</p>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Title *</label>
              <input type="text" value={formData.title} onChange={e => set('title', e.target.value)}
                className={inputCls} placeholder="e.g. Leadership Skills Workshop 2024" required />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Description *</label>
              <textarea value={formData.description} onChange={e => set('description', e.target.value)}
                className={`${inputCls} resize-none`} rows="3"
                placeholder="Describe what learners will gain..." required />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Category *</label>
              <select value={formData.categoryId} onChange={e => set('categoryId', e.target.value)} className={inputCls} required>
                <option value="">Select a category</option>
                {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Tags (Optional)</label>
              <input type="text" value={formData.tags} onChange={e => set('tags', e.target.value)}
                className={inputCls} placeholder="leadership, communication" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Training Date *</label>
              <input type="date" value={formData.trainingDate} onChange={e => set('trainingDate', e.target.value)}
                className={inputCls} required />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Training Type *</label>
              <select value={formData.trainingType} onChange={e => set('trainingType', e.target.value)} className={inputCls} required>
                <option value="delivered">Already Delivered</option>
                <option value="upcoming">Upcoming</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-1">
            <button type="button" onClick={onClose}
              className="px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl transition-colors font-medium">Cancel</button>
            <button type="submit"
              disabled={uploading || !formData.file || !formData.trainerId || !formData.title || !formData.description || !formData.categoryId}
              className="px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-600 text-white rounded-xl hover:from-amber-600 hover:to-orange-700 transition-all font-semibold disabled:opacity-50 disabled:cursor-not-allowed">
              {uploading ? 'Uploading…' : 'Upload Material'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const TabButton = ({ active, onClick, icon, label, count, alert = false }) => (
  <button
    onClick={onClick}
    className={`px-4 py-3 font-semibold text-sm transition-colors relative flex items-center gap-2 whitespace-nowrap ${
      active ? 'text-amber-600' : 'text-slate-500 hover:text-slate-900'
    }`}
  >
    {icon}
    <span>{label}</span>
    {count !== undefined && (
      <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${alert ? 'bg-amber-500 text-white' : 'bg-slate-100 text-slate-600'}`}>
        {count}
      </span>
    )}
    {active && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-amber-500 rounded-t" />}
  </button>
);

export default AdminPanel;
