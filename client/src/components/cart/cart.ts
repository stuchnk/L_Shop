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
            attributes: { 'data-title': 'basket' },
          }),
          createElement({
            tag: 'span',
            className: 'cart-item__price',
            textContent: `${item.price.toFixed(2)} BYN`,
            attributes: { 'data-price': 'basket' },
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
            textContent: '✕',
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

export const renderCartPage = async (): Promise<void> => {
  const app: HTMLElement | null = document.getElementById('app');
  if (!app) return;

  const oldMain: HTMLElement | null = app.querySelector('.main');
  if (oldMain) oldMain.remove();

  if (!isAuthenticated()) {
    app.appendChild(
      createElement({
        tag: 'main',
        className: 'main',
        children: [
          createElement({
            tag: 'div',
            className: 'cart-empty',
            innerHTML: `
              <h2>🔒 Для просмотра корзины необходимо авторизоваться</h2>
              <button class="cart-empty__btn" id="cart-login-btn">Войти</button>
            `,
          }),
        ],
      })
    );
    document
      .getElementById('cart-login-btn')
      ?.addEventListener('click', () => {
        navigateTo('/login');
      });
    return;
  }

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

  const renderContent = async (): Promise<void> => {
    const container: HTMLElement | null =
      document.getElementById('cart-container');
    if (!container) return;
    container.innerHTML = '';

    try {
      const items: CartItem[] = await fetchBasket();

      if (items.length === 0) {
        container.appendChild(
          createElement({
            tag: 'div',
            className: 'cart-empty',
            innerHTML: `
              <h2>🛒 Корзина пуста</h2>
              <p>Добавьте товары из каталога</p>
              <button class="cart-empty__btn" id="cart-home-btn">К товарам</button>
            `,
          })
        );
        document
          .getElementById('cart-home-btn')
          ?.addEventListener('click', () => {
            navigateTo('/');
          });
        return;
      }

      const totalPrice: number = items.reduce(
        (sum: number, item: CartItem) => sum + item.price * item.quantity,
        0
      );

      container.appendChild(
        createElement({
          tag: 'h2',
          className: 'cart-page__title',
          textContent: '🛒 Корзина',
        })
      );

      const list: HTMLElement = createElement({
        tag: 'div',
        className: 'cart-list',
      });

      items.forEach((item: CartItem) => {
        list.appendChild(renderCartItem(item, renderContent));
      });

      container.appendChild(list);

      container.appendChild(
        createElement({
          tag: 'div',
          className: 'cart-summary',
          children: [
            createElement({
              tag: 'div',
              className: 'cart-summary__row',
              children: [
                createElement({
                  tag: 'span',
                  textContent: `Товаров: ${items.reduce(
                    (s: number, i: CartItem) => s + i.quantity,
                    0
                  )}`,
                }),
                createElement({
                  tag: 'span',
                  className: 'cart-summary__total',
                  textContent: `Итого: ${totalPrice.toFixed(2)} BYN`,
                }),
              ],
            }),
            createElement({
              tag: 'button',
              className: 'cart-summary__order-btn',
              textContent: 'Оформить доставку',
              onClick: () => navigateTo('/delivery'),
            }),
          ],
        })
      );
    } catch {
      // Если fetchBasket выбросил Unauthorized — редирект уже произошёл в basketApi
      // Для остальных ошибок показываем сообщение
      const container: HTMLElement | null =
        document.getElementById('cart-container');
      if (container) {
        container.appendChild(
          createElement({
            tag: 'div',
            className: 'cart-empty',
            textContent: '⚠️ Ошибка загрузки корзины',
          })
        );
      }
    }
  };

  await renderContent();
};