import db from '../../database/db.js';
import { Location } from './Location.js';
import { Contact } from './Contact.js';
import { License } from './License.js';
import { Media } from './Media.js';

export class Producer {
  static async findAll(filters = {}) {
    let query = 'SELECT * FROM producers WHERE 1=1';
    const params = [];

    if (filters.p_id) {
      query += ' AND p_id LIKE ?';
      params.push(`%${filters.p_id}%`);
    }

    if (filters.producer) {
      query += ' AND producer = ?';
      params.push(filters.producer);
    }

    if (filters.city) {
      query += ' AND city = ?';
      params.push(filters.city);
    }

    if (filters.store_name) {
      query += ' AND store_name = ?';
      params.push(filters.store_name);
    }

    const sortBy = filters.sortBy || 'producer_id';
    const sortOrder = filters.sortOrder || 'ASC';
    const allowedSortFields = ['producer_id', 'p_id', 'producer', 'city', 'store_name', 'type'];
    const safeSortBy = allowedSortFields.includes(sortBy) ? sortBy : 'producer_id';
    const safeSortOrder = sortOrder.toUpperCase() === 'DESC' ? 'DESC' : 'ASC';
    query += ` ORDER BY ${safeSortBy} ${safeSortOrder}`;

    return await db.prepare(query).all(...params);
  }

  static async findByProducerId(id) {
    const query = 'SELECT * FROM producers WHERE producer_id = ' + id;
    return await db.prepare(query).all();
  }

  static async findByIdWithDetails(id) {
    const query = 'SELECT * FROM producers WHERE producer_id = ?';
    const producer = await db.prepare(query).get(id);

    if (!producer) {
      return null;
    }

    const [locations, contacts, licenses, media] = await Promise.all([
      Location.findByProducerId(id),
      Contact.findByProducerId(id),
      License.findByProducerId(id),
      Media.findByProducerId(id)
    ]);

    return {
      ...producer,
      locations: locations || [],
      contacts: contacts || [],
      licenses: licenses || [],
      media: media || []
    };
  }

  static async create(data) {
    const query = `
      INSERT INTO producers (
        p_id,
        producer,
        city,
        store_name,
        description,
        type,
        ccc,
        active,
        comment
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      RETURNING producer_id
    `;

    const result = await db.prepare(query).run(
      data.p_id, data.producer, data.city, data.store_name, 
      data.description, data.type, data.ccc, data.active, data.comment
    );
    return result.lastInsertId?.toString() || '';
  }

  static async getDistinctCities() {
    const query = `
      SELECT DISTINCT city
      FROM producers
      WHERE city IS NOT NULL AND city != ''
    `;
    return await db.prepare(query).all();
  }

  static async getDistinctStores() {
    const query = `
      SELECT DISTINCT store_name
      FROM producers
      WHERE store_name IS NOT NULL AND store_name != ''
    `;
    return await db.prepare(query).all();
  }
}
