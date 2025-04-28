"use client"
import Nav from '@/app/components/profile/Nav'
import RecentStories from '@/app/components/RecentStories'
import useAuth from '@/app/hooks/useAuth'
import { getNotification } from '@/app/services/user'

import React, { useEffect, useState } from 'react'

const Profile = () => {
  
  const show = useAuth();
  
  
  return (
    <div className='text-white overflow-x-hidden bg-gradient-to-r from-[#f9f9f9] to-[#f4f4f4] min-h-screen'>
        {show? "Login To Acess this page " : <>
          <div>
            <Nav/>
          </div>
          <div>
            <RecentStories/>
          </div>
        </>}
    </div>
  )
}

export default Profile