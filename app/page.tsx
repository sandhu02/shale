import type { Metadata } from 'next';
import Header from '@/components/Header';
import Navbar from '@/components/Navbar';
import HeroBanner from '@/components/HeroBanner';
import StoreProductSection from '@/components/StoreProductSection';
import Footer from '@/components/Footer';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Executive Super Store — Premium Shoes & Accessories',
  description: 'Official Executive Super Store. Discover top quality shoes, bags, and fashion accessories.',
};

async function getProducts() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/items`, {
      cache: 'no-store',
    });
    if (!res.ok) return [];
    const { data } = await res.json();
    return data || [];
  } catch (error) {
    console.error('Failed to fetch products:', error);
    return [];
  }
}

export default async function Home() {
  const products = await getProducts();

  return (
    <>
      <Header />
      <Navbar />
      <main className="container" style={{ minHeight: '60vh', paddingBottom: '32px' }}>
        <HeroBanner />
        <StoreProductSection initialProducts={products} title="Featured Products" />
      </main>
      <Footer />
    </>
  );
}
