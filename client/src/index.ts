import './style.css';
import './components/header/index.css';
import './components/productCard/productCard.css';
import './components/filters/filters.css';
import './components/homePage/homePage.css';
import './components/productDetail/productDetail.css';

import { renderHeader } from './components/header/index';
import { renderHomePage } from './components/homePage/homePage';
import { renderProductDetail } from './components/productDetail/productDetail';
import { createLoginPage, createRegisterPage } from './components/auth/index';
import { createProfilePage } from './components/profile/index';
import { addRoute, initRouter } from './utils/router';
import { createElement } from './utils/createElement';

const app: HTMLElement | null = document.getElementById('app');

if (app) {
  const rerenderHeader = () => {
    const oldHeader = app.querySelector('.header');

    if (oldHeader) {
      oldHeader.replaceWith(renderHeader());
    } else {
      app.prepend(renderHeader());
    }
  };

  rerenderHeader();

  addRoute('/', () => {
    renderHomePage();
  });

  addRoute('/product/:id', (params?: Record<string, string>) => {
    if (params && params.id) {
      renderProductDetail(params.id);
    }
  });

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
            innerHTML: `
              <h2>🛒 Корзина</h2>
              <p>Страница корзины подключена. Логика корзины будет добавлена позже.</p>
            `,
          }),
        ],
      })
    );
  });

  addRoute('/login', () => {
    const old: HTMLElement | null = app.querySelector('.main');
    if (old) old.remove();

    app.appendChild(createLoginPage());
  });

  addRoute('/register', () => {
    const old: HTMLElement | null = app.querySelector('.main');
    if (old) old.remove();

    app.appendChild(createRegisterPage());
  });

  addRoute('/profile', () => {
    const old: HTMLElement | null = app.querySelector('.main');
    if (old) old.remove();

    app.appendChild(createProfilePage());
  });

  window.addEventListener('auth:changed', () => {
    rerenderHeader();
  });

  initRouter();
}
