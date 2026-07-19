"use strict";

// T&T Studio — контент прежней витрины в неоморфном макете.
// Скидки: поле sale (%) — старая цена зачёркивается и в каталоге, и в модалке,
// промокод генерируется при открытии товара, чтобы скидка ощущалась «живой».

const MODES = {
  night: {
    tag: "РАЗРАБОТКА",
    lead: "Telegram-боты, AI-ассистенты, автоматизация и веб-платформы под ключ.",
    order: "Заказать",
    items: [
      { id: "bot-ai", t: "Telegram Bot + AI", m: "15 дней", p: 45000, from: true, e: "🤖", kj: "術", sale: 0 },
      { id: "miniapp", t: "Mini App / каталог", m: "20 дней", p: 60000, from: true, e: "📱", kj: "網", sale: 0 },
      { id: "crm", t: "CRM · автоматизация", m: "18 дней", p: 55000, from: true, e: "⚙️", kj: "録", sale: 0 },
      { id: "site", t: "Сайт / платформа", m: "25 дней", p: 90000, from: true, e: "🌐", kj: "道", sale: 0 },
      { id: "ai-custom", t: "AI-ассистент под задачу", m: "12 дней", p: 35000, from: true, e: "🧠", kj: "知", sale: 0 },
      { id: "api", t: "Интеграции / API", m: "10 дней", p: 30000, from: true, e: "🔗", kj: "系", sale: 0 },
      { id: "support-bot", t: "Чат-бот поддержки", m: "14 дней", p: 40000, from: true, e: "💬", kj: "助", sale: 0 },
      { id: "landing", t: "Лендинг под запуск", m: "8 дней", p: 25000, from: true, e: "🚀", kj: "昇", sale: 20 },
      { id: "funnel", t: "Автоворонки продаж", m: "16 дней", p: 50000, from: true, e: "📈", kj: "財", sale: 0 },
    ],
  },
  day: {
    tag: "МАСТЕРСКАЯ",
    lead: "Ручная работа, кожа, техника и детали — то, что можно купить прямо сейчас.",
    order: "Купить",
    items: [
      { id: "cardholder", t: "Картхолдер Crazy Horse", m: "Кожа · Тиснение", p: 5000, e: "👜", kj: "財", sale: 15 },
      { id: "macbook", t: "MacBook Air M2", m: "Б/У · Идеал", p: 78000, e: "💻", kj: "機", sale: 8 },
      { id: "bosch", t: "Тормозные колодки Bosch", m: "Новое · В наличии", p: 3200, e: "🚗", kj: "車", sale: 0 },
      { id: "strap", t: "Ремешок кожаный", m: "Ручная работа", p: 2400, e: "⌚", kj: "時", sale: 15 },
      { id: "wallet", t: "Кошелёк ручной работы", m: "Кожа · На заказ", p: 3500, e: "👛", kj: "鞄", sale: 15 },
      { id: "iphone", t: "iPhone 13 (б/у)", m: "Б/У · Идеал", p: 45000, e: "📱", kj: "電", sale: 0 },
      { id: "headphones", t: "Наушники беспроводные", m: "Новое", p: 12000, e: "🎧", kj: "音", sale: 10 },
      { id: "keyboard", t: "Механическая клавиатура", m: "Custom", p: 9500, e: "⌨️", kj: "鍵", sale: 0 },
      { id: "backpack", t: "Рюкзак кожаный", m: "Ручная работа", p: 8000, e: "🎒", kj: "包", sale: 15 },
    ],
  },
};

const el = (id) => document.getElementById(id);
const money = (n) => Math.round(n).toLocaleString("ru-RU");
const salePrice = (it) => it.sale ? Math.round(it.p * (1 - it.sale / 100)) : it.p;
const findItem = (id) => [...MODES.day.items, ...MODES.night.items].find((i) => i.id === id);
const modeOf = (id) => MODES.day.items.some((i) => i.id === id) ? "day" : "night";
let cfg = { botUsername: "", channelUsername: "AITimPromptsLab", managerUsername: "Temurali_aliev" };

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
  if (mg) for (const id of ["footManager", "ctaManager"]) el(id).href = mg;
}

function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
}

function priceHtml(it, big) {
  const cur = salePrice(it);
  const from = it.from ? `<span class="from">от</span>` : "";
  const old = it.sale ? `<span class="price-old">${money(it.p)} ₽</span>` : "";
  const badge = (it.sale && !big) ? "" : "";
  return `${old}${from}${money(cur)}<span class="rub">₽</span>${badge}`;
}

// ---------- render каталога ----------
function render(modeKey) {
  const M = MODES[modeKey];
  document.documentElement.setAttribute("data-mode", modeKey);
  el("halfGoods").setAttribute("aria-selected", String(modeKey === "day"));
  el("halfServices").setAttribute("aria-selected", String(modeKey === "night"));
  el("eyebrowTag").textContent = M.tag;
  el("stageLead").textContent = M.lead;

  el("cards").innerHTML = M.items.map((it) => `
    <article class="card" data-id="${it.id}">
      <div class="card-media">
        ${it.sale ? `<span class="sale-badge">−${it.sale}%</span>` : ""}
        <span class="media-kj" aria-hidden="true">${it.kj}</span>
        <span class="media-well"><span class="media-emoji">${it.e}</span></span>
      </div>
      <div class="card-info">
        <h3 class="card-title">${escapeHtml(it.t)}</h3>
        <p class="card-meta">${escapeHtml(it.m)}</p>
        <div class="price">${priceHtml(it)}</div>
        <div class="card-actions">
          <button class="plus" aria-label="Добавить в корзину">+</button>
          <a class="order" href="${orderLink()}" target="_blank" rel="noopener">${M.order}</a>
        </div>
      </div>
    </article>`).join("");
}

// ---------- корзина (настоящая, с суммой; живёт в localStorage) ----------
let cart = [];
try { cart = JSON.parse(localStorage.getItem("tt-cart") || "[]"); } catch (_) { cart = []; }

function saveCart() {
  try { localStorage.setItem("tt-cart", JSON.stringify(cart)); } catch (_) {}
  const c = el("cartCount");
  c.textContent = String(cart.length);
  c.hidden = cart.length === 0;
}
function addToCart(id) {
  const it = findItem(id);
  if (it) { cart.push(id); saveCart(); }
}
function renderCart() {
  const items = cart.map((id) => findItem(id)).filter(Boolean);
  const total = items.reduce((s, it) => s + salePrice(it), 0);
  el("cartItems").innerHTML = items.map((it, i) => `
    <div class="cart-item">
      <span class="cart-item-emoji">${it.e}</span>
      <span class="cart-item-name">${escapeHtml(it.t)}</span>
      <span class="cart-item-price">${money(salePrice(it))} ₽</span>
      <button class="cart-item-remove" data-i="${i}" aria-label="Убрать">✕</button>
    </div>`).join("");
  el("cartSum").textContent = `${money(total)} ₽`;
  const has = items.length > 0;
  el("cartTotal").hidden = !has;
  el("cartEmpty").hidden = has;
  el("cartClear").hidden = !has;
  el("cartCheckout").hidden = !has;
}
function openCart() { renderCart(); el("cartDrawer").hidden = false; }

el("cartBtn").addEventListener("click", openCart);
el("cartClose").addEventListener("click", () => { el("cartDrawer").hidden = true; });
el("cartItems").addEventListener("click", (e) => {
  const b = e.target.closest(".cart-item-remove");
  if (b) { cart.splice(+b.dataset.i, 1); saveCart(); renderCart(); }
});
el("cartClear").addEventListener("click", () => { cart = []; saveCart(); renderCart(); });
el("cartCheckout").addEventListener("click", () => {
  const items = cart.map((id) => findItem(id)).filter(Boolean);
  const total = items.reduce((s, it) => s + salePrice(it), 0);
  const text = "Здравствуйте! Хочу оформить заказ:\n" +
    items.map((it) => `• ${it.t} — ${money(salePrice(it))} ₽`).join("\n") +
    `\nИтого: ${money(total)} ₽`;
  if (navigator.clipboard) navigator.clipboard.writeText(text).catch(() => {});
  const mg = tme(cfg.managerUsername);
  if (mg) window.open(mg, "_blank", "noopener");
});

// ---------- модалка товара с промокодом ----------
function promoCode() {
  const abc = "ABCDEFGHKMNPRSTUVWXYZ23456789";
  let s = "";
  for (let i = 0; i < 4; i++) s += abc[(Math.random() * abc.length) | 0];
  return "TT-" + s;
}
let currentProduct = null;

function openProduct(id) {
  const it = findItem(id);
  if (!it) return;
  currentProduct = it;
  const M = MODES[modeOf(id)];
  el("pmKj").textContent = it.kj;
  el("pmEmoji").textContent = it.e;
  el("pmTag").textContent = M.tag;
  el("pmTitle").textContent = it.t;
  el("pmMeta").textContent = it.m;
  el("pmPrice").innerHTML = it.sale
    ? `<span class="price-old">${money(it.p)} ₽</span>${it.from ? "от " : ""}${money(salePrice(it))} ₽<span class="sale-badge">−${it.sale}%</span>`
    : `${it.from ? "от " : ""}${money(it.p)} ₽`;
  const hasSale = it.sale > 0;
  el("pmPromo").hidden = !hasSale;
  if (hasSale) {
    el("pmPromoCode").textContent = promoCode();
    const hint = el("pmPromoHint");
    hint.textContent = "нажмите — скопируется";
    hint.classList.remove("copied");
  }
  el("pmOrder").href = orderLink();
  el("pmOrder").textContent = M.order;
  el("productModal").hidden = false;
}

el("pmClose").addEventListener("click", () => { el("productModal").hidden = true; });
el("pmAdd").addEventListener("click", () => {
  if (currentProduct) { addToCart(currentProduct.id); el("productModal").hidden = true; openCart(); }
});
el("pmPromoCode").addEventListener("click", () => {
  const code = el("pmPromoCode").textContent;
  if (navigator.clipboard) navigator.clipboard.writeText(code).catch(() => {});
  const hint = el("pmPromoHint");
  hint.textContent = "скопировано ✓";
  hint.classList.add("copied");
});
document.querySelectorAll(".overlay").forEach((o) =>
  o.addEventListener("click", (e) => { if (e.target === o) o.hidden = true; }));
addEventListener("keydown", (e) => {
  if (e.key === "Escape") document.querySelectorAll(".overlay").forEach((o) => { o.hidden = true; });
});

// клики по карточкам каталога: карточка → модалка, «+» → корзина, заказ → Telegram
el("cards").addEventListener("click", (e) => {
  const plus = e.target.closest(".plus");
  const order = e.target.closest(".order");
  const card = e.target.closest(".card");
  if (plus && card) { e.preventDefault(); addToCart(card.dataset.id); return; }
  if (order) return; // обычная ссылка в Telegram
  if (card) openProduct(card.dataset.id);
});

// ---------- переключатель ----------
el("halfGoods").addEventListener("click", () => render("day"));
el("halfServices").addEventListener("click", () => render("night"));
document.querySelectorAll("[data-mode-link]").forEach((a) => {
  a.addEventListener("click", () => render(a.dataset.modeLink));
});

// ---------- акции: листаемый баннер ----------
// Тексты и даты правятся в promos.json без деплоя кода.
(async () => {
  let promos = [];
  try {
    const r = await fetch("promos.json");
    if (r.ok) promos = await r.json();
  } catch (_) { /* нет promos.json — секция скроется */ }
  const section = document.getElementById("promo");
  if (!promos.length) { section.hidden = true; return; }

  const track = el("promoTrack"), dots = el("promoDots");
  const strip = document.createElement("div");
  strip.className = "promo-strip";
  strip.innerHTML = promos.map((p) => `
    <article class="promo-slide" ${p.product ? `data-product="${p.product}"` : ""}>
      <span class="promo-kj" aria-hidden="true">${p.kj || "令"}</span>
      <div class="promo-top">
        <span class="promo-badge">${escapeHtml(p.badge || "АКЦИЯ")}</span>
        <span class="promo-when">${escapeHtml(p.days || "")} · <b>${escapeHtml(p.dates || "")}</b></span>
      </div>
      <h3 class="promo-title">${escapeHtml(p.title)}</h3>
      <p class="promo-text">${escapeHtml(p.text || "")}</p>
      <a class="promo-cta" href="${p.product ? "#" : "#catalog"}" ${p.product ? `data-product="${p.product}"` : `data-mode-link="${p.mode || "day"}"`}>${escapeHtml(p.cta || "Подробнее")}</a>
    </article>`).join("");
  track.appendChild(strip);

  dots.innerHTML = promos.map((_, i) =>
    `<button class="promo-dot" data-i="${i}" aria-label="Акция ${i + 1}"></button>`).join("");

  let cur = 0, timer = null;
  const show = (i) => {
    cur = (i + promos.length) % promos.length;
    strip.style.transition = "";
    strip.style.transform = `translateX(-${cur * 100}%)`;
    dots.querySelectorAll(".promo-dot").forEach((d, k) =>
      d.setAttribute("aria-current", String(k === cur)));
  };
  const auto = () => { clearInterval(timer); timer = setInterval(() => show(cur + 1), 7000); };

  el("promoPrev").addEventListener("click", () => { show(cur - 1); auto(); });
  el("promoNext").addEventListener("click", () => { show(cur + 1); auto(); });
  dots.addEventListener("click", (e) => {
    const d = e.target.closest(".promo-dot");
    if (d) { show(+d.dataset.i); auto(); }
  });

  // клик по акции: если привязан товар — открыть его карточку, иначе — нужный раздел каталога
  strip.addEventListener("click", (e) => {
    const withProduct = e.target.closest("[data-product]");
    if (withProduct) {
      e.preventDefault();
      render(modeOf(withProduct.dataset.product));
      openProduct(withProduct.dataset.product);
      return;
    }
    const modeLink = e.target.closest("[data-mode-link]");
    if (modeLink) render(modeLink.dataset.modeLink);
  });

  // листание пальцем и мышью (drag), а не только кнопками
  let x0 = null, dragging = false;
  const start = (x) => { x0 = x; dragging = true; clearInterval(timer); };
  const end = (x) => {
    if (!dragging || x0 === null) return;
    const dx = x - x0;
    if (Math.abs(dx) > 40) show(cur + (dx < 0 ? 1 : -1));
    x0 = null; dragging = false; auto();
  };
  track.addEventListener("touchstart", (e) => start(e.touches[0].clientX), { passive: true });
  track.addEventListener("touchend", (e) => end(e.changedTouches[0].clientX), { passive: true });
  track.addEventListener("mousedown", (e) => { e.preventDefault(); start(e.clientX); });
  addEventListener("mouseup", (e) => end(e.clientX));

  show(0); auto();
})();

// ---------- рябь от точки касания (как капля в воду) ----------
document.addEventListener("pointerdown", (e) => {
  const b = e.target.closest(
    ".btn-raised, .order, .promo-cta, .cta-mini, .promo-code-value, .plus, .promo-arrow, .switch-half, .nav-links a, .modal-close, .cart");
  if (!b) return;
  const rect = b.getBoundingClientRect();
  const size = Math.max(rect.width, rect.height) * 2.4;
  const r = document.createElement("span");
  r.className = "ripple";
  r.style.width = r.style.height = `${size}px`;
  r.style.left = `${e.clientX - rect.left - size / 2}px`;
  r.style.top = `${e.clientY - rect.top - size / 2}px`;
  b.appendChild(r);
  setTimeout(() => r.remove(), 850);
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
      ph: Math.random() * Math.PI * 2,         // фаза волны — у каждой колонки своя
      amp: 6 + Math.random() * 9,              // амплитуда бокового «перетекания»
      glyphs: Array.from({ length: Math.ceil(innerHeight / ROW_H) + 2 },
        () => POOL[(Math.random() * POOL.length) | 0]),
    }));
  }

  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  let t = 0;
  function draw() {
    ctx.clearRect(0, 0, innerWidth, innerHeight);
    ctx.font = `500 ${FONT}px "Hiragino Sans","Noto Sans JP",sans-serif`;
    t += 0.006;                                 // общее «время» жидкости
    for (const c of cols) {
      c.y += c.v;
      if (c.y >= ROW_H) {              // бесшовный сдвиг колонки на один ряд вниз
        c.y -= ROW_H;
        c.glyphs.unshift(c.glyphs.pop());
      }
      const breathe = 0.75 + 0.25 * Math.sin(t * 2 + c.ph);   // дыхание прозрачности
      for (let r = 0; r < c.glyphs.length; r++) {
        const y = r * ROW_H + c.y;
        // боковой волновой дрейф: колонка плавно «перетекает», волна бежит по вертикали
        const x = c.x + Math.sin(t + c.ph + y * 0.008) * c.amp;
        ctx.fillStyle = `rgba(90, 96, 108, ${c.a * breathe})`;
        ctx.fillText(c.glyphs[r], x, y);
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
saveCart();
