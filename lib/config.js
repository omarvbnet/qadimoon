
const config = {
    database: {
        host: process.env.DB_HOST || 'localhost',
        user: process.env.DB_USER || 'root',
        password: process.env.DB_PASSWORD || '',
        database: process.env.DB_NAME || 'qademoon',
        connectionLimit: parseInt(process.env.DB_CONNECTION_LIMIT) || 10
    }
};

export default config;