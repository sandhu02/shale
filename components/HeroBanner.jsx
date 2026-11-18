import styles from './HeroBanner.module.css';

export default function HeroBanner() {
  return (
    <section className={styles.banner}>
      <div className={styles.content}>
        <div className={styles.tagline}>Executive Collection</div>
        <h2 className={styles.heading}>
          PREMIUM STYLE &amp; <span>COMFORT</span>
        </h2>
        <p className={styles.subtext}>
          Discover the latest arrivals in men&apos;s and ladies&apos; footwear. High quality, best prices.
        </p>
      </div>
      <div className={styles.badgeWrap}>
        <div className={styles.tag}>UP TO 20% OFF</div>
      </div>
    </section>
  );
}
