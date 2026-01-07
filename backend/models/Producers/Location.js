import db from '../../database/db.js';

export class Location {
  static async findAll(filters = {}) {
    let query = 'SELECT * FROM Location WHERE 1=1';
    const params = [];

    if (filters.producer_id) {
      query += ' AND producer_id = ?';
      params.push(filters.producer_id);
    }

    if (filters.city) {
      query += ' AND city = ?';
      params.push(filters.city);
    }

    if (filters.province) {
      query += ' AND province = ?';
      params.push(filters.province);
    }

    if (filters.country) {
      query += ' AND country = ?';
      params.push(filters.country);
    }

    const sortBy = filters.sortBy || 'location_id';
    const sortOrder = filters.sortOrder || 'ASC';
    const allowedSortFields = ['location_id', 'store_name', 'city', 'province', 'country'];
    const safeSortBy = allowedSortFields.includes(sortBy) ? sortBy : 'location_id';
    const safeSortOrder = sortOrder.toUpperCase() === 'DESC' ? 'DESC' : 'ASC';
    query += ` ORDER BY ${safeSortBy} ${safeSortOrder}`;

    return await db.prepare(query).all(...params);
  }

  static async findById(id) {
    return await db.prepare('SELECT * FROM Location WHERE id = ?').get(id);
  }

  static async findByProducerId(producerId) {
    return await db.prepare('SELECT * FROM Location WHERE producer_id = ?').all(producerId);
  }

  static async create(data) {
    const query = `
      INSERT INTO location (
        producer_id,
        address,
        full_address,
        province,
        postal_code,
        country,
        longitude,
        latitude,
        ccc
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      RETURNING producer_id
    `;

    const result = await db.prepare(query).run(
      data.producer_id, data.address, data.full_address, 
      data.province, data.postal_code, data.country, 
      data.longitude, data.latitude, data.ccc
    );
    return result.lastInsertId?.toString() || '';
  }
}
