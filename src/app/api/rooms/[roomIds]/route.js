import { NextResponse } from 'next/server';
import prismadb from '@/app/lib/db';
export async function GET(req ,{params}) {
  try {

    const {roomIds}=params;
  const gameRoom = await prismadb.gameRoom.findUnique({
    where: { id: roomIds},
    include: {
      player1: { select: { email: true,eoa:true,refreshToken:true } },
      player2: { select: { email: true,eoa:true,refreshToken:true } },
    },
  });
  if (!gameRoom) {
    return res.status(404).json({ error: 'Room not found' });
  }
  return NextResponse.json(gameRoom )
  } catch (error) {
    console.error('While creating rooms roomidsdf:', error);
    return new Response('Internal room  Server Error', { status: 500 });
  }
}

export async function PATCH(req,{ params }) {
  try {
    const body = await req.json();
    const { profile } = body;

    const { roomIds } = params;
    console.log({ profile });

    const existingRoom = await prismadb.gameRoom.update({
      where: { id: params.roomIds },
      data: {
        player2Id: profile
      },
    });

    return new Response(existingRoom);
  } catch (error) {
    console.error('While creating profile lo room:', error);
    return new NextResponse('Internal room  Server Error', { status: 500 });
  }
  }