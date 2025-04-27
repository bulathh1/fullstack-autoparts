import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function POST(request) {
  try {
    const { name, phone, email, payment } = await request.json();

    const [totalResult] = await pool.query(
      "SELECT SUM(p.price * c.quantity) AS totalPrice FROM cart c JOIN parts p ON c.partsId = p.partsId"
    );
    
    const totalPrice = totalResult[0]?.totalPrice || 0;
    const createdAt = new Date();

    await pool.query(
      "INSERT INTO history (name, phone, email, payment, totalPrice, createdAt) VALUES (?, ?, ?, ?, ?, ?)",
      [name, phone, email, payment, totalPrice, createdAt]
    );

    await pool.query("DELETE FROM cart");
    
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}