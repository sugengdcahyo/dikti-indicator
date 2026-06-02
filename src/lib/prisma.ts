import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

const globalForPrisma = globalThis as unknown as {
  prisma?: PrismaClient;
  prismaPool?: Pool;
};

let prismaClient: PrismaClient | undefined;

function getConnectionString() {
  const connectionString = process.env.DATABASE_URL;

  if (!connectionString) {
    throw new Error("DATABASE_URL belum dikonfigurasi.");
  }

  return connectionString;
}

function getPool() {
  const existingPool = globalForPrisma.prismaPool;

  if (existingPool) {
    return existingPool;
  }

  const pool = globalForPrisma.prismaPool ?? new Pool({ connectionString: getConnectionString() });

  if (process.env.NODE_ENV !== "production") {
    globalForPrisma.prismaPool = pool;
  }

  return pool;
}

function getPrismaClient() {
  if (prismaClient) {
    return prismaClient;
  }

  prismaClient =
    globalForPrisma.prisma ??
    new PrismaClient({
      adapter: new PrismaPg(getPool()),
      log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"]
    });

  if (process.env.NODE_ENV !== "production") {
    globalForPrisma.prisma = prismaClient;
  }

  return prismaClient;
}

export const prisma = new Proxy({} as PrismaClient, {
  get(_target, property, receiver) {
    const client = getPrismaClient();
    const value = Reflect.get(client, property, receiver);
    return typeof value === "function" ? value.bind(client) : value;
  }
}) as PrismaClient;
