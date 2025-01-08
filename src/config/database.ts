export const dbConfig = {
  host: 'localhost',
  user: 'root',
  password: '123456',
  database: process.env.DB_NAME || 'app_download_center',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  charset: 'utf8mb4',
  multipleStatements: true,
  acquireTimeout: 30000
} 