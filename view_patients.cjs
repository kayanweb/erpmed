const postgres = require('postgres');
require('dotenv').config();

const sql = postgres(process.env.DATABASE_URL);

async function run() {
  try {
    const patients = await sql`SELECT id, name_en, name_ar, mrn, status FROM patients;`;
    console.log(patients);
  } catch (err) {
    console.error(err);
  } finally {
    process.exit(0);
  }
}
run();
