const Category = require('../models/Category');
const ResponseHelper = require('../utils/responseHelper');

class CategoryController {
  /**
   * Get all categories
   * GET /categories
   */
  static async getAll(req, res, next) {
    try {
      const { type, is_active } = req.query;
      const filters = {};
      
      if (type) filters.type = type;
      if (is_active !== undefined) filters.is_active = parseInt(is_active);

      const categories = await Category.getAll(filters);
      
      return ResponseHelper.success(res, 'Categories retrieved successfully', { categories });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get category by ID
   * GET /categories/:id
   */
  static async getById(req, res, next) {
    try {
      const { id } = req.params;
      const category = await Category.getWithSummary(id);
      
      if (!category) {
        return ResponseHelper.notFound(res, 'Category not found');
      }

      return ResponseHelper.success(res, 'Category retrieved successfully', { category });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Create new category
   * POST /categories
   */
  static async create(req, res, next) {
    try {
      const { name, type, description, is_active } = req.body;

      const categoryId = await Category.create({
        name,
        type,
        description,
        is_active
      });

      const category = await Category.findById(categoryId);

      return ResponseHelper.success(
        res,
        'Category created successfully',
        { category },
        201
      );
    } catch (error) {
      next(error);
    }
  }

  /**
   * Update category
   * PUT /categories/:id
   */
  static async update(req, res, next) {
    try {
      const { id } = req.params;
      const { name, type, description, is_active } = req.body;

      // Check if category exists
      const existingCategory = await Category.findById(id);
      if (!existingCategory) {
        return ResponseHelper.notFound(res, 'Category not found');
      }

      await Category.update(id, {
        name,
        type,
        description,
        is_active
      });

      const category = await Category.findById(id);

      return ResponseHelper.success(res, 'Category updated successfully', { category });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Delete category
   * DELETE /categories/:id
   */
  static async delete(req, res, next) {
    try {
      const { id } = req.params;

      // Check if category exists
      const existingCategory = await Category.findById(id);
      if (!existingCategory) {
        return ResponseHelper.notFound(res, 'Category not found');
      }

      // Try to delete (will fail if there are related transactions due to FK constraint)
      await Category.delete(id);

      return ResponseHelper.success(res, 'Category deleted successfully');
    } catch (error) {
      next(error);
    }
  }
}

module.exports = CategoryController;
