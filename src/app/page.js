"use client";
import { useSession } from "next-auth/react";
import useMoonSDK  from "../hooks/moon"
import { AccountResponse } from '@moonup/moon-api';
import { useEffect, useState } from 'react';
import axios from 'axios'
import { toast } from "react-hot-toast"
import Link from "next/link";
export default function Home() {
  const {data: session, status} = useSession();
  const [acc,setAcc]=useState();
  const { moon, initialize, disconnect } = useMoonSDK();
  const { updateToken, listAccounts } = useMoonSDK();

  const createAccount = async () => {
    moon.updateToken(session?.accessToken);
    moon.updateRefreshToken(session?.refreshToken);
		const account = await moon?.getAccountsSDK().createAccount({}, {});
		console.log((account?.data.data).address);

    setAcc((account?.data.data).address);
	};
  if(status === 'loading') {
    return <p>Please wait...</p>
  }
  const onsubmit=async()=>{
    try {
      const response = await axios.post('/api/profile', {
        email: session?.user?.name,
        accessToken: session?.accessToken,
        refreshToken: session?.refreshToken,
        eoa:acc
      });
      console.log(response.data);
      toast.success("Confirmed your profile")
    } catch (e) {
      console.error(e);
      toast.error("something wrong or already created your acc",e )
    }
  };
  return (
    <div className="flex flex-col items-center justify-center">
      <h1 className="text-4xl font-bold mb-4">Welcome to Dice Poker Game!</h1>
      {status === 'authenticated' ? (
        <>
          <p className="text-lg mb-2">Hello, {session?.user?.name}!</p>
          <button
            className="bg-blue-500 text-white rounded p-2 m-3 hover:bg-blue-600 transition"
            onClick={createAccount}
          >
            Get ETH Account
          </button>
          The acc address is you set is {acc || "Not available yet"}
          
          <div>
            <button
              className="bg-green-500 text-white rounded p-2 m-3 hover:bg-green-600 transition"
              onClick={onsubmit}
            >
              Confirm
            </button>
          </div>
          {acc ? <div> <Link className="text-xs hover:underline underline-offset-4" href="/play">
            Play
          </Link></div>:null}
        </>
      ) : (
        <p className="text-lg">Please log in or register to play the Dice Poker game!</p>
      )}
    </div>
  );  
      }