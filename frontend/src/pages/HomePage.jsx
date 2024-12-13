import React from 'react';
import { Link } from 'react-router-dom';

const HomePage = () => {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <header className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 py-6 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">TRELLIS 3D生成平台</h1>
          <nav>
            <Link 
              to="/login" 
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
            >
              登入/註冊
            </Link>
          </nav>
        </div>
      </header>
      
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div>
            <h2 className="text-4xl font-bold mb-4">
              從文字和圖像生成客製化3D模型
            </h2>
            <p className="text-xl text-gray-600 mb-6">
              使用AI技術，將您的創意轉化為逼真的3D模型
            </p>
            <div className="flex space-x-4">
              <Link 
                to="/generation" 
                className="bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600 transition"
              >
                開始生成
              </Link>
              <Link 
                to="/viewer" 
                className="bg-gray-200 text-gray-800 px-6 py-3 rounded-lg hover:bg-gray-300 transition"
              >
                模型瀏覽
              </Link>
            </div>
          </div>
          
          <div className="flex justify-center">
            <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-2xl font-semibold mb-4 text-center">
                功能概覽
              </h3>
              <ul className="space-y-3">
                <li className="flex items-center">
                  <svg className="w-6 h-6 mr-3 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M11.3 1.3a1 1 0 011.4 0l4 4a1 1 0 010 1.4l-9 9a1 1 0 01-.7.3H4a1 1 0 01-1-1v-3a1 1 0 01.3-.7l9-9z" clipRule="evenodd" />
                  </svg>
                  文字生成3D模型
                </li>
                <li className="flex items-center">
                  <svg className="w-6 h-6 mr-3 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M5.5 13a3.5 3.5 0 01-.369-6.98 4 4 0 117.753-1.977A4.5 4.5 0 1113.5 13H5.5z" />
                  </svg>
                  圖像上傳客製化
                </li>
                <li className="flex items-center">
                  <svg className="w-6 h-6 mr-3 text-purple-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm3 4a1 1 0 011-1h.01a1 1 0 110 2H8a1 1 0 01-1-1zm3 0a1 1 0 011-1h3a1 1 0 010 2h-3a1 1 0 01-1-1z" clipRule="evenodd" />
                  </svg>
                  個人模型收藏
                </li>
              </ul>
            </div>
          </div>
        </div>
      </main>
      
      <footer className="bg-white shadow-md py-6">
        <div className="max-w-7xl mx-auto px-4 text-center text-gray-600">
          © 2024 TRELLIS 3D Generation Platform. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default HomePage;