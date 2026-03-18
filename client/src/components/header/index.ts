import { createElement } from '../../utils/createElement';
import { navigateTo } from '../../utils/router';

export const renderHeader = (): HTMLElement => {
  const header: HTMLElement = createElement({
    tag: 'header',
    className: 'header',
    children: [
      createElement({
        tag: 'div',
        className: 'header__inner',
        children: [
          createElement({
            tag: 'div',
            className: 'header__logo',
            textContent: '🛒 L_Shop',
            onClick: () => navigateTo('/'),
          }),
          createElement({
            tag: 'nav',
            className: 'header__nav',
            children: [
              createNavLink('Главная', '/'),
              createNavLink('Корзина', '/cart'),
              createNavLink('Войти', '/login'),
            ],
          }),
        ],
      }),
    ],
  });

  return header;
};

const createNavLink = (text: string, path: string): HTMLElement => {
  return createElement({
    tag: 'a',
    className: 'header__link',
    textContent: text,
    attributes: { href: path },
    onClick: (e: MouseEvent) => {
      e.preventDefault();
      navigateTo(path);
    },
  });
};