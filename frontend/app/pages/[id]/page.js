"use client";
import Nav from '@/app/components/profile/Nav';
import Spinner from '@/app/components/Spinner';
import { logout } from '@/app/services/auth';
import { checkAuth } from '@/app/services/checkAuth';
import { getUser, followUser, unfollowUser } from '@/app/services/user';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { FaPeopleGroup, FaPeopleRoof } from 'react-icons/fa6';
import { MdOutlineEmail } from 'react-icons/md';
import { SiStorybook } from 'react-icons/si';
import { TiGroupOutline } from 'react-icons/ti';

const UserId = () => {
  const { id } = useParams();
  const [loading , setLoading] = useState(false);
  const [user, setUser] = useState({
    username: '',
    email: '',
    profilePicture: '',
    storiesCreated: [],
    storiesParticipated: [],
    followers: [],
    following: [],
  });

  const [isFollowing, setIsFollowing] = useState(false);
  const [showFollowers, setShowFollowers] = useState(false);
  const [showFollowing, setShowFollowing] = useState(false);

  const myUser = async (token) => {
    try {
      setLoading(true);
      const data = await getUser(id, token);
      console.log(data)
      if (data) {
        setLoading(false);
        setUser(data);
        const currentUserId = localStorage.getItem('currentUserId'); // Fetch logged-in user's ID
        setIsFollowing(data.followers.includes(currentUserId));
      } else {
        console.error("Error fetching user data");
      }
    } catch (error) {
      console.error("Error in myUser function:", error.message);
    }
  };

  const handleFollow = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        alert("You must be logged in to follow users.");
        return;
      }

      if (isFollowing) {
        await unfollowUser(id, token);
        setIsFollowing(false);
        setUser((prev) => ({
          ...prev,
          followers: prev.followers.filter((followerId) => followerId !== localStorage.getItem('currentUserId')),
        }));
      } else {
        await followUser(id, token);
        setIsFollowing(true);
        setUser((prev) => ({
          ...prev,
          followers: [...prev.followers, localStorage.getItem('currentUserId')],
        }));
      }
    } catch (error) {
      console.error("Error in handleFollow function:", error.message);
    }
  };

  useEffect(() => {
    if(checkAuth()){

      if (typeof window !== 'undefined') {
        const token = localStorage.getItem('token');
        myUser(token);
      }
    }else{
      alert("Login First")
      logout()
    }
  }, [id]);

  return (
    <div className="bg-gradient-to-r from-[#f9f9f9] to-[#f4f4f4] min-h-screen">
      <Nav />
      {/* User Profile */}
      {loading && <Spinner/>}
      <div className="rounded-xl max-w-4xl mx-auto p-8 bg-gradient-to-r from-gray-800 via-gray-900 to-black shadow-xl mt-10 text-white relative">
        <div className="flex flex-col md:flex-row items-center space-y-6 md:space-y-0 md:space-x-8">
          <div className="relative">
            {user.profilePicture ? (
              <Image
                src={user.profilePicture}
                alt="Profile"
                width={100}
                height={100}
                className="w-32 h-32 rounded-full border-4 border-purple-500 shadow-lg"
              />
            ) : (
              <div className="w-32 h-32 rounded-full border-4 border-purple-500 bg-gray-700 flex items-center justify-center text-2xl">
                No Image
              </div>
            )}
          </div>
          <div className="text-center md:text-left">
            <h1 className="text-3xl font-bold font-amaranth">{user.username || "N/A"}</h1>
            <button
              className={`mt-4 px-6 py-2 rounded-lg text-lg font-medium ${
                isFollowing ? 'bg-red-500 hover:bg-red-600' : 'bg-purple-500 hover:bg-purple-600'
              } text-white transition duration-300`}
              onClick={handleFollow}
            >
              {isFollowing ? 'Unfollow' : 'Follow'}
            </button>
            <p className="flex items-center justify-center md:justify-start text-lg mt-2 text-gray-300">
              <MdOutlineEmail className="mr-2" />
              <a href={`mailto:${user.email}`} className="hover:text-blue-500">
                {user.email || "N/A"}
              </a>
            </p>
          </div>
        </div>
      </div>

      {/* User Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-8 max-w-4xl mx-auto  p-6 bg-gradient-to-r from-gray-800 via-gray-900 to-black rounded-xl shadow-xl text-white">
        <StatCard
          icon={<SiStorybook className="text-4xl text-yellow-400" />}
          label="Stories Written"
          value={user.storiesCreated?.length || 0}
        />
        <StatCard
          icon={<TiGroupOutline className="text-4xl text-yellow-400" />}
          label="Participated"
          value={user.storiesParticipated?.length || 0}
        />
        <StatCard
          icon={<FaPeopleRoof className="text-4xl text-yellow-400" />}
          label="Followers"
          value={user.followers?.length || 0}
          onClick={() => setShowFollowers(!showFollowers)}
        />
        {showFollowers && (
          <div className="absolute top-0 right-0 bg-white text-black p-4 rounded-lg shadow-lg">
            <h3 className="text-xl font-bold">Followers</h3>
            <ul>
              {user.followers.map((follower, index) => (
                <li key={index}>{follower}</li>
              ))}
            </ul>
          </div>
        )}
        <StatCard
          icon={<FaPeopleGroup className="text-4xl text-yellow-400" />}
          label="Following"
          value={user.following?.length || 0}
          onClick={() => setShowFollowing(!showFollowing)}
        />
        {showFollowing && (
          <div className="absolute top-0 right-0 bg-white text-black p-4 rounded-lg shadow-lg">
            <h3 className="text-xl font-bold">Following</h3>
            <ul>
              {user.following.map((followedUser, index) => (
                <li key={index}>{followedUser}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

const StatCard = ({ icon, label, value, onClick }) => (
  <div className="flex flex-col items-center bg-gray-900 p-4 rounded-lg shadow-lg transform hover:scale-105 transition duration-300">
    {icon}
    <p className="mt-2 text-lg text-gray-300">{label}</p>
    <p className="text-2xl font-bold mt-1 cursor-pointer" onClick={onClick}>
      {value}
    </p>
  </div>
);

export default UserId;
