import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { RecipeCard } from "@/components/RecipeCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useSearchRecipes } from "@/hooks/use-recipes";
import { Loader2, Search, SlidersHorizontal, Frown } from "lucide-react";
import { useState, useEffect } from "react";
import { useLocation } from "wouter";

export default function SearchResult() {
  const [location, setLocation] = useLocation();
  
  // Parse query params
  const searchParams = new URLSearchParams(window.location.search);
  const initialIngredients = searchParams.get("ingredients") || "";
  
  const [searchInput, setSearchInput] = useState(initialIngredients);
  const [ingredients, setIngredients] = useState(initialIngredients);
  const [page, setPage] = useState(1);
  const [sortBy, setSortBy] = useState<"low-to-high" | "high-to-low" | "2-5" | "5-10" | undefined>(undefined);

  const { data, isLoading, isError } = useSearchRecipes({
    ingredients,
    page,
    sortByCount: sortBy
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setIngredients(searchInput);
    setPage(1); // Reset to page 1 on new search
    
    // Update URL without reload
    const newParams = new URLSearchParams();
    if (searchInput) newParams.set("ingredients", searchInput);
    window.history.pushState({}, "", `/search?${newParams.toString()}`);
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col bg-background font-sans">
      <Navbar />
      
      <main className="flex-grow pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header & Search Controls */}
          <div className="mb-10">
            <h1 className="text-3xl md:text-4xl font-display font-bold mb-6">
              Recipes for "{ingredients || "Everything"}"
            </h1>

            <div className="flex flex-col md:flex-row gap-4 items-center bg-card p-4 rounded-2xl shadow-sm border border-border">
              <form onSubmit={handleSearch} className="flex-grow w-full md:w-auto flex gap-2">
                <div className="relative flex-grow">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-5 h-5" />
                  <Input 
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                    placeholder="Search by ingredients..."
                    className="pl-10 h-11 bg-background"
                  />
                </div>
                <Button type="submit" size="lg" className="h-11">Search</Button>
              </form>
              
              <div className="flex items-center gap-2 w-full md:w-auto min-w-[200px]">
                <SlidersHorizontal className="w-5 h-5 text-muted-foreground hidden md:block" />
                <Select 
                  value={sortBy} 
                  onValueChange={(val: any) => {
                    setSortBy(val === "default" ? undefined : val);
                    setPage(1);
                  }}
                >
                  <SelectTrigger className="h-11 bg-background">
                    <SelectValue placeholder="Ingredient count" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="default">Default</SelectItem>
                    <SelectItem value="low-to-high">Fewest Ingredients</SelectItem>
                    <SelectItem value="high-to-low">Most Ingredients</SelectItem>
                    <SelectItem value="2-5">2-5 Ingredients</SelectItem>
                    <SelectItem value="5-10">5-10 Ingredients</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Results Grid */}
          {isLoading ? (
            <div className="flex justify-center items-center py-32">
              <Loader2 className="w-10 h-10 text-primary animate-spin" />
            </div>
          ) : isError ? (
            <div className="text-center py-20 text-red-500">
              Something went wrong fetching recipes. Please try again.
            </div>
          ) : data?.data.length === 0 ? (
            <div className="text-center py-32">
              <div className="bg-muted/30 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
                <Frown className="w-10 h-10 text-muted-foreground" />
              </div>
              <h2 className="text-2xl font-bold text-foreground mb-2">No recipes found</h2>
              <p className="text-muted-foreground">Try adjusting your ingredients or filters.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              {data?.data.map((recipe) => (
                <RecipeCard key={recipe.id} recipe={recipe} />
              ))}
            </div>
          )}

          {/* Pagination */}
          {data && data.totalPages > 1 && (
            <div className="mt-12 flex justify-center items-center gap-2">
              <Button 
                variant="outline" 
                onClick={() => handlePageChange(page - 1)}
                disabled={page === 1}
              >
                Previous
              </Button>
              <span className="text-sm font-medium px-4">
                Page {page} of {data.totalPages}
              </span>
              <Button 
                variant="outline" 
                onClick={() => handlePageChange(page + 1)}
                disabled={page === data.totalPages}
              >
                Next
              </Button>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
