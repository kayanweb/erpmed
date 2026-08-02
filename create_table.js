const postgres = require('postgres');
require('dotenv').config();

const sql = postgres(process.env.DATABASE_URL);

async function run() {
  try {
    await sql`
      CREATE TABLE IF NOT EXISTS collections_store (
        id text PRIMARY KEY,
        collection_name text NOT NULL,
        data jsonb NOT NULL,
        created_at text,
        updated_at text
      );
    `;
    console.log("Table created successfully");
  } catch (err) {
    console.error(err);
  } finally {
    process.exit(0);
  }
}
run();
