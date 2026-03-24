import { createElement } from '../../utils/createElement';
import { fetchProduct } from '../../api/productApi';
import { addToBasketApi } from '../../api/basketApi';
import { Product } from '../../types/product';
import { navigateTo } from '../../utils/router';
import { clearSession, isAuthenticated } from '../../utils/auth';

const formatRating = (rating: number): string => {
  const rounded = Math.round(rating);
  return `${'★'.repeat(rounded)}${'☆'.repeat(5 - rounded)} ${rating.toFixed(1)} / 5`;
};

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
      tag: 'section',
      className: 'detail',
      children: [
        createElement({
          tag: 'button',
          className: 'detail__back',
          textContent: 'Вернуться к каталогу',
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
                createElement({
                  tag: 'span',
                  className: `detail__stock ${
                    product.available ? 'detail__stock--yes' : 'detail__stock--no'
                  }`,
                  textContent: product.available
                    ? `В наличии · ${product.quantity} шт.`
                    : 'Сейчас нет в наличии',
                }),
              ],
            }),
            createElement({
              tag: 'div',
              className: 'detail__info',
              children: [
                createElement({
                  tag: 'span',
                  className: 'detail__eyebrow',
                  textContent: product.category,
                }),
                createElement({
                  tag: 'h1',
                  className: 'detail__name',
                  textContent: product.name,
                  attributes: { 'data-title': product.name },
                }),
                createElement({
                  tag: 'p',
                  className: 'detail__lead',
                  textContent:
                    'Продуманная карточка товара с чистой подачей, мягкими акцентами и понятным сценарием покупки.',
                }),
                createElement({
                  tag: 'div',
                  className: 'detail__rating',
                  textContent: formatRating(product.rating),
                }),
                createElement({
                  tag: 'p',
                  className: 'detail__desc',
                  textContent: product.description,
                }),
                createElement({
                  tag: 'div',
                  className: 'detail__facts',
                  children: [
                    createElement({
                      tag: 'div',
                      className: 'detail__fact',
                      innerHTML: `<span>Цена</span><strong>${product.price.toFixed(
                        2
                      )} BYN</strong>`,
                    }),
                    createElement({
                      tag: 'div',
                      className: 'detail__fact',
                      innerHTML: `<span>Наличие</span><strong>${
                        product.available ? 'Готов к покупке' : 'Под заказ'
                      }</strong>`,
                    }),
                    createElement({
                      tag: 'div',
                      className: 'detail__fact',
                      innerHTML: `<span>Доставка</span><strong>1–3 дня по городу</strong>`,
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
                              qty -= 1;
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
                              qty += 1;
                              qtyDisplay.textContent = String(qty);
                            }
                          },
                        }),
                      ],
                    }),
                    createElement({
                      tag: 'button',
                      className: `detail__cart-btn ${
                        !product.available ? 'detail__cart-btn--disabled' : ''
                      }`,
                      textContent: product.available
                        ? 'Добавить в корзину'
                        : 'Недоступно',
                      attributes: product.available ? { type: 'button' } : { disabled: 'true' },
                      onClick: async () => {
                        if (!product.available) return;

                        if (!isAuthenticated()) {
                          alert('Для добавления товара в корзину войдите в аккаунт.');
                          navigateTo('/login');
                          return;
                        }

                        try {
                          await addToBasketApi({
                            productId: product.id,
                            name: product.name,
                            price: product.price,
                            quantity: qty,
                            image: product.image,
                          });
                          navigateTo('/cart');
                        } catch (error: unknown) {
                          if (error instanceof Error && error.message === 'Unauthorized') {
                            return;
                          }

                          clearSession();
                          alert('Сессия завершилась. Войдите снова.');
                          navigateTo('/login');
                        }
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
        textContent: 'Товар не найден. Вернитесь в каталог и выберите другую позицию.',
      })
    );
  }
};
