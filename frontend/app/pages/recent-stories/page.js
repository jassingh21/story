import PublicNav from '@/app/components/PublicNav'
import RecentStories from '@/app/components/RecentStories'
import React from 'react'

const RecentStory = () => {
  return (
    <div className='bg-gray-950 min-h-screen'>
        <PublicNav/>
        <RecentStories/>
    </div>
  )
}

export default RecentStory