// app/category/[category]/layout.js
export async function generateMetadata({ params }) {
  return {
    title: `${params.category} products | TomartBD`,
    description: `Buy best ${params.category} products at best price`,
  };
}