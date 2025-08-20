-- Insert sample categories
INSERT INTO public.categories (name, slug, description, image_url) VALUES
('Men', 'men', 'Fashion for Men', '/placeholder.svg?height=300&width=300'),
('Women', 'women', 'Fashion for Women', '/placeholder.svg?height=300&width=300'),
('Kids', 'kids', 'Fashion for Kids', '/placeholder.svg?height=300&width=300'),
('Home & Living', 'home-living', 'Home Decor & Living', '/placeholder.svg?height=300&width=300'),
('Beauty', 'beauty', 'Beauty & Personal Care', '/placeholder.svg?height=300&width=300');

-- Insert subcategories
INSERT INTO public.categories (name, slug, description, parent_id) VALUES
('T-Shirts', 'men-tshirts', 'Men T-Shirts', (SELECT id FROM public.categories WHERE slug = 'men')),
('Shirts', 'men-shirts', 'Men Shirts', (SELECT id FROM public.categories WHERE slug = 'men')),
('Jeans', 'men-jeans', 'Men Jeans', (SELECT id FROM public.categories WHERE slug = 'men')),
('Kurtas', 'women-kurtas', 'Women Kurtas', (SELECT id FROM public.categories WHERE slug = 'women')),
('Dresses', 'women-dresses', 'Women Dresses', (SELECT id FROM public.categories WHERE slug = 'women')),
('Sarees', 'women-sarees', 'Women Sarees', (SELECT id FROM public.categories WHERE slug = 'women'));

-- Insert sample brands
INSERT INTO public.brands (name, slug, logo_url, description) VALUES
('Roadster', 'roadster', '/placeholder.svg?height=100&width=100', 'Trendy casual wear'),
('HERE&NOW', 'here-now', '/placeholder.svg?height=100&width=100', 'Contemporary fashion'),
('Libas', 'libas', '/placeholder.svg?height=100&width=100', 'Ethnic wear for women'),
('Mast & Harbour', 'mast-harbour', '/placeholder.svg?height=100&width=100', 'Casual lifestyle brand'),
('Anouk', 'anouk', '/placeholder.svg?height=100&width=100', 'Fusion ethnic wear');

-- Insert sample products
INSERT INTO public.products (name, slug, description, price, original_price, discount_percentage, brand_id, category_id, images, sizes, colors, stock_quantity, is_featured, rating, review_count) VALUES
(
  'Men Solid Cotton T-Shirt',
  'men-solid-cotton-tshirt',
  'Comfortable cotton t-shirt perfect for casual wear',
  599.00,
  999.00,
  40,
  (SELECT id FROM public.brands WHERE slug = 'roadster'),
  (SELECT id FROM public.categories WHERE slug = 'men-tshirts'),
  ARRAY['/placeholder.svg?height=500&width=400', '/placeholder.svg?height=500&width=400'],
  ARRAY['S', 'M', 'L', 'XL', 'XXL'],
  ARRAY['Blue', 'Black', 'White', 'Grey'],
  100,
  true,
  4.2,
  156
),
(
  'Women Printed Kurta',
  'women-printed-kurta',
  'Beautiful printed kurta with intricate designs',
  1299.00,
  2199.00,
  41,
  (SELECT id FROM public.brands WHERE slug = 'libas'),
  (SELECT id FROM public.categories WHERE slug = 'women-kurtas'),
  ARRAY['/placeholder.svg?height=500&width=400', '/placeholder.svg?height=500&width=400'],
  ARRAY['XS', 'S', 'M', 'L', 'XL'],
  ARRAY['Pink', 'Blue', 'Green', 'Yellow'],
  75,
  true,
  4.5,
  89
),
(
  'Men Slim Fit Jeans',
  'men-slim-fit-jeans',
  'Premium quality slim fit jeans with stretch comfort',
  1799.00,
  2999.00,
  40,
  (SELECT id FROM public.brands WHERE slug = 'here-now'),
  (SELECT id FROM public.categories WHERE slug = 'men-jeans'),
  ARRAY['/placeholder.svg?height=500&width=400', '/placeholder.svg?height=500&width=400'],
  ARRAY['28', '30', '32', '34', '36', '38'],
  ARRAY['Dark Blue', 'Light Blue', 'Black'],
  50,
  false,
  4.1,
  234
),
(
  'Women A-Line Dress',
  'women-aline-dress',
  'Elegant A-line dress perfect for parties and occasions',
  2199.00,
  3499.00,
  37,
  (SELECT id FROM public.brands WHERE slug = 'anouk'),
  (SELECT id FROM public.categories WHERE slug = 'women-dresses'),
  ARRAY['/placeholder.svg?height=500&width=400', '/placeholder.svg?height=500&width=400'],
  ARRAY['XS', 'S', 'M', 'L', 'XL'],
  ARRAY['Red', 'Black', 'Navy', 'Maroon'],
  30,
  true,
  4.3,
  67
);
