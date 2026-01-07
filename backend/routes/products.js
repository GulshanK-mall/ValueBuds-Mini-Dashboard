async function productRoutes(fastify, options) {
  const { Product } = await import('../models/Products/Product.js');

  fastify.get('/products', async (request, reply) => {
    try {
      reply.header('Content-Type', 'application/json');

      const { product_id } = request.query || {};
      if (typeof product_id === 'string' && product_id.trim() !== '') {
        const product = await Product.findById(parseInt(product_id));
        
        if (!product) {
          reply.code(404);
          return { error: 'Product not found' };
        }

        return { product: [product] };
      }

      const filters = {
        product_id: request.query.product_id,
        p_id: request.query.p_id,
        sku: request.query.sku,
        brand_name: request.query.brand_name,
        manufacturer: request.query.manufacturer,
        main_image: request.query.main_image,
        quantity: request.query.quantity,
        weight: request.query.weight,
        weight_unit: request.query.weight_unit,
        equivalency: request.query.equivalency,
        created_at: request.query.created_at,
      };

      const products = await Product.findAll(filters);
      return { data: products, count: products.length };
    } catch (error) {
      reply.code(500);
      reply.header('Content-Type', 'application/json');
      return { error: error.message };
    }
  });

  fastify.get('/products/:id', async (request, reply) => {
    try {
      reply.header('Content-Type', 'application/json');
      const id = parseInt(request.params.id);
      const product = await Product.findByIdWithDetails(id);
      
      if (!product) {
        reply.code(404);
        return { error: 'Product not found' };
      }

      return { data: product };
    } catch (error) {
      reply.code(500);
      reply.header('Content-Type', 'application/json');
      return { error: error.message };
    }
  });

  fastify.get('/products/filters/brands', async (request, reply) => {
    try {
      reply.header('Content-Type', 'application/json');
      const brands = await Product.getDistinctBrands();
      return { data: brands.map(b => b.brand_name) };
    } catch (error) {
      reply.code(500);
      reply.header('Content-Type', 'application/json');
      return { error: error.message };
    }
  });

  fastify.get('/products/filters/manufacturers', async (request, reply) => {
    try {
      reply.header('Content-Type', 'application/json');
      const manufacturers = await Product.getDistinctManufacturers();
      return { data: manufacturers.map(m => m.manufacturer) };
    } catch (error) {
      reply.code(500);
      reply.header('Content-Type', 'application/json');
      return { error: error.message };
    }
  });
}

export default productRoutes;
