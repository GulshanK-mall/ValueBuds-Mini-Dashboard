-- Producers table
CREATE TABLE IF NOT EXISTS producers (
    producer_id SERIAL PRIMARY KEY,
    p_id VARCHAR(255) NOT NULL,
    producer VARCHAR(255) NOT NULL,
    city VARCHAR(255) NOT NULL,
    store_name VARCHAR(255) NOT NULL,
    description VARCHAR(255),
    ccc VARCHAR(255),
    type VARCHAR(255),
    active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    comment TEXT
);

-- Producer's Contact table
CREATE TABLE IF NOT EXISTS Contact (
  id SERIAL PRIMARY KEY,
  producer_id VARCHAR(255) NOT NULL,
  contact_name VARCHAR(255) NOT NULL,
  phone VARCHAR(255) NOT NULL,
  phone_2 VARCHAR(255) NOT NULL,
  email VARCHAR(255),
  email_private VARCHAR(255)
);

-- Producer's License table
CREATE TABLE IF NOT EXISTS License (
  id SERIAL PRIMARY KEY,
  producer_id VARCHAR(255) NOT NULL,
  license_type VARCHAR(255) NOT NULL,
  date_licensed VARCHAR(255) NOT NULL
);


-- Producer's Location table
CREATE TABLE IF NOT EXISTS Location (
  id SERIAL PRIMARY KEY,
  producer_id VARCHAR(255) NOT NULL,
  address VARCHAR(255) NOT NULL,
  full_address VARCHAR(255) NOT NULL,
  province VARCHAR(255) NOT NULL,
  postal_code VARCHAR(255) NOT NULL,
  country VARCHAR(255) NOT NULL,
  longitude VARCHAR(255) NOT NULL,
  latitude VARCHAR(255) NOT NULL,
  ccc VARCHAR(255) NOT NULL
);


-- Producer's Media table
CREATE TABLE IF NOT EXISTS Media (
  id SERIAL PRIMARY KEY,
  producer_id VARCHAR(255) NOT NULL,
  page_url VARCHAR(255) NOT NULL,
  link VARCHAR(255) NOT NULL,
  social VARCHAR(255) NOT NULL
);


-- Create Product table
CREATE TABLE IF NOT EXISTS products (
    product_id SERIAL PRIMARY KEY,
    p_id VARCHAR(255) NOT NULL UNIQUE,
    sku VARCHAR(255) NOT NULL,
    brand_name VARCHAR(255),
    manufacturer VARCHAR(255),
    page_url TEXT,
    main_image TEXT,
    quantity INT DEFAULT 0,
    weight DECIMAL(10,3) DEFAULT 0.0,
    weight_unit VARCHAR(10) DEFAULT 'kg',
    equivalency VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- -- Attributes table
CREATE TABLE IF NOT EXISTS attributes (
    id SERIAL PRIMARY KEY,
    product_id VARCHAR(255) NOT NULL,
    attribute_name VARCHAR(255) NOT NULL,
    attribute_value VARCHAR(255) NOT NULL
);

-- Categories table
CREATE TABLE IF NOT EXISTS categories (
    id SERIAL PRIMARY KEY,
    product_id VARCHAR(255) NOT NULL,
    tree_number INT DEFAULT 1,
    parent VARCHAR(255),
    level_1 VARCHAR(255),
    level_2 VARCHAR(255),
    level_3 VARCHAR(255)
);

-- Products Descriptions table
CREATE TABLE IF NOT EXISTS Descriptions(
    id SERIAL PRIMARY KEY,
    product_id VARCHAR(255) NOT NULL,
    description TEXT,
    additional_information TEXT,
    meta_title VARCHAR(255),
    meta_description VARCHAR(255)
);

-- Products Image table
CREATE TABLE IF NOT EXISTS Images(
    id SERIAL PRIMARY KEY,
    product_id VARCHAR(255) NOT NULL,
    image_url TEXT NOT NULL,
    image_type VARCHAR(255) NOT NULL,
    sort_order INT DEFAULT 0
);

-- Products Options table
CREATE TABLE IF NOT EXISTS Options(
    id SERIAL PRIMARY KEY,
    product_id VARCHAR(255) NOT NULL,
    option_name VARCHAR(255) NOT NULL,
    option_type VARCHAR(255),
    option_value VARCHAR(255),
    option_image TEXT,
    option_price_prefix VARCHAR(255)
);

-- Products Pricing table
CREATE TABLE IF NOT EXISTS Pricing(
    id SERIAL PRIMARY KEY,
    product_id VARCHAR(255) NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    old_price DECIMAL(10,2),
    currency CHAR(3) DEFAULT 'USD',
    ccc VARCHAR(50),
    recorded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Products Reviews table
CREATE TABLE IF NOT EXISTS Reviews(
    id SERIAL PRIMARY KEY,
    product_id VARCHAR(255) NOT NULL,
    reviews_count INT DEFAULT 0,
    rating DECIMAL(2,1) DEFAULT 0.0,
    review_link TEXT
);


-- Products Stocks table
CREATE TABLE IF NOT EXISTS Stocks(
    id SERIAL PRIMARY KEY,
    product_id VARCHAR(255) NOT NULL,
    quantity INT DEFAULT 0,
    weight DECIMAL(10,3) DEFAULT 0.0,
    weight_unit VARCHAR(100) DEFAULT 'kg',
    out_of_stock_status BOOLEAN DEFAULT FALSE,
    equivalency VARCHAR(255)
);
