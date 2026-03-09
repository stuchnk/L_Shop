import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';
import '../../styles/home.css';

interface IProduct { 
  id: number; 
  title: string; 
  price: number; 
  category: string; 
  inStock: boolean; 
  image: string; 
}

export const Home = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState<IProduct[]>([]);
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('asc');

  useEffect(() => {
    fetch('http://localhost:3000/api/products')
      .then(res => res.json())
      .then(data => setProducts(data))
      .catch(err => console.error(err));
  }, []);

  const filteredProducts = products
    .filter(p => p.title.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => sort === 'asc' ? a.price - b.price : b.price - a.price);

  const handleAddToCart = async (product: IProduct) => {
    try {
      const res = await fetch('http://localhost:3000/api/cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ product }),
        credentials: 'include'
      });
      
      if (res.ok) {
        toast.success(`${product.title} добавлен в корзину!`, {
          style: { borderRadius: '12px', background: '#333', color: '#fff', fontSize: '14px' }
        });
      } else {
        toast.error('Войдите в аккаунт, чтобы добавить в корзину');
      }
    } catch (e) {
      toast.error('Ошибка соединения с сервером');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('isAuth');
    localStorage.removeItem('userName');
    navigate('/auth');
  };

  const userName = localStorage.getItem('userName') || 'Пользователь';

  return (
    <div className="home-container">
      <Toaster position="bottom-right" reverseOrder={false} /> 

      {/* Header */}
      <header style={{ marginBottom: '50px' }}>
        {/* Верхняя строка: Логотип и профиль */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px', paddingBottom: '24px', borderBottom: '1px solid #f0f0f0' }}>
          <h1 style={{ color: '#cb11ab', margin: 0, fontSize: '36px', fontWeight: '900', letterSpacing: '-1.5px' }}>L_Shop</h1>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', borderRight: '1px solid #f0f0f0', paddingRight: '20px' }}>
              <div style={{ width: '44px', height: '44px', borderRadius: '50%', background: 'linear-gradient(135deg, #cb11ab 0%, #a00786 100%)', display: 'flex', justifyContent: 'center', alignItems: 'center', fontWeight: 'bold', color: 'white', fontSize: '18px' }}>
                {userName.charAt(0).toUpperCase()}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                <span style={{ fontWeight: 700, fontSize: '15px', color: '#1a1a1a' }}>Привет!</span>
                <span style={{ fontWeight: '500', fontSize: '13px', color: '#888' }}>{userName}</span>
              </div>
            </div>
            
            <button 
              onClick={handleLogout} 
              style={{ background: 'transparent', color: '#888', border: '1.5px solid #ddd', padding: '10px 18px', borderRadius: '10px', cursor: 'pointer', transition: 'all 0.2s', fontSize: '14px', fontWeight: '600' }}
              onMouseOver={(e) => { e.currentTarget.style.color = '#cb11ab'; e.currentTarget.style.borderColor = '#cb11ab'; e.currentTarget.style.background = 'rgba(203, 17, 171, 0.05)'; }}
              onMouseOut={(e) => { e.currentTarget.style.color = '#888'; e.currentTarget.style.borderColor = '#ddd'; e.currentTarget.style.background = 'transparent'; }}
            >
              ⎋ Выход
            </button>
          </div>
        </div>

        {/* Нижняя строка: Фильтры и действия */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '20px', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', gap: '12px', flex: '1', minWidth: '320px' }}>
            <input 
              type="text" 
              placeholder="🔍 Поиск товаров..." 
              value={search} 
              onChange={(e) => setSearch(e.target.value)} 
              className="search-input"
              style={{ flex: 1 }}
            />
            <select 
              value={sort} 
              onChange={(e) => setSort(e.target.value)} 
              className="sort-select"
            >
              <option value="asc">💰 Дешевле</option>
              <option value="desc">💎 Дороже</option>
            </select>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ fontSize: '14px', fontWeight: '500', color: '#666', whiteSpace: 'nowrap', background: '#f8f9fb', padding: '8px 16px', borderRadius: '10px' }}>
              Найдено: <span style={{ color: '#cb11ab', fontWeight: '700' }}>{filteredProducts.length}</span>
            </div>
            <Link to="/cart" style={{ background: 'linear-gradient(135deg, #cb11ab 0%, #a00786 100%)', color: 'white', padding: '11px 22px', borderRadius: '10px', display: 'flex', gap: '8px', alignItems: 'center', textDecoration: 'none', fontWeight: '600', fontSize: '14px', transition: 'all 0.3s', cursor: 'pointer', boxShadow: '0 4px 12px rgba(203, 17, 171, 0.2)' }} onMouseOver={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 20px rgba(203, 17, 171, 0.3)'; }} onMouseOut={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 12px rgba(203, 17, 171, 0.2)'; }}>
              <span style={{ fontSize: '18px' }}>🛒</span> Корзина
            </Link>
          </div>
        </div>
      </header>

      {/* Сетка товаров */}
      {filteredProducts.length > 0 ? (
        <div className="products-grid">
          {filteredProducts.map(product => (
            <div key={product.id} className="product-card">
              <img src={product.image} alt={product.title} className="product-image" />
              <div className="product-info">
                <h3 className="product-title">{product.title}</h3>
                <p className="product-category">{product.category}</p>
                <p className="product-price">{product.price} BYN</p>
                
                <button 
                  className="add-to-cart-btn" 
                  disabled={!product.inStock} 
                  onClick={() => handleAddToCart(product)}
                >
                  {product.inStock ? 'В корзину' : 'Нет в наличии'}
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <p>😕 Товары не найдены</p>
          <p style={{ fontSize: '14px', color: '#bbb' }}>Попробуйте другой поиск</p>
        </div>
      )}
    </div>
  );
};
