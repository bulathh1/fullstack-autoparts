'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import styles from './checkout.module.css';

export default function CheckoutPage() {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    payment: 'card'
  });
  const router = useRouter();

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const response = await fetch('/api/cart');
        if (!response.ok) throw new Error('Ошибка загрузки корзины');
        const data = await response.json();
        setCartItems(data.cartItems);
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCart();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        router.push('/history');
      } else {
        console.error('Ошибка оформления заказа');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  if (loading) return <div className={styles.loading}>Загрузка...</div>;

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Оформление заказа</h2>

      {cartItems.length > 0 ? (
        <>
          <div className={styles.cartItems}>
            <p>Содержимое корзины:</p>
            <ul>
              {cartItems.map((item, index) => (
                <li key={index}>
                  {item.name} - {item.price} руб. (Количество: {item.quantity})
                </li>
              ))}
            </ul>
          </div>

          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.formGroup}>
              <label>
                Ваше имя:
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </label>
            </div>

            <div className={styles.formGroup}>
              <label>
                Номер телефона:
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                />
              </label>
            </div>

            <div className={styles.formGroup}>
              <label>
                Email:
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </label>
            </div>

            <div className={styles.paymentMethods}>
              <p>Выберите способ оплаты:</p>
              <label className={styles.radioLabel}>
                <input
                  type="radio"
                  name="payment"
                  value="card"
                  checked={formData.payment === 'card'}
                  onChange={handleChange}
                  required
                />
                Банковской картой
              </label>
              
              <label className={styles.radioLabel}>
                <input
                  type="radio"
                  name="payment"
                  value="cash"
                  checked={formData.payment === 'cash'}
                  onChange={handleChange}
                  required
                />
                Наличными курьеру
              </label>
            </div>

            <button type="submit" className={styles.submitButton}>
              Оплатить заказ
            </button>
          </form>
        </>
      ) : (
        <div className={styles.emptyCart}>
          <p>Ваша корзина пуста. <Link href="/store">Перейти к покупкам</Link></p>
        </div>
      )}

      <Link href="/cart" className={styles.backLink}>
        Назад в корзину
      </Link>
    </div>
  );
}