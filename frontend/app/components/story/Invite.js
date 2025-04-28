"use client";
import { invite, search } from '@/app/services/user';
import React, { useState } from 'react';

const Invite = ({ id }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const token = localStorage.getItem("token");
  console.log(id);

  // Handle search query change
  const handleSearchChange = async (e) => {
    const query = e.target.value;
    setSearchQuery(query);

    setLoading(true);
    try {
      const results = await search(token, query);
      if (results && results.username) {
        setFilteredUsers([results]);
      } else {
        setFilteredUsers([]);
      }
    } catch (error) {
      console.error('Error searching users:', error);
      setFilteredUsers([]);
    } finally {
      setLoading(false);
    }
  };

  // Handle sending an invite
  const handleInvite = async (userId) => {
    try {
      const userArray = [];
      userArray.push(userId);
      await invite(id, userArray, token);
      alert('Collaborator invited!');
    } catch (error) {
      console.error('Error inviting collaborator:', error);
    }
  };

  return (
    <div className="max-w-4xl mx-auto my-5 p-6 bg-gray-900 text-white rounded-xl shadow-lg">
      <h1 className="text-3xl font-bold mb-6 text-center">Invite Collaborators</h1>

      {/* Search bar */}
      <div className="mb-6">
        <input
          type="text"
          value={searchQuery}
          onChange={handleSearchChange}
          placeholder="Search collaborators"
          className="w-full p-3 bg-gray-800 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
        />
      </div>

      {/* Loading spinner */}
      {loading && <div className="text-center text-orange-500 mb-4">Searching...</div>}

      {/* User list */}
      <ul className="space-y-4">
        {filteredUsers.length === 0 && !loading ? (
          <li className="text-center text-gray-500">No collaborators found</li>
        ) : (
          filteredUsers.map((user) => (
            <li
              key={user.id}
              className="flex flex-col sm:flex-row justify-between items-center bg-gray-800 p-4 rounded-lg shadow-md"
            >
              <div className="flex items-center space-x-4">
                <img
                  src={user.img || "/default-avatar.png"}
                  alt={user.username}
                  className="w-12 h-12 rounded-full"
                />
                <span className="text-lg font-medium">{user.username}</span>
              </div>
              <button
                onClick={() => handleInvite(user.id)}
                className="mt-4 sm:mt-0 sm:ml-4 py-2 px-6 bg-orange-500 text-white rounded-md hover:bg-orange-400 focus:outline-none focus:ring-2 focus:ring-orange-600"
              >
                Invite
              </button>
            </li>
          ))
        )}
      </ul>
    </div>
  );
};

export default Invite;
