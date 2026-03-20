import { createElement } from '../../utils/createElement';
import { isAuthenticated } from '../../utils/auth';
import { getDeliveryProfile, saveDeliveryProfile } from '../../utils/auth';
import { navigateTo } from '../../utils/router';
import { createDelivery } from '../../api/deliveryApi';

export const renderDeliveryPage = (): void => {
  const app: HTMLElement | null = document.getElementById('app');
  if (!app) return;

  const oldMain: HTMLElement | null = app.querySelector('.main');
  if (oldMain) oldMain.remove();

  if (!isAuthenticated()) {
    app.appendChild(
      createElement({
        tag: 'main',
        className: 'main',
        children: [
          createElement({
            tag: 'div',
            className: 'cart-empty',
            innerHTML: `
              <h2>🔒 Для оформления доставки необходимо авторизоваться</h2>
              <button class="cart-empty__btn" id="del-login-btn">Войти</button>
            `,
          }),
        ],
      })
    );
    document.getElementById('del-login-btn')?.addEventListener('click', () => {
      navigateTo('/login');
    });
    return;
  }

  const saved = getDeliveryProfile();

  const main: HTMLElement = createElement({ tag: 'main', className: 'main' });
  main.innerHTML = `
    <div class="delivery-page">
      <h2 class="delivery-page__title">📦 Оформление доставки</h2>

      <form class="delivery-form" id="delivery-form" data-delivery>
        <fieldset class="delivery-form__section">
          <legend>Адрес доставки</legend>
          <label>
            Город
            <input type="text" name="city" value="${saved.city}" required />
          </label>
          <label>
            Адрес
            <input type="text" name="address" value="${saved.address}" required />
          </label>
          <label>
            Телефон
            <input type="tel" name="phone" value="${saved.phone}" placeholder="+375..." required />
          </label>
          <label>
            Email
            <input type="email" name="email" required />
          </label>
          <label>
            Комментарий
            <textarea name="comment">${saved.comment}</textarea>
          </label>
        </fieldset>

        <fieldset class="delivery-form__section">
          <legend>Оплата</legend>
          <label>
            Номер карты
            <input type="text" name="cardNumber" placeholder="0000 0000 0000 0000" maxlength="19" required />
          </label>
          <label>
            Имя владельца
            <input type="text" name="cardHolder" required />
          </label>
          <div class="delivery-form__row">
            <label>
              Срок действия
              <input type="text" name="expiry" placeholder="MM/YY" maxlength="5" required />
            </label>
            <label>
              CVV
              <input type="password" name="cvv" maxlength="3" required />
            </label>
          </div>
        </fieldset>

        <p class="delivery-form__error" id="delivery-error"></p>
        <button type="submit" class="delivery-form__submit">Подтвердить заказ</button>
      </form>
    </div>
  `;

  app.appendChild(main);

  const form: HTMLFormElement | null = document.getElementById('delivery-form') as HTMLFormElement;
  const errorEl: HTMLElement | null = document.getElementById('delivery-error');

  form?.addEventListener('submit', async (e: Event) => {
    e.preventDefault();
    if (errorEl) errorEl.textContent = '';

    const fd = new FormData(form);
    const city: string = String(fd.get('city') || '').trim();
    const address: string = String(fd.get('address') || '').trim();
    const phone: string = String(fd.get('phone') || '').trim();
    const email: string = String(fd.get('email') || '').trim();
    const comment: string = String(fd.get('comment') || '').trim();
    const cardNumber: string = String(fd.get('cardNumber') || '').trim();
    const cardHolder: string = String(fd.get('cardHolder') || '').trim();
    const expiry: string = String(fd.get('expiry') || '').trim();
    const cvv: string = String(fd.get('cvv') || '').trim();

    if (!city || !address || !phone || !email) {
      if (errorEl) errorEl.textContent = 'Заполните все поля доставки';
      return;
    }

    if (!cardNumber || !cardHolder || !expiry || !cvv) {
      if (errorEl) errorEl.textContent = 'Заполните все поля оплаты';
      return;
    }

    // Сохраняем профиль доставки
    saveDeliveryProfile({ city, address, phone, comment });

    try {
      await createDelivery({
        delivery: { city, address, phone, email, comment },
        payment: { cardNumber, cardHolder, expiry, cvv },
      });

      // Очищаем localStorage корзину
      localStorage.removeItem('cart');

      const container: HTMLElement | null = app.querySelector('.delivery-page');
      if (container) {
        container.innerHTML = `
          <div class="delivery-success">
            <h2>✅ Заказ оформлен!</h2>
            <p>Ваш заказ успешно создан. Мы свяжемся с вами для подтверждения.</p>
            <button class="cart-empty__btn" id="delivery-home-btn">На главную</button>
          </div>
        `;
        document.getElementById('delivery-home-btn')?.addEventListener('click', () => {
          navigateTo('/');
        });
      }
    } catch (err: unknown) {
      if (errorEl) {
        errorEl.textContent = err instanceof Error ? err.message : 'Ошибка оформления';
      }
    }
  });
};