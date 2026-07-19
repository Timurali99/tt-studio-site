"use strict";

// T&T Studio — контент прежней витрины в неоморфном макете.
// Переключатель Товары/Услуги меняет только набор карточек (стиль один).

const MODES = {
  night: {
    tag: "РАЗРАБОТКА",
    lead: "Telegram-боты, AI-ассистенты, автоматизация и веб-платформы под ключ.",
    order: "Заказать",
    items: [
      { t: "Telegram Bot + AI", m: "15 дней", p: 45000, from: true, e: "🤖", kj: "術" },
      { t: "Mini App / каталог", m: "20 дней", p: 60000, from: true, e: "📱", kj: "網" },
      { t: "CRM · автоматизация", m: "18 дней", p: 55000, from: true, e: "⚙️", kj: "録" },
      { t: "Сайт / платформа", m: "25 дней", p: 90000, from: true, e: "🌐", kj: "道" },
      { t: "AI-ассистент под задачу", m: "12 дней", p: 35000, from: true, e: "🧠", kj: "知" },
      { t: "Интеграции / API", m: "10 дней", p: 30000, from: true, e: "🔗", kj: "系" },
      { t: "Чат-бот поддержки", m: "14 дней", p: 40000, from: true, e: "💬", kj: "助" },
      { t: "Лендинг под запуск", m: "8 дней", p: 25000, from: true, e: "🚀", kj: "昇" },
      { t: "Автоворонки продаж", m: "16 дней", p: 50000, from: true, e: "📈", kj: "財" },
    ],
  },
  day: {
    tag: "МАСТЕРСКАЯ",
    lead: "Ручная работа, кожа, техника и детали — то, что можно купить прямо сейчас.",
    order: "Купить",
    items: [
      { t: "Картхолдер Crazy Horse", m: "Кожа · Тиснение", p: 5000, e: "👜", kj: "財" },
      { t: "MacBook Air M2", m: "Б/У · Идеал", p: 78000, e: "💻", kj: "機" },
      { t: "Тормозные колодки Bosch", m: "Новое · В наличии", p: 3200, e: "🚗", kj: "車" },
      { t: "Ремешок кожаный", m: "Ручная работа", p: 2400, e: "⌚", kj: "時" },
      { t: "Кошелёк ручной работы", m: "Кожа · На заказ", p: 3500, e: "👛", kj: "鞄" },
      { t: "iPhone 13 (б/у)", m: "Б/У · Идеал", p: 45000, e: "📱", kj: "電" },
      { t: "Наушники беспроводные", m: "Новое", p: 12000, e: "🎧", kj: "音" },
      { t: "Механическая клавиатура", m: "Custom", p: 9500, e: "⌨️", kj: "鍵" },
      { t: "Рюкзак кожаный", m: "Ручная работа", p: 8000, e: "🎒", kj: "包" },
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
    return `<article class="card">
      <div class="card-media">
        <span class="media-kj" aria-hidden="true">${it.kj}</span>
        <span class="media-well"><span class="media-emoji">${it.e}</span></span>
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

// ---------- фон: медленный «дождь» из мелких иероглифов ----------
// Требование: глифы мелкие, текут медленно, при желании читаются.
(() => {
  const POOL = "道令号変信起能言系術網録知財機車時電匠手品心価導礼義徳華宝助昇音鍵包".split("");
  const cv = el("glyphrain");
  if (!cv) return;
  const ctx = cv.getContext("2d");
  const FONT = 11;          // мелкий кегль
  const COL_W = 22;         // шаг колонок
  const ROW_H = 18;         // шаг глифов в колонке
  let cols = [];

  function size() {
    cv.width = innerWidth * devicePixelRatio;
    cv.height = innerHeight * devicePixelRatio;
    ctx.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0);
    cols = Array.from({ length: Math.ceil(innerWidth / COL_W) + 1 }, (_, i) => ({
      x: i * COL_W + 6,
      y: Math.random() * ROW_H,
      v: 0.08 + Math.random() * 0.18,          // медленное течение
      a: 0.03 + Math.random() * 0.05,          // едва заметная плотность
      glyphs: Array.from({ length: Math.ceil(innerHeight / ROW_H) + 2 },
        () => POOL[(Math.random() * POOL.length) | 0]),
    }));
  }

  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  function draw() {
    ctx.clearRect(0, 0, innerWidth, innerHeight);
    ctx.font = `500 ${FONT}px "Hiragino Sans","Noto Sans JP",sans-serif`;
    for (const c of cols) {
      c.y += c.v;
      if (c.y >= ROW_H) {              // бесшовный сдвиг колонки на один ряд вниз
        c.y -= ROW_H;
        c.glyphs.unshift(c.glyphs.pop());
      }
      for (let r = 0; r < c.glyphs.length; r++) {
        const y = r * ROW_H + c.y;
        ctx.fillStyle = `rgba(90, 96, 108, ${c.a})`;
        ctx.fillText(c.glyphs[r], c.x, y);
      }
      // редкая смена одного глифа, чтобы «жило», но оставалось читаемым
      if (Math.random() < 0.004) {
        c.glyphs[(Math.random() * c.glyphs.length) | 0] = POOL[(Math.random() * POOL.length) | 0];
      }
    }
    if (!reduce) requestAnimationFrame(draw);
  }

  addEventListener("resize", size);
  size();
  draw();
})();

// ---------- boot ----------
const startMode = (() => { const h = new Date().getHours(); return h >= 7 && h < 19 ? "day" : "night"; })();
loadConfig().then(() => render(startMode));
render(startMode);
