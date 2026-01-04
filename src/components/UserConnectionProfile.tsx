import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { connectionsApi } from '../api';
import { ConnectionProfile } from '../types';

const UserConnectionProfile = () => {
  const { token } = useAuth();
  const [profile, setProfile] = useState<ConnectionProfile | null>(null);
  const [bio, setBio] = useState('');
  const [skills, setSkills] = useState<string[]>([]);
  const [needs, setNeeds] = useState<string[]>([]);
  const [newSkill, setNewSkill] = useState('');
  const [newNeed, setNewNeed] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const loadProfile = async () => {
      if (!token) return;
      
      try {
        const profileData = await connectionsApi.getProfile(token);
        setProfile(profileData);
        setBio(profileData.bio);
        setSkills(profileData.skills);
        setNeeds(profileData.needs);
        setError(null);
      } catch (err) {
        console.error('Error loading profile:', err);
        setProfile(null);
        setBio('');
        setSkills([]);
        setNeeds([]);
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, [token]);

  const handleAddSkill = () => {
    if (newSkill.trim() && !skills.includes(newSkill.trim())) {
      setSkills([...skills, newSkill.trim()]);
      setNewSkill('');
    }
  };

  const handleRemoveSkill = (skill: string) => {
    setSkills(skills.filter(s => s !== skill));
  };

  const handleAddNeed = () => {
    if (newNeed.trim() && !needs.includes(newNeed.trim())) {
      setNeeds([...needs, newNeed.trim()]);
      setNewNeed('');
    }
  };

  const handleRemoveNeed = (need: string) => {
    setNeeds(needs.filter(n => n !== need));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;
    
    setLoading(true);
    setError(null);
    setSuccess(false);
    
    try {
      const profileData = {
        bio,
        skills,
        needs,
      };
      
      if (profile) {
        await connectionsApi.updateProfile(token, profileData);
      } else {
        await connectionsApi.createProfile(token, profileData);
      }
      
      setSuccess(true);
    } catch (err) {
      console.error('Error saving profile:', err);
      setError('Failed to save profile');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center p-4">Loading...</div>;
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-2xl font-bold mb-4">Your Connection Profile</h2>
      
      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
          {error}
        </div>
      )}
      
      {success && (
        <div className="mb-4 p-3 bg-green-100 text-green-700 rounded">
          Profile saved successfully!
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="bio" className="block text-sm font-medium text-gray-700 mb-1">
            Bio - Tell others about yourself
          </label>
          <textarea
            id="bio"
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
            rows={3}
            placeholder="What makes you unique?"
            required
          />
        </div>
        
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Skills - What you're offering
          </label>
          <div className="flex flex-wrap gap-2 mb-2">
            {skills.map((skill) => (
              <span
                key={skill}
                className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800"
              >
                {skill}
                <button
                  type="button"
                  onClick={() => handleRemoveSkill(skill)}
                  className="ml-1.5 inline-flex items-center justify-center h-4 w-4 rounded-full bg-indigo-200 text-indigo-500 hover:bg-indigo-300"
                >
                  &times;
                </button>
              </span>
            ))}
          </div>
          <div className="flex">
            <input
              type="text"
              value={newSkill}
              onChange={(e) => setNewSkill(e.target.value)}
              className="flex-grow p-2 border border-gray-300 rounded-l focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Add a skill (e.g., design, coding)"
            />
            <button
              type="button"
              onClick={handleAddSkill}
              className="px-4 bg-indigo-600 text-white rounded-r hover:bg-indigo-700"
            >
              Add
            </button>
          </div>
        </div>
        
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Needs - What you're looking for
          </label>
          <div className="flex flex-wrap gap-2 mb-2">
            {needs.map((need) => (
              <span
                key={need}
                className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800"
              >
                {need}
                <button
                  type="button"
                  onClick={() => handleRemoveNeed(need)}
                  className="ml-1.5 inline-flex items-center justify-center h-4 w-4 rounded-full bg-yellow-200 text-yellow-500 hover:bg-yellow-300"
                >
                  &times;
                </button>
              </span>
            ))}
          </div>
          <div className="flex">
            <input
              type="text"
              value={newNeed}
              onChange={(e) => setNewNeed(e.target.value)}
              className="flex-grow p-2 border border-gray-300 rounded-l focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Add a need (e.g., developer, cofounder)"
            />
            <button
              type="button"
              onClick={handleAddNeed}
              className="px-4 bg-indigo-600 text-white rounded-r hover:bg-indigo-700"
            >
              Add
            </button>
          </div>
        </div>
        
        <button
          type="submit"
          className="w-full py-2 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded"
          disabled={loading}
        >
          {loading ? 'Saving...' : 'Save Profile'}
        </button>
      </form>
    </div>
  );
};

export default UserConnectionProfile;
