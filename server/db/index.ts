import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  console.warn("⚠️ Warning: DATABASE_URL environment variable is not defined! Defaulting to local fallback.");
}

// Configured for optimal connection pooling and SSL on Neon or Google Cloud SQL
const client = postgres(connectionString || "postgres://localhost:5432/his_db", {
  ssl: connectionString ? "require" : false,
  max: 20,                 
  idle_timeout: 30,        
  connect_timeout: 5,     
  onparameter: (key, val) => {
  }
});

export const db = drizzle(client, { schema });

