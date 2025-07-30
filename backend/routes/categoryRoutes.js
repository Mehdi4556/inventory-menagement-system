const express = require("express");
const router = express.Router();
const { createCategory, getCategories } = require("../controllers/categoryController");

// @route   POST /categories
// @desc    Create a new category
// @access  Public
router.post("/", createCategory);

// @route   GET /categories
// @desc    Get all categories
// @access  Public
router.get("/", getCategories);

module.exports = router;