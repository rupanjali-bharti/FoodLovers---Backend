const express = require('express');
const router = express.Router();
const Recipe = require('../models/Recipe');

// ✅ GET all recipes
// GET all or filtered recipes
router.get("/", async (req, res) => {
  try {
    const { type } = req.query;
    let query = {};
    if (type && type !== "all") {
      query.type = type;
    }
    const recipes = await Recipe.find(query);
    res.json(recipes);
  } catch (err) {
    res.status(500).json({ message: "Error fetching recipes" });
  }
});


// ✅ GET recipe by ID
router.get('/:id', async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);
    if (!recipe) return res.status(404).json({ error: 'Recipe not found' });
    res.json(recipe);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// POST /api/recipes -> Add new recipe
router.post("/", async (req, res) => {
  try {
    const { name, ingredients, instructions } = req.body;

    // Convert comma-separated string to array if needed
    const ingredientArray = Array.isArray(ingredients)
      ? ingredients
      : ingredients.split(",").map((item) => item.trim());

    const newRecipe = new Recipe({
      name,
      ingredients: ingredientArray,
      instructions,
    });

    const savedRecipe = await newRecipe.save();
    res.status(201).json(savedRecipe);
  } catch (err) {
    res.status(400).json({ error: "Failed to add recipe" });
  }
});


// ✅ DELETE recipe by ID
router.delete('/:id', async (req, res) => {
  try {
    const recipe = await Recipe.findByIdAndDelete(req.params.id);
    if (!recipe) return res.status(404).json({ error: 'Recipe not found' });

    res.json({ message: 'Recipe deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// PUT update recipe
router.put("/:id", async (req, res) => {
  try {
    const { name, ingredients, instructions, type } = req.body;
    const updatedRecipe = await Recipe.findByIdAndUpdate(
      req.params.id,
      { name, ingredients, instructions, type },
      { new: true }
    );
    res.json(updatedRecipe);
  } catch (err) {
    res.status(500).json({ message: "Error updating recipe", error: err });
  }
});



module.exports = router;
