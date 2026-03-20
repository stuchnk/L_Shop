import './style.css';
import './components/header/index.css';
import './components/productCard/productCard.css';
import './components/filters/filters.css';
import './components/homePage/homePage.css';
import './components/productDetail/productDetail.css';
import './components/cart/cart.css';
import './components/delivery/delivery.css';

import { renderHeader } from './components/header/index';
import { renderHomePage } from './components/homePage/homePage';
import { renderProductDetail } from './components/productDetail/productDetail';
import { createLoginPage, createRegisterPage } from './components/auth/index';
import { createProfilePage } from './components/profile/index';
import { renderCartPage } from './components/cart/cart';
import { renderDeliveryPage } from './components/delivery/delivery';
import { addRoute, initRouter } from './utils/router';

const app: HTMLElement | null = document.getElementById('app');

if (app) {
  const rerenderHeader = (): void => {
    const oldHeader: Element | null = app.querySelector('.header');
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
    renderCartPage();
  });

  addRoute('/delivery', () => {
    renderDeliveryPage();
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