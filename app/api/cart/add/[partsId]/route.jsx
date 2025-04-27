import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function POST(request, { params }) {
  const { partsId } = params;

  try {

    const [part] = await pool.query(
      "SELECT * FROM parts WHERE partsId = ?", 
      [partsId]
    );

    if (part.length === 0) {
      return NextResponse.json(
        { error: "Запчасть не найдена" },
        { status: 404 }
      );
    }


    await pool.query(
      "INSERT INTO cart (partsId, quantity) VALUES (?, 1) ON DUPLICATE KEY UPDATE quantity = quantity + 1",
      [partsId]
    );

    return NextResponse.json(
      { success: true, message: "Товар добавлен в корзину" }
    );
  } catch (error) {
    console.error('Cart error:', error);
    return NextResponse.json(
      { error: "Ошибка при добавлении в корзину" },
      { status: 500 }
    );
  }
}