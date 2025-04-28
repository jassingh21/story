"use client";
import Nav from '@/app/components/profile/Nav';
import Spinner from '@/app/components/Spinner';
import { logout } from '@/app/services/auth';
import { checkAuth } from '@/app/services/checkAuth';
import { getInvite, joinedStories } from '@/app/services/user';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';

const MyStory = () => {
  const [stories, setStories] = useState({ storiesParticipated: [], storiesCreated: [] });
  const [loading , setLoading] = useState(false);
  useEffect(() => {
    if(checkAuth()){
      setLoading(true);
      const fetchData = async () => {
        const token = localStorage.getItem("token");
        const data = await joinedStories(token);
      const invitation = await getInvite(token);
      if(data){
        setLoading(false);
      }
      //console.log(data);
      //console.log(invitation);

      setStories({
        storiesParticipated: data.storiesParticipated || [],
        storiesCreated: data.storiesCreated || []
      });
    };
    fetchData();
  }else{
    logout()
  }
  }, []);

  return (
    <div className="">
      {/* Navigation */}
      <div>
        <Nav />
      </div>

      {/* Stories Participated Section */}
      {loading && <Spinner/>}
      <div className="my-8 p-4 max-w-6xl mx-auto">
        <h2 className="text-5xl font-bold font-amaranth mb-5 text-purple-800 text-center">Stories Participated</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {stories.storiesParticipated.length > 0 ? (
            stories.storiesParticipated.map((story) => (
              <div key={story._id} className="p-4 bg-white shadow-lg shadow-purple-200 rounded-lg">
                <Link href={`/pages/stories/${story._id}`}>
                  <h3 className="text-xl font-semibold text-purple-700 hover:underline">{story.title}</h3>
                </Link>
                <p className="mt-2 font-comic text-gray-600 italic">{story.synopsis}</p>
              </div>
            ))
          ) : (
            <p className="col-span-full text-center text-gray-600">No stories participated in yet.</p>
          )}
        </div>
      </div>

      {/* Stories Created Section */}
      {loading && <Spinner/>}
      <div className="my-8 p-4 max-w-6xl mx-auto">
        <h2 className="text-5xl font-amaranth font-bold mb-5 text-purple-800 text-center">Stories Created</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {stories.storiesCreated.length > 0 ? (
            stories.storiesCreated.map((story) => (
              <div key={story._id} className="p-4  bg-white shadow-lg shadow-purple-200 rounded-lg">
                <Link href={`/pages/stories/${story._id}`}>
                  <h3 className="text-xl font-semibold text-purple-700 hover:underline">{story.title}</h3>
                </Link>
                <p className="mt-2 font-comic text-gray-600 italic">{story.synopsis}</p>
              </div>
            ))
          ) : (
            <p className="col-span-full text-center text-gray-600">No stories created yet.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyStory;
