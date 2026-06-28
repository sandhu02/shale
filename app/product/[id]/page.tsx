import { notFound } from 'next/navigation';
import ProductDetail from '@/components/product/ProductDetail';

async function getProduct(id: string) {
  
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/items/${id}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });



  const { data } = await res.json();
  return data;
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const product = await getProduct(id);

  if (!product) {
    notFound();
  }

  return <ProductDetail product={product} />;
}