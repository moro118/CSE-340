import bcrypt from 'bcryptjs';
import { registerUser, getUserByEmail, getAllUsers } from '../models/account-model.js';
import { getVolunteeredProjects } from '../models/projects.js';

// Show register form view
const showRegisterForm = async (req, res) => {
    const title = 'Register Account';
    res.render('account/register', { title });
};

// Process new user registration
const processRegisterForm = async (req, res) => {
    const { firstName, lastName, email, password } = req.body;
    const title = 'Register Account';

    // Simple validation checks
    if (!firstName || !lastName || !email || !password) {
        req.flash('error', 'All fields are required.');
        return res.render('account/register', { title, firstName, lastName, email });
    }

    if (password.length < 6) {
        req.flash('error', 'Password must be at least 6 characters.');
        return res.render('account/register', { title, firstName, lastName, email });
    }

    try {
        const existingUser = await getUserByEmail(email);
        if (existingUser) {
            req.flash('error', 'That email is already registered.');
            return res.render('account/register', { title, firstName, lastName, email });
        }

        // Secure password hashing
        const passwordHash = await bcrypt.hash(password, 10);
        await registerUser(firstName, lastName, email, passwordHash);

        req.flash('success', 'Registration successful! Please log in.');
        res.redirect('/login');
    } catch (error) {
        console.error('Registration error:', error.message);
        req.flash('error', 'Registration failed. Please try again.');
        res.render('account/register', { title, firstName, lastName, email });
    }
};

// Show login form view
const showLoginForm = async (req, res) => {
    const title = 'Login';
    res.render('account/login', { title });
};

// Process user login
const processLoginForm = async (req, res) => {
    const { email, password } = req.body;
    const title = 'Login';

    if (!email || !password) {
        req.flash('error', 'Please enter email and password.');
        return res.render('account/login', { title, email });
    }

    try {
        const user = await getUserByEmail(email);
        if (!user) {
            req.flash('error', 'Invalid email or password.');
            return res.render('account/login', { title, email });
        }

        // Verify password against stored hash
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            req.flash('error', 'Invalid email or password.');
            return res.render('account/login', { title, email });
        }

        // Store user payload in session
        req.session.user = {
            user_id: user.user_id,
            first_name: user.first_name,
            last_name: user.last_name,
            email: user.email,
            role: user.role
        };

        req.flash('success', `Welcome back, ${user.first_name}!`);
        res.redirect('/dashboard');
    } catch (error) {
        console.error('Login error:', error.message);
        req.flash('error', 'Login error. Please try again.');
        res.render('account/login', { title, email });
    }
};

// Process user logout
const processLogout = async (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.error('Logout error:', err.message);
        }
        res.redirect('/');
    });
};

// Show personalized dashboard view
const showDashboard = async (req, res, next) => {
    const title = 'Account Dashboard';
    try {
        const volunteeredProjects = await getVolunteeredProjects(req.session.user.user_id);
        res.render('account/dashboard', { title, volunteeredProjects });
    } catch (error) {
        next(error);
    }
};

// Show registered users list (restricted to admins)
const showUsersPage = async (req, res) => {
    const title = 'Registered Users List';
    try {
        const users = await getAllUsers();
        res.render('account/users', { title, users });
    } catch (error) {
        console.error('Error fetching users:', error.message);
        req.flash('error', 'Failed to retrieve users.');
        res.redirect('/dashboard');
    }
};

export {
    showRegisterForm,
    processRegisterForm,
    showLoginForm,
    processLoginForm,
    processLogout,
    showDashboard,
    showUsersPage
};
