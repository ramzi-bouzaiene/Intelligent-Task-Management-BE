import dotenv from 'dotenv';

dotenv.config();

export const PORT = process.env.PORT || 5000;
export const JWT_SECRET = process.env.JWT_SECRET as string;
export const DATABASE_URL = process.env.DATABASE_URL as string;
export const GEMINI_API_KEY = process.env.GEMINI_API_KEY as string;
export const GEMINI_BASE_URL =
  process.env.GEMINI_BASE_URL || 'https://generativelanguage.googleapis.com/v1beta';
export const GEMINI_MODEL = process.env.GEMINI_MODEL || 'gemini-flash-latest';
export const MINIO_ENDPOINT = process.env.MINIO_ENDPOINT;
export const MINIO_PORT = parseInt(process.env.MINIO_PORT || '9000', 10);
export const MINIO_USE_SSL = process.env.MINIO_USE_SSL === 'true';
export const MINIO_ACCESS_KEY = process.env.MINIO_ACCESS_KEY;
export const MINIO_SECRET_KEY = process.env.MINIO_SECRET_KEY;
export const MINIO_BUCKET = process.env.MINIO_BUCKET || 'avatars';
export const MINIO_PUBLIC_URL = process.env.MINIO_PUBLIC_URL || '';
