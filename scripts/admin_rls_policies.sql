-- RLS policies for admin users
-- Run in Supabase SQL Editor (https://supabase.com/dashboard/project/javviajdtrxwsbqvsqws/sql/new)

-- Helper: check if the current user is an admin (bypasses RLS via SECURITY DEFINER)
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.users
    WHERE id = auth.uid()
    AND role = 'admin'
  );
$$;

-- ============================
-- PRODUCTS
-- ============================
-- Public can view active products
DROP POLICY IF EXISTS "Public products" ON products;
CREATE POLICY "Public products" ON products
  FOR SELECT USING (is_active = true);

-- Admins can do everything
DROP POLICY IF EXISTS "Admin all products" ON products;
CREATE POLICY "Admin all products" ON products
  FOR ALL USING (is_admin());

-- ============================
-- ORDERS
-- ============================
-- Users can view their own orders
DROP POLICY IF EXISTS "User own orders" ON orders;
CREATE POLICY "User own orders" ON orders
  FOR SELECT USING (auth.uid() = user_id);

-- Admins can view and update all
DROP POLICY IF EXISTS "Admin all orders" ON orders;
CREATE POLICY "Admin all orders" ON orders
  FOR ALL USING (is_admin());

-- ============================
-- ORDER ITEMS
-- ============================
-- Users can view their own order items (via orders table join)
DROP POLICY IF EXISTS "User own order_items" ON order_items;
CREATE POLICY "User own order_items" ON order_items
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM orders
      WHERE orders.id = order_items.order_id
      AND orders.user_id = auth.uid()
    )
  );

-- Admins can do everything
DROP POLICY IF EXISTS "Admin all order_items" ON order_items;
CREATE POLICY "Admin all order_items" ON order_items
  FOR ALL USING (is_admin());

-- ============================
-- CART ITEMS
-- ============================
-- Users can manage their own cart
DROP POLICY IF EXISTS "User own cart" ON cart_items;
CREATE POLICY "User own cart" ON cart_items
  FOR ALL USING (auth.uid() = user_id);

-- Admins can see all
DROP POLICY IF EXISTS "Admin all cart" ON cart_items;
CREATE POLICY "Admin all cart" ON cart_items
  FOR ALL USING (is_admin());

-- ============================
-- WISHLIST ITEMS
-- ============================
-- Users can manage their own wishlist
DROP POLICY IF EXISTS "User own wishlist" ON wishlist_items;
CREATE POLICY "User own wishlist" ON wishlist_items
  FOR ALL USING (auth.uid() = user_id);

-- Admins can see all
DROP POLICY IF EXISTS "Admin all wishlist" ON wishlist_items;
CREATE POLICY "Admin all wishlist" ON wishlist_items
  FOR ALL USING (is_admin());

-- ============================
-- REVIEWS
-- ============================
-- Anyone can read approved reviews
DROP POLICY IF EXISTS "Public reviews" ON reviews;
CREATE POLICY "Public reviews" ON reviews
  FOR SELECT USING (is_approved = true);

-- Users can create their own reviews
DROP POLICY IF EXISTS "User insert reviews" ON reviews;
CREATE POLICY "User insert reviews" ON reviews
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Admins can do everything
DROP POLICY IF EXISTS "Admin all reviews" ON reviews;
CREATE POLICY "Admin all reviews" ON reviews
  FOR ALL USING (is_admin());

-- ============================
-- COUPONS
-- ============================
-- Anyone can read active coupons
DROP POLICY IF EXISTS "Public coupons" ON coupons;
CREATE POLICY "Public coupons" ON coupons
  FOR SELECT USING (is_active = true);

-- Admins can do everything
DROP POLICY IF EXISTS "Admin all coupons" ON coupons;
CREATE POLICY "Admin all coupons" ON coupons
  FOR ALL USING (is_admin());

-- ============================
-- USERS
-- ============================
-- Users can view/update their own record
DROP POLICY IF EXISTS "User own user" ON users;
CREATE POLICY "User own user" ON users
  FOR SELECT USING (auth.uid() = id);

DROP POLICY IF EXISTS "User update own user" ON users;
CREATE POLICY "User update own user" ON users
  FOR UPDATE USING (auth.uid() = id);

-- Admins can do everything
DROP POLICY IF EXISTS "Admin all users" ON users;
CREATE POLICY "Admin all users" ON users
  FOR ALL USING (is_admin());
