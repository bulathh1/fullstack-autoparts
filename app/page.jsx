import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';
import styles from './info.module.css'; 

export default function HomePage() {
  return (
    <>
      <Head>
        <title>Добро пожаловать</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta charset="UTF-8" />
      </Head>

      <div className={styles.container}>
        <h1 className={styles.title}>Добро пожаловать в магазин автозапчастей</h1>
        
        <ul className={styles.menu}>
          <li>
            <Link href="/About">О приложении</Link>
          </li>
          <li>
            <Link href="/store">Список автозапчастей</Link>
          </li>
          <li>
            <Link href="/history">История покупок</Link>
          </li>
        </ul>

        <div className={styles.imageContainer}>
          <Image
            src="/images/mainimage.jpg"
            alt="Пример изображения"
            width={800}
            height={450}
            priority
            className={styles.image}
          />
        </div>
      </div>
    </>
  );
}