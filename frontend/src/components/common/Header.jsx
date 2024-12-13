import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authService } from '../../services/authService';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      const response = await authService.logout();
      if (response.data.success) {
        // 清除本地存儲的token等
        localStorage.removeItem('token');
        navigate('/login');
      } else {
        alert(response.message || '登出失敗');
      }
    } catch (error) {
      console.error('Logout error:', error);
      alert('登出失敗：' + error.message);
    }
  };

  const menuItems = [
    { name: '首頁', path: '/' },
    { name: '模型生成', path: '/generation' },
    { name: '模型瀏覽', path: '/viewer' },
    { name: '我的收藏', path: '/collections' },
    { name: '個人資料', path: '/profile' }
  ];

  return (
    <header className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-6">
          {/* Logo */}
          <Link to="/" className="text-2xl font-bold text-gray-900">
            TRELLIS
          </Link>

          {/* 桌面端導航 */}
          <nav className="hidden md:flex space-x-4">
            {menuItems.map((item) => (
              <Link 
                key={item.path} 
                to={item.path} 
                className="text-gray-700 hover:text-blue-600 transition"
              >
                {item.name}
              </Link>
            ))}
            <button 
              onClick={handleLogout}
              className="text-red-500 hover:text-red-700 transition"
            >
              登出
            </button>
          </nav>

          {/* 移動端漢堡選單 */}
          <div className="md:hidden">
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-900 focus:outline-none"
            >
              {isMenuOpen ? (
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* 移動端側邊選單 */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              {menuItems.map((item) => (
                <Link 
                  key={item.path} 
                  to={item.path} 
                  className="text-gray-700 hover:bg-gray-200 block px-3 py-2 rounded-md"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
              <button 
                onClick={handleLogout}
                className="text-red-500 hover:text-red-700 block w-full text-left px-3 py-2 rounded-md"
              >
                登出
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;