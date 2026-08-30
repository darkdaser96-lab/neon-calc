const store = globalThis.__neonHist || (globalThis.__neonHist = {});
function when(ts) {
  try { return new Date(ts).toLocaleString("ru-RU", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" }); }
  catch (e) { return ""; }
}
function listHist(userId) {
  const items = store[String(userId)] || [];
  if (!items.length) return "📭 Пока пусто.\nОткрой калькулятор, посчитай и нажми =.\nСюда прилетят дата, пример и ответ.";
  return "📜 Твоя история\n\n" + items.map(function (x, i) { return (i + 1) + ". 🗓️ " + when(x.ts) + "\n   🔢 " + x.expr + "\n   ✨ = " + x.result; }).join("\n\n");
}
export default async function handler(req, res) {
  if (req.method !== "POST") { res.status(200).send("ok"); return; }
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const origin = (process.env.WEBAPP_URL || ("https://" + req.headers.host)).replace(/\/$/, "");
  const msg = (req.body || {}).message;
  if (!token || !msg) { res.status(200).json({ ok: true }); return; }
  const chatId = msg.chat.id;
  const text = (msg.text || "").trim();
  const keyboard = { keyboard: [[{ text: "История" }, { text: "Кубик" }]], resize_keyboard: true };
  const openCalc = { inline_keyboard: [[{ text: "Открыть калькулятор", web_app: { url: origin } }]] };
  let reply = "Жми кнопки внизу или открой калькулятор.";
  let extra = keyboard;
  if (text === "/start") { reply = "👋 Неоновый калькулятор\n\n🧮 кнопка в сообщении — окно\n📜 История — дата, пример, ответ\n🎲 Кубик — 1–100"; extra = openCalc; }
  else if (text === "Кубик") { reply = "🎲 Кубик выпал: " + (1 + Math.floor(Math.random() * 100)); extra = keyboard; }
  else if (text === "История") { reply = listHist(chatId); extra = openCalc; }
  await fetch("https://api.telegram.org/bot" + token + "/sendMessage", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ chat_id: chatId, text: reply, reply_markup: extra }) });
  if (text === "/start") {
    await fetch("https://api.telegram.org/bot" + token + "/sendMessage", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ chat_id: chatId, text: "Кнопки бота:", reply_markup: keyboard }) });
  }
  res.status(200).json({ ok: true });
}
