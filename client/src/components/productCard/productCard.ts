import { createElement } from '../../utils/createElement';
import { Product } from '../../types/product';

interface ProductCardCallbacks {
  onAddToCart: (product: Product, quantity: number) => void;
  onOpenProduct: (product: Product) => void;
}

export const renderProductCard = (
  product: Product,
  callbacks: ProductCardCallbacks
): HTMLElement => {
  let qty: number = 1;

  const qtyDisplay: HTMLElement = createElement({
    tag: 'span',
    className: 'card__qty-val',
    textContent: '1',
  });

  const card: HTMLElement = createElement({
    tag: 'article',
    className: `card ${!product.available ? 'card--disabled' : ''}`,
    children: [
      // Картинка
      createElement({
        tag: 'div',
        className: 'card__img-wrap',
        children: [
          createElement({
            tag: 'img',
            className: 'card__img',
            attributes: { src: product.image, alt: product.name, loading: 'lazy' },
          }),
          !product.available
            ? createElement({
                tag: 'span',
                className: 'card__badge card__badge--out',
                textContent: 'Нет в наличии',
              })
            : createElement({
                tag: 'span',
                className: 'card__badge card__badge--in',
                textContent: 'В наличии',
              }),
        ],
        onClick: () => callbacks.onOpenProduct(product),
      }),

      // Инфо
      createElement({
        tag: 'div',
        className: 'card__body',
        children: [
          createElement({
            tag: 'span',
            className: 'card__category',
            textContent: product.category,
          }),
          createElement({
            tag: 'h3',
            className: 'card__name',
            textContent: product.name,
            attributes: { 'data-title': product.name },
            onClick: () => callbacks.onOpenProduct(product),
          }),
          createElement({
            tag: 'p',
            className: 'card__desc',
            textContent: product.description,
          }),
          createElement({
            tag: 'div',
            className: 'card__rating',
            textContent: `${'★'.repeat(Math.round(product.rating))}${'☆'.repeat(5 - Math.round(product.rating))} ${product.rating}`,
          }),
          createElement({
            tag: 'div',
            className: 'card__footer',
            children: [
              createElement({
                tag: 'span',
                className: 'card__price',
                textContent: `${product.price.toFixed(2)} BYN`,
                attributes: { 'data-price': String(product.price) },
              }),
              createElement({
                tag: 'div',
                className: 'card__actions',
                children: [
                  // Счётчик количества
                  createElement({
                    tag: 'div',
                    className: 'card__qty',
                    children: [
                      createElement({
                        tag: 'button',
                        className: 'card__qty-btn',
                        textContent: '−',
                        onClick: (e: MouseEvent) => {
                          e.stopPropagation();
                          if (qty > 1) {
                            qty--;
                            qtyDisplay.textContent = String(qty);
                          }
                        },
                      }),
                      qtyDisplay,
                      createElement({
                        tag: 'button',
                        className: 'card__qty-btn',
                        textContent: '+',
                        onClick: (e: MouseEvent) => {
                          e.stopPropagation();
                          if (qty < product.quantity) {
                            qty++;
                            qtyDisplay.textContent = String(qty);
                          }
                        },
                      }),
                    ],
                  }),
                  // Кнопка в корзину
                  createElement({
                    tag: 'button',
                    className: `card__cart-btn ${!product.available ? 'card__cart-btn--disabled' : ''}`,
                    textContent: '🛒',
                    attributes: product.available ? {} : { disabled: 'true' },
                    onClick: (e: MouseEvent) => {
                      e.stopPropagation();
                      if (product.available) {
                        callbacks.onAddToCart(product, qty);
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

  return card;
};