import { renderHeader } from './components/header/index';
const API_URL = 'http://localhost:3000/api';
const initApp = async () => {
    renderHeader(); // Отрисовываем шапку
    const mainContent = document.querySelector('#products-root');
    // Функция отрисовки товаров (твоя зона ответственности)
    const showProducts = async () => {
        try {
            const response = await fetch(`${API_URL}/products`);
            if (!response.ok)
                throw new Error('404: Данные не найдены');
            const products = await response.json();
            mainContent.innerHTML = products.map(p => `
                <div class="product-card">
                    <div class="img-container">
                        <img src="${p.image}" alt="${p.title}">
                    </div>
                    <div class="info">
                        <h3 data-title>${p.title}</h3>
                        <p>${p.description}</p>
                        <div class="footer">
                            <span class="price" data-price>${p.price.toFixed(2)} BYN</span>
                            <button class="buy-btn">В корзину</button>
                        </div>
                    </div>
                </div>
            `).join('');
        }
        catch (err) {
            mainContent.innerHTML = `<p class="error">Проверь соединение с бэкендом (порт 3000)</p>`;
        }
    };
    // Слушаем клики по навигации (для коллег)
    document.addEventListener('click', (e) => {
        const target = e.target;
        if (target.classList.contains('nav-link')) {
            const page = target.getAttribute('data-page');
            if (page === 'main')
                showProducts();
            else
                mainContent.innerHTML = `<h2>Раздел "${page}" будет реализован коллегами</h2>`;
        }
    });
    await showProducts(); // Загружаем товары при старте
};
document.addEventListener('DOMContentLoaded', initApp);
