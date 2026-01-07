import db from '../../database/db.js';

export class Category {
  static async create(data) {
    const query = `
      INSERT INTO categories (
        product_id,
        tree_number, 
        parent, 
        level_1, 
        level_2,
        level_3
      ) VALUES (?, ?, ?, ?, ?, ?)
      RETURNING product_id
    `;

    const result = await db.prepare(query).run(
      data.product_id, data.tree_number, data.parent, 
      data.level_1, data.level_2, data.level_3
    );
    return result.lastInsertId?.toString() || '';
  }

  static async findByProductId(product_id) {
    const query = 'SELECT * FROM categories WHERE product_id = ?';
    return await db.prepare(query).all(product_id);
  }
}
