import { createClient } from '@supabase/supabase-js'
import bcrypt from 'bcryptjs'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

const supabase = createClient(supabaseUrl, supabaseServiceKey)

const products = [
  { name: 'Snow Wash Sweat Suit', slug: 'snow-wash-sweat-suit', description: 'Premium heavy-blend sweat suit with signature snow wash finish.', category: 'sweat-suits', price: 4500, stock_quantity: 50, images: [], sizes: ['S', 'M', 'L', 'XL', 'XXL'], colors: ['Charcoal', 'Navy', 'Burgundy'], features: ['Matching hoodie + pants set', 'Snow wash finish', '400GSM cotton', 'Ribbed cuffs'], badge: 'Bestseller', collection: 'unisex', featured: true },
  { name: 'Snow Wash Sweatpants', slug: 'snow-wash-sweatpants', description: 'Heavy-blend sweatpants with signature snow wash treatment.', category: 'sweatpants', price: 2500, stock_quantity: 60, images: [], sizes: ['S', 'M', 'L', 'XL', 'XXL'], colors: ['Charcoal', 'Navy', 'Burgundy', 'Black'], features: ['Snow wash finish', 'Heavy-blend cotton', 'Elastic cuffs', 'Drawstring waist'], badge: null, collection: 'unisex', featured: true },
  { name: 'Black Excellence Hoodie', slug: 'black-excellence-hoodie', description: 'Bold statement hoodie featuring Black Excellence typography.', category: 'hoodies', price: 3200, stock_quantity: 40, images: [], sizes: ['S', 'M', 'L', 'XL', 'XXL'], colors: ['Black', 'White'], features: ['Premium screen-print', 'Heavy-blend fleece', 'Kangaroo pocket'], badge: 'Popular', collection: 'men', featured: true },
  { name: 'Black Excellence Tee', slug: 'black-excellence-tee', description: 'Classic fit t-shirt with bold Black Excellence graphic.', category: 't-shirts', price: 1800, stock_quantity: 80, images: [], sizes: ['S', 'M', 'L', 'XL', 'XXL'], colors: ['Black', 'White'], features: ['Screen-printed graphic', 'Cotton jersey', 'Pre-shrunk'], badge: null, collection: 'men', featured: false },
  { name: 'Makosa Ni Yangu Hoodie', slug: 'makosa-ni-yangu-hoodie', description: 'Signature Makosa Ni Yangu hoodie. A self-aware statement piece.', category: 'hoodies', price: 3200, stock_quantity: 45, images: [], sizes: ['S', 'M', 'L', 'XL', 'XXL'], colors: ['Black', 'Grey'], features: ['Bold front graphic', 'Heavy-blend fleece', 'Oversized fit'], badge: 'Signature', collection: 'unisex', featured: true },
  { name: 'Makosa Ni Yangu Tee', slug: 'makosa-ni-yangu-tee', description: 'Classic Makosa Ni Yangu t-shirt. Clean, bold typography.', category: 't-shirts', price: 1800, stock_quantity: 90, images: [], sizes: ['S', 'M', 'L', 'XL', 'XXL'], colors: ['Black', 'White'], features: ['Center chest graphic', 'Cotton jersey', 'Relaxed fit'], badge: null, collection: 'unisex', featured: false },
  { name: 'The Wadrobe Logo Hoodie', slug: 'wadrobe-logo-hoodie', description: 'Clean corporate-style Wadrobe logo hoodie. Minimalist branding.', category: 'hoodies', price: 2800, stock_quantity: 35, images: [], sizes: ['S', 'M', 'L', 'XL', 'XXL'], colors: ['Black', 'Grey', 'Navy'], features: ['Embossed chest logo', 'Heavy-blend fleece', 'Metal drawstrings'], badge: null, collection: 'unisex', featured: false },
  { name: 'Heavy-Blend Sweatpants', slug: 'heavy-blend-sweatpants', description: 'Essential heavy-blend sweatpants. Clean lines, solid construction.', category: 'sweatpants', price: 2200, stock_quantity: 55, images: [], sizes: ['S', 'M', 'L', 'XL', 'XXL'], colors: ['Black', 'Grey', 'Navy'], features: ['Heavy-blend cotton', 'Elastic cuffs', 'Side pockets'], badge: null, collection: 'men', featured: false },
  { name: 'Black Excellence Hoodie (Women\'s)', slug: 'black-excellence-hoodie-womens', description: 'Women\'s fit Black Excellence hoodie. Tailored silhouette.', category: 'hoodies', price: 3200, stock_quantity: 30, images: [], sizes: ['XS', 'S', 'M', 'L', 'XL'], colors: ['Black', 'White'], features: ['Fitted silhouette', 'Premium screen-print', 'Ribbed cuffs'], badge: null, collection: 'women', featured: true },
  { name: 'Classic Crewneck Sweatshirt', slug: 'classic-crewneck-sweatshirt', description: 'Minimalist crewneck with subtle Wadrobe branding.', category: 'sweat-suits', price: 2600, stock_quantity: 40, images: [], sizes: ['XS', 'S', 'M', 'L', 'XL'], colors: ['Black', 'Grey', 'Burgundy'], features: ['Chest embroidery', 'Heavy-blend fleece', 'Ribbed crewneck'], badge: null, collection: 'women', featured: false },
  { name: 'Branded Beanie', slug: 'branded-beanie', description: 'Snug-fit ribbed beanie with embroidered Wadrobe logo.', category: 'accessories', price: 1200, stock_quantity: 100, images: [], sizes: ['One Size'], colors: ['Black', 'Grey', 'Navy'], features: ['Embroidered logo', 'Ribbed knit', 'One size fits most'], badge: null, collection: 'unisex', featured: false },
  { name: 'Bucket Hat', slug: 'bucket-hat', description: 'Relaxed-fit bucket hat with all-around Wadrobe branding.', category: 'accessories', price: 1500, stock_quantity: 70, images: [], sizes: ['One Size'], colors: ['Black', 'Khaki'], features: ['All-around logo print', 'Cotton twill', 'Reinforced brim'], badge: null, collection: 'unisex', featured: false },
  { name: 'Canvas Tote Bag', slug: 'canvas-tote-bag', description: 'Heavy-duty canvas tote with corporate-style Wadrobe insignia.', category: 'accessories', price: 1800, stock_quantity: 60, images: [], sizes: ['One Size'], colors: ['Natural', 'Black'], features: ['Heavy-duty canvas', 'Screen-printed insignia', 'Internal pocket'], badge: null, collection: 'unisex', featured: false },
  { name: 'Snow Wash Hoodie', slug: 'snow-wash-hoodie', description: 'Standalone snow wash hoodie. All the texture, all the vibe.', category: 'hoodies', price: 2800, stock_quantity: 45, images: [], sizes: ['S', 'M', 'L', 'XL', 'XXL'], colors: ['Charcoal', 'Navy', 'Burgundy'], features: ['Snow wash finish', 'Kangaroo pocket', 'Adjustable hood'], badge: null, collection: 'unisex', featured: false },
  { name: 'Makosa Ni Yangu Hoodie (Women\'s)', slug: 'makosa-ni-yangu-hoodie-womens', description: 'Women\'s fit Makosa Ni Yangu hoodie. Iconic slogan, tailored fit.', category: 'hoodies', price: 3200, stock_quantity: 25, images: [], sizes: ['XS', 'S', 'M', 'L', 'XL'], colors: ['Black', 'Grey'], features: ['Fitted silhouette', 'Bold front graphic', 'Ribbed cuffs'], badge: null, collection: 'women', featured: false },
  { name: 'Black Excellence Tee (Women\'s)', slug: 'black-excellence-tee-womens', description: 'Women\'s fit Black Excellence t-shirt. Same message, tailored fit.', category: 't-shirts', price: 1800, stock_quantity: 55, images: [], sizes: ['XS', 'S', 'M', 'L', 'XL'], colors: ['Black', 'White'], features: ['Fitted silhouette', 'Screen-printed graphic', 'Pre-shrunk'], badge: null, collection: 'women', featured: false },
]

async function seed() {
  console.log('🌱 Seeding database...')

  // Create admin user
  const adminPassword = await bcrypt.hash('ChangeMe123!', 12)
  const { data: existingAdmin } = await supabase.from('users').select('id').eq('email', 'admin@thewadrobe.com').single()

  if (!existingAdmin) {
    const { data: authUser, error: authError } = await supabase.auth.admin.createUser({
      email: 'admin@thewadrobe.com',
      password: 'ChangeMe123!',
      email_confirm: true,
    })

    if (authError) {
      console.error('Admin user creation error:', authError.message)
    } else if (authUser.user) {
      await supabase.from('users').insert({
        id: authUser.user.id,
        name: 'Admin',
        email: 'admin@thewadrobe.com',
        role: 'admin',
        password_hash: adminPassword,
        must_change_password: true,
      })
      console.log('✅ Admin created: admin@thewadrobe.com / ChangeMe123!')
    }
  } else {
    console.log('ℹ️  Admin already exists')
  }

  // Seed products
  for (const product of products) {
    const { data: existing } = await supabase.from('products').select('id').eq('slug', product.slug).single()
    if (!existing) {
      await supabase.from('products').insert(product as any)
      console.log(`  ✅ ${product.name}`)
    } else {
      console.log(`  ℹ️  ${product.name} — exists`)
    }
  }

  // Create coupon
  const { data: existingCoupon } = await supabase.from('coupons').select('id').eq('code', 'WELCOME10').single()
  if (!existingCoupon) {
    await supabase.from('coupons').insert({
      code: 'WELCOME10',
      discount_type: 'percentage',
      discount_value: 10,
      min_order_amount: 2000,
      max_uses: 100,
      is_active: true,
      expires_at: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
    })
    console.log('✅ Coupon created: WELCOME10 (10% off)')
  }

  console.log('🎉 Seeding complete!')
}

seed().catch(console.error)
