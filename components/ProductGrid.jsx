import styles from './ProductGrid.module.css';
import ProductCard from './product/ProductCard';

const products = [
  {
    id: 1,
    name: 'B-first — Junior',
    slug: 'b-first-junior',
    category: '10 – 14 Years',
    currentPrice: '2,239.00',
    originalPrice: '2,799.00',
    discount: '20',
    payPlan: '858',
    emoji: '👟',
  },
  {
    id: 2,
    name: 'B-first — Kids',
    slug: 'b-first-kids',
    category: '5 – 10 Years',
    currentPrice: '1,999.00',
    originalPrice: '2,499.00',
    discount: '20',
    payPlan: '766',
    emoji: '👟',
  },
  {
    id: 3,
    name: 'B-first — Junior',
    slug: 'b-first-junior',
    category: '10 – 14 Years',
    currentPrice: '2,239.00',
    originalPrice: '2,799.00',
    discount: '20',
    payPlan: '858',
    emoji: '👟',
  },
  {
    id: 4,
    name: 'Bata — Boys',
    slug: 'bata-boys',   
    category: 'Sports & Casual',
    currentPrice: '2,799.00',
    originalPrice: '3,499.00',
    discount: '20',
    payPlan: '1,072',
    emoji: '👟',
  },
];

export default function ProductGrid() {
  return (
    <section className={styles.section}>
      <div className={styles.header}>
        <h3>Featured <span>Products</span></h3>
        <a href="#" className={styles.viewAll}>View All →</a>
      </div>
      <div className={styles.grid}>
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}