'use client';

import React, { useState } from 'react';
import { useData } from '@/components/DataProvider';
import { BackupPanel } from '@/components/BackupPanel';
import { Member, Song } from '@/types';

type MasterType = 'members' | 'songs';

export default function MastersTab() {
  const { members, songs, addMember, updateMember, deleteMember, addSong, updateSong, deleteSong } = useData();
  const [masterType, setMasterType] = useState<MasterType>('members');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<Member & Song>>({});

  const handleAddClick = (type: MasterType) => {
    setMasterType(type);
    setEditingId(null);
    setFormData({});
    setIsFormOpen(true);
  };

  const handleEditClick = (id: string, type: MasterType) => {
    setMasterType(type);
    setEditingId(id);
    const item = type === 'members'
      ? members.find(m => m.id === id)
      : songs.find(s => s.id === id);
    setFormData(item || {});
    setIsFormOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (masterType === 'members') {
      if (!formData.name || !formData.nameJa || !formData.birthDate || !formData.joinDate) {
        alert('Required fields missing');
        return;
      }

      if (editingId) {
        updateMember({
          id: editingId,
          name: formData.name,
          nameJa: formData.nameJa,
          birthDate: formData.birthDate,
          joinDate: formData.joinDate,
          imageUrl: formData.imageUrl,
          status: formData.status as 'active' | 'inactive' | 'hiatus' || 'active',
        } as Member);
      } else {
        addMember({
          id: `m${Date.now()}`,
          name: formData.name,
          nameJa: formData.nameJa,
          birthDate: formData.birthDate,
          joinDate: formData.joinDate,
          imageUrl: formData.imageUrl,
          status: formData.status as 'active' | 'inactive' | 'hiatus' || 'active',
        } as Member);
      }
    } else {
      if (!formData.title || !formData.titleJa || !formData.duration) {
        alert('Required fields missing');
        return;
      }

      if (editingId) {
        updateSong({
          id: editingId,
          title: formData.title,
          titleJa: formData.titleJa,
          releaseDate: formData.releaseDate,
          duration: formData.duration,
          defaultSelectMembers: formData.defaultSelectMembers || [],
          imageUrl: formData.imageUrl,
        } as Song);
      } else {
        addSong({
          id: `s${Date.now()}`,
          title: formData.title,
          titleJa: formData.titleJa,
          releaseDate: formData.releaseDate,
          duration: formData.duration,
          defaultSelectMembers: formData.defaultSelectMembers || [],
          imageUrl: formData.imageUrl,
        } as Song);
      }
    }

    setIsFormOpen(false);
  };

  return (
    <div className="space-y-6 pb-20 lg:pb-6">
      <div>
        <h2 className="text-3xl font-bold text-pink-600 mb-6">Master Data</h2>
      </div>

      <div className="flex gap-4">
        <button
          onClick={() => setMasterType('members')}
          className={`px-6 py-3 font-bold rounded-lg transition-all ${
            masterType === 'members'
              ? 'bg-pink-600 text-white'
              : 'bg-gray-200 text-gray-600'
          }`}
        >
          Members
        </button>
        <button
          onClick={() => setMasterType('songs')}
          className={`px-6 py-3 font-bold rounded-lg transition-all ${
            masterType === 'songs'
              ? 'bg-pink-600 text-white'
              : 'bg-gray-200 text-gray-600'
          }`}
        >
          Songs
        </button>
      </div>

      {isFormOpen && (
        <div className="hato-card">
          <h3 className="text-xl font-bold mb-4">
            {masterType === 'members'
              ? (editingId ? 'Edit Member' : 'New Member')
              : (editingId ? 'Edit Song' : 'New Song')}
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            {masterType === 'members' ? (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold mb-1">Name (EN) *</label>
                    <input
                      type="text"
                      value={formData.name || ''}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full border-2 border-pink-200 rounded px-3 py-2 focus:outline-none focus:border-red-500"
                      placeholder="e.g., Mint"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-1">Name (JA) *</label>
                    <input
                      type="text"
                      value={formData.nameJa || ''}
                      onChange={(e) => setFormData({ ...formData, nameJa: e.target.value })}
                      className="w-full border-2 border-pink-200 rounded px-3 py-2 focus:outline-none focus:border-red-500"
                      placeholder="e.g., Mint"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold mb-1">Birth Date *</label>
                    <input
                      type="date"
                      value={formData.birthDate || ''}
                      onChange={(e) => setFormData({ ...formData, birthDate: e.target.value })}
                      className="w-full border-2 border-pink-200 rounded px-3 py-2 focus:outline-none focus:border-red-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-1">Join Date *</label>
                    <input
                      type="date"
                      value={formData.joinDate || ''}
                      onChange={(e) => setFormData({ ...formData, joinDate: e.target.value })}
                      className="w-full border-2 border-pink-200 rounded px-3 py-2 focus:outline-none focus:border-red-500"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1">Status</label>
                  <select
                    value={formData.status || 'active'}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as 'active' | 'inactive' | 'hiatus' })}
                    className="w-full border-2 border-pink-200 rounded px-3 py-2 focus:outline-none focus:border-red-500"
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                    <option value="hiatus">Hiatus</option>
                  </select>
                </div>
              </>
            ) : (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold mb-1">Title (EN) *</label>
                    <input
                      type="text"
                      value={formData.title || ''}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      className="w-full border-2 border-pink-200 rounded px-3 py-2 focus:outline-none focus:border-red-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-1">Title (JA) *</label>
                    <input
                      type="text"
                      value={formData.titleJa || ''}
                      onChange={(e) => setFormData({ ...formData, titleJa: e.target.value })}
                      className="w-full border-2 border-pink-200 rounded px-3 py-2 focus:outline-none focus:border-red-500"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold mb-1">Duration (sec) *</label>
                    <input
                      type="number"
                      value={formData.duration || ''}
                      onChange={(e) => setFormData({ ...formData, duration: parseInt(e.target.value) })}
                      className="w-full border-2 border-pink-200 rounded px-3 py-2 focus:outline-none focus:border-red-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-1">Release Date</label>
                    <input
                      type="date"
                      value={formData.releaseDate || ''}
                      onChange={(e) => setFormData({ ...formData, releaseDate: e.target.value })}
                      className="w-full border-2 border-pink-200 rounded px-3 py-2 focus:outline-none focus:border-red-500"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2">Default Select Members</label>
                  <div className="grid grid-cols-3 gap-2 max-h-40 overflow-y-auto border border-pink-200 rounded p-3 bg-white">
                    {members.map((member) => (
                      <label key={member.id} className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={(formData.defaultSelectMembers as any || []).includes(member.id) || false}
                          onChange={(e) => {
                            const newMembers = e.target.checked
                              ? [...((formData.defaultSelectMembers as any) || []), member.id]
                              : ((formData.defaultSelectMembers as any) || []).filter((m: string) => m !== member.id);
                            setFormData({ ...formData, defaultSelectMembers: newMembers });
                          }}
                          className="rounded"
                        />
                        <span className="text-sm">{member.nameJa}</span>
                      </label>
                    ))}
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    Selected: {((formData.defaultSelectMembers as any) || []).length} members
                  </p>
                </div>
              </>
            )}
            <div className="flex gap-2 pt-4">
              <button
                type="submit"
                className="hato-btn-primary flex-1"
              >
                Save
              </button>
              <button
                type="button"
                onClick={() => setIsFormOpen(false)}
                className="hato-btn-secondary flex-1"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-xl font-bold text-gray-700">
            {masterType === 'members' ? 'Members' : 'Songs'}
          </h3>
          <button
            onClick={() => handleAddClick(masterType)}
            className="hato-btn-primary text-sm"
          >
            + Add
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {(masterType === 'members' ? members : songs).map((item) => (
            <div key={item.id} className="hato-card">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h4 className="font-bold text-pink-600">
                    {masterType === 'members'
                      ? (item as Member).nameJa
                      : (item as Song).titleJa}
                  </h4>
                  <p className="text-sm text-gray-600">
                    {masterType === 'members'
                      ? (item as Member).name
                      : (item as Song).title}
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEditClick(item.id, masterType)}
                    className="text-pink-600 hover:text-red-600 font-semibold text-sm"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => {
                      if (masterType === 'members') deleteMember(item.id);
                      else deleteSong(item.id);
                    }}
                    className="text-red-600 hover:text-red-800 font-semibold text-sm"
                  >
                    Delete
                  </button>
                </div>
              </div>
              {masterType === 'songs' && (
                <div className="text-xs text-gray-600 space-y-1">
                  <p>Duration: {Math.floor((item as Song).duration / 60)}m {(item as Song).duration % 60}s</p>
                  <p>Default Select Members: {((item as Song).defaultSelectMembers?.length || 0)} members</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Backup Panel */}
      <div className="mt-8">
        <BackupPanel />
      </div>
    </div>
  );
}
