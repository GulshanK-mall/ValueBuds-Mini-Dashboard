import db from '../../database/db.js';

export class Media {
  static async findAll(filters = {}) {
    let query = 'SELECT * FROM Media WHERE 1=1';
    const params = [];

    if (filters.producer_id) {
      query += ' AND producer_id = ?';
      params.push(filters.producer_id);
    }

    if (filters.page_url) {
      query += ' AND page_url LIKE ?';
      params.push(`%${filters.page_url}%`);
    }

    if (filters.social) {
      query += ' AND social LIKE ?';
      params.push(`%${filters.social}%`);
    }

    const sortBy = filters.sortBy || 'media_id';
    const sortOrder = filters.sortOrder || 'ASC';
    const allowedSortFields = ['media_id', 'producer_id', 'page_url', 'link', 'social', 'created_at'];
    const safeSortBy = allowedSortFields.includes(sortBy) ? sortBy : 'media_id';
    const safeSortOrder = sortOrder.toUpperCase() === 'DESC' ? 'DESC' : 'ASC';
    query += ` ORDER BY ${safeSortBy} ${safeSortOrder}`;

    return await db.prepare(query).all(...params);
  }

  static async findById(id) {
    return await db.prepare('SELECT * FROM Media WHERE id = ?').get(id);
  }

  static async findByProducerId(producerId) {
    return await db.prepare('SELECT * FROM Media WHERE producer_id = ?').all(producerId);
  }

  static async create(data) {
    const query = `
      INSERT INTO media (
        producer_id,
        page_url,
        link,
        social
      ) VALUES (?, ?, ?, ?)
      RETURNING producer_id
    `;

    const result = await db.prepare(query).run(
      data.producer_id, data.page_url, data.link, data.social
    );
    return result.lastInsertId?.toString() || '';
  }
}
