import { createElement } from '../../utils/createElement';
import { addToBasketApi } from '../../api/basketApi';
import { fetchProducts, fetchCategories } from '../../api/productApi';
import { renderProductCard } from '../productCard/productCard';
import { renderFilters } from '../filters/filters';
import { Product, FilterState } from '../../types/product';
import { navigateTo } from '../../utils/router';
import { isAuthenticated, clearSession } from '../../utils/auth';

let currentFilters: FilterState = {
  search: '',
  sortBy: '',
  category: '',
  available: '',
};

const addToCart = async (product: Product, quantity: number): Promise<void> => {
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
      quantity,
      image: product.image,
    });
    alert('Товар добавлен в корзину.');
  } catch (error: unknown) {
    if (error instanceof Error && error.message === 'Unauthorized') {
      return;
    }

    clearSession();
    alert('Сессия завершилась. Войдите снова.');
    navigateTo('/login');
  }
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
        <span class="products__empty-mark">No Match</span>
        <h3>Мы не нашли товары по этим параметрам</h3>
        <p>Измените фильтры или сбросьте настройки, чтобы снова открыть всю коллекцию.</p>
      `,
    });
  }

  return createElement({
    tag: 'div',
    className: 'products__grid',
    children: products.map((product: Product) =>
      renderProductCard(product, {
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
    className: 'main home-page',
    children: [
      createElement({
        tag: 'section',
        className: 'home__hero',
        children: [
          createElement({
            tag: 'div',
            className: 'home__hero-copy',
            children: [
              createElement({
                tag: 'span',
                className: 'home__eyebrow',
                textContent: 'Curated Retail',
              }),
              createElement({
                tag: 'h1',
                className: 'home__hero-title',
                textContent: 'Технологии, вещи и повседневные предметы в единой premium-витрине',
              }),
              createElement({
                tag: 'div',
                className: 'home__hero-tags',
                children: [
                  createElement({
                    tag: 'span',
                    className: 'home__hero-tag',
                    textContent: 'Нишевость',
                  }),
                  createElement({
                    tag: 'span',
                    className: 'home__hero-tag',
                    textContent: 'Излишки',
                  }),
                  createElement({
                    tag: 'span',
                    className: 'home__hero-tag',
                    textContent: 'Стиль',
                  }),
                ],
              }),
            ],
          }),
          createElement({
            tag: 'div',
            className: 'home__hero-panel',
            children: [
              createElement({
                tag: 'div',
                className: 'home__hero-card home__hero-card--accent',
                innerHTML: `
                  <span class="home__hero-card-label">Selection</span>
                  <strong>Каталог, в котором на первом месте визуальный ритм и чистая композиция.</strong>
                `,
              }),
              createElement({
                tag: 'div',
                className: 'home__hero-card home__hero-card--image',
                innerHTML: `
                  <div class="home__hero-card-media">
                    <img
                      class="home__hero-card-image"
                      src="https://i.pinimg.com/736x/f8/96/28/f896285292debd897fd63894e060d6bf.jpg"
                      alt="Focus visual"
                    />
                  </div>
                `,
              }),
            ],
          }),
        ],
      }),
      createElement({
        tag: 'section',
        className: 'home__collection',
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
              tag: 'div',
              className: 'home__title-block',
              children: [
                createElement({
                  tag: 'span',
                  className: 'home__section-label',
                  textContent: 'Collection',
                }),
                createElement({
                  tag: 'h2',
                  className: 'home__title',
                  textContent: 'Актуальные позиции каталога',
                }),
                createElement({
                  tag: 'p',
                  className: 'home__subtitle',
                  textContent:
                    'Выберите товары для курса, презентации или демонстрации полноценного клиентского опыта.',
                }),
              ],
            }),
            createElement({
              tag: 'div',
              className: 'home__count-card',
              children: [
                createElement({
                  tag: 'span',
                  className: 'home__count-label',
                  textContent: 'Сейчас в витрине',
                }),
                createElement({
                  tag: 'span',
                  className: 'home__count',
                  textContent: `${products.length}`,
                  attributes: { id: 'products-count' },
                }),
              ],
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

            const countEl: HTMLElement | null =
              document.getElementById('products-count');
            if (countEl) countEl.textContent = String(filtered.length);
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
          textContent:
            'Не удалось загрузить каталог. Проверьте подключение к серверу и обновите страницу.',
        })
      );
    }
  }
};
