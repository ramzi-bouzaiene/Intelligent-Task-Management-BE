import { randomUUID } from "crypto";
import minioClient from "../../config/minioClient";
import {
  MINIO_BUCKET,
  MINIO_ENDPOINT,
  MINIO_PORT,
  MINIO_PUBLIC_URL,
  MINIO_USE_SSL,
} from "../../config/env";

const AVATAR_MIME_EXTENSION: Record<string, string> = {
  "image/jpeg": ".jpg",
  "image/png": ".png",
  "image/webp": ".webp",
  "image/gif": ".gif",
};

export interface CreateBucketResult {
  created: boolean;
  message: string;
}

export interface UploadAvatarResult {
  bucket: string;
  objectKey: string;
  url: string;
}

function buildPublicBaseUrl(): string {
  if (MINIO_PUBLIC_URL && MINIO_PUBLIC_URL.trim() !== "") {
    return MINIO_PUBLIC_URL.replace(/\/+$/, "");
  }

  const protocol = MINIO_USE_SSL ? "https" : "http";
  const port = Number(MINIO_PORT);
  const portSegment = port === 80 || port === 443 ? "" : `:${port}`;

  return `${protocol}://${MINIO_ENDPOINT}${portSegment}`;
}

function encodeObjectKey(objectKey: string): string {
  return objectKey
    .split("/")
    .map((segment) => encodeURIComponent(segment))
    .join("/");
}

function buildObjectUrl(bucket: string, objectKey: string): string {
  const baseUrl = buildPublicBaseUrl();
  const encodedKey = encodeObjectKey(objectKey);
  return `${baseUrl}/${bucket}/${encodedKey}`;
}

async function ensureBucketExists(bucketName: string): Promise<void> {
  const exists = await minioClient.bucketExists(bucketName);
  if (!exists) {
    await minioClient.makeBucket(bucketName);
  }
}

export async function createBucket(
  bucketName: string
): Promise<CreateBucketResult> {
  const exists = await minioClient.bucketExists(bucketName);

  if (exists) {
    return {
      created: false,
      message: "Bucket already exists",
    };
  }

  await minioClient.makeBucket(bucketName);

  return {
    created: true,
    message: "Bucket created successfully",
  };
}

export async function uploadAvatar(
  userId: number,
  file: Express.Multer.File
): Promise<UploadAvatarResult> {
  const extension = AVATAR_MIME_EXTENSION[file.mimetype];
  if (!extension) {
    throw new Error("Unsupported avatar type");
  }

  const bucketName = MINIO_BUCKET;
  const objectKey = `users/${userId}/avatar-${randomUUID()}${extension}`;

  await ensureBucketExists(bucketName);

  await minioClient.putObject(
    bucketName,
    objectKey,
    file.buffer,
    file.size,
    {
      "Content-Type": file.mimetype,
    }
  );

  return {
    bucket: bucketName,
    objectKey,
    url: buildObjectUrl(bucketName, objectKey),
  };
}