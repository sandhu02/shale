'use client';

import { useState } from 'react';
import styles from './ProductDetail.module.css';
import ProductGallery from './ProductGallery';
import AddToCart from './AddToCart';

export default function ProductDetail({ product }) {

  const [productConfig, setProductConfig] = useState({
    _id: product._id,
    name: product.name,
    category: product.category,
    price: product.price,
    discount: product.discount || 0,
    discountedPrice: product.discount ? product.price - (product.price * product.discount) / 100 : product.price,
    size: product.sizes?.[0] || null,
    color: product.colors?.[0] || null,
    images: product.images || [],
    inStock: product.inStock,
  });

  const { 
    name, 
    category, 
    description, 
    price, 
    discount = 0, 
    images, 
    sizes, 
    colors, 
    inStock 
  } = product;

  const discountedPrice = discount ? price - (price * discount) / 100 : price;
  
  // Handle size selection
  const handleSizeSelect = (size) => {
    setProductConfig(prev => ({
      ...prev,
      size
    }));
  };

  // Handle color selection
  const handleColorSelect = (color) => {
    setProductConfig(prev => ({
      ...prev,
      color
    }));
  };

  
  return (
    <div className={`container ${styles.detail}`}>
      {/* Breadcrumb */}
      <nav className={styles.breadcrumb}>
        <a href="/">Home</a> / <a href="/categories/all">Products</a> / <span>{name}</span>
      </nav>

      <div className={styles.grid}>
        {/* Gallery */}
        <div className={styles.gallery}>
          <ProductGallery images={images} productName={name} />
        </div>

        {/* Info */}
        <div className={styles.info}>
          <h1 className={styles.name}>{name}</h1>
          <p className={styles.category}>{category}</p>

          <div className={styles.pricing}>
            <span className={styles.current}>Rs.{discountedPrice}</span>
            {discount > 0 && (
              <>
                <span className={styles.original}>Rs.{price}</span>
                <span className={styles.discount}>-{discount}%</span>
              </>
            )}
          </div>

          <div className={styles.description}>
            <h3>Description</h3>
            <p>{description}</p>
          </div>

          <div className={styles.options}>
            {sizes && (
              <div className={styles.optionGroup}>
                <label>Size</label>
                <div className={styles.sizeOptions}>
                  {sizes.map((size) => (
                    <button key={size} className={styles.sizeBtn} onClick={() => handleSizeSelect(size)}>
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}
            {colors && (
              <div className={styles.optionGroup}>
                <label>Color</label>
                <div className={styles.colorOptions}>
                  {colors.map((color) => (
                    <button
                      key={color}
                      className={styles.colorBtn}
                      style={{ backgroundColor: color.toLowerCase() }}
                      title={color}
                      onClick={() => handleColorSelect(color)}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>

          <AddToCart product={productConfig} />
        </div>
      </div>
    </div>
  );
}