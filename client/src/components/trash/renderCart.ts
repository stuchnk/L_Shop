import { createElement } from '../../utils/createElement';
import { CartItem } from '../../types/product';
import './trash.css';

export const renderCart = (): void => {
  const app = document.getElementById('app');
  if (!app) return;

  const oldMain = app.querySelector('.main');
  if (oldMain) oldMain.remove();

  const main = createElement({ tag: 'main', className: 'main' });
  app.appendChild(main);

  const raw = localStorage.getItem('cart');
  let cart: CartItem[] = raw ? JSON.parse(raw) : [];

  if (cart.length === 0) {
    main.appendChild(createElement({
      tag: 'div',
      className: 'cart-empty-state',
      textContent: 'Корзина пуста. Добавьте товары из каталога!',
    }));
    return;
  }

  // Функции для управления (внутренние)
  const refresh = () => renderCart();

  const changeQty = (id: number, delta: number) => {
    const item = cart.find(i => i.productId === id);
    if (item) {
      item.quantity += delta;
      if (item.quantity <= 0) return remove(id); // Удаляем, если 0
      localStorage.setItem('cart', JSON.stringify(cart));
      refresh();
    }
  };

  const remove = (id: number) => {
    const filtered = cart.filter(i => i.productId !== id);
    localStorage.setItem('cart', JSON.stringify(filtered));
    refresh();
  };

  // Рендерим контейнер из trash.html
  const container = createElement({
    tag: 'div',
    className: 'cart-container',
    children: [
      createElement({ tag: 'h1', className: 'cart-title', textContent: 'Корзина' }),
      createElement({
        tag: 'div',
        className: 'cart-layout',
        children: [
          // Список товаров
          createElement({
            tag: 'section',
            className: 'cart-items',
            children: cart.map(item => createElement({
              tag: 'div',
              className: 'product-card',
              children: [
                createElement({
                  tag: 'img',
                  className: 'product-img',
                  attributes: { src: item.image, alt: item.name }
                }),
                createElement({
                  tag: 'div',
                  className: 'product-info',
                  children: [
                    createElement({ tag: 'h3', className: 'product-name', textContent: item.name }),
                    createElement({ tag: 'p', className: 'product-price', textContent: `${item.price} BYN` }),
                    // Кнопки изменения количества
                    createElement({
                      tag: 'div',
                      className: 'qty-selector',
                      children: [
                        createElement({ tag: 'button', className: 'qty-btn', textContent: '−', onClick: () => changeQty(item.productId, -1) }),
                        createElement({ tag: 'span', className: 'qty-num', textContent: String(item.quantity) }),
                        createElement({ tag: 'button', className: 'qty-btn', textContent: '+', onClick: () => changeQty(item.productId, 1) }),
                      ]
                    })
                  ]
                }),
                // Кнопка УДАЛЕНИЯ (Крестик)
                createElement({
                  tag: 'button',
                  className: 'delete-btn',
                  textContent: '×',
                  onClick: () => remove(item.productId)
                })
              ]
            }))
          }),
          // Итоговая панель
          createElement({
            tag: 'aside',
            className: 'cart-sidebar',
            children: [
              createElement({
                tag: 'div',
                className: 'checkout-card',
                children: [
                  createElement({ tag: 'h2', textContent: 'Итого' }),
                  createElement({
                    tag: 'button',
                    className: 'main-pay-btn',
                    textContent: 'Оформить заказ',
                    onClick: () => {
                        localStorage.removeItem('cart');
                        alert('Заказ оформлен!');
                        location.reload();
                    }
                  })
                ]
              })
            ]
          })
        ]
      })
    ]
  });

  main.appendChild(container);
};