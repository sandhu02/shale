'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import styles from './page.module.css';

interface Category {
  _id: string;
  name: string;
}

export default function AddItem() {
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(true);

  const [form, setForm] = useState({
    name: '',
    category: '',
    description: '',
    price: '',
    discount: 0,
    sizes: '',
    colors: '',
    inStock: true,
    stock: 0,
  });
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Fetch categories on mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch('/api/categories');
        if (!res.ok) throw new Error('Failed to fetch categories');
        const data = await res.json();
        setCategories(data.data || []);
      } catch (err: any) {
        console.error(err);
        setError('Could not load categories');
      } finally {
        setLoadingCategories(false);
      }
    };
    fetchCategories();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]:
        type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const fileArray = Array.from(files);
      setSelectedFiles(fileArray);

      // Generate preview URLs (clean up old ones)
      const previews = fileArray.map((file) => URL.createObjectURL(file));
      setImagePreviews(previews);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const formData = new FormData();

      // Append basic fields
      formData.append('name', form.name);
      formData.append('category', form.category);
      formData.append('description', form.description);
      formData.append('price', form.price);
      formData.append('discount', String(form.discount || 0));
      formData.append('sizes', form.sizes);
      formData.append('colors', form.colors);
      formData.append('inStock', String(form.inStock));
      formData.append('stock', String(form.stock || 0));

      // Append images (multiple)
      selectedFiles.forEach((file) => {
        formData.append('images', file);
      });

      const res = await fetch('/api/items', {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to create item');
      }

      router.push('/admin/items');
      router.refresh();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Clean up preview URLs when component unmounts
  useEffect(() => {
    return () => {
      imagePreviews.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [imagePreviews]);

  return (
    <div className={styles.container}>
      <h1>Add New Item</h1>
      {error && <p className={styles.error}>{error}</p>}
      <form onSubmit={handleSubmit} className={styles.form}>
        {/* Name */}
        <div className={styles.field}>
          <label htmlFor="name">Name *</label>
          <input
            id="name"
            name="name"
            value={form.name}
            onChange={handleChange}
            required
          />
        </div>

        {/* Category Dropdown */}
        <div className={styles.field}>
          <label htmlFor="category">Category *</label>
          <select
            id="category"
            name="category"
            value={form.category}
            onChange={handleChange}
            required
            disabled={loadingCategories}
          >
            <option value="">Select a category</option>
            {categories.map((cat) => (
              <option key={cat._id} value={cat.name}>
                {cat.name}
              </option>
            ))}
          </select>
          {loadingCategories && <span>Loading categories...</span>}
        </div>

        {/* Description */}
        <div className={styles.field}>
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            name="description"
            value={form.description}
            onChange={handleChange}
            rows={3}
          />
        </div>

        {/* Price & Discount */}
        <div className={styles.fieldRow}>
          <div className={styles.field}>
            <label htmlFor="price">Price (Rs.) *</label>
            <input
              id="price"
              name="price"
              type="number"
              step="1"
              value={form.price}
              onChange={handleChange}
              required
            />
          </div>
          <div className={styles.field}>
            <label htmlFor="discount">Discount (%)</label>
            <input
              id="discount"
              name="discount"
              type="number"
              step="1"
              min="0"
              max="100"
              value={form.discount}
              onChange={handleChange}
            />
          </div>
        </div>

        {/* Sizes & Colors */}
        <div className={styles.field}>
          <label htmlFor="sizes">Sizes (comma separated)</label>
          <input
            id="sizes"
            name="sizes"
            value={form.sizes}
            onChange={handleChange}
            placeholder="EU 36, EU 37, EU 38"
          />
        </div>
        <div className={styles.field}>
          <label htmlFor="colors">Colors (comma separated)</label>
          <input
            id="colors"
            name="colors"
            value={form.colors}
            onChange={handleChange}
            placeholder="White, Black, Blue"
          />
        </div>

        {/* Image File Input with Preview */}
        <div className={styles.field}>
          <label htmlFor="images">Images (select multiple)</label>
          <input
            id="images"
            name="images"
            type="file"
            accept="image/*"
            multiple
            onChange={handleFileChange}
          />
          {imagePreviews.length > 0 && (
            <div className={styles.previewContainer}>
              {imagePreviews.map((url, idx) => (
                <img
                  key={idx}
                  src={url}
                  alt={`Preview ${idx + 1}`}
                  className={styles.previewImage}
                  width={80}
                  height={80}
                />
              ))}
            </div>
          )}
        </div>

        {/* Stock Input */}
        <div className={styles.field}>
          <label htmlFor="stock">Stock</label>
          <input
            id="stock"
            name="stock"
            type="number"
            step="1"
            min="0"
            value={form.stock}
            onChange={handleChange}
          />
        </div>

        {/* In Stock Checkbox */}
        <div className={styles.fieldCheckbox}>
          <label>
            <input
              type="checkbox"
              name="inStock"
              checked={form.inStock}
              onChange={handleChange}
            />
            In Stock
          </label>
        </div>

        {/* Actions */}
        <div className={styles.actions}>
          <button type="submit" className={styles.submitBtn} disabled={loading}>
            {loading ? 'Creating...' : 'Create Item'}
          </button>
          <Link href="/admin/items" className={styles.cancelBtn}>
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}