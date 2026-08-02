const postgres = require('postgres');
require('dotenv').config();

const sql = postgres(process.env.DATABASE_URL);

async function run() {
  try {
    console.log("🚀 Starting HIS Enterprise Migrations...");
    
    await sql`
      CREATE TABLE IF NOT EXISTS "visits" (
        "id" text PRIMARY KEY NOT NULL,
        "patient_id" text NOT NULL,
        "patient_mrn" text NOT NULL,
        "visit_type" text NOT NULL,
        "status" text DEFAULT 'active' NOT NULL,
        "current_stage" text NOT NULL,
        "start_time" text NOT NULL,
        "end_time" text,
        "total_estimated_bill" numeric DEFAULT '0',
        "doctor_id" text,
        "dept_id" text
      );
    `;
    console.log("✅ Visits table created.");

    await sql`
      CREATE TABLE IF NOT EXISTS "insurance_providers" (
        "id" text PRIMARY KEY NOT NULL,
        "name_en" text NOT NULL,
        "name_ar" text NOT NULL,
        "code" text NOT NULL,
        "contact_email" text,
        "coverage_details" jsonb,
        "status" text DEFAULT 'active' NOT NULL,
        CONSTRAINT "insurance_providers_code_unique" UNIQUE("code")
      );
    `;
    console.log("✅ Insurance Providers table created.");

    await sql`
      CREATE TABLE IF NOT EXISTS "billing_charges" (
        "id" text PRIMARY KEY NOT NULL,
        "visit_id" text NOT NULL,
        "patient_id" text NOT NULL,
        "service_id" text NOT NULL,
        "service_name" text NOT NULL,
        "category" text NOT NULL,
        "amount" numeric NOT NULL,
        "insurance_covered" numeric DEFAULT '0',
        "patient_payable" numeric NOT NULL,
        "status" text DEFAULT 'pending' NOT NULL,
        "order_id" text,
        "staff_id" text,
        "created_at" text NOT NULL
      );
    `;
    console.log("✅ Billing Charges table created.");

    await sql`
      CREATE TABLE IF NOT EXISTS "lab_results_structured" (
        "id" text PRIMARY KEY NOT NULL,
        "visit_id" text,
        "patient_id" text NOT NULL,
        "test_name" text NOT NULL,
        "value" text NOT NULL,
        "unit" text,
        "flag" text,
        "reference_range" text,
        "performed_by" text,
        "order_id" text,
        "created_at" text NOT NULL
      );
    `;
    console.log("✅ Lab Results Structured table created.");

    await sql`
      CREATE TABLE IF NOT EXISTS "radiology_reports_structured" (
        "id" text PRIMARY KEY NOT NULL,
        "visit_id" text,
        "patient_id" text NOT NULL,
        "study_name" text NOT NULL,
        "modality" text NOT NULL,
        "findings" text NOT NULL,
        "impression" text NOT NULL,
        "radiologist_id" text,
        "order_id" text,
        "created_at" text NOT NULL
      );
    `;
    console.log("✅ Radiology Reports Structured table created.");

    // Altering patients table
    try {
      await sql`ALTER TABLE "patients" ADD COLUMN "insurance_id" text;`;
      console.log("✅ Added insurance_id to patients.");
    } catch (e) { console.log("ℹ️ insurance_id already exists in patients."); }

    try {
      await sql`ALTER TABLE "patients" ADD COLUMN "policy_no" text;`;
      console.log("✅ Added policy_no to patients.");
    } catch (e) { console.log("ℹ️ policy_no already exists in patients."); }

    try {
      await sql`ALTER TABLE "patients" ALTER COLUMN "insurance" DROP NOT NULL;`;
      console.log("✅ Altered insurance column in patients.");
    } catch (e) { console.log("ℹ️ Failed to alter insurance column (already null or other issue)."); }

    console.log("🎉 HIS Enterprise Migrations completed successfully!");
  } catch (err) {
    console.error("❌ Migration failed:", err);
  } finally {
    process.exit(0);
  }
}
run();
