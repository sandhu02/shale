'use client';

import { useState } from 'react';
import styles from './ProductGallery.module.css';

export default function ProductGallery({ images, productName }) {
  const [selected, setSelected] = useState(0);
  const mainImage = images?.[selected] || '/placeholder.jpg';

  return (
    <div className={styles.gallery}>
      <div className={styles.main}>
        <img src={mainImage} alt={productName} />
      </div>
      {images && images.length > 1 && (
        <div className={styles.thumbnails}>
          {images.map((img, idx) => (
            <button
              key={idx}
              className={`${styles.thumb} ${idx === selected ? styles.active : ''}`}
              onClick={() => setSelected(idx)}
            >
              <img src={img} alt={`Thumb ${idx + 1}`} />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}