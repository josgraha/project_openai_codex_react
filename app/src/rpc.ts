const endpointUrl =
  process.env.REACT_APP_ENDPOINT_URL || 'https://codex-im0y.onrender.com';

export interface ResponsePayload {
  error?: string;
  status: 'error' | 'success';
  message?: string;
}

export async function postPrompt(prompt: string): Promise<ResponsePayload> {
  const response = await fetch(endpointUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      prompt,
    }),
  });
  if (!response.ok) {
    const error = await response.text();
    console.warn(`WARN:rpc:postPrompt: ERROR: ${error}`, { error, prompt });
    return { error, status: 'error' };
  }
  const data = await response.json();
  console.log(`DEBUG:rpc:postPrompt:response: `, { data, prompt });
  const message = data.bot.trim();
  return { message, status: 'success' };
}
