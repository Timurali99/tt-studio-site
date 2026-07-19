# T&T Studio — каталог (неоморфный редизайн)

Статичная витрина: товары мастерской + услуги разработки. Макет — мягкий неоморфизм
(по референсу flo.fun/U57Zyys), контент — из прежней витрины zap-storefront.

- `site/` — сам сайт (index.html, styles.css, app.js, config.json)
- `server.py` + `Dockerfile` + `railway.json` — на случай деплоя на Railway
- GitHub Pages публикуется из ветки `gh-pages` (содержимое `site/`)

Контакты (канал/менеджер) меняются в `site/config.json` без правки кода.
