import { config } from 'dotenv';

config();

const dbModule = await import('../database/db.js');
const db = dbModule.default;

import { Producer } from '../models/Producers/Producer.js';
import { Contact } from '../models/Producers/Contact.js';
import { License } from '../models/Producers/License.js';
import { Location } from '../models/Producers/Location.js';
import { Media } from '../models/Producers/Media.js';

import { Product } from '../models/Products/Product.js';
import { Attribute } from '../models/Products/Attributes.js';
import { Category } from '../models/Products/Categories.js';
import { Description } from '../models/Products/Descriptions.js';
import { Image } from '../models/Products/Images.js';
import { Option } from '../models/Products/Options.js';
import { Pricing } from '../models/Products/Pricing.js';
import { Review } from '../models/Products/Reviews.js';
import { Stocks } from '../models/Products/Stocks.js';

const cities = ['New York', 'Los Angeles', 'Chicago', 'Houston', 'Phoenix', 'Philadelphia', 'San Antonio', 'San Diego', 'Dallas', 'San Jose'];
const categories = ['Electronics', 'Food & Beverage', 'Clothing', 'Furniture', 'Toys', 'Books', 'Sports', 'Beauty', 'Automotive', 'Health'];
const statuses = ['Active', 'Inactive', 'Pending', 'Suspended'];

function randomElement(array) {
  return array[Math.floor(Math.random() * array.length)];
}

function randomNumber(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

async function seed() {
  console.log('Starting seed...');
  console.log(`Database type: ${process.env.DB_TYPE || 'sqlite'}`);

  try {
    await createProducer();  
    await createProduct();
    
    console.log('Seed completed successfully!');
  } catch (error) {
    console.error('Error during seeding:', error);
    throw error;
  } finally {
    if (process.env.DB_TYPE === 'mysql' && db.connection) {
      await db.connection.end();
    } else if ((process.env.DB_TYPE === 'postgresql' || process.env.DB_TYPE === 'postgres') && db.pool) {
      await db.pool.end();
    }
  }
}

seed().catch(console.error).finally(() => {
  process.exit(0);
});

async function createProducer(){

    const producersData = [
      {
        p_id: '0',
        producer: 'Value Buds 112 Street',
        city: 'Calgary',
        store_name: 'Test A',
        description: 'Value Buds is Canada\'s newest low-cost high-value',
        type: '1',
        ccc: '0',
        active: true,
        comment: 'test comments'
      },
      {
        p_id: '1',
        producer: '112 Street',
        city: 'Toronto',
        store_name: 'Test B',
        description: 'Value Buds is Canada\'s newest low-cost high-value',
        type: '2',
        ccc: '1',
        active: true,
        comment: 'comments testing'
      }
    ];

    // If want to generate random entries
    const allProducers = [];

    for (let i = 0; i < 2; i++) {
      allProducers.push({
        p_id: producersData[i].p_id,
        producer: producersData[i].producer,
        city: producersData[i].city,
        store_name: producersData[i].store_name,
        description: producersData[i].description,
        type: producersData[i].type,
        ccc: producersData[i].ccc,
        active: producersData[i].active,
        comment: producersData[i].comment,
        created_at: new Date(),
        updated_at: new Date()
      });
    }

    for (const producer of allProducers) {
      // create new Producer
      const created_producer_id = await Producer.create(producer);
      console.log('producer ID-------->>' + created_producer_id);
      // add new contact record of producer
      await createContact(created_producer_id);
    }
    console.log(`Created ${allProducers.length} producers`);
}

async function createContact(producer_id) {

  const Pr_ContactData =
    {
      producer_id: producer_id,
      contact_name: 'Value Buds 112 Street',
      phone: 'Value Buds is Canada\'s newest low-cost high-value',
      phone_2: '1',
      email: 'aa@gmail.com',
      email_private: 'aa1@gmail.com'
    };
  // create new contact
  await Contact.create(Pr_ContactData);
  
  // add new license record of producer
  await createLicense(producer_id);
  console.log(`Created Producer's Contacts`);
}

async function createLicense(producer_id){

  const Pr_LicenseData =
    {
      producer_id: producer_id,
      license_type: 'Value Buds 112 Street',
      date_licensed: 'Value Buds is Canada\'s newest low-cost high-value',
    };

  // create new license
  await License.create(Pr_LicenseData);
  // add new location record of producer
  await createLocation(producer_id);
  console.log(`Created Producer's License`); 
}

async function createLocation(producer_id){
  const location_data =
    {
      producer_id: producer_id,
      address: '8th Ave SW Calgary',
      full_address: '8th Ave SW',
      province: 'Alberta',
      postal_code: 'T2P 3V4',
      country: 'Canada',
      longitude: '11111111',
      latitude: '000000000',
      ccc: 'abc'
    };

  // create new location
  await Location.create(location_data);
  // add new Media record of producer
  await createMedia(producer_id);
  console.log(`Created Producer's Location`);
}

async function createMedia(producer_id){
  const media_data = 
    {
      producer_id: producer_id,
      page_url: 'Value Buds 112 Street',
      link: 'Value Buds is Canada\'s newest low-cost high-value',
      social: 'xyz'
    };
  
  // create new media  
  await Media.create(media_data);
  console.log(`Created producer's Media`);
}

// Create Products table
async function createProduct() {

  const timestamp = Date.now();
  const productsData = [
    {
      p_id: `PROD-${timestamp}-001`,
      sku: 'SKU-000',
      brand_name: 'Value Buds',
      manufacturer: 'Value Buds Inc',
      page_url: 'https://valuebuds.com/products/sample-product',
      main_image: 'https://valuebuds.com/images/sample-product.jpg',
      quantity: '10',
      weight: '1.5',
      weight_unit: 'kg',
      equivalency: '1.5'
    },
    {
      p_id: `PROD-${timestamp}-002`,
      sku: 'SKU-001',
      brand_name: 'Green Leaf Cannabis',
      manufacturer: 'Green Leaf Co',
      page_url: 'https://greenleaf.com/products/premium-indica',
      main_image: 'https://greenleaf.com/images/indica-product.jpg',
      quantity: '25',
      weight: '3.5',
      weight_unit: 'g',
      equivalency: '3.5'
    },
    {
      p_id: `PROD-${timestamp}-003`,
      sku: 'SKU-002',
      brand_name: 'Pure Essence',
      manufacturer: 'Pure Essence Ltd',
      page_url: 'https://pureessence.com/products/hybrid-special',
      main_image: 'https://pureessence.com/images/hybrid-special.jpg',
      quantity: '50',
      weight: '7.0',
      weight_unit: 'g',
      equivalency: '7.0'
    }
  ];
  
  // Generate product with slight variations
  const allProducts = [];
  
  for (let i = 0; i < 3; i++) {
    const productObj = {
      p_id: productsData[i].p_id,
      sku: productsData[i].sku,
      brand_name: productsData[i].brand_name,
      manufacturer: productsData[i].manufacturer,
      page_url: productsData[i].page_url,
      main_image: productsData[i].main_image,
      quantity: productsData[i].quantity,
      weight: productsData[i].weight,
      weight_unit: productsData[i].weight_unit,
      equivalency: productsData[i].equivalency,
      created_at: new Date()
    };
  
    allProducts.push(productObj);
  }

  for (const product of allProducts) {
    // create new product
    const created_product_id = await Product.create(product);
    console.log('product ID-------->>' + created_product_id);
    // add new contact record of producer
    await createAttributes(created_product_id);
  }
  console.log(`Created ${allProducts.length} products`);
}

async function createAttributes(product_id) {
 const atttribute_data =
    {
      product_id: product_id,
      attribute_name: 'Value Buds 112 Street',
      attribute_value: 'Value Buds is Canada\'s newest low-cost high-value',
    };

  // create new attribute
  await Attribute.create(atttribute_data);
  console.log(`Created Product's Attributes`);
  // add new category record of product
  await createCategories(product_id);
}

// Create Categories table
async function createCategories(product_id) {
  const category_data =
    {
      product_id:product_id,
      tree_number: '112',
      parent: 'Value Buds is Canada\'s newest low-cost high-value',
      level_1: 'xyz',
      level_2: 'xyz',
      level_3: 'xyz',
    };

  await Category.create(category_data);
  console.log(`Created Product's Category`);
  // add new description record of product
  await createDescriptions(product_id);
}

// Create Descriptions table
async function createDescriptions(product_id) {
  const description_data =
    {
      product_id: product_id,
      description: 'Value Buds 112 Street',
      additional_information: 'Value Buds is Canada\'s newest low-cost high-value',
      meta_title: 'xyz',
      meta_description: 'xyztest',
    };
    
  await Description.create(description_data);
  console.log(`Created Product's Description`);
  // add new description record of product
  await createImages(product_id);
}

// Create Images table
async function createImages(product_id) {
  const images_data =
    {
      product_id: product_id,
      image_url: 'Value Buds 112 Street',
      image_type: 'Value Buds is Canada\'s newest low-cost high-value',
      sort_order: '1',
    };
  
  await Image.create(images_data);
  console.log(`Created Product's Image`);
  // add new Options record of product
  await createOptions(product_id);
}

// Create Options table
async function createOptions(product_id) {

  const options_data =
    {
      product_id: product_id,
      option_name: 'Value Buds 112 Street',
      option_type: 'Value Buds is Canada\'s newest low-cost high-value',
      option_value: 'xyz',
      option_image: 'xyz',
      option_price_prefix: 'xyz',
    };
  
  await Option.create(options_data);
  console.log(`Created Product's Option`);
  // add new pricing record of product
  await createPricing(product_id);
}

async function createPricing(product_id) {

  const pricing_data =
    {
      product_id: product_id,
      price: '15',
      old_price: '20',
      currency: 'cad',
      ccc: 'xyz'
    };

  await Pricing.create(pricing_data);
  console.log(`Created Product's Pricing`);
  // add new review record of product
  await createReview(product_id);
}


async function createReview(product_id) {
  const review_data =
    {
      product_id: product_id,
      reviews_count: '100',
      rating: '5',
      review_link: 'testurl.com',
    };

  await Review.create(review_data);
  console.log(`Created Product's Review`);
  // add new stock record of product
  await createStock(product_id);
}

// Create Stock table
async function createStock(product_id) {

  const stock_data =
    {
      product_id: product_id,
      quantity: '100',
      weight: '5',
      weight_unit: '2',
      out_of_stock_status: 'false',
      equivalency: 'yes'
    };

  await Stocks.create(stock_data);
  console.log(`Created Product's Stock`);
}
