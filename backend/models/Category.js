const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Category name is required"],
      unique: true,
      trim: true,
      minlength: [2, "Category name must be at least 2 characters"],
      maxlength: [50, "Category name cannot exceed 50 characters"],
    },
  },
  {
    timestamps: true,
  }
);

// Add index for better query performance
categorySchema.index({ name: 1 });

module.exports = mongoose.model("Category", categorySchema);