import fs from 'fs/promises';
import path from 'path';

const dataFilePath = path.join(process.cwd(), 'data', 'blog-posts.json');

async function readData() {
  try {
    const data = await fs.readFile(dataFilePath, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    return [];
  }
}

async function writeData(data) {
  await fs.writeFile(dataFilePath, JSON.stringify(data, null, 2));
}

export async function DELETE(request, { params }) {
  try {
    const posts = await readData();
    const filteredPosts = posts.filter(post => post.id !== params.id);
    
    if (filteredPosts.length === posts.length) {
      return Response.json({ error: 'Post not found' }, { status: 404 });
    }
    
    await writeData(filteredPosts);
    return Response.json({ success: true });
  } catch (error) {
    return Response.json({ error: 'Failed to delete post' }, { status: 500 });
  }
}