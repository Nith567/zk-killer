'use client'
import { pusherClient } from '@/app/lib/pusher'
import { FC, useEffect, useState } from 'react'

const Messages = ({ initialMessages, roomId }) => {
  const [incomingMessages, setIncomingMessages] = useState([]);

  useEffect(() => {
    pusherClient.subscribe(roomId);

    pusherClient.bind('incoming-message', (message) => {
      setIncomingMessages((prev) => [...prev, message]);
    });
  

    return () => {
      pusherClient.unsubscribe(roomId);
    };
  }, [roomId]);

 
  return (
    <div>
      {initialMessages.map((message) => (
        <p key={message.id}>{message.text}</p>
      ))}
      {incomingMessages.map((text, i) => (
        <p key={i}>{text}</p>
      ))}
    </div>
  )
}

export default Messages;
