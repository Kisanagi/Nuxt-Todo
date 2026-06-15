import { defineEventHandler, readBody, createError } from 'h3'

export default defineEventHandler(async (event) => {
  const { title } = await readBody(event)
  if (!title) throw createError({ statusCode: 400, statusMessage: 'Title is required' })

  const apiKey = process.env.GROQ_API_KEY
  if (!apiKey || apiKey === 'gsk_your_groq_api_key') {
    return { priority: 'medium', reason: 'API key belum dikonfigurasi.' }
  }

  try {
    const response = await $fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
      body: {
        model: 'llama-3.3-70b-versatile',
        messages: [
          {
            role: 'system',
            content: `Anda adalah sistem klasifikasi prioritas tugas. Analisis judul tugas dan tentukan prioritasnya. Respons HANYA dengan JSON valid: { "priority": "high"|"medium"|"low", "reason": "alasan singkat dalam bahasa Indonesia (maks 8 kata)" }`
          },
          { role: 'user', content: `Tugas: "${title}"` }
        ],
        response_format: { type: 'json_object' },
        temperature: 0.1
      }
    })

    const parsed = JSON.parse(response.choices[0].message.content)
    if (['high', 'medium', 'low'].includes(parsed.priority)) return parsed
    throw new Error('Invalid priority value')
  } catch (err) {
    console.error('Prioritize error:', err)
    return { priority: 'medium', reason: 'Gagal menganalisis prioritas.' }
  }
})
