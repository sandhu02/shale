import styles from './ProductGrid.module.css';
import ProductCard from './product/ProductCard';


export default function ProductGrid(
  {products, header}
) {
  return (
    <section className={styles.section}>
      <div className={styles.header}>
        <h3><span>{header}</span></h3>
        <a href="#" className={styles.viewAll}>View All →</a>
      </div>
      <div className={styles.grid}>
        {products.map((product) => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>
    </section>
  );
}