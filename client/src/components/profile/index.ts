import { getDeliveryProfile, getUser, isAuthenticated, saveDeliveryProfile } from '../../utils/auth';
import { navigateTo } from '../../utils/router';

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
  function renderOrders(orders: any[]) {
    const container = document.getElementById('orders-container');
  
    if (!container) return;
  
    if (!orders.length) {
      container.innerHTML = `
        <div class="profile-history__item">
          <div>
            <strong>История заказов пока пуста</strong>
            <p>После оформления заказа здесь будут отображаться покупки.</p>
          </div>
          <span class="profile-history__status">Нет заказов</span>
        </div>
      `;
      return;
    }
  
    container.innerHTML = orders.map(order => `
      <div class="profile-history__item">
        <div>
          <strong>Заказ #${order.id}</strong>
          <p>Дата: ${new Date(order.date).toLocaleString()}</p>
          <p>Сумма: ${order.total} ₽</p>
          <p>Адрес: ${order.address}</p>
  
          <ul>
            ${order.items.map((item: any) => `
              <li>Товар ID: ${item.productId} — ${item.quantity} шт.</li>
            `).join('')}
          </ul>
        </div>
  
        <span class="profile-history__status">Оформлен</span>
      </div>
    `).join('');
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
  const ordersContainer = page.querySelector('#orders-container') as HTMLElement;

const token = localStorage.getItem('token');

fetch(`http://localhost:3000/api/orders/${user?.id}`, {
  headers: {
    Authorization: `Bearer ${token}`,
  },
})
  .then(res => res.json())
  .then(orders => {
    renderOrders(orders);
  })
  .catch(() => {
    ordersContainer.innerHTML = '<p>Ошибка загрузки заказов</p>';
  });
  return page;
};
