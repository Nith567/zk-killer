import prismadb from '@/app/lib/db';
import GameInput from '@/components/GameInput';
import Messages from '@/components/Messages';
import dynamic from 'next/dynamic';
export default async function page({params}) {
      const {roomId}=params;

  const GameInput = dynamic(() => import('@/components/GameInput'), { ssr: false });
  const Messages = dynamic(() => import('@/components/Messages'), { ssr: false });

  const existingMessages = await prismadb.game.findMany({
    where: {
      gameRoomId: roomId,
    },
  })
  const gcount = async () => {
    const count = await prismadb.gameRoom.count();
    const incrementedCount = count + 1;
    console.log(`Number of game rooms: ${incrementedCount}`);
    return incrementedCount;
  };

  const serializedMessages = existingMessages.map((message) => ({
    text: message.text,
    id: message.id,
  }))

  return (
    <div>
      const 

      <div>
      <GameInput roomId={roomId} count={await gcount()} />
      <Messages roomId={roomId} initialMessages={serializedMessages} />
    </div>
    </div>
  )
}
