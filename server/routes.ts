import type { Express } from "express";
import { type Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";
import { recipes } from "@shared/schema";
import { db } from "./db";
import { sql } from "drizzle-orm";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {

  app.get(api.recipes.search.path, async (req, res) => {
    try {
      const input = api.recipes.search.input!.parse(req.query);
      const page = input.page || 1;
      
      const { data, total } = await storage.searchRecipes(
        input.ingredients || "", 
        page,
        input.sortByCount
      );
      
      let processedData = data;
      if (input.sortByCount) {
        const getCount = (r: any) => {
          try {
            return r.Cleaned_Ingredients.split("', '").length;
          } catch(e) {
             return 0;
          }
        };
        
        if (input.sortByCount === "low-to-high") {
          processedData.sort((a, b) => getCount(a) - getCount(b));
        } else if (input.sortByCount === "high-to-low") {
          processedData.sort((a, b) => getCount(b) - getCount(a));
        } else if (input.sortByCount === "2-5") {
          processedData = processedData.filter(r => {
            const c = getCount(r);
            return c >= 2 && c <= 5;
          });
        } else if (input.sortByCount === "5-10") {
          processedData = processedData.filter(r => {
            const c = getCount(r);
            return c >= 5 && c <= 10;
          });
        }
      }

      res.status(200).json({
        data: processedData,
        total: total,
        page,
        totalPages: Math.ceil(total / 10),
      });
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({ message: err.errors[0].message });
      }
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.get(api.recipes.get.path, async (req, res) => {
    const id = Number(req.params.id);
    if (isNaN(id)) return res.status(400).json({ message: "Invalid ID" });
    const recipe = await storage.getRecipe(id);
    if (!recipe) return res.status(404).json({ message: "Recipe not found" });
    res.status(200).json(recipe);
  });

  app.get(api.recipes.getBatch.path, async (req, res) => {
    try {
      const input = api.recipes.getBatch.input!.parse(req.query);
      if (!input.ids) return res.status(200).json([]);
      const ids = input.ids.split(',').map(Number).filter(n => !isNaN(n));
      const data = await storage.getRecipesBatch(ids);
      res.status(200).json(data);
    } catch (err) {
      res.status(400).json({ message: "Invalid request" });
    }
  });

  await seedDatabase();

  return httpServer;
}

async function seedDatabase() {
  try {
    const existing = await db.select({ count: sql<number>`count(*)` }).from(recipes);
    if (Number(existing[0].count) === 0) {
      await db.insert(recipes).values([
        {
          Title: "Crispy Salt and Pepper Potatoes",
          Ingredients: "['2 large egg whites', '1 pound new potatoes', '2 teaspoons kosher salt', '¾ teaspoon finely ground black pepper', '1 teaspoon finely chopped rosemary', '1 teaspoon finely chopped thyme', '1 teaspoon finely chopped parsley']",
          Instructions: "Preheat oven to 400°F and line a rimmed baking sheet with parchment. In a large bowl, whisk the egg whites until foamy. Add the potatoes and toss until they’re well coated, then transfer to a strainer. Season with salt, pepper, and herbs. Scatter on the baking sheet and roast 15 to 20 minutes.\nTransfer to a bowl and serve.",
          Image_Name: "crispy-salt-and-pepper-potatoes-dan-kluger",
          Cleaned_Ingredients: "['2 large egg whites', '1 pound new potatoes', '2 teaspoons kosher salt', '¾ teaspoon finely ground black pepper', '1 teaspoon finely chopped rosemary', '1 teaspoon finely chopped thyme', '1 teaspoon finely chopped parsley']"
        },
        {
          Title: "Classic Adobo",
          Ingredients: "['1 whole chicken', '1/2 cup soy sauce', '1/3 cup vinegar', '1 head garlic', '3 bay leaves']",
          Instructions: "Combine all ingredients in a pot. Simmer until chicken is cooked.",
          Image_Name: "classic-adobo",
          Cleaned_Ingredients: "['1 whole chicken', '1/2 cup soy sauce', '1/3 cup vinegar', '1 head garlic', '3 bay leaves']"
        },
        {
          Title: "Simple Tomato Soup",
          Ingredients: "['1 can crushed tomatoes', '1 onion', '2 cloves garlic', '1 cup vegetable broth', 'salt']",
          Instructions: "Saute onion and garlic. Add tomatoes and broth. Simmer for 20 mins. Blend until smooth.",
          Image_Name: "simple-tomato-soup",
          Cleaned_Ingredients: "['1 can crushed tomatoes', '1 onion', '2 cloves garlic', '1 cup vegetable broth', 'salt']"
        }
      ]);
      console.log("Database seeded with recipes");
    }
  } catch (err) {
    console.error("Error seeding database:", err);
  }
}