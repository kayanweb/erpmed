const postgres = require('postgres');
require('dotenv').config();

const sql = postgres(process.env.DATABASE_URL);

async function run() {
  try {
    const patients = await sql`SELECT id FROM patients LIMIT 1;`;
    if (patients.length > 0) {
      console.log("Found patient ID: " + patients[0].id);
    } else {
      console.log("No patients found.");
    }
  } catch (err) {
    console.error(err);
  } finally {
    process.exit(0);
  }
}
run();
