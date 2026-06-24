import Head from 'next/head';
import Header from '../components/Header';
import Navbar from '../components/Navbar';
import HeroBanner from '../components/HeroBanner';
import SearchBar from '../components/SearchBar';
import ProductGrid from '../components/ProductGrid';

export default function Home() {
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
        <ProductGrid />
      </main>
    </>
  );
}