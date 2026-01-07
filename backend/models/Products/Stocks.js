import db from '../../database/db.js';

export class Stocks {
  static async create(data) {
    const query = `
      INSERT INTO stocks (
        product_id,
        quantity,
        weight, weight_unit, out_of_stock_status, equivalency
      ) VALUES (?, ?, ?, ?, ?, ?)
      RETURNING product_id
    `;

    const result = await db.prepare(query).run(
      data.product_id, data.quantity, data.weight,
      data.weight_unit, data.out_of_stock_status, data.equivalency
    );
    return result.lastInsertId?.toString() || '';
  }

  static async findByProductId(product_id) {
    const query = 'SELECT * FROM Stocks WHERE product_id = ?';
    return await db.prepare(query).get(product_id);
  }
}
