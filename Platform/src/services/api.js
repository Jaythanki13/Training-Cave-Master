const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

function getToken() {
  return localStorage.getItem('tc_token');
}

async function request(path, options = {}) {
  const token = getToken();
  const headers = { 'Content-Type': 'application/json', ...options.headers };
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const res = await fetch(`${BASE_URL}${path}`, { ...options, headers });
  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    const err = new Error(data.error || data.message || 'Request failed');
    err.status = res.status;
    throw err;
  }
  return data;
}

// Multipart (file upload) — no Content-Type so browser sets boundary
async function upload(path, formData) {
  const token = getToken();
  const headers = {};
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const res = await fetch(`${BASE_URL}${path}`, {
    method: 'POST',
    headers,
    body: formData,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const err = new Error(data.error || data.message || 'Upload failed');
    err.status = res.status;
    throw err;
  }
  return data;
}

export const auth = {
  login: (email, password) =>
    request('/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) }),

  register: (payload) =>
    request('/auth/register', { method: 'POST', body: JSON.stringify(payload) }),

  getProfile: () => request('/auth/profile'),

  updateProfile: (payload) =>
    request('/auth/profile', { method: 'PUT', body: JSON.stringify(payload) }),

  changePassword: (currentPassword, newPassword) =>
    request('/auth/change-password', {
      method: 'PUT',
      body: JSON.stringify({ currentPassword, newPassword }),
    }),
};

export const materials = {
  getAll: (params = {}) => {
    const qs = new URLSearchParams(params).toString();
    return request(`/materials${qs ? `?${qs}` : ''}`);
  },

  getById: (id) => request(`/materials/${id}`),

  getMine: () => request('/materials/my/materials'),

  getCategories: () => request('/materials/categories'),

  upload: (formData) => upload('/materials', formData),

  update: (id, payload) =>
    request(`/materials/${id}`, { method: 'PUT', body: JSON.stringify(payload) }),

  delete: (id) => request(`/materials/${id}`, { method: 'DELETE' }),

  getDownloadUrl: (id) => request(`/materials/${id}/download`),
};

export const admin = {
  getStats: () => request('/admin/stats'),

  getPendingTrainers: () => request('/admin/trainers/pending'),

  approveTrainer: (id) =>
    request(`/admin/trainers/${id}/approve`, { method: 'POST' }),

  rejectTrainer: (id) =>
    request(`/admin/trainers/${id}/reject`, { method: 'POST' }),

  getUsers: (params = {}) => {
    const qs = new URLSearchParams(params).toString();
    return request(`/admin/users${qs ? `?${qs}` : ''}`);
  },

  banUser: (id) => request(`/admin/users/${id}/ban`, { method: 'POST' }),

  unbanUser: (id) => request(`/admin/users/${id}/unban`, { method: 'POST' }),

  getMaterials: () => request('/admin/materials'),

  deleteMaterial: (id) => request(`/admin/materials/${id}`, { method: 'DELETE' }),
};
