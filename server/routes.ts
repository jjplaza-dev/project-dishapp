import type { Express } from "express";
import { type Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";

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
      
      let processedData = [...data];
      if (input.sortByCount) {
        const getCount = (r: any) => {
          try {
            const ingredients = typeof r.Cleaned_Ingredients === 'string' 
              ? JSON.parse(r.Cleaned_Ingredients.replace(/'/g, '"'))
              : r.Cleaned_Ingredients;
            return Array.isArray(ingredients) ? ingredients.length : 0;
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
        totalPages: Math.ceil(total / 12), // Updated to 12
      });
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({ message: err.errors[0].message });
      }
      console.error("Search error:", err);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.get(api.recipes.get.path, async (req, res) => {
    const id = Number(req.params.id);
    if (isNaN(id)) return res.status(400).json({ message: "Invalid ID" });
    try {
      const recipe = await storage.getRecipe(id);
      if (!recipe) return res.status(404).json({ message: "Recipe not found" });
      res.status(200).json(recipe);
    } catch (err) {
      console.error("Get recipe error:", err);
      res.status(500).json({ message: "Error fetching recipe" });
    }
  });

  app.get(api.recipes.getBatch.path, async (req, res) => {
    try {
      const input = api.recipes.getBatch.input!.parse(req.query);
      if (!input.ids) return res.status(200).json([]);
      const ids = input.ids.split(',').map(Number).filter(n => !isNaN(n));
      const data = await storage.getRecipesBatch(ids);
      res.status(200).json(data);
    } catch (err) {
      console.error("Batch error:", err);
      res.status(400).json({ message: "Invalid request" });
    }
  });

  return httpServer;
}
