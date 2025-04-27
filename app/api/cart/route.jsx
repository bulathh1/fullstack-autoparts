import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function GET() {
  try {
    const [cartItems] = await pool.query(
      "SELECT c.quantity, p.name, p.price FROM cart c JOIN parts p ON c.partsId = p.partsId"
    );
    
    const [totalResult] = await pool.query(
      "SELECT SUM(p.price * c.quantity) AS totalPrice FROM cart c JOIN parts p ON c.partsId = p.partsId"
    );
    
    const totalPrice = totalResult[0]?.totalPrice || 0;
    
    return NextResponse.json({ cartItems, totalPrice });
  } catch (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
