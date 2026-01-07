import db from '../../database/db.js';

export class Attribute {
  static async create(data) {
    const query = `
      INSERT INTO attributes (
        product_id,
        attribute_name,
        attribute_value
      ) VALUES (?, ?, ?)
      RETURNING product_id
    `;

    const result = await db.prepare(query).run(data.product_id, data.attribute_name, data.attribute_value);
    return result.lastInsertId?.toString() || '';
  }

  static async findByProductId(product_id) {
    const query = 'SELECT * FROM attributes WHERE product_id = ?';
    return await db.prepare(query).all(product_id);
  }
}
