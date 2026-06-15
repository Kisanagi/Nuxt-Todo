import { defineEventHandler, readBody, createError } from "h3";

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const { title } = body;

  if (!title || typeof title !== "string") {
    throw createError({
      statusCode: 400,
      statusMessage: "Task title is required and must be a string.",
    });
  }

  const apiKey = process.env.GROQ_API_KEY;

  if (!apiKey || apiKey === "gsk_your_groq_api_key") {
    // Fallback Mock Mode jika API Key belum dikonfigurasi
    console.warn("Groq API Key not set, using simulated mock subtasks.");
    return {
      subtasks: [
        {
          title: `Analisis kebutuhan awal untuk "${title}"`,
          duration_minutes: 15,
        },
        { title: `Persiapkan alat dan bahan pendukung`, duration_minutes: 20 },
        {
          title: `Eksekusi langkah utama tugas "${title}"`,
          duration_minutes: 30,
        },
        {
          title: `Review hasil pekerjaan dan lakukan penyempurnaan`,
          duration_minutes: 15,
        },
      ],
    };
  }

  try {
    const response = await $fetch(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: {
          model: "llama-3.3-70b-versatile",
          messages: [
            {
              role: "system",
              content: `Anda adalah seorang pelatih produktivitas profesional. Tugas Anda adalah memecah tujuan pengguna menjadi langkah-langkah yang jelas, berurutan, dan dapat ditindaklanjuti. Tentukan sendiri jumlah langkah yang paling sesuai berdasarkan kompleksitas tujuan — tujuan sederhana cukup 3-4 langkah, tujuan yang lebih kompleks bisa 6-8 langkah, tujuan besar seperti belajar skill baru bisa sampai 10 langkah. Setiap langkah harus spesifik, actionable, dan memiliki estimasi durasi dalam menit. Anda WAJIB menuliskan seluruh deskripsi langkah dalam Bahasa Indonesia. Anda WAJIB merespons HANYA dengan objek JSON valid dalam format berikut: { "subtasks": [ { "title": "deskripsi langkah di sini", "duration_minutes": 15 } ] }`,
            },
            {
              role: "user",
              content: `Break down this task: "${title}"`,
            },
          ],
          response_format: { type: "json_object" },
          temperature: 0.2,
        },
      },
    );

    if (response && response.choices && response.choices[0]) {
      const content = response.choices[0].message.content;
      const parsed = JSON.parse(content);
      if (parsed && Array.isArray(parsed.subtasks)) {
        return parsed;
      }
    }

    throw new Error("Invalid response structure from Groq API");
  } catch (error) {
    console.error("Groq API error:", error);
    // Fallback jika terjadi kegagalan pemanggilan API
    return {
      subtasks: [
        { title: `Riset cara memulai "${title}"`, duration_minutes: 20 },
        { title: `Buat draft atau kerangka kerja`, duration_minutes: 25 },
        {
          title: `Selesaikan bagian inti dari "${title}"`,
          duration_minutes: 45,
        },
        { title: `Periksa kembali kualitas hasil akhir`, duration_minutes: 15 },
      ],
    };
  }
});
