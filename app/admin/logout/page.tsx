'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import styles from './logout.module.css';

export default function AdminLogout() {
  const router = useRouter();

  useEffect(() => {
    async function logout() {
      try {
        await fetch('/api/auth/logout', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          cache: 'no-store',
        });
        router.push('/admin/login');
      } catch (error) {
        console.error('Logout failed:', error);
      }
    }

    logout();
  }, [router]);

  return (
    <div className={styles.header}>
      <h1>Logging <span>out</span>..<span>.</span></h1>
    </div>
  );
}