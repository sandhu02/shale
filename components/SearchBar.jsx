'use client';

import { useState } from 'react';
import styles from './SearchBar.module.css';
import { FaSearch } from 'react-icons/fa';

export default function SearchBar() {
  const [query, setQuery] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) {
      alert(`🔍 Searching for: "${query}"`);
    } else {
      alert('Please enter a search term.');
    }
  };

  return (
    <section className={styles.section}>
      <form className={styles.wrapper} onSubmit={handleSearch}>
        <FaSearch className={styles.icon} />
        <input
          type="text"
          placeholder="Search for shoes, bags, accessories…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button type="submit">Search</button>
      </form>
    </section>
  );
}