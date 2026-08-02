import Head from 'next/head';
import Header from '../components/Header';
import Navbar from '../components/Navbar';
import SearchBar from '../components/SearchBar';
import ProductGrid from '../components/ProductGrid';

export const dynamic = 'force-dynamic';

async function getProducts() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/items`);
  const {data} = await res.json();
  return data;
}

export default async function Home() {
  const products = await getProducts();

  return (
    <>
      <Head>
        <title>Executive Super Store</title>
        <meta name="description" content="Executive Super Store e-commerce site" />
      </Head>
      <Header />
      <Navbar />
      <main className="container">
        {/* <HeroBanner /> */}
        <SearchBar />
        <ProductGrid products={products} header={"Products"}/>
      </main>
    </>
  );
}