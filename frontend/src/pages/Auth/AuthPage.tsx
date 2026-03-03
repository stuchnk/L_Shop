import { useState } from 'react';
import { Login } from './Login';
import { Register } from './Register';
import { Toaster } from 'react-hot-toast';
import '../../styles/auth.css';

export const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);

  return (
    // Этот div отцентрирует карточку строго по центру экрана
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', width: '100%' }}>
      <Toaster position="bottom-right" />
      
      <div className="auth-wrapper">
        <div className="auth-header">
          <h2>{isLogin ? 'С возвращением!' : 'Создать аккаунт'}</h2>
          <p>{isLogin ? 'Войдите, чтобы продолжить покупки' : 'Присоединяйтесь к L_Shop'}</p>
        </div>

        <div className="auth-tabs">
          <button 
            className={`auth-tab ${isLogin ? 'active' : ''}`}
            onClick={() => setIsLogin(true)}
          >
            Вход
          </button>
          <button 
            className={`auth-tab ${!isLogin ? 'active' : ''}`}
            onClick={() => setIsLogin(false)}
          >
            Регистрация
          </button>
        </div>

        {isLogin ? <Login /> : <Register />}
      </div>
    </div>
  );
};
