import { useState, FormEvent, ChangeEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

interface IRegisterForm { name: string; email: string; password: string; }

export const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<IRegisterForm>({ name: '', email: '', password: '' });

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:3000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
        credentials: 'include'
      });

      const data = await res.json();

      if (res.ok) {
        localStorage.setItem('isAuth', 'true');
        if (data.user?.name) localStorage.setItem('userName', data.user.name);
        
        navigate('/');
      } else {
        toast.error('Ошибка регистрации: ' + (data.message || ''));
      }
    } catch (error) {
      toast.error('Ошибка сети');
    }
  };

  return (
    <form data-registration onSubmit={handleSubmit} className="auth-form">
      <input className="auth-input" type="text" name="name" placeholder="Ваше Имя" value={formData.name} onChange={handleChange} required />
      <input className="auth-input" type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} required />
      <input className="auth-input" type="password" name="password" placeholder="Придумайте пароль" value={formData.password} onChange={handleChange} required />
      <button className="auth-btn" type="submit">Зарегистрироваться</button>
    </form>
  );
};
