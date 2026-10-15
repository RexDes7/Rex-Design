/**
 * Email-уведомления с контактной формы (порт lib/email.ts оригинала).
 * Если SMTP не настроен — деградирует мягко: лог + {sent:false}, без исключений.
 */
import nodemailer from 'nodemailer'

export interface ContactFormData {
  name: string
  email: string
  message: string
}

export interface SendEmailResult {
  sent: boolean
  reason?: string
}

export function isSmtpConfigured(): boolean {
  return Boolean(process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS)
}

/**
 * Отправить письмо с данными контактной формы.
 * Никогда не бросает исключений.
 */
export async function sendContactEmail(data: ContactFormData): Promise<SendEmailResult> {
  if (!isSmtpConfigured()) {
    console.log(
      `[email] SMTP не настроен (SMTP_HOST/SMTP_USER/SMTP_PASS) — письмо от ${data.email} пропущено`
    )
    return { sent: false, reason: 'smtp-not-configured' }
  }

  try {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: parseInt(process.env.SMTP_PORT || '587', 10),
      secure: false, // true для 465, false для остальных портов
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    })

    const from = process.env.SMTP_FROM || process.env.SMTP_USER
    const to = process.env.CONTACT_EMAIL || from

    await transporter.sendMail({
      from,
      to,
      subject: `New Contact Form Submission from ${data.name}`,
      text: `
Name: ${data.name}
Email: ${data.email}

Message:
${data.message}
      `,
      html: `
        <h2>New Contact Form Submission</h2>
        <p><strong>Name:</strong> ${data.name}</p>
        <p><strong>Email:</strong> ${data.email}</p>
        <p><strong>Message:</strong></p>
        <p>${data.message.replace(/\n/g, '<br>')}</p>
      `,
    })

    return { sent: true }
  } catch (error) {
    console.error('[email] Не удалось отправить письмо контактной формы:', error)
    return { sent: false, reason: 'send-failed' }
  }
}
