import { createElement } from '../../utils/createElement';
import { CartItem } from '../../types/product';
import { isAuthenticated } from '../../utils/auth';
import { navigateTo } from '../../utils/router';
import {
  fetchBasket,
  updateBasketQuantity,
  removeFromBasket,
} from '../../api/basketApi';

const renderCartItem = (
  item: CartItem,
  onUpdate: () => Promise<void>
): HTMLElement => {
  return createElement({
    tag: 'div',
    className: 'cart-item',
    children: [
      createElement({
        tag: 'img',
        className: 'cart-item__img',
        attributes: { src: item.image, alt: item.name },
      }),
      createElement({
        tag: 'div',
        className: 'cart-item__info',
        children: [
          createElement({
            tag: 'h3',
            className: 'cart-item__name',
            textContent: item.name,
            attributes: { 'data-title': item.name },
          }),
          createElement({
            tag: 'span',
            className: 'cart-item__price',
            textContent: `${item.price.toFixed(2)} BYN`,
            attributes: { 'data-price': String(item.price) },
          }),
        ],
      }),
      createElement({
        tag: 'div',
        className: 'cart-item__controls',
        children: [
          createElement({
            tag: 'button',
            className: 'cart-item__btn',
            textContent: '−',
            onClick: async () => {
              if (item.quantity > 1) {
                await updateBasketQuantity(item.productId, item.quantity - 1);
              } else {
                await removeFromBasket(item.productId);
              }
              await onUpdate();
            },
          }),
          createElement({
            tag: 'span',
            className: 'cart-item__qty',
            textContent: String(item.quantity),
          }),
          createElement({
            tag: 'button',
            className: 'cart-item__btn',
            textContent: '+',
            onClick: async () => {
              await updateBasketQuantity(item.productId, item.quantity + 1);
              await onUpdate();
            },
          }),
          createElement({
            tag: 'button',
            className: 'cart-item__remove',
            textContent: 'Удалить',
            onClick: async () => {
              await removeFromBasket(item.productId);
              await onUpdate();
            },
          }),
        ],
      }),
      createElement({
        tag: 'span',
        className: 'cart-item__total',
        textContent: `${(item.price * item.quantity).toFixed(2)} BYN`,
      }),
    ],
  });
};

const renderEmptyState = (
  container: HTMLElement,
  title: string,
  description: string,
  buttonText: string,
  path: string
): void => {
  container.appendChild(
    createElement({
      tag: 'div',
      className: 'cart-empty',
      innerHTML: `
        <span class="cart-empty__eyebrow">Basket</span>
        <h2>${title}</h2>
        <p>${description}</p>
        <button class="cart-empty__btn" id="cart-state-btn">${buttonText}</button>
      `,
    })
  );

  document.getElementById('cart-state-btn')?.addEventListener('click', () => {
    navigateTo(path);
  });
};

export const renderCartPage = async (): Promise<void> => {
  const app: HTMLElement | null = document.getElementById('app');
  if (!app) return;

  const oldMain: HTMLElement | null = app.querySelector('.main');
  if (oldMain) oldMain.remove();

  const main: HTMLElement = createElement({
    tag: 'main',
    className: 'main',
    children: [
      createElement({
        tag: 'div',
        className: 'cart-page',
        attributes: { id: 'cart-container' },
      }),
    ],
  });

  app.appendChild(main);

  const container = document.getElementById('cart-container');
  if (!container) return;

  if (!isAuthenticated()) {
    renderEmptyState(
      container,
      'Корзина доступна после входа',
      'Авторизуйтесь, чтобы хранить товары, оформлять доставку и видеть актуальную историю покупок.',
      'Перейти ко входу',
      '/login'
    );
    return;
  }

  const renderContent = async (): Promise<void> => {
    container.innerHTML = '';

    try {
      const items: CartItem[] = await fetchBasket();

      if (items.length === 0) {
        renderEmptyState(
          container,
          'В корзине пока нет товаров',
          'Добавьте несколько позиций из каталога, чтобы перейти к оформлению заказа.',
          'Вернуться в каталог',
          '/'
        );
        return;
      }

      const totalItems = items.reduce(
        (sum: number, item: CartItem) => sum + item.quantity,
        0
      );
      const totalPrice = items.reduce(
        (sum: number, item: CartItem) => sum + item.price * item.quantity,
        0
      );

      container.appendChild(
        createElement({
          tag: 'div',
          className: 'cart-page__hero',
          children: [
            createElement({
              tag: 'div',
              className: 'cart-page__hero-copy',
              children: [
                createElement({
                  tag: 'span',
                  className: 'cart-page__eyebrow',
                  textContent: 'Checkout Preview',
                }),
                createElement({
                  tag: 'h2',
                  className: 'cart-page__title',
                  textContent: 'Корзина готова к оформлению',
                }),
                createElement({
                  tag: 'p',
                  className: 'cart-page__text',
                  textContent:
                    'Проверьте состав заказа, скорректируйте количество и переходите к доставке.',
                }),
              ],
            }),
            createElement({
              tag: 'div',
              className: 'cart-page__hero-total',
              children: [
                createElement({
                  tag: 'span',
                  className: 'cart-page__hero-label',
                  textContent: 'Итог',
                }),
                createElement({
                  tag: 'strong',
                  className: 'cart-page__hero-price',
                  textContent: `${totalPrice.toFixed(2)} BYN`,
                }),
              ],
            }),
          ],
        })
      );

      const layout = createElement({
        tag: 'div',
        className: 'cart-page__layout',
      });

      const list = createElement({
        tag: 'div',
        className: 'cart-list',
      });

      items.forEach((item: CartItem) => {
        list.appendChild(renderCartItem(item, renderContent));
      });

      const summary = createElement({
        tag: 'aside',
        className: 'cart-summary',
        children: [
          createElement({
            tag: 'span',
            className: 'cart-summary__eyebrow',
            textContent: 'Summary',
          }),
          createElement({
            tag: 'h3',
            className: 'cart-summary__title',
            textContent: 'Сводка заказа',
          }),
          createElement({
            tag: 'div',
            className: 'cart-summary__row',
            children: [
              createElement({ tag: 'span', textContent: 'Позиции' }),
              createElement({ tag: 'span', textContent: String(totalItems) }),
            ],
          }),
          createElement({
            tag: 'div',
            className: 'cart-summary__row',
            children: [
              createElement({ tag: 'span', textContent: 'Товаров' }),
              createElement({ tag: 'span', textContent: String(items.length) }),
            ],
          }),
          createElement({
            tag: 'div',
            className: 'cart-summary__row cart-summary__row--total',
            children: [
              createElement({ tag: 'span', textContent: 'Итого' }),
              createElement({
                tag: 'span',
                className: 'cart-summary__total',
                textContent: `${totalPrice.toFixed(2)} BYN`,
              }),
            ],
          }),
          createElement({
            tag: 'p',
            className: 'cart-summary__note',
            textContent:
              'На следующем шаге вы подтвердите адрес, контактные данные и способ оплаты.',
          }),
          createElement({
            tag: 'button',
            className: 'cart-summary__order-btn',
            textContent: 'Перейти к доставке',
            onClick: () => navigateTo('/delivery'),
          }),
        ],
      });

      layout.appendChild(list);
      layout.appendChild(summary);
      container.appendChild(layout);
    } catch {
      container.appendChild(
        createElement({
          tag: 'div',
          className: 'cart-empty',
          textContent: 'Не удалось загрузить корзину. Попробуйте обновить страницу.',
        })
      );
    }
  };

  await renderContent();
};
