// app/robots.ts
import type { MetadataRoute } from 'next'
 
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      // disallow: '/private/', // Uncomment and edit if you have private pages
    },
    sitemap: 'https://neetest.com/sitemap.xml', // Replace with your actual domain
  }
}