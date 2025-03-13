import 'dotenv/config';
import * as schema from './schema'
import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";

const { Pool,Client } = pg
const pool = new Pool({
  connectionString: process.env.DATABASE_URL!,
});
export const client = new Client({
  connectionString: process.env.DATABASE_URL!,
});

export const db = drizzle({ client: pool ,schema:schema});

