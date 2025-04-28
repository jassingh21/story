"use client";
import React, { useEffect, useRef, useState } from "react";
import { me, uploadImage, getFollowers, getFollowing } from "@/app/services/user";
import useAuth from "@/app/hooks/useAuth";
import Image from "next/image";
import Nav from "@/app/components/profile/Nav";
import { MdOutlineEmail } from "react-icons/md";
import { SiStorybook } from "react-icons/si";
import { TiGroupOutline } from "react-icons/ti";
import { FaPeopleRoof, FaPeopleGroup } from "react-icons/fa6";
import { FiUpload } from "react-icons/fi";

const User = () => {
  const showAlert = useAuth();
  const [user, setUser] = useState(null);
  const fileInputRef = useRef(null);
  const [modalData, setModalData] = useState([]);
  const [modalTitle, setModalTitle] = useState("");
  const [isModalVisible, setModalVisible] = useState(false);
  const [isUploading, setUploading] = useState(false);
  const [isLoadingUser, setLoadingUser] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem("token");
      if (token) {
        const data = await me(token);
        if (data && data.User) {
          setUser(data.User);
        }
        setLoadingUser(false);
      }
    };
    fetchUserData();
  }, []);

  const handleImageClick = () => {
    fileInputRef.current.click();
  };

  const handleImageChange = async (event) => {
    const token = localStorage.getItem("token");
    const file = event.target.files[0];
    if (file) {
      setUploading(true);
      try {
        const data = await uploadImage(token, file);
        setUser((prevUser) => ({ ...prevUser, profilePicture: data }));
      } catch (error) {
        console.error("Error uploading image:", error);
      } finally {
        setUploading(false);
      }
    }
  };

  const fetchFollowers = async () => {
    try {
      const token = localStorage.getItem("token");
      const followers = await getFollowers(user._id, token);
      setModalData(followers.followers || []);
      setModalTitle("Followers");
      setModalVisible(true);
    } catch (error) {
      console.error("Error fetching followers:", error.message);
    }
  };

  const fetchFollowing = async () => {
    try {
      const token = localStorage.getItem("token");
      const following = await getFollowing(user._id, token);
      setModalData(following.following || []);
      setModalTitle("Following");
      setModalVisible(true);
    } catch (error) {
      console.error("Error fetching following:", error.message);
    }
  };

  if (showAlert) {
    return <div className="text-4xl text-center mt-10 text-red-500">Please Login First.</div>;
  }

  if (isLoadingUser) {
    return <div className="text-2xl text-center mt-10 text-gray-500">Loading user data...</div>;
  }

  return (
    <div className="bg-gradient-to-r from-[#1a1a2e] to-[#16213e] min-h-screen">
      <Nav />
      {/* User Profile */}
      <div className="max-w-4xl mx-auto p-8 bg-gradient-to-r from-gray-900 via-gray-800 to-black shadow-sm shadow-blue-800 mt-10 text-white rounded-2xl relative">
        <div className="flex flex-col md:flex-row items-center space-y-6 md:space-y-0 md:space-x-8">
          <div className="relative group">
            {isUploading ? (
              <div className="w-32 h-32 flex items-center justify-center rounded-full border-4 border-blue-500 bg-gray-700">
                Uploading...
              </div>
            ) : user.profilePicture ? (
              <Image
                src={user.profilePicture}
                alt="Profile"
                width={100}
                height={100}
                className="w-32 h-32 rounded-full border-2 border-red-950 shadow-lg"
              />
            ) : (
              <div className="w-32 h-32 rounded-full border-4 border-purple-500 bg-gray-700 flex items-center justify-center text-2xl">
                No Image
              </div>
            )}
            <div
              onClick={handleImageClick}
              className="absolute inset-0 bg-black bg-opacity-40 opacity-0 group-hover:opacity-100 flex items-center justify-center rounded-full transition duration-300 cursor-pointer"
            >
              <FiUpload className="text-white text-2xl" />
            </div>
            <input type="file" accept="image/*" ref={fileInputRef} onChange={handleImageChange} style={{ display: "none" }} />
          </div>
          <div className="text-center md:text-left">
            <h1 className="text-3xl font-bold">{user.username || "N/A"}</h1>
            <p className="flex items-center justify-center md:justify-start text-lg mt-2 text-blue-200/85">
              <MdOutlineEmail className="mr-2 text-orange-700" /> {user.email || "N/A"}
            </p>
          </div>
        </div>
      </div>

      {/* User Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-8 max-w-4xl mx-auto p-6 bg-gray-900 rounded-xl text-white">
        <StatCard icon={<SiStorybook className="text-4xl text-yellow-400" />} label="Stories Written" value={user.storiesCreated?.length || 0} />
        <StatCard icon={<TiGroupOutline className="text-4xl text-yellow-400" />} label="Participated" value={user.storiesParticipated?.length || 0} />
        <StatCard icon={<FaPeopleRoof className="text-4xl text-yellow-400" />} label="Followers" value={user.followers?.length || 0} onClick={fetchFollowers} />
        <StatCard icon={<FaPeopleGroup className="text-4xl text-yellow-400" />} label="Following" value={user.following?.length || 0} onClick={fetchFollowing} />
      </div>

      {/* Modal */}
      {isModalVisible && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h2 className="text-xl font-bold mb-4">{modalTitle}</h2>
            <ul className="space-y-2">
              {modalData.map((item) => (
                <li key={item._id} className="flex items-center space-x-3 text-gray-700">
                  <Image src={item.profilePicture} alt="img" width={50} height={50} className="rounded-full" />
                  <span>{item.username}</span>
                </li>
              ))}
            </ul>
            <button className="mt-4 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600" onClick={() => setModalVisible(false)}>
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

const StatCard = ({ icon, label, value, onClick }) => (
  <div className="flex flex-col items-center bg-gray-800 p-4 rounded-lg shadow-md hover:bg-gray-700 transition cursor-pointer" onClick={onClick}>
    {icon}
    <p className="mt-2 text-lg text-gray-300">{label}</p>
    <p className="text-2xl font-bold mt-1">{value}</p>
  </div>
);

export default User;
