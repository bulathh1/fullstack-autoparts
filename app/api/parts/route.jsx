import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const filterType = searchParams.get('filterType') || 'name';
  const filter = searchParams.get('filter') || '';

  try {
    let query = "SELECT * FROM parts";
    let params = [];
    let whereClause = '';

    if (filter) {
      if (filterType === 'price') {
        whereClause = " WHERE price = ?";
        params.push(parseFloat(filter));
      } else {
        whereClause = " WHERE name LIKE ?";
        params.push(`%${filter}%`);
      }
    }

    const orderClause = filterType === 'price' 
      ? " ORDER BY price ASC" 
      : " ORDER BY name ASC";

    const [rows] = await pool.query(query + whereClause + orderClause, params);
    
    return NextResponse.json(rows);
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json(
      { error: 'Ошибка сервера при получении запчастей' },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const { partsId, name, price, count, suplierId } = await request.json();
    
    const validationErrors = {};
    
    if (!partsId) validationErrors.partsId = 'ID запчасти обязательно';
    if (!name) validationErrors.name = 'Название обязательно';
    if (!price) validationErrors.price = 'Цена обязательна';
    if (!count) validationErrors.count = 'Количество обязательно';
    if (!suplierId) validationErrors.suplierId = 'ID поставщика обязательно';
    
    if (Object.keys(validationErrors).length > 0) {
      return NextResponse.json(
        { 
          error: 'Неверные данные',
          validationErrors 
        },
        { status: 400 }
      );
    }

    const [existingParts] = await pool.query(
      "SELECT partsId FROM parts WHERE partsId = ?",
      [partsId]
    );

    if (existingParts.length > 0) {
      return NextResponse.json(
        { 
          error: 'Запчасть с таким ID уже существует',
          field: 'partsId'
        },
        { status: 409 }
      );
    }

    await pool.query(
      "INSERT INTO parts (partsId, name, price, count, suplierId) VALUES (?, ?, ?, ?, ?)",
      [
        parseInt(partsId),
        name,
        parseFloat(price),
        parseInt(count),
        suplierId
      ]
    );
    
    return NextResponse.json(
      { 
        success: true, 
        message: 'Запчасть успешно добавлена',
        partsId: parseInt(partsId)
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Database error:', error);
    
    let errorMessage = 'Ошибка при добавлении запчасти';
    if (error.code === 'ER_DUP_ENTRY') {
      errorMessage = 'Запчасть с таким ID уже существует';
    } else if (error.code === 'ER_NO_REFERENCED_ROW_2') {
      errorMessage = 'Поставщик с указанным ID не существует';
    }
    
    return NextResponse.json(
      { 
        error: errorMessage,
        details: error.message 
      },
      { status: 500 }
    );
  }
}