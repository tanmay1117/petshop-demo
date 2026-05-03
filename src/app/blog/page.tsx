'use client';
import Link from 'next/link';
import './Blog.css';

const blogPosts = [
  {
    id: '1',
    title: '10 Essential Tips for New Pet Owners',
    excerpt: 'Getting a new pet is exciting! Here are the top 10 things every new pet owner should know to ensure a happy, healthy life for their furry friend.',
    coverImage: 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?q=80&w=800&auto=format&fit=crop',
    category: 'Pet Care',
    author: 'Dr. Priya Sharma',
    date: 'April 28, 2026',
    readTime: '5 min',
  },
  {
    id: '2',
    title: 'Best Dog Breeds for Apartment Living',
    excerpt: 'Living in a small space doesn\'t mean you can\'t have a dog. Discover the perfect breeds that thrive in apartments.',
    coverImage: 'https://images.unsplash.com/photo-1583337130417-13104dec14a1?q=80&w=800&auto=format&fit=crop',
    category: 'Dogs',
    author: 'Rahul Mehta',
    date: 'April 20, 2026',
    readTime: '7 min',
  },
  {
    id: '3',
    title: 'Cat Nutrition Guide: What to Feed Your Feline',
    excerpt: 'Understanding your cat\'s nutritional needs is crucial. Learn about the best foods and feeding schedules.',
    coverImage: 'https://images.unsplash.com/photo-1545249390-6bdfa286032f?q=80&w=800&auto=format&fit=crop',
    category: 'Cats',
    author: 'Dr. Ananya Kulkarni',
    date: 'April 15, 2026',
    readTime: '6 min',
  },
  {
    id: '4',
    title: 'Summer Safety Tips for Your Pets',
    excerpt: 'Hot weather can be dangerous for pets. Keep your companions safe with these summer care essentials.',
    coverImage: 'https://images.unsplash.com/photo-1560807707-8cc77767d783?q=80&w=800&auto=format&fit=crop',
    category: 'Health',
    author: 'Dr. Priya Sharma',
    date: 'April 10, 2026',
    readTime: '4 min',
  },
  {
    id: '5',
    title: 'How to Train Your Puppy: A Beginner\'s Guide',
    excerpt: 'Training a puppy requires patience and consistency. Follow this step-by-step guide to raise a well-behaved pup.',
    coverImage: 'https://images.unsplash.com/photo-1587463277881-de038e8f5aa6?q=80&w=800&auto=format&fit=crop',
    category: 'Training',
    author: 'Rahul Mehta',
    date: 'April 5, 2026',
    readTime: '8 min',
  },
  {
    id: '6',
    title: 'DIY Pet Toys: Fun Projects for You and Your Pet',
    excerpt: 'Save money and bond with your pet by making these simple, safe, and fun DIY toys at home.',
    coverImage: 'https://images.unsplash.com/photo-1535294435445-d7249524ef2e?q=80&w=800&auto=format&fit=crop',
    category: 'DIY',
    author: 'Ananya Kulkarni',
    date: 'March 30, 2026',
    readTime: '5 min',
  },
];

export default function BlogPage() {
  return (
    <div className="blog-page container">
      <div className="blog-header">
        <h1 className="section-title">Pet Care Blog</h1>
        <p className="section-subtitle">Expert tips, guides, and stories for pet lovers</p>
      </div>

      {/* Featured Post */}
      <div className="blog-featured">
        <div className="blog-featured-image">
          <img src={blogPosts[0].coverImage} alt={blogPosts[0].title} />
          <span className="blog-category-badge">{blogPosts[0].category}</span>
        </div>
        <div className="blog-featured-content">
          <div className="blog-meta">
            <span>{blogPosts[0].author}</span>
            <span>•</span>
            <span>{blogPosts[0].date}</span>
            <span>•</span>
            <span>{blogPosts[0].readTime} read</span>
          </div>
          <h2>{blogPosts[0].title}</h2>
          <p>{blogPosts[0].excerpt}</p>
          <Link href={`/blog/${blogPosts[0].id}`} className="btn btn-primary">Read More →</Link>
        </div>
      </div>

      {/* Blog Grid */}
      <div className="blog-grid">
        {blogPosts.slice(1).map(post => (
          <article key={post.id} className="blog-card">
            <div className="blog-card-image">
              <img src={post.coverImage} alt={post.title} />
              <span className="blog-category-badge">{post.category}</span>
            </div>
            <div className="blog-card-content">
              <div className="blog-meta">
                <span>{post.date}</span>
                <span>•</span>
                <span>{post.readTime} read</span>
              </div>
              <h3>{post.title}</h3>
              <p>{post.excerpt}</p>
              <Link href={`/blog/${post.id}`} className="blog-read-more">Read More →</Link>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
