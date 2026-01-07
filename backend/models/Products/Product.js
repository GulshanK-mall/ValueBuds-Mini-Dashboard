import db from '../../database/db.js';
import { Attribute } from './Attributes.js';
import { Category } from './Categories.js';
import { Description } from './Descriptions.js';
import { Image } from './Images.js';
import { Option } from './Options.js';
import { Pricing } from './Pricing.js';
import { Review } from './Reviews.js';
import { Stocks } from './Stocks.js';

export class Product {
  static async findAll(filters = {}) {
    let query = 'SELECT * FROM products WHERE 1=1';
    const params = [];

    if (filters.product_id) {
      query += ' AND product_id = ?';
      params.push(filters.product_id);
    }

    if (filters.p_id) {
      query += ' AND p_id = ?';
      params.push(filters.p_id);
    }

    if (filters.brand_name) {
      query += ' AND brand_name = ?';
      params.push(filters.brand_name);
    }

    if (filters.manufacturer) {
      query += ' AND manufacturer = ?';
      params.push(filters.manufacturer);
    }

    if (filters.quantity) {
      query += ' AND quantity = ?';
      params.push(filters.quantity);
    }

    if (filters.weight) {
      query += ' AND weight = ?';
      params.push(filters.weight);
    }

    const allowedSortFields = [
      'product_id',
      'p_id',
      'brand_name',
      'manufacturer',
      'quantity',
      'weight',
      'created_at',
    ];

    const sortBy = allowedSortFields.includes(filters.sortBy)
      ? filters.sortBy
      : 'product_id';

    const sortOrder =
      filters.sortOrder?.toUpperCase() === 'DESC' ? 'DESC' : 'ASC';

    query += ` ORDER BY ${sortBy} ${sortOrder}`;

    return await db.prepare(query).all(...params);
  }

  static async findById(product_id) {
    const query = 'SELECT * FROM products WHERE product_id = ?';
    return await db.prepare(query).get(product_id);
  }

  static async findByIdWithDetails(product_id) {
    const query = 'SELECT * FROM products WHERE product_id = ?';
    const product = await db.prepare(query).get(product_id);

    if (!product) {
      return null;
    }

    const [attributes, categories, descriptions, images, options, pricing, reviews, stocks] = await Promise.all([
      Attribute.findByProductId(product_id),
      Category.findByProductId(product_id),
      Description.findByProductId(product_id),
      Image.findByProductId(product_id),
      Option.findByProductId(product_id),
      Pricing.findByProductId(product_id),
      Review.findByProductId(product_id),
      Stocks.findByProductId(product_id)
    ]);

    return {
      ...product,
      attributes: attributes || [],
      categories: categories || [],
      descriptions: descriptions || null,
      images: images || [],
      options: options || [],
      pricing: pricing || [],
      reviews: reviews || null,
      stocks: stocks || null
    };
  }

  static async create(data) {
    const query = `
      INSERT INTO products (
        p_id,
        sku,
        brand_name,
        manufacturer,
        page_url,
        main_image,
        quantity,
        weight,
        weight_unit,
        equivalency
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      RETURNING product_id
    `;

    const result = await db.prepare(query).run(
      data.p_id,
      data.sku,
      data.brand_name,
      data.manufacturer,
      data.page_url,
      data.main_image,
      data.quantity ?? 0,
      data.weight ?? 0,
      data.weight_unit ?? 'kg',
      data.equivalency ?? null
    );
    return result.lastInsertId?.toString() || '';
  }

  static async getDistinctBrands() {
    const query = `
      SELECT DISTINCT brand_name
      FROM products
      WHERE brand_name IS NOT NULL AND brand_name != ''
      ORDER BY brand_name
    `;
    return await db.prepare(query).all();
  }

  static async getDistinctManufacturers() {
    const query = `
      SELECT DISTINCT manufacturer
      FROM products
      WHERE manufacturer IS NOT NULL AND manufacturer != ''
      ORDER BY manufacturer
    `;
    return await db.prepare(query).all();
  }
}
