import type { Metadata } from 'next';
import Header from '@/components/Header';
import Navbar from '@/components/Navbar';
import StoreProductSection from '@/components/StoreProductSection';
import Footer from '@/components/Footer';

export const dynamic = 'force-dynamic';

type Props = {
  params: Promise<{ cat: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { cat } = await params;
  const decodedCategory = decodeURIComponent(cat);
  return {
    title: `${decodedCategory} — Executive Super Store`,
    description: `Shop the finest collection of ${decodedCategory} at Executive Super Store.`,
  };
}

async function getProductsWithCategory(cat: string) {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/items/category/${encodeURIComponent(cat)}`,
      { cache: 'no-store' }
    );
    if (!res.ok) return [];
    const { data } = await res.json();
    return data || [];
  } catch (error) {
    console.error('Failed to fetch category products:', error);
    return [];
  }
}

export default async function CategoryProduct({ params }: Props) {
  const { cat } = await params;
  const decodedCategory = decodeURIComponent(cat);
  const products = await getProductsWithCategory(cat);

  return (
    <>
      <Header />
      <Navbar />
      <main className="container" style={{ minHeight: '60vh', paddingBottom: '32px' }}>
        <StoreProductSection initialProducts={products} title={decodedCategory} />
      </main>
      <Footer />
    </>
  );
}
