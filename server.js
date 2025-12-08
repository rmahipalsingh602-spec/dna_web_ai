import express from "express";
import fetch from "node-fetch";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

// Home Route
app.get("/", (req, res) => {
  res.send("DNA_WEB_AI Backend Running Successfully! 🚀");
});

// AI Chat Route
app.post("/api/chat", async (req, res) => {
  try {
    const { message } = req.body;

    if (!process.env.OPENAI_API_KEY) {
      return res.status(500).json({ error: "API key missing on server" });
    }

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: message }],
      }),
    });

    const json = await response.json();

    if (!json.choices || !json.choices.length) {
      return res.status(500).json({ error: "Invalid response from AI API" });
    }

    res.json({
      reply: json.choices[0].message.content,
    });

  } catch (err) {
    console.error("Backend Error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// Render/Netlify Port Handling
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log("Backend running on port:", PORT);
});
