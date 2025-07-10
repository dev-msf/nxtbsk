import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useNavigate, useParams } from 'react-router-dom';
import { getProduct, createProduct, updateProduct, suggestTags } from '../api/products';
import type { Product } from '../api/products';
import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import Button from '../components/Button';

const emptyProduct = {
  name: '',
  description: '',
  tags: [] as string[],
  price: 0,
  category: '',
  brand: '',
};

export default function ProductFormPage() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [form, setForm] = useState(emptyProduct);
  const [errors, setErrors] = useState<{ [k: string]: string }>({});
  const [touched, setTouched] = useState<{ [k: string]: boolean }>({});
  const [suggesting, setSuggesting] = useState(false);

  // Fetch product for edit
  const { data, isLoading } = useQuery<Product>({
    queryKey: ['product', id],
    queryFn: () => getProduct(id!),
    enabled: isEdit,
  });

  useEffect(() => {
    if (data) {
      setForm({
        ...data,
        tags: data.tags || [],
        category: data.category || '',
        brand: data.brand || '',
      });
    }
  }, [data]);

  // Validate form
  function validate(f = form) {
    const errs: { [k: string]: string } = {};
    if (!f.name.trim()) errs.name = 'Name is required';
    if (!f.description.trim()) errs.description = 'Description is required';
    if (f.name.length > 255) errs.name = 'Max 255 chars';
    if (f.description.length > 2000) errs.description = 'Max 2000 chars';
    if (f.price <= 0) errs.price = 'Price must be positive';
    if (f.category && f.category.length > 100) errs.category = 'Max 100 chars';
    if (f.brand && f.brand.length > 100) errs.brand = 'Max 100 chars';
    return errs;
  }

  useEffect(() => {
    setErrors(validate());
  }, [form]);

  const createMutation = useMutation({
    mutationFn: createProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      toast.success('Product created!');
      navigate('/products');
    },
    onError: () => {
      toast.error('Error creating product');
    },
  });
  const updateMutation = useMutation({
    mutationFn: (data: Product) => updateProduct(id!, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      toast.success('Product updated!');
      navigate('/products');
    },
    onError: () => {
      toast.error('Error updating product');
    },
  });

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: name === 'price' ? Number(value) : value }));
    setTouched(t => ({ ...t, [name]: true }));
  }

  function handleTagsChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm(f => ({ ...f, tags: e.target.value.split(',').map(t => t.trim()).filter(Boolean) }));
    setTouched(t => ({ ...t, tags: true }));
  }

  async function handleSuggestTags() {
    setSuggesting(true);
    try {
      const tags = await suggestTags({ name: form.name, description: form.description });
      setForm(f => ({ ...f, tags }));
      toast.success('Tags suggested!');
    } catch {
      toast.error('Failed to suggest tags');
    } finally {
      setSuggesting(false);
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const errs = validate();
    setErrors(errs);
    setTouched({ name: true, description: true, price: true, category: true, brand: true, tags: true });
    if (Object.keys(errs).length > 0) return;
    if (isEdit) {
      updateMutation.mutate(form as Product);
    } else {
      createMutation.mutate(form);
    }
  }

  return (
    <div className="px-2">
      <h1 className="text-2xl font-bold mb-4">{isEdit ? 'Edit' : 'Create'} Product</h1>
      {(isLoading && isEdit) ? <div className="flex justify-center py-8"><svg className="animate-spin h-8 w-8 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" /></svg></div> : (
        <form onSubmit={handleSubmit} className="space-y-4 max-w-xl mx-auto bg-white p-4 rounded shadow-sm">
          <div>
            <label className="block font-medium">Name *</label>
            <input
              name="name"
              className={`border rounded px-3 py-2 w-full focus:ring-2 focus:ring-blue-400 ${touched.name && errors.name ? 'border-red-500' : ''}`}
              value={form.name}
              onChange={handleChange}
              maxLength={255}
              required
            />
            {touched.name && errors.name && <div className="text-red-500 text-sm">{errors.name}</div>}
          </div>
          <div>
            <label className="block font-medium">Description *</label>
            <textarea
              name="description"
              className={`border rounded px-3 py-2 w-full focus:ring-2 focus:ring-blue-400 ${touched.description && errors.description ? 'border-red-500' : ''}`}
              value={form.description}
              onChange={handleChange}
              maxLength={2000}
              required
            />
            {touched.description && errors.description && <div className="text-red-500 text-sm">{errors.description}</div>}
          </div>
          <div className="flex gap-2 flex-col sm:flex-row items-stretch sm:items-end">
            <div className="flex-1">
              <label className="block font-medium">Tags (comma separated)</label>
              <input
                name="tags"
                className="border rounded px-3 py-2 w-full focus:ring-2 focus:ring-blue-400"
                value={form.tags.join(', ')}
                onChange={handleTagsChange}
              />
            </div>
            <Button
              type="button"
              variant="secondary"
              onClick={handleSuggestTags}
              loading={suggesting}
              className="w-full sm:w-auto mt-2 sm:mt-0"
            >
              Auto-Suggest Tags
            </Button>
          </div>
          <div>
            <label className="block font-medium">Price *</label>
            <input
              name="price"
              type="number"
              className={`border rounded px-3 py-2 w-full focus:ring-2 focus:ring-blue-400 ${touched.price && errors.price ? 'border-red-500' : ''}`}
              value={form.price}
              onChange={handleChange}
              min={0.01}
              step={0.01}
              required
            />
            {touched.price && errors.price && <div className="text-red-500 text-sm">{errors.price}</div>}
          </div>
          <div>
            <label className="block font-medium">Category</label>
            <input
              name="category"
              className={`border rounded px-3 py-2 w-full focus:ring-2 focus:ring-blue-400 ${touched.category && errors.category ? 'border-red-500' : ''}`}
              value={form.category}
              onChange={handleChange}
              maxLength={100}
            />
            {touched.category && errors.category && <div className="text-red-500 text-sm">{errors.category}</div>}
          </div>
          <div>
            <label className="block font-medium">Brand</label>
            <input
              name="brand"
              className={`border rounded px-3 py-2 w-full focus:ring-2 focus:ring-blue-400 ${touched.brand && errors.brand ? 'border-red-500' : ''}`}
              value={form.brand}
              onChange={handleChange}
              maxLength={100}
            />
            {touched.brand && errors.brand && <div className="text-red-500 text-sm">{errors.brand}</div>}
          </div>
          <div className="flex gap-2 flex-col sm:flex-row">
            <Button
              type="submit"
              variant="primary"
              loading={createMutation.status === 'pending' || updateMutation.status === 'pending'}
              fullWidth
            >
              {isEdit ? (updateMutation.status === 'pending' ? 'Saving...' : 'Save') : (createMutation.status === 'pending' ? 'Creating...' : 'Create')}
            </Button>
            <Button
              type="button"
              variant="secondary"
              onClick={() => navigate('/products')}
              disabled={createMutation.status === 'pending' || updateMutation.status === 'pending'}
              fullWidth
            >
              Cancel
            </Button>
          </div>
          {(createMutation.isError || updateMutation.isError) && (
            <div className="text-red-500 mt-2">Error saving product</div>
          )}
        </form>
      )}
    </div>
  );
} 