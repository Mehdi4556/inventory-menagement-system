const Category = require("../models/Category");

// @desc    Create a new category
// @route   POST /categories
// @access  Public
const createCategory = async (req, res) => {
  try {
    const { name } = req.body;

    // Validate required fields
    if (!name) {
      return res.status(400).json({
        success: false,
        message: "Please provide category name",
      });
    }

    // Check if category already exists
    const existingCategory = await Category.findOne({ 
      name: { $regex: `^${name}$`, $options: "i" } 
    });
    
    if (existingCategory) {
      return res.status(400).json({
        success: false,
        message: "Category already exists",
      });
    }

    // Create category
    const category = new Category({ name });
    await category.save();

    res.status(201).json({
      success: true,
      message: "Category created successfully",
      data: category,
    });
  } catch (error) {
    // Handle validation errors
    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((err) => err.message);
      return res.status(400).json({
        success: false,
        message: "Validation error",
        errors: messages,
      });
    }

    // Handle duplicate key error
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: "Category already exists",
      });
    }

    console.error("Create category error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// @desc    Get all categories
// @route   GET /categories
// @access  Public
const getCategories = async (req, res) => {
  try {
    const { page = 1, limit = 20, search } = req.query;

    // Build filter object
    const filter = {};

    // Search by name if provided
    if (search) {
      filter.name = { $regex: search, $options: "i" };
    }

    // Calculate pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    // Get total count for pagination
    const total = await Category.countDocuments(filter);
    
    // Get categories with pagination
    const categories = await Category.find(filter)
      .sort({ name: 1 }) // Sort alphabetically by name
      .skip(skip)
      .limit(parseInt(limit));

    res.status(200).json({
      success: true,
      data: categories,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit)),
      },
    });
  } catch (error) {
    console.error("Get categories error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

module.exports = {
  createCategory,
  getCategories,
};