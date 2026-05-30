-- Drop tables if they exist to allow clean recreation
DROP TABLE IF EXISTS project_categories CASCADE;
DROP TABLE IF EXISTS categories CASCADE;
DROP TABLE IF EXISTS projects CASCADE;
DROP TABLE IF EXISTS organizations CASCADE;

-- Create organizations table
CREATE TABLE organizations (
    organization_id SERIAL PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    description TEXT NOT NULL,
    contact_email VARCHAR(255) NOT NULL,
    logo_filename VARCHAR(255) NOT NULL
);

-- Insert organizations
INSERT INTO organizations (name, description, contact_email, logo_filename)
VALUES 
(
    'BrightFuture Builders', 
    'A nonprofit focused on improving community infrastructure through sustainable construction projects.', 
    'info@brightfuturebuilders.org', 
    'brightfuture-logo.png'
),
(
    'GreenHarvest Growers', 
    'An urban farming collective promoting food sustainability and education in local neighborhoods.', 
    'contact@greenharvest.org', 
    'greenharvest-logo.png'
),
(
    'UnityServe Volunteers', 
    'A volunteer coordination group supporting local charities and service initiatives.', 
    'hello@unityserve.org', 
    'unityserve-logo.png'
),
(
    'CSE 340 Service Network',
    'A university network connecting student volunteers with impactful local community initiatives.',
    'service-network@cse340.edu',
    'cse340-service-network.png'
);

-- Create projects table
CREATE TABLE projects (
    project_id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    location VARCHAR(255) NOT NULL,
    schedule VARCHAR(255) NOT NULL,
    organization_id INT REFERENCES organizations(organization_id) ON DELETE CASCADE
);

-- Insert projects
INSERT INTO projects (title, description, location, schedule, organization_id)
VALUES
(
    'Community Reforestation',
    'Help plant native saplings and restore the green canopy in city parks to improve air quality and enhance local biodiversity.',
    'Central Park',
    'Saturdays',
    2
),
(
    'After-School Math Tutoring',
    'Provide targeted homework assistance and support mathematical concept building for middle-school students.',
    'Community Center',
    'Mon & Wed',
    1
),
(
    'Neighborhood Food Drive',
    'Organize, sort, and distribute nutritious pantry staples and fresh produce to vulnerable families in the local area.',
    'East Side Depot',
    'Thursdays',
    3
),
(
    'Senior Mobility Companionship',
    'Lead gentle stretching exercises, walking clubs, and offer friendly companionship to residents at the local retirement home.',
    'Silver Pines Home',
    'Fri Mornings',
    4
);

-- Create categories table
CREATE TABLE categories (
    category_id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE
);

-- Insert categories
INSERT INTO categories (name)
VALUES
('Environmental'),
('Educational'),
('Community Service'),
('Health & Wellness');

-- Create project_categories junction table for many-to-many relationship
CREATE TABLE project_categories (
    project_id INT REFERENCES projects(project_id) ON DELETE CASCADE,
    category_id INT REFERENCES categories(category_id) ON DELETE CASCADE,
    PRIMARY KEY (project_id, category_id)
);

-- Associate projects with categories
INSERT INTO project_categories (project_id, category_id)
VALUES
(1, 1), -- Community Reforestation (Environmental)
(2, 2), -- After-School Math Tutoring (Educational)
(3, 3), -- Neighborhood Food Drive (Community Service)
(4, 4); -- Senior Mobility Companionship (Health & Wellness)
