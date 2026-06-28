import Header from "@/components/Header";
import HeroBanner from "@/components/HeroBanner";
import Navbar from "@/components/Navbar";
import ProductGrid from "@/components/ProductGrid";
import SearchBar from "@/components/SearchBar";
import { Head } from "next/document";

export default function AdminHome() {
  return (
    <>
      <Header />
      <Navbar />
      <main className="container">
        <HeroBanner />
        <SearchBar />
        <ProductGrid />
      </main>
    </>
  );
}