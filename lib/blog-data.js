import fs from 'fs/promises';
import path from 'path';

const dataFilePath = path.join(process.cwd(), 'data', 'blog-posts.json');

// Default blog posts for initial data
const defaultPosts = [
  {
    id: '1',
    slug: 'getting-started-with-nextjs',
    title: 'Getting Started with Next.js 14',
    author: 'John Doe',
    excerpt: 'Learn how to build modern web applications with Next.js 14 and its new features.',
    content: `
      <h2>Introduction to Next.js 14</h2>
      <p>Next.js 14 brings exciting new features that make building React applications faster and more efficient.</p>
      
      <h3>Key Features</h3>
      <ul>
        <li>Server Components by default</li>
        <li>Improved performance</li>
        <li>Better developer experience</li>
        <li>Enhanced TypeScript support</li>
      </ul>
      
      <h3>Getting Started</h3>
      <p>To create a new Next.js 14 project, run:</p>
      <pre><code>npx create-next-app@latest</code></pre>
      
      <p>This will set up a new project with all the latest features configured.</p>
    `,
    tags: ['Next.js', 'React', 'Web Development'],
    image: null,
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-15T10:00:00Z',
  },
  {
    id: '2',
    slug: 'tailwind-css-best-practices',
    title: 'Tailwind CSS Best Practices for 2024',
    author: 'Jane Smith',
    excerpt: 'Discover the best practices for using Tailwind CSS in your projects.',
    content: `
      <h2>Mastering Tailwind CSS</h2>
      <p>Tailwind CSS has revolutionized how we write CSS. Here are some best practices:</p>
      
      <h3>1. Use @apply Sparingly</h3>
      <p>While @apply can be useful, overusing it defeats the purpose of utility-first CSS.</p>
      
      <h3>2. Custom Configuration</h3>
      <p>Extend the default theme rather than replacing it completely.</p>
      
      <h3>3. Responsive Design</h3>
      <p>Use Tailwind's responsive prefixes effectively for mobile-first design.</p>
    `,
    tags: ['Tailwind', 'CSS', 'Frontend'],
    image: null,
    createdAt: '2024-01-10T14:30:00Z',
    updatedAt: '2024-01-10T14:30:00Z',
  },
  {
    id: '3',
    slug: 'react-query-tutorial',
    title: 'Complete Guide to React Query',
    author: 'Alex Johnson',
    excerpt: 'Learn how to manage server state effectively with React Query.',
    content: `
      <h2>Why React Query?</h2>
      <p>React Query simplifies data fetching, caching, and synchronization in React applications.</p>
      
      <h3>Key Concepts</h3>
      <ul>
        <li>Queries for fetching data</li>
        <li>Mutations for updating data</li>
        <li>Query invalidation</li>
        <li>Optimistic updates</li>
      </ul>
      
      <h3>Basic Usage</h3>
      <p>Here's a simple example of using useQuery:</p>
      <pre><code>const { data, isLoading, error } = useQuery({
  queryKey: ['todos'],
  queryFn: fetchTodos
});</code></pre>
    `,
    tags: ['React', 'React Query', 'State Management'],
    image: null,
    createdAt: '2024-01-05T09:15:00Z',
    updatedAt: '2024-01-05T09:15:00Z',
  },
];

async function initializeDataFile() {
  try {
    await fs.mkdir(path.dirname(dataFilePath), { recursive: true });
    await fs.writeFile(dataFilePath, JSON.stringify(defaultPosts, null, 2));
  } catch (error) {
    console.error('Error initializing data file:', error);
  }
}

export async function getBlogPosts() {
  try {
    await initializeDataFile();
    const data = await fs.readFile(dataFilePath, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading blog posts:', error);
    return defaultPosts;
  }
}

export async function getBlogPost(slug) {
  const posts = await getBlogPosts();
  const post = posts.find(post => post.slug === slug);
  
  if (!post) {
    // Return a default post if not found
    return {
      id: 'not-found',
      slug,
      title: 'Post Not Found',
      author: 'Admin',
      excerpt: 'The requested blog post could not be found.',
      content: '<p>Sorry, the blog post you are looking for does not exist.</p>',
      tags: ['404'],
      image: null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
  }
  
  return post;
}