"use strict";

// T&T Studio — неоморфная витрина.
// Товары: только кожаные изделия. Гайды: цифровые PDF (free + 99 ₽, free идёт
// в комплекте к платному). Услуги собираются в пакет: 3+ позиции = −10% на всё.

const MODES = {
  night: {
    tag: "РАЗРАБОТКА",
    lead: "Telegram-боты, AI-ассистенты, автоматизация и веб-платформы под ключ.",
    order: "Заказать",
    items: [
      { id: "bot-ai", t: "Telegram Bot + AI", m: "15 дней", p: 45000, from: true, e: "🤖", kj: "術", sale: 0,
        d: "Бот, который сам отвечает клиентам, принимает заказы и передаёт их вам. AI-ассистент внутри понимает свободные вопросы и ведёт к покупке.",
        addons: ["landing", "support-bot", "funnel"] },
      { id: "miniapp", t: "Mini App / каталог", m: "20 дней", p: 60000, from: true, e: "📱", kj: "網", sale: 0,
        d: "Полноценный каталог прямо внутри Telegram: карточки, корзина, оплата. Открывается кнопкой в боте — без установки приложений.",
        addons: ["bot-ai", "crm", "funnel"] },
      { id: "crm", t: "CRM · автоматизация", m: "18 дней", p: 55000, from: true, e: "⚙️", kj: "録", sale: 0,
        d: "Все заявки, клиенты и статусы — в одном месте. Автоматические напоминания, распределение и отчёты вместо ручной рутины.",
        addons: ["api", "bot-ai", "funnel"] },
      { id: "site", t: "Сайт / платформа", m: "25 дней", p: 90000, from: true, e: "🌐", kj: "道", sale: 0,
        d: "Сайт или веб-платформа под ключ: дизайн, вёрстка, админка, деплой. Как эта витрина — только под вашу задачу.",
        addons: ["landing", "crm", "api"] },
      { id: "ai-custom", t: "AI-ассистент под задачу", m: "12 дней", p: 35000, from: true, e: "🧠", kj: "知", sale: 0,
        d: "Обученный на ваших данных ассистент: отвечает как ваш лучший менеджер, работает 24/7 в боте, на сайте или внутри CRM.",
        addons: ["bot-ai", "site", "crm"] },
      { id: "api", t: "Интеграции / API", m: "10 дней", p: 30000, from: true, e: "🔗", kj: "系", sale: 0,
        d: "Свяжем ваши сервисы между собой: платёжки, склады, доставки, таблицы. Данные ходят сами — без копипаста.",
        addons: ["crm", "site", "bot-ai"] },
      { id: "support-bot", t: "Чат-бот поддержки", m: "14 дней", p: 40000, from: true, e: "💬", kj: "助", sale: 0,
        d: "Снимает до 80% вопросов клиентов: отвечает мгновенно, ночью и в праздники. Сложные случаи передаёт живому менеджеру.",
        addons: ["ai-custom", "crm", "bot-ai"] },
      { id: "landing", t: "Лендинг под запуск", m: "8 дней", p: 25000, from: true, e: "🚀", kj: "昇", sale: 20,
        d: "Продающая страница за 8 дней: оффер, структура, дизайн, форма заявки. Готова принимать трафик к старту рекламы.",
        addons: ["bot-ai", "funnel", "site"] },
      { id: "funnel", t: "Автоворонки продаж", m: "16 дней", p: 50000, from: true, e: "📈", kj: "財", sale: 0,
        d: "Цепочки сообщений, которые сами прогревают и дожимают клиента: приветствие, контент, оффер, напоминания.",
        addons: ["bot-ai", "landing", "crm"] },
    ],
  },
  day: {
    tag: "МАСТЕРСКАЯ",
    lead: "Кожаные изделия ручной работы — то, что можно купить прямо сейчас.",
    order: "Купить",
    items: [
      { id: "cardholder", t: "Картхолдер Crazy Horse", m: "Кожа · Тиснение", p: 5000, e: "👜", kj: "財", sale: 15,
        d: "Компактный картхолдер из кожи Crazy Horse — с возрастом становится только красивее. Ручной шов, персональное тиснение." },
      { id: "strap", t: "Ремешок кожаный", m: "Ручная работа", p: 2400, e: "⌚", kj: "時", sale: 15,
        d: "Ремешок для часов из натуральной кожи, сшитый вручную. Подгоним под ширину ваших часов и обхват запястья." },
      { id: "wallet", t: "Кошелёк ручной работы", m: "Кожа · На заказ", p: 3500, e: "👛", kj: "鞄", sale: 15,
        d: "Классический кошелёк из плотной кожи: отделения для купюр и карт, ручной шов седельной строчкой. Сделаем под ваши пожелания." },
      { id: "backpack", t: "Рюкзак кожаный", m: "Ручная работа", p: 8000, e: "🎒", kj: "包", sale: 15,
        d: "Городской рюкзак из натуральной кожи: вместительный, с усиленными швами. Вещь на годы — с характером и историей." },
    ],
  },
};

// цифровые гайды: продаются через акции и блок «ещё предложения» в корзине
const GUIDES = [
  { id: "guide-free", t: "Вьетнам: о чём этот гайд", m: "PDF · 21 страница", p: 0, e: "🌴", kj: "導", guide: true,
    d: "Бесплатный вводный гайд: что внутри полного гида по переезду, кому подойдёт Вьетнам и с чего начать. Отправим на почту." },
  { id: "guide-full", t: "Вьетнам: полный гид по переезду", m: "PDF · 37 страниц", p: 99, e: "✈️", kj: "道", guide: true,
    d: "Пошаговый план переезда во Вьетнам: визы, жильё, деньги, связь, быт и подводные камни. Бесплатный вводный гайд — в комплекте." },
];

const el = (id) => document.getElementById(id);
const money = (n) => Math.round(n).toLocaleString("ru-RU");
const ALL = () => [...MODES.day.items, ...MODES.night.items, ...GUIDES];
const findItem = (id) => ALL().find((i) => i.id === id);
const modeOf = (id) => MODES.day.items.some((i) => i.id === id) ? "day" : "night";
const salePrice = (it) => it.sale ? Math.round(it.p * (1 - it.sale / 100)) : it.p;
let cfg = { botUsername: "", channelUsername: "AITimPromptsLab", managerUsername: "Temurali_aliev" };

const tme = (h, payload) => {
  const u = (h || "").replace(/^@/, "");
  if (!u) return null;
  return payload ? `https://t.me/${u}?start=${payload}` : `https://t.me/${u}`;
};

async function loadConfig() {
  try {
    const r = await fetch("../config.json");
    if (r.ok) cfg = { ...cfg, ...(await r.json()) };
  } catch (_) { /* defaults */ }
  const ch = tme(cfg.channelUsername), mg = tme(cfg.managerUsername);
  if (ch) el("footChannel").href = ch;
  if (mg) for (const id of ["footManager", "ctaManager"]) el(id).href = mg;
}

// catalog.json — единый источник данных (его же читает Telegram-бот);
// встроенные выше данные остаются fallback-ом, если файл недоступен
async function loadCatalog() {
  try {
    const r = await fetch("../catalog.json");
    if (!r.ok) return;
    const c = await r.json();
    if (c.day) MODES.day = c.day;
    if (c.night) MODES.night = c.night;
    if (Array.isArray(c.guides)) { GUIDES.length = 0; GUIDES.push(...c.guides); }
  } catch (_) { /* fallback на встроенные данные */ }
}

function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
}

function priceHtml(it) {
  if (it.p === 0) return `<span class="free-label">FREE</span>`;
  const from = it.from ? `<span class="from">от</span>` : "";
  const old = it.sale ? `<span class="price-old">${money(it.p)} ₽</span>` : "";
  return `${old}${from}${money(salePrice(it))}<span class="rub">₽</span>`;
}

// ---------- каталог ----------
function render(modeKey) {
  const M = MODES[modeKey];
  document.documentElement.setAttribute("data-mode", modeKey);
  el("halfGoods").setAttribute("aria-selected", String(modeKey === "day"));
  el("halfServices").setAttribute("aria-selected", String(modeKey === "night"));
  el("eyebrowTag").textContent = M.tag;
  el("stageLead").textContent = M.lead;

  el("cards").innerHTML = M.items.map((it, i) => `
    <article class="card" data-id="${it.id}" style="--i:${i}">
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
          <button class="order">${M.order}</button>
        </div>
      </div>
    </article>`).join("");
}

// ---------- корзина: [{id, disc}], живёт в localStorage ----------
let cart = [];
try {
  cart = (JSON.parse(localStorage.getItem("tt-cart") || "[]"))
    .map((x) => typeof x === "string" ? { id: x, disc: 0 } : x);
} catch (_) { cart = []; }

const entryPrice = (en) => {
  const it = findItem(en.id);
  if (!it) return 0;
  return Math.round(salePrice(it) * (1 - (en.disc || 0) / 100));
};

function saveCart() {
  try { localStorage.setItem("tt-cart", JSON.stringify(cart)); } catch (_) {}
  const c = el("cartCount");
  c.textContent = String(cart.length);
  c.hidden = cart.length === 0;
}
function addToCart(id, disc = 0) {
  if (!findItem(id)) return;
  cart.push({ id, disc });
  // free-гайд идёт в комплекте к платному
  if (id === "guide-full" && !cart.some((e) => e.id === "guide-free")) {
    cart.push({ id: "guide-free", disc: 0 });
  }
  saveCart();
}

function renderCart() {
  const entries = cart.filter((en) => findItem(en.id));
  const total = entries.reduce((s, en) => s + entryPrice(en), 0);
  el("cartItems").innerHTML = entries.map((en, i) => {
    const it = findItem(en.id);
    const price = entryPrice(en);
    return `<div class="cart-item">
      <span class="cart-item-emoji">${it.e}</span>
      <span class="cart-item-name">${escapeHtml(it.t)}${en.disc ? ` <small>(пакет −${en.disc}%)</small>` : ""}</span>
      <span class="cart-item-price">${price === 0 ? "FREE" : money(price) + " ₽"}</span>
      <button class="cart-item-remove" data-i="${i}" aria-label="Убрать">✕</button>
    </div>`;
  }).join("");
  el("cartSum").textContent = `${money(total)} ₽`;
  const has = entries.length > 0;
  el("cartTotal").hidden = !has;
  el("cartEmpty").hidden = has;
  el("cartClear").hidden = !has;
  el("cartCheckout").hidden = !has;

  // ещё предложения: гайды, которых нет в корзине
  const offers = GUIDES.filter((g) => !cart.some((en) => en.id === g.id));
  el("cartOffers").hidden = offers.length === 0;
  el("cartOffersList").innerHTML = offers.map((g) => `
    <div class="addon" data-offer="${g.id}">
      <span class="addon-check">✓</span>
      <span class="addon-name">${g.e} ${escapeHtml(g.t)}</span>
      <span class="addon-price">${g.p === 0 ? `<span class="free">FREE</span>` : `${money(g.p)} ₽`}</span>
    </div>`).join("");

  // почта нужна, если в корзине есть цифровой гайд
  const hasGuide = entries.some((en) => findItem(en.id).guide);
  el("cartEmail").hidden = !hasGuide;
  el("cartPay").hidden = !has;
}
function openCart() { renderCart(); el("cartDrawer").hidden = false; }

el("cartBtn").addEventListener("click", openCart);
el("cartClose").addEventListener("click", () => { el("cartDrawer").hidden = true; });
el("cartItems").addEventListener("click", (e) => {
  const b = e.target.closest(".cart-item-remove");
  if (b) { cart.splice(+b.dataset.i, 1); saveCart(); renderCart(); }
});
el("cartOffersList").addEventListener("click", (e) => {
  const a = e.target.closest("[data-offer]");
  if (a) { addToCart(a.dataset.offer); renderCart(); }
});
el("cartClear").addEventListener("click", () => { cart = []; saveCart(); renderCart(); });
try { el("emailInput").value = localStorage.getItem("tt-email") || ""; } catch (_) {}
el("emailInput").addEventListener("input", () => {
  try { localStorage.setItem("tt-email", el("emailInput").value.trim()); } catch (_) {}
});
// способ оплаты: один активный, по умолчанию карта
let payMethod = "Карта / СБП";
el("payList").addEventListener("click", (e) => {
  const a = e.target.closest("[data-pay]");
  if (!a) return;
  payMethod = a.dataset.pay;
  el("payList").querySelectorAll(".addon").forEach((x) => x.classList.toggle("on", x === a));
});

el("cartCheckout").addEventListener("click", () => {
  const entries = cart.filter((en) => findItem(en.id));
  const total = entries.reduce((s, en) => s + entryPrice(en), 0);
  const email = el("emailInput").value.trim();
  const hasGuide = entries.some((en) => findItem(en.id).guide);
  let text = "Здравствуйте! Хочу оформить заказ:\n" +
    entries.map((en) => {
      const it = findItem(en.id);
      const p = entryPrice(en);
      return `• ${it.t} — ${p === 0 ? "бесплатно" : money(p) + " ₽"}${en.disc ? ` (пакет −${en.disc}%)` : ""}`;
    }).join("\n") +
    `\nИтого: ${money(total)} ₽` +
    `\nОплата: ${payMethod}`;
  if (hasGuide) text += `\nПочта для гайдов: ${email || "(не указана)"}`;
  if (navigator.clipboard) navigator.clipboard.writeText(text).catch(() => {});
  const mg = tme(cfg.managerUsername);
  if (mg) window.open(mg, "_blank", "noopener");
});

// ---------- модалка товара: описание, промокод, пакет услуг ----------
function promoCode() {
  const abc = "ABCDEFGHKMNPRSTUVWXYZ23456789";
  let s = "";
  for (let i = 0; i < 4; i++) s += abc[(Math.random() * abc.length) | 0];
  return "TT-" + s;
}
let currentProduct = null;
let chosenAddons = new Set();

function packageDisc() { return chosenAddons.size >= 2 ? 10 : 0; }

function refreshModalPrice() {
  const it = currentProduct;
  if (!it) return;
  const disc = it.addons ? packageDisc() : 0;
  const base = salePrice(it);
  const addonsSum = [...chosenAddons].reduce((s, id) => s + salePrice(findItem(id)), 0);
  const full = base + addonsSum;
  const withDisc = Math.round(full * (1 - disc / 100));
  if (it.p === 0) {
    el("pmPrice").innerHTML = `<span class="free-label">FREE</span>`;
  } else if (chosenAddons.size > 0) {
    el("pmPrice").innerHTML =
      `${disc ? `<span class="price-old">${money(full)} ₽</span>` : ""}` +
      `Пакетом: ${money(withDisc)} ₽${disc ? `<span class="sale-badge">−${disc}%</span>` : ""}`;
  } else {
    el("pmPrice").innerHTML = it.sale
      ? `<span class="price-old">${money(it.p)} ₽</span>${it.from ? "от " : ""}${money(base)} ₽<span class="sale-badge">−${it.sale}%</span>`
      : `${it.from ? "от " : ""}${money(it.p)} ₽`;
  }
  el("pmAddonsNote").hidden = !disc;
}

function openProduct(id) {
  const it = findItem(id);
  if (!it) return;
  currentProduct = it;
  chosenAddons = new Set();
  const M = it.guide ? { tag: "ГАЙДЫ", order: it.p === 0 ? "Получить бесплатно" : "Купить" } : MODES[modeOf(id)];
  el("pmKj").textContent = it.kj;
  el("pmEmoji").textContent = it.e;
  el("pmTag").textContent = M.tag;
  el("pmTitle").textContent = it.t;
  el("pmMeta").textContent = it.m;
  el("pmDesc").textContent = it.d || "";

  const hasSale = (it.sale || 0) > 0;
  el("pmPromo").hidden = !hasSale;
  if (hasSale) {
    el("pmPromoCode").textContent = promoCode();
    const hint = el("pmPromoHint");
    hint.textContent = "нажмите — скопируется";
    hint.classList.remove("copied");
  }

  // пакет допов — только у услуг
  const hasAddons = Array.isArray(it.addons) && it.addons.length > 0;
  el("pmAddons").hidden = !hasAddons;
  if (hasAddons) {
    el("pmAddonsList").innerHTML = it.addons.map((aid) => {
      const a = findItem(aid);
      return `<label class="addon" data-addon="${aid}">
        <span class="addon-check">✓</span>
        <span class="addon-name">${a.e} ${escapeHtml(a.t)}</span>
        <span class="addon-price">+ ${money(salePrice(a))} ₽</span>
      </label>`;
    }).join("");
  }

  refreshModalPrice();
  el("pmOrder").textContent = M.order;
  el("productModal").hidden = false;
}

el("pmAddonsList").addEventListener("click", (e) => {
  const a = e.target.closest("[data-addon]");
  if (!a) return;
  const id = a.dataset.addon;
  if (chosenAddons.has(id)) { chosenAddons.delete(id); a.classList.remove("on"); }
  else { chosenAddons.add(id); a.classList.add("on"); }
  refreshModalPrice();
});

function addCurrentToCart() {
  if (!currentProduct) return;
  const disc = currentProduct.addons ? packageDisc() : 0;
  addToCart(currentProduct.id, disc);
  chosenAddons.forEach((aid) => addToCart(aid, disc));
  el("productModal").hidden = true;
  openCart();
}
el("pmClose").addEventListener("click", () => { el("productModal").hidden = true; });
el("pmAdd").addEventListener("click", addCurrentToCart);
el("pmOrder").addEventListener("click", (e) => { e.preventDefault(); addCurrentToCart(); });
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

// карточки каталога: «+» → в корзину, «Купить/Заказать» → корзина, карточка → модалка
el("cards").addEventListener("click", (e) => {
  const card = e.target.closest(".card");
  if (!card) return;
  if (e.target.closest(".plus")) { e.preventDefault(); addToCart(card.dataset.id); return; }
  if (e.target.closest(".order")) { addToCart(card.dataset.id); openCart(); return; }
  openProduct(card.dataset.id);
});

// ---------- тема день/ночь: клиент выбирает сам, кнопкой в шапке ----------
function setTheme(t) {
  document.documentElement.setAttribute("data-theme", t);
  el("themeBtn").textContent = t === "dark" ? "☀️" : "🌙";
  try { localStorage.setItem("tt-theme", t); } catch (_) {}
}
setTheme((() => {
  try {
    const saved = localStorage.getItem("tt-theme");
    if (saved === "dark" || saved === "light") return saved;
  } catch (_) {}
  const h = new Date().getHours();
  return h >= 7 && h < 19 ? "light" : "dark";
})());
el("themeBtn").addEventListener("click", () => {
  setTheme(document.documentElement.getAttribute("data-theme") === "dark" ? "light" : "dark");
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
    const r = await fetch("../promos.json");
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
      const id = withProduct.dataset.product;
      if (!findItem(id).guide) render(modeOf(id));
      openProduct(id);
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
    ".btn-raised, .order, .promo-cta, .cta-mini, .promo-code-value, .plus, .promo-arrow, .switch-half, .nav-links a, .modal-close, .cart, .addon");
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


// ---------- boot ----------
const startMode = (() => { const h = new Date().getHours(); return h >= 7 && h < 19 ? "day" : "night"; })();
render(startMode);
Promise.all([loadConfig(), loadCatalog()]).then(() => {
  render(startMode);
  // переход со страниц «Скидки»/«Гайды»: /?item=<id> открывает карточку товара
  const wanted = new URLSearchParams(location.search).get("item");
  if (wanted && findItem(wanted)) {
    if (!findItem(wanted).guide) render(modeOf(wanted));
    openProduct(wanted);
  }
});
saveCart();
