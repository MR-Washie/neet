// import type { Metadata } from 'next';
// import { getAllPosts } from '@/lib/content'; // Import your data fetching utility

// // 1. Define Metadata for the Blog Index Page
// export const metadata: Metadata = {
//   title: 'NEETest Blog | Expert NEET-UG Preparation Guides',
//   description: 'Explore the latest NEET-UG preparation tips, study strategies, and subject-wise guides to help you achieve a 650+ score.',
//   alternates: {
//     canonical: 'https://neetest.com/blog', // Helps avoid duplicate content issues
//   },
//   openGraph: {
//     title: 'NEETest Blog | Expert NEET-UG Preparation Guides',
//     description: 'Explore the latest NEET-UG preparation tips, study strategies, and subject-wise guides.',
//     url: 'https://neetest.com/blog',
//     siteName: 'NEETest',
//     type: 'website',
//   },
// };

// export default async function BlogPage() {
//   const posts = await getAllPosts();

//   return (
//     <main className="max-w-4xl mx-auto px-6 py-16">
//       <h1 className="text-4xl font-extrabold mb-8">NEETest Blog</h1>
      
//       {/* 2. Semantic List Structure */}
//       <ul className="space-y-6">
//         {posts.map((post) => (
//           <li key={post.slug} className="border-b pb-6">
//             <a href={`/blog/${post.slug}`} className="text-2xl font-bold hover:text-blue-600 transition-colors">
//               {post.frontmatter.title}
//             </a>
//             <p className="text-slate-600 mt-2">{post.frontmatter.description}</p>
//           </li>
//         ))}
//       </ul>
//     </main>
//   );
// }