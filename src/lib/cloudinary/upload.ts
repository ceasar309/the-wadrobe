import { v2 as cloudinary } from 'cloudinary'

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

export async function uploadImage(file: string, folder: string = 'products'): Promise<string> {
  const result = await cloudinary.uploader.upload(file, {
    folder: `the-wadrobe/${folder}`,
    transformation: [
      { width: 800, height: 1000, crop: 'fill', quality: 'auto', fetch_format: 'auto' },
    ],
  })
  return result.secure_url
}

export async function deleteImage(publicId: string): Promise<void> {
  await cloudinary.uploader.destroy(publicId)
}

export function getPublicIdFromUrl(url: string): string {
  const parts = url.split('/')
  const file = parts[parts.length - 1]
  return file.split('.')[0]
}

export async function uploadMultipleImages(files: string[]): Promise<string[]> {
  const urls = await Promise.all(files.map(f => uploadImage(f)))
  return urls
}
