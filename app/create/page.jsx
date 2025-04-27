'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function CreatePartPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    partsId: '',
    name: '',
    price: '',
    count: '',
    suplierId: ''
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.partsId) newErrors.partsId = 'ID обязателен';
    else if (isNaN(formData.partsId)) newErrors.partsId = 'ID должен быть числом';
    
    if (!formData.name) newErrors.name = 'Название обязательно';
    else if (formData.name.length > 255) newErrors.name = 'Слишком длинное название';
    
    if (!formData.price) newErrors.price = 'Цена обязательна';
    else if (isNaN(formData.price)) newErrors.price = 'Цена должна быть числом';
    else if (parseFloat(formData.price) <= 0) newErrors.price = 'Цена должна быть больше 0';
    
    if (!formData.count) newErrors.count = 'Количество обязательно';
    else if (isNaN(formData.count)) newErrors.count = 'Количество должно быть числом';
    else if (parseInt(formData.count) <= 0) newErrors.count = 'Количество должно быть больше 0';
    
    if (!formData.suplierId) newErrors.suplierId = 'ID поставщика обязательно';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError('');
    
    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/parts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          price: parseFloat(formData.price),
          count: parseInt(formData.count)
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Ошибка при создании запчасти');
      }

      router.push('/store');
    } catch (error) {
      console.error('Error:', error);
      setSubmitError(error.message || 'Произошла ошибка при создании запчасти');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="create-container">
      <h1>Данные автозапчасти</h1>
      
      {submitError && (
        <div className="error-message">
          {submitError}
        </div>
      )}

      <form onSubmit={handleSubmit} className="create-form">
        <div className="form-group">
          <label>ID запчасти</label>
          <input
            name="partsId"
            type="number"
            value={formData.partsId}
            onChange={handleChange}
            className={`field ${errors.partsId ? 'error' : ''}`}
            min="1"
          />
          {errors.partsId && <span className="error-text">{errors.partsId}</span>}
        </div>

        <div className="form-group">
          <label>Название запчасти</label>
          <input
            name="name"
            value={formData.name}
            onChange={handleChange}
            className={`field ${errors.name ? 'error' : ''}`}
            maxLength="255"
          />
          {errors.name && <span className="error-text">{errors.name}</span>}
        </div>
        
        <div className="form-group">
          <label>Цена</label>
          <input
            name="price"
            type="number"
            value={formData.price}
            onChange={handleChange}
            className={`field ${errors.price ? 'error' : ''}`}
            min="0.01"
            step="0.01"
          />
          {errors.price && <span className="error-text">{errors.price}</span>}
        </div>
        
        <div className="form-group">
          <label>Количество</label>
          <input
            name="count"
            type="number"
            value={formData.count}
            onChange={handleChange}
            className={`field ${errors.count ? 'error' : ''}`}
            min="1"
          />
          {errors.count && <span className="error-text">{errors.count}</span>}
        </div>

        <div className="form-group">
          <label>ID поставщика</label>
          <input
            name="suplierId"
            value={formData.suplierId}
            onChange={handleChange}
            className={`field ${errors.suplierId ? 'error' : ''}`}
          />
          {errors.suplierId && <span className="error-text">{errors.suplierId}</span>}
        </div>
        
        <button 
          type="submit" 
          className="submit-btn"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Создание...' : 'Создать запчасть'}
        </button>
      </form>

      <Link href="/store" className="back-link">
        ← Вернуться в каталог
      </Link>

      <style jsx>{`
        .body {
          background-color: #c7bbf5; /* Задаем цвет фона */
        }

        .create-container {
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
        }
        
        .create-form {
          display: flex;
          flex-direction: column;
          gap: 15px;
          margin-bottom: 20px;
        }
        
        .form-group {
          display: flex;
          flex-direction: column;
          gap: 5px;
        }
        
        .field {
          padding: 8px;
          border: 1px solid #ddd;
          border-radius: 4px;
          width: 100%;
          max-width: 300px;
        }
        
        .field.error {
          border-color: #ff4444;
        }
        
        .error-text {
          color: #ff4444;
          font-size: 0.8rem;
        }
        
        .error-message {
          color: white;
          background-color: #ff4444;
          padding: 10px;
          border-radius: 4px;
          margin-bottom: 15px;
        }
        
        .submit-btn {
          padding: 10px 15px;
          background-color: #4CAF50;
          color: white;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          width: fit-content;
          transition: background-color 0.3s;
        }
        
        .submit-btn:hover:not(:disabled) {
          background-color: #45a049;
        }
        
        .submit-btn:disabled {
          background-color: #cccccc;
          cursor: not-allowed;
        }

        .back-link {
          text-decoration: none;
          display: inline-block;
          margin-top: 10px;
          color: #0066cc;
          transition: color 0.3s;
        }
        
        .back-link:hover {
          color: #004499;
          text-decoration: none;
        }
      `}</style>
    </div>
  );
}