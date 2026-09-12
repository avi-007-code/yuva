import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Building2, AlignLeft, PlusCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import adminApi from '../../api/adminApi';

const CreateClubPage = () => {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!name.trim()) {
      setError('Club name is required.');
      return;
    }

    setLoading(true);
    try {
      const res = await adminApi.createClub({
        name: name.trim(),
        description: description.trim() || null,
      });

      const newClubId = res.data?.id;
      if (newClubId) {
        navigate(`/admin/clubs/${newClubId}`);
      } else {
        navigate('/admin/clubs');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create club. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className="space-y-6 max-w-3xl mx-auto font-sans"
    >
      {/* Navigation Header */}
      <div className="flex items-center gap-4 border-b border-[#E7E5E4] pb-5">
        <Link
          to="/admin/clubs"
          className="p-2 bg-white border border-[#E7E5E4] hover:bg-[#FAF9F7] text-[#6B6966] hover:text-[#1C1B1F] rounded transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <div>
          <h1 className="text-2xl sm:text-3xl font-serif font-normal text-[#1C1B1F] tracking-tight">Create New Club</h1>
          <p className="text-xs text-[#6B6966]">Establish a new student organization entity</p>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-[#FDF2F2] border border-[#F3CECE] text-[#8B3A3A] rounded text-xs">
          {error}
        </div>
      )}

      {/* Form Card */}
      <form onSubmit={handleSubmit} className="bg-white border border-[#E7E5E4] rounded-lg p-6 space-y-6 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
        <div>
          <label className="block text-xs font-medium text-[#6B6966] mb-1.5">
            Club Name <span className="text-[#8B3A3A]">*</span>
          </label>
          <div className="relative">
            <Building2 className="w-4 h-4 text-[#8E8B85] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              required
              placeholder="e.g. IEEE Student Branch"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-white border border-[#D8D7DC] focus:border-[#B08D57] rounded text-[#1C1B1F] text-sm placeholder-[#A8A5A0] focus:outline-none transition-colors"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-[#6B6966] mb-1.5">
            Description
          </label>
          <div className="relative">
            <AlignLeft className="w-4 h-4 text-[#8E8B85] absolute left-3 top-3" />
            <textarea
              rows={4}
              placeholder="Provide a brief overview of the club's purpose, mission, and activities..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 bg-white border border-[#D8D7DC] focus:border-[#B08D57] rounded text-[#1C1B1F] text-sm placeholder-[#A8A5A0] focus:outline-none transition-colors resize-none"
            />
          </div>
        </div>

        <div className="pt-4 flex items-center justify-end gap-3 border-t border-[#E7E5E4]">
          <Link
            to="/admin/clubs"
            className="px-4 py-2 bg-[#F2F0EC] hover:bg-[#E7E5E4] text-[#38373A] text-xs font-medium rounded border border-[#E7E5E4] transition-colors"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 bg-[#B08D57] hover:bg-[#997847] text-white text-xs font-medium rounded transition-colors flex items-center gap-2 disabled:opacity-50"
          >
            {loading ? (
              <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <PlusCircle className="w-3.5 h-3.5" />
            )}
            Create Club
          </button>
        </div>
      </form>
    </motion.div>
  );
};

export default CreateClubPage;

