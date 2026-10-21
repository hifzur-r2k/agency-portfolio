"use server";

import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendEmail = async (formData: FormData) => {
  const name = formData.get("name");
  const email = formData.get("email");
  const message = formData.get("message"); // Removed budget

  if (!name || !email || !message) {
    return { error: "Please fill out all required fields." };
  }

  try {
    await resend.emails.send({
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

    return { success: true };
  } catch (error) {
    console.error("Resend Error:", error);
    return { error: "Failed to send message. Please try again." };
  }
};