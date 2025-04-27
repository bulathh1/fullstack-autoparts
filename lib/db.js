import mysql from 'mysql2/promise';

const pool = mysql.createPool({
  connectionLimit: 5,
  host: "localhost",
  user: "root",
  database: "AutoPartsStore",
  password: "Student"
});

export default pool;