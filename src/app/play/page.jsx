import { getServerSession } from "next-auth/next";
import {authOptions} from "../api/auth/[...nextauth]/route"
import { useSession } from "next-auth/react";
import { redirect } from 'next/navigation';
import prismadb from '@/app/lib/db';
import React from 'react'
  const  page = async() => {
    const session = await getServerSession(authOptions);
  let email=  session.user?.email
    const profile = await prismadb.user.findFirst({
        where: {
             email,
        }
      });
        
    if (profile) {
        redirect(`/${profile.id}`);
      };
      console.log( email)
  return (
      <div>
         PAGE NOT FOUND 
      </div>
  )
};

export default page