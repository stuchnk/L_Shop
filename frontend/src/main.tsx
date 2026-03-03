import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthPage } from './pages/Auth/AuthPage';
import { Home } from './pages/Home/Home';
import { Cart } from './pages/Cart/Cart';
import './styles/global.css';

// Компонент-обертка для защиты роутов
const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const isAuth = localStorage.getItem('isAuth');
  // Если не авторизован - кидаем на страницу логина
  return isAuth ? children : <Navigate to="/auth" replace />;
};

const rootElement = document.getElementById('root');
if (!rootElement) throw new Error('Не найден элемент root');

ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        {/* Страница авторизации/регистрации */}
        <Route path="/auth" element={<AuthPage />} />
        
        {/* Главная страница теперь доступна только после входа */}
        <Route path="/" element={
          <ProtectedRoute>
            <Home />
          </ProtectedRoute>
        } />
        
        {/* Корзина тоже защищена */}
        <Route path="/cart" element={
          <ProtectedRoute>
            <Cart />
          </ProtectedRoute>
        } />

        {/* Если ввели неизвестный URL - кидаем на корень (который проверит авторизацию) */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
