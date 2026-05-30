import fs from 'fs';
import db from './src/models/db.js';

async function main() {
    try {
        const sql = fs.readFileSync('./src/setup.sql', 'utf8');
        console.log("Executing setup.sql...");
        await db.query(sql);
        console.log("Database tables created and populated successfully!");
    } catch (error) {
        console.error("Failed to run setup.sql:", error);
    } finally {
        // Since db is a pool or wrapped object, let's exit the process to release connections
        process.exit(0);
    }
}

main();
