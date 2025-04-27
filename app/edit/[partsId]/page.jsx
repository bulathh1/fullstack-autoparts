'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';

export default function EditPartPage() {
  const router = useRouter();
  const { partsId } = useParams();
  const [part, setPart] = useState({
    partsId: '',
    name: '',
    price: '',
    count: '',
    suplierId: ''
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPart = async () => {
      try {
        const response = await fetch(`/api/parts/${partsId}`);
        if (!response.ok) throw new Error('Ошибка загрузки данных');
        const data = await response.json();
        setPart(data);
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPart();
  }, [partsId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPart(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const response = await fetch(`/api/parts/${partsId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(part),
      });

      if (response.ok) {
        router.push('/store');
      } else {
        console.error('Ошибка обновления');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  if (loading) return <div>Загрузка...</div>;

  return (
    <div className="edit-container">
      <h1>Редактирование данных автозапчасти</h1>
      
      <form onSubmit={handleSubmit} className="edit-form">
        <input type="hidden" name="partsId" value={part.partsId} />

        <label>Название</label>
        <input 
          name="name" 
          value={part.name} 
          onChange={handleChange}
          className="field" 
        />
        
        <label>Цена</label>
        <input 
          name="price" 
          value={part.price} 
          onChange={handleChange}
          className="field" 
        />
        
        <label>Количество</label>
        <input 
          name="count" 
          type="number" 
          min="1" 
          max="100000"
          value={part.count} 
          onChange={handleChange}
          className="field" 
        />

        <label>Поставщик</label>
        <input 
          name="suplierId" 
          type="number" 
          value={part.suplierId} 
          onChange={handleChange}
          className="field" 
        />
        
        <button type="submit" className="submit-btn">
          Сохранить изменения
        </button>
      </form>

      <Link href="/store" className="back-link">
        Список автозапчастей
      </Link>

      <style jsx>{`
        .edit-container {
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
        }
        
        .edit-form {
          display: flex;
          flex-direction: column;
          gap: 15px;
          margin-bottom: 20px;
        }
        
        .field {
          width: 180px;
          padding: 8px;
          border: 1px solid #ddd;
          border-radius: 4px;
        }
        
        label {
          font-weight: bold;
          margin-bottom: 5px;
        }
        
        .submit-btn {
          padding: 10px 15px;
          background-color: #4CAF50;
          color: white;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          width: fit-content;
        }
        
        .submit-btn:hover {
          background-color: #45a049;
        }
        
        .back-link {
          display: inline-block;
          margin-top: 10px;
          color: #0066cc;
          text-decoration: none;
        }
        
        .back-link:hover {
          text-decoration: underline;
        }
      `}</style>
    </div>
  );
}