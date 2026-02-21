import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { RecipeCard } from "@/components/RecipeCard";
import { Button } from "@/components/ui/button";
import { useBatchRecipes } from "@/hooks/use-recipes";
import { useFavoritesStore } from "@/lib/store";
import { Loader2, Heart, ArrowRight } from "lucide-react";
import { Link } from "wouter";

export default function Favorites() {
  const { favorites } = useFavoritesStore();
  
  // Only fetch if we have favorites
  const { data: recipes, isLoading } = useBatchRecipes(favorites);

  return (
    <div className="min-h-screen flex flex-col bg-background font-sans">
      <Navbar />
      
      <main className="flex-grow pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center space-x-4 mb-10">
            <div className="p-3 bg-red-100 rounded-full">
              <Heart className="w-8 h-8 text-red-500 fill-current" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-display font-bold">My Cookbook</h1>
              <p className="text-muted-foreground mt-1">Your saved recipes collection</p>
            </div>
          </div>

          {favorites.length === 0 ? (
            <div className="text-center py-32 bg-muted/20 rounded-3xl border border-dashed border-border">
              <div className="w-20 h-20 bg-background rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm">
                <Heart className="w-10 h-10 text-muted-foreground" />
              </div>
              <h2 className="text-2xl font-bold text-foreground mb-3">No favorites yet</h2>
              <p className="text-muted-foreground max-w-md mx-auto mb-8">
                Start exploring recipes and save the ones you love to build your personal cookbook.
              </p>
              <Link href="/search">
                <Button size="lg" className="rounded-xl">
                  Explore Recipes <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </div>
          ) : isLoading ? (
            <div className="flex justify-center items-center py-32">
              <Loader2 className="w-10 h-10 text-primary animate-spin" />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              {recipes?.map((recipe) => (
                <RecipeCard key={recipe.id} recipe={recipe} />
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
