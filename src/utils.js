import { BASE_URL } from './config';

export const isAvailable = (v) => v === true || v === 1 || v === '1' || v === 'true';

export const formatPrice = (v) => `R$ ${Number(v || 0).toFixed(2).replace('.', ',')}`;

// Aceita URL completa ou caminho relativo (ex.: "/uploads/foto.jpg")
export const imageUrl = (path) => {
  if (!path) return null;
  if (/^https?:\/\//i.test(path)) return path;
  return `${BASE_URL}${path.startsWith('/') ? '' : '/'}${path}`;
};
