import { createElement } from '../../utils/createElement';
import { fetchProducts, fetchCategories } from '../../api/productApi';
import { renderProductCard } from '../productCard/productCard';
import { renderFilters } from '../filters/filters';
import { Product, FilterState, CartItem } from '../../types/product';
import { navigateTo } from '../../utils/router';
import { isAuthenticated } from '../../utils/auth';

let currentFilters: FilterState = {
  search: '',
  sortBy: '',
  category: '',
  available: '',
};

const addToCart = (product: Product, quantity: number): void => {
  if (!isAuthenticated()) {
    alert('Для добавления в корзину необходимо авторизоваться!');
    navigateTo('/login');
    return;
  }

  const raw: string | null = localStorage.getItem('cart');
  const cart: CartItem[] = raw ? JSON.parse(raw) : [];
  const idx: number = cart.findIndex((item: CartItem) => item.productId === product.id);

  if (idx >= 0) {
    cart[idx].quantity += quantity;
  } else {
    cart.push({
      productId: product.id,
      name: product.name,
      price: product.price,
      quantity,
      image: product.image,
    });
  }

  localStorage.setItem('cart', JSON.stringify(cart));
  navigateTo('/cart');
};

const openProduct = (product: Product): void => {
  navigateTo(`/product/${product.id}`);
};

const buildProductGrid = (products: Product[]): HTMLElement => {
  if (products.length === 0) {
    return createElement({
      tag: 'div',
      className: 'products__empty',
      innerHTML: `
        <div>🔍</div>
        <h3>Товары не найдены</h3>
        <p>Попробуйте изменить параметры фильтрации</p>
      `,
    });
  }

  return createElement({
    tag: 'div',
    className: 'products__grid',
    children: products.map((p: Product) =>
      renderProductCard(p, {
        onAddToCart: addToCart,
        onOpenProduct: openProduct,
      })
    ),
  });
};

export const renderHomePage = async (): Promise<void> => {
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
        className: 'home',
        children: [
          createElement({
            tag: 'div',
            className: 'home__sidebar',
            attributes: { id: 'sidebar' },
          }),
          createElement({
            tag: 'div',
            className: 'home__content',
            children: [
              createElement({
                tag: 'div',
                className: 'home__header',
                attributes: { id: 'products-header' },
              }),
              createElement({
                tag: 'div',
                className: 'home__grid',
                attributes: { id: 'products-grid' },
              }),
            ],
          }),
        ],
      }),
    ],
  });

  app.appendChild(main);

  try {
    const [products, categories]: [Product[], string[]] = await Promise.all([
      fetchProducts(currentFilters),
      fetchCategories(),
    ]);

    const sidebar: HTMLElement | null = document.getElementById('sidebar');
    const grid: HTMLElement | null = document.getElementById('products-grid');
    const header: HTMLElement | null = document.getElementById('products-header');

    if (header) {
      header.appendChild(
        createElement({
          tag: 'div',
          className: 'home__title-row',
          children: [
            createElement({
              tag: 'h2',
              className: 'home__title',
              textContent: 'Каталог товаров',
            }),
            createElement({
              tag: 'span',
              className: 'home__count',
              textContent: `${products.length} товаров`,
              attributes: { id: 'products-count' },
            }),
          ],
        })
      );
    }

    if (sidebar) {
      sidebar.appendChild(
        renderFilters(categories, currentFilters, {
          onFilterChange: async (newFilters: FilterState) => {
            currentFilters = newFilters;
            const filtered: Product[] = await fetchProducts(currentFilters);

            if (grid) {
              grid.innerHTML = '';
              grid.appendChild(buildProductGrid(filtered));
            }

            const countEl: HTMLElement | null = document.getElementById('products-count');
            if (countEl) countEl.textContent = `${filtered.length} товаров`;
          },
        })
      );
    }

    if (grid) {
      grid.appendChild(buildProductGrid(products));
    }
  } catch {
    const grid: HTMLElement | null = document.getElementById('products-grid');

    if (grid) {
      grid.appendChild(
        createElement({
          tag: 'div',
          className: 'products__error',
          textContent: '⚠️ Ошибка загрузки. Проверьте подключение к серверу.',
        })
      );
    }
  }
};
