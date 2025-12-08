// -------------------------------
// FINAL server.js (Render + Local)
// -------------------------------

import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import fetch from "node-fetch";

const app = express();
app.use(express.json());

// Path setup
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ---------------------------
// 🤖 AI API ROUTE (IMPORTANT)
// ---------------------------
app.post("/api/chat", async (req, res) => {
  try {
    const userMsg = req.body.message;

    const apiRes = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: "You are DNA — a helpful Hindi+English+Marwadi AI assistant." },
          { role: "user", content: userMsg }
        ]
      })
    });

    const data = await apiRes.json();
    res.json({
      reply: data.choices?.[0]?.message?.content || "Error: No response from AI"
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Backend crashed or API key missing." });
  }
});

// ---------------------------
// STATIC FILE SERVE (IMPORTANT)
// ---------------------------
app.use(express.static(__dirname));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

// ---------------------------
// START SERVER
// ---------------------------
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
