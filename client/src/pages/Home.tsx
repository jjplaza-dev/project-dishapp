import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, ArrowRight, Sparkles, ChefHat, Heart, TrendingUp } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { useLocation } from "wouter";
import gsap from "gsap";

export default function Home() {
  const [ingredients, setIngredients] = useState("");
  const [, setLocation] = useLocation();
  
  const heroRef = useRef(null);
  const featuresRef = useRef(null);
  const ctaRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Hero Animation
      gsap.from(".hero-content > *", {
        y: 30,
        opacity: 0,
        duration: 1,
        stagger: 0.15,
        ease: "power3.out",
        delay: 0.2
      });

      // Features Animation
      gsap.from(".feature-card", {
        scrollTrigger: {
          trigger: featuresRef.current,
          start: "top 80%",
        },
        y: 40,
        opacity: 0,
        duration: 0.8,
        stagger: 0.2,
        ease: "power2.out"
      });
    }, heroRef);

    return () => ctx.revert();
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (ingredients.trim()) {
      setLocation(`/search?ingredients=${encodeURIComponent(ingredients)}`);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background font-sans">
      <Navbar />
      
      {/* Hero Section */}
      <main ref={heroRef} className="flex-grow pt-20">
        <div className="relative overflow-hidden bg-secondary/30 py-20 lg:py-32">
          {/* Decorative shapes */}
          <div className="absolute top-0 right-0 -translate-y-1/4 translate-x-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl opacity-50 pointer-events-none" />
          <div className="absolute bottom-0 left-0 translate-y-1/4 -translate-x-1/4 w-96 h-96 bg-orange-200/20 rounded-full blur-3xl opacity-50 pointer-events-none" />

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center hero-content">
            <div className="inline-flex items-center px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6 animate-pulse">
              <Sparkles className="w-4 h-4 mr-2" />
              Discover delicious recipes instantly
            </div>
            
            <h1 className="text-5xl md:text-7xl font-display font-bold text-foreground mb-6 leading-[1.1]">
              Cook with what <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-orange-600">
                you have today.
              </span>
            </h1>
            
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
              Enter the ingredients in your pantry, and we'll show you the magic you can create. 
              No waste, just taste.
            </p>

            <form onSubmit={handleSearch} className="max-w-2xl mx-auto relative group">
              <div className="absolute inset-0 bg-primary/20 rounded-2xl blur-xl group-hover:bg-primary/30 transition-all duration-300 opacity-50" />
              <div className="relative flex items-center bg-card rounded-2xl shadow-xl border border-border/50 p-2 transition-transform duration-300 focus-within:scale-[1.02]">
                <Search className="w-6 h-6 text-muted-foreground ml-3 mr-2" />
                <Input
                  value={ingredients}
                  onChange={(e) => setIngredients(e.target.value)}
                  placeholder="e.g. chicken, potatoes, garlic..."
                  className="border-none shadow-none text-lg h-12 bg-transparent focus-visible:ring-0 placeholder:text-muted-foreground/60"
                />
                <Button 
                  type="submit" 
                  size="lg"
                  className="rounded-xl px-8 font-semibold shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30"
                >
                  Find Recipes
                </Button>
              </div>
            </form>

            <div className="mt-8 flex justify-center gap-4 text-sm text-muted-foreground">
              <span>Popular:</span>
              {['Chicken', 'Pasta', 'Avocado', 'Eggs'].map(item => (
                <button 
                  key={item}
                  onClick={() => setLocation(`/search?ingredients=${item}`)}
                  className="hover:text-primary hover:underline underline-offset-4 decoration-primary/50 transition-all"
                >
                  {item}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* How It Works */}
        <section className="py-24 bg-background">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">How It Works</h2>
              <p className="text-muted-foreground max-w-xl mx-auto">
                Three simple steps to your next delicious meal.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
              {[
                { step: "01", title: "Check Your Pantry", desc: "Look around and see what ingredients you currently have available." },
                { step: "02", title: "Enter Ingredients", desc: "Type them into our search bar above. Separate multiple items with commas." },
                { step: "03", title: "Get Cooking", desc: "Browse tailored recipes, follow the steps, and enjoy your homemade dish." }
              ].map((item, idx) => (
                <div key={idx} className="relative group">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center text-primary font-bold text-xl mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                    {item.step}
                  </div>
                  <h3 className="text-xl font-bold mb-3">{item.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section ref={featuresRef} className="py-24 bg-muted/30 border-y border-border/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
             <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">Why Use Dishapp?</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                { 
                  icon: ChefHat, 
                  title: "Smart Recommendations", 
                  desc: "Our algorithm finds the best match for your specific combination of ingredients." 
                },
                { 
                  icon: Heart, 
                  title: "Save Favorites", 
                  desc: "Keep a personal cookbook of your most loved recipes for quick access later." 
                },
                { 
                  icon: TrendingUp, 
                  title: "Trending Recipes", 
                  desc: "Discover what the community is cooking and find new inspiration daily." 
                }
              ].map((feature, idx) => (
                <div 
                  key={idx} 
                  className="feature-card bg-card p-8 rounded-3xl border border-border/50 shadow-sm hover:shadow-xl hover:border-primary/20 transition-all duration-300"
                >
                  <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary mb-6">
                    <feature.icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section ref={ctaRef} className="py-24 relative overflow-hidden">
          <div className="absolute inset-0 bg-primary/5 -skew-y-3 scale-110" />
          <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
            <h2 className="text-4xl md:text-5xl font-display font-bold mb-6">
              Ready to create something delicious?
            </h2>
            <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto">
              Join thousands of home cooks reducing waste and eating better with Dishapp.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Button 
                onClick={() => document.querySelector('input')?.focus()}
                size="lg" 
                className="text-lg px-8 h-14 rounded-xl shadow-lg shadow-primary/20 hover:shadow-xl hover:translate-y-[-2px] transition-all"
              >
                Start Cooking
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
