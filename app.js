"use strict";

// T&T Studio — контент прежней витрины в неоморфном макете.
// Переключатель Товары/Услуги меняет только набор карточек (стиль один).

const MODES = {
  night: {
    tag: "РАЗРАБОТКА",
    lead: "Telegram-боты, AI-ассистенты, автоматизация и веб-платформы под ключ.",
    order: "Заказать",
    items: [
      { t: "Telegram Bot + AI", m: "15 дней", p: 45000, from: true, e: "🤖", q: "robot,technology" },
      { t: "Mini App / каталог", m: "20 дней", p: 60000, from: true, e: "📱", q: "smartphone,app" },
      { t: "CRM · автоматизация", m: "18 дней", p: 55000, from: true, e: "⚙️", q: "dashboard,technology" },
      { t: "Сайт / платформа", m: "25 дней", p: 90000, from: true, e: "🌐", q: "website,code" },
      { t: "AI-ассистент под задачу", m: "12 дней", p: 35000, from: true, e: "🧠", q: "neural,network" },
      { t: "Интеграции / API", m: "10 дней", p: 30000, from: true, e: "🔗", q: "network,server" },
      { t: "Чат-бот поддержки", m: "14 дней", p: 40000, from: true, e: "💬", q: "chat,support" },
      { t: "Лендинг под запуск", m: "8 дней", p: 25000, from: true, e: "🚀", q: "startup,launch" },
      { t: "Автоворонки продаж", m: "16 дней", p: 50000, from: true, e: "📈", q: "analytics,growth" },
    ],
  },
  day: {
    tag: "МАСТЕРСКАЯ",
    lead: "Ручная работа, кожа, техника и детали — то, что можно купить прямо сейчас.",
    order: "Купить",
    items: [
      { t: "Картхолдер Crazy Horse", m: "Кожа · Тиснение", p: 5000, e: "👜", q: "leather,wallet" },
      { t: "MacBook Air M2", m: "Б/У · Идеал", p: 78000, e: "💻", q: "macbook,laptop" },
      { t: "Тормозные колодки Bosch", m: "Новое · В наличии", p: 3200, e: "🚗", q: "car,brake" },
      { t: "Ремешок кожаный", m: "Ручная работа", p: 2400, e: "⌚", q: "watch,leather" },
      { t: "Кошелёк ручной работы", m: "Кожа · На заказ", p: 3500, e: "👛", q: "purse,leather" },
      { t: "iPhone 13 (б/у)", m: "Б/У · Идеал", p: 45000, e: "📱", q: "iphone,phone" },
      { t: "Наушники беспроводные", m: "Новое", p: 12000, e: "🎧", q: "headphones,audio" },
      { t: "Механическая клавиатура", m: "Custom", p: 9500, e: "⌨️", q: "keyboard,mechanical" },
      { t: "Рюкзак кожаный", m: "Ручная работа", p: 8000, e: "🎒", q: "leather,bag" },
    ],
  },
};

const el = (id) => document.getElementById(id);
const money = (n) => n.toLocaleString("ru-RU");
let cfg = { botUsername: "", channelUsername: "AITimPromptsLab", managerUsername: "Temurali_aliev" };
let cart = 0;

const tme = (h, payload) => {
  const u = (h || "").replace(/^@/, "");
  if (!u) return null;
  return payload ? `https://t.me/${u}?start=${payload}` : `https://t.me/${u}`;
};
const orderLink = () => tme(cfg.botUsername, "order") || tme(cfg.managerUsername) || "#";

async function loadConfig() {
  try {
    const r = await fetch("config.json");
    if (r.ok) cfg = { ...cfg, ...(await r.json()) };
  } catch (_) { /* defaults */ }
  const ch = tme(cfg.channelUsername), mg = tme(cfg.managerUsername);
  if (ch) el("footChannel").href = ch;
  if (mg) for (const id of ["footManager", "navManager", "ctaManager"]) el(id).href = mg;
}

function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
}

// ---------- render ----------
function render(modeKey) {
  const M = MODES[modeKey];
  document.documentElement.setAttribute("data-mode", modeKey);
  el("halfGoods").setAttribute("aria-selected", String(modeKey === "day"));
  el("halfServices").setAttribute("aria-selected", String(modeKey === "night"));
  el("eyebrowTag").textContent = M.tag;
  el("stageLead").textContent = M.lead;

  el("cards").innerHTML = M.items.map((it) => {
    const price = it.from
      ? `<span class="from">от</span>${money(it.p)}<span class="rub">₽</span>`
      : `${money(it.p)}<span class="rub">₽</span>`;
    const img = `https://loremflickr.com/600/450/${it.q}`;
    return `<article class="card">
      <div class="card-media">
        <img src="${img}" alt="${escapeHtml(it.t)}" loading="lazy"
             onerror="this.closest('.card-media').classList.add('noimg');this.remove()">
        <span class="media-emoji">${it.e}</span>
      </div>
      <div class="card-info">
        <h3 class="card-title">${escapeHtml(it.t)}</h3>
        <p class="card-meta">${escapeHtml(it.m)}</p>
        <div class="price">${price}</div>
        <div class="card-actions">
          <button class="plus" aria-label="Добавить в корзину">+</button>
          <a class="order" href="${orderLink()}" target="_blank" rel="noopener">${M.order}</a>
        </div>
      </div>
    </article>`;
  }).join("");
}

// ---------- cart ----------
function bumpCart() {
  cart += 1;
  const c = el("cartCount");
  c.textContent = String(cart);
  c.hidden = false;
}
document.addEventListener("click", (e) => {
  if (e.target.closest(".plus")) { e.preventDefault(); bumpCart(); }
  else if (e.target.closest(".order")) { bumpCart(); }
});
el("cartBtn").addEventListener("click", () => {
  const mg = tme(cfg.managerUsername);
  if (cart > 0 && mg) window.open(mg, "_blank", "noopener");
});

// ---------- switch ----------
el("halfGoods").addEventListener("click", () => render("day"));
el("halfServices").addEventListener("click", () => render("night"));
document.querySelectorAll("[data-mode-link]").forEach((a) => {
  a.addEventListener("click", () => render(a.dataset.modeLink));
});

// ---------- assistant ----------
el("askForm").addEventListener("submit", (e) => {
  e.preventDefault();
  const q = el("askInput").value.trim();
  const mg = tme(cfg.managerUsername);
  if (q && navigator.clipboard) {
    navigator.clipboard.writeText(q).then(() => { el("askHint").hidden = false; }).catch(() => {});
  }
  if (mg) window.open(mg, "_blank", "noopener");
});

// ---------- boot ----------
const startMode = (() => { const h = new Date().getHours(); return h >= 7 && h < 19 ? "day" : "night"; })();
loadConfig().then(() => render(startMode));
render(startMode);
