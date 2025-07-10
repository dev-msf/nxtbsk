import { Router } from 'express';
import { productSchema, ProductInput } from '../models/product';
import * as productService from '../services/productService';

const router = Router();

/**
 * @swagger
 * /products:
 *   post:
 *     summary: Create a new product
 *     tags: [Products]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Product'
 *     responses:
 *       201:
 *         description: Product created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       400:
 *         description: Validation error
 */
router.post('/', async (req, res, next) => {
  try {
    const parsed: ProductInput = productSchema.parse(req.body);
    const product = await productService.createProduct(parsed);
    res.status(201).json(product);
  } catch (err) {
    next(err);
  }
});

/**
 * @swagger
 * /products/{id}:
 *   get:
 *     summary: Get a product by ID
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Product ID
 *     responses:
 *       200:
 *         description: Product found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       404:
 *         description: Product not found
 */
router.get('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const product = await productService.getProductById(id);
    if (!product) return res.status(404).json({ error: 'Product not found' });
    res.json(product);
  } catch (err) {
    next(err);
  }
});

/**
 * @swagger
 * /products/{id}:
 *   put:
 *     summary: Update a product by ID
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Product ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Product'
 *     responses:
 *       200:
 *         description: Product updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       400:
 *         description: Validation error
 *       404:
 *         description: Product not found
 */
router.put('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const parsed: ProductInput = productSchema.parse(req.body);
    const product = await productService.updateProduct(id, parsed);
    res.json(product);
  } catch (err) {
    next(err);
  }
});

/**
 * @swagger
 * /products/{id}:
 *   delete:
 *     summary: Delete a product by ID
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Product ID
 *     responses:
 *       204:
 *         description: Product deleted
 *       404:
 *         description: Product not found
 */
router.delete('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    await productService.softDeleteProduct(id);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
});

/**
 * @swagger
 * /products:
 *   get:
 *     summary: List all products
 *     tags: [Products]
 *     parameters:
 *       - in: query
 *         name: cursor
 *         schema:
 *           type: string
 *         required: false
 *         description: Cursor for pagination (product id)
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         required: false
 *         description: Number of products to return
 *     responses:
 *       200:
 *         description: List of products
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Product'
 */
router.get('/', async (req, res, next) => {
  try {
    const { cursor, limit = 10, search } = req.query;
    const products = await productService.listProducts(cursor as string | undefined, Number(limit), search as string | undefined);
    res.json(products);
  } catch (err) {
    next(err);
  }
});

export default router; 