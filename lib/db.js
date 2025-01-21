import mysql from 'mysql2/promise';

const pool = mysql.createPool({
  host: '66.23.226.51',
  user: 'usmartco_qademoon',
  password: 'EYf2ucbwSeUBxBJVgf34',
  database: 'usmartco_qademoon',
});

export default pool;