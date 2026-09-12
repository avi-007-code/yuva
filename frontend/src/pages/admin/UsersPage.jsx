import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, User, Trash2, Eye, RefreshCw, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import adminApi from '../../api/adminApi';
import DataTable from '../../components/admin/DataTable';
import LoadingSpinner from '../../components/admin/LoadingSpinner';
import EmptyState from '../../components/admin/EmptyState';
import DeleteOtpModal from '../../components/admin/DeleteOtpModal';

const UsersPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');

  const [userToDelete, setUserToDelete] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await adminApi.getAllUsers();
      setUsers(res.data || []);
    } catch (err) {
      setError('Unable to load users. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = users.filter((u) => {
    const term = search.toLowerCase().trim();
    if (!term) return true;
    return (
      (u.name && u.name.toLowerCase().includes(term)) ||
      (u.email && u.email.toLowerCase().includes(term)) ||
      (u.role && u.role.toLowerCase().includes(term))
    );
  });

  const columns = [
    {
      header: 'User Name',
      render: (user) => (
        <div className="flex items-center gap-3">
          <div className="w-7 h-7 rounded bg-[#FAF9F7] border border-[#E7E5E4] text-[#B08D57] flex items-center justify-center font-serif text-xs font-semibold">
            {user.name?.charAt(0).toUpperCase() || 'U'}
          </div>
          <div>
            <p className="font-semibold text-[#1C1B1F] text-xs sm:text-sm">{user.name}</p>
            <p className="text-xs text-[#8E8B85] font-normal">{user.email}</p>
          </div>
        </div>
      ),
    },
    {
      header: 'Role',
      render: (user) => (
        <span
          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
            user.role === 'ADMIN'
              ? 'bg-[#F0EFEF] text-[#4A4950] border border-[#D8D7DC]'
              : 'bg-[#F9F8F6] text-[#6B6966] border border-[#E7E5E4]'
          }`}
        >
          {user.role}
        </span>
      ),
    },
    {
      header: 'Status',
      render: (user) => (
        <span
          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
            user.isActive
              ? 'bg-[#EBF3ED] text-[#2E5A44] border border-[#D1E3D7]'
              : 'bg-[#FAF4E8] text-[#8A6421] border border-[#EEDFA8]'
          }`}
        >
          {user.isActive ? 'Active' : 'Pending Invite'}
        </span>
      ),
    },
    {
      header: 'Created Date',
      render: (user) => (
        <span className="text-xs text-[#6B6966]">
          {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
        </span>
      ),
    },
    {
      header: 'Actions',
      align: 'right',
      render: (user) => (
        <div className="flex items-center justify-end gap-1.5">
          <Link
            to={`/admin/users/${user.id}`}
            className="p-1.5 text-[#6B6966] hover:text-[#1C1B1F] hover:bg-[#FAF9F7] rounded transition-colors"
            title="View User Details"
          >
            <Eye className="w-4 h-4" />
          </Link>
          <button
            onClick={() => setUserToDelete(user)}
            className="p-1.5 text-[#8B3A3A] hover:bg-[#FDF2F2] rounded transition-colors"
            title="Delete User"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className="space-y-6 font-sans"
    >
      {/* Header & Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-serif font-normal text-[#1C1B1F] tracking-tight">
            User Management
          </h1>
          <p className="text-xs sm:text-sm text-[#6B6966]">
            View and manage registered accounts and manager invitations.
          </p>
        </div>
        <button
          onClick={fetchUsers}
          className="self-start sm:self-auto px-3.5 py-1.5 bg-[#F2F0EC] hover:bg-[#E7E5E4] text-[#38373A] text-xs font-medium rounded border border-[#E7E5E4] transition-colors flex items-center gap-1.5"
        >
          <RefreshCw className="w-3.5 h-3.5 text-[#6B6966]" /> Refresh List
        </button>
      </div>

      {/* Search Input */}
      <div className="relative max-w-md">
        <Search className="w-4 h-4 text-[#8E8B85] absolute left-3 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          placeholder="Search by name, email, or role..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-9 pr-4 py-2 bg-white border border-[#D8D7DC] rounded text-[#1C1B1F] text-xs sm:text-sm placeholder-[#A8A5A0] focus:outline-none focus:border-[#B08D57] transition-colors"
        />
      </div>

      {error && (
        <div className="p-4 bg-[#FDF2F2] border border-[#F3CECE] text-[#8B3A3A] rounded text-xs flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4" />
            <span>{error}</span>
          </div>
          <button
            onClick={fetchUsers}
            className="px-3 py-1 bg-[#F9E2E2] hover:bg-[#F3CECE] rounded text-xs font-medium"
          >
            Retry
          </button>
        </div>
      )}

      {/* Main Table Content */}
      {loading ? (
        <LoadingSpinner fullScreen label="Loading users..." />
      ) : filteredUsers.length === 0 ? (
        <EmptyState
          icon={User}
          title="No users found"
          description={
            search
              ? `No user records matching "${search}".`
              : 'There are currently no registered users in the database.'
          }
        />
      ) : (
        <DataTable columns={columns} data={filteredUsers} keyField="id" />
      )}

      {/* Two-Step OTP Delete User Modal */}
      <DeleteOtpModal
        isOpen={!!userToDelete}
        onClose={() => setUserToDelete(null)}
        onRequestCode={() => adminApi.requestUserDeletionCode(userToDelete.id)}
        onConfirmDelete={(code) => adminApi.deleteUser(userToDelete.id, code)}
        title="Delete User Account"
        itemName={userToDelete ? `${userToDelete.name} (${userToDelete.email})` : ''}
        warningText="This action cannot be undone. All user data and club memberships will be permanently removed."
        confirmText="Confirm Delete User"
        onSuccess={() => {
          setUserToDelete(null);
          fetchUsers();
        }}
      />
    </motion.div>
  );
};

export default UsersPage;

