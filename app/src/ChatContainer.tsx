import React, { useEffect } from 'react';

import ChatStripe from './ChatStripe';
import { ChatMessage } from './types';

interface Props {
  messages: Array<ChatMessage>;
}

export default function ChatContainer({ messages }: Props) {
  const chatContainerRef = React.useRef<any>();
  useEffect(() => {
    const chatContainer = chatContainerRef.current;
    if (!chatContainer || !chatContainer.scrollHeight) {
      return;
    }
    chatContainer.scrollTop = chatContainer.scrollHeight;
  }, []);
  return (
    <div className='chat_container' ref={chatContainerRef}>
      {messages.map((message) => (
        <ChatStripe key={message.uniqueId} message={message} />
      ))}
    </div>
  );
}
