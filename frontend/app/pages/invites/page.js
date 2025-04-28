"use client";
import Nav from '@/app/components/profile/Nav';
import { logout } from '@/app/services/auth';
import { checkAuth } from '@/app/services/checkAuth';
import { acceptInvite, getInvite, rejectInvite } from '@/app/services/user';
import React, { useEffect, useState } from 'react';

const Invitess = () => {
  const [invites, setInvites] = useState([]);

  const fetchInvites = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        console.log("No token found, please login.");
        return;
      }

      const data = await getInvite(token);
      if (data) {
        setInvites(data.Message);
        console.log('Invitation Data:', data.Message);
      }
    } catch (error) {
      console.error("Error fetching invites:", error);
    }
  };
  const accept = async(id)=>{
    try {
        const token = localStorage.getItem("token");
        if (!token) {
            console.log("No token found, please login.");
            return;
          }
        const data = await acceptInvite(id , token);
        if(data){
            setInvites((prev)=>prev.filter((invite)=> invite._id !== id))
        }
    } catch (error) {
        console.error("Error accepting invites:", error);
    }
  }
  const reject = async(id)=>{
    try {
        const token = localStorage.getItem("token");
        if (!token) {
            console.log("No token found, please login.");
            return;
          }
        const data = await rejectInvite(id , token);
        if(data){
            setInvites((prev)=>prev.filter((invite)=> invite._id !== id))
        }
    } catch (error) {
        console.error("Error accepting invites:", error);
    }
  }

  useEffect(() => {
    if(checkAuth()){

      fetchInvites();
    }else{
      logout()
    }
  }, []);

  return (
    <div className="bg-gradient-to-r from-[#f9f9f9] to-[#f4f4f4] min-h-screen">
      {/* Navigation */}
      <div>
        <Nav />
      </div>

      {/* Invites Section */}
      <div className="p-4 md:p-8">
        {invites.length > 0 ? (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {invites.map((invite) => (
              <div
                key={invite._id}
                className="bg-white border-2 border-orange-500 rounded-lg shadow-md p-4 flex flex-col space-y-4"
              >
                <h3 className="text-orange-600 font-semibold text-xl uppercase">
                  {invite.title}
                </h3>
                <p className="text-gray-700 text-base">{invite.synopsis}</p>
                <div className="flex flex-wrap gap-2">
                  {invite.tags.map((tag) => (
                    <span
                      key={tag}
                      className="bg-gray-400 text-white text-sm px-2 py-1 rounded-xl"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                <div className='space-x-3 text-black'>
                <button onClick={()=>accept(invite._id)} className='text-green-500 font-bold bg-gray-50 rounded-lg p-1'>Accept</button>
                <button onClick={()=>reject(invite._id)} className='text-red-500 font-bold bg-gray-50 rounded-lg p-1'>Reject</button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500 text-lg">
            No invites available.
          </p>
        )}
      </div>
    </div>
  );
};

export default Invitess;
