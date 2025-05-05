"use client"
import Link from 'next/link';
import React, { useState, useEffect } from 'react';
import Login from './Login';
import useAuth from '../hooks/useAuth';
import { checkAuth } from '../services/checkAuth';

const PublicNav = () => {
  const [showLogin, setShowLogin] = useState(true);
  const isAuth = checkAuth();

  useEffect(() => {
    // Update state based on authentication status
    setShowLogin(!isAuth);
  }, [isAuth]);

  return (
    <div className="items-center font-amaranth bg-gray-900 p-1  shadow-lg  flex justify-between px-10 py-4 sm:px-1 md:px-2 xl:px-10 border-b border-gray-800">
      <Link href={"/"} className="text-2xl sm:text-2xl md:text-3xl xl:text-4xl">
        StoryThread
      </Link>
      <div className="items-center flex space-x-4 sm:space-x-3 md:space-x-3 xl:space-x-10 text-2xl sm:text-2xl md:text-3xl xl:text-3xl">
        <Link href={'/pages/recent-stories'} className="">
          Stories
        </Link>
        <div>
          {showLogin ? (
            <Link href={"/pages/login"}>Get Started</Link>
          ) : (
            <Link className='' href="/pages/profile">Profile</Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default PublicNav;
