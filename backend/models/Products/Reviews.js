import db from '../../database/db.js';

export class Review {
  static async create(data) {
    const query = `
      INSERT INTO reviews (
        product_id,
        reviews_count,
        rating,
        review_link
      ) VALUES (?, ?, ?, ?)
      RETURNING product_id
    `;

    const result = await db.prepare(query).run(
      data.product_id, data.reviews_count, data.rating, data.review_link
    );
    return result.lastInsertId?.toString() || '';
  }

  static async findByProductId(product_id) {
    const query = 'SELECT * FROM Reviews WHERE product_id = ?';
    return await db.prepare(query).get(product_id);
  }
}
