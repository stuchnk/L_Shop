import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';

interface IProduct {
  id: number;
  title: string;
  price: number;
  category: string;
  inStock: boolean;
  image: string;
}

export const Cart = () => {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState<IProduct[]>([]);
  const [num1] = useState(Math.floor(Math.random() * 10) + 1);
  const [num2] = useState(Math.floor(Math.random() * 10) + 1);
  const [captchaAnswer, setCaptchaAnswer] = useState('');
  const [loading, setLoading] = useState(true);

  // Загружаем реальную корзину при открытии
  useEffect(() => {
    loadCart();
  }, []);

  const loadCart = async () => {
    try {
      const res = await fetch('http://localhost:3000/api/cart', { credentials: 'include' });
      if (res.ok) {
        const data = await res.json();
        setCartItems(Array.isArray(data) ? data : []);
      } else if (res.status === 401) {
        toast.error('Сначала авторизуйтесь');
        navigate('/auth');
      }
    } catch (err) {
      toast.error('Ошибка загрузки корзины');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveFromCart = async (index: number) => {
    try {
      const res = await fetch(`http://localhost:3000/api/cart/${index}`, {
        method: 'DELETE',
        credentials: 'include'
      });
      
      if (res.ok) {
        const data = await res.json();
        setCartItems(data.cart);
        toast.success('Товар удален из корзины');
      } else {
        toast.error('Ошибка при удалении товара');
      }
    } catch (err) {
      toast.error('Ошибка соединения с сервером');
      console.error(err);
    }
  };

  const total = cartItems.reduce((sum, item) => sum + item.price, 0);

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    if (cartItems.length === 0) {
      toast.error('Корзина пуста!');
      return;
    }
    
    if (parseInt(captchaAnswer) !== (num1 + num2)) {
      toast.error('Неверный ответ в капче!');
      setCaptchaAnswer('');
      return;
    }
    
    // Очищаем корзину на сервере после "покупки"
    try {
      await fetch('http://localhost:3000/api/cart/clear', { 
        method: 'POST', 
        credentials: 'include' 
      });
      
      toast.success('Заказ успешно оформлен! Ожидайте доставку.', { duration: 3000 });
      setTimeout(() => navigate('/'), 2000);
    } catch (err) {
      toast.error('Ошибка при оформлении заказа');
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', fontSize: '18px', color: '#888' }}>
        Загрузка корзины...
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '1100px', margin: '40px auto', padding: '0 20px', fontFamily: 'sans-serif' }}>
      <Toaster position="bottom-right" />
      <Link to="/" style={{ textDecoration: 'none', color: '#cb11ab', fontWeight: '600', marginBottom: '30px', display: 'inline-flex', gap: '6px', alignItems: 'center', fontSize: '15px', transition: 'all 0.2s' }} onMouseOver={(e) => { e.currentTarget.style.opacity = '0.7'; e.currentTarget.style.transform = 'translateX(-3px)'; }} onMouseOut={(e) => { e.currentTarget.style.opacity = '1'; e.currentTarget.style.transform = 'translateX(0)'; }}>
        ← Вернуться в каталог
      </Link>
      
      <div style={{ display: 'flex', gap: '30px', flexWrap: 'wrap', alignItems: 'flex-start' }}>
        {/* Левая часть: Товары */}
        <div style={{ flex: '1 1 550px', background: 'white', padding: '32px', borderRadius: '20px', boxShadow: '0 4px 20px rgba(0,0,0,0.06)' }}>
          <h2 style={{ fontSize: '26px', marginBottom: '28px', fontWeight: 'bold', color: '#1a1a1a' }}>
            Ваша корзина <span style={{ color: '#888', fontSize: '16px', fontWeight: '500' }}>({cartItems.length})</span>
          </h2>
          
          {cartItems.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '80px 20px', color: '#999' }}>
              <p style={{ fontSize: '56px', marginBottom: '12px' }}>🛒</p>
              <p style={{ fontSize: '18px', marginBottom: '6px', fontWeight: '500' }}>Корзина пусто</p>
              <p style={{ fontSize: '14px', color: '#bbb' }}>Добавьте интересные товары из каталога</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {cartItems.map((item, index) => (
                <div key={index} style={{ display: 'flex', gap: '16px', alignItems: 'center', background: '#f8f9fb', padding: '16px', borderRadius: '14px', border: '1px solid #f0f0f0', transition: 'all 0.2s' }} onMouseOver={(e) => { e.currentTarget.style.background = '#f0f2f5'; e.currentTarget.style.boxShadow = '0 2px 8px rgba(203, 17, 171, 0.08)'; }} onMouseOut={(e) => { e.currentTarget.style.background = '#f8f9fb'; e.currentTarget.style.boxShadow = 'none'; }}>
                  <img src={item.image} alt={item.title} style={{ width: '90px', height: '90px', objectFit: 'cover', borderRadius: '12px' }} />
                  <div style={{ flex: 1 }}>
                    <h3 style={{ fontSize: '15px', marginBottom: '6px', color: '#1a1a1a', fontWeight: '600' }}>{item.title}</h3>
                    <p style={{ fontSize: '12px', color: '#888', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.5px', fontWeight: '500' }}>{item.category}</p>
                    <p style={{ fontSize: '20px', fontWeight: 'bold', color: '#cb11ab' }}>{item.price} BYN</p>
                  </div>
                  <button
                    onClick={() => handleRemoveFromCart(index)}
                    style={{ background: '#ff4d4f', color: 'white', border: 'none', padding: '10px 14px', borderRadius: '10px', cursor: 'pointer', fontSize: '12px', fontWeight: '600', transition: 'all 0.2s', whiteSpace: 'nowrap' }}
                    onMouseOver={(e) => { e.currentTarget.style.opacity = '0.85'; e.currentTarget.style.boxShadow = '0 4px 12px rgba(255, 77, 79, 0.3)'; }}
                    onMouseOut={(e) => { e.currentTarget.style.opacity = '1'; e.currentTarget.style.boxShadow = 'none'; }}
                  >
                    🗑 Удалить
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Правая часть: Оформление */}
        {cartItems.length > 0 && (
          <div style={{ flex: '1 1 340px', background: 'white', padding: '32px', borderRadius: '20px', boxShadow: '0 4px 20px rgba(0,0,0,0.06)', height: 'fit-content', position: 'sticky', top: '20px' }}>
            <h2 style={{ fontSize: '20px', marginBottom: '24px', fontWeight: 'bold', color: '#1a1a1a' }}>
              Оформление
            </h2>
            
            <div style={{ background: '#f8f9fb', padding: '18px', borderRadius: '14px', marginBottom: '24px', border: '1px solid #f0f0f0' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px', color: '#666', fontSize: '14px' }}>
                <span>Товаров:</span>
                <span style={{ fontWeight: '600' }}>{cartItems.length} шт.</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px', color: '#666', fontSize: '14px' }}>
                <span>Стоимость:</span>
                <span style={{ fontWeight: '600' }}>{total} BYN</span>
              </div>
              <div style={{ borderTop: '1.5px solid #e8e8e8', paddingTop: '12px', display: 'flex', justifyContent: 'space-between', fontSize: '20px', fontWeight: 'bold', color: '#cb11ab' }}>
                <span>Итого:</span>
                <span>{total} BYN</span>
              </div>
            </div>
            
            <form onSubmit={handleCheckout} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <input 
                style={{ padding: '13px 16px', border: '1px solid #e8e8e8', borderRadius: '11px', outline: 'none', fontSize: '14px', fontFamily: 'inherit', transition: 'all 0.2s' }} 
                type="text" 
                placeholder="Адрес доставки" 
                required 
                onFocus={(e) => { e.currentTarget.style.borderColor = '#cb11ab'; e.currentTarget.style.boxShadow = '0 0 0 3px rgba(203, 17, 171, 0.1)'; }}
                onBlur={(e) => { e.currentTarget.style.borderColor = '#e8e8e8'; e.currentTarget.style.boxShadow = 'none'; }}
              />
              <input 
                style={{ padding: '13px 16px', border: '1px solid #e8e8e8', borderRadius: '11px', outline: 'none', fontSize: '14px', fontFamily: 'inherit', transition: 'all 0.2s' }} 
                type="tel" 
                placeholder="Телефон" 
                required 
                onFocus={(e) => { e.currentTarget.style.borderColor = '#cb11ab'; e.currentTarget.style.boxShadow = '0 0 0 3px rgba(203, 17, 171, 0.1)'; }}
                onBlur={(e) => { e.currentTarget.style.borderColor = '#e8e8e8'; e.currentTarget.style.boxShadow = 'none'; }}
              />
              
              <div style={{ background: '#f8f9fb', padding: '16px', borderRadius: '12px', border: '1px solid #f0f0f0' }}>
                <p style={{ marginBottom: '12px', fontSize: '12px', color: '#666', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Проверка: решите пример</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <strong style={{ fontSize: '18px', color: '#333' }}>{num1} + {num2} = </strong>
                  <input 
                    style={{ width: '85px', textAlign: 'center', fontSize: '16px', padding: '10px', border: '1px solid #e8e8e8', borderRadius: '9px', outline: 'none', fontWeight: '600', fontFamily: 'inherit', transition: 'all 0.2s' }} 
                    type="number" 
                    value={captchaAnswer} 
                    onChange={e => setCaptchaAnswer(e.target.value)} 
                    required 
                    onFocus={(e) => { e.currentTarget.style.borderColor = '#cb11ab'; e.currentTarget.style.boxShadow = '0 0 0 3px rgba(203, 17, 171, 0.1)'; }}
                    onBlur={(e) => { e.currentTarget.style.borderColor = '#e8e8e8'; e.currentTarget.style.boxShadow = 'none'; }}
                  />
                </div>
              </div>

              <button 
                type="submit" 
                style={{ background: 'linear-gradient(135deg, #cb11ab 0%, #a40a7a 100%)', color: 'white', border: 'none', padding: '16px 20px', borderRadius: '12px', cursor: 'pointer', fontWeight: '600', fontSize: '15px', marginTop: '6px', transition: 'all 0.3s', fontFamily: 'inherit', boxShadow: '0 4px 12px rgba(203, 17, 171, 0.2)', textTransform: 'uppercase', letterSpacing: '0.5px' }}
                onMouseOver={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 20px rgba(203, 17, 171, 0.3)'; }}
                onMouseOut={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 12px rgba(203, 17, 171, 0.2)'; }}
              >
                Оплатить заказ
              </button>
              <button 
                type="button"
                onClick={() => navigate('/')}
                style={{ background: 'transparent', color: '#666', border: '1.5px solid #ddd', padding: '13px 20px', borderRadius: '12px', cursor: 'pointer', fontWeight: '600', fontSize: '14px', transition: 'all 0.2s', fontFamily: 'inherit', textTransform: 'uppercase', letterSpacing: '0.5px' }}
                onMouseOver={(e) => { e.currentTarget.style.borderColor = '#cb11ab'; e.currentTarget.style.color = '#cb11ab'; e.currentTarget.style.background = 'rgba(203, 17, 171, 0.05)'; }}
                onMouseOut={(e) => { e.currentTarget.style.borderColor = '#ddd'; e.currentTarget.style.color = '#666'; e.currentTarget.style.background = 'transparent'; }}
              >
                Продолжить покупки
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
