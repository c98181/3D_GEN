import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/common/Header';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import GenerationPage from './pages/GenerationPage';
import ViewerPage from './pages/ViewerPage';
import CollectionsPage from './pages/CollectionsPage';
import ProfilePage from './pages/ProfilePage';
import ErrorBoundary from './components/common/ErrorBoundary';

// 路由保護元件
const PrivateRoute = ({ children }) => {
  const isAuthenticated = localStorage.getItem('user_id');
  return isAuthenticated ? (
    <>
      <Header />
      {children}
    </>
  ) : (
    <Navigate to="/login" replace />
  );
};

const App = () => {
  return (
    <Router>
      <ErrorBoundary>
        <Routes>
          {/* 公開路由 */}
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* 受保護路由 */}
          <Route 
            path="/generation" 
            element={
              <PrivateRoute>
                <GenerationPage />
              </PrivateRoute>
            } 
          />
          <Route 
            path="/viewer" 
            element={
              <PrivateRoute>
                <ViewerPage />
              </PrivateRoute>
            } 
          />
          <Route 
            path="/collections" 
            element={
              <PrivateRoute>
                <CollectionsPage />
              </PrivateRoute>
            } 
          />
          <Route 
            path="/profile" 
            element={
              <PrivateRoute>
                <ProfilePage />
              </PrivateRoute>
            } 
          />

          {/* 404 重定向 */}
          <Route 
            path="*" 
            element={<Navigate to="/" replace />} 
          />
        </Routes>
      </ErrorBoundary>
    </Router>
  );
};

export default App;