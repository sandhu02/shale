import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Header from '@/components/Header';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ProductDetail from '@/components/product/ProductDetail';

type Props = {
  params: Promise<{ id: string }>;
};

async function getProduct(id: string) {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/items/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      cache: 'no-store',
    });

    if (!res.ok) return null;
    const { data } = await res.json();
    return data || null;
  } catch (error) {
    console.error('Failed to fetch product:', error);
    return null;
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const product = await getProduct(id);
  if (!product) {
    return {
      title: 'Product Not Found — Executive Super Store',
    };
  }

  return {
    title: `${product.name} — Executive Super Store`,
    description: product.description || `Buy ${product.name} at Executive Super Store`,
  };
}

export default async function ProductPage({ params }: Props) {
  const { id } = await params;
  const product = await getProduct(id);

  if (!product) {
    notFound();
  }

  return (
    <>
      <Header />
      <Navbar />
      <main style={{ minHeight: '65vh', paddingBottom: '40px' }}>
        <ProductDetail product={product} />
      </main>
      <Footer />
    </>
  );
}
