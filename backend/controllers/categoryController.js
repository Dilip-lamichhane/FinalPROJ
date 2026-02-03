const Category = require('../models/Category');
const { validationResult } = require('express-validator');

// Create a new category
const createCategory = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, description, parent, color } = req.body;

    // Check if category name already exists
    const existingCategory = await Category.findOne({ name: name.toLowerCase() });
    if (existingCategory) {
      return res.status(400).json({ error: 'Category name already exists' });
    }

    // If parent category is provided, validate it exists
    if (parent) {
      const parentCategory = await Category.findById(parent);
      if (!parentCategory) {
        return res.status(400).json({ error: 'Parent category not found' });
      }
    }

    const category = new Category({
      name: name.toLowerCase(),
      description: description?.trim() || '',
      parent: parent || null,
      color: color || '#6B7280'
    });

    await category.save();
    
    // Populate parent category if exists
    if (category.parent) {
      await category.populate('parent', 'name');
    }

    res.status(201).json({ message: 'Category created successfully', category });
  } catch (error) {
    console.error('Create category error:', error);
    res.status(500).json({ error: 'Failed to create category' });
  }
};

// Get all categories (with optional parent filtering)
const getCategories = async (req, res) => {
  try {
    const { parent, includeInactive } = req.query;
    
    let query = {};
    
    // Filter by parent category
    if (parent !== undefined) {
      if (parent === 'null') {
        query.parent = null; // Top-level categories
      } else if (parent) {
        query.parent = parent;
      }
    }

    // Only include inactive categories if explicitly requested by admin
    if (includeInactive !== 'true') {
      query.isActive = true;
    }

    const categories = await Category.find(query)
      .populate('parent', 'name')
      .sort({ name: 1 });

    res.json({ categories });
  } catch (error) {
    console.error('Get categories error:', error);
    res.status(500).json({ error: 'Failed to fetch categories' });
  }
};

// Get category by ID
const getCategoryById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const category = await Category.findById(id)
      .populate('parent', 'name description');

    if (!category) {
      return res.status(404).json({ error: 'Category not found' });
    }

    res.json({ category });
  } catch (error) {
    console.error('Get category by ID error:', error);
    res.status(500).json({ error: 'Failed to fetch category' });
  }
};

// Update category
const updateCategory = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { id } = req.params;
    const { name, description, parent, color, isActive } = req.body;

    const category = await Category.findById(id);
    if (!category) {
      return res.status(404).json({ error: 'Category not found' });
    }

    // Check if new name already exists (excluding current category)
    if (name && name.toLowerCase() !== category.name) {
      const existingCategory = await Category.findOne({ 
        name: name.toLowerCase(),
        _id: { $ne: id }
      });
      if (existingCategory) {
        return res.status(400).json({ error: 'Category name already exists' });
      }
    }

    // Validate parent category if provided
    if (parent !== undefined) {
      if (parent === null) {
        category.parent = null;
      } else {
        const parentCategory = await Category.findById(parent);
        if (!parentCategory) {
          return res.status(400).json({ error: 'Parent category not found' });
        }
        // Prevent circular reference
        if (parentCategory._id.toString() === id) {
          return res.status(400).json({ error: 'Category cannot be its own parent' });
        }
        category.parent = parent;
      }
    }

    // Update fields
    if (name) category.name = name.toLowerCase();
    if (description !== undefined) category.description = description?.trim() || '';
    if (color) category.color = color;
    if (isActive !== undefined) category.isActive = isActive;

    await category.save();
    
    // Populate parent category if exists
    if (category.parent) {
      await category.populate('parent', 'name');
    }

    res.json({ message: 'Category updated successfully', category });
  } catch (error) {
    console.error('Update category error:', error);
    res.status(500).json({ error: 'Failed to update category' });
  }
};

// Delete category (soft delete)
const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;

    const category = await Category.findById(id);
    if (!category) {
      return res.status(404).json({ error: 'Category not found' });
    }

    // Check if category has child categories
    const childCategories = await Category.find({ parent: id, isActive: true });
    if (childCategories.length > 0) {
      return res.status(400).json({ 
        error: 'Cannot delete category with active subcategories',
        childCategories: childCategories.map(cat => ({ id: cat._id, name: cat.name }))
      });
    }

    // Check if category is being used by products
    const Product = require('../models/Product');
    const productsUsingCategory = await Product.find({ 
      category: id, 
      isActive: true 
    }).limit(5);
    
    if (productsUsingCategory.length > 0) {
      return res.status(400).json({ 
        error: 'Cannot delete category that is being used by active products',
        products: productsUsingCategory.map(prod => ({ id: prod._id, name: prod.name }))
      });
    }

    // Soft delete the category
    category.isActive = false;
    await category.save();

    res.json({ message: 'Category deleted successfully' });
  } catch (error) {
    console.error('Delete category error:', error);
    res.status(500).json({ error: 'Failed to delete category' });
  }
};

// Get category hierarchy (tree structure)
const getCategoryHierarchy = async (req, res) => {
  try {
    const { includeInactive } = req.query;
    
    let query = {};
    if (includeInactive !== 'true') {
      query.isActive = true;
    }

    const categories = await Category.find(query)
      .populate('parent', 'name')
      .sort({ name: 1 });

    // Build hierarchy
    const categoryMap = {};
    const rootCategories = [];

    categories.forEach(category => {
      categoryMap[category._id.toString()] = {
        ...category.toObject(),
        children: []
      };
    });

    categories.forEach(category => {
      const categoryData = categoryMap[category._id.toString()];
      if (category.parent) {
        const parentId = category.parent._id.toString();
        if (categoryMap[parentId]) {
          categoryMap[parentId].children.push(categoryData);
        }
      } else {
        rootCategories.push(categoryData);
      }
    });

    res.json({ hierarchy: rootCategories });
  } catch (error) {
    console.error('Get category hierarchy error:', error);
    res.status(500).json({ error: 'Failed to fetch category hierarchy' });
  }
};

module.exports = {
  createCategory,
  getCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
  getCategoryHierarchy
};