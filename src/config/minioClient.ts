import { Client } from "minio";
import {
  MINIO_ENDPOINT,
  MINIO_PORT,
  MINIO_USE_SSL,
  MINIO_ACCESS_KEY,
  MINIO_SECRET_KEY
} from "./env";

if (
  !MINIO_ENDPOINT ||
  !MINIO_PORT ||
  !MINIO_ACCESS_KEY ||
  !MINIO_SECRET_KEY
) {
  throw new Error("Missing required MinIO environment variables");
}

const minioClient: Client = new Client({
  endPoint: MINIO_ENDPOINT,
  port: Number(MINIO_PORT),
  useSSL: MINIO_USE_SSL === true,
  accessKey: MINIO_ACCESS_KEY,
  secretKey: MINIO_SECRET_KEY,
});

export default minioClient;