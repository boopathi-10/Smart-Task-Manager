import dotenv from "dotenv";
dotenv.config(); // 👈 LOAD ENV HERE

import pkg from "pg";
const { Pool } = pkg;

console.log("DB URL =", process.env.DATABASE_URL);

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

pool.on("connect", () => {
  console.log("✅ Database connected");
});
