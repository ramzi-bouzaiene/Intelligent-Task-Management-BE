import dotenv from "dotenv"

dotenv.config()

export const PORT = process.env.PORT || 5000
export const JWT_SECRET = process.env.JWT_SECRET as string
export const DATABASE_URL = process.env.DATABASE_URL as string