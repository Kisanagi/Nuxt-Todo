import { defineEventHandler, readBody, createError } from 'h3'

export default defineEventHandler(async (event) => {
  const { title } = await readBody(event)
  if (!title) throw createError({ statusCode: 400, statusMessage: 'Title is required' })

  const apiKey = process.env.GROQ_API_KEY
  if (!apiKey || apiKey === 'gsk_your_groq_api_key') {
    return { improved: title, explanation: 'API key belum dikonfigurasi.' }
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
            content: `Anda adalah asisten produktivitas. Ubah judul tugas yang ambigu menjadi lebih spesifik, jelas, dan actionable. Gunakan kata kerja aktif. Tetap singkat (maks 10 kata). Gunakan Bahasa Indonesia. Respons HANYA dengan JSON: { "improved": "judul yang diperbaiki", "explanation": "alasan perubahan singkat (maks 10 kata)" }`
          },
          { role: 'user', content: `Perbaiki judul tugas ini: "${title}"` }
        ],
        response_format: { type: 'json_object' },
        temperature: 0.3
      }
    })

    const parsed = JSON.parse(response.choices[0].message.content)
    if (parsed.improved) return parsed
    throw new Error('Invalid response')
  } catch (err) {
    console.error('Improve title error:', err)
    return { improved: title, explanation: 'Gagal memproses perbaikan judul.' }
  }
})
