import { createElement } from '../../utils/createElement';
import { FilterState } from '../../types/product';

interface FiltersCallbacks {
  onFilterChange: (filters: FilterState) => void;
}

const createFilterGroup = (
  label: string,
  hint: string,
  children: HTMLElement[]
): HTMLElement => {
  return createElement({
    tag: 'div',
    className: 'filters__group',
    children: [
      createElement({ tag: 'label', className: 'filters__label', textContent: label }),
      createElement({ tag: 'p', className: 'filters__hint', textContent: hint }),
      ...children,
    ],
  });
};

export const renderFilters = (
  categories: string[],
  current: FilterState,
  callbacks: FiltersCallbacks
): HTMLElement => {
  const state: FilterState = { ...current };

  let debounceTimer: ReturnType<typeof setTimeout> | null = null;

  const debouncedChange = (): void => {
    if (debounceTimer) clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
      callbacks.onFilterChange({ ...state });
    }, 250);
  };

  const container: HTMLElement = createElement({
    tag: 'aside',
    className: 'filters',
    children: [
      createElement({
        tag: 'div',
        className: 'filters__intro',
        children: [
          createElement({
            tag: 'span',
            className: 'filters__eyebrow',
            textContent: 'Navigation',
          }),
          createElement({
            tag: 'h3',
            className: 'filters__title',
            textContent: 'Настройте витрину под ваш сценарий',
          }),
          createElement({
            tag: 'p',
            className: 'filters__text',
            textContent:
              'Отберите только те позиции, которые подходят по категории, доступности и формату покупки.',
          }),
        ],
      }),

      createFilterGroup('Поиск', 'По названию или описанию', [
        createElement({
          tag: 'input',
          className: 'filters__input',
          attributes: {
            type: 'text',
            placeholder: 'Например, ноутбук или монитор',
            value: state.search,
          },
          onInput: (e: Event) => {
            state.search = (e.target as HTMLInputElement).value;
            debouncedChange();
          },
        }),
      ]),

      createFilterGroup('Сортировка', 'Управляйте порядком карточек', [
        createElement({
          tag: 'select',
          className: 'filters__select',
          innerHTML: `
            <option value="">Без сортировки</option>
            <option value="price_asc" ${
              state.sortBy === 'price_asc' ? 'selected' : ''
            }>Сначала доступные по цене</option>
            <option value="price_desc" ${
              state.sortBy === 'price_desc' ? 'selected' : ''
            }>Сначала флагманские позиции</option>
          `,
          onChange: (e: Event) => {
            state.sortBy = (e.target as HTMLSelectElement)
              .value as FilterState['sortBy'];
            callbacks.onFilterChange({ ...state });
          },
        }),
      ]),

      createFilterGroup('Категория', 'Переключайтесь между коллекциями', [
        createElement({
          tag: 'select',
          className: 'filters__select',
          innerHTML: `
            <option value="">Все категории</option>
            ${categories
              .map(
                (category: string) =>
                  `<option value="${category}" ${
                    state.category === category ? 'selected' : ''
                  }>${category}</option>`
              )
              .join('')}
          `,
          onChange: (e: Event) => {
            state.category = (e.target as HTMLSelectElement).value;
            callbacks.onFilterChange({ ...state });
          },
        }),
      ]),

      createFilterGroup('Доступность', 'Смотрите только актуальные товары', [
        createElement({
          tag: 'select',
          className: 'filters__select',
          innerHTML: `
            <option value="">Вся витрина</option>
            <option value="true" ${
              state.available === 'true' ? 'selected' : ''
            }>Только в наличии</option>
            <option value="false" ${
              state.available === 'false' ? 'selected' : ''
            }>Только отсутствующие</option>
          `,
          onChange: (e: Event) => {
            state.available = (e.target as HTMLSelectElement).value;
            callbacks.onFilterChange({ ...state });
          },
        }),
      ]),

      createElement({
        tag: 'button',
        className: 'filters__reset',
        textContent: 'Сбросить настройки',
        onClick: () => {
          state.search = '';
          state.sortBy = '';
          state.category = '';
          state.available = '';
          callbacks.onFilterChange({ ...state });

          const parent: HTMLElement | null = container.parentElement;
          if (parent) {
            parent.innerHTML = '';
            parent.appendChild(renderFilters(categories, state, callbacks));
          }
        },
      }),
    ],
  });

  return container;
};
