import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData()
    const file = formData.get('file') as File | null
    if (!file) return NextResponse.json({ error: 'No file provided' }, { status: 400 })

    const ext = file.name.split('.').pop() || 'jpg'
    const filename = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`

    const bytes = await file.arrayBuffer()

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    const { data, error } = await supabase.storage
      .from('products')
      .upload(filename, Buffer.from(bytes), {
        contentType: file.type || 'image/jpeg',
        cacheControl: '3600',
      })

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })

    const { data: urlData } = supabase.storage.from('products').getPublicUrl(filename)

    return NextResponse.json({ url: urlData.publicUrl })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
