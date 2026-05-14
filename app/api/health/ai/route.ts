import { NextResponse } from 'next/server'
import Groq from 'groq-sdk'

export async function GET() {
  const apiKey = process.env.GROQ_API_KEY
  const modelName = 'llama-3.3-70b-versatile'

  if (!apiKey) {
    return NextResponse.json({
      success: false,
      model: modelName,
      error: 'GROQ_API_KEY is not configured in environment variables.',
    }, { status: 500 })
  }

  try {
    const groq = new Groq({ apiKey })
    
    // Minimal test prompt
    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: 'user',
          content: 'Say the exact word "OK"'
        }
      ],
      model: modelName,
      max_tokens: 10
    })

    const responseText = completion.choices[0]?.message?.content || ''

    return NextResponse.json({
      success: true,
      model: modelName,
      response: responseText.trim(),
      error: null
    })
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      model: modelName,
      error: error?.message || String(error),
      fullError: error
    }, { status: 500 })
  }
}
