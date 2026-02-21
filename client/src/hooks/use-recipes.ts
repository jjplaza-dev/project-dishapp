import { useQuery } from "@tanstack/react-query";
import { api, buildUrl } from "@shared/routes";
import { z } from "zod";

// Helper for constructing query string for array of inputs if needed, 
// though the schema defines it as a single string for batch IDs or ingredients
// We will adapt our hook arguments to match the schema expectations.

export function useSearchRecipes(params: { 
  ingredients?: string; 
  page?: number; 
  sortByCount?: "low-to-high" | "high-to-low" | "2-5" | "5-10" 
}) {
  const queryParams = new URLSearchParams();
  if (params.ingredients) queryParams.append("ingredients", params.ingredients);
  if (params.page) queryParams.append("page", params.page.toString());
  if (params.sortByCount) queryParams.append("sortByCount", params.sortByCount);

  return useQuery({
    queryKey: [api.recipes.search.path, params],
    queryFn: async () => {
      // Manually construct URL with query params since buildUrl handles path params primarily
      const url = `${api.recipes.search.path}?${queryParams.toString()}`;
      const res = await fetch(url);
      if (!res.ok) throw new Error("Failed to search recipes");
      return api.recipes.search.responses[200].parse(await res.json());
    },
    placeholderData: (previousData) => previousData, // Keep previous data while fetching new page
  });
}

export function useRecipe(id: number) {
  return useQuery({
    queryKey: [api.recipes.get.path, id],
    queryFn: async () => {
      const url = buildUrl(api.recipes.get.path, { id });
      const res = await fetch(url);
      if (res.status === 404) return null;
      if (!res.ok) throw new Error("Failed to fetch recipe");
      return api.recipes.get.responses[200].parse(await res.json());
    },
    enabled: !!id,
  });
}

export function useBatchRecipes(ids: number[]) {
  return useQuery({
    queryKey: [api.recipes.getBatch.path, ids],
    queryFn: async () => {
      if (ids.length === 0) return [];
      
      const params = new URLSearchParams();
      params.append("ids", ids.join(","));
      
      const url = `${api.recipes.getBatch.path}?${params.toString()}`;
      const res = await fetch(url);
      if (!res.ok) throw new Error("Failed to fetch batch recipes");
      return api.recipes.getBatch.responses[200].parse(await res.json());
    },
    enabled: ids.length > 0,
  });
}
