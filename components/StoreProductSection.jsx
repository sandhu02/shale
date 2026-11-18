'use client';

import { useState, useMemo, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import SearchBar from './SearchBar';
import ProductGrid from './ProductGrid';

function ProductSearchContent({ initialProducts = [], title = 'Products' }) {
  const searchParams = useSearchParams();
  const urlQuery = searchParams?.get('q') || '';
  const [userQuery, setUserQuery] = useState(urlQuery);

  const searchQuery = userQuery;

  const filteredProducts = useMemo(() => {
    if (!searchQuery.trim()) {
      return initialProducts;
    }
    const q = searchQuery.toLowerCase().trim();
    return initialProducts.filter((product) => {
      const name = product.name?.toLowerCase() || '';
      const cat =
        typeof product.category === 'object' && product.category !== null
          ? product.category.name?.toLowerCase() || ''
          : (product.category || '').toLowerCase();
      const desc = product.description?.toLowerCase() || '';

      return name.includes(q) || cat.includes(q) || desc.includes(q);
    });
  }, [initialProducts, searchQuery]);

  const isSearching = searchQuery.trim().length > 0;
  const headerText = isSearching
    ? `Search Results for "${searchQuery}"`
    : title;

  return (
    <>
      <SearchBar
        value={searchQuery}
        onChange={setUserQuery}
        placeholder="Search for shoes, bags, accessories…"
      />

      <ProductGrid
        products={filteredProducts}
        header={headerText}
        onClearFilter={isSearching ? () => setUserQuery('') : undefined}
      />
    </>
  );
}

export default function StoreProductSection(props) {
  return (
    <Suspense
      fallback={
        <>
          <SearchBar placeholder="Search for shoes, bags, accessories…" />
          <ProductGrid products={props.initialProducts || []} header={props.title || 'Products'} />
        </>
      }
    >
      <ProductSearchContent {...props} />
    </Suspense>
  );
}
