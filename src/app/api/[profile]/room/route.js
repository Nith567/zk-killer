import { NextResponse } from 'next/server';
import prismadb from '@/app/lib/db';
export async function POST(req,{params}) {
  try {

    const { profile} = params;
    console.log(" lnaja ", profile)
    const createdRoom = await prismadb.gameRoom.create({
      data: {
        player1Id:profile,
      }
    });

    return new Response(createdRoom.id);
  } catch (error) {
    console.error('While creating room 1:', error);
    return new Response('Internal room  Server Error', { status: 500 });
  }
}




