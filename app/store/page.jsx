'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import styles from './store.module.css';

export default function StorePage() {
  const [parts, setParts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();
  const searchParams = useSearchParams();

  const filterType = searchParams.get('filterType') || 'name';
  const filter = searchParams.get('filter') || '';

  const addToCart = async (partsId) => {
    try {
      const response = await fetch(`/api/cart/add/${partsId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to add to cart');
      }
      
      const data = await response.json();
      alert(data.message || 'Товар добавлен в корзину!');
    } catch (error) {
      console.error("Ошибка добавления в корзину:", error);
      alert(`Ошибка: ${error.message}`);
    }
  };

  const deletePart = async (partsId) => {
    if (!confirm('Вы уверены, что хотите удалить эту запчасть?')) return;
    
    try {
      const response = await fetch(`/api/parts/${partsId}`, {
        method: 'DELETE'
      });
      
      if (!response.ok) throw new Error('Failed to delete part');
      
      fetchParts();
      alert('Запчасть успешно удалена!');
    } catch (error) {
      console.error("Ошибка удаления:", error);
      alert('Ошибка при удалении запчасти');
    }
  };

  const fetchParts = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const url = `/api/parts?filterType=${encodeURIComponent(filterType)}&filter=${encodeURIComponent(filter)}`;
      const res = await fetch(url);
      
      if (!res.ok) throw new Error(`Ошибка загрузки: ${res.status}`);
      
      setParts(await res.json());
    } catch (error) {
      console.error("Ошибка загрузки:", error);
      setError(error.message);
      setParts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchParts();
  }, [filterType, filter]);

  const handleFilterSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const newFilterType = formData.get('filterType');
    const newFilter = formData.get('filter');
    
    router.push(`/store?filterType=${newFilterType}&filter=${newFilter}`);
  };

  if (loading) return <div className={styles.loading}>Загрузка...</div>;
  if (error) return (
    <div className={styles.error}>
      <p>Ошибка: {error}</p>
      <button className={styles.btn} onClick={fetchParts}>Попробовать снова</button>
    </div>
  );

  return (
    <div className={styles.storeContainer}>
      <h1>Магазин Автозапчастей</h1>
      
      <div className={styles.actionsmain}>
        <Link href="/create" className={styles.btn}>Добавить запчасть</Link>
        <Link href="/cart" className={styles.btn}>Корзина</Link>
        <Link href="/" className={styles.btn}>На главную</Link>
      </div>

      <form onSubmit={handleFilterSubmit} className={styles.filterForm}>
        <div className={styles.formGroup}>
          <label htmlFor="filterType">Сортировка:</label>
          <select name="filterType" defaultValue={filterType}>
            <option value="name">По названию</option>
            <option value="price">По цене</option>
          </select>
        </div>
        
        <div className={styles.formGroup}>
          <input 
            type="text" 
            name="filter" 
            placeholder="Фильтр..." 
            defaultValue={filter}
          />
        </div>
        
        <button type="submit" className={styles.btn}>Применить</button>
      </form>

      {parts.length === 0 && !loading ? (
        <div className={styles.empty}>Запчасти не найдены</div>
      ) : (
        <table className={styles.partsTable}>
          <thead>
            <tr>
              <th>Название</th>
              <th>Цена</th>
              <th>Количество</th>
              <th>Действия</th>
            </tr>
          </thead>
          <tbody>
            {parts.map((part) => (
              <tr key={part.partsId}>
                <td>{part.name}</td>
                <td>{part.price} ₽</td>
                <td>{part.count}</td>
                <td className={styles.actions}>
                  <Link href={`/edit/${part.partsId}`} className={`${styles.btn} ${styles.editBtn}`}>
                    Редактировать
                  </Link>
                  <button 
                    onClick={() => deletePart(part.partsId)}
                    className={`${styles.btn} ${styles.dangerBtn}`}
                  >
                    Удалить
                  </button>
                  <button 
                    onClick={() => addToCart(part.partsId)}
                    className={`${styles.btn} ${styles.primaryBtn}`}
                  >
                    В корзину
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}