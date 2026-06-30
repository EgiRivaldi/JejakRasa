import fs from "fs";
import path from "path";
import pool from "./connection";

async function runSQLFile(filePath: string) {
  console.log(`Running SQL file: ${path.basename(filePath)}...`);
  const sql = fs.readFileSync(filePath, "utf8");
  
  // Robust SQL statement splitter
  const rawStatements = sql.split(/;(?:\r?\n|\r|$)/);
  
  const connection = await pool.getConnection();
  try {
    // Disable triggers / foreign key constraints temporarily in Postgres
    await connection.query("SET session_replication_role = 'replica'");
    
    let executedCount = 0;
    for (let i = 0; i < rawStatements.length; i++) {
      let stmt = rawStatements[i].trim();
      
      // Clean comment lines from the statement
      stmt = stmt
        .split(/\r?\n/)
        .map(line => {
          const trimmedLine = line.trim();
          if (trimmedLine.startsWith("--") || trimmedLine.startsWith("#") || trimmedLine.startsWith("/*")) {
            return "";
          }
          return line;
        })
        .join("\n")
        .trim();

      if (stmt.length === 0) continue;
      
      console.log(`Executing query:\n${stmt.substring(0, 100)}${stmt.length > 100 ? "..." : ""}`);
      await connection.query(stmt);
      executedCount++;
    }
    
    // Re-enable triggers / constraints in Postgres
    await connection.query("SET session_replication_role = 'origin'");
    console.log(`Successfully completed: ${path.basename(filePath)} (${executedCount} queries executed)`);
  } catch (error) {
    console.error(`Error running SQL file ${path.basename(filePath)}:`, error);
    throw error;
  } finally {
    connection.release();
  }
}

async function main() {
  try {
    const schemaPath = path.join(process.cwd(), "src", "server", "db", "schema.postgres.sql");
    const seedPath = path.join(process.cwd(), "src", "server", "db", "seed.postgres.sql");

    await runSQLFile(schemaPath);
    await runSQLFile(seedPath);
    console.log("Database setup successfully completed!");
    process.exit(0);
  } catch (error) {
    console.error("Database setup failed:", error);
    process.exit(1);
  }
}

main();
