"use client"
import Nav from '@/app/components/profile/Nav'
import Invite from '@/app/components/story/Invite'
import { useParams } from 'next/navigation'
import React from 'react'

const InviteCollab = () => {
    const {id} = useParams();
    console.log(id);
  return (
    <div>
        <div>
            <Nav/>
        </div>
        <div>
            <Invite id={id}/>
        </div>
    </div>
  )
}

export default InviteCollab