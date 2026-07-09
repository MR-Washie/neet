

// import type { Metadata } from 'next';
// import Link from 'next/link';
// import { getAllPosts } from '@/lib/content';

// export const metadata: Metadata = {
//   title: 'NEETest Blog | Expert NEET-UG Preparation Guides',
//   description: 'Explore expert NEET-UG tips, strategies, and study guides for a 650+ score.',
//   alternates: { canonical: 'https://neetest.com/blog' },
//   openGraph: {
//     title: 'NEETest Blog | Expert NEET-UG Preparation Guides',
//     description: 'Explore expert NEET-UG tips, strategies, and study guides for a 650+ score.',
//     url: 'https://neetest.com/blog',
//     type: 'website',
//   },
// };

// export default async function BlogPage() {
//   const posts = await getAllPosts();

//   return (
//     <main className="max-w-6xl mx-auto px-6 py-16">
//       {/* Header Section */}
//       <div className="mb-16 text-center">
//         <h1 className="text-4xl md:text-6xl font-extrabold text-slate-900 mb-6">
//           NEETest Blog
//         </h1>
//         <p className="text-lg md:text-xl text-slate-600 max-w-2xl mx-auto">
//           Expert-curated strategies, subject-wise breakdowns, and essential tips to help you hit that 650+ score.
//         </p>
//       </div>

//       {/* Blog Grid: Responsive layout (1 column mobile, 2/3 columns desktop) */}
//       <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
//         {posts.map((post) => (
//           <article 
//             key={post.slug} 
//             className="group flex flex-col p-6 bg-white border border-slate-200 rounded-2xl hover:border-blue-500 hover:shadow-lg transition-all duration-300"
//           >
//             <Link href={`/blog/${post.slug}`} className="flex-grow">
//               <h2 className="text-xl font-bold mb-3 group-hover:text-blue-600 transition-colors">
//                 {post.frontmatter.title}
//               </h2>
//               <p className="text-slate-600 line-clamp-3 text-sm leading-relaxed">
//                 {post.frontmatter.description}
//               </p>
//             </Link>
            
//             <div className="mt-6 pt-6 border-t border-slate-100 flex items-center justify-between">
//               <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
//                 Article
//               </span>
//               <span className="text-sm font-medium text-blue-600 group-hover:translate-x-1 transition-transform">
//                 Read more →
//               </span>
//             </div>
//           </article>
//         ))}
//       </section>

//       {/* Empty State */}
//       {posts.length === 0 && (
//         <div className="text-center py-20 text-slate-500">
//           <p>No posts found yet. Check back soon for new guides!</p>
//         </div>
//       )}
//     </main>
//   );
// }


import type { Metadata } from 'next';
import Link from 'next/link';
import { getAllPosts } from '@/lib/content';

// 1. SEO Metadata for search engines and social media
export const metadata: Metadata = {
  title: 'NEETest Blog | Expert NEET-UG Preparation Guides',
  description: 'Explore expert NEET-UG tips, strategies, and study guides for a 650+ score.',
  alternates: { canonical: 'https://neetest.com/blog' },
  openGraph: {
    title: 'NEETest Blog | Expert NEET-UG Preparation Guides',
    description: 'Explore expert NEET-UG tips, strategies, and study guides for a 650+ score.',
    url: 'https://neetest.com/blog',
    type: 'website',
  },
};

export default async function BlogPage() {
  const posts = await getAllPosts();

  return (
    <main className="max-w-6xl mx-auto px-6 py-16">
      {/* Header Section */}
      <header className="mb-16 text-center">
        <h1 className="text-4xl md:text-6xl font-extrabold text-slate-900 mb-6">
          NEETest Blog
        </h1>
        <p className="text-lg md:text-xl text-slate-600 max-w-2xl mx-auto">
          Expert-curated strategies, subject-wise breakdowns, and essential tips to help you hit that 650+ score.
        </p>
      </header>

      {/* Blog Grid */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {posts.map((post) => (
          // Entire card is a link for better UX and SEO
          <Link 
            href={`/blog/${post.slug}`} 
            key={post.slug} 
            className="group block h-full"
          >
            <article className="h-full flex flex-col p-6 bg-white border border-slate-200 rounded-2xl hover:border-blue-500 hover:shadow-lg transition-all duration-300">
              <h2 className="text-xl font-bold mb-3 group-hover:text-blue-600 transition-colors">
                {post.frontmatter.title}
              </h2>
              <p className="text-slate-600 line-clamp-3 text-sm leading-relaxed flex-grow">
                {post.frontmatter.description}
              </p>
              
              {/* Footer inside the card */}
              <div className="mt-6 pt-6 border-t border-slate-100 flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  NEET Guide
                </span>
                <span className="text-sm font-medium text-blue-600">
                  Read more →
                </span>
              </div>
            </article>
          </Link>
        ))}
      </section>

      {/* Empty State Logic */}
      {posts.length === 0 && (
        <div className="text-center py-20 bg-slate-50 rounded-3xl border border-dashed border-slate-300">
          <p className="text-slate-500 text-lg">No posts found yet. Our experts are working on new content!</p>
        </div>
      )}
    </main>
  );
}