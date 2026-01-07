import db from '../../database/db.js';

export class Pricing {
  static async create(data) {
    const query = `
      INSERT INTO pricing (
        product_id,
        price, old_price, currency, ccc, recorded_at
      ) VALUES (?, ?, ?, ?, ?, ?)
      RETURNING product_id
    `;

    const result = await db.prepare(query).run(
      data.product_id, data.price, data.old_price,
      data.currency, data.ccc, data.recorded_at
    );
    return result.lastInsertId?.toString() || '';
  }

  static async findByProductId(product_id) {
    const query = 'SELECT * FROM Pricing WHERE product_id = ? ORDER BY recorded_at DESC';
    return await db.prepare(query).all(product_id);
  }
}
