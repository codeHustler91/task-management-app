import * as trpc from '@trpc/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const createContext = async () => {
  return {
    prisma,
  };
};

export type Context = trpc.inferAsyncReturnType<typeof createContext>;