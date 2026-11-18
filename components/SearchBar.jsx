'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import styles from './SearchBar.module.css';
import { FaSearch, FaTimes } from 'react-icons/fa';

export default function SearchBar({
  value: controlledValue,
  onChange,
  onSearch,
  placeholder = 'Search for shoes, bags, accessories…',
  className = '',
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const urlQuery = searchParams?.get('q') || '';

  const [internalQuery, setInternalQuery] = useState(urlQuery);

  const isControlled = controlledValue !== undefined;
  const query = isControlled ? controlledValue : internalQuery;

  const handleChange = (e) => {
    const val = e.target.value;
    if (!isControlled) {
      setInternalQuery(val);
    }
    if (onChange) {
      onChange(val);
    }
  };

  const handleClear = () => {
    if (!isControlled) {
      setInternalQuery('');
    }
    if (onChange) {
      onChange('');
    }
    if (onSearch) {
      onSearch('');
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmed = query.trim();

    if (onSearch) {
      onSearch(trimmed);
      return;
    }

    if (onChange) {
      onChange(trimmed);
      return;
    }

    // Default behavior: navigate to search on home page
    if (trimmed) {
      router.push(`/?q=${encodeURIComponent(trimmed)}`);
    } else {
      router.push('/');
    }
  };

  return (
    <section className={`${styles.section} ${className}`}>
      <form className={styles.wrapper} onSubmit={handleSubmit} role="search">
        <FaSearch className={styles.icon} aria-hidden="true" />
        <input
          type="text"
          placeholder={placeholder}
          value={query}
          onChange={handleChange}
          aria-label="Search products"
          className={styles.input}
        />
        {query ? (
          <button
            type="button"
            className={styles.clearBtn}
            onClick={handleClear}
            aria-label="Clear search query"
            title="Clear search"
          >
            <FaTimes />
          </button>
        ) : null}
        <button type="submit" className={styles.searchBtn} aria-label="Submit search">
          Search
        </button>
      </form>
    </section>
  );
}
