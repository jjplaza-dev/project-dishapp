import { z } from "zod";
import { recipes } from "./schema";

export const errorSchemas = {
  notFound: z.object({
    message: z.string(),
  }),
  validation: z.object({
    message: z.string(),
    field: z.string().optional(),
  }),
};

export const api = {
  recipes: {
    search: {
      method: "GET" as const,
      path: "/api/recipes/search" as const,
      input: z.object({
        ingredients: z.string().optional(),
        page: z.coerce.number().optional().default(1),
        sortByCount: z.enum(["low-to-high", "high-to-low", "2-5", "5-10"]).optional(),
      }).optional(),
      responses: {
        200: z.object({
          data: z.array(z.any()), // Using any since schema isn't used for Supabase records directly
          total: z.number(),
          page: z.number(),
          totalPages: z.number(),
        }),
      },
    },
    get: {
      method: "GET" as const,
      path: "/api/recipes/:id" as const,
      responses: {
        200: z.any(),
        404: errorSchemas.notFound,
      },
    },
    getBatch: {
      method: "GET" as const,
      path: "/api/recipes/batch" as const,
      input: z.object({
        ids: z.string().optional(), // comma-separated IDs
      }).optional(),
      responses: {
        200: z.array(z.any()),
      },
    },
  },
};

export function buildUrl(path: string, params?: Record<string, string | number>): string {
  let url = path;
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (url.includes(`:${key}`)) {
        url = url.replace(`:${key}`, String(value));
      }
    });
  }
  return url;
}

export type RecipeSearchResponse = z.infer<typeof api.recipes.search.responses[200]>;
export type RecipeResponse = z.infer<typeof api.recipes.get.responses[200]>;
