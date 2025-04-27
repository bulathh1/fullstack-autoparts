'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import styles from './cart.module.css';

export default function CartPage() {
  const [cartItems, setCartItems] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const response = await fetch('/api/cart');
        if (!response.ok) throw new Error('Ошибка загрузки корзины');
        const data = await response.json();
        setCartItems(data.cartItems);
        setTotalPrice(data.totalPrice || 0);
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCart();
  }, []);

  const handleClearCart = async () => {
    try {
      const response = await fetch('/api/cart/clear', {
        method: 'POST'
      });
      
      if (response.ok) {
        setCartItems([]);
        setTotalPrice(0);
      }
    } catch (error) {
      console.error('Ошибка очистки корзины:', error);
    }
  };

  if (loading) return <div className={styles.loading}>Загрузка корзины...</div>;

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Корзина</h1>

      {cartItems.length > 0 ? (
        <>
          <ul className={styles.cartList}>
            {cartItems.map((item, index) => (
              <li key={index} className={styles.cartItem}>
                <span className={styles.itemName}>{item.name}</span>
                <span className={styles.itemPrice}>{item.price} руб.</span>
                <span className={styles.itemQuantity}>× {item.quantity} шт.</span>
                <span className={styles.itemTotal}>{item.price * item.quantity} руб.</span>
              </li>
            ))}
          </ul>

          <div className={styles.summary}>
            <p className={styles.totalPrice}>Общая стоимость: {totalPrice} руб.</p>
            
            <div className={styles.actions}>
              <button 
                onClick={handleClearCart}
                className={styles.clearButton}
              >
                Очистить корзину
              </button>
              
              <Link href="/checkout" className={styles.checkoutButton}>
                Оформить заказ
              </Link>
            </div>
          </div>
        </>
      ) : (
        <div className={styles.emptyCart}>
          <p>Ваша корзина пуста.</p>
          <Link href="/store" className={styles.storeLink}>
            Перейти в каталог
          </Link>
        </div>
      )}

      <Link href="/store" className={styles.backLink}>
        Назад к каталогу
      </Link>
    </div>
  );
}