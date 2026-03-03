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
        credentials: 'include' // Передаем куки сессии
      });
      
      if (res.ok) {
        toast.success(`${product.title} добавлен в корзину!`, {
          style: { borderRadius: '12px', background: '#333', color: '#fff', fontSize: '15px' }
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
    localStorage.removeItem('userName'); // Удаляем имя при выходе
    navigate('/auth');
  };

  // Достаем имя пользователя из памяти
  const userName = localStorage.getItem('userName') || 'Пользователь';

  return (
    <div className="home-container">
      <Toaster position="bottom-right" reverseOrder={false} /> 

      <header className="home-header" style={{ display: 'flex', flexDirection: 'column', gap: '20px', background: 'white', padding: '20px 30px', borderRadius: '20px', boxShadow: '0 4px 15px rgba(0,0,0,0.03)', marginBottom: '30px' }}>
        
        {/* Верхний ряд: Логотип и профиль */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', borderBottom: '1px solid #eee', paddingBottom: '15px' }}>
          <h1 style={{ color: '#cb11ab', margin: 0, fontSize: '28px', fontWeight: '900' }}>L_Shop</h1>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#f0f0f4', display: 'flex', justifyContent: 'center', alignItems: 'center', fontWeight: 'bold', color: '#cb11ab' }}>
                {userName.charAt(0).toUpperCase()}
              </div>
              <span style={{ fontWeight: 600, fontSize: '16px' }}>{userName}</span>
            </div>
            
            <button 
              onClick={handleLogout} 
              style={{ background: 'transparent', color: '#888', border: '1px solid #ddd', padding: '8px 15px', borderRadius: '10px', cursor: 'pointer', transition: 'all 0.2s' }}
              onMouseOver={(e) => { e.currentTarget.style.color = '#ff4d4f'; e.currentTarget.style.borderColor = '#ff4d4f'; }}
              onMouseOut={(e) => { e.currentTarget.style.color = '#888'; e.currentTarget.style.borderColor = '#ddd'; }}
            >
              Выйти
            </button>
          </div>
        </div>

        {/* Нижний ряд: Поиск, Сортировка, Корзина */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', flexWrap: 'wrap', gap: '15px' }}>
          <div style={{ display: 'flex', gap: '15px', flexGrow: 1, maxWidth: '600px' }}>
            <input 
              type="text" 
              placeholder="🔍 Я ищу..." 
              value={search} 
              onChange={(e) => setSearch(e.target.value)} 
              style={{ flexGrow: 1, padding: '12px 20px', borderRadius: '12px', border: '1px solid #ddd', outline: 'none', background: '#f9f9fa' }} 
            />
            <select 
              value={sort} 
              onChange={(e) => setSort(e.target.value)} 
              style={{ padding: '12px 20px', borderRadius: '12px', border: '1px solid #ddd', outline: 'none', background: '#f9f9fa', cursor: 'pointer' }}
            >
              <option value="asc">Сначала дешевле</option>
              <option value="desc">Сначала дороже</option>
            </select>
          </div>

          <Link to="/cart" className="auth-btn cart-link" style={{ marginTop: 0, padding: '12px 25px', display: 'flex', gap: '10px', alignItems: 'center', textDecoration: 'none' }}>
            <span style={{ fontSize: '18px' }}>🛒</span> Корзина
          </Link>
        </div>
      </header>


      <div className="products-grid">
        {filteredProducts.map(product => (
          <div key={product.id} className="product-card">
            <img src={product.image} alt={product.title} className="product-image" />
            <div className="product-info">
              <h3 data-title className="product-title">{product.title}</h3>
              <p className="product-category">{product.category}</p>
              <p data-price className="product-price">{product.price} BYN</p>
              
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
    </div>
  );
};
