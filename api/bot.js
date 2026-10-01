export default async function handler(req, res) {
  if (req.method !== "POST") { res.status(200).send("ok"); return; }
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const origin = process.env.WEBAPP_URL || ("https://" + req.headers.host);
  const msg = (req.body || {}).message;
  if (!token || !msg) { res.status(200).json({ ok: true }); return; }
  const chatId = msg.chat.id;
  const text = (msg.text || "").trim();
  const keyboard = { keyboard: [[
    { text: "История", web_app: { url: origin + "/?start=history" } }
  ]], resize_keyboard: true };
  let reply = "Жми кнопку — откроется Mini App.";
  if (text === "/start") reply = "Кнопка «История» откроет Mini App.\nКалькулятор внутри окна.";
  await fetch("https://api.telegram.org/bot" + token + "/sendMessage", {
    method: "POST", headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ chat_id: chatId, text: reply, reply_markup: keyboard })
  });
  res.status(200).json({ ok: true });
}
