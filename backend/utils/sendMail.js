const sendMail = async (options) => {
  const apiKey = process.env.BREVO_API_KEY;
  const senderEmail = process.env.BREVO_SENDER_EMAIL;
  const senderName = process.env.BREVO_SENDER_NAME || 'Multivendor App';

  if (!apiKey || !senderEmail) {
    console.error('Brevo API key or Sender Email is missing in environment variables.');
    return;
  }

  const BREVO_API_URL = 'https://api.brevo.com/v3/smtp/email';

  const emailData = {
    sender: {
      name: senderName,
      email: senderEmail,
    },
    to: [
      {
        email: options.email,
      },
    ],
    subject: options.subject,
    htmlContent: options.html,
    textContent: options.message,
  };

  try {
    const response = await fetch(BREVO_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'api-key': apiKey,
        'accept': 'application/json',
      },
      body: JSON.stringify(emailData),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(`Brevo API Error: ${JSON.stringify(data)}`);
    }
  } catch (err) {
    console.error('SendMail error:', err.message);
  }
};

export default sendMail;
