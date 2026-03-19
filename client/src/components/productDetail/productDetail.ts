import { createElement } from '../../utils/createElement';
import { fetchProduct } from '../../api/productApi';
import { Product, CartItem } from '../../types/product';
import { navigateTo } from '../../utils/router';
import { isAuthenticated } from '../../utils/auth';

export const renderProductDetail = async (productId: string): Promise<void> => {
  const app: HTMLElement | null = document.getElementById('app');
  if (!app) return;

  const oldMain: HTMLElement | null = app.querySelector('.main');
  if (oldMain) oldMain.remove();

  const main: HTMLElement = createElement({
    tag: 'main',
    className: 'main',
  });

  app.appendChild(main);

  try {
    const product: Product = await fetchProduct(parseInt(productId, 10));
    let qty = 1;

    const qtyDisplay: HTMLElement = createElement({
      tag: 'span',
      className: 'detail__qty-val',
      textContent: '1',
    });

    const detail: HTMLElement = createElement({
      tag: 'div',
      className: 'detail',
      children: [
        createElement({
          tag: 'button',
          className: 'detail__back',
          textContent: '← Назад к товарам',
          onClick: () => navigateTo('/'),
        }),
        createElement({
          tag: 'div',
          className: 'detail__content',
          children: [
            createElement({
              tag: 'div',
              className: 'detail__img-wrap',
              children: [
                createElement({
                  tag: 'img',
                  className: 'detail__img',
                  attributes: { src: product.image, alt: product.name },
                }),
              ],
            }),
            createElement({
              tag: 'div',
              className: 'detail__info',
              children: [
                createElement({
                  tag: 'span',
                  className: 'detail__category',
                  textContent: product.category,
                }),
                createElement({
                  tag: 'h1',
                  className: 'detail__name',
                  textContent: product.name,
                  attributes: { 'data-title': product.name },
                }),
                createElement({
                  tag: 'div',
                  className: 'detail__rating',
                  textContent: `${'★'.repeat(Math.round(product.rating))}${'☆'.repeat(5 - Math.round(product.rating))} ${product.rating} / 5`,
                }),
                createElement({
                  tag: 'p',
                  className: 'detail__desc',
                  textContent: product.description,
                }),
                createElement({
                  tag: 'div',
                  className: 'detail__price-row',
                  children: [
                    createElement({
                      tag: 'span',
                      className: 'detail__price',
                      textContent: `${product.price.toFixed(2)} BYN`,
                      attributes: { 'data-price': String(product.price) },
                    }),
                    createElement({
                      tag: 'span',
                      className: `detail__stock ${product.available ? 'detail__stock--yes' : 'detail__stock--no'}`,
                      textContent: product.available
                        ? `В наличии (${product.quantity} шт.)`
                        : 'Нет в наличии',
                    }),
                  ],
                }),
                createElement({
                  tag: 'div',
                  className: 'detail__actions',
                  children: [
                    createElement({
                      tag: 'div',
                      className: 'detail__qty',
                      children: [
                        createElement({
                          tag: 'button',
                          className: 'detail__qty-btn',
                          textContent: '−',
                          onClick: () => {
                            if (qty > 1) {
                              qty--;
                              qtyDisplay.textContent = String(qty);
                            }
                          },
                        }),
                        qtyDisplay,
                        createElement({
                          tag: 'button',
                          className: 'detail__qty-btn',
                          textContent: '+',
                          onClick: () => {
                            if (qty < product.quantity) {
                              qty++;
                              qtyDisplay.textContent = String(qty);
                            }
                          },
                        }),
                      ],
                    }),
                    createElement({
                      tag: 'button',
                      className: `detail__cart-btn ${!product.available ? 'detail__cart-btn--disabled' : ''}`,
                      textContent: '🛒 Добавить в корзину',
                      attributes: product.available ? {} : { disabled: 'true' },
                      onClick: () => {
                        if (!product.available) return;

                        if (!isAuthenticated()) {
                          alert('Для добавления в корзину необходимо авторизоваться!');
                          navigateTo('/login');
                          return;
                        }

                        const raw: string | null = localStorage.getItem('cart');
                        const cart: CartItem[] = raw ? JSON.parse(raw) : [];
                        const idx: number = cart.findIndex((i: CartItem) => i.productId === product.id);

                        if (idx >= 0) {
                          cart[idx].quantity += qty;
                        } else {
                          cart.push({
                            productId: product.id,
                            name: product.name,
                            price: product.price,
                            quantity: qty,
                            image: product.image,
                          });
                        }

                        localStorage.setItem('cart', JSON.stringify(cart));
                        navigateTo('/cart');
                      },
                    }),
                  ],
                }),
              ],
            }),
          ],
        }),
      ],
    });

    main.appendChild(detail);
  } catch {
    main.appendChild(
      createElement({
        tag: 'div',
        className: 'detail__error',
        textContent: 'Товар не найден 😔',
      })
    );
  }
};
