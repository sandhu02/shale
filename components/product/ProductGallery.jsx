'use client';

import { useState } from 'react';
import Image from 'next/image';
import { FaImage } from 'react-icons/fa';
import styles from './ProductGallery.module.css';

export default function ProductGallery({ images = [], productName }) {
  const [selected, setSelected] = useState(0);

  const validImages = images && images.length > 0 ? images : ['/placeholder.jpg'];
  const currentImage = validImages[selected] || validImages[0];

  return (
    <div className={styles.gallery}>
      <div className={styles.main}>
        {currentImage === '/placeholder.jpg' ? (
          <div className={styles.placeholder}>
            <FaImage className={styles.placeholderIcon} />
          </div>
        ) : (
          <div className={styles.imageContainer}>
            <Image
              src={currentImage}
              alt={productName}
              fill
              priority
              sizes="(max-width: 900px) 100vw, 50vw"
              className={styles.mainImage}
            />
          </div>
        )}
      </div>

      {validImages.length > 1 && (
        <div className={styles.thumbnails}>
          {validImages.map((img, idx) => (
            <button
              key={idx}
              type="button"
              className={`${styles.thumb} ${idx === selected ? styles.active : ''}`}
              onClick={() => setSelected(idx)}
              aria-label={`View image ${idx + 1} of ${validImages.length}`}
            >
              <div className={styles.thumbImageContainer}>
                <Image
                  src={img}
                  alt={`Thumbnail ${idx + 1}`}
                  fill
                  sizes="80px"
                  className={styles.thumbImage}
                />
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
