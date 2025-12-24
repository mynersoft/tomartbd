import ProductSinglePage from './ProductSinglePage';
import { generateMetadata as seo } from '@/lib/seo';

export function generateMetadata({ params }) {
	const slug = params?.slug ?? '';

	return seo({
		title: slug.replace(/-/g, ' '),
		description:
			'Buy original products online in Bangladesh with best price, warranty and fast delivery.',
		keywords: [
			slug.replace(/-/g, ' '),
			'online shopping bd',
			'buy product bangladesh',
			'tomartbd product',
		],
		path: `/products/${slug}`,
		image: '/og-product.png',
	});
}

export default function Page() {
	return <ProductSinglePage />;
}
