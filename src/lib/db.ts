import mysql from 'mysql2/promise'

export const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  enableKeepAlive: true,
  keepAliveInitialDelay: 0
})

export async function query(sql: string, params?: any[]) {
  try {
    const [results] = await pool.query(sql, params)
    return results
  } catch (error) {
    console.error('Database query error:', error)
    throw error
  }
}

export const db = {
  query,
  pool
}