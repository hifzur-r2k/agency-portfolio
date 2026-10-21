"use server";

import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendEmail = async (formData: FormData) => {
  try {
    const name = formData.get("name");
    const email = formData.get("email");
    const message = formData.get("message");

    if (!name || !email || !message) {
      return { error: "Please fill out all required fields." };
    }

    // Resend SDK v3 returns { data, error } instead of throwing
    const { data, error } = await resend.emails.send({
      from: "Agency Portfolio <onboarding@resend.dev>",
      to: "contact.zerogravityspace@gmail.com",
      subject: `New Project Inquiry from ${name}`,
      replyTo: email as string,
      html: `
        <div style="font-family: sans-serif; padding: 20px; color: #111;">
          <h2 style="color: #000;">New Project Request</h2>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <hr style="border: 1px solid #eaeaea; margin: 20px 0;" />
          <p><strong>Message details:</strong></p>
          <p style="white-space: pre-wrap;">${message}</p>
        </div>
      `,
    });

    // Catch Resend API errors (like bad API keys or unverified domains)
    if (error) {
      console.error("Resend API Error:", error.message);
      return { error: "Email provider error. Please try again later." };
    }

    return { success: true };
  } catch (e: any) {
    // Catch fatal server crashes
    console.error("Server Action Error:", e);
    return { error: "Internal server error. Please try again." };
  }
};