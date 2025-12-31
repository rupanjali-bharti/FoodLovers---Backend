const mongoose = require("mongoose");

const RecipeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  ingredients: {
    type: [String],
    required: true,
  },
  instructions: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    enum: ["Veg", "Non-Veg"],
    required: true,
    default: "Veg",
  },
});

module.exports = mongoose.model("Recipe", RecipeSchema);
