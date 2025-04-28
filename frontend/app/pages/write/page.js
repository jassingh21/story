"use client"
import Nav from '@/app/components/profile/Nav'
import Create from '@/app/components/story/Create';
import { logout } from '@/app/services/auth';

import { checkAuth } from '@/app/services/checkAuth';
import React, { useEffect, useState } from 'react'

const Write = () => {
 // const [ token , setToken] = useState("");
  useEffect(()=>{
    if(!checkAuth()){
      logout();
    }
   /* const token = localStorage.getItem("token");
    setToken(token);*/
  })
    return (
      <div className="h-screen bg-black scrollbar-thin scrollbar-thumb-rounded-full scrollbar-track-rounded-full scrollbar-thumb-gray-500/70 scrollbar-track-transparent">
        <div>
          <Nav />
        </div>
        <div className='flex flex-col lg:flex-row justify-between  p-5'>
           
            <div className='w-full m-auto lg:w-8/12 p-5'>
                <Create />
            </div>
        </div>
      </div>
    );
};

export default Write;
