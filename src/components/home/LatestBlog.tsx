import { BlogCard } from '@/components/blog/BlogCard';
import type { BlogPost } from '@/types';

interface LatestBlogProps {
  posts: BlogPost[];
  limit?: number;
}

export function LatestBlog({ posts, limit = 3 }: LatestBlogProps) {
  const latest = [...posts]
    .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
    .slice(0, limit);

  return (
    <div className="grid gap-32 md:grid-cols-3">
      {latest.map((post) => (
        <BlogCard
          key={post.url}
          title={post.title}
          url={post.url}
          publishedAt={post.publishedAt}
          platform={post.platform}
          description={post.description}
          tags={post.tags}
        />
      ))}
    </div>
  );
}
