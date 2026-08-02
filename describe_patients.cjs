const postgres = require('postgres');
require('dotenv').config();

const sql = postgres(process.env.DATABASE_URL);

async function run() {
  try {
    const cols = await sql`
      SELECT column_name, data_type
      FROM information_schema.columns
      WHERE table_name = 'patients';
    `;
    console.log(cols);
  } catch (err) {
    console.error(err);
  } finally {
    process.exit(0);
  }
}
run();
