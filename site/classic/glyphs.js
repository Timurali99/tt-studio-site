"use strict";

// ---------- фон: медленный «дождь» из мелких иероглифов ----------
// Требование: глифы мелкие, текут медленно, при желании читаются.
(() => {
  // в ночной теме глифы светлые с красноватым отливом (как на старом сайте)
  const GLYPH_RGB = () => document.documentElement.getAttribute("data-mode") === "night"
    ? "215, 180, 178" : "90, 96, 108";
  const POOL = "道令号変信起能言系術網録知財機車時電匠手品心価導礼義徳華宝助昇音鍵包".split("");
  const cv = document.getElementById("glyphrain");
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
        ctx.fillStyle = `rgba(${GLYPH_RGB()}, ${c.a * breathe})`;
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
