module.exports = async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { prompt } = req.body || {};
  if (!prompt || typeof prompt !== "string" || prompt.length > 8000) {
    return res.status(400).json({ error: "Prompt tidak valid" });
  }

  try {
    const r = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-3.8-flash:generateContent",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-goog-api-key": process.env.GEMINI_API_KEY,
        },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
        }),
      }
    );

    const data = await r.json();
    if (!r.ok) return res.status(r.status).json({ error: data });

    const text =
      data.candidates?.[0]?.content?.parts?.map((p) => p.text || "").join("") || "";
    return res.status(200).json({ result: text });
  } catch (e) {
    return res.status(500).json({ error: "Gagal menghubungi AI" });
  }
};
