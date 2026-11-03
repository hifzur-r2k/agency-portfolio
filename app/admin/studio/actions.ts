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
        await sql`DELETE FROM portfolio_images WHERE id = ${id}`;

        // Clear the cache for both the homepage AND the admin dashboard
        revalidatePath('/');
        revalidatePath('/admin/studio');

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
// Add this to the bottom of app/admin/studio/actions.ts
export async function updatePortfolioImage(id: number, formData: FormData) {
  const top_pos = formData.get("top_pos") as string;
  const left_pos = formData.get("left_pos") as string;
  const width_class = formData.get("width_class") as string;
  const speed = Number(formData.get("speed"));
  const depth = Number(formData.get("depth"));
  const aspect_ratio = formData.get("aspect_ratio") as string;

  try {
    await sql`
      UPDATE portfolio_images 
      SET top_pos = ${top_pos}, left_pos = ${left_pos}, width_class = ${width_class}, 
          speed = ${speed}, depth = ${depth}, aspect_ratio = ${aspect_ratio}
      WHERE id = ${id}
    `;
    
    revalidatePath('/'); 
    revalidatePath('/admin/studio');
    return { success: true };
  } catch (error) {
    console.error("Failed to update image:", error);
    throw new Error("Failed to update image");
  }
}

// ==========================================
// NEW: PORTFOLIO CASE STUDY ACTIONS
// ==========================================

async function ensurePortfolioTable() {
  await sql`
    CREATE TABLE IF NOT EXISTS agency_projects (
      id SERIAL PRIMARY KEY,
      title TEXT NOT NULL,
      category TEXT NOT NULL,
      impact TEXT DEFAULT '',
      deliverables JSONB DEFAULT '[]',
      images JSONB NOT NULL,
      description TEXT DEFAULT '',
      live_url TEXT DEFAULT '',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `;
}

export async function getProjects() {
  try {
    await ensurePortfolioTable();
    const { rows } = await sql`
      SELECT id, title, category, impact, deliverables, images, description, live_url AS "liveUrl"
      FROM agency_projects
      ORDER BY created_at DESC;
    `;
    return rows;
  } catch (error) {
    console.error("Failed to fetch projects:", error);
    return [];
  }
}

export async function saveProject(formData: FormData) {
  try {
    await ensurePortfolioTable();

    const title = formData.get("title") as string;
    const category = formData.get("category") as string;
    const impact = (formData.get("impact") as string) || "↗ Featured Case";
    const description = (formData.get("description") as string) || "";
    const liveUrl = (formData.get("liveUrl") as string) || "";
    
    const deliverablesRaw = (formData.get("deliverables") as string) || "";
    const deliverables = deliverablesRaw.split(",").map(d => d.trim()).filter(Boolean);
    
    const imagesRaw = formData.get("images") as string;
    const images = imagesRaw ? JSON.parse(imagesRaw) : [];

    if (images.length === 0) throw new Error("At least one image is required.");

    await sql`
      INSERT INTO agency_projects (title, category, impact, deliverables, images, description, live_url)
      VALUES (
        ${title},
        ${category},
        ${impact},
        ${JSON.stringify(deliverables)}::jsonb,
        ${JSON.stringify(images)}::jsonb,
        ${description},
        ${liveUrl}
      );
    `;

    revalidatePath("/portfolio");
    return { success: true };
  } catch (error: any) {
    return { error: error.message };
  }
}

export async function deleteProject(id: number) {
  try {
    await sql`DELETE FROM agency_projects WHERE id = ${id};`;
    revalidatePath("/portfolio");
    return { success: true };
  } catch (error: any) {
    return { error: error.message };
  }
}
export async function updateProject(id: number, formData: FormData) {
  try {
    const title = formData.get("title") as string;
    const category = formData.get("category") as string;
    const impact = (formData.get("impact") as string) || "↗ Featured Case";
    const description = (formData.get("description") as string) || "";
    const liveUrl = (formData.get("liveUrl") as string) || "";
    
    const deliverablesRaw = (formData.get("deliverables") as string) || "";
    const deliverables = deliverablesRaw.split(",").map(d => d.trim()).filter(Boolean);
    
    const imagesRaw = formData.get("images") as string;
    const images = imagesRaw ? JSON.parse(imagesRaw) : [];

    if (images.length === 0) throw new Error("At least one image is required.");

    await sql`
      UPDATE agency_projects 
      SET title = ${title}, 
          category = ${category}, 
          impact = ${impact}, 
          deliverables = ${JSON.stringify(deliverables)}::jsonb, 
          images = ${JSON.stringify(images)}::jsonb, 
          description = ${description}, 
          live_url = ${liveUrl}
      WHERE id = ${id};
    `;

    revalidatePath("/portfolio");
    return { success: true };
  } catch (error: any) {
    return { error: error.message };
  }
}