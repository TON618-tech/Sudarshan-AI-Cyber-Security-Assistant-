import { env } from '../config/env.js';
import createError from 'http-errors';

export async function sendContactEmail(formData) {
  const { emailjsServiceId, emailjsTemplateId, emailjsPublicKey } = env;
  
  if (!emailjsServiceId || !emailjsTemplateId || !emailjsPublicKey) {
    throw createError(500, 'Email service is not configured on the server.');
  }

  const payload = {
    service_id: emailjsServiceId,
    template_id: emailjsTemplateId,
    user_id: emailjsPublicKey,
    template_params: {
      from_name: formData.name,
      reply_to: formData.email,
      subject: formData.subject,
      feedback_type: formData.feedbackType,
      message: formData.message,
      submitted_at: new Date().toISOString()
    }
  };

  try {
    const response = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('EmailJS Error:', errorText);
      throw createError(502, 'Failed to send email via upstream service.');
    }
    
    return true;
  } catch (err) {
    if (err.status) throw err;
    console.error('EmailJS Network Error:', err);
    throw createError(503, 'Network error when connecting to email service.');
  }
}
