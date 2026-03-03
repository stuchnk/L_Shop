import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';

export const Cart = () => {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState<any[]>([]);
  const [num1] = useState(Math.floor(Math.random() * 10) + 1);
  const [num2] = useState(Math.floor(Math.random() * 10) + 1);
  const [captchaAnswer, setCaptchaAnswer] = useState('');

  // Загружаем реальную корзину при открытии
  useEffect(() => {
    fetch('http://localhost:3000/api/cart', { credentials: 'include' })
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setCartItems(data);
      })
      .catch(() => toast.error('Ошибка загрузки корзины'));
  }, []);

  const total = cartItems.reduce((sum, item) => sum + item.price, 0);

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    if (parseInt(captchaAnswer) !== (num1 + num2)) {
      toast.error('Неверный ответ в капче!');
      setCaptchaAnswer('');
      return;
    }
    
    // Очищаем корзину на сервере после "покупки"
    await fetch('http://localhost:3000/api/cart/clear', { method: 'POST', credentials: 'include' });
    
    toast.success('Заказ успешно оформлен! Ожидайте доставку.', { duration: 3000 });
    setTimeout(() => navigate('/'), 2000);
  };

  return (
    <div style={{ maxWidth: '900px', margin: '40px auto', padding: '0 20px', fontFamily: 'sans-serif' }}>
      <Toaster position="bottom-right" />
      <Link to="/" style={{ textDecoration: 'none', color: '#cb11ab', fontWeight: '600', marginBottom: '25px', display: 'inline-block', fontSize: '16px' }}>
        ← Назад в каталог
      </Link>
      
      <div style={{ display: 'flex', gap: '30px', flexWrap: 'wrap', alignItems: 'flex-start' }}>
        {/* Левая часть: Товары */}
        <div style={{ flex: '1 1 500px', background: 'white', padding: '30px', borderRadius: '24px', boxShadow: '0 10px 30px rgba(0,0,0,0.05)' }}>
          <h2 style={{ fontSize: '26px', marginBottom: '25px', fontWeight: 'bold' }}>Ваша корзина</h2>
          
          {cartItems.length === 0 ? (
            <p style={{ color: '#888', fontSize: '18px' }}>Корзина пока пуста. Добавьте что-нибудь из каталога!</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              {cartItems.map((item, index) => (
                <div key={index} style={{ display: 'flex', gap: '20px', alignItems: 'center', background: '#f9f9fa', padding: '15px', borderRadius: '16px' }}>
                  <img src={item.image} alt={item.title} style={{ width: '90px', height: '90px', objectFit: 'cover', borderRadius: '12px' }} />
                  <div style={{ flex: 1 }}>
                    <h3 data-title="basket" style={{ fontSize: '18px', marginBottom: '8px', color: '#333' }}>{item.title}</h3>
                    <p data-price="basket" style={{ fontSize: '20px', fontWeight: 'bold', color: '#cb11ab' }}>{item.price} BYN</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Правая часть: Оформление */}
        {cartItems.length > 0 && (
          <div style={{ flex: '1 1 300px', background: 'white', padding: '30px', borderRadius: '24px', boxShadow: '0 10px 30px rgba(0,0,0,0.05)' }}>
            <h2 style={{ fontSize: '22px', marginBottom: '20px', borderBottom: '1px solid #eee', paddingBottom: '15px' }}>
              Итого: <span style={{ color: '#cb11ab', float: 'right' }}>{total} BYN</span>
            </h2>
            
            <form data-delivery onSubmit={handleCheckout} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              <input style={inputStyle} type="text" placeholder="Город, Улица, Дом" required />
              <input style={inputStyle} type="tel" placeholder="+375 (XX) XXX-XX-XX" required />
              
              <div style={{ background: '#f0f0f4', padding: '20px', borderRadius: '16px', marginTop: '10px' }}>
                <p style={{ marginBottom: '12px', fontSize: '15px', color: '#555', fontWeight: '600' }}>Проверка от роботов:</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                  <strong style={{ fontSize: '22px', color: '#333' }}>{num1} + {num2} = </strong>
                  <input 
                    style={{ ...inputStyle, width: '90px', textAlign: 'center', fontSize: '18px', padding: '10px' }} 
                    type="number" 
                    value={captchaAnswer} 
                    onChange={e => setCaptchaAnswer(e.target.value)} 
                    required 
                  />
                </div>
              </div>

              <button className="auth-btn" type="submit" style={{ marginTop: '15px', padding: '18px', fontSize: '18px', borderRadius: '16px' }}>
                Оплатить заказ
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

// Инлайн стили для полей ввода (чтобы не писать классы)
const inputStyle = {
  width: '100%', padding: '16px', border: '1px solid #e0e0e0', borderRadius: '12px', fontSize: '16px', background: '#f9f9fa', outline: 'none'
};
