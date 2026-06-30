import { Pool } from "pg";
import dotenv from "dotenv";

dotenv.config();

// Helper to translate "?" placeholder queries to "$1, $2, ..." and handle Postgres RETURNING
export function translateQuery(sql: string): string {
  let index = 1;
  let translated = sql.replace(/\?/g, () => `$${index++}`);
  
  const upperSql = sql.trim().toUpperCase();
  if (upperSql.startsWith("INSERT") && !upperSql.includes("RETURNING")) {
    const isTablesInsert = /\binsert\s+into\s+tables\b/i.test(upperSql);
    if (!isTablesInsert) {
      translated += " RETURNING id";
    }
  }
  return translated;
}

const connectionString = process.env.SUPABASE_DATABASE_URL || process.env.DATABASE_URL;

if (!connectionString) {
  console.warn("WARNING: SUPABASE_DATABASE_URL / DATABASE_URL is not set in environment variables!");
}

const pgPool = new Pool({
  connectionString,
  ssl: connectionString && !connectionString.includes("localhost") && !connectionString.includes("127.0.0.1")
    ? { rejectUnauthorized: false }
    : undefined,
  max: 10,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 10000,
});

const pool = {
  // mysql2 style pool query returning [rows, fields]
  async query<T = any>(sql: string, params?: any[]): Promise<[T, null]> {
    const translatedSql = translateQuery(sql);
    const result = await pgPool.query(translatedSql, params);
    
    const upperSql = sql.trim().toUpperCase();
    const isMutation = upperSql.startsWith("INSERT") || 
                       upperSql.startsWith("UPDATE") || 
                       upperSql.startsWith("DELETE");

    if (isMutation) {
      // Mock ResultSetHeader
      const mockHeader: any = {
        affectedRows: result.rowCount || 0,
        insertId: result.rows[0]?.id ? Number(result.rows[0].id) : 0,
      };
      return [mockHeader as unknown as T, null];
    }

    return [result.rows as unknown as T, null];
  },

  // mysql2 style connection helper for transactions
  async getConnection() {
    const client = await pgPool.connect();
    return {
      async query<T = any>(sql: string, params?: any[]): Promise<[T, null]> {
        const translatedSql = translateQuery(sql);
        const result = await client.query(translatedSql, params);
        
        const upperSql = sql.trim().toUpperCase();
        const isMutation = upperSql.startsWith("INSERT") || 
                           upperSql.startsWith("UPDATE") || 
                           upperSql.startsWith("DELETE");

        if (isMutation) {
          const mockHeader: any = {
            affectedRows: result.rowCount || 0,
            insertId: result.rows[0]?.id ? Number(result.rows[0].id) : 0,
          };
          return [mockHeader as unknown as T, null];
        }

        return [result.rows as unknown as T, null];
      },
      async beginTransaction() {
        await client.query("BEGIN");
      },
      async commit() {
        await client.query("COMMIT");
      },
      async rollback() {
        await client.query("ROLLBACK");
      },
      release() {
        client.release();
      }
    };
  },

  // Expose underlying pgPool just in case
  pgPool
};

export default pool;
