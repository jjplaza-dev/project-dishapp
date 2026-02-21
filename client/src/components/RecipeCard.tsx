import { type Recipe } from "@shared/schema";
import { Clock, Users, Heart, ChefHat } from "lucide-react";
import { Link } from "wouter";
import { useFavoritesStore } from "@/lib/store";
import { useState } from "react";

interface RecipeCardProps {
  recipe: Recipe;
}

export function RecipeCard({ recipe }: RecipeCardProps) {
  const { isFavorite, toggleFavorite } = useFavoritesStore();
  const favorited = isFavorite(recipe.id);
  const [imgError, setImgError] = useState(false);

  // Parse ingredients length for a quick stat
  // Parse ingredients length safely for a quick stat
  let ingredientCount = 0;
  if (recipe.Ingredients) {
    try {
      // Step 1: Replace ONLY structural quotes, preserving natural apostrophes
      const jsonFriendlyString = recipe.Ingredients.replace(/^\['/, '["') // Replace opening [' with ["
        .replace(/'\]$/, '"]') // Replace closing '] with "]
        .replace(/', '/g, '", "'); // Replace middle ', ' with ", "

      // Step 2: Parse and get length
      ingredientCount = JSON.parse(jsonFriendlyString).length;
    } catch (err) {
      console.error("Error parsing ingredients for recipe id:", recipe.id, err);
      // ingredientCount remains 0 as a safe fallback
    }
  }

  // Construct image URL - Assuming user provided format
  const imageUrl = imgError
    ? "https://images.unsplash.com/photo-1495521821758-e1d4d762143b?q=80&w=1000&auto=format&fit=crop" // Fallback: Appetizing food spread
    : `https://your-hostinger-domain.com/recipe-images/${recipe.Image_Name}.jpg`;

  return (
    <div className="group relative bg-card rounded-2xl overflow-hidden border border-border/50 hover:border-primary/20 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 h-full flex flex-col">
      {/* Image Container */}
      <div className="relative aspect-[4/3] overflow-hidden bg-muted">
        {/* Favorite Button */}
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            toggleFavorite(recipe.id);
          }}
          className="absolute top-3 right-3 z-10 p-2 rounded-full bg-white/90 backdrop-blur-sm shadow-sm hover:scale-110 transition-all duration-200 active:scale-95 group/btn"
        >
          <Heart
            className={`w-5 h-5 transition-colors ${favorited ? "fill-red-500 text-red-500" : "text-gray-500 group-hover/btn:text-red-500"}`}
          />
        </button>

        <img
          src={imageUrl}
          alt={recipe.Title}
          onError={() => setImgError(true)}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col flex-grow">
        <h3 className="font-display font-bold text-lg leading-tight line-clamp-2 mb-2 group-hover:text-primary transition-colors">
          <Link href={`/recipe/${recipe.id}`}>{recipe.Title}</Link>
        </h3>

        <div className="flex items-center space-x-4 text-sm text-muted-foreground mt-auto pt-4 border-t border-border/50">
          <div className="flex items-center">
            <ChefHat className="w-4 h-4 mr-1.5 opacity-70" />
            <span>{ingredientCount} ingredients</span>
          </div>
          {/* Mocked time since it's not in schema, but looks good for UI */}
          <div className="flex items-center">
            <Clock className="w-4 h-4 mr-1.5 opacity-70" />
            <span>~30 min</span>
          </div>
        </div>
      </div>
    </div>
  );
}
