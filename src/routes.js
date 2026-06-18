import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import db from './models/db.js';

import { showHomePage } from './controllers/index.js';
import { showOrganizationsPage, showOrganizationDetailsPage, showNewOrganizationForm, processNewOrganizationForm, organizationValidation, showEditOrganizationForm, processEditOrganizationForm } from './controllers/organizations.js';
import { showProjectsPage, showProjectDetailsPage, showNewProjectForm, processNewProjectForm, projectValidation, showEditProjectForm, processEditProjectForm, processVolunteerSignup, processVolunteerRemoval } from './controllers/projects.js';
import { showCategoriesPage, showCategoryDetailsPage, showAssignCategoriesForm, processAssignCategoriesForm, showNewCategoryForm, processNewCategoryForm, showEditCategoryForm, processEditCategoryForm, categoryValidation } from './controllers/categories.js';
import { showRegisterForm, processRegisterForm, showLoginForm, processLoginForm, processLogout, showDashboard, showUsersPage } from './controllers/account.js';
import { testErrorPage } from './controllers/errors.js';
import { requireLogin, requireRole } from './middleware/auth.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

// Temporary route to run setup.sql on Render
router.get('/run-db-setup', async (req, res) => {
    try {
        const sqlPath = path.join(__dirname, 'setup.sql');
        const sql = fs.readFileSync(sqlPath, 'utf8');
        await db.query(sql);
        res.send('Database setup executed successfully! You can now delete this route.');
    } catch (err) {
        res.status(500).send('Database setup failed: ' + err.message);
    }
});

router.get('/', showHomePage);
router.get('/organizations', showOrganizationsPage);
router.get('/projects', showProjectsPage);
router.get('/categories', showCategoriesPage);

// Account and Authentication Routes
router.get('/register', showRegisterForm);
router.post('/register', processRegisterForm);
router.get('/login', showLoginForm);
router.post('/login', processLoginForm);
router.get('/logout', processLogout);
router.get('/dashboard', requireLogin, showDashboard);
router.get('/users', requireLogin, requireRole('admin'), showUsersPage);

// Route for organization details page
router.get('/organization/:id', showOrganizationDetailsPage);

// Route for new organization page
router.get('/new-organization', requireLogin, requireRole('admin'), showNewOrganizationForm);

// Route to handle new organization form submission
router.post('/new-organization', requireLogin, requireRole('admin'), organizationValidation, processNewOrganizationForm);

// Route to display the edit organization form
router.get('/edit-organization/:id', requireLogin, requireRole('admin'), showEditOrganizationForm);

// Route to handle the edit organization form submission
router.post('/edit-organization/:id', requireLogin, requireRole('admin'), organizationValidation, processEditOrganizationForm);

// Route for new project page
router.get('/new-project', requireLogin, requireRole('admin'), showNewProjectForm);

// Route to handle new project form submission
router.post('/new-project', requireLogin, requireRole('admin'), projectValidation, processNewProjectForm);

// Route to display the edit project form
router.get('/edit-project/:id', requireLogin, requireRole('admin'), showEditProjectForm);

// Route to handle the edit project form submission
router.post('/edit-project/:id', requireLogin, requireRole('admin'), projectValidation, processEditProjectForm);

// Route for project details page
router.get('/project/:id', showProjectDetailsPage);

// Volunteer routes — require login
router.post('/volunteer/:projectId', requireLogin, processVolunteerSignup);
router.post('/unvolunteer/:projectId', requireLogin, processVolunteerRemoval);

// Routes to handle the assign categories to project form
router.get('/assign-categories/:projectId', requireLogin, requireRole('admin'), showAssignCategoriesForm);
router.post('/assign-categories/:projectId', requireLogin, requireRole('admin'), processAssignCategoriesForm);

// Route for new category page
router.get('/new-category', requireLogin, requireRole('admin'), showNewCategoryForm);

// Route to handle new category form submission
router.post('/new-category', requireLogin, requireRole('admin'), categoryValidation, processNewCategoryForm);

// Route to display the edit category form
router.get('/edit-category/:id', requireLogin, requireRole('admin'), showEditCategoryForm);

// Route to handle the edit category form submission
router.post('/edit-category/:id', requireLogin, requireRole('admin'), categoryValidation, processEditCategoryForm);


// Route for category details page
router.get('/category/:id', showCategoryDetailsPage);

// error-handling routes
router.get('/test-error', testErrorPage);


export default router;

