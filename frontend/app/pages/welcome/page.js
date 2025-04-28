"use client"
import React from 'react';

import Login from '@/app/components/Login';

const Welcome = () => {


  return (
    <div className="flex flex-col items-center justify-center h-screen font-amaranth bg-black">
      <h1 className="text-3xl font-bold mb-4 text-white">Welcome to Our Platform!</h1>
      <p className="text-lg mb-6 text-green-700">Please login to continue.</p>
      <div>
      <Login/>
      </div>
    </div>
  );
};

export default Welcome;
