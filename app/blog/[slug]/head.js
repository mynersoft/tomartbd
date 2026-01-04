import axios from "axios";

export default async function Head({ params }) {
  const { data } = await axios.get(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/blog/slug/${params.slug}`
  );

  return (
    <>
      <title>{data.title}</title>
      <meta name="description" content={data.content.slice(0, 150)} />
      <meta property="og:title" content={data.title} />
      <meta property="og:description" content={data.content.slice(0, 150)} />
    </>
  );
}