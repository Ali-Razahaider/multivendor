import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

const sendMail = async (options) => {
  const from = process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev';
  await resend.emails.send({
    from,
    to: options.email,
    subject: options.subject,
    html: options.html,
    text: options.message,
  });
};

export default sendMail;
