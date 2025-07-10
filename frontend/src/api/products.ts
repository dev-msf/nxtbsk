import axios from 'axios';

export interface Product {
  id?: string;
  name: string;
  description: string;
  tags: string[];
  price: number;
  category?: string;
  brand?: string;
  deletedAt?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

// Create axios instance with auth interceptor
const apiClient = axios.create({
  baseURL: API_URL,
});

// Add auth token to all requests
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle auth errors
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token is invalid or expired
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export async function fetchProducts({ limit = 20, search = '' }: { limit?: number; search?: string }): Promise<Product[]> {
  const params: any = { limit };
  if (search) params.search = search;
  const res = await apiClient.get<Product[]>('/products', { params });
  return res.data;
}

export async function deleteProduct(id: string): Promise<void> {
  await apiClient.delete(`/products/${id}`);
}

export async function getProduct(id: string): Promise<Product> {
  const res = await apiClient.get<Product>(`/products/${id}`);
  return res.data;
}

export async function createProduct(product: Product): Promise<Product> {
  const res = await apiClient.post<Product>('/products', product);
  return res.data;
}

export async function updateProduct(id: string, product: Product): Promise<Product> {
  const res = await apiClient.put<Product>(`/products/${id}`, product);
  return res.data;
}

export async function suggestTags({ name, description }: { name: string; description: string }): Promise<string[]> {
  const res = await apiClient.post<{ tags: string[] }>('/suggest-tags', { name, description });
  return res.data.tags;
} 