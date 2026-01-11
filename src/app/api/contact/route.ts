import { type NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;
const toEmail = process.env.TO_EMAIL || 'tyme.ai25@gmail.com';

export async function POST(req: NextRequest) {
  if (!resend) {
    console.error("RESEND_API_KEY is not set. Email not sent.");
    return NextResponse.json({ error: "Server is not configured to send emails." }, { status: 500 });
  }

  try {
    const formData = await req.formData();
    const service = formData.get('service') as string;
    const features = formData.get('features') as string;
    const businessStage = formData.get('businessStage') as string;
    const timeline = formData.get('timeline') as string;
    const priority = formData.get('priority') as string;
    const scope = formData.get('scope') as string;
    const budget = formData.get('budget') as string;
    const name = formData.get('name') as string;
    const email = formData.get('email') as string;
    const file = formData.get('file') as File | null;

    let attachments: any[] = [];
    if (file) {
      const buffer = Buffer.from(await file.arrayBuffer());
      attachments.push({
        filename: file.name,
        content: buffer,
      });
    }

    const { data, error } = await resend.emails.send({
      from: 'Tyme AI Inquiry <onboarding@resend.dev>',
      to: [toEmail],
      subject: `New Inquiry: ${service} Project`,
      replyTo: email,
      html: `
        <h1>New Project Inquiry</h1>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <hr>
        <h2>Business Context:</h2>
        <ul>
          <li><strong>Stage:</strong> ${businessStage || 'Not specified'}</li>
          <li><strong>Timeline:</strong> ${timeline || 'Not specified'}</li>
          <li><strong>Top Priority:</strong> ${priority || 'Not specified'}</li>
        </ul>
        <hr>
        <h2>Project Details:</h2>
        <p><strong>Service of Interest:</strong> ${service}</p>
        <p><strong>Selected Features:</strong> ${features || 'None selected'}</p>
        <p><strong>Estimated Budget:</strong> ${budget}</p>
        <h3>Project Scope:</h3>
        <pre>${scope}</pre>
      `,
      attachments,
    });

    if (error) {
      console.error("Resend error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch (error: any) {
    console.error("API Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
