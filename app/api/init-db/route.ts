import { sql } from '@vercel/postgres';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // This creates the table if it doesn't already exist
    await sql`
      CREATE TABLE IF NOT EXISTS portfolio_images (
        id SERIAL PRIMARY KEY,
        src TEXT NOT NULL,
        top_pos VARCHAR(50) NOT NULL,
        left_pos VARCHAR(50) NOT NULL,
        width_class VARCHAR(100) NOT NULL,
        speed FLOAT NOT NULL,
        depth INT NOT NULL,
        aspect_ratio VARCHAR(50) DEFAULT 'aspect-[4/5]'
      );
    `;
    
    return NextResponse.json(
      { message: "Success! The portfolio_images table has been created in your Neon database." }, 
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Oops, something went wrong.", details: error }, 
      { status: 500 }
    );
  }
}