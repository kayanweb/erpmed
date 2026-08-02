const postgres = require('postgres');
require('dotenv').config();

const sql = postgres(process.env.DATABASE_URL);

async function run() {
  try {
    const tables = await sql`
      SELECT table_name
      FROM information_schema.tables
      WHERE table_schema = 'public';
    `;
    console.log(tables.map(t => t.table_name).join('\n'));
  } catch (err) {
    console.error(err);
  } finally {
    process.exit(0);
  }
}
run();
