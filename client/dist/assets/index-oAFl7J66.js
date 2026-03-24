(function(){let e=document.createElement(`link`).relList;if(e&&e.supports&&e.supports(`modulepreload`))return;for(let e of document.querySelectorAll(`link[rel="modulepreload"]`))n(e);new MutationObserver(e=>{for(let t of e)if(t.type===`childList`)for(let e of t.addedNodes)e.tagName===`LINK`&&e.rel===`modulepreload`&&n(e)}).observe(document,{childList:!0,subtree:!0});function t(e){let t={};return e.integrity&&(t.integrity=e.integrity),e.referrerPolicy&&(t.referrerPolicy=e.referrerPolicy),e.crossOrigin===`use-credentials`?t.credentials=`include`:e.crossOrigin===`anonymous`?t.credentials=`omit`:t.credentials=`same-origin`,t}function n(e){if(e.ep)return;e.ep=!0;let n=t(e);fetch(e.href,n)}})();var e=e=>{let t=document.createElement(e.tag);return e.className&&(t.className=e.className),e.textContent&&(t.textContent=e.textContent),e.innerHTML&&(t.innerHTML=e.innerHTML),e.attributes&&Object.entries(e.attributes).forEach(([e,n])=>{t.setAttribute(e,n)}),e.children&&e.children.forEach(e=>t.appendChild(e)),e.onClick&&t.addEventListener(`click`,e.onClick),e.onInput&&t.addEventListener(`input`,e.onInput),e.onChange&&t.addEventListener(`change`,e.onChange),t},t=[],n=(e,n)=>{t.push({path:e,handler:n})},r=e=>{window.history.pushState({},``,e),a()},i=(e,t)=>{let n=e.split(`/`),r=t.split(`/`);if(n.length!==r.length)return null;let i={};for(let e=0;e<n.length;e++)if(n[e].startsWith(`:`))i[n[e].slice(1)]=r[e];else if(n[e]!==r[e])return null;return i},a=()=>{let e=window.location.pathname;for(let n of t){let t=i(n.path,e);if(t!==null){n.handler(t);return}}let n=t.find(e=>e.path===`/`);n&&n.handler()},o=()=>{window.addEventListener(`popstate`,a),a()},s=`lshop_token`,c=`lshop_user`,l=`lshop_delivery`,u=e=>{localStorage.setItem(s,e.token),localStorage.setItem(c,JSON.stringify(e.user)),window.dispatchEvent(new CustomEvent(`auth:changed`))},d=()=>{localStorage.removeItem(s),localStorage.removeItem(c),window.dispatchEvent(new CustomEvent(`auth:changed`))},f=()=>localStorage.getItem(s)||``,p=()=>{let e=localStorage.getItem(c);if(!e)return null;try{return JSON.parse(e)}catch{return null}},m=()=>!!(f()&&p()),h=e=>{localStorage.setItem(l,JSON.stringify(e))},g=()=>{let e=localStorage.getItem(l);if(!e)return{city:``,address:``,phone:``,comment:``};try{return JSON.parse(e)}catch{return{city:``,address:``,phone:``,comment:``}}},ee=e=>e.split(` `).map(e=>e[0]).join(``).slice(0,2).toUpperCase(),_=(t,n)=>e({tag:`a`,className:`header__link`,textContent:t,attributes:{href:n},onClick:e=>{e.preventDefault(),r(n)}}),v=()=>{let t=p(),n=m(),i=[_(`Каталог`,`/`),_(`Корзина`,`/cart`)];return n&&t?(i.push(e({tag:`button`,className:`header__profile`,attributes:{type:`button`},onClick:()=>r(`/profile`),children:[e({tag:`span`,className:`header__avatar`,textContent:ee(t.name)}),e({tag:`span`,className:`header__profile-copy`,children:[e({tag:`span`,className:`header__profile-label`,textContent:`Профиль`}),e({tag:`span`,className:`header__profile-name`,textContent:t.name})]})]})),i.push(e({tag:`button`,className:`header__logout`,textContent:`Выйти`,attributes:{type:`button`},onClick:()=>{d(),r(`/`)}}))):i.push(_(`Войти`,`/login`)),e({tag:`header`,className:`header`,children:[e({tag:`div`,className:`header__inner`,children:[e({tag:`button`,className:`header__brand`,attributes:{type:`button`},onClick:()=>r(`/`),children:[e({tag:`span`,className:`header__logo-mark`,textContent:`LS`}),e({tag:`span`,className:`header__logo-copy`,children:[e({tag:`span`,className:`header__logo-title`,textContent:`L_Shop Atelier`}),e({tag:`span`,className:`header__logo-subtitle`,textContent:`curated objects for everyday life`})]})]}),e({tag:`nav`,className:`header__nav`,children:i})]})]})},y=`http://localhost:3000/api`,b=()=>{throw d(),alert(`Сессия истекла. Войдите заново.`),r(`/login`),Error(`Unauthorized`)},te=async()=>{let e=await fetch(`${y}/basket`,{credentials:`include`});if(e.status===401&&b(),!e.ok)throw Error(`Ошибка загрузки корзины`);return e.json()},x=async e=>{let t=await fetch(`${y}/basket`,{method:`POST`,headers:{"Content-Type":`application/json`},credentials:`include`,body:JSON.stringify(e)});if(t.status===401&&b(),!t.ok)throw Error(`Ошибка добавления в корзину`);return t.json()},S=async(e,t)=>{let n=await fetch(`${y}/basket/${e}`,{method:`PATCH`,headers:{"Content-Type":`application/json`},credentials:`include`,body:JSON.stringify({quantity:t})});if(n.status===401&&b(),!n.ok)throw Error(`Ошибка обновления количества`);return n.json()},C=async e=>{let t=await fetch(`${y}/basket/${e}`,{method:`DELETE`,credentials:`include`});if(t.status===401&&b(),!t.ok)throw Error(`Ошибка удаления из корзины`);return t.json()},w=`http://localhost:3000/api`,T=async e=>{let t=new URLSearchParams;e.search&&t.append(`search`,e.search),e.sortBy&&t.append(`sortBy`,e.sortBy),e.category&&t.append(`category`,e.category),e.available&&t.append(`available`,e.available);let n=await fetch(`${w}/products?${t.toString()}`,{credentials:`include`});if(!n.ok)throw Error(`Ошибка загрузки товаров`);return n.json()},ne=async e=>{let t=await fetch(`${w}/products/${e}`,{credentials:`include`});if(!t.ok)throw Error(`Товар не найден`);return t.json()},re=async()=>{let e=await fetch(`${w}/products/categories`,{credentials:`include`});if(!e.ok)throw Error(`Ошибка загрузки категорий`);return e.json()},E=e=>{let t=Math.round(e);return`${`★`.repeat(t)}${`☆`.repeat(5-t)} ${e.toFixed(1)}`},ie=(t,n)=>{let r=1,i=e({tag:`span`,className:`card__qty-val`,textContent:`1`});return e({tag:`article`,className:`card ${t.available?``:`card--disabled`}`,children:[e({tag:`div`,className:`card__img-wrap`,onClick:()=>n.onOpenProduct(t),children:[e({tag:`img`,className:`card__img`,attributes:{src:t.image,alt:t.name,loading:`lazy`}}),e({tag:`span`,className:`card__badge ${t.available?`card__badge--in`:`card__badge--out`}`,textContent:t.available?`В наличии`:`Под заказ`})]}),e({tag:`div`,className:`card__body`,children:[e({tag:`div`,className:`card__topline`,children:[e({tag:`span`,className:`card__category`,textContent:t.category}),e({tag:`span`,className:`card__rating`,textContent:E(t.rating)})]}),e({tag:`h3`,className:`card__name`,textContent:t.name,attributes:{"data-title":t.name},onClick:()=>n.onOpenProduct(t)}),e({tag:`p`,className:`card__desc`,textContent:t.description}),e({tag:`div`,className:`card__meta`,children:[e({tag:`div`,className:`card__price-block`,children:[e({tag:`span`,className:`card__price-label`,textContent:`Цена`}),e({tag:`span`,className:`card__price`,textContent:`${t.price.toFixed(2)} BYN`,attributes:{"data-price":String(t.price)}})]}),e({tag:`span`,className:`card__stock`,textContent:t.available?`${t.quantity} шт. на складе`:`Поставка ожидается`})]}),e({tag:`div`,className:`card__footer`,children:[e({tag:`div`,className:`card__qty`,children:[e({tag:`button`,className:`card__qty-btn`,textContent:`−`,onClick:e=>{e.stopPropagation(),r>1&&(--r,i.textContent=String(r))}}),i,e({tag:`button`,className:`card__qty-btn`,textContent:`+`,onClick:e=>{e.stopPropagation(),r<t.quantity&&(r+=1,i.textContent=String(r))}})]}),e({tag:`button`,className:`card__cart-btn ${t.available?``:`card__cart-btn--disabled`}`,textContent:t.available?`В корзину`:`Недоступно`,attributes:t.available?{type:`button`}:{disabled:`true`},onClick:e=>{e.stopPropagation(),t.available&&n.onAddToCart(t,r)}})]})]})]})},D=(t,n,r)=>e({tag:`div`,className:`filters__group`,children:[e({tag:`label`,className:`filters__label`,textContent:t}),e({tag:`p`,className:`filters__hint`,textContent:n}),...r]}),O=(t,n,r)=>{let i={...n},a=null,o=()=>{a&&clearTimeout(a),a=setTimeout(()=>{r.onFilterChange({...i})},250)},s=e({tag:`aside`,className:`filters`,children:[e({tag:`div`,className:`filters__intro`,children:[e({tag:`span`,className:`filters__eyebrow`,textContent:`Navigation`}),e({tag:`h3`,className:`filters__title`,textContent:`Настройте витрину под ваш сценарий`}),e({tag:`p`,className:`filters__text`,textContent:`Отберите только те позиции, которые подходят по категории, доступности и формату покупки.`})]}),D(`Поиск`,`По названию или описанию`,[e({tag:`input`,className:`filters__input`,attributes:{type:`text`,placeholder:`Например, ноутбук или монитор`,value:i.search},onInput:e=>{i.search=e.target.value,o()}})]),D(`Сортировка`,`Управляйте порядком карточек`,[e({tag:`select`,className:`filters__select`,innerHTML:`
            <option value="">Без сортировки</option>
            <option value="price_asc" ${i.sortBy===`price_asc`?`selected`:``}>Сначала доступные по цене</option>
            <option value="price_desc" ${i.sortBy===`price_desc`?`selected`:``}>Сначала флагманские позиции</option>
          `,onChange:e=>{i.sortBy=e.target.value,r.onFilterChange({...i})}})]),D(`Категория`,`Переключайтесь между коллекциями`,[e({tag:`select`,className:`filters__select`,innerHTML:`
            <option value="">Все категории</option>
            ${t.map(e=>`<option value="${e}" ${i.category===e?`selected`:``}>${e}</option>`).join(``)}
          `,onChange:e=>{i.category=e.target.value,r.onFilterChange({...i})}})]),D(`Доступность`,`Смотрите только актуальные товары`,[e({tag:`select`,className:`filters__select`,innerHTML:`
            <option value="">Вся витрина</option>
            <option value="true" ${i.available===`true`?`selected`:``}>Только в наличии</option>
            <option value="false" ${i.available===`false`?`selected`:``}>Только отсутствующие</option>
          `,onChange:e=>{i.available=e.target.value,r.onFilterChange({...i})}})]),e({tag:`button`,className:`filters__reset`,textContent:`Сбросить настройки`,onClick:()=>{i.search=``,i.sortBy=``,i.category=``,i.available=``,r.onFilterChange({...i});let e=s.parentElement;e&&(e.innerHTML=``,e.appendChild(O(t,i,r)))}})]});return s},k={search:``,sortBy:``,category:``,available:``},A=async(e,t)=>{if(!m()){alert(`Для добавления товара в корзину войдите в аккаунт.`),r(`/login`);return}try{await x({productId:e.id,name:e.name,price:e.price,quantity:t,image:e.image}),alert(`Товар добавлен в корзину.`)}catch(e){if(e instanceof Error&&e.message===`Unauthorized`)return;d(),alert(`Сессия завершилась. Войдите снова.`),r(`/login`)}},ae=e=>{r(`/product/${e.id}`)},j=t=>t.length===0?e({tag:`div`,className:`products__empty`,innerHTML:`
        <span class="products__empty-mark">No Match</span>
        <h3>Мы не нашли товары по этим параметрам</h3>
        <p>Измените фильтры или сбросьте настройки, чтобы снова открыть всю коллекцию.</p>
      `}):e({tag:`div`,className:`products__grid`,children:t.map(e=>ie(e,{onAddToCart:A,onOpenProduct:ae}))}),oe=async()=>{let t=document.getElementById(`app`);if(!t)return;let n=t.querySelector(`.main`);n&&n.remove();let r=e({tag:`main`,className:`main home-page`,children:[e({tag:`section`,className:`home__hero`,children:[e({tag:`div`,className:`home__hero-copy`,children:[e({tag:`span`,className:`home__eyebrow`,textContent:`Curated Retail`}),e({tag:`h1`,className:`home__hero-title`,textContent:`Технологии, вещи и повседневные предметы в единой premium-витрине`}),e({tag:`p`,className:`home__hero-text`,textContent:`Редизайн в духе современных мировых брендов: много воздуха, акцент на товаре, тактильные карточки и спокойная, дорогая подача.`}),e({tag:`div`,className:`home__hero-tags`,children:[e({tag:`span`,className:`home__hero-tag`,textContent:`Editorial layout`}),e({tag:`span`,className:`home__hero-tag`,textContent:`Calm motion`}),e({tag:`span`,className:`home__hero-tag`,textContent:`Coursework ready`})]})]}),e({tag:`div`,className:`home__hero-panel`,children:[e({tag:`div`,className:`home__hero-card home__hero-card--accent`,innerHTML:`
                  <span class="home__hero-card-label">Selection</span>
                  <strong>Каталог, в котором на первом месте визуальный ритм и чистая композиция.</strong>
                `}),e({tag:`div`,className:`home__hero-card`,innerHTML:`
                  <span class="home__hero-card-label">Focus</span>
                  <strong>Меньше визуального шума, больше внимания к карточке товара и пути к покупке.</strong>
                `})]})]}),e({tag:`section`,className:`home__collection`,children:[e({tag:`div`,className:`home__sidebar`,attributes:{id:`sidebar`}}),e({tag:`div`,className:`home__content`,children:[e({tag:`div`,className:`home__header`,attributes:{id:`products-header`}}),e({tag:`div`,className:`home__grid`,attributes:{id:`products-grid`}})]})]})]});t.appendChild(r);try{let[t,n]=await Promise.all([T(k),re()]),r=document.getElementById(`sidebar`),i=document.getElementById(`products-grid`),a=document.getElementById(`products-header`);a&&a.appendChild(e({tag:`div`,className:`home__title-row`,children:[e({tag:`div`,className:`home__title-block`,children:[e({tag:`span`,className:`home__section-label`,textContent:`Collection`}),e({tag:`h2`,className:`home__title`,textContent:`Актуальные позиции каталога`}),e({tag:`p`,className:`home__subtitle`,textContent:`Выберите товары для курса, презентации или демонстрации полноценного клиентского опыта.`})]}),e({tag:`div`,className:`home__count-card`,children:[e({tag:`span`,className:`home__count-label`,textContent:`Сейчас в витрине`}),e({tag:`span`,className:`home__count`,textContent:`${t.length}`,attributes:{id:`products-count`}})]})]})),r&&r.appendChild(O(n,k,{onFilterChange:async e=>{k=e;let t=await T(k);i&&(i.innerHTML=``,i.appendChild(j(t)));let n=document.getElementById(`products-count`);n&&(n.textContent=String(t.length))}})),i&&i.appendChild(j(t))}catch{let t=document.getElementById(`products-grid`);t&&t.appendChild(e({tag:`div`,className:`products__error`,textContent:`Не удалось загрузить каталог. Проверьте подключение к серверу и обновите страницу.`}))}},se=e=>{let t=Math.round(e);return`${`★`.repeat(t)}${`☆`.repeat(5-t)} ${e.toFixed(1)} / 5`},ce=async t=>{let n=document.getElementById(`app`);if(!n)return;let i=n.querySelector(`.main`);i&&i.remove();let a=e({tag:`main`,className:`main`});n.appendChild(a);try{let n=await ne(parseInt(t,10)),i=1,o=e({tag:`span`,className:`detail__qty-val`,textContent:`1`}),s=e({tag:`section`,className:`detail`,children:[e({tag:`button`,className:`detail__back`,textContent:`Вернуться к каталогу`,onClick:()=>r(`/`)}),e({tag:`div`,className:`detail__content`,children:[e({tag:`div`,className:`detail__img-wrap`,children:[e({tag:`img`,className:`detail__img`,attributes:{src:n.image,alt:n.name}}),e({tag:`span`,className:`detail__stock ${n.available?`detail__stock--yes`:`detail__stock--no`}`,textContent:n.available?`В наличии · ${n.quantity} шт.`:`Сейчас нет в наличии`})]}),e({tag:`div`,className:`detail__info`,children:[e({tag:`span`,className:`detail__eyebrow`,textContent:n.category}),e({tag:`h1`,className:`detail__name`,textContent:n.name,attributes:{"data-title":n.name}}),e({tag:`p`,className:`detail__lead`,textContent:`Продуманная карточка товара с чистой подачей, мягкими акцентами и понятным сценарием покупки.`}),e({tag:`div`,className:`detail__rating`,textContent:se(n.rating)}),e({tag:`p`,className:`detail__desc`,textContent:n.description}),e({tag:`div`,className:`detail__facts`,children:[e({tag:`div`,className:`detail__fact`,innerHTML:`<span>Цена</span><strong>${n.price.toFixed(2)} BYN</strong>`}),e({tag:`div`,className:`detail__fact`,innerHTML:`<span>Наличие</span><strong>${n.available?`Готов к покупке`:`Под заказ`}</strong>`}),e({tag:`div`,className:`detail__fact`,innerHTML:`<span>Доставка</span><strong>1–3 дня по городу</strong>`})]}),e({tag:`div`,className:`detail__actions`,children:[e({tag:`div`,className:`detail__qty`,children:[e({tag:`button`,className:`detail__qty-btn`,textContent:`−`,onClick:()=>{i>1&&(--i,o.textContent=String(i))}}),o,e({tag:`button`,className:`detail__qty-btn`,textContent:`+`,onClick:()=>{i<n.quantity&&(i+=1,o.textContent=String(i))}})]}),e({tag:`button`,className:`detail__cart-btn ${n.available?``:`detail__cart-btn--disabled`}`,textContent:n.available?`Добавить в корзину`:`Недоступно`,attributes:n.available?{type:`button`}:{disabled:`true`},onClick:async()=>{if(n.available){if(!m()){alert(`Для добавления товара в корзину войдите в аккаунт.`),r(`/login`);return}try{await x({productId:n.id,name:n.name,price:n.price,quantity:i,image:n.image}),r(`/cart`)}catch(e){if(e instanceof Error&&e.message===`Unauthorized`)return;d(),alert(`Сессия завершилась. Войдите снова.`),r(`/login`)}}}})]})]})]})]});a.appendChild(s)}catch{a.appendChild(e({tag:`div`,className:`detail__error`,textContent:`Товар не найден. Вернитесь в каталог и выберите другую позицию.`}))}},M=`http://localhost:3000/api/users`,N=async e=>{let t=await e.json();if(!e.ok)throw Error(t.message||`Ошибка запроса`);return t},P=async e=>N(await fetch(`${M}/register`,{method:`POST`,headers:{"Content-Type":`application/json`},credentials:`include`,body:JSON.stringify(e)})),F=async e=>N(await fetch(`${M}/login`,{method:`POST`,headers:{"Content-Type":`application/json`},credentials:`include`,body:JSON.stringify(e)})),I=()=>{let e=document.createElement(`p`);return e.className=`auth-form__error`,e},L=(e,t,n)=>!e||!t||!n?`Заполните все поля`:/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(t)?n.length<6?`Пароль должен содержать минимум 6 символов`:``:`Введите корректный email`,R=(e,t)=>!e||!t?`Введите email и пароль`:/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e)?``:`Введите корректный email`,z=()=>{let e=document.createElement(`main`);e.className=`main auth-page`,e.innerHTML=`
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
  `;let t=e.querySelector(`#login-form`),n=I();return t.append(n),e.querySelector(`#to-register`).addEventListener(`click`,()=>{r(`/register`)}),t.addEventListener(`submit`,async e=>{e.preventDefault();let i=new FormData(t),a=String(i.get(`email`)||``).trim(),o=String(i.get(`password`)||``).trim();n.textContent=``;let s=R(a,o);if(s){n.textContent=s;return}try{let e=await F({email:a,password:o});u({token:e.token,user:e.user}),r(`/`)}catch(e){n.textContent=e instanceof Error?e.message:`Ошибка авторизации`}}),e},B=()=>{let e=document.createElement(`main`);e.className=`main auth-page`,e.innerHTML=`
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
  `;let t=e.querySelector(`#register-form`),n=I();return t.append(n),e.querySelector(`#to-login`).addEventListener(`click`,()=>{r(`/login`)}),t.addEventListener(`submit`,async e=>{e.preventDefault();let i=new FormData(t),a=String(i.get(`name`)||``).trim(),o=String(i.get(`email`)||``).trim(),s=String(i.get(`password`)||``).trim();n.textContent=``;let c=L(a,o,s);if(c){n.textContent=c;return}try{let e=await P({name:a,email:o,password:s});u({token:e.token,user:e.user}),r(`/`)}catch(e){n.textContent=e instanceof Error?e.message:`Ошибка регистрации`}}),e},V=`http://localhost:3000/api`,H=async e=>{let t=await fetch(`${V}/delivery`,{method:`POST`,headers:{"Content-Type":`application/json`},credentials:`include`,body:JSON.stringify(e)});if(!t.ok){let e=await t.json();throw Error(e.message||`Ошибка оформления доставки`)}return t.json()},U=async()=>{let e=await fetch(`${V}/delivery`,{credentials:`include`});if(!e.ok)throw Error(`Ошибка загрузки доставок`);return e.json()},W=e=>{let t=document.getElementById(`orders-container`);if(t){if(!e.length){t.innerHTML=`
      <div class="profile-history__item">
        <div>
          <strong>История заказов пока пуста</strong>
          <p>После оформления заказа здесь будут отображаться ваши покупки.</p>
        </div>
        <span class="profile-history__status">Нет заказов</span>
      </div>
    `;return}t.innerHTML=[...e].sort((e,t)=>new Date(t.createdAt).getTime()-new Date(e.createdAt).getTime()).map(e=>{let t=new Date(e.createdAt).toLocaleString(),n=e.totalPrice.toFixed(2),r=e.items.map(e=>`
            <li class="profile-history__line">
              ${e.name} x ${e.quantity} - ${(e.price*e.quantity).toFixed(2)} BYN
            </li>
          `).join(``);return`
        <div class="profile-history__item">
          <div>
            <strong>Заказ #${e.id}</strong>
            <p>Дата: ${t}</p>
            <p>Сумма: ${n} BYN</p>
            <p>Адрес: ${e.delivery.address}, ${e.delivery.city}</p>
            <ul class="profile-history__list">
              ${r}
            </ul>
          </div>
          <span class="profile-history__status">${e.status}</span>
        </div>
      `}).join(``)}},le=()=>{let e=document.createElement(`main`);if(e.className=`main profile-page`,!m())return e.innerHTML=`
      <section class="profile-card">
        <h1 class="profile-card__title">Профиль недоступен</h1>
        <p class="profile-card__text">Сначала войдите в аккаунт, чтобы открыть профиль.</p>
        <button class="profile-card__action" type="button" id="go-login">Перейти ко входу</button>
      </section>
    `,e.querySelector(`#go-login`).addEventListener(`click`,()=>r(`/login`)),e;let t=p(),n=g();e.innerHTML=`
    <section class="profile-layout">
      <div class="profile-card">
        <div class="profile-card__head">
          <div class="profile-card__avatar">${t?.name?.slice(0,1).toUpperCase()||`U`}</div>
          <div>
            <h1 class="profile-card__title">${t?.name||`Пользователь`}</h1>
            <p class="profile-card__text">${t?.email||``}</p>
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
          <input class="profile-form__input" name="city" placeholder="Город" value="${n.city}" />
          <input class="profile-form__input" name="address" placeholder="Адрес доставки" value="${n.address}" />
          <input class="profile-form__input" name="phone" placeholder="Телефон" value="${n.phone}" />
          <textarea class="profile-form__textarea" name="comment" placeholder="Комментарий для курьера">${n.comment}</textarea>
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
  `;let i=e.querySelector(`#delivery-form`),a=e.querySelector(`#delivery-message`),o=e.querySelector(`#orders-container`);return i.addEventListener(`submit`,e=>{e.preventDefault();let t=new FormData(i);h({city:String(t.get(`city`)||``).trim(),address:String(t.get(`address`)||``).trim(),phone:String(t.get(`phone`)||``).trim(),comment:String(t.get(`comment`)||``).trim()}),a.textContent=`Данные для доставки сохранены`}),U().then(e=>{W(e)}).catch(()=>{o.innerHTML=`<p>Ошибка загрузки заказов</p>`}),e},ue=(t,n)=>e({tag:`div`,className:`cart-item`,children:[e({tag:`img`,className:`cart-item__img`,attributes:{src:t.image,alt:t.name}}),e({tag:`div`,className:`cart-item__info`,children:[e({tag:`h3`,className:`cart-item__name`,textContent:t.name,attributes:{"data-title":t.name}}),e({tag:`span`,className:`cart-item__price`,textContent:`${t.price.toFixed(2)} BYN`,attributes:{"data-price":String(t.price)}})]}),e({tag:`div`,className:`cart-item__controls`,children:[e({tag:`button`,className:`cart-item__btn`,textContent:`−`,onClick:async()=>{t.quantity>1?await S(t.productId,t.quantity-1):await C(t.productId),await n()}}),e({tag:`span`,className:`cart-item__qty`,textContent:String(t.quantity)}),e({tag:`button`,className:`cart-item__btn`,textContent:`+`,onClick:async()=>{await S(t.productId,t.quantity+1),await n()}}),e({tag:`button`,className:`cart-item__remove`,textContent:`Удалить`,onClick:async()=>{await C(t.productId),await n()}})]}),e({tag:`span`,className:`cart-item__total`,textContent:`${(t.price*t.quantity).toFixed(2)} BYN`})]}),G=(t,n,i,a,o)=>{t.appendChild(e({tag:`div`,className:`cart-empty`,innerHTML:`
        <span class="cart-empty__eyebrow">Basket</span>
        <h2>${n}</h2>
        <p>${i}</p>
        <button class="cart-empty__btn" id="cart-state-btn">${a}</button>
      `})),document.getElementById(`cart-state-btn`)?.addEventListener(`click`,()=>{r(o)})},de=async()=>{let t=document.getElementById(`app`);if(!t)return;let n=t.querySelector(`.main`);n&&n.remove();let i=e({tag:`main`,className:`main`,children:[e({tag:`div`,className:`cart-page`,attributes:{id:`cart-container`}})]});t.appendChild(i);let a=document.getElementById(`cart-container`);if(!a)return;if(!m()){G(a,`Корзина доступна после входа`,`Авторизуйтесь, чтобы хранить товары, оформлять доставку и видеть актуальную историю покупок.`,`Перейти ко входу`,`/login`);return}let o=async()=>{a.innerHTML=``;try{let t=await te();if(t.length===0){G(a,`В корзине пока нет товаров`,`Добавьте несколько позиций из каталога, чтобы перейти к оформлению заказа.`,`Вернуться в каталог`,`/`);return}let n=t.reduce((e,t)=>e+t.quantity,0),i=t.reduce((e,t)=>e+t.price*t.quantity,0);a.appendChild(e({tag:`div`,className:`cart-page__hero`,children:[e({tag:`div`,className:`cart-page__hero-copy`,children:[e({tag:`span`,className:`cart-page__eyebrow`,textContent:`Checkout Preview`}),e({tag:`h2`,className:`cart-page__title`,textContent:`Корзина готова к оформлению`}),e({tag:`p`,className:`cart-page__text`,textContent:`Проверьте состав заказа, скорректируйте количество и переходите к доставке.`})]}),e({tag:`div`,className:`cart-page__hero-total`,children:[e({tag:`span`,className:`cart-page__hero-label`,textContent:`Итог`}),e({tag:`strong`,className:`cart-page__hero-price`,textContent:`${i.toFixed(2)} BYN`})]})]}));let s=e({tag:`div`,className:`cart-page__layout`}),c=e({tag:`div`,className:`cart-list`});t.forEach(e=>{c.appendChild(ue(e,o))});let l=e({tag:`aside`,className:`cart-summary`,children:[e({tag:`span`,className:`cart-summary__eyebrow`,textContent:`Summary`}),e({tag:`h3`,className:`cart-summary__title`,textContent:`Сводка заказа`}),e({tag:`div`,className:`cart-summary__row`,children:[e({tag:`span`,textContent:`Позиции`}),e({tag:`span`,textContent:String(n)})]}),e({tag:`div`,className:`cart-summary__row`,children:[e({tag:`span`,textContent:`Товаров`}),e({tag:`span`,textContent:String(t.length)})]}),e({tag:`div`,className:`cart-summary__row cart-summary__row--total`,children:[e({tag:`span`,textContent:`Итого`}),e({tag:`span`,className:`cart-summary__total`,textContent:`${i.toFixed(2)} BYN`})]}),e({tag:`p`,className:`cart-summary__note`,textContent:`На следующем шаге вы подтвердите адрес, контактные данные и способ оплаты.`}),e({tag:`button`,className:`cart-summary__order-btn`,textContent:`Перейти к доставке`,onClick:()=>r(`/delivery`)})]});s.appendChild(c),s.appendChild(l),a.appendChild(s)}catch{a.appendChild(e({tag:`div`,className:`cart-empty`,textContent:`Не удалось загрузить корзину. Попробуйте обновить страницу.`}))}};await o()},fe=/^[^\s@]+@[^\s@]+\.[^\s@]+$/,K=/^[A-Za-zА-Яа-яЁёІіЇїЄє\s-]{2,}$/,pe=/^[A-Za-zА-Яа-яЁёІіЇїЄє\s.'-]{2,}$/,q=e=>e.replace(/\D/g,``),me=e=>e.replace(/[^\d+]/g,``),J=e=>q(e).slice(0,16).replace(/(\d{4})(?=\d)/g,`$1 `).trim(),Y=e=>{let t=q(e).slice(0,4);return t.length<=2?t:`${t.slice(0,2)}/${t.slice(2)}`},he=e=>{if(!/^\d{2}\/\d{2}$/.test(e))return!1;let[t,n]=e.split(`/`),r=Number(t),i=Number(n)+2e3;if(!r||r<1||r>12)return!1;let a=new Date,o=a.getFullYear(),s=a.getMonth()+1;return!(i<o||i===o&&r<s)},X=e=>{let t=new FormData(e);return{city:String(t.get(`city`)||``).trim(),address:String(t.get(`address`)||``).trim(),phone:me(String(t.get(`phone`)||``).trim()),email:String(t.get(`email`)||``).trim(),comment:String(t.get(`comment`)||``).trim(),cardNumber:J(String(t.get(`cardNumber`)||``).trim()),cardHolder:String(t.get(`cardHolder`)||``).trim(),expiry:Y(String(t.get(`expiry`)||``).trim()),cvv:q(String(t.get(`cvv`)||``).trim()).slice(0,3)}},Z=e=>{let t={};return e.city?K.test(e.city)||(t.city=`Укажите корректное название города`):t.city=`Введите город`,e.address?e.address.length<5&&(t.address=`Адрес должен быть не короче 5 символов`):t.address=`Введите адрес доставки`,e.phone?/^\+?\d{10,15}$/.test(e.phone)||(t.phone=`Телефон должен содержать от 10 до 15 цифр`):t.phone=`Введите телефон`,e.email?fe.test(e.email)||(t.email=`Введите корректный email`):t.email=`Введите email`,e.cardNumber?q(e.cardNumber).length!==16&&(t.cardNumber=`Номер карты должен содержать 16 цифр`):t.cardNumber=`Введите номер карты`,e.cardHolder?pe.test(e.cardHolder)||(t.cardHolder=`Укажите имя владельца латиницей или кириллицей`):t.cardHolder=`Введите имя владельца карты`,e.expiry?he(e.expiry)||(t.expiry=`Укажите корректный срок действия в формате MM/YY`):t.expiry=`Введите срок действия карты`,e.cvv?/^\d{3}$/.test(e.cvv)||(t.cvv=`CVV должен содержать 3 цифры`):t.cvv=`Введите CVV`,t},Q=(e,t)=>{[`city`,`address`,`phone`,`email`,`comment`,`cardNumber`,`cardHolder`,`expiry`,`cvv`].forEach(n=>{let r=e.querySelector(`[name="${n}"]`),i=e.querySelector(`[data-error-for="${n}"]`),a=t[n]||``;r&&(r.classList.toggle(`delivery-form__control--invalid`,!!a),r.setAttribute(`aria-invalid`,String(!!a))),i&&(i.textContent=a)})},ge=()=>{let t=document.getElementById(`app`);if(!t)return;let n=t.querySelector(`.main`);if(n&&n.remove(),!m()){t.appendChild(e({tag:`main`,className:`main`,children:[e({tag:`div`,className:`cart-empty`,innerHTML:`
              <h2>Для оформления доставки необходимо авторизоваться</h2>
              <button class="cart-empty__btn" id="del-login-btn">Войти</button>
            `})]})),document.getElementById(`del-login-btn`)?.addEventListener(`click`,()=>{r(`/login`)});return}let i=g(),a=e({tag:`main`,className:`main`});a.innerHTML=`
    <div class="delivery-page">
      <h2 class="delivery-page__title">Оформление доставки</h2>

      <form class="delivery-form" id="delivery-form" data-delivery>
        <fieldset class="delivery-form__section">
          <legend>Адрес доставки</legend>
          <label>
            Город
            <input type="text" name="city" value="${i.city}" minlength="2" autocomplete="address-level2" required />
            <span class="delivery-form__field-error" data-error-for="city"></span>
          </label>
          <label>
            Адрес
            <input type="text" name="address" value="${i.address}" minlength="5" autocomplete="street-address" required />
            <span class="delivery-form__field-error" data-error-for="address"></span>
          </label>
          <label>
            Телефон
            <input type="tel" name="phone" value="${i.phone}" placeholder="+375..." inputmode="tel" autocomplete="tel" required />
            <span class="delivery-form__field-error" data-error-for="phone"></span>
          </label>
          <label>
            Email
            <input type="email" name="email" autocomplete="email" required />
            <span class="delivery-form__field-error" data-error-for="email"></span>
          </label>
          <label>
            Комментарий
            <textarea name="comment">${i.comment}</textarea>
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
  `,t.appendChild(a);let o=document.getElementById(`delivery-form`),s=document.getElementById(`delivery-error`),c=o?.querySelector(`[name="cardNumber"]`)||null,l=o?.querySelector(`[name="expiry"]`)||null,u=o?.querySelector(`[name="cvv"]`)||null,d=()=>{if(!o)return{};let e=Z(X(o));return Q(o,e),e};c?.addEventListener(`input`,()=>{c.value=J(c.value),d()}),l?.addEventListener(`input`,()=>{l.value=Y(l.value),d()}),u?.addEventListener(`input`,()=>{u.value=q(u.value).slice(0,3),d()}),o?.querySelectorAll(`input, textarea`).forEach(e=>{e===c||e===l||e===u||e.addEventListener(`input`,()=>{d()})}),o?.addEventListener(`submit`,async e=>{e.preventDefault(),s&&(s.textContent=``);let n=X(o),i=Z(n);if(Q(o,i),Object.keys(i).length>0){s&&(s.textContent=`Проверьте корректность заполнения формы`),o.querySelector(`.delivery-form__control--invalid`)?.focus();return}let{city:a,address:c,phone:l,email:u,comment:d,cardNumber:f,cardHolder:p,expiry:m,cvv:g}=n;h({city:a,address:c,phone:l,comment:d});try{await H({delivery:{city:a,address:c,phone:l,email:u,comment:d},payment:{cardNumber:f,cardHolder:p,expiry:m,cvv:g}}),localStorage.removeItem(`cart`);let e=t.querySelector(`.delivery-page`);e&&(e.innerHTML=`
          <div class="delivery-success">
            <h2>Заказ оформлен</h2>
            <p>Ваш заказ успешно создан. Мы свяжемся с вами для подтверждения.</p>
            <button class="cart-empty__btn" id="delivery-home-btn">На главную</button>
          </div>
        `,document.getElementById(`delivery-home-btn`)?.addEventListener(`click`,()=>{r(`/`)}))}catch(e){s&&(s.textContent=e instanceof Error?e.message:`Ошибка оформления`)}})},$=document.getElementById(`app`);if($){let e=()=>{let e=$.querySelector(`.header`);e?e.replaceWith(v()):$.prepend(v())};e(),n(`/`,()=>{oe()}),n(`/product/:id`,e=>{e&&e.id&&ce(e.id)}),n(`/cart`,()=>{de()}),n(`/delivery`,()=>{ge()}),n(`/login`,()=>{let e=$.querySelector(`.main`);e&&e.remove(),$.appendChild(z())}),n(`/register`,()=>{let e=$.querySelector(`.main`);e&&e.remove(),$.appendChild(B())}),n(`/profile`,()=>{let e=$.querySelector(`.main`);e&&e.remove(),$.appendChild(le())}),window.addEventListener(`auth:changed`,()=>{e()}),o()}