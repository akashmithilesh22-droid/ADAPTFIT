import Groq from 'groq-sdk';
import fs from 'fs';

async function test() {
  const env = fs.readFileSync('.env.local', 'utf8');
  const apiKey = env.match(/GROQ_API_KEY=([^\s]+)/)?.[1];
  
  console.log('Testing key:', apiKey?.substring(0, 10) + '...');
  if (!apiKey) {
    console.error('API Key not found in .env.local');
    return;
  }

  try {
    const groq = new Groq({ apiKey });
    const completion = await groq.chat.completions.create({
      messages: [{ role: 'user', content: 'hi' }],
      model: 'llama-3.3-70b-versatile',
    });
    console.log('Success:', completion.choices[0]?.message?.content);
  } catch (err) {
    console.error('Failed:', err.message);
  }
}
test();
