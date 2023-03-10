import React from 'react';

import LoadingEllipsis from './LoadingEllipsis';
import { ChatMessage } from './types';

const bot = 'assets/bot.svg';
const user = 'assets/user.svg';

interface Props {
  message: ChatMessage;
}

export default function ChatStripe({ message }: Props) {
  const { isAI = false, isLoading = false, message: value } = message;
  return (
    <div className="wrapper ${isAi && 'ai'}">
      <div className='chat'>
        <div className='profile'>
          <img src={isAI ? bot : user} alt={isAI ? 'bot' : 'user'} />
        </div>
        <div className='message'>{isLoading ? <LoadingEllipsis /> : value}</div>
      </div>
    </div>
  );
}
