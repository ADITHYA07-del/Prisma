import { PrismaClient } from "@prisma/client";

// PrismaClient is attached to the `global` object in development to prevent
// exhausting database connections during Fast Refresh / HMR.
const globalForDatabase = globalThis as unknown as {
  databaseClient: PrismaClient | undefined;
};

export const db = globalForDatabase.databaseClient ?? new PrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForDatabase.databaseClient = db;
}
