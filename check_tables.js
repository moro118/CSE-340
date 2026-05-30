import db from './src/models/db.js';

async function main() {
    try {
        const res = await db.query(`
            SELECT table_name 
            FROM information_schema.tables 
            WHERE table_schema = 'public'
        `);
        console.log("Tables in database:", res.rows);
        await db.close();
    } catch (e) {
        console.error("Error querying tables:", e);
    }
}

main();
