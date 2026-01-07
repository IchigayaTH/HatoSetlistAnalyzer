'use client';

import React, { useState, useMemo } from 'react';
import { useData } from '@/components/DataProvider';
import { Event } from '@/types';

export default function EventsTab() {
  const { events, members, addEvent, updateEvent, deleteEvent } = useData();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState<'desc' | 'asc'>('desc');
  const [formData, setFormData] = useState<Partial<Event>>({
    date: '',
    name: '',
    venue: '',
    participatingMembers: [],
  });

  const sortedEvents = useMemo(() => {
    const sorted = [...events].sort((a, b) => {
      const dateA = new Date(a.date).getTime();
      const dateB = new Date(b.date).getTime();
      return sortOrder === 'desc' ? dateB - dateA : dateA - dateB;
    });
    return sorted;
  }, [events, sortOrder]);

  const handleAddClick = () => {
    setEditingId(null);
    setFormData({
      date: '',
      name: '',
      venue: '',
      participatingMembers: [],
    });
    setIsFormOpen(true);
  };

  const handleEditClick = (event: Event) => {
    setEditingId(event.id);
    setFormData(event);
    setIsFormOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.date || !formData.name || !formData.venue) {
      alert('All required fields must be filled');
      return;
    }

    if (editingId) {
      await updateEvent({
        id: editingId,
        date: formData.date,
        name: formData.name,
        venue: formData.venue,
        participatingMembers: formData.participatingMembers || [],
        notes: formData.notes,
      } as Event);
    } else {
      await addEvent({
        id: `e${Date.now()}`,
        date: formData.date,
        name: formData.name,
        venue: formData.venue,
        participatingMembers: formData.participatingMembers || [],
        notes: formData.notes,
      } as Event);
    }

    setIsFormOpen(false);
  };

  return (
    <div className="space-y-6 pb-20 lg:pb-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold text-pink-600">Event Management</h2>
        <button
          onClick={handleAddClick}
          className="hato-btn-primary"
        >
          + New Event
        </button>
      </div>

      {isFormOpen && (
        <div className="hato-card">
          <h3 className="text-xl font-bold mb-4">
            {editingId ? 'Edit Event' : 'New Event'}
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold mb-1">Date *</label>
              <input
                type="date"
                value={formData.date || ''}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className="w-full border-2 border-pink-200 rounded px-3 py-2 focus:outline-none focus:border-red-500"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1">Event Name *</label>
              <input
                type="text"
                value={formData.name || ''}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full border-2 border-pink-200 rounded px-3 py-2 focus:outline-none focus:border-red-500"
                placeholder="e.g., HatoBito Live vol.1"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1">Venue *</label>
              <input
                type="text"
                value={formData.venue || ''}
                onChange={(e) => setFormData({ ...formData, venue: e.target.value })}
                className="w-full border-2 border-pink-200 rounded px-3 py-2 focus:outline-none focus:border-red-500"
                placeholder="e.g., Bangkok Studio"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-2">Members</label>
              <div className="grid grid-cols-3 gap-2 max-h-40 overflow-y-auto">
                {members.map((member) => (
                  <label key={member.id} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.participatingMembers?.includes(member.id) || false}
                      onChange={(e) => {
                        const newMembers = e.target.checked
                          ? [...(formData.participatingMembers || []), member.id]
                          : (formData.participatingMembers || []).filter(m => m !== member.id);
                        setFormData({ ...formData, participatingMembers: newMembers });
                      }}
                      className="rounded"
                    />
                    <span className="text-sm">{member.nameJa}</span>
                  </label>
                ))}
              </div>
            </div>
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
          <h3 className="text-xl font-bold text-gray-700">Events</h3>
          <button
            onClick={() => setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc')}
            className="text-sm font-semibold px-3 py-1 rounded border-2 border-pink-300 text-pink-600 hover:bg-pink-50 transition-all"
          >
            {sortOrder === 'desc' ? '📅 Newest First' : '📅 Oldest First'}
          </button>
        </div>
        {events.length === 0 ? (
          <p className="text-center text-gray-500 py-8">No events yet</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {sortedEvents.map((event) => (
              <div key={event.id} className="hato-card">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h4 className="text-lg font-bold text-pink-600">{event.name}</h4>
                    <p className="text-sm text-gray-600">{event.date}</p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEditClick(event)}
                      className="text-pink-600 hover:text-red-600 font-semibold text-sm"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => deleteEvent(event.id)}
                      className="text-red-600 hover:text-red-800 font-semibold text-sm"
                    >
                      Delete
                    </button>
                  </div>
                </div>
                <p className="text-sm text-gray-600 mb-2">Venue: {event.venue}</p>
                <p className="text-sm text-gray-500">
                  Members: {event.participatingMembers.length}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
