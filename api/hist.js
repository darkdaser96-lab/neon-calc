const store = globalThis.__neonHist || (globalThis.__neonHist = {});
function when(ts) {
  try { return new Date(ts).toLocaleString("ru-RU", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" }); }
  catch (e) { return ""; }
}
export default async function handler(req, res) {
  if (req.method !== "POST") { res.status(200).json({ ok: true }); return; }
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const body = req.body || {};
  const userId = body.userId;
  if (!userId || !body.expr) { res.status(200).json({ ok: false }); return; }
  const item = { expr: String(body.expr), result: String(body.result), ts: body.ts || Date.now() };
  const key = String(userId);
  if (!store[key]) store[key] = [];
  store[key].unshift(item);
  store[key] = store[key].slice(0, 30);
  if (token) {
    const text = "🧮 Новое вычисление\n🗓️ " + when(item.ts) + "\n🔢 " + item.expr + "\n✨ = " + item.result;
    await fetch("https://api.telegram.org/bot" + token + "/sendMessage", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ chat_id: userId, text: text }) });
  }
  res.status(200).json({ ok: true });
}
