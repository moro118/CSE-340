import db from './db.js';

/**
 * Register a new user in the database.
 * Uses arrow notation and async/await as required.
 */
const registerUser = async (firstName, lastName, email, passwordHash) => {
    const query = `
        INSERT INTO public.users (first_name, last_name, email, password, role)
        VALUES ($1, $2, $3, $4, 'user')
        RETURNING *;
    `;
    const result = await db.query(query, [firstName, lastName, email, passwordHash]);
    return result.rows[0];
};

/**
 * Get user information by their unique email.
 */
const getUserByEmail = async (email) => {
    const query = `
        SELECT user_id, first_name, last_name, email, password, role
        FROM public.users
        WHERE email = $1;
    `;
    const result = await db.query(query, [email]);
    return result.rows.length > 0 ? result.rows[0] : null;
};

/**
 * Retrieve all registered users sorted by last name, then first name.
 */
const getAllUsers = async () => {
    const query = `
        SELECT user_id, first_name, last_name, email, role
        FROM public.users
        ORDER BY last_name, first_name;
    `;
    const result = await db.query(query);
    return result.rows;
};

export { registerUser, getUserByEmail, getAllUsers };
