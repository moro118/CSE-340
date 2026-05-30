// Import any needed model functions
import { getAllCategories, getCategoryDetails, getProjectsByCategoryId } from '../models/categories.js';

// Define any controller functions
const showCategoriesPage = async (req, res, next) => {
    try {
        const categories = await getAllCategories();
        const title = 'Service Categories';

        res.render('categories', { title, categories });
    } catch (error) {
        next(error);
    }
};  

const showCategoryDetailsPage = async (req, res, next) => {
    try {
        const categoryId = req.params.id;
        const category = await getCategoryDetails(categoryId);
        if (!category) {
            const err = new Error('Category Not Found');
            err.status = 404;
            return next(err);
        }
        const projects = await getProjectsByCategoryId(categoryId);
        const title = category.name;
        res.render('category', { title, category, projects });
    } catch (error) {
        next(error);
    }
};

// Export any controller functions
export { showCategoriesPage, showCategoryDetailsPage };
