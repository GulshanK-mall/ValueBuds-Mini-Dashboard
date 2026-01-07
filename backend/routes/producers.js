async function producerRoutes(fastify, options) {
  const { Producer } = await import('../models/Producers/Producer.js');

  fastify.get('/producers', async (request, reply) => {
    try {
      reply.header('Content-Type', 'application/json');

      const { producer_id } = request.query || {};
      if (typeof producer_id === 'string' && producer_id.trim() !== '') {
        const producer = await Producer.findByProducerId(producer_id);
        
        if (!producer) {
          reply.code(404);
          return { error: 'Producer not found' };
        }

        return { producer };
      }

      const filters = {
        producer_id: request.query.producer_id,
        p_id: request.query.p_id,
        producer: request.query.producer,
        city: request.query.city,
        store_name: request.query.store_name,
        ccc: request.query.ccc,
        type: request.query.type,
      };

      const producers = await Producer.findAll(filters);
      return { data: producers, count: producers.length };
    } catch (error) {
      reply.code(500);
      reply.header('Content-Type', 'application/json');
      return { error: error.message };
    }
  });

  fastify.get('/producers/:id', async (request, reply) => {
    try {
      reply.header('Content-Type', 'application/json');
      const id = parseInt(request.params.id);
      const producer = await Producer.findByIdWithDetails(id);
      
      if (!producer) {
        reply.code(404);
        return { error: 'Producer not found' };
      }

      return { data: producer };
    } catch (error) {
      reply.code(500);
      reply.header('Content-Type', 'application/json');
      return { error: error.message };
    }
  });

  fastify.get('/producers/filters/cities', async (request, reply) => {
    try {
      reply.header('Content-Type', 'application/json');
      const cities = await Producer.getDistinctCities();
      return { data: cities.map(c => c.city) };
    } catch (error) {
      reply.code(500);
      reply.header('Content-Type', 'application/json');
      return { error: error.message };
    }
  });

  fastify.get('/producers/filters/stores', async (request, reply) => {
    try {
      reply.header('Content-Type', 'application/json');
      const stores = await Producer.getDistinctStores();
      return { data: stores.map(c => c.store_name) };
    } catch (error) {
      reply.code(500);
      reply.header('Content-Type', 'application/json');
      return { error: error.message };
    }
  });
}

export default producerRoutes;
