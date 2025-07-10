import { Router } from 'express';
import jwt from 'jsonwebtoken';

const router = Router();

const DEMO_USER = {
  username: 'admin',
  password: 'password123',
};

const JWT_SECRET = process.env.JWT_SECRET || 'df424lmso32hrn@#$#@$$FWSDFfdfnsfG@321.32';

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Authenticate user and get JWT token
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginRequest'
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/LoginResponse'
 *       401:
 *         description: Invalid credentials
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Invalid credentials"
 */
router.post('/login', (req, res) => {
  const { username, password } = req.body;
  if (username !== DEMO_USER.username || password !== DEMO_USER.password) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }
  const token = jwt.sign({ username }, JWT_SECRET, { expiresIn: '1h' });
  res.json({ token });
});

export default router; 