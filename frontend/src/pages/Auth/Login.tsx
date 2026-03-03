import { useState, FormEvent, ChangeEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
// Типизация, чтобы не было ошибок "any" по ТЗ
interface ILoginForm {
  identifier: string;
  password: string;
}

export const Login = () => {
  const navigate = useNavigate(); // Для редиректа после входа
  const [formData, setFormData] = useState<ILoginForm>({ identifier: '', password: '' });

  // Функция обработки ввода
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Функция отправки формы на бэкенд
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:3000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
        credentials: 'include'
      });

      const data = await res.json(); // Получаем ответ от сервера
      
      if (res.ok) {
        localStorage.setItem('isAuth', 'true');
        // Сервер (который мы писали ранее) возвращает { user: { name: 'Имя' } }
        if (data.user?.name) localStorage.setItem('userName', data.user.name);
        
        navigate('/'); 
      } else {
        toast.error('Неверный логин или пароль!');
      }
    } catch (error) {
      toast.error('Ошибка входа!');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="auth-form">
      <input 
        className="auth-input" 
        type="text" 
        name="identifier" 
        placeholder="Логин / Email / Телефон" 
        value={formData.identifier} 
        onChange={handleChange} 
        required 
      />
      <input 
        className="auth-input" 
        type="password" 
        name="password" 
        placeholder="Пароль" 
        value={formData.password} 
        onChange={handleChange} 
        required 
      />
      <button className="auth-btn" type="submit">Войти</button>
    </form>
  );
};
