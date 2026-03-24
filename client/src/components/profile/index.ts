import {
  getDeliveryProfile,
  getUser,
  isAuthenticated,
  saveDeliveryProfile,
} from '../../utils/auth';
import { navigateTo } from '../../utils/router';
import { fetchDeliveries, DeliveryOrder } from '../../api/deliveryApi';

const renderOrders = (orders: DeliveryOrder[]): void => {
  const container = document.getElementById('orders-container');

  if (!container) return;

  if (!orders.length) {
    container.innerHTML = `
      <div class="profile-history__item">
        <div>
          <strong>История заказов пока пуста</strong>
          <p>После оформления заказа здесь будут отображаться ваши покупки.</p>
        </div>
        <span class="profile-history__status">Нет заказов</span>
      </div>
    `;
    return;
  }

  const sortedOrders: DeliveryOrder[] = [...orders].sort(
    (a: DeliveryOrder, b: DeliveryOrder) =>
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  container.innerHTML = sortedOrders
    .map((order: DeliveryOrder) => {
      const createdAt: string = new Date(order.createdAt).toLocaleString();
      const totalPrice: string = order.totalPrice.toFixed(2);
      const itemsHtml: string = order.items
        .map(
          (item) => `
            <li class="profile-history__line">
              ${item.name} x ${item.quantity} - ${(
                item.price * item.quantity
              ).toFixed(2)} BYN
            </li>
          `
        )
        .join('');

      return `
        <div class="profile-history__item">
          <div>
            <strong>Заказ #${order.id}</strong>
            <p>Дата: ${createdAt}</p>
            <p>Сумма: ${totalPrice} BYN</p>
            <p>Адрес: ${order.delivery.address}, ${order.delivery.city}</p>
            <ul class="profile-history__list">
              ${itemsHtml}
            </ul>
          </div>
          <span class="profile-history__status">${order.status}</span>
        </div>
      `;
    })
    .join('');
};

export const createProfilePage = (): HTMLElement => {
  const page = document.createElement('main');
  page.className = 'main profile-page';

  if (!isAuthenticated()) {
    page.innerHTML = `
      <section class="profile-card">
        <h1 class="profile-card__title">Профиль недоступен</h1>
        <p class="profile-card__text">Сначала войдите в аккаунт, чтобы открыть профиль.</p>
        <button class="profile-card__action" type="button" id="go-login">Перейти ко входу</button>
      </section>
    `;

    const button = page.querySelector('#go-login') as HTMLButtonElement;
    button.addEventListener('click', () => navigateTo('/login'));

    return page;
  }

  const user = getUser();
  const delivery = getDeliveryProfile();

  page.innerHTML = `
    <section class="profile-layout">
      <div class="profile-card">
        <div class="profile-card__head">
          <div class="profile-card__avatar">${user?.name?.slice(0, 1).toUpperCase() || 'U'}</div>
          <div>
            <h1 class="profile-card__title">${user?.name || 'Пользователь'}</h1>
            <p class="profile-card__text">${user?.email || ''}</p>
          </div>
        </div>

        <div class="profile-card__info-grid">
          <div class="profile-card__info-item">
            <span class="profile-card__label">Статус</span>
            <strong>Авторизован</strong>
          </div>
          <div class="profile-card__info-item">
            <span class="profile-card__label">Аккаунт</span>
            <strong>L_Shop user</strong>
          </div>
        </div>
      </div>

      <div class="profile-card">
        <h2 class="profile-card__subtitle">Данные для доставки</h2>

        <form class="profile-form" id="delivery-form">
          <input class="profile-form__input" name="city" placeholder="Город" value="${delivery.city}" />
          <input class="profile-form__input" name="address" placeholder="Адрес доставки" value="${delivery.address}" />
          <input class="profile-form__input" name="phone" placeholder="Телефон" value="${delivery.phone}" />
          <textarea class="profile-form__textarea" name="comment" placeholder="Комментарий для курьера">${delivery.comment}</textarea>
          <button class="profile-card__action" type="submit">Сохранить данные</button>
          <p class="profile-form__message" id="delivery-message"></p>
        </form>
      </div>

      <div class="profile-card">
        <h2 class="profile-card__subtitle">История покупок</h2>
        <div class="profile-history" id="orders-container">
          <p>Загрузка заказов...</p>
        </div>
      </div>
    </section>
  `;

  const form = page.querySelector('#delivery-form') as HTMLFormElement;
  const message = page.querySelector('#delivery-message') as HTMLParagraphElement;
  const ordersContainer = page.querySelector('#orders-container') as HTMLElement;

  form.addEventListener('submit', (event) => {
    event.preventDefault();

    const formData = new FormData(form);

    saveDeliveryProfile({
      city: String(formData.get('city') || '').trim(),
      address: String(formData.get('address') || '').trim(),
      phone: String(formData.get('phone') || '').trim(),
      comment: String(formData.get('comment') || '').trim(),
    });

    message.textContent = 'Данные для доставки сохранены';
  });

  fetchDeliveries()
    .then((orders: DeliveryOrder[]) => {
      renderOrders(orders);
    })
    .catch(() => {
      ordersContainer.innerHTML = '<p>Ошибка загрузки заказов</p>';
    });

  return page;
};
