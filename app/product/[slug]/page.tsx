import { notFound } from 'next/navigation';
import ProductDetail from '@/components/product/ProductDetail';

// Mock function – replace with actual DB query
async function getProduct(slug: string) {
  // Simulate a product lookup
  const products = [
    {
      id: '1',
      name: 'B-first — Junior',
      slug: 'b-first-junior',
      category: '10 – 14 Years',
      description:
        'Comfortable and durable sneakers for growing feet. Perfect for school and play.',
      price: 2799,
      discount: 20,
      images: ['/images/product1.jpg', '/images/product1-2.jpg'],
      sizes: ['EU 36', 'EU 37', 'EU 38', 'EU 39'],
      colors: ['White', 'Black', 'Blue'],
      inStock: true,
    },
    // ... other products
  ];

  const product = products[0];
  return product || null;
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await getProduct(slug);

  if (!product) {
    notFound();
  }

  return <ProductDetail product={product} />;
}