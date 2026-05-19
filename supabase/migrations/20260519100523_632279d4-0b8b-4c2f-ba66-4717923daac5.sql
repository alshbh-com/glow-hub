
INSERT INTO categories (name_ar, name_en, slug, image_url, display_order) VALUES
('شفاه', 'Lips', 'lips', '/seed/cat-lips.jpg', 1),
('بشرة', 'Face', 'face', '/seed/cat-face.jpg', 2),
('عيون', 'Eyes', 'eyes', '/seed/cat-eyes.jpg', 3),
('عطور', 'Perfumes', 'perfume', '/seed/cat-perfume.jpg', 4),
('عناية بالبشرة', 'Skincare', 'skincare', '/seed/cat-skin.jpg', 5)
ON CONFLICT DO NOTHING;

INSERT INTO governorates (name_ar, name_en, shipping_cost, display_order) VALUES
('القاهرة', 'Cairo', 50, 1),
('الجيزة', 'Giza', 50, 2),
('الإسكندرية', 'Alexandria', 70, 3),
('الدقهلية', 'Dakahlia', 80, 4),
('الشرقية', 'Sharqia', 80, 5),
('القليوبية', 'Qalyubia', 70, 6),
('المنوفية', 'Monufia', 80, 7),
('الغربية', 'Gharbia', 80, 8)
ON CONFLICT DO NOTHING;

WITH cats AS (SELECT id, slug FROM categories)
INSERT INTO products (name_ar, name_en, description_ar, price, compare_at_price, images, category_id, stock, is_new, is_bestseller) VALUES
('روج فيلفت بلوم', 'Velvet Bloom Lipstick', 'روج مات فاخر بتركيبة كريمية تدوم طويلاً.', 450, 550, ARRAY['/seed/p1.jpg'], (SELECT id FROM cats WHERE slug='lips'), 25, true, true),
('جلوس بلش بينك', 'Blush Pink Gloss', 'جلوس لامع بلون وردي ناعم لإطلالة طبيعية.', 320, NULL, ARRAY['/seed/p2.jpg'], (SELECT id FROM cats WHERE slug='lips'), 30, true, false),
('كريم أساس سيلكي', 'Silky Foundation', 'كريم أساس بتغطية متوسطة وملمس حريري.', 680, 780, ARRAY['/seed/p3.jpg'], (SELECT id FROM cats WHERE slug='face'), 20, false, true),
('بودرة كومباكت', 'Compact Powder', 'بودرة مضغوطة لإطلالة مات تدوم طويلاً.', 420, NULL, ARRAY['/seed/p4.jpg'], (SELECT id FROM cats WHERE slug='face'), 18, false, false),
('باليت ظلال سنست', 'Sunset Eyeshadow Palette', 'باليت بـ 6 درجات دافئة بألوان غنية.', 750, 900, ARRAY['/seed/p5.jpg'], (SELECT id FROM cats WHERE slug='eyes'), 15, true, true),
('ماسكارا فوليوماتون', 'Volumatone Mascara', 'ماسكارا لكثافة وطول استثنائيين.', 380, NULL, ARRAY['/seed/p6.jpg'], (SELECT id FROM cats WHERE slug='eyes'), 22, false, false),
('آيلاينر سائل', 'Liquid Eyeliner', 'آيلاينر سائل بريشة دقيقة لرسمة مثالية.', 290, NULL, ARRAY['/seed/p7.jpg'], (SELECT id FROM cats WHERE slug='eyes'), 28, true, false),
('عطر نوار رويال', 'Noir Royale Perfume', 'عطر شرقي فاخر بنفحات الورد والعنبر.', 1200, 1500, ARRAY['/seed/p8.jpg'], (SELECT id FROM cats WHERE slug='perfume'), 12, true, true),
('سيروم فيتامين سي', 'Vitamin C Serum', 'سيروم لتفتيح البشرة وتوحيد اللون.', 550, NULL, ARRAY['/seed/p9.jpg'], (SELECT id FROM cats WHERE slug='skincare'), 20, false, true),
('كريم ترطيب فاخر', 'Luxe Hydration Cream', 'كريم ترطيب غني لبشرة ناعمة ومتألقة.', 620, 720, ARRAY['/seed/p10.jpg'], (SELECT id FROM cats WHERE slug='skincare'), 16, true, false);
