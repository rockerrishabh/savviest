import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';
import { validatedEnv } from '../env';

const client = postgres(validatedEnv.DATABASE_URL);

export const db = drizzle(client, { schema });
