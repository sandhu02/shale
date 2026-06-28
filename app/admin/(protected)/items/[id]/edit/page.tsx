'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import styles from '../../new/page.module.css';

interface Category {
  _id: string;
  name: string;
}

interface ItemData {
  name: string;
  category: string;
  description: string;
  price: number;
  discount: number;
  sizes: string[];
  colors: string[];
  images: string[];
  inStock: boolean;
  stock: number;
}

export default function EditItem() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;

  const [categories, setCategories] = useState<Category[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [existingImages, setExistingImages] = useState<string[]>([]);
  const [imagesToDelete, setImagesToDelete] = useState<string[]>([]);
  
  const [form, setForm] = useState({
    name: '',
    category: '',
    description: '',
    price: '',
    discount: '',
    sizes: '',
    colors: '',
    inStock: true,
    stock: 0,
  });

  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
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

  // Fetch item data
  useEffect(() => {
    async function fetchItem() {
      if (!id) return;
      
      try {
        setLoading(true);
        const res = await fetch(`/api/items/${id}`);
        if (!res.ok) throw new Error('Failed to fetch item');
        const data = await res.json();
        const item = data.data;
        
        setForm({
          name: item.name || '',
          category: item.category?._id || item.category || '',
          description: item.description || '',
          price: item.price?.toString() || '',
          discount: item.discount?.toString() || '',
          sizes: item.sizes?.join(', ') || '',
          colors: item.colors?.join(', ') || '',
          inStock: item.inStock ?? true,
          stock: item.stock || 0,
        });
        
        setExistingImages(item.images || []);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchItem();
  }, [id]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const fileArray = Array.from(files);
      setSelectedFiles(fileArray);
      
      // Generate preview URLs
      const previews = fileArray.map((file) => URL.createObjectURL(file));
      setImagePreviews(previews);
    }
  };

  const handleRemoveExistingImage = (imageUrl: string) => {
    setImagesToDelete((prev) => [...prev, imageUrl]);
    setExistingImages((prev) => prev.filter((img) => img !== imageUrl));
  };

  const handleRemoveNewImage = (index: number) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
    setImagePreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');

    try {
      const formData = new FormData();
      
      // Append all form fields
      formData.append('name', form.name);
      formData.append('category', form.category);
      formData.append('description', form.description);
      formData.append('price', form.price);
      formData.append('discount', form.discount || '0');
      formData.append('sizes', form.sizes);
      formData.append('colors', form.colors);
      formData.append('inStock', String(form.inStock));
      formData.append('stock', String(form.stock || 0));
      
      // Append images to delete
      imagesToDelete.forEach((url) => {
        formData.append('imagesToDelete', url);
      });

      // Append new images
      selectedFiles.forEach((file) => {
        formData.append('images', file);
      });

      const res = await fetch(`/api/items/${id}`, {
        method: 'PUT',
        body: formData,
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to update item');
      }

      router.push('/admin/items');
      router.refresh();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  // Clean up preview URLs
  useEffect(() => {
    return () => {
      imagePreviews.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [imagePreviews]);

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>Loading item data...</div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <h1>Edit Item</h1>
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

        {/* Existing Images */}
        {existingImages.length > 0 && (
          <div className={styles.field}>
            <label>Current Images</label>
            <div className={styles.previewContainer}>
              {existingImages.map((url, idx) => (
                <div key={idx} className={styles.imageWrapper}>
                  <img
                    src={url}
                    alt={`Image ${idx + 1}`}
                    className={styles.previewImage}
                    width={80}
                    height={80}
                  />
                  <button
                    type="button"
                    className={styles.removeImageBtn}
                    onClick={() => handleRemoveExistingImage(url)}
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* New Images */}
        <div className={styles.field}>
          <label htmlFor="images">Add New Images (select multiple)</label>
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
                <div key={idx} className={styles.imageWrapper}>
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
                    onClick={() => handleRemoveNewImage(idx)}
                  >
                    ×
                  </button>
                </div>
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
          <button type="submit" className={styles.submitBtn} disabled={saving}>
            {saving ? 'Updating...' : 'Update Item'}
          </button>
          <Link href="/admin/items" className={styles.cancelBtn}>
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}