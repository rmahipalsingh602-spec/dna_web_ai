const chatMessages = document.getElementById("chatMessages");
const input = document.getElementById("userInput");
const sendBtn = document.getElementById("sendBtn");

function addMessage(role, text) {
  const div = document.createElement("div");
  div.className = role === "user" ? "msg user" : "msg bot";
  div.innerText = text;
  chatMessages.appendChild(div);
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

async function sendMessage() {
  const text = input.value.trim();
  if (!text) return;

  addMessage("user", text);
  input.value = "";
  sendBtn.disabled = true;
  sendBtn.innerText = "Thinking…";

  try {
    const response = await fetch("/.netlify/functions/ai", {
      method: "POST",
      body: JSON.stringify({ prompt: text }),
    });

    const data = await response.json();
    addMessage("bot", data.reply || "AI error: No reply.");
  } catch (e) {
    addMessage("bot", "Backend error: " + e.message);
  }

  sendBtn.disabled = false;
  sendBtn.innerText = "Send ⚡";
}

sendBtn.addEventListener("click", sendMessage);

input.addEventListener("keydown", (e) => {
  if (e.key === "Enter") sendMessage();
});
