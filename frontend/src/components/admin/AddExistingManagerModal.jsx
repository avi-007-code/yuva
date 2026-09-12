import React, { useState, useEffect } from 'react';
import { UserCheck, X, Search } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import adminApi from '../../api/adminApi';

const AddExistingManagerModal = ({ isOpen, onClose, onSuccess, clubId, existingManagerIds = [] }) => {
  const [users, setUsers] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState('');
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');

  useEffect(() => {
    if (isOpen) {
      fetchAvailableUsers();
    }
  }, [isOpen]);

  const fetchAvailableUsers = async () => {
    setFetching(true);
    setError('');
    try {
      const res = await adminApi.getAllUsers();
      const userList = res.data || [];
      const available = userList.filter(
        (u) => u.isActive && !existingManagerIds.includes(u.id)
      );
      setUsers(available);
      if (available.length > 0) {
        setSelectedUserId(available[0].id);
      }
    } catch (err) {
      setError('Failed to fetch user list');
    } finally {
      setFetching(false);
    }
  };

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!selectedUserId) {
      setError('Please select a user');
      return;
    }

    setLoading(true);
    try {
      await adminApi.addExistingManagerToClub(clubId, selectedUserId);
      if (onSuccess) onSuccess();
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add manager');
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = users.filter(
    (u) =>
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 font-sans">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-[#1C1B1F]/50 backdrop-blur-xs"
          onClick={loading ? undefined : onClose}
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.98, y: 8 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.98, y: 8 }}
          className="relative w-full max-w-md bg-white border border-[#E7E5E4] rounded-lg shadow-lg overflow-hidden z-10"
        >
          <div className="p-6">
            <div className="flex items-center justify-between border-b border-[#E7E5E4] pb-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-[#EBF3ED] border border-[#D1E3D7] text-[#2E5A44] rounded">
                  <UserCheck className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-semibold text-[#1C1B1F] font-serif">Add Existing Manager</h3>
                  <p className="text-xs text-[#6B6966]">Assign an active user to manage this club</p>
                </div>
              </div>
              <button
                onClick={onClose}
                disabled={loading}
                className="text-[#8E8B85] hover:text-[#1C1B1F] transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="mt-4 space-y-4">
              {error && (
                <div className="p-3 bg-[#FDF2F2] border border-[#F3CECE] rounded text-xs text-[#8B3A3A]">
                  {error}
                </div>
              )}

              {fetching ? (
                <div className="py-8 text-center text-xs text-[#6B6966]">
                  <span className="w-4 h-4 border-2 border-[#D8D7DC] border-t-[#B08D57] rounded-full animate-spin inline-block mb-2" />
                  <p>Loading available active users...</p>
                </div>
              ) : users.length === 0 ? (
                <div className="py-6 text-center text-xs text-[#6B6966] bg-[#FAF9F7] border border-[#E7E5E4] rounded p-4">
                  No active eligible users found to add as manager.
                </div>
              ) : (
                <>
                  <div className="relative">
                    <Search className="w-4 h-4 text-[#8E8B85] absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder="Filter users..."
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      className="w-full pl-9 pr-4 py-2 bg-white border border-[#D8D7DC] rounded text-xs text-[#1C1B1F] placeholder-[#A8A5A0] focus:outline-none focus:border-[#B08D57]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-[#6B6966] mb-1.5">
                      Select Manager User
                    </label>
                    <select
                      value={selectedUserId}
                      onChange={(e) => setSelectedUserId(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-[#D8D7DC] rounded text-[#1C1B1F] text-sm focus:outline-none focus:border-[#B08D57]"
                    >
                      {filteredUsers.map((u) => (
                        <option key={u.id} value={u.id}>
                          {u.name} ({u.email})
                        </option>
                      ))}
                    </select>
                  </div>
                </>
              )}

              <div className="pt-3 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  disabled={loading}
                  className="px-4 py-2 bg-[#F2F0EC] hover:bg-[#E7E5E4] text-[#38373A] text-xs font-medium rounded border border-[#E7E5E4] transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading || users.length === 0}
                  className="px-4 py-2 bg-[#B08D57] hover:bg-[#997847] text-white text-xs font-medium rounded transition-colors flex items-center gap-2 disabled:opacity-50"
                >
                  {loading && (
                    <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  )}
                  Add Manager
                </button>
              </div>
            </form>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default AddExistingManagerModal;

