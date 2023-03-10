import './App.css';

import { isNil } from 'ramda';
import React, { useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';

import ChatContainer from './ChatContainer';
import { postPrompt } from './rpc';
import { ChatMessage } from './types';

const generateUniqueId = uuidv4;

function addChatMessages(
  messages: Array<ChatMessage>,
  newMessages: Array<ChatMessage> = []
) {
  return [...messages, ...newMessages];
}

function updateChatMessage(messages: Array<ChatMessage>, msg: ChatMessage) {
  return [
    ...messages.map((message: ChatMessage) =>
      message.uniqueId === msg.uniqueId
        ? {
            ...message,
            ...msg,
          }
        : message
    ),
  ];
}

interface AppState {
  userPrompt?: ChatMessage;
  aiResponse?: ChatMessage;
  messages: Array<ChatMessage>;
  prompt: string;
}

function App() {
  const [appState, setAppState] = React.useState<AppState>({
    messages: [],
    prompt: '',
  });

  useEffect(() => {
    const { aiResponse, messages, userPrompt } = appState;
    if (isNil(aiResponse) || isNil(userPrompt)) {
      return;
    }
    const prompt = userPrompt?.message || '';
    const aiResponseId = aiResponse?.uniqueId || '';
    postPrompt(prompt).then((data) => {
      if (data.status === 'error') {
        const { error } = data;
        console.warn(`WARN: unexpected ERROR: ${error}`);
        const newMessages = updateChatMessage(messages, {
          message: error,
          uniqueId: aiResponseId,
          isLoading: false,
          isAI: true,
        });
        setAppState({ prompt: appState.prompt, messages: newMessages });
        return;
      }
      console.log(`DEBUG:App:uE:postPrompt:response: `, {
        data,
        prompt,
        userPrompt,
        aiResponse,
        messages,
      });
      const { message } = data;
      const newMessages = updateChatMessage(messages, {
        message,
        uniqueId: aiResponseId,
        isLoading: false,
        isAI: true,
      });
      setAppState({ prompt: appState.prompt, messages: newMessages });
    });
  }, [appState]);

  const handleSubmit = React.useCallback(
    (e) => {
      e.preventDefault();
      const { messages, prompt } = appState;
      const userPrompt: ChatMessage = {
        message: prompt,
        uniqueId: generateUniqueId(),
      };
      const aiResponse: ChatMessage = {
        isAI: true,
        isLoading: true,
        message: '...loading',
        uniqueId: generateUniqueId(),
      };
      const newMessages = addChatMessages(messages, [userPrompt, aiResponse]);
      console.log(
        `DEBUG:App:handleSubmit: aiUniqueId: ${aiResponse.uniqueId}`,
        {
          prompt,
          userPrompt,
          aiResponse,
        }
      );
      setAppState({
        ...appState,
        prompt: '',
        userPrompt,
        aiResponse,
        messages: newMessages,
      });
    },
    [appState]
  );

  return (
    <>
      <ChatContainer messages={appState.messages} />
      <form className='chat_form' onSubmit={handleSubmit}>
        <textarea
          className='prompt_textarea'
          name='prompt'
          rows={1}
          cols={1}
          placeholder='Ask codex...'
          onChange={(e) => {
            setAppState({ ...appState, prompt: e.target.value });
          }}
          value={appState.prompt}
        />
        <button className='prompt_submit_button' type='submit'>
          <img src='assets/send.svg' alt='send' />
        </button>
      </form>
    </>
  );
}

export default App;
