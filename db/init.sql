CREATE TABLE IF NOT EXISTS products (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  price INTEGER NOT NULL,
  stock INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS orders (
  id SERIAL PRIMARY KEY,
  product_id INTEGER REFERENCES products(id),
  quantity INTEGER NOT NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT NOW()
);

INSERT INTO products (name, price, stock) VALUES
  ('T-Shirt', 15, 50),
  ('Sneakers Shoes', 45, 20),
  ('Backpack', 30, 15),
  ('Denim Jacket', 55, 25),
  ('Slim Fit Jeans', 40, 60),
  ('Aviator Sunglasses', 20, 80),
  ('Cotton Chino Pants', 35, 45),
  ('Wool Winter Beanie', 12, 120),
  ('Canvas Tote Bag', 10, 200),
  ('Formal Oxford Shoes', 80, 15);
ON CONFLICT DO NOTHING;