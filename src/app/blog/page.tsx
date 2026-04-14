import type { Metadata } from 'next';
import { BlogCard } from '@/components/blog/BlogCard';
import { AnimateOnScroll } from '@/components/ui/AnimateOnScroll';
import { blogPosts } from '@/data/blog';

export const metadata: Metadata = {
  title: 'Blog',
  description: '技術記事・執筆活動',
};

export default function BlogPage() {
  return (
    <>
      <section className="mx-auto max-w-[1200px] px-16 py-40 md:px-32" aria-label="ブログ">
        <AnimateOnScroll>
          <h1 className="text-display-hero text-vercel-black">Blog</h1>
          <p className="mt-16 text-body-large text-gray-600">技術記事・執筆活動</p>
        </AnimateOnScroll>
      </section>

      <section className="mx-auto max-w-[1200px] px-16 pb-40 md:px-32" aria-label="記事一覧">
        <div className="grid gap-32 md:grid-cols-2">
          {blogPosts.map((post, index) => (
            <AnimateOnScroll key={post.url} delay={index * 100}>
              <BlogCard
                title={post.title}
                url={post.url}
                publishedAt={post.publishedAt}
                platform={post.platform}
                description={post.description}
                tags={post.tags}
              />
            </AnimateOnScroll>
          ))}
        </div>
      </section>
    </>
  );
}
