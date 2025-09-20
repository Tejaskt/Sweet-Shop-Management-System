-- Insert sample sweets data
INSERT INTO public.sweets (name, description, category, price, quantity, image_url) VALUES
('Chocolate Chip Cookies', 'Classic homemade chocolate chip cookies with premium chocolate chips', 'Cookies', 12.99, 50, '/chocolate-chip-cookies.png'),
('Strawberry Gummies', 'Soft and chewy strawberry-flavored gummy candies', 'Gummies', 8.99, 75, '/strawberry-gummies.jpg'),
('Vanilla Cupcakes', 'Fluffy vanilla cupcakes with buttercream frosting', 'Cupcakes', 15.99, 30, '/placeholder.svg?height=200&width=200'),
('Dark Chocolate Truffles', 'Rich dark chocolate truffles with cocoa powder dusting', 'Chocolate', 24.99, 25, '/placeholder.svg?height=200&width=200'),
('Rainbow Lollipops', 'Colorful swirl lollipops in assorted fruit flavors', 'Lollipops', 6.99, 100, '/placeholder.svg?height=200&width=200'),
('Caramel Fudge', 'Creamy caramel fudge squares made with real butter', 'Fudge', 18.99, 40, '/placeholder.svg?height=200&width=200'),
('Peppermint Bark', 'White chocolate bark with crushed peppermint candies', 'Chocolate', 16.99, 35, '/placeholder.svg?height=200&width=200'),
('Sour Patch Kids', 'Sour then sweet chewy candies in fun shapes', 'Sour Candy', 9.99, 60, '/placeholder.svg?height=200&width=200'),
('Chocolate Brownies', 'Fudgy chocolate brownies with walnuts', 'Brownies', 14.99, 20, '/placeholder.svg?height=200&width=200'),
('Cotton Candy', 'Light and fluffy cotton candy in pink and blue', 'Cotton Candy', 7.99, 45, '/placeholder.svg?height=200&width=200')
ON CONFLICT DO NOTHING;
