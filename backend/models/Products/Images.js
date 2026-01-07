import db from '../../database/db.js';

export class Image {
  static async create(data) {
    const query = `
      INSERT INTO images (
        product_id,
        image_url,
        image_type,
        sort_order
      ) VALUES (?, ?, ?, ?)
      RETURNING product_id
    `;

    const result = await db.prepare(query).run(
      data.product_id, data.image_url, data.image_type, data.sort_order
    );
    return result.lastInsertId?.toString() || '';
  }

  static async findByProductId(product_id) {
    const query = 'SELECT * FROM Images WHERE product_id = ? ORDER BY sort_order';
    return await db.prepare(query).all(product_id);
  }
}
