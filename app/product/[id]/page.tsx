import { notFound } from 'next/navigation';
import ProductDetail from '@/components/product/ProductDetail';

async function getProduct(id: string) {
  
  const product = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/items/${id}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  return product || null;
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const response = await getProduct(id);

  if (!response) {
    notFound();
  }

  const product = await response.json();

  return <ProductDetail product={product} />;
}