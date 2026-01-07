import db from '../../database/db.js';

export class Option {
  static async create(data) {
    const query = `
      INSERT INTO options (
        product_id,
        option_name, option_type, option_value, option_image, option_price_prefix
      ) VALUES (?, ?, ?, ?, ?, ?)
      RETURNING product_id
    `;

    const result = await db.prepare(query).run(
      data.product_id, data.option_name, data.option_type,
      data.option_value, data.option_image, data.option_price_prefix
    );
    return result.lastInsertId?.toString() || '';
  }

  static async findByProductId(product_id) {
    const query = 'SELECT * FROM Options WHERE product_id = ?';
    return await db.prepare(query).all(product_id);
  }
}
