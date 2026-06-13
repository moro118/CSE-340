import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import db from './db.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const rebuildDatabase = async () => {
    try {
        const sqlPath = path.join(__dirname, '../setup.sql');
        const sql = fs.readFileSync(sqlPath, 'utf8');
        
        console.log('Rebuilding database...');
        await db.query(sql);
        console.log('Database rebuilt successfully.');
        
        await db.close();
        process.exit(0);
    } catch (error) {
        console.error('Database rebuild failed:', error.message);
        process.exit(1);
    }
};

rebuildDatabase();
