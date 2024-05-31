"use client"
import styles from './page.module.css'
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function Home() {

  const router = useRouter();

  useEffect(() => {
    // Redirect the user to '/ideas' after the component has mounted
    router.push('/words');
  }, []); // The empty dependency array ensures that this effect runs only once after the component mounts


  return (
    <main className={styles.main}>
      <div className={styles.description}>
      </div>
    </main>
  )
}
