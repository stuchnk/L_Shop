import { loginUser, registerUser } from '../../api/auth';
import { navigateTo } from '../../utils/router';
import { saveSession } from '../../utils/auth';

const createFieldError = (): HTMLParagraphElement => {
  const error = document.createElement('p');
  error.className = 'auth-form__error';
  return error;
};

const validateRegisterForm = (
  name: string,
  email: string,
  password: string
): string => {
  if (!name || !email || !password) {
    return 'Заполните все поля';
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return 'Введите корректный email';
  }

  if (password.length < 6) {
    return 'Пароль должен содержать минимум 6 символов';
  }

  return '';
};

const validateLoginForm = (email: string, password: string): string => {
  if (!email || !password) {
    return 'Введите email и пароль';
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return 'Введите корректный email';
  }

  return '';
};

export const createLoginPage = (): HTMLElement => {
  const page = document.createElement('main');
  page.className = 'main auth-page';

  page.innerHTML = `
    <section class="auth-card">
      <div class="auth-card__badge">L_Shop</div>
      <h1 class="auth-card__title">Вход в аккаунт</h1>
      <p class="auth-card__subtitle">Войдите, чтобы перейти к покупкам и профилю.</p>

      <form class="auth-form" id="login-form">
        <label class="auth-form__label">
          <span>Email</span>
          <input class="auth-form__input" type="email" name="email" placeholder="Введите email" />
        </label>

        <label class="auth-form__label">
          <span>Пароль</span>
          <input class="auth-form__input" type="password" name="password" placeholder="Введите пароль" />
        </label>

        <button class="auth-form__button" type="submit">Войти</button>
      </form>

      <div class="auth-card__footer">
        <span>Нет аккаунта?</span>
        <button class="auth-card__switch" type="button" id="to-register">
          Зарегистрироваться
        </button>
      </div>
    </section>
  `;

  const form = page.querySelector('#login-form') as HTMLFormElement;
  const error = createFieldError();
  form.append(error);

  const switchButton = page.querySelector('#to-register') as HTMLButtonElement;
  switchButton.addEventListener('click', () => {
    navigateTo('/register');
  });

  form.addEventListener('submit', async (event) => {
    event.preventDefault();

    const formData = new FormData(form);
    const email = String(formData.get('email') || '').trim();
    const password = String(formData.get('password') || '').trim();

    error.textContent = '';

    const validationError = validateLoginForm(email, password);

    if (validationError) {
      error.textContent = validationError;
      return;
    }

    try {
      const result = await loginUser({ email, password });

      saveSession({
        token: result.token,
        user: result.user,
      });

      navigateTo('/');
    } catch (err) {
      error.textContent =
        err instanceof Error ? err.message : 'Ошибка авторизации';
    }
  });

  return page;
};

export const createRegisterPage = (): HTMLElement => {
  const page = document.createElement('main');
  page.className = 'main auth-page';

  page.innerHTML = `
    <section class="auth-card">
      <div class="auth-card__badge">L_Shop</div>
      <h1 class="auth-card__title">Регистрация</h1>
      <p class="auth-card__subtitle">Создайте аккаунт и сохраните данные для доставки.</p>

      <form class="auth-form" id="register-form">
        <label class="auth-form__label">
          <span>Имя</span>
          <input class="auth-form__input" type="text" name="name" placeholder="Введите имя" />
        </label>

        <label class="auth-form__label">
          <span>Email</span>
          <input class="auth-form__input" type="email" name="email" placeholder="Введите email" />
        </label>

        <label class="auth-form__label">
          <span>Пароль</span>
          <input class="auth-form__input" type="password" name="password" placeholder="Минимум 6 символов" />
        </label>

        <button class="auth-form__button" type="submit">Создать аккаунт</button>
      </form>

      <div class="auth-card__footer">
        <span>Уже есть аккаунт?</span>
        <button class="auth-card__switch" type="button" id="to-login">
          Войти
        </button>
      </div>
    </section>
  `;

  const form = page.querySelector('#register-form') as HTMLFormElement;
  const error = createFieldError();
  form.append(error);

  const switchButton = page.querySelector('#to-login') as HTMLButtonElement;
  switchButton.addEventListener('click', () => {
    navigateTo('/login');
  });

  form.addEventListener('submit', async (event) => {
    event.preventDefault();

    const formData = new FormData(form);
    const name = String(formData.get('name') || '').trim();
    const email = String(formData.get('email') || '').trim();
    const password = String(formData.get('password') || '').trim();

    error.textContent = '';

    const validationError = validateRegisterForm(name, email, password);

    if (validationError) {
      error.textContent = validationError;
      return;
    }

    try {
      const result = await registerUser({ name, email, password });

      saveSession({
        token: result.token,
        user: result.user,
      });

      navigateTo('/');
    } catch (err) {
      error.textContent =
        err instanceof Error ? err.message : 'Ошибка регистрации';
    }
  });

  return page;
};
