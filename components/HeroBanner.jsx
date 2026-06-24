import styles from './HeroBanner.module.css';

export default function HeroBanner() {
  return (
    <section className={styles.banner}>
      <div className={styles.text}>
        <h2>SNEAKER <span>FEST</span></h2>
        <p>Up to 20% off on selected styles · Limited time</p>
      </div>
      <div className={styles.tag}>-20%</div>
    </section>
  );
}