"use client"
import { Inter } from '@next/font/google'
import styles from './page.module.css'
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';


const inter = Inter({ subsets: ['latin'] })

export default function Home() {

  const router = useRouter();

  useEffect(() => {
    // Redirect the user to '/ideas' after the component has mounted
    router.push('/ideas');
  }, []); // The empty dependency array ensures that this effect runs only once after the component mounts


  return (
    <main className={styles.main}>
      <div className={styles.description}>

      </div>
    </main>
  )
}
