import { validateContactPayload } from '../utils/validation.js';
import { sendContactEmail } from '../services/contactService.js';

export async function postContact(req, res, next) {
  try {
    const validatedData = validateContactPayload(req.body);
    
    await sendContactEmail(validatedData);
    
    return res.status(200).json({
      success: true,
      message: 'Message sent successfully.'
    });
  } catch (error) {
    return next(error);
  }
}
