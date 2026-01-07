import Fastify from 'fastify';
import cors from '@fastify/cors';
import producerRoutes from './routes/producers.js';
import productRoutes from './routes/products.js';

const fastify = Fastify({
  logger: true
});

// Register CORS
await fastify.register(cors, {
  origin: true
});

// Register routes
await fastify.register(producerRoutes);
await fastify.register(productRoutes);

// Health check endpoint
fastify.get('/health', async (request, reply) => {
  return { status: 'ok' };
});

// 404 handler - return JSON instead of HTML
fastify.setNotFoundHandler(async (request, reply) => {
  reply.code(404);
  reply.header('Content-Type', 'application/json');
  return { error: 'Route not found', path: request.url };
});

// Start server
const start = async () => {
  try {
    const port = process.env.PORT || 3001;
    await fastify.listen({ port, host: '0.0.0.0' });
    console.log(`Server listening on http://localhost:${port}`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();

