'use client';

import { useState } from 'react';
import Link from 'next/link';
import styles from './ProductDetail.module.css';
import ProductGallery from './ProductGallery';
import AddToCart from './AddToCart';
import { FaCheck } from 'react-icons/fa';

export default function ProductDetail({ product }) {
  const {
    _id,
    name,
    category,
    description,
    price,
    discount = 0,
    images = [],
    sizes = [],
    colors = [],
    inStock = true,
    stock = 0,
  } = product;

  const categoryName =
    typeof category === 'object' && category !== null
      ? category.name || 'Products'
      : category || 'Products';

  const numDiscount = Number(discount) || 0;
  const discountedPrice = numDiscount > 0
    ? Math.floor(price - (price * numDiscount) / 100)
    : price;

  const [selectedSize, setSelectedSize] = useState(sizes?.[0] || null);
  const [selectedColor, setSelectedColor] = useState(colors?.[0] || null);

  const productConfig = {
    _id,
    name,
    category: categoryName,
    price,
    discount: numDiscount,
    discountedPrice,
    size: selectedSize,
    color: selectedColor,
    images,
    inStock,
    stock,
  };

  const isAvailable = inStock && (stock === undefined || stock > 0);

  return (
    <div className={`container ${styles.detail}`}>
      {/* Breadcrumb */}
      <nav className={styles.breadcrumb} aria-label="Breadcrumb">
        <Link href="/">Home</Link>
        <span className={styles.sep}>/</span>
        <Link href={`/categories/${encodeURIComponent(categoryName)}`}>
          {categoryName}
        </Link>
        <span className={styles.sep}>/</span>
        <span className={styles.currentCrumb}>{name}</span>
      </nav>

      <div className={styles.grid}>
        {/* Gallery */}
        <div className={styles.gallery}>
          <ProductGallery images={images} productName={name} />
        </div>

        {/* Info */}
        <div className={styles.info}>
          <div className={styles.categoryBadge}>{categoryName}</div>
          <h1 className={styles.name}>{name}</h1>

          <div className={styles.stockStatus}>
            {isAvailable ? (
              <span className={styles.inStockBadge}>
                ● In Stock {stock > 0 && stock <= 5 ? `(Only ${stock} left!)` : ''}
              </span>
            ) : (
              <span className={styles.outOfStockBadge}>● Out of Stock</span>
            )}
          </div>

          <div className={styles.pricing}>
            <span className={styles.current}>
              Rs. {discountedPrice.toLocaleString()}
            </span>
            {numDiscount > 0 && (
              <>
                <span className={styles.original}>
                  Rs. {price.toLocaleString()}
                </span>
                <span className={styles.discount}>-{numDiscount}% OFF</span>
              </>
            )}
          </div>

          {/* Sizes */}
          {sizes && sizes.length > 0 && (
            <div className={styles.optionGroup}>
              <div className={styles.optionLabelRow}>
                <label className={styles.optionLabel}>Select Size:</label>
                {selectedSize && (
                  <span className={styles.selectedOptionText}>{selectedSize}</span>
                )}
              </div>
              <div className={styles.sizeOptions}>
                {sizes.map((size) => {
                  const isSelected = selectedSize === size;
                  return (
                    <button
                      key={size}
                      type="button"
                      className={`${styles.sizeBtn} ${isSelected ? styles.sizeSelected : ''}`}
                      onClick={() => setSelectedSize(size)}
                    >
                      {size}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Colors */}
          {colors && colors.length > 0 && (
            <div className={styles.optionGroup}>
              <div className={styles.optionLabelRow}>
                <label className={styles.optionLabel}>Select Color:</label>
                {selectedColor && (
                  <span className={styles.selectedOptionText}>{selectedColor}</span>
                )}
              </div>
              <div className={styles.colorOptions}>
                {colors.map((color) => {
                  const isSelected = selectedColor === color;
                  return (
                    <button
                      key={color}
                      type="button"
                      className={`${styles.colorBtn} ${isSelected ? styles.colorSelected : ''}`}
                      style={{ backgroundColor: color ? color.toLowerCase() : 'transparent' }}
                      title={color}
                      onClick={() => setSelectedColor(color)}
                      aria-label={`Select color ${color}`}
                    >
                      {isSelected && (
                        <FaCheck
                          className={styles.colorCheck}
                          style={{
                            color:
                              color && (color.toLowerCase() === 'white' || color.toLowerCase() === '#fff' || color.toLowerCase() === '#ffffff')
                                ? '#1a1a1a'
                                : '#ffffff',
                          }}
                        />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Description */}
          {description && (
            <div className={styles.description}>
              <h3>Product Description</h3>
              <p>{description}</p>
            </div>
          )}

          {/* Add to Cart Actions */}
          <AddToCart product={productConfig} />
        </div>
      </div>
    </div>
  );
}
