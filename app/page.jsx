import HomeClient from "./HomeClient";
import { generateMetadata } from "@/lib/seo";
import  HeroBanner  from "@/components/Home/HeroBanner";

export const metadata = generateMetadata({
  title: "Buy Quality Products Online",
  path: "/",
  keywords: ["best products", "featured products", "best selling products"],
});

export default function HomePage() {
  return (
    <>
      {/* H1 for SEO */}
      <header className="sr-only">
        <h1>Buy Quality Products Online from TomartBD,  Stay connected</h1>
      </header>
<HeroBanner/>

<div className="mt-14"></div>


      <HomeClient />
    </>
  );
}