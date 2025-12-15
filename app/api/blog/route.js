import { v4 as uuidv4 } from 'uuid';
import fs from 'fs/promises';
import path from 'path';

const dataFilePath = path.join(process.cwd(), 'data', 'blog-posts.json');

async function readData() {
  try {
    const data = await fs.readFile(dataFilePath, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    // If file doesn't exist, return empty array
    return [];
  }
}

async function writeData(data) {
  await fs.mkdir(path.dirname(dataFilePath), { recursive: true });
  await fs.writeFile(dataFilePath, JSON.stringify(data, null, 2));
}

export async function GET() {
  try {
    const posts = await readData();
    return Response.json(posts);
  } catch (error) {
    return Response.json({ error: 'Failed to fetch posts' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const posts = await readData();
    
    const newPost = {
      id: uuidv4(),
      slug: body.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
      title: body.title,
      author: body.author,
      excerpt: body.excerpt,
      content: body.content,
      tags: body.tags || [],
      image: body.image || null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    posts.unshift(newPost);
    await writeData(posts);
    
    return Response.json(newPost, { status: 201 });
  } catch (error) {
    return Response.json({ error: 'Failed to create post' }, { status: 500 });
  }
}