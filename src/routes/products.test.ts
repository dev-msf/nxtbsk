import request from 'supertest';
import app from '../index';
import prisma from '../prisma';

describe('Product API', () => {
  let productId: string;
  const testProduct = {
    name: 'Test Product',
    description: 'A product for testing',
    tags: ['test', 'jest'],
    price: 9.99,
    category: 'Electronics',
    brand: 'TestBrand',
  };

  afterAll(async () => {
    await prisma.auditLog.deleteMany({});
    await prisma.product.deleteMany({});
    await prisma.$disconnect();
  });

  it('should create a product with category and brand', async () => {
    const res = await request(app)
      .post('/products')
      .send(testProduct)
      .expect(201);
    expect(res.body).toHaveProperty('id');
    expect(res.body.name).toBe(testProduct.name);
    expect(res.body.category).toBe(testProduct.category);
    expect(res.body.brand).toBe(testProduct.brand);
    productId = res.body.id;
  });

  it('should get a product by id', async () => {
    const res = await request(app)
      .get(`/products/${productId}`)
      .expect(200);
    expect(res.body.id).toBe(productId);
    expect(res.body.category).toBe(testProduct.category);
    expect(res.body.brand).toBe(testProduct.brand);
  });

  it('should update a product', async () => {
    const res = await request(app)
      .put(`/products/${productId}`)
      .send({ ...testProduct, name: 'Updated Product' })
      .expect(200);
    expect(res.body.name).toBe('Updated Product');
  });

  it('should list products with pagination', async () => {
    // Create a second product
    const res1 = await request(app)
      .post('/products')
      .send({ ...testProduct, name: 'Second Product' })
      .expect(201);
    const res2 = await request(app)
      .get('/products?limit=1')
      .expect(200);
    expect(Array.isArray(res2.body)).toBe(true);
    expect(res2.body.length).toBe(1);
    // Test cursor pagination
    const cursor = res2.body[0].id;
    const res3 = await request(app)
      .get(`/products?cursor=${cursor}&limit=1`)
      .expect(200);
    expect(Array.isArray(res3.body)).toBe(true);
  });

  it('should soft delete a product and not return it in list', async () => {
    await request(app)
      .delete(`/products/${productId}`)
      .expect(204);
    await request(app)
      .get(`/products/${productId}`)
      .expect(404);
    const res = await request(app)
      .get('/products')
      .expect(200);
    expect(res.body.find((p: any) => p.id === productId)).toBeUndefined();
  });

  it('should create audit logs for create, update, and delete', async () => {
    const logs = await prisma.auditLog.findMany({ orderBy: { timestamp: 'asc' } });
    expect(logs.length).toBeGreaterThanOrEqual(3);
    expect(logs.some((l: any) => l.action === 'CREATE')).toBe(true);
    expect(logs.some((l: any) => l.action === 'UPDATE')).toBe(true);
    expect(logs.some((l: any) => l.action === 'SOFT_DELETE')).toBe(true);
  });
}); 