import 'dotenv/config.js';
import * as schema from './schema.js'
import { drizzle } from "drizzle-orm/node-postgres";
import pkg from 'pg';
const { Pool ,Client} = pkg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});
const db = drizzle({ client: pool ,schema:schema});

const client = new Client({
  connectionString: process.env.DATABASE_URL,
});


export {client};
export default db;