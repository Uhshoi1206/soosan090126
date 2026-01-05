import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { getBlogCategories } from '../../utils/blogCategories';

export const prerender = false;

// Helper function to extract slug from post.id (handles nested folders)
function extractSlugFromPostId(postId: string): string {
  const idWithoutExtension = postId.replace(/\.md$/, '');
  return idWithoutExtension.includes('/')
    ? idWithoutExtension.split('/').pop()!
    : idWithoutExtension;
}

export const GET: APIRoute = async ({ url }) => {
  const query = url.searchParams.get('q')?.toLowerCase().trim() || '';

  if (!query) {
    return new Response(JSON.stringify({ results: [] }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  try {
    const [products, blogPosts] = await Promise.all([
      getCollection('products'),
      getCollection('blog')
    ]);
    const { getCategorySlug } = await getBlogCategories();

    const productResults = products
      .filter(product => !product.data.isHidden)
      .filter(product => {
        const name = product.data.name?.toLowerCase() || '';
        const brand = product.data.brand?.toLowerCase() || '';
        const description = product.data.description?.toLowerCase() || '';
        const model = product.data.model?.toLowerCase() || '';

        return name.includes(query) ||
          brand.includes(query) ||
          description.includes(query) ||
          model.includes(query);
      })
      .slice(0, 5)
      .map(product => ({
        id: product.id,
        title: product.data.name,
        type: 'product' as const,
        url: `/${product.data.type}/${product.data.slug || product.slug}`,
        excerpt: product.data.description?.substring(0, 100)
      }));

    const blogResults = blogPosts
      .filter(post => !post.data.isHidden)
      .filter(post => {
        const title = post.data.title?.toLowerCase() || '';
        const description = post.data.description?.toLowerCase() || '';
        const excerpt = post.data.excerpt?.toLowerCase() || '';

        return title.includes(query) ||
          description.includes(query) ||
          excerpt.includes(query);
      })
      .slice(0, 5)
      .map(post => {
        const slug = post.data.slug || extractSlugFromPostId(post.id);
        const categorySlug = getCategorySlug(post.data.category);
        return {
          id: post.id,
          title: post.data.title,
          type: 'blog' as const,
          url: `/danh-muc-bai-viet/${categorySlug}/${slug}`,
          excerpt: post.data.excerpt?.substring(0, 100) || post.data.description?.substring(0, 100)
        };
      });

    const results = [...productResults, ...blogResults]
      .sort((a, b) => {
        const aExactMatch = a.title.toLowerCase() === query;
        const bExactMatch = b.title.toLowerCase() === query;
        if (aExactMatch && !bExactMatch) return -1;
        if (!aExactMatch && bExactMatch) return 1;
        return 0;
      })
      .slice(0, 10);

    return new Response(JSON.stringify({ results }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Search API error:', error);
    return new Response(JSON.stringify({ results: [], error: 'Search failed' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
