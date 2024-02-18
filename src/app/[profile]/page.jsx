'use client'
import React from 'react'
import axios from 'axios';
import { useRouter } from 'next/navigation'

function page({children,params}) {
  let roomIdInput = ''
    const router = useRouter()

const joinRoom = async (roomId) => {
  try {
    let response = await axios.patch(`/api/rooms/${roomId}`, { profile: params.profile });
    router.push(`/room/${roomId}`)
    console.log("Response data: ra ", response.data);

  } catch (error) {
    // Log and handle any errors that occur during the request
    console.error("Error joining room:", error);

    if (error.response && error.response.status === 404) {
      console.error("Room not found. Make sure the roomId is correct.");
    }
  }
};
 const createRoom = async () => {
    const response = await axios.post(`/api/${params.profile}/room`);
    const roomId = await response.data;
        router.push(`/room/${roomId}`)
      }
  
  return (
<div className="p-4">
  <div className="mb-4">
    <p className="font-bold">Page</p>
    <br />
    {params.profile}
    <button
      className="bg-slate-400 m-4 px-4 py-2 rounded"
      onClick={createRoom}
    >
      Create Room
    </button>
  </div>

  <div className="bg-gray-100 p-4">
    <p className="font-bold mb-2">From Low to High Ranking:</p>
    <ul className="list-disc pl-4">
      <li>Nothing — Five mismatched dice forming no sequence longer than four.</li>
      <li>Pair — Two dice showing the same value.</li>
      <li>Two Pairs — Two pairs of dice, each showing the same value.</li>
      <li>Three-of-a-Kind — Three dice showing the same value.</li>
      <li>Five High Straight — Dice showing values from 1 through 5, inclusive.</li>
      <li>Six High Straight — Dice showing values from 2 through 6, inclusive.</li>
      <li>Full House — Pair of one value and Three-of-a-Kind of another.</li>
      <li>Four-of-a-Kind — Four dice showing the same value.</li>
      <li>Five-of-a-Kind — All five dice showing the same value.</li>
    </ul>
  </div>

  <div className="flex gap-2 m-3">
    <input
      type="text"
      onChange={({ target }) => (roomIdInput = target.value)}
      className="border border-zinc-300 p-2"
    />

    <button
      onClick={() => joinRoom(roomIdInput)}
      className="bg-blue-500 text-white px-4 py-2 rounded"
    >
      Join Room
    </button>
  </div>
</div>

  )
}

export default page