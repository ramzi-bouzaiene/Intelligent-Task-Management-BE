import dotenv from 'dotenv';

dotenv.config();

export const PORT = process.env.PORT || 5000;
export const JWT_SECRET = process.env.JWT_SECRET as string;
export const DATABASE_URL = process.env.DATABASE_URL as string;
export const MODEL_NAME = process.env.MODEL_NAME || 'llama3.2';
export const DEEPSEEK_API_KEY = process.env.DEEPSEEK_API_KEY as string;
