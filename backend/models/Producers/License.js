import db from '../../database/db.js';

export class License {
  static async findAll(filters = {}) {
    let query = 'SELECT * FROM License WHERE 1=1';
    const params = [];

    if (filters.producer_id) {
      query += ' AND producer_id = ?';
      params.push(filters.producer_id);
    }

    if (filters.license_type) {
      query += ' AND license_type = ?';
      params.push(filters.license_type);
    }

    const sortBy = filters.sortBy || 'license_id';
    const sortOrder = filters.sortOrder || 'ASC';
    const allowedSortFields = ['license_id', 'license_type', 'date_licensed', 'producer_id'];
    const safeSortBy = allowedSortFields.includes(sortBy) ? sortBy : 'license_id';
    const safeSortOrder = sortOrder.toUpperCase() === 'DESC' ? 'DESC' : 'ASC';
    query += ` ORDER BY ${safeSortBy} ${safeSortOrder}`;

    return await db.prepare(query).all(...params);
  }

  static async findById(id) {
    return await db.prepare('SELECT * FROM License WHERE id = ?').get(id);
  }

  static async findByProducerId(producerId) {
    return await db.prepare('SELECT * FROM License WHERE producer_id = ?').all(producerId);
  }

  static async create(data) {
    const query = `
      INSERT INTO license (
        producer_id,
        license_type,
        date_licensed
      )
      VALUES (?, ?, ?)
      RETURNING producer_id
    `;

    const result = await db.prepare(query).run(
      data.producer_id, data.license_type, data.date_licensed
    );
    return result.lastInsertId?.toString() || '';
  }
}
