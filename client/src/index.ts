import './style.css';
import './components/header/index.css';
import './components/productCard/productCard.css';
import './components/filters/filters.css';
import './components/homePage/homePage.css';
import './components/productDetail/productDetail.css';

import { renderHeader } from './components/header/index';
import { renderHomePage } from './components/homePage/homePage';
import { renderProductDetail } from './components/productDetail/productDetail';
import { addRoute, initRouter } from './utils/router';
import { createElement } from './utils/createElement';

const app: HTMLElement | null = document.getElementById('app');

if (app) {
  app.appendChild(renderHeader());

  // Главная — каталог товаров
  addRoute('/', () => {
    renderHomePage();
  });

  // Страница товара
  addRoute('/product/:id', (params?: Record<string, string>) => {
    if (params && params.id) {
      renderProductDetail(params.id);
    }
  });

  // Корзина (заглушка)
  addRoute('/cart', () => {
    const old: HTMLElement | null = app.querySelector('.main');
    if (old) old.remove();
    app.appendChild(
      createElement({
        tag: 'main',
        className: 'main',
        children: [
          createElement({
            tag: 'div',
            className: 'page-stub',
            innerHTML: '<h2>🛒 Корзина</h2><p>Страница в разработке</p>',
          }),
        ],
      })
    );
  });

  // Авторизация (заглушка)
  addRoute('/login', () => {
    const old: HTMLElement | null = app.querySelector('.main');
    if (old) old.remove();
    app.appendChild(
      createElement({
        tag: 'main',
        className: 'main',
        children: [
          createElement({
            tag: 'div',
            className: 'page-stub',
            innerHTML: '<h2>🔐 Авторизация</h2><p>Страница в разработке</p>',
          }),
        ],
      })
    );
  });

  initRouter();
}