import { createElement } from '../../utils/createElement';
import { getDeliveryProfile, saveDeliveryProfile, isAuthenticated } from '../../utils/auth';
import { navigateTo } from '../../utils/router';
import { createDelivery } from '../../api/deliveryApi';

interface DeliveryFormValues {
  city: string;
  address: string;
  phone: string;
  email: string;
  comment: string;
  cardNumber: string;
  cardHolder: string;
  expiry: string;
  cvv: string;
}

type DeliveryFormField = keyof DeliveryFormValues;
type DeliveryFormErrors = Partial<Record<DeliveryFormField, string>>;

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const CITY_REGEX = /^[A-Za-zА-Яа-яЁёІіЇїЄє\s-]{2,}$/;
const CARD_HOLDER_REGEX = /^[A-Za-zА-Яа-яЁёІіЇїЄє\s.'-]{2,}$/;

const digitsOnly = (value: string): string => value.replace(/\D/g, '');

const normalizePhone = (value: string): string => value.replace(/[^\d+]/g, '');

const formatCardNumber = (value: string): string => {
  return digitsOnly(value)
    .slice(0, 16)
    .replace(/(\d{4})(?=\d)/g, '$1 ')
    .trim();
};

const formatExpiry = (value: string): string => {
  const digits: string = digitsOnly(value).slice(0, 4);

  if (digits.length <= 2) {
    return digits;
  }

  return `${digits.slice(0, 2)}/${digits.slice(2)}`;
};

const isValidExpiry = (value: string): boolean => {
  if (!/^\d{2}\/\d{2}$/.test(value)) {
    return false;
  }

  const [monthString, yearString] = value.split('/');
  const month: number = Number(monthString);
  const year: number = Number(yearString) + 2000;

  if (!month || month < 1 || month > 12) {
    return false;
  }

  const now: Date = new Date();
  const currentYear: number = now.getFullYear();
  const currentMonth: number = now.getMonth() + 1;

  if (year < currentYear) {
    return false;
  }

  if (year === currentYear && month < currentMonth) {
    return false;
  }

  return true;
};

const getFormValues = (form: HTMLFormElement): DeliveryFormValues => {
  const formData = new FormData(form);

  return {
    city: String(formData.get('city') || '').trim(),
    address: String(formData.get('address') || '').trim(),
    phone: normalizePhone(String(formData.get('phone') || '').trim()),
    email: String(formData.get('email') || '').trim(),
    comment: String(formData.get('comment') || '').trim(),
    cardNumber: formatCardNumber(String(formData.get('cardNumber') || '').trim()),
    cardHolder: String(formData.get('cardHolder') || '').trim(),
    expiry: formatExpiry(String(formData.get('expiry') || '').trim()),
    cvv: digitsOnly(String(formData.get('cvv') || '').trim()).slice(0, 3),
  };
};

const validateDeliveryForm = (values: DeliveryFormValues): DeliveryFormErrors => {
  const errors: DeliveryFormErrors = {};

  if (!values.city) {
    errors.city = 'Введите город';
  } else if (!CITY_REGEX.test(values.city)) {
    errors.city = 'Укажите корректное название города';
  }

  if (!values.address) {
    errors.address = 'Введите адрес доставки';
  } else if (values.address.length < 5) {
    errors.address = 'Адрес должен быть не короче 5 символов';
  }

  if (!values.phone) {
    errors.phone = 'Введите телефон';
  } else if (!/^\+?\d{10,15}$/.test(values.phone)) {
    errors.phone = 'Телефон должен содержать от 10 до 15 цифр';
  }

  if (!values.email) {
    errors.email = 'Введите email';
  } else if (!EMAIL_REGEX.test(values.email)) {
    errors.email = 'Введите корректный email';
  }

  if (!values.cardNumber) {
    errors.cardNumber = 'Введите номер карты';
  } else if (digitsOnly(values.cardNumber).length !== 16) {
    errors.cardNumber = 'Номер карты должен содержать 16 цифр';
  }

  if (!values.cardHolder) {
    errors.cardHolder = 'Введите имя владельца карты';
  } else if (!CARD_HOLDER_REGEX.test(values.cardHolder)) {
    errors.cardHolder = 'Укажите имя владельца латиницей или кириллицей';
  }

  if (!values.expiry) {
    errors.expiry = 'Введите срок действия карты';
  } else if (!isValidExpiry(values.expiry)) {
    errors.expiry = 'Укажите корректный срок действия в формате MM/YY';
  }

  if (!values.cvv) {
    errors.cvv = 'Введите CVV';
  } else if (!/^\d{3}$/.test(values.cvv)) {
    errors.cvv = 'CVV должен содержать 3 цифры';
  }

  return errors;
};

const renderFieldErrors = (
  form: HTMLFormElement,
  errors: DeliveryFormErrors
): void => {
  const fieldNames: DeliveryFormField[] = [
    'city',
    'address',
    'phone',
    'email',
    'comment',
    'cardNumber',
    'cardHolder',
    'expiry',
    'cvv',
  ];

  fieldNames.forEach((fieldName: DeliveryFormField) => {
    const field: HTMLInputElement | HTMLTextAreaElement | null = form.querySelector(
      `[name="${fieldName}"]`
    );
    const errorEl: HTMLElement | null = form.querySelector(
      `[data-error-for="${fieldName}"]`
    );
    const message: string = errors[fieldName] || '';

    if (field) {
      field.classList.toggle('delivery-form__control--invalid', Boolean(message));
      field.setAttribute('aria-invalid', String(Boolean(message)));
    }

    if (errorEl) {
      errorEl.textContent = message;
    }
  });
};

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
              <h2>Для оформления доставки необходимо авторизоваться</h2>
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
      <h2 class="delivery-page__title">Оформление доставки</h2>

      <form class="delivery-form" id="delivery-form" data-delivery>
        <fieldset class="delivery-form__section">
          <legend>Адрес доставки</legend>
          <label>
            Город
            <input type="text" name="city" value="${saved.city}" minlength="2" autocomplete="address-level2" required />
            <span class="delivery-form__field-error" data-error-for="city"></span>
          </label>
          <label>
            Адрес
            <input type="text" name="address" value="${saved.address}" minlength="5" autocomplete="street-address" required />
            <span class="delivery-form__field-error" data-error-for="address"></span>
          </label>
          <label>
            Телефон
            <input type="tel" name="phone" value="${saved.phone}" placeholder="+375..." inputmode="tel" autocomplete="tel" required />
            <span class="delivery-form__field-error" data-error-for="phone"></span>
          </label>
          <label>
            Email
            <input type="email" name="email" autocomplete="email" required />
            <span class="delivery-form__field-error" data-error-for="email"></span>
          </label>
          <label>
            Комментарий
            <textarea name="comment">${saved.comment}</textarea>
            <span class="delivery-form__field-error" data-error-for="comment"></span>
          </label>
        </fieldset>

        <fieldset class="delivery-form__section">
          <legend>Оплата</legend>
          <label>
            Номер карты
            <input type="text" name="cardNumber" placeholder="0000 0000 0000 0000" inputmode="numeric" autocomplete="cc-number" maxlength="19" required />
            <span class="delivery-form__field-error" data-error-for="cardNumber"></span>
          </label>
          <label>
            Имя владельца
            <input type="text" name="cardHolder" autocomplete="cc-name" required />
            <span class="delivery-form__field-error" data-error-for="cardHolder"></span>
          </label>
          <div class="delivery-form__row">
            <label>
              Срок действия
              <input type="text" name="expiry" placeholder="MM/YY" inputmode="numeric" autocomplete="cc-exp" maxlength="5" required />
              <span class="delivery-form__field-error" data-error-for="expiry"></span>
            </label>
            <label>
              CVV
              <input type="password" name="cvv" inputmode="numeric" autocomplete="cc-csc" maxlength="3" required />
              <span class="delivery-form__field-error" data-error-for="cvv"></span>
            </label>
          </div>
        </fieldset>

        <p class="delivery-form__error" id="delivery-error"></p>
        <button type="submit" class="delivery-form__submit">Подтвердить заказ</button>
      </form>
    </div>
  `;

  app.appendChild(main);

  const form: HTMLFormElement | null = document.getElementById(
    'delivery-form'
  ) as HTMLFormElement;
  const errorEl: HTMLElement | null = document.getElementById('delivery-error');
  const cardNumberInput: HTMLInputElement | null =
    form?.querySelector('[name="cardNumber"]') || null;
  const expiryInput: HTMLInputElement | null =
    form?.querySelector('[name="expiry"]') || null;
  const cvvInput: HTMLInputElement | null =
    form?.querySelector('[name="cvv"]') || null;

  const validateCurrentForm = (): DeliveryFormErrors => {
    if (!form) return {};

    const values: DeliveryFormValues = getFormValues(form);
    const errors: DeliveryFormErrors = validateDeliveryForm(values);
    renderFieldErrors(form, errors);

    return errors;
  };

  cardNumberInput?.addEventListener('input', () => {
    cardNumberInput.value = formatCardNumber(cardNumberInput.value);
    validateCurrentForm();
  });

  expiryInput?.addEventListener('input', () => {
    expiryInput.value = formatExpiry(expiryInput.value);
    validateCurrentForm();
  });

  cvvInput?.addEventListener('input', () => {
    cvvInput.value = digitsOnly(cvvInput.value).slice(0, 3);
    validateCurrentForm();
  });

  form?.querySelectorAll('input, textarea').forEach((field: Element) => {
    if (field === cardNumberInput || field === expiryInput || field === cvvInput) {
      return;
    }

    field.addEventListener('input', () => {
      validateCurrentForm();
    });
  });

  form?.addEventListener('submit', async (e: Event) => {
    e.preventDefault();
    if (errorEl) errorEl.textContent = '';

    const values: DeliveryFormValues = getFormValues(form);
    const errors: DeliveryFormErrors = validateDeliveryForm(values);

    renderFieldErrors(form, errors);

    if (Object.keys(errors).length > 0) {
      if (errorEl) {
        errorEl.textContent = 'Проверьте корректность заполнения формы';
      }

      const firstInvalidField: HTMLElement | null = form.querySelector(
        '.delivery-form__control--invalid'
      );
      firstInvalidField?.focus();
      return;
    }

    const {
      city,
      address,
      phone,
      email,
      comment,
      cardNumber,
      cardHolder,
      expiry,
      cvv,
    } = values;

    saveDeliveryProfile({ city, address, phone, comment });

    try {
      await createDelivery({
        delivery: { city, address, phone, email, comment },
        payment: { cardNumber, cardHolder, expiry, cvv },
      });

      localStorage.removeItem('cart');

      const container: HTMLElement | null = app.querySelector('.delivery-page');
      if (container) {
        container.innerHTML = `
          <div class="delivery-success">
            <h2>Заказ оформлен</h2>
            <p>Ваш заказ успешно создан. Мы свяжемся с вами для подтверждения.</p>
            <button class="cart-empty__btn" id="delivery-home-btn">На главную</button>
          </div>
        `;
        document
          .getElementById('delivery-home-btn')
          ?.addEventListener('click', () => {
            navigateTo('/');
          });
      }
    } catch (err: unknown) {
      if (errorEl) {
        errorEl.textContent =
          err instanceof Error ? err.message : 'Ошибка оформления';
      }
    }
  });
};
