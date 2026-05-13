'use client';
import React, { useState, useEffect, useCallback } from 'react';
import {
  Users, UserPlus, Trash2, KeyRound, Edit2, CheckCircle,
  XCircle, Loader2, ShieldCheck, ShieldOff, Hospital, Save, X
} from 'lucide-react';
import api from '@/lib/api';

interface UserRecord {
  id: number;
  username: string;
  email: string | null;
  full_name: string | null;
  role: 'admin' | 'hospital_admin' | 'committee' | 'staff';
  is_active: boolean;
  hospital_id: number | null;
  created_at: string;
}

interface Hospital { id: number; hospital_name: string; }

const ROLE_COLORS: Record<string, string> = {
  admin: 'text-rose-400 bg-rose-500/10 border-rose-500/30',
  hospital_admin: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/30',
  committee: 'text-amber-400 bg-amber-500/10 border-amber-500/30',
  staff: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30',
};

const ROLE_LABELS: Record<string, string> = {
  admin: 'Admin',
  hospital_admin: 'Hospital Admin',
  committee: 'Committee',
  staff: 'Staff',
};

export default function AdminUsersPage() {
  const [users, setUsers] = useState<UserRecord[]>([]);
  const [hospitals, setHospitals] = useState<Hospital[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Create form
  const [showCreate, setShowCreate] = useState(false);
  const [creating, setCreating] = useState(false);
  const [createForm, setCreateForm] = useState({
    username: '', email: '', full_name: '', password: '',
    role: 'staff' as string, hospital_id: '',
  });

  // Edit form
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editForm, setEditForm] = useState<Partial<UserRecord>>({});

  // Password reset
  const [resetUserId, setResetUserId] = useState<number | null>(null);
  const [newPassword, setNewPassword] = useState('');
  const [resetting, setResetting] = useState(false);

  const showSuccess = (msg: string) => {
    setSuccess(msg); setTimeout(() => setSuccess(''), 3500);
  };

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const [uRes, hRes] = await Promise.all([
        api.get('/api/users'),
        api.get('/api/submissions'),
      ]);
      setUsers(uRes.data);
      setHospitals(hRes.data.records || []);
    } catch {
      setError('Failed to load users.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchUsers(); }, [fetchUsers]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreating(true);
    setError('');
    try {
      await api.post('/api/users/create', {
        ...createForm,
        hospital_id: createForm.hospital_id ? parseInt(createForm.hospital_id) : null,
      });
      showSuccess(`User "${createForm.username}" created successfully`);
      setShowCreate(false);
      setCreateForm({ username: '', email: '', full_name: '', password: '', role: 'staff', hospital_id: '' });
      fetchUsers();
    } catch (err: unknown) {
      const e = err as { response?: { data?: { detail?: string } } };
      setError(e.response?.data?.detail || 'Failed to create user');
    } finally {
      setCreating(false);
    }
  };

  const handleUpdate = async (userId: number) => {
    try {
      await api.patch(`/api/users/${userId}`, editForm);
      showSuccess('User updated successfully');
      setEditingId(null);
      fetchUsers();
    } catch (err: unknown) {
      const e = err as { response?: { data?: { detail?: string } } };
      setError(e.response?.data?.detail || 'Failed to update user');
    }
  };

  const handleToggleActive = async (user: UserRecord) => {
    try {
      await api.patch(`/api/users/${user.id}`, { is_active: !user.is_active });
      showSuccess(`User ${user.is_active ? 'deactivated' : 'activated'}`);
      fetchUsers();
    } catch {
      setError('Failed to toggle user status');
    }
  };

  const handleResetPassword = async () => {
    if (!resetUserId || !newPassword) return;
    setResetting(true);
    try {
      await api.post(`/api/users/${resetUserId}/reset-password`, { new_password: newPassword });
      showSuccess('Password reset successfully');
      setResetUserId(null);
      setNewPassword('');
    } catch {
      setError('Failed to reset password');
    } finally {
      setResetting(false);
    }
  };

  const handleDelete = async (user: UserRecord) => {
    if (!confirm(`Delete user "${user.username}"? This cannot be undone.`)) return;
    try {
      await api.delete(`/api/users/${user.id}`);
      showSuccess(`User "${user.username}" deleted`);
      fetchUsers();
    } catch (err: unknown) {
      const e = err as { response?: { data?: { detail?: string } } };
      setError(e.response?.data?.detail || 'Failed to delete user');
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-3">
            <Users className="w-7 h-7 text-cyan-400" /> Staff Management
          </h1>
          <p className="text-slate-400 text-sm mt-1">Create, manage and control access for all staff accounts</p>
        </div>
        <button
          onClick={() => setShowCreate(true)}
          className="hg-btn-primary flex items-center gap-2 text-sm"
        >
          <UserPlus className="w-4 h-4" /> Add Staff
        </button>
      </div>

      {/* Alerts */}
      {error && (
        <div className="mb-4 p-3 rounded-xl text-sm flex items-center gap-2 bg-rose-500/10 text-rose-400 border border-rose-500/30">
          <XCircle className="w-4 h-4 shrink-0" /> {error}
          <button onClick={() => setError('')} className="ml-auto"><X className="w-4 h-4" /></button>
        </div>
      )}
      {success && (
        <div className="mb-4 p-3 rounded-xl text-sm flex items-center gap-2 bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
          <CheckCircle className="w-4 h-4 shrink-0" /> {success}
        </div>
      )}

      {/* Create User Modal */}
      {showCreate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="glass-card rounded-2xl p-8 w-full max-w-lg border border-cyan-500/20">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <UserPlus className="w-5 h-5 text-cyan-400" /> Create Staff Account
              </h2>
              <button onClick={() => setShowCreate(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleCreate} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="hg-label">Username *</label>
                  <input required className="hg-input w-full" placeholder="staff.john"
                    value={createForm.username} onChange={e => setCreateForm(p => ({ ...p, username: e.target.value }))} />
                </div>
                <div>
                  <label className="hg-label">Full Name</label>
                  <input className="hg-input w-full" placeholder="John Doe"
                    value={createForm.full_name} onChange={e => setCreateForm(p => ({ ...p, full_name: e.target.value }))} />
                </div>
              </div>
              <div>
                <label className="hg-label">Email</label>
                <input type="email" className="hg-input w-full" placeholder="john@hospital.com"
                  value={createForm.email} onChange={e => setCreateForm(p => ({ ...p, email: e.target.value }))} />
              </div>
              <div>
                <label className="hg-label">Password * (min. 8 chars)</label>
                <input type="password" required minLength={8} className="hg-input w-full"
                  value={createForm.password} onChange={e => setCreateForm(p => ({ ...p, password: e.target.value }))} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="hg-label">Role *</label>
                  <select className="hg-input w-full" value={createForm.role}
                    onChange={e => setCreateForm(p => ({ ...p, role: e.target.value }))}>
                    <option value="staff">Staff</option>
                    <option value="committee">Committee</option>
                    <option value="hospital_admin">Hospital Admin</option>
                  </select>
                </div>
                <div>
                  <label className="hg-label">Assign Hospital</label>
                  <select className="hg-input w-full" value={createForm.hospital_id}
                    onChange={e => setCreateForm(p => ({ ...p, hospital_id: e.target.value }))}>
                    <option value="">— None —</option>
                    {hospitals.map(h => (
                      <option key={h.id} value={h.id}>{h.hospital_name}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="flex gap-3 pt-2">
                <button type="submit" disabled={creating} className="hg-btn-primary flex-1 flex items-center justify-center gap-2">
                  {creating ? <Loader2 className="w-4 h-4 animate-spin" /> : <UserPlus className="w-4 h-4" />}
                  {creating ? 'Creating...' : 'Create Account'}
                </button>
                <button type="button" onClick={() => setShowCreate(false)}
                  className="px-6 py-3 rounded-xl border border-white/10 text-slate-400 hover:text-white transition-colors">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Password Reset Modal */}
      {resetUserId !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="glass-card rounded-2xl p-8 w-full max-w-md border border-amber-500/20">
            <h2 className="text-xl font-bold text-white flex items-center gap-2 mb-6">
              <KeyRound className="w-5 h-5 text-amber-400" /> Reset Password
            </h2>
            <div className="mb-4">
              <label className="hg-label">New Password (min. 8 chars)</label>
              <input type="password" className="hg-input w-full" minLength={8}
                value={newPassword} onChange={e => setNewPassword(e.target.value)}
                placeholder="Enter new password" />
            </div>
            <div className="flex gap-3">
              <button onClick={handleResetPassword} disabled={resetting || newPassword.length < 8}
                className="hg-btn-primary flex-1 flex items-center justify-center gap-2 disabled:opacity-60">
                {resetting ? <Loader2 className="w-4 h-4 animate-spin" /> : <KeyRound className="w-4 h-4" />}
                {resetting ? 'Resetting...' : 'Reset Password'}
              </button>
              <button onClick={() => { setResetUserId(null); setNewPassword(''); }}
                className="px-6 py-3 rounded-xl border border-white/10 text-slate-400 hover:text-white transition-colors">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Users Table */}
      {loading ? (
        <div className="flex items-center justify-center py-24">
          <Loader2 className="w-8 h-8 text-cyan-400 animate-spin" />
        </div>
      ) : (
        <div className="glass-card rounded-2xl overflow-hidden border border-white/5">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/5">
                  {['User', 'Role', 'Hospital', 'Status', 'Created', 'Actions'].map(h => (
                    <th key={h} className="px-4 py-3 text-left text-[10px] font-black uppercase tracking-widest text-slate-500">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                    <td className="px-4 py-4">
                      {editingId === user.id ? (
                        <div className="space-y-1">
                          <input className="hg-input text-xs w-full" placeholder="Full name"
                            value={editForm.full_name || ''} onChange={e => setEditForm(p => ({ ...p, full_name: e.target.value }))} />
                          <input className="hg-input text-xs w-full" placeholder="Email"
                            value={editForm.email || ''} onChange={e => setEditForm(p => ({ ...p, email: e.target.value }))} />
                        </div>
                      ) : (
                        <div>
                          <p className="text-sm font-semibold text-white">{user.full_name || user.username}</p>
                          <p className="text-xs text-slate-500">{user.username}</p>
                          {user.email && <p className="text-xs text-slate-600">{user.email}</p>}
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-4">
                      {editingId === user.id && user.role !== 'admin' ? (
                        <select className="hg-input text-xs"
                          value={editForm.role || user.role}
                          onChange={e => setEditForm(p => ({ ...p, role: e.target.value as UserRecord['role'] }))}>
                          <option value="staff">Staff</option>
                          <option value="committee">Committee</option>
                          <option value="hospital_admin">Hospital Admin</option>
                        </select>
                      ) : (
                        <span className={`text-[10px] font-black px-2 py-1 rounded-full border ${ROLE_COLORS[user.role] || ''}`}>
                          {ROLE_LABELS[user.role] || user.role}
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-4">
                      {editingId === user.id ? (
                        <select className="hg-input text-xs"
                          value={editForm.hospital_id || ''}
                          onChange={e => setEditForm(p => ({ ...p, hospital_id: e.target.value ? parseInt(e.target.value) : null }))}>
                          <option value="">— None —</option>
                          {hospitals.map(h => <option key={h.id} value={h.id}>{h.hospital_name}</option>)}
                        </select>
                      ) : (
                        <span className="text-xs text-slate-400 flex items-center gap-1">
                          {user.hospital_id ? <><Hospital className="w-3 h-3" /> ID #{user.hospital_id}</> : '—'}
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-4">
                      <span className={`text-[10px] font-black px-2 py-1 rounded-full border ${user.is_active ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30' : 'text-slate-500 bg-slate-500/10 border-slate-500/30'}`}>
                        {user.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-xs text-slate-500">
                      {user.created_at ? new Date(user.created_at).toLocaleDateString() : '—'}
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-1">
                        {editingId === user.id ? (
                          <>
                            <button onClick={() => handleUpdate(user.id)} title="Save"
                              className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20">
                              <Save className="w-4 h-4" />
                            </button>
                            <button onClick={() => setEditingId(null)} title="Cancel"
                              className="p-2 rounded-lg bg-slate-500/10 text-slate-400 hover:bg-slate-500/20">
                              <X className="w-4 h-4" />
                            </button>
                          </>
                        ) : (
                          <>
                            {user.role !== 'admin' && (
                              <button onClick={() => { setEditingId(user.id); setEditForm({ email: user.email || '', full_name: user.full_name || '', role: user.role, hospital_id: user.hospital_id }); }}
                                title="Edit" className="p-2 rounded-lg bg-cyan-500/10 text-cyan-400 hover:bg-cyan-500/20">
                                <Edit2 className="w-4 h-4" />
                              </button>
                            )}
                            <button onClick={() => setResetUserId(user.id)} title="Reset Password"
                              className="p-2 rounded-lg bg-amber-500/10 text-amber-400 hover:bg-amber-500/20">
                              <KeyRound className="w-4 h-4" />
                            </button>
                            {user.role !== 'admin' && (
                              <button onClick={() => handleToggleActive(user)} title={user.is_active ? 'Deactivate' : 'Activate'}
                                className={`p-2 rounded-lg ${user.is_active ? 'bg-slate-500/10 text-slate-400 hover:bg-rose-500/10 hover:text-rose-400' : 'bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20'}`}>
                                {user.is_active ? <ShieldOff className="w-4 h-4" /> : <ShieldCheck className="w-4 h-4" />}
                              </button>
                            )}
                            {user.role !== 'admin' && (
                              <button onClick={() => handleDelete(user)} title="Delete"
                                className="p-2 rounded-lg bg-rose-500/10 text-rose-400 hover:bg-rose-500/20">
                                <Trash2 className="w-4 h-4" />
                              </button>
                            )}
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {users.length === 0 && (
              <div className="py-16 text-center text-slate-500">
                <Users className="w-10 h-10 mx-auto mb-3 opacity-30" />
                <p>No users found. Create the first staff account.</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
