import mysql from "mysql2/promise";
import { Client } from "pg";
import fs from "fs";
import path from "path";
import dotenv from "dotenv";
import { fileURLToPath } from "url";

dotenv.config();

// Fix for __dirname in ESM (Vite/Node modules type: module)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function run() {
  console.log("=== STARTING DATABASE MIGRATION TO SUPABASE ===");

  // 1. Connect to local MySQL
  console.log("Connecting to local MySQL...");
  const mysqlConn = await mysql.createConnection({
    host: process.env.DB_HOST || "localhost",
    port: Number(process.env.DB_PORT) || 3306,
    database: process.env.DB_NAME || "jejakrasa",
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "",
  });
  console.log("✓ Connected to MySQL.");

  // 2. Connect to remote Supabase (PostgreSQL)
  const pgUrl = process.env.SUPABASE_DATABASE_URL || process.env.DATABASE_URL;
  if (!pgUrl) {
    console.error("ERROR: SUPABASE_DATABASE_URL is not set in your .env file!");
    process.exit(1);
  }
  console.log("Connecting to remote Supabase (PostgreSQL)...");
  const pgClient = new Client({
    connectionString: pgUrl,
    ssl: { rejectUnauthorized: false },
  });
  await pgClient.connect();
  console.log("✓ Connected to Supabase.");

  try {
    // 3. Create tables on Supabase using schema.postgres.sql
    console.log("Reading schema.postgres.sql...");
    const schemaPath = path.join(__dirname, "schema.postgres.sql");
    const schemaSql = fs.readFileSync(schemaPath, "utf8");

    console.log("Executing schema.postgres.sql on Supabase...");
    const statements = schemaSql.split(/;(?:\r?\n|\r|$)/).map(s => s.trim()).filter(Boolean);
    
    // Disable triggers/foreign key checks on Supabase during migration
    await pgClient.query("SET session_replication_role = 'replica'");

    for (const stmt of statements) {
      console.log(`Executing: ${stmt.substring(0, 50)}...`);
      await pgClient.query(stmt);
    }
    console.log("✓ Database schema created on Supabase.");

    // 4. Migrate data for each table
    const tables = ["categories", "tables", "foods", "promotions", "banners", "admins", "orders", "order_items"];

    for (const table of tables) {
      console.log(`Migrating table '${table}'...`);

      // Get columns and data from MySQL
      const [rows]: [any[], any] = await mysqlConn.query(`SELECT * FROM ${table}`);
      if (rows.length === 0) {
        console.log(`- Table '${table}' is empty. Skipping.`);
        continue;
      }

      console.log(`- Found ${rows.length} rows in MySQL. Inserting into Supabase...`);

      // Dynamically build PostgreSQL insert query
      const columns = Object.keys(rows[0]);
      const columnNames = columns.join(", ");
      
      for (const row of rows) {
        const placeholders = columns.map((_, i) => `$${i + 1}`).join(", ");
        const insertQuery = `INSERT INTO ${table} (${columnNames}) VALUES (${placeholders})`;
        const values = columns.map(col => {
          const val = row[col];
          // Convert MySQL date object to ISO string if needed
          if (val instanceof Date) {
            return val.toISOString();
          }
          return val;
        });

        await pgClient.query(insertQuery, values);
      }
      console.log(`✓ Migrated ${rows.length} rows for table '${table}'.`);
    }

    // Re-enable triggers/foreign key checks
    await pgClient.query("SET session_replication_role = 'origin'");

    // 5. Reset serial sequences to avoid conflicts on future inserts
    console.log("Resetting primary key sequences on Supabase...");
    const serialTables = [
      { name: "foods", col: "id" },
      { name: "order_items", col: "id" },
      { name: "admins", col: "id" }
    ];

    for (const st of serialTables) {
      const resetSeqQuery = `
        SELECT setval(
          pg_get_serial_sequence('${st.name}', '${st.col}'), 
          coalesce(max(${st.col}), 1)
        ) FROM ${st.name}
      `;
      await pgClient.query(resetSeqQuery);
      console.log(`✓ Sequence for table '${st.name}' reset.`);
    }

    console.log("=== MIGRATION SUCCESSFULLY COMPLETED! ===");
  } catch (err) {
    console.error("Migration failed with error:", err);
  } finally {
    await mysqlConn.end();
    await pgClient.end();
  }
}

run();
