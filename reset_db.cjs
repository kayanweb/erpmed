const postgres = require('postgres');
require('dotenv').config();

const sql = postgres(process.env.DATABASE_URL);

async function run() {
  try {
    console.log("Dropping schema public...");
    await sql`DROP SCHEMA public CASCADE;`;
    console.log("Recreating schema public...");
    await sql`CREATE SCHEMA public;`;
    console.log("Schema reset complete.");
  } catch (err) {
    console.error(err);
  } finally {
    process.exit(0);
  }
}
run();
