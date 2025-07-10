import { Router } from 'express';
import { z } from 'zod';
import { suggestTags } from '../services/tagSuggestService';

const router = Router();

const schema = z.object({
  name: z.string().min(1),
  description: z.string().min(1),
});

/**
 * @swagger
 * /suggest-tags:
 *   post:
 *     summary: Get AI-suggested tags for a product
 *     tags: [AI Features]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/TagSuggestionRequest'
 *     responses:
 *       200:
 *         description: Tags suggested successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/TagSuggestionResponse'
 *       400:
 *         description: Invalid request body
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Failed to suggest tags"
 */
router.post('/', async (req, res, next) => {
  try {
    const { name, description } = schema.parse(req.body);
    const tags = await suggestTags({ name, description });
    res.json({ tags });
  } catch (err) {
    console.error('Tag suggestion error:', err);
    res.status(500).json({ error: 'Failed to suggest tags' });
  }
});

export default router; 