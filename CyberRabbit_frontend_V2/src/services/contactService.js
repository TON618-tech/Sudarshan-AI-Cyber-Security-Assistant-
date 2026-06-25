import { fetchWithTimeout, ApiError } from './api.js';

export async function submitContactForm(formData) {
  const baseUrl = import.meta.env.VITE_API_URL;
  if (!baseUrl) {
    throw new ApiError('Missing VITE_API_URL configuration.', 500);
  }

  const payload = await fetchWithTimeout(`${baseUrl}/contact`, {
    method: 'POST',
    body: JSON.stringify(formData)
  });

  if (!payload?.success) {
    throw new ApiError('Malformed backend response.', 502);
  }

  return true;
}
