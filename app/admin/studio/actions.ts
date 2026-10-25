"use server";

import { sql } from '@vercel/postgres';
import { revalidatePath } from 'next/cache';

export async function saveImageToDatabase(formData: FormData) {
  // 1. Grab all the values from the form
  const src = formData.get("src") as string;
  const top_pos = formData.get("top_pos") as string;
  const left_pos = formData.get("left_pos") as string;
  const width_class = formData.get("width_class") as string;
  const speed = Number(formData.get("speed"));
  const depth = Number(formData.get("depth"));
  const aspect_ratio = formData.get("aspect_ratio") as string;

  try {
    // 2. Insert them securely into your Neon table
    await sql`
      INSERT INTO portfolio_images (src, top_pos, left_pos, width_class, speed, depth, aspect_ratio)
      VALUES (${src}, ${top_pos}, ${left_pos}, ${width_class}, ${speed}, ${depth}, ${aspect_ratio})
    `;
    
    // 3. Force the homepage to refresh so the new image appears instantly
    revalidatePath('/'); 
    
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to save image to database");
  }
}
// Add this to the bottom of app/admin/studio/actions.ts
export async function getPortfolioImages() {
  try {
    const { rows } = await sql`SELECT * FROM portfolio_images ORDER BY id ASC`;
    return rows;
  } catch (error) {
    console.error("Failed to fetch images from database:", error);
    return [];
  }
}
// Add this to the bottom of app/admin/studio/actions.ts
export async function deletePortfolioImage(id: number) {
  try {
    // Deletes the specific image row from your Neon database
    await sql`DELETE FROM portfolio_images WHERE id = ${id}`;
    
    // Refreshes the homepage instantly
    revalidatePath('/'); 
    return { success: true };
  } catch (error) {
    console.error("Failed to delete image:", error);
    throw new Error("Failed to delete image");
  }
}
// Securely checks the passcode on the backend so it never leaks to the browser
export async function verifyPasscode(passcode: string) {
  const masterPass = process.env.ADMIN_PASSCODE;
  
  if (!masterPass) {
    console.error("ADMIN_PASSCODE is missing from your .env.local file");
    return false;
  }
  
  return passcode === masterPass;
}