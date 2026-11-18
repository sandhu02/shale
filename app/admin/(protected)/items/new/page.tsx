'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { FaArrowLeft, FaCloudUploadAlt, FaExclamationCircle } from 'react-icons/fa';
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
  const [isDragging, setIsDragging] = useState(false);
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
      } catch (err: unknown) {
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
    if (files && files.length > 0) {
      const fileArray = Array.from(files);
      setSelectedFiles((prev) => [...prev, ...fileArray]);

      const previews = fileArray.map((file) => URL.createObjectURL(file));
      setImagePreviews((prev) => [...prev, ...previews]);
    }
    // Reset input value so re-selecting same files triggers change
    e.target.value = '';
  };

  const handleRemoveImage = (indexToRemove: number) => {
    URL.revokeObjectURL(imagePreviews[indexToRemove]);
    setSelectedFiles((prev) => prev.filter((_, idx) => idx !== indexToRemove));
    setImagePreviews((prev) => prev.filter((_, idx) => idx !== indexToRemove));
  };

  const handleDragOver = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      const imageFiles = Array.from(files).filter((file) =>
        file.type.startsWith('image/')
      );
      if (imageFiles.length > 0) {
        setSelectedFiles((prev) => [...prev, ...imageFiles]);
        const previews = imageFiles.map((file) => URL.createObjectURL(file));
        setImagePreviews((prev) => [...prev, ...previews]);
      }
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
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to create item');
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
      <Link href="/admin/items" className={styles.backLink}>
        <FaArrowLeft />
        <span>Back to Items</span>
      </Link>

      <div className={styles.header}>
        <h1>Add New Item</h1>
        <p className={styles.subtitle}>
          Fill in the details below to add a new product to your inventory.
        </p>
      </div>

      {error && (
        <div className={styles.error}>
          <FaExclamationCircle />
          <span>{error}</span>
        </div>
      )}

      <div className={styles.card}>
        <form onSubmit={handleSubmit} className={styles.form}>
          {/* Section: General Information */}
          <div className={styles.section}>
            <span className={styles.sectionTitle}>General Information</span>

            {/* Name */}
            <div className={styles.field}>
              <label htmlFor="name">
                Item Name <span className={styles.required}>*</span>
              </label>
              <input
                id="name"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="e.g. Nike Air Max Pulse"
                required
              />
            </div>

            {/* Category Dropdown */}
            <div className={styles.field}>
              <div className={styles.fieldLabelRow}>
                <label htmlFor="category">
                  Category <span className={styles.required}>*</span>
                </label>
                <Link href="/admin/categories/new" className={styles.labelLink}>
                  + Add New Category
                </Link>
              </div>
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
              {loadingCategories && (
                <span className={styles.loadingHint}>Loading categories...</span>
              )}
            </div>

            {/* Description */}
            <div className={styles.field}>
              <label htmlFor="description">
                Description <span className={styles.optional}>(Optional)</span>
              </label>
              <textarea
                id="description"
                name="description"
                value={form.description}
                onChange={handleChange}
                rows={3}
                placeholder="Write a short description about this product..."
              />
            </div>
          </div>

          {/* Section: Pricing & Inventory */}
          <div className={styles.section}>
            <span className={styles.sectionTitle}>Pricing & Stock</span>

            <div className={styles.fieldRow}>
              {/* Price */}
              <div className={styles.field}>
                <label htmlFor="price">
                  Price (Rs.) <span className={styles.required}>*</span>
                </label>
                <input
                  id="price"
                  name="price"
                  type="number"
                  step="1"
                  min="0"
                  value={form.price}
                  onChange={handleChange}
                  placeholder="0"
                  required
                />
              </div>

              {/* Discount */}
              <div className={styles.field}>
                <label htmlFor="discount">
                  Discount (%) <span className={styles.optional}>(Optional)</span>
                </label>
                <input
                  id="discount"
                  name="discount"
                  type="number"
                  step="1"
                  min="0"
                  max="100"
                  value={form.discount}
                  onChange={handleChange}
                  placeholder="0"
                />
              </div>

              {/* Stock */}
              <div className={styles.field}>
                <label htmlFor="stock">Stock Quantity</label>
                <input
                  id="stock"
                  name="stock"
                  type="number"
                  step="1"
                  min="0"
                  value={form.stock}
                  onChange={handleChange}
                  placeholder="0"
                />
              </div>
            </div>

            {/* In Stock Checkbox Card */}
            <div className={styles.checkboxCard}>
              <label className={styles.checkboxLabel}>
                <input
                  type="checkbox"
                  name="inStock"
                  checked={form.inStock}
                  onChange={handleChange}
                  className={styles.checkboxInput}
                />
                <div className={styles.checkboxInfo}>
                  <span className={styles.checkboxTitle}>Available in Stock</span>
                  <span className={styles.checkboxDesc}>
                    Make this item available for customers to order immediately.
                  </span>
                </div>
              </label>
            </div>
          </div>

          {/* Section: Product Attributes */}
          <div className={styles.section}>
            <span className={styles.sectionTitle}>Attributes</span>

            <div className={styles.fieldRow2}>
              {/* Sizes */}
              <div className={styles.field}>
                <label htmlFor="sizes">
                  Sizes <span className={styles.optional}>(Optional)</span>
                </label>
                <input
                  id="sizes"
                  name="sizes"
                  value={form.sizes}
                  onChange={handleChange}
                  placeholder="e.g. EU 36, EU 37, EU 38"
                />
                <span className={styles.hint}>Separate values with commas</span>
              </div>

              {/* Colors */}
              <div className={styles.field}>
                <label htmlFor="colors">
                  Colors <span className={styles.optional}>(Optional)</span>
                </label>
                <input
                  id="colors"
                  name="colors"
                  value={form.colors}
                  onChange={handleChange}
                  placeholder="e.g. White, Black, Blue"
                />
                <span className={styles.hint}>Separate values with commas</span>
              </div>
            </div>
          </div>

          {/* Section: Images */}
          <div className={styles.section}>
            <span className={styles.sectionTitle}>Product Media</span>

            <div className={styles.field}>
              <label>
                Product Images <span className={styles.optional}>(select multiple)</span>
              </label>

              <label
                htmlFor="images"
                className={`${styles.dropzone} ${isDragging ? styles.dropzoneActive : ''}`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
              >
                <input
                  id="images"
                  name="images"
                  type="file"
                  accept="image/*"
                  multiple
                  className={styles.hiddenFileInput}
                  onChange={handleFileChange}
                />
                <FaCloudUploadAlt className={styles.uploadIcon} />
                <p className={styles.uploadPrimary}>
                  <span>Click to upload</span> or drag and drop
                </p>
                <p className={styles.uploadSecondary}>
                  PNG, JPG, JPEG, WEBP (multiple images allowed)
                </p>
              </label>

              {imagePreviews.length > 0 && (
                <>
                  <div className={styles.previewContainer}>
                    {imagePreviews.map((url, idx) => (
                      <div key={idx} className={styles.imageWrapper}>
                        {/* Using standard img for local blob preview URLs */}
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={url}
                          alt={`Preview ${idx + 1}`}
                          className={styles.previewImage}
                          width={80}
                          height={80}
                        />
                        <button
                          type="button"
                          className={styles.removeImageBtn}
                          onClick={() => handleRemoveImage(idx)}
                          title="Remove image"
                          aria-label="Remove image"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                  <span className={styles.imageCount}>
                    {imagePreviews.length} image{imagePreviews.length > 1 ? 's' : ''} selected
                  </span>
                </>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className={styles.actions}>
            <button type="submit" className={styles.submitBtn} disabled={loading}>
              {loading ? 'Creating Item...' : 'Create Item'}
            </button>
            <Link href="/admin/items" className={styles.cancelBtn}>
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
