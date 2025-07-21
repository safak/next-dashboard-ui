// lib/mysql.ts
import mysql from "mysql2/promise";

const globalForMysql = globalThis as unknown as {
  pool?: mysql.Pool;
};

export const dbConnection =
  globalForMysql.pool ??
  mysql.createPool({
    host: process.env.MYSQL_HOST || "localhost",
    user: process.env.MYSQL_USER || "root",
    password: process.env.MYSQL_PASSWORD || "admin",
    database: process.env.MYSQL_DATABASE || "kalasa",
    port: Number(process.env.MYSQL_PORT) || 3306,
    connectionLimit: 10, // Limite pour éviter trop de connexions
  });

if (process.env.NODE_ENV !== "production") globalForMysql.pool = dbConnection;
