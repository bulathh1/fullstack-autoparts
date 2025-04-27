'use client'; 

import { useEffect, useState } from 'react';
import Link from 'next/link';
import styles from './history.module.css';

export default function HistoryPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch('/api/history');
        if (!response.ok) {
          throw new Error('Ошибка загрузки истории заказов');
        }
        const data = await response.json();
        setOrders(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (loading) return <div className={styles.loading}>Загрузка истории заказов...</div>;
  if (error) return <div className={styles.error}>Ошибка: {error}</div>;

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>История покупок</h1>

      {orders.length > 0 ? (
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Номер заказа</th>
              <th>Имя</th>
              <th>Телефон</th>
              <th>Email</th>
              <th>Способ оплаты</th>
              <th>Общая стоимость</th>
              <th>Дата создания</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.orderId || order.id}>
                <td>{order.orderId || order.id}</td>
                <td>{order.name}</td>
                <td>{order.phone}</td>
                <td>{order.email}</td>
                <td>{order.payment}</td>
                <td>{order.totalPrice} руб.</td>
                <td>{new Date(order.createdAt).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p className={styles.empty}>История покупок пуста.</p>
      )}

      <Link href="/" className={styles.homeLink}>
        На главную
      </Link>
    </div>
  );
}