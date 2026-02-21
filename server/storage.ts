import { db } from "./db";
import { recipes } from "@shared/schema";
import { eq, inArray, or, sql } from "drizzle-orm";

export interface IStorage {
  searchRecipes(
    ingredients: string,
    page: number,
    sortByCount?: string
  ): Promise<{ data: typeof recipes.$inferSelect[], total: number }>;
  getRecipe(id: number): Promise<typeof recipes.$inferSelect | undefined>;
  getRecipesBatch(ids: number[]): Promise<typeof recipes.$inferSelect[]>;
}

export class DatabaseStorage implements IStorage {
  async searchRecipes(
    ingredientsStr: string,
    page: number,
    sortByCount?: string
  ) {
    const limit = 10;
    const offset = (page - 1) * limit;

    let query = db.select().from(recipes).$dynamic();
    let countQuery = db.select({ count: sql<number>`count(*)` }).from(recipes).$dynamic();

    if (ingredientsStr) {
      const terms = ingredientsStr.split(',').map(t => t.trim()).filter(Boolean);
      if (terms.length > 0) {
        const ilikeConditions = terms.map(term => sql`${recipes.Cleaned_Ingredients} ILIKE ${'%' + term + '%'}`);
        query = query.where(sql`${sql.join(ilikeConditions, sql` AND `)}`);
        countQuery = countQuery.where(sql`${sql.join(ilikeConditions, sql` AND `)}`);
      }
    }

    const totalRes = await countQuery;
    const total = Number(totalRes[0].count);

    query = query.limit(limit).offset(offset);
    
    const data = await query;
    return { data, total };
  }

  async getRecipe(id: number) {
    const [recipe] = await db.select().from(recipes).where(eq(recipes.id, id));
    return recipe;
  }

  async getRecipesBatch(ids: number[]) {
    if (ids.length === 0) return [];
    return await db.select().from(recipes).where(inArray(recipes.id, ids));
  }
}

export const storage = new DatabaseStorage();