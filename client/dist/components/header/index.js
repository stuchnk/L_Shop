export const renderHeader = () => {
    const headerElement = document.querySelector('#header-root');
    if (!headerElement)
        return;
    headerElement.innerHTML = `
        <header class="main-header">
            <div class="container header-flex">
                <div class="logo">L_SHOP</div>
                <nav class="main-nav">
                    <a href="/" class="nav-link active" data-link="main">Главная</a>
                    <a href="/basket" class="nav-link" data-link="basket">Корзина</a>
                    <a href="/login" class="nav-link" data-link="auth">Профиль</a>
                </nav>
            </div>
        </header>
    `;
};
