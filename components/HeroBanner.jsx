import styles from './HeroBanner.module.css';

export default function HeroBanner() {
  return (
    <section className={styles.banner}>
      <div className={styles.content}>
        <div className={styles.tagline}>Seasonal Sale</div>
        <h2 className={styles.heading}>
          Executive Footwear <span>Collection</span>
        </h2>
        <p className={styles.subtext}>
          Handcrafted quality, everyday comfort. Free delivery on orders nationwide.
        </p>
      </div>
      <div className={styles.badgeWrap}>
        <div className={styles.tag}>UP TO 20% OFF</div>
      </div>
    </section>
  );
}
