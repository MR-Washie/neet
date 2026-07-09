

// import { MDXRemote } from "next-mdx-remote/rsc";
// import { getPostBySlug, getAllPosts } from "@/lib/content";
// import { notFound } from "next/navigation";
// import type { Metadata } from "next";

// type Params = Promise<{ slug: string }>;

// export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
//   const { slug } = await params;
//   const post = getPostBySlug(slug);
  
//   if (!post) return { title: "Not Found" };

//   return {
//     title: `${post.frontmatter.title} | NEETest Blog`,
//     description: post.frontmatter.description,
//     authors: [{ name: "NEETest Team" }],
//     alternates: { canonical: `https://neetest.com/blog/${slug}` },
//     openGraph: {
//       title: post.frontmatter.title,
//       description: post.frontmatter.description,
//       type: "article",
//       publishedTime: post.frontmatter.publishedAt,
//     },
//   };
// }

// export async function generateStaticParams() {
//   return getAllPosts().map((post) => ({ slug: post.slug }));
// }

// export default async function BlogPost({ params }: { params: Params }) {
//   const { slug } = await params;
//   const post = getPostBySlug(slug);
//   if (!post) notFound();

//   const jsonLd = {
//     "@context": "https://schema.org",
//     "@type": "Article",
//     headline: post.frontmatter.title,
//     description: post.frontmatter.description,
//     datePublished: post.frontmatter.publishedAt,
//     author: { "@type": "Organization", name: "NEETest Team" },
//   };

//   return (
//     <>
//       <script
//         type="application/ld+json"
//         dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
//       />
      
//       <main className="min-h-screen pt-16 pb-24 px-6">
//         <article className="max-w-3xl mx-auto">
//           {/* Header */}
//           <header className="mb-12 border-b border-slate-200 pb-10">
//             <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight mb-6">
//               {post.frontmatter.title}
//             </h1>
//             <div className="flex items-center gap-4 text-slate-500 font-medium">
//               <span className="bg-blue-50 text-blue-600 px-3 py-1 rounded-full text-sm">
//                 NEET Strategy
//               </span>
//               <span>{post.frontmatter.publishedAt}</span>
//             </div>
//           </header>

//           {/* Content: 'prose' makes everything look professional automatically */}
//           <div className="prose prose-slate prose-lg lg:prose-xl max-w-none prose-headings:font-bold prose-a:text-blue-600">
//             <MDXRemote source={post.content} />
//           </div>

//           {/* Footer Call-to-Action */}
//           <section className="mt-20 p-8 bg-slate-900 rounded-3xl text-white">
//             <h3 className="text-2xl font-bold mb-2">Ready to crush NEET 2026?</h3>
//             <p className="text-slate-400 mb-6">Join thousands of students getting daily practice questions and expert study hacks.</p>
//             <button className="bg-blue-600 hover:bg-blue-500 transition-colors px-8 py-3 rounded-xl font-bold">
//               Join the Newsletter
//             </button>
//           </section>
//         </article>
//       </main>
//     </>
//   );
// }

import { MDXRemote } from "next-mdx-remote/rsc";
import { getPostBySlug, getAllPosts } from "@/lib/content";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

type Params = Promise<{ slug: string }>;

// ... (keep your existing generateMetadata and generateStaticParams functions exactly as they are)

export default async function BlogPost({ params }: { params: Params }) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) notFound();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.frontmatter.title,
    description: post.frontmatter.description,
    datePublished: post.frontmatter.publishedAt,
    author: { "@type": "Organization", name: "NEETest Team" },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      
      <main className="bg-white min-h-screen">
        {/* Decorative subtle background element */}
        <div className="absolute top-0 w-full h-[400px] bg-gradient-to-b from-slate-50 to-white -z-10" />

        <article className="max-w-[700px] mx-auto px-6 py-20">
          {/* Header Section */}
          <header className="mb-12">
            <div className="flex items-center gap-3 mb-6">
              <span className="px-3 py-1 bg-blue-100 text-blue-700 text-xs font-bold uppercase tracking-widest rounded-full">
                NEET 2026 Guide
              </span>
              <time className="text-sm text-slate-500 font-medium">
                {post.frontmatter.publishedAt}
              </time>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.1] mb-8">
              {post.frontmatter.title}
            </h1>
          </header>

          {/* Body Content with "Prose" */}
          <div className="prose prose-slate prose-lg max-w-none 
            prose-headings:text-slate-900 
            prose-headings:tracking-tight
            prose-p:leading-8 
            prose-a:text-blue-600 prose-a:no-underline hover:prose-a:underline
            prose-img:rounded-2xl
            prose-strong:text-slate-900">
            <MDXRemote source={post.content} />
          </div>

          {/* Modern Footer CTA */}
          <footer className="mt-20 pt-10 border-t border-slate-100">
            <div className="bg-slate-50 p-8 rounded-3xl border border-slate-100 flex flex-col md:flex-row items-center justify-between gap-6">
              <div>
                <h4 className="text-lg font-bold text-slate-900">Want more tips?</h4>
                <p className="text-slate-600 text-sm">Join our newsletter for weekly NEET strategies.</p>
              </div>
              <button className="bg-slate-900 text-white px-6 py-3 rounded-xl font-semibold hover:bg-slate-800 transition-all">
                Subscribe Now
              </button>
            </div>
          </footer>
        </article>
      </main>
    </>
  );
}