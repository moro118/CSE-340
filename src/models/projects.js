import db from './db.js'

const getAllProjects = async() => {
    const query = `
        SELECT p.project_id, p.title, p.description, p.location, p.schedule, p.organization_id, o.name as org_name
        FROM public.projects p
        JOIN public.organizations o ON p.organization_id = o.organization_id
        ORDER BY p.title ASC;
    `;

    const result = await db.query(query);

    return result.rows;
}

const getProjectsByOrganizationId = async (organizationId) => {
    const query = `
      SELECT
        project_id,
        organization_id,
        title,
        description,
        location,
        schedule AS date
      FROM public.projects
      WHERE organization_id = $1
      ORDER BY schedule;
    `;
    
    const queryParams = [organizationId];
    const result = await db.query(query, queryParams);

    return result.rows;
};

// Export the model functions
export { getAllProjects, getProjectsByOrganizationId };
