import Header from '@/components/Header';
import Navbar from '@/components/Navbar';
import ProductGrid from '@/components/ProductGrid';
import SearchBar from '@/components/SearchBar';
import Head from 'next/head';


async function getProductsWithCategory(cat: string) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/items/category/${encodeURIComponent(cat)}`);
  const { data } = await res.json();
  return data;
}

export default async function CategoryProduct(
  { params }: { params: Promise<{ cat: string }> }
) {
  const { cat } = await params;
  const products = await getProductsWithCategory(cat);

  return (
    <>
      <Head>
        <title>Bata - Sneaker Fest</title>
        <meta name="description" content="Bata e-commerce store" />
      </Head>
      <Header />
      <Navbar />
      <main className="container">
        {/* <HeroBanner /> */}
        <SearchBar />
        <ProductGrid products={products} header={cat}/>
      </main>
    </>
  );
}