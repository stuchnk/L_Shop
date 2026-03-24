import { createElement } from '../../utils/createElement';
import { Product } from '../../types/product';

interface ProductCardCallbacks {
  onAddToCart: (product: Product, quantity: number) => void;
  onOpenProduct: (product: Product) => void;
}

const formatRating = (rating: number): string => {
  const rounded = Math.round(rating);
  return `${'★'.repeat(rounded)}${'☆'.repeat(5 - rounded)} ${rating.toFixed(1)}`;
};

export const renderProductCard = (
  product: Product,
  callbacks: ProductCardCallbacks
): HTMLElement => {
  let qty = 1;

  const qtyDisplay: HTMLElement = createElement({
    tag: 'span',
    className: 'card__qty-val',
    textContent: '1',
  });

  return createElement({
    tag: 'article',
    className: `card ${!product.available ? 'card--disabled' : ''}`,
    children: [
      createElement({
        tag: 'div',
        className: 'card__img-wrap',
        onClick: () => callbacks.onOpenProduct(product),
        children: [
          createElement({
            tag: 'img',
            className: 'card__img',
            attributes: { src: product.image, alt: product.name, loading: 'lazy' },
          }),
          createElement({
            tag: 'span',
            className: `card__badge ${
              product.available ? 'card__badge--in' : 'card__badge--out'
            }`,
            textContent: product.available ? 'В наличии' : 'Под заказ',
          }),
        ],
      }),
      createElement({
        tag: 'div',
        className: 'card__body',
        children: [
          createElement({
            tag: 'div',
            className: 'card__topline',
            children: [
              createElement({
                tag: 'span',
                className: 'card__category',
                textContent: product.category,
              }),
              createElement({
                tag: 'span',
                className: 'card__rating',
                textContent: formatRating(product.rating),
              }),
            ],
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
            className: 'card__meta',
            children: [
              createElement({
                tag: 'div',
                className: 'card__price-block',
                children: [
                  createElement({
                    tag: 'span',
                    className: 'card__price-label',
                    textContent: 'Цена',
                  }),
                  createElement({
                    tag: 'span',
                    className: 'card__price',
                    textContent: `${product.price.toFixed(2)} BYN`,
                    attributes: { 'data-price': String(product.price) },
                  }),
                ],
              }),
              createElement({
                tag: 'span',
                className: 'card__stock',
                textContent: product.available
                  ? `${product.quantity} шт. на складе`
                  : 'Поставка ожидается',
              }),
            ],
          }),
          createElement({
            tag: 'div',
            className: 'card__footer',
            children: [
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
                        qty -= 1;
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
                        qty += 1;
                        qtyDisplay.textContent = String(qty);
                      }
                    },
                  }),
                ],
              }),
              createElement({
                tag: 'button',
                className: `card__cart-btn ${
                  !product.available ? 'card__cart-btn--disabled' : ''
                }`,
                textContent: product.available ? 'В корзину' : 'Недоступно',
                attributes: product.available ? { type: 'button' } : { disabled: 'true' },
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
  });
};
