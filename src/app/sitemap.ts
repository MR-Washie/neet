// import { MetadataRoute } from 'next';

// export default function sitemap(): MetadataRoute.Sitemap {
//   const baseUrl = 'https://neetest.com';
  
//   return [
//     { url: baseUrl, lastModified: new Date(), changeFrequency: 'daily', priority: 1.0 },
//     { url: `${baseUrl}/neet-pyq-pdf`, lastModified: new Date(), changeFrequency: 'daily', priority: 1.0 },
//     { url: `${baseUrl}/neet-pyq-faq`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
//     { url: `${baseUrl}/neet-test`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
//     { url: `${baseUrl}/about`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
//     { url: `${baseUrl}/contact`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
//     { url: `${baseUrl}/privacy`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.3 },
//     { url: `${baseUrl}/terms`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.3 },
//   ];
// }

import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://neetest.com';
  
  // Use a fixed date for static pages that don't change often
  const lastUpdated = new Date('2026-07-11');

  return [
    { url: baseUrl, lastModified: lastUpdated, changeFrequency: 'daily', priority: 1.0 },
    // Core Resource Pages
    { url: `${baseUrl}/neet-pyq-pdf`, lastModified: lastUpdated, changeFrequency: 'daily', priority: 1.0 },
    { url: `${baseUrl}/neet-test`, lastModified: lastUpdated, changeFrequency: 'weekly', priority: 0.9 },
    
    // Add your new Guides/Blog Posts (Crucial for SEO)
    { url: `${baseUrl}/blog/biology-360-strategy`, lastModified: lastUpdated, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${baseUrl}/blog/neet-650-blueprint`, lastModified: lastUpdated, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${baseUrl}/blog/physics-conquer-guide`, lastModified: lastUpdated, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${baseUrl}/blog/neet-previous-year-question-paper`, lastModified: lastUpdated, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${baseUrl}/blog/neet-previous-year-question-papers-with-solutions-pdf`, lastModified: lastUpdated, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${baseUrl}/blog/neet-previous-years-question-papers-free-pdf-download`, lastModified: lastUpdated, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${baseUrl}/blog/neet-pyq-guide`, lastModified: lastUpdated, changeFrequency: 'weekly', priority: 0.9 },


    // Footer/Utility Pages
    { url: `${baseUrl}/about`, lastModified: lastUpdated, changeFrequency: 'monthly', priority: 0.5 },
    { url: `${baseUrl}/contact`, lastModified: lastUpdated, changeFrequency: 'monthly', priority: 0.5 },
    { url: `${baseUrl}/privacy`, lastModified: lastUpdated, changeFrequency: 'monthly', priority: 0.3 },
    { url: `${baseUrl}/terms`, lastModified: lastUpdated, changeFrequency: 'monthly', priority: 0.3 },
  ];
}