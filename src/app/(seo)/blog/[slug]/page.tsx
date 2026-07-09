import { Metadata } from 'next';

// 1. Generate Metadata dynamically based on the URL slug
export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const title = params.slug.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  return {
    title: `${title} | NEETest Blog`,
    description: `Expert guide and tips on ${title} for NEET-UG aspirants.`,
  };
}

export default function BlogPost({ params }: { params: { slug: string } }) {
  // Format the slug for display
  const title = params.slug.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');

  return (
    <main className="max-w-4xl mx-auto px-6 py-16">
      <article className="prose lg:prose-xl prose-slate mx-auto">
        
        {/* Header Section */}
        <header className="mb-10 text-center">
          <span className="text-blue-600 font-bold uppercase tracking-widest text-sm">NEET Preparation Guide</span>
          <h1 className="text-4xl md:text-5xl font-extrabold mt-4 text-slate-900">{title}</h1>
          <p className="text-slate-500 mt-4">Last Updated: July 2026 | By NEETest Expert Team</p>
        </header>

        {/* Content Section - Add your long-form content here */}
        <section className="text-lg leading-relaxed text-slate-700">
          <p>
            Cracking the NEET-UG examination requires a strategic approach. When students search for <strong>{title.toLowerCase()}</strong>, 
            the most important factor is consistency and using verified <strong>NEET PYQ resources</strong>.
          </p>

          <h2 className="text-2xl font-bold mt-8">Why this topic matters for NEET 2026</h2>
          <p>
            Based on the latest NTA guidelines, understanding this topic is critical for scoring above the 600+ threshold. 
            Many students struggle here because they ignore the NCERT base.
          </p>

          {/* Internal Linking for SEO Authority */}
          <div className="bg-slate-900 text-white p-8 rounded-2xl my-10">
            <h3 className="text-xl font-bold text-white mb-2">Ready to practice?</h3>
            <p className="text-slate-300 mb-6">
              Don't just read about it. Apply your knowledge by solving actual previous year questions related to this topic.
            </p>
            <a href="/neet-pyq" className="inline-block bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 px-6 rounded-lg transition-colors">
              Go to NEET PYQ Archive
            </a>
          </div>
        </section>
      </article>

      {/* JSON-LD Article Schema for Google Rich Snippets */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Article",
            "headline": title,
            "publisher": { "@type": "Organization", "name": "NEETest" },
            "datePublished": "2026-07-09",
          }),
        }}
      />
    </main>
  );
}