/**
 * Authentication and Authorization Middleware for CSE 340.
 * Follows arrow function notation and ESM standards.
 */

// Middleware to ensure user is logged in
const requireLogin = (req, res, next) => {
    if (!req.session.user) {
        req.flash('error', 'You must be logged in to access that page.');
        return res.redirect('/login');
    }
    next();
};

// Middleware to ensure user has a specific role (e.g., admin)
const requireRole = (requiredRole) => {
    return (req, res, next) => {
        if (!req.session.user) {
            req.flash('error', 'You must be logged in to access that page.');
            return res.redirect('/login');
        }
        if (req.session.user.role !== requiredRole) {
            req.flash('error', 'You do not have permission to access that page.');
            return res.redirect('/dashboard');
        }
        next();
    };
};

// Middleware to set user session context in EJS views
const setUserContext = (req, res, next) => {
    res.locals.user = req.session.user || null;
    next();
};

export { requireLogin, requireRole, setUserContext };
