import fetch from "node-fetch";

export async function handler(event) {
  try {
    const { prompt } = JSON.parse(event.body || "{}");

    if (!prompt) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "No prompt received" }),
      };
    }

    const apiRes = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: "You are DNA_WEB_AI. Reply in Hinglish."},
          { role: "user", content: prompt }
        ]
      }),
    });

    const raw = await apiRes.text();   // IMPORTANT
    let data;

    try {
      data = JSON.parse(raw);
    } catch {
      return {
        statusCode: 500,
        body: JSON.stringify({
          error: "OpenAI returned non-JSON",
          raw,
        }),
      };
    }

    return {
      statusCode: 200,
      body: JSON.stringify({
        reply: data?.choices?.[0]?.message?.content || "No AI reply",
      }),
    };

  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: "Server crash: " + err.message,
      }),
    };
  }
}
