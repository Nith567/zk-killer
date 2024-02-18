import prismadb from '@/app/lib/db';
import { pusherServer } from '@/app/lib/pusher';

export async function POST(req) {
  const { text, roomId} = await req.json()

pusherServer.trigger(roomId, 'incoming-message', text)
console.log("yaya ,", text)
  const tk =await prismadb.game.create({
    data: {
      text: text,
      gameRoomId: roomId,
    },
  })

  return new Response(tk);
}