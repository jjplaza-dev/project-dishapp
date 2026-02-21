import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useRecipe } from "@/hooks/use-recipes";
import { useFavoritesStore } from "@/lib/store";
import { Loader2, Heart, Share2, Clock, Users, ArrowLeft, ChefHat } from "lucide-react";
import { useRoute, Link } from "wouter";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

export default function RecipeDetail() {
  const [, params] = useRoute("/recipe/:id");
  const id = parseInt(params?.id || "0");
  
  const { data: recipe, isLoading, isError } = useRecipe(id);
  const { isFavorite, toggleFavorite } = useFavoritesStore();
  const { toast } = useToast();
  const [imgError, setImgError] = useState(false);

  const isFavorited = isFavorite(id);

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast({
      title: "Link copied!",
      description: "Recipe link copied to clipboard.",
    });
  };

  const handleFavorite = () => {
    toggleFavorite(id);
    toast({
      title: isFavorited ? "Removed from favorites" : "Added to favorites",
      description: isFavorited ? "Recipe removed from your cookbook." : "Recipe saved for later!",
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-10 h-10 text-primary animate-spin" />
      </div>
    );
  }

  if (isError || !recipe) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center">
        <h2 className="text-2xl font-bold mb-4">Recipe not found</h2>
        <Link href="/search">
          <Button>Back to Search</Button>
        </Link>
      </div>
    );
  }

  // Safely parse strings to lists (assuming they are stored as stringified arrays per schema example)
  // Schema example: "['2 large egg whites', ...]"
  let ingredientsList: string[] = [];
  try {
    ingredientsList = JSON.parse(recipe.Ingredients.replace(/'/g, '"'));
  } catch (e) {
    // Fallback if parsing fails - maybe it's just a string or different format
    ingredientsList = [recipe.Ingredients];
  }

  // Instructions might be a string with \n or a JSON array
  // Example shows "\n" separated text
  const instructionsList = recipe.Instructions.split('\n').filter(line => line.trim().length > 0);

  const imageUrl = imgError 
    ? "https://images.unsplash.com/photo-1495521821758-e1d4d762143b?q=80&w=1000&auto=format&fit=crop"
    : `https://your-hostinger-domain.com/recipe-images/${recipe.Image_Name}.jpg`;

  return (
    <div className="min-h-screen flex flex-col bg-background font-sans">
      <Navbar />
      
      <main className="flex-grow pt-20">
        <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <Link href="/search" className="inline-flex items-center text-muted-foreground hover:text-primary mb-6 transition-colors">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Search
          </Link>

          {/* Title Header */}
          <div className="mb-8">
            <h1 className="text-4xl md:text-5xl font-display font-bold text-foreground mb-4 leading-tight">
              {recipe.Title}
            </h1>
            <div className="flex flex-wrap items-center gap-6 text-muted-foreground">
              <div className="flex items-center">
                <Clock className="w-5 h-5 mr-2" />
                <span>30 mins (est)</span>
              </div>
              <div className="flex items-center">
                <ChefHat className="w-5 h-5 mr-2" />
                <span>{ingredientsList.length} ingredients</span>
              </div>
            </div>
          </div>

          {/* Hero Image */}
          <div className="relative rounded-3xl overflow-hidden shadow-2xl mb-12 aspect-video bg-muted">
            <img 
              src={imageUrl} 
              alt={recipe.Title}
              onError={() => setImgError(true)}
              className="w-full h-full object-cover"
            />
            
            {/* Action Bar overlay */}
            <div className="absolute top-4 right-4 flex gap-3">
              <Button 
                size="icon" 
                variant="secondary"
                className="rounded-full h-12 w-12 shadow-lg bg-white/90 backdrop-blur hover:bg-white"
                onClick={handleShare}
              >
                <Share2 className="w-5 h-5 text-gray-700" />
              </Button>
              <Button 
                size="icon" 
                variant="secondary"
                className={`rounded-full h-12 w-12 shadow-lg backdrop-blur hover:bg-white ${isFavorited ? 'bg-white text-red-500' : 'bg-white/90 text-gray-700'}`}
                onClick={handleFavorite}
              >
                <Heart className={`w-5 h-5 ${isFavorited ? 'fill-current' : ''}`} />
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-12">
            {/* Ingredients Sidebar */}
            <div className="md:col-span-4 space-y-8">
              <div className="bg-muted/30 p-8 rounded-3xl border border-border/50 sticky top-24">
                <h3 className="font-display font-bold text-2xl mb-6">Ingredients</h3>
                <ul className="space-y-4">
                  {ingredientsList.map((ingredient, idx) => (
                    <li key={idx} className="flex items-start">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 mr-3 flex-shrink-0" />
                      <span className="text-foreground/90 leading-relaxed">{ingredient}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Instructions Main Content */}
            <div className="md:col-span-8">
              <h3 className="font-display font-bold text-2xl mb-6">Instructions</h3>
              <div className="space-y-8">
                {instructionsList.map((step, idx) => (
                  <div key={idx} className="group">
                    <div className="flex gap-4">
                      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 text-primary font-bold flex items-center justify-center mt-1">
                        {idx + 1}
                      </div>
                      <p className="text-lg text-foreground/80 leading-relaxed">
                        {step}
                      </p>
                    </div>
                    {idx !== instructionsList.length - 1 && (
                      <Separator className="my-8 opacity-50" />
                    )}
                  </div>
                ))}
              </div>
              
              {/* Bon Appetit */}
              <div className="mt-16 p-8 bg-primary/5 rounded-3xl text-center border border-primary/10">
                <ChefHat className="w-12 h-12 text-primary mx-auto mb-4 opacity-50" />
                <h4 className="font-display font-bold text-2xl text-primary/80">Bon Appétit!</h4>
              </div>
            </div>
          </div>

        </article>
      </main>

      <Footer />
    </div>
  );
}
