import { defineEventHandler, readBody, createError } from 'h3'

export default defineEventHandler(async (event) => {
  const { tasks } = await readBody(event)
  if (!tasks) throw createError({ statusCode: 400, statusMessage: 'Tasks are required' })

  const apiKey = process.env.GROQ_API_KEY
  if (!apiKey || apiKey === 'gsk_your_groq_api_key') {
    return {
      summary: 'API key belum dikonfigurasi.',
      highlights: [],
      recommendation: 'Konfigurasi GROQ_API_KEY untuk mengaktifkan ringkasan harian.'
    }
  }

  const completed = tasks.filter(t => t.completed)
  const pending = tasks.filter(t => !t.completed)
  const overdue = pending.filter(t => t.dueDate && new Date(t.dueDate) < new Date())

  const taskContext = JSON.stringify({ completed, pending, overdue })

  try {
    const response = await $fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
      body: {
        model: 'llama-3.3-70b-versatile',
        messages: [
          {
            role: 'system',
            content: `Anda adalah asisten produktivitas personal. Buat ringkasan harian yang singkat, personal, dan memotivasi berdasarkan data tugas pengguna. Gunakan Bahasa Indonesia yang santai. Respons HANYA dengan JSON: { "summary": "kalimat pembuka ringkas (1-2 kalimat)", "highlights": ["poin penting 1", "poin penting 2", "poin penting 3"], "recommendation": "satu rekomendasi aksi untuk hari ini (1 kalimat)" }`
          },
          { role: 'user', content: `Data tugas hari ini: ${taskContext}` }
        ],
        response_format: { type: 'json_object' },
        temperature: 0.5
      }
    })

    const parsed = JSON.parse(response.choices[0].message.content)
    if (parsed.summary) return parsed
    throw new Error('Invalid response')
  } catch (err) {
    console.error('Summary error:', err)
    return {
      summary: 'Gagal membuat ringkasan.',
      highlights: [],
      recommendation: ''
    }
  }
})
