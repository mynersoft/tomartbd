export const metadata = {
  title: "About Us | Tomartbd - বাংলাদেশি মাল্টি ভেন্ডর মার্কেটপ্লেস",
  description:
    "Tomartbd একটি বাংলাদেশভিত্তিক মাল্টি-ভেন্ডর ই-কমার্স প্ল্যাটফর্ম যেখানে বিক্রেতারা সহজে অনলাইনে ব্যবসা করতে পারেন।",
  keywords: [
    "Tomartbd",
    "Bangladesh marketplace",
    "Multi vendor ecommerce Bangladesh",
    "Online shopping Bangladesh",
    "Vendor marketplace",
  ],
  openGraph: {
    title: "About Us | Tomartbd",
    description:
      "বাংলাদেশের জন্য তৈরি একটি আধুনিক মাল্টি-ভেন্ডর ই-কমার্স প্ল্যাটফর্ম",
    url: "https://tomartbd.com/about",
    siteName: "Tomartbd",
    locale: "bn_BD",
    type: "website",
  },
};

export default function AboutPage() {
  return (
    <section className="max-w-5xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-6">About Us – Tomartbd</h1>

      <p className="mb-4">
        <strong>Tomartbd</strong> একটি বাংলাদেশভিত্তিক আধুনিক মাল্টি-ভেন্ডর
        ই-কমার্স প্ল্যাটফর্ম, যেখানে একাধিক বিক্রেতা তাদের নিজস্ব অনলাইন দোকান
        খুলে পণ্য বিক্রি করতে পারেন এবং ক্রেতারা নিরাপদ ও সহজভাবে কেনাকাটা করতে
        পারেন।
      </p>

      <p className="mb-4">
        আমাদের মূল লক্ষ্য হলো স্থানীয় বিক্রেতা, উদ্যোক্তা ও ছোট ব্যবসায়ীদের
        ডিজিটাল প্ল্যাটফর্মে নিয়ে আসা।
      </p>

      <h2 className="text-2xl font-semibold mt-6 mb-2">আমাদের লক্ষ্য</h2>
      <p className="mb-4">
        বাংলাদেশের বিক্রেতাদের জন্য একটি বিশ্বস্ত, সহজ এবং শক্তিশালী অনলাইন
        মার্কেটপ্লেস তৈরি করা।
      </p>

      <h2 className="text-2xl font-semibold mt-6 mb-2">আমরা যা দিচ্ছি</h2>
      <ul className="list-disc pl-6 mb-4 space-y-1">
        <li>মাল্টি-ভেন্ডর মার্কেটপ্লেস সিস্টেম</li>
        <li>বিভিন্ন ক্যাটাগরির পণ্য</li>
        <li>নিরাপদ অর্ডার ও চেকআউট ব্যবস্থা</li>
        <li>সহজ বিক্রেতা ড্যাশবোর্ড</li>
        <li>মোবাইল ফ্রেন্ডলি ডিজাইন</li>
      </ul>

      <h2 className="text-2xl font-semibold mt-6 mb-2">কেন Tomartbd?</h2>
      <p>
        Tomartbd বাংলাদেশকে কেন্দ্র করে তৈরি একটি প্ল্যাটফর্ম, যেখানে বিক্রেতা
        ও ক্রেতা একসাথে নিরাপদ ও সহজ ই-কমার্স অভিজ্ঞতা পান।
      </p>
    </section>
  );
}