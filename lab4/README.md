# Лабораторна робота №3 — «Акустична варта»

Адаптивна верстка вебсторінки за допомогою Flexbox, CSS Grid та SCSS.

## Структура

- `index.html` — HTML-сторінка.
- `scss/_variables.scss` — змінні.
- `scss/_mixins.scss` — mixins.
- `scss/_base.scss` — базові стилі.
- `scss/_layout.scss` — layout, Grid/Flexbox та responsive-структура.
- `scss/_components.scss` — картки, warning, таблиця, форма, кнопки.
- `scss/main.scss` — точка входу SCSS.
- `css/main.css` — скомпільований CSS.

## Responsive

- Mobile: до 768px — одноколонковий layout.
- Tablet: від 768px — 2 колонки для monitoring/services.
- Desktop: від 1024px — 5 колонок для monitoring і 4 для services.

## SCSS

Для компіляції можна використати Sass:

`sass --watch scss/main.scss:css/main.css`

HTML підключає готовий `css/main.css`, а SCSS є джерелом стилів.


## Лабораторна робота №4 — JavaScript

Додано `js/monitoring.js`, який аналізує вимірювання шуму та виводить звіт у Browser Console.

Використано:
- `for`, `for...of`, `while`, `do...while`;
- `continue` і `break`;
- параметри та `return`;
- Function Declaration, Function Expression та Arrow Function;
- синхронний callback;
- перевірку тестових наборів із завдання.
