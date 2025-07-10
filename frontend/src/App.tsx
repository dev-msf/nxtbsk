import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import LoginPage from './pages/LoginPage';
import ProductListPage from './pages/ProductListPage';
import ProductFormPage from './pages/ProductFormPage';
import { useState, useEffect } from 'react';

const queryClient = new QueryClient();

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsAuthenticated(!!token);
  }, []);

  if (isAuthenticated === null) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />;
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/products" element={
              <ProtectedRoute>
                <ProductListPage />
              </ProtectedRoute>
            } />
            <Route path="/products/:id/edit" element={
              <ProtectedRoute>
                <ProductFormPage />
              </ProtectedRoute>
            } />
            <Route path="/products/new" element={
              <ProtectedRoute>
                <ProductFormPage />
              </ProtectedRoute>
            } />
            <Route path="/" element={<Navigate to="/products" replace />} />
          </Routes>
        </div>
      </Router>
    </QueryClientProvider>
  );
}

export default App;
