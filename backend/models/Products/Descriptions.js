import db from '../../database/db.js';

export class Description {
  static async create(data) {
    const query = `
      INSERT INTO descriptions (
        product_id,
        description,
        additional_information,
        meta_title,
        meta_description
      ) VALUES (?, ?, ?, ?, ?)
      RETURNING product_id
    `;

    const result = await db.prepare(query).run(
      data.product_id, data.description, data.additional_information,
      data.meta_title, data.meta_description
    );
    return result.lastInsertId?.toString() || '';
  }

  static async findByProductId(product_id) {
    const query = 'SELECT * FROM Descriptions WHERE product_id = ?';
    return await db.prepare(query).get(product_id);
  }
}
