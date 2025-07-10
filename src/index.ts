import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import productsRouter from './routes/products';
import { ZodError } from 'zod';
import swaggerUi from 'swagger-ui-express';
import swaggerSpec from './swagger';
import { errorHandler } from './middlewares/errorHandler';
import authRouter from './routes/auth';
import { requireAuth } from './middlewares/auth';
import suggestTagsRouter from './routes/suggestTags';
import {tagSuggestLimit} from './middlewares/rateLimiter';

const app = express();
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.use('/auth', authRouter);
app.use('/products', requireAuth, productsRouter);
app.use('/suggest-tags', requireAuth,tagSuggestLimit, suggestTagsRouter);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use(errorHandler);

const PORT = process.env.PORT || 3000;
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}
export default app; 