export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          name: string
          email: string
          phone: string | null
          password_hash: string
          role: 'customer' | 'admin'
          email_verified: boolean
          must_change_password: boolean
          avatar_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['users']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['users']['Insert']>
      }
      products: {
        Row: {
          id: string
          name: string
          slug: string
          description: string
          category: string
          price: number
          sale_price: number | null
          stock_quantity: number
          images: string[]
          sizes: string[]
          colors: string[]
          features: string[]
          badge: string | null
          rating: number
          review_count: number
          featured: boolean
          collection: string
          tags: string[]
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['products']['Row'], 'id' | 'created_at' | 'updated_at' | 'rating' | 'review_count'>
        Update: Partial<Database['public']['Tables']['products']['Insert']>
      }
      orders: {
        Row: {
          id: string
          user_id: string | null
          guest_token: string | null
          total: number
          subtotal: number
          shipping_cost: number
          tax: number
          discount: number
          coupon_code: string | null
          payment_status: 'pending' | 'paid' | 'failed' | 'refunded'
          order_status: 'pending' | 'processing' | 'paid' | 'shipped' | 'delivered' | 'cancelled'
          shipping_address: Json | null
          phone: string | null
          email: string | null
          payment_method: string | null
          payment_id: string | null
          notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['orders']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['orders']['Insert']>
      }
      order_items: {
        Row: {
          id: string
          order_id: string
          product_id: string
          name: string
          size: string | null
          color: string | null
          quantity: number
          price: number
          image_url: string | null
        }
        Insert: Omit<Database['public']['Tables']['order_items']['Row'], 'id'>
        Update: Partial<Database['public']['Tables']['order_items']['Insert']>
      }
      cart_items: {
        Row: {
          id: string
          user_id: string | null
          guest_token: string | null
          product_id: string
          size: string | null
          color: string | null
          quantity: number
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['cart_items']['Row'], 'id' | 'created_at'>
        Update: Partial<Database['public']['Tables']['cart_items']['Insert']>
      }
      wishlist_items: {
        Row: {
          id: string
          user_id: string
          product_id: string
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['wishlist_items']['Row'], 'id' | 'created_at'>
        Update: Partial<Database['public']['Tables']['wishlist_items']['Insert']>
      }
      reviews: {
        Row: {
          id: string
          product_id: string
          user_id: string
          rating: number
          title: string | null
          comment: string | null
          images: string[]
          is_approved: boolean
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['reviews']['Row'], 'id' | 'created_at'>
        Update: Partial<Database['public']['Tables']['reviews']['Insert']>
      }
      coupons: {
        Row: {
          id: string
          code: string
          discount_type: 'percentage' | 'fixed'
          discount_value: number
          min_order_amount: number
          max_uses: number | null
          used_count: number
          is_active: boolean
          expires_at: string | null
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['coupons']['Row'], 'id' | 'created_at' | 'used_count'>
        Update: Partial<Database['public']['Tables']['coupons']['Insert']>
      }
      password_resets: {
        Row: {
          id: string
          email: string
          token: string
          expires_at: string
          used: boolean
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['password_resets']['Row'], 'id' | 'created_at'>
        Update: Partial<Database['public']['Tables']['password_resets']['Insert']>
      }
    }
  }
}
