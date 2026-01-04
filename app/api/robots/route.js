export const GET = async () => {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

  const content = `
User-agent: *
Allow: /
Disallow: /admin/
Disallow: /api/

Sitemap: ${baseUrl}/sitemap.xml
`;

  return new Response(content, {
    headers: {
      "Content-Type": "text/plain",
    },
  });
};