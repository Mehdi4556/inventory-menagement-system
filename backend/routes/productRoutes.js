const express = require("express");
const router = express.Router();
const {
  createProduct,
  getProducts,
  getProduct,
  updateProduct,
  deleteProduct,
} = require("../controllers/productController");

// @route   POST /products
// @desc    Create a new product
// @access  Private (JWT required)
router.post("/", createProduct);

// @route   GET /products
// @desc    Get all products with optional filters
// @access  Private (JWT required)
router.get("/", getProducts);

// @route   GET /products/:id
// @desc    Get a single product by ID
// @access  Private (JWT required)
router.get("/:id", getProduct);

// @route   PUT /products/:id
// @desc    Update a product
// @access  Private (JWT required)
router.put("/:id", updateProduct);

// @route   DELETE /products/:id
// @desc    Delete a product
// @access  Private (JWT required)
router.delete("/:id", deleteProduct);

module.exports = router;