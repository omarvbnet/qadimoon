import mysql from 'mysql2/promise';
import config from './config';

 const db = mysql.createPool(config.database);
 export default db;
