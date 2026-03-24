import { createElement } from '../../utils/createElement';
import { navigateTo } from '../../utils/router';
import { clearSession, getUser, isAuthenticated } from '../../utils/auth';

const getInitials = (name: string): string => {
  return name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
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

export const renderHeader = (): HTMLElement => {
  const user = getUser();
  const auth = isAuthenticated();

  const navChildren: HTMLElement[] = [
    createNavLink('Каталог', '/'),
    createNavLink('Корзина', '/cart'),
  ];

  if (auth && user) {
    navChildren.push(
      createElement({
        tag: 'button',
        className: 'header__profile',
        attributes: { type: 'button' },
        onClick: () => navigateTo('/profile'),
        children: [
          createElement({
            tag: 'span',
            className: 'header__avatar',
            textContent: getInitials(user.name),
          }),
          createElement({
            tag: 'span',
            className: 'header__profile-copy',
            children: [
              createElement({
                tag: 'span',
                className: 'header__profile-label',
                textContent: 'Профиль',
              }),
              createElement({
                tag: 'span',
                className: 'header__profile-name',
                textContent: user.name,
              }),
            ],
          }),
        ],
      })
    );

    navChildren.push(
      createElement({
        tag: 'button',
        className: 'header__logout',
        textContent: 'Выйти',
        attributes: { type: 'button' },
        onClick: () => {
          clearSession();
          navigateTo('/');
        },
      })
    );
  } else {
    navChildren.push(createNavLink('Войти', '/login'));
  }

  return createElement({
    tag: 'header',
    className: 'header',
    children: [
      createElement({
        tag: 'div',
        className: 'header__inner',
        children: [
          createElement({
            tag: 'button',
            className: 'header__brand',
            attributes: { type: 'button' },
            onClick: () => navigateTo('/'),
            children: [
              createElement({
                tag: 'span',
                className: 'header__logo-mark',
                textContent: 'LS',
              }),
              createElement({
                tag: 'span',
                className: 'header__logo-copy',
                children: [
                  createElement({
                    tag: 'span',
                    className: 'header__logo-title',
                    textContent: 'L_Shop Atelier',
                  }),
                  createElement({
                    tag: 'span',
                    className: 'header__logo-subtitle',
                    textContent: 'curated objects for everyday life',
                  }),
                ],
              }),
            ],
          }),
          createElement({
            tag: 'nav',
            className: 'header__nav',
            children: navChildren,
          }),
        ],
      }),
    ],
  });
};
