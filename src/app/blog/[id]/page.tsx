'use client';
import Link from 'next/link';
import { useParams } from 'next/navigation';

// Static blog post data (would be from CMS in production)
const posts: Record<string, { title: string; content: string; author: string; date: string; readTime: string; category: string; coverImage: string }> = {
  '1': {
    title: '10 Essential Tips for New Pet Owners',
    content: `Getting a new pet is one of life's most rewarding experiences, but it also comes with responsibilities. Here are our top 10 tips:\n\n## 1. Pet-Proof Your Home\nBefore bringing your new friend home, make sure to remove any hazardous items. Secure loose wires, put away small objects, and ensure toxic plants are out of reach.\n\n## 2. Choose the Right Food\nConsult your vet about the best diet for your pet's age, breed, and health conditions. Quality nutrition is the foundation of good health.\n\n## 3. Schedule a Vet Visit\nWithin the first week, take your pet for a comprehensive health check. This establishes a baseline and ensures they're up to date on vaccinations.\n\n## 4. Create a Safe Space\nEvery pet needs their own area — a cozy bed, a crate, or a designated room where they can retreat when feeling overwhelmed.\n\n## 5. Start Training Early\nConsistent, positive reinforcement training should begin from day one. This builds trust and establishes healthy habits.\n\n## 6. Socialization Matters\nGradually expose your pet to different people, animals, and environments. This helps prevent anxiety and behavioral issues.\n\n## 7. Regular Exercise\nPhysical activity is crucial for both physical and mental health. Tailor the exercise routine to your pet's breed and energy level.\n\n## 8. Grooming Routine\nRegular grooming keeps your pet comfortable and allows you to check for skin issues, parasites, or lumps.\n\n## 9. Microchip and ID Tag\nAlways have identification on your pet. Microchipping provides a permanent form of ID in case they get lost.\n\n## 10. Love and Patience\nThe most important tip — give your pet unconditional love and patience. The bond you'll build is priceless.`,
    author: 'Dr. Priya Sharma',
    date: 'April 28, 2026',
    readTime: '5 min',
    category: 'Pet Care',
    coverImage: 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?q=80&w=1200&auto=format&fit=crop',
  },
  '2': {
    title: 'Best Dog Breeds for Apartment Living',
    content: `Living in a small space doesn't mean you can't enjoy the companionship of a dog. Here are the best breeds for apartments:\n\n## French Bulldog\nCompact, quiet, and easygoing. Frenchies are perfect for apartments — they're playful but don't need excessive exercise.\n\n## Cavalier King Charles Spaniel\nGentle and adaptable, these dogs are happy with a short walk and lots of cuddles.\n\n## Pug\nSmall, sociable, and hilariously entertaining. Pugs thrive in indoor environments.\n\n## Shih Tzu\nBred as companion dogs, Shih Tzus are quiet and content in small spaces.\n\n## Boston Terrier\nThe "American Gentleman" is well-mannered, compact, and adapts well to any living situation.\n\nRemember, every dog is unique — breed is just a starting point!`,
    author: 'Rahul Mehta',
    date: 'April 20, 2026',
    readTime: '7 min',
    category: 'Dogs',
    coverImage: 'https://images.unsplash.com/photo-1583337130417-13104dec14a1?q=80&w=1200&auto=format&fit=crop',
  },
};

// Fallback for posts without full data
const defaultPost = { title: 'Blog Post', content: 'This post is coming soon. Check back later for the full article!', author: 'Petshop Demo', date: '2026', readTime: '3 min', category: 'General', coverImage: 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?q=80&w=1200' };

export default function BlogPostPage() {
  const params = useParams();
  const post = posts[params.id as string] || defaultPost;

  return (
    <article className="blog-post-page container" style={{ maxWidth: 800, padding: 'var(--space-3xl) var(--space-lg)' }}>
      <Link href="/blog" style={{ color: 'var(--primary-color)', fontWeight: 600, marginBottom: 'var(--space-lg)', display: 'inline-block' }}>
        ← Back to Blog
      </Link>

      <div style={{ borderRadius: 'var(--radius-xl)', overflow: 'hidden', marginBottom: 'var(--space-2xl)', border: '1px solid var(--border-color)' }}>
        <img src={post.coverImage} alt={post.title} style={{ width: '100%', height: 350, objectFit: 'cover' }} />
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: 'var(--space-md)', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
        <span className="badge badge-primary">{post.category}</span>
        <span>{post.author}</span>
        <span>•</span>
        <span>{post.date}</span>
        <span>•</span>
        <span>{post.readTime} read</span>
      </div>

      <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.75rem, 4vw, 2.5rem)', fontWeight: 800, lineHeight: 1.2, marginBottom: 'var(--space-2xl)' }}>
        {post.title}
      </h1>

      <div style={{ color: 'var(--text-secondary)', fontSize: '1.05rem', lineHeight: 1.8 }}>
        {post.content.split('\n\n').map((block, i) => {
          if (block.startsWith('## ')) {
            return <h2 key={i} style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem', fontWeight: 700, margin: 'var(--space-xl) 0 var(--space-md)', color: 'var(--text-color)' }}>{block.replace('## ', '')}</h2>;
          }
          return <p key={i} style={{ marginBottom: 'var(--space-md)' }}>{block}</p>;
        })}
      </div>

      <div style={{ borderTop: '1px solid var(--border-color)', marginTop: 'var(--space-3xl)', paddingTop: 'var(--space-xl)', textAlign: 'center' }}>
        <p style={{ color: 'var(--text-muted)', marginBottom: 'var(--space-lg)' }}>Enjoyed this article? Check out more from our blog.</p>
        <Link href="/blog" className="btn btn-primary">View All Posts →</Link>
      </div>
    </article>
  );
}
