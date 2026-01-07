import db from '../../database/db.js';

export class Contact {
  static async findAll(filters = {}) {
    let query = 'SELECT * FROM Contact WHERE 1=1';
    const params = [];

    if (filters.producer_id) {
      query += ' AND producer_id = ?';
      params.push(filters.producer_id);
    }

    if (filters.contact_name) {
      query += ' AND contact_name LIKE ?';
      params.push(`%${filters.contact_name}%`);
    }

    if (filters.email) {
      query += ' AND email = ?';
      params.push(filters.email);
    }

    const sortBy = filters.sortBy || 'contact_id';
    const sortOrder = filters.sortOrder || 'ASC';
    const allowedSortFields = ['contact_id', 'contact_name', 'email', 'phone', 'phone_2', 'producer_id', 'created_at'];
    const safeSortBy = allowedSortFields.includes(sortBy) ? sortBy : 'contact_id';
    const safeSortOrder = sortOrder.toUpperCase() === 'DESC' ? 'DESC' : 'ASC';
    query += ` ORDER BY ${safeSortBy} ${safeSortOrder}`;

    return await db.prepare(query).all(...params);
  }

  static async findById(id) {
    return await db.prepare('SELECT * FROM Contact WHERE id = ?').get(id);
  }

  static async findByProducerId(producerId) {
    return await db.prepare('SELECT * FROM Contact WHERE producer_id = ?').all(producerId);
  }

  static async create(data) {
    const query = `
      INSERT INTO contact (
        producer_id,
        contact_name,
        phone,
        phone_2,
        email,
        email_private
      )
      VALUES (?, ?, ?, ?, ?, ?)
      RETURNING producer_id
    `;

    const result = await db.prepare(query).run(
      data.producer_id, data.contact_name, data.phone, 
      data.phone_2, data.email, data.email_private
    );
    return result.lastInsertId?.toString() || '';
  }
}
