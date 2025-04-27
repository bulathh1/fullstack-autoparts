import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function GET(request, { params }) {
  const { partsId } = params;

  try {
    const [rows] = await pool.query(
      "SELECT * FROM parts WHERE partsId = ?", 
      [partsId]
    );
    
    if (rows.length === 0) {
      return NextResponse.json(
        { error: "Запчасть не найдена" },
        { status: 404 }
      );
    }
    
    return NextResponse.json(rows[0]);
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json(
      { error: 'Ошибка сервера при получении запчасти' },
      { status: 500 }
    );
  }
}

export async function PUT(request, { params }) {
  const { partsId } = params;
  
  try {
    const { name, price, count, suplierId } = await request.json();
    
    if (!name || !price || !count || !suplierId) {
      return NextResponse.json(
        { error: 'Все поля обязательны для заполнения' },
        { status: 400 }
      );
    }

    await pool.query(
      "UPDATE parts SET name = ?, price = ?, count = ?, suplierId = ? WHERE partsId = ?",
      [name, parseFloat(price), parseInt(count), suplierId, partsId]
    );
    
    return NextResponse.json(
      { success: true, message: 'Запчасть успешно обновлена' }
    );
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json(
      { error: 'Ошибка при обновлении запчасти' },
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params }) {
  const { partsId } = params;

  try {
    const [result] = await pool.query(
      "DELETE FROM parts WHERE partsId = ?", 
      [partsId]
    );
    
    if (result.affectedRows === 0) {
      return NextResponse.json(
        { error: "Запчасть не найдена" },
        { status: 404 }
      );
    }
    
    return NextResponse.json(
      { success: true, message: 'Запчасть успешно удалена' }
    );
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json(
      { error: 'Ошибка при удалении запчасти' },
      { status: 500 }
    );
  }
}