"use client";
import { logout } from '@/app/services/auth';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import { AiOutlineMenu, AiOutlineClose } from 'react-icons/ai';
import { IoMdNotificationsOutline } from 'react-icons/io';
import { CiUser } from "react-icons/ci";
import { getInvite, getNotification, markNotificationsAsRead } from '@/app/services/user';

const Nav = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [notificationCount, setNotificationCount] = useState(0);
  const [notifications, setNotifications] = useState([]);
  const [invites, setInvites] = useState([]);

  const toggleMenu = () => setIsOpen(!isOpen);

  const toggleNotifications = async () => {
    if (!notificationOpen) await markAsRead();
    setNotificationOpen(!notificationOpen);
  };

  const fetchNotifications = async () => {
    const token = localStorage.getItem("token");
    if (!token) return console.log("No token found, please login.");
    const data = await getNotification(token);
    if (data) {
      setNotificationCount(data.Notifications.length);
      setNotifications(data.Notifications);
    }
  };

  const fetchInvites = async () => {
    const token = localStorage.getItem("token");
    if (!token) return console.log("No token found, please login.");
    const data = await getInvite(token);
    if (data) setInvites(data.Message);
  };

  const markAsRead = async () => {
    const token = localStorage.getItem("token");
    if (!token) return console.log("No token found, please login.");
    const response = await markNotificationsAsRead(token);
    if (response.status === 200) setNotificationCount(0);
  };

  useEffect(() => {
    fetchNotifications();
    fetchInvites();
  }, []);

  return (
    <div className="relative font-amaranth bg-gradient-to-r from-blue-900  to-black p-3 rounded-sm shadow-blue-300 shadow-sm backdrop-blur-md bg-opacity-80 border border-gray-600">
      {/* Top Bar */}
      <div className="flex items-center justify-between px-6 py-3">
        <Link href="/pages/profile" className="text-3xl font-bold text-purple-100 hover:text-purple-300 transition-all duration-300">
          StoryThread
        </Link>
        <div className="flex items-center space-x-4">
          {/* Notification Button */}
          <button
            className="relative text-yellow-400 hover:text-yellow-300 transition-all duration-300"
            onClick={toggleNotifications}
          >
            <IoMdNotificationsOutline size={28} />
            {notificationCount > 0 && (
              <span className="absolute top-0 right-0 w-5 h-5 bg-red-600 text-xs text-white rounded-full flex items-center justify-center animate-bounce">
                {notificationCount > 9 ? "9+" : notificationCount}
              </span>
            )}
          </button>

          {/* Menu Button */}
          <button
            className="text-yellow-400 hover:text-yellow-300 md:hidden transition-all duration-300"
            onClick={toggleMenu}
          >
            {isOpen ? <AiOutlineClose size={28} /> : <AiOutlineMenu size={28} />}
          </button>
        </div>
      </div>

      {/* Notifications Dropdown */}
      {notificationOpen && (
        <div className="absolute right-6 top-16 w-72 bg-gray-900 text-yellow-300 rounded-lg shadow-lg z-50 border border-gray-700 backdrop-blur-md bg-opacity-80 animate-fadeIn">
          <ul className="py-2">
            {notifications.length > 0 ? (
              notifications.map((notification, index) => (
                <li key={index} className="px-4 py-2 border-b border-gray-700 hover:bg-gray-800 transition-all duration-300">
                  {notification}
                </li>
              ))
            ) : (
              <li className="px-4 py-2 text-center text-gray-500">No notifications</li>
            )}
          </ul>
        </div>
      )}

      {/* Side Navigation */}
      <div
  className={`fixed top-0 left-0 h-full  w-64 bg-gray-900  border-r border-gray-700 z-40 transition-transform transform ${
    isOpen ? "translate-x-0 " : "-translate-x-full"
  } md:translate-x-0 md:relative  md:flex md:bg-black md:w-auto rounded-lg shadow-lg`}
>


        <nav className="flex flex-col px-6 py-8 space-y-6 md:flex-row md:space-y-0 md:space-x-6 ">
          <Link className="text-lg text-blue-200 hover:text-blue-300 flex items-center transition-all duration-300" href="/pages/user">
            <CiUser className="mr-2" size={20} /> Profile
          </Link>
          <Link className="text-lg text-orange-200 hover:text-orange-300 transition-all duration-300" href="/pages/write">
            Write Story
          </Link>
          <Link className="text-lg text-purple-200 hover:text-purple-300 transition-all duration-300" href="/pages/stories">
            My Stories
          </Link>
          <Link className="relative text-lg text-green-200 hover:text-green-300 transition-all duration-300" href="/pages/invites">
            Story Invites
            {invites.length > 0 && (
              <span className="absolute top-1 left-1 w-3 h-3 bg-red-600 rounded-full animate-pulse"></span>
            )}
          </Link>
          <div className="text-lg text-red-200 hover:text-red-300 cursor-pointer transition-all duration-300" onClick={logout}>
            LogOut
          </div>
        </nav>
      </div>

      {/* Mobile Menu Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black opacity-50 z-30 md:hidden transition-opacity duration-300"
          onClick={toggleMenu}
        ></div>
      )}
    </div>
  );
};

export default Nav;
