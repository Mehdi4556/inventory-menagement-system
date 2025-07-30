const Product = require("../models/Product");
const Category = require("../models/Category");
const mongoose = require("mongoose");

// @desc    Create a new product
// @route   POST /products
// @access  Private
const createProduct = async (req, res) => {
  try {
    const { name, price, categoryId, inStock } = req.body;

    // Validate required fields
    if (!name || price === undefined || !categoryId) {
      return res.status(400).json({
        success: false,
        message: "Please provide name, price, and categoryId",
      });
    }

    // Check if category exists
    const category = await Category.findById(categoryId);
    if (!category) {
      return res.status(400).json({
        success: false,
        message: "Category not found",
      });
    }

    // Create product
    const product = new Product({
      name,
      price,
      categoryId,
      inStock: inStock !== undefined ? inStock : true,
    });

    await product.save();

    // Populate category information
    await product.populate('categoryId', 'name');

    res.status(201).json({
      success: true,
      message: "Product created successfully",
      data: product,
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

    console.error("Create product error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// @desc    Get all products with optional filters
// @route   GET /products
// @access  Private
const getProducts = async (req, res) => {
  try {
    const { name, category, inStock, page = 1, limit = 10 } = req.query;

    // Build filter object
    const filter = {};

    // Filter by name (case-insensitive partial match)
    if (name) {
      filter.name = { $regex: name, $options: "i" };
    }

    // Filter by category
    if (category) {
      // If category is provided, find the category by name first
      const categoryDoc = await Category.findOne({ 
        name: { $regex: category, $options: "i" } 
      });
      if (categoryDoc) {
        filter.categoryId = categoryDoc._id;
      } else {
        // If category not found, return empty results
        return res.status(200).json({
          success: true,
          data: [],
          pagination: {
            page: parseInt(page),
            limit: parseInt(limit),
            total: 0,
            pages: 0,
          },
        });
      }
    }

    // Filter by stock status
    if (inStock !== undefined) {
      filter.inStock = inStock === "true";
    }

    // Calculate pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    // Get total count for pagination
    const total = await Product.countDocuments(filter);
    
    // Get products with pagination and populate category
    const products = await Product.find(filter)
      .populate('categoryId', 'name')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    res.status(200).json({
      success: true,
      data: products,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit)),
      },
    });
  } catch (error) {
    console.error("Get products error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// @desc    Get a single product by ID
// @route   GET /products/:id
// @access  Private
const getProduct = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid product ID",
      });
    }

    const product = await Product.findById(id).populate('categoryId', 'name');

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    res.status(200).json({
      success: true,
      data: product,
    });
  } catch (error) {
    console.error("Get product error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// @desc    Update a product
// @route   PUT /products/:id
// @access  Private
const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, price, categoryId, inStock } = req.body;

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid product ID",
      });
    }

    // If categoryId is provided, check if it exists
    if (categoryId) {
      const category = await Category.findById(categoryId);
      if (!category) {
        return res.status(400).json({
          success: false,
          message: "Category not found",
        });
      }
    }

    // Build update object (only include provided fields)
    const updateData = {};
    if (name !== undefined) updateData.name = name;
    if (price !== undefined) updateData.price = price;
    if (categoryId !== undefined) updateData.categoryId = categoryId;
    if (inStock !== undefined) updateData.inStock = inStock;

    const product = await Product.findByIdAndUpdate(
      id,
      updateData,
      {
        new: true,
        runValidators: true,
      }
    ).populate('categoryId', 'name');

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Product updated successfully",
      data: product,
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

    console.error("Update product error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// @desc    Delete a product
// @route   DELETE /products/:id
// @access  Private
const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid product ID",
      });
    }

    const product = await Product.findByIdAndDelete(id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (error) {
    console.error("Delete product error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

module.exports = {
  createProduct,
  getProducts,
  getProduct,
  updateProduct,
  deleteProduct,
};