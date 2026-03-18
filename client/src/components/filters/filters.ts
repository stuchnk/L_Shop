import { createElement } from '../../utils/createElement';
import { FilterState } from '../../types/product';

interface FiltersCallbacks {
  onFilterChange: (filters: FilterState) => void;
}

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
    }, 300);
  };

  const container: HTMLElement = createElement({
    tag: 'aside',
    className: 'filters',
    children: [
      createElement({ tag: 'h3', className: 'filters__title', textContent: '🔍 Фильтры' }),

      // Поиск
      createFilterGroup('Поиск', [
        createElement({
          tag: 'input',
          className: 'filters__input',
          attributes: { type: 'text', placeholder: 'Название или описание...', value: state.search },
          onInput: (e: Event) => {
            state.search = (e.target as HTMLInputElement).value;
            debouncedChange();
          },
        }),
      ]),

      // Сортировка
      createFilterGroup('Сортировка по цене', [
        createElement({
          tag: 'select',
          className: 'filters__select',
          innerHTML: `
            <option value="">Без сортировки</option>
            <option value="price_asc" ${state.sortBy === 'price_asc' ? 'selected' : ''}>Сначала дешёвые</option>
            <option value="price_desc" ${state.sortBy === 'price_desc' ? 'selected' : ''}>Сначала дорогие</option>
          `,
          onChange: (e: Event) => {
            state.sortBy = (e.target as HTMLSelectElement).value as FilterState['sortBy'];
            callbacks.onFilterChange({ ...state });
          },
        }),
      ]),

      // Категория
      createFilterGroup('Категория', [
        createElement({
          tag: 'select',
          className: 'filters__select',
          innerHTML: `
            <option value="">Все категории</option>
            ${categories.map((c: string) => `<option value="${c}" ${state.category === c ? 'selected' : ''}>${c}</option>`).join('')}
          `,
          onChange: (e: Event) => {
            state.category = (e.target as HTMLSelectElement).value;
            callbacks.onFilterChange({ ...state });
          },
        }),
      ]),

      // Наличие
      createFilterGroup('Наличие', [
        createElement({
          tag: 'select',
          className: 'filters__select',
          innerHTML: `
            <option value="">Все товары</option>
            <option value="true" ${state.available === 'true' ? 'selected' : ''}>В наличии</option>
            <option value="false" ${state.available === 'false' ? 'selected' : ''}>Нет в наличии</option>
          `,
          onChange: (e: Event) => {
            state.available = (e.target as HTMLSelectElement).value;
            callbacks.onFilterChange({ ...state });
          },
        }),
      ]),

      // Кнопка сброса
      createElement({
        tag: 'button',
        className: 'filters__reset',
        textContent: '✕ Сбросить фильтры',
        onClick: () => {
          state.search = '';
          state.sortBy = '';
          state.category = '';
          state.available = '';
          callbacks.onFilterChange({ ...state });
          // Перерендерим фильтры
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

const createFilterGroup = (label: string, children: HTMLElement[]): HTMLElement => {
  return createElement({
    tag: 'div',
    className: 'filters__group',
    children: [
      createElement({ tag: 'label', className: 'filters__label', textContent: label }),
      ...children,
    ],
  });
};