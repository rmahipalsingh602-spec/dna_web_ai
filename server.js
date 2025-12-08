const express = require("express");
const path = require("path");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

// STATIC FILES (frontend)
app.use(express.static(path.join(__dirname)));

// OpenAI API route
app.post("/api/chat", async (req, res) => {
    try {
        const userMessage = req.body.message;

        if (!process.env.OPENAI_API_KEY) {
            return res.json({ reply: "API key missing. Add OPENAI_API_KEY in Render Dashboard." });
        }

        const response = await fetch("https://api.openai.com/v1/chat/completions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`
            },
            body: JSON.stringify({
                model: "gpt-3.5-turbo",
                messages: [
                    { role: "system", content: "You are DNA Web AI Assistant." },
                    { role: "user", content: userMessage }
                ]
            })
        });

        const data = await response.json();
        res.json({ reply: data.choices?.[0]?.message?.content || "Error: no reply." });

    } catch (err) {
        res.json({ reply: "Server error: " + err.message });
    }
});

// DEFAULT ROUTE (index.html open karega)
app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "index.html"));
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log("Server running on port", port));
