import { pgTable, text, serial } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const recipes = pgTable("recipes", {
  id: serial("id").primaryKey(),
  Title: text("Title").notNull(),
  Ingredients: text("Ingredients").notNull(),
  Instructions: text("Instructions").notNull(),
  Image_Name: text("Image_Name").notNull(),
  Cleaned_Ingredients: text("Cleaned_Ingredients").notNull(),
});

export const insertRecipeSchema = createInsertSchema(recipes).omit({ id: true });

export type Recipe = typeof recipes.$inferSelect;
export type InsertRecipe = z.infer<typeof insertRecipeSchema>;
