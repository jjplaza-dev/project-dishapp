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
    const limit = 12;
    const from = (page - 1) * limit;
    const to = from + limit - 1;

    let query = supabase
      .from('recipes')
      .select('*', { count: 'exact' });

    const terms = ingredientsStr.split(',').map(t => t.trim().toLowerCase()).filter(Boolean);
    
    if (terms.length > 0) {
      if (terms.length === 1) {
        // Search in both Title and Ingredients for single term
        const term = terms[0];
        query = query.or(`Title.ilike.%${term}%,Cleaned_Ingredients.ilike.%${term}%`);
      } else {
        // Multi-term: use first term for database-side filter on Ingredients
        query = query.ilike('Cleaned_Ingredients', `%${terms[0]}%`);
      }
    }

    const { data, count, error } = await query.range(from, to);
    
    if (error) throw error;
    
    let processedData = data || [];
    
    // Additional server-side filtering for multiple terms
    if (terms.length > 1) {
      processedData = processedData.filter(recipe => {
        const ingredients = (recipe.Cleaned_Ingredients || "").toLowerCase();
        const title = (recipe.Title || "").toLowerCase();
        return terms.every(term => ingredients.includes(term) || title.includes(term));
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
