import { supabase } from "./supabase";

export interface IStorage {
  searchRecipes(
    ingredients: string,
    page: number,
    sortByCount?: string
  ): Promise<{ data: any[], total: number }>;
  getRecipe(id: number): Promise<any | undefined>;
  getRecipesBatch(ids: number[]): Promise<any[]>;
}

export class SupabaseStorage implements IStorage {
  async searchRecipes(
    ingredientsStr: string,
    page: number,
    sortByCount?: string
  ) {
    const limit = 10;
    const from = (page - 1) * limit;
    const to = from + limit - 1;

    let query = supabase
      .from('recipes')
      .select('*', { count: 'exact' });

    if (ingredientsStr) {
      const terms = ingredientsStr.split(',').map(t => t.trim()).filter(Boolean);
      if (terms.length > 0) {
        // Simple search across cleaned ingredients
        // Supabase/PostgREST doesn't support easy "all terms must match" without complex filtering
        // We'll use a text search or multiple ILIKEs if possible, or filter locally if needed.
        // For now, let's use the first term as a primary filter and refine.
        query = query.ilike('Cleaned_Ingredients', `%${terms[0]}%`);
      }
    }

    const { data, count, error } = await query.range(from, to);
    
    if (error) throw error;
    
    let processedData = data || [];
    
    // Additional filtering for all terms if multiple terms provided
    const terms = ingredientsStr.split(',').map(t => t.trim().toLowerCase()).filter(Boolean);
    if (terms.length > 1) {
      processedData = processedData.filter(recipe => {
        const ingredients = recipe.Cleaned_Ingredients.toLowerCase();
        return terms.every(term => ingredients.includes(term));
      });
    }

    return { data: processedData, total: count || 0 };
  }

  async getRecipe(id: number) {
    const { data, error } = await supabase
      .from('recipes')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) return undefined;
    return data;
  }

  async getRecipesBatch(ids: number[]) {
    if (ids.length === 0) return [];
    const { data, error } = await supabase
      .from('recipes')
      .select('*')
      .in('id', ids);
    
    if (error) return [];
    return data || [];
  }
}

export const storage = new SupabaseStorage();
