// app/sitemap.ts
import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: 'https://neetest.com', lastModified: new Date() },
    { url: 'https://neetest.com/about', lastModified: new Date() },
    { url: 'https://neetest.com/neet-test', lastModified: new Date() },
    { url: 'https://neetest.com/contact', lastModified: new Date() },
    { url: 'https://neetest.com/neet-pyq-pdf', lastModified: new Date() },

  ];
}