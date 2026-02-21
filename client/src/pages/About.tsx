import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { UtensilsCrossed, Leaf, Globe } from "lucide-react";

export default function About() {
  return (
    <div className="min-h-screen flex flex-col bg-background font-sans">
      <Navbar />
      
      <main className="flex-grow pt-20">
        <div className="bg-primary/5 py-24">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-6xl font-display font-bold mb-6">
              Our Mission
            </h1>
            <p className="text-xl text-muted-foreground leading-relaxed">
              We believe that great cooking starts with what you already have. 
              Our goal is to help you reduce food waste, save money, and discover 
              the joy of creative cooking.
            </p>
          </div>
        </div>

        <div className="max-w-5xl mx-auto px-4 py-24">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
            <div>
              <img 
                src="https://pixabay.com/get/g547622be4412ccf20c18937484c56c2eb14252fc7ef2be922047b317b46c8d7927ed56147c3543494ab7273ba8b9a8b34889dbefe1e654f07c8aa72164ccedbb_1280.jpg" 
                alt="Cooking together" 
                className="rounded-3xl shadow-2xl rotate-2 hover:rotate-0 transition-transform duration-500"
              />
            </div>
            <div className="space-y-8">
              <div>
                <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary mb-4">
                  <UtensilsCrossed className="w-6 h-6" />
                </div>
                <h3 className="text-2xl font-bold font-display mb-2">Culinary Creativity</h3>
                <p className="text-muted-foreground">
                  We empower you to look at your pantry differently. That lonely can of beans 
                  and leftover spinach? That's dinner waiting to happen.
                </p>
              </div>
              
              <div>
                <div className="w-12 h-12 bg-green-100 rounded-2xl flex items-center justify-center text-green-600 mb-4">
                  <Leaf className="w-6 h-6" />
                </div>
                <h3 className="text-2xl font-bold font-display mb-2">Sustainable Living</h3>
                <p className="text-muted-foreground">
                  Food waste is a massive global issue. By using what we have, we take small 
                  but meaningful steps towards a more sustainable future.
                </p>
              </div>

              <div>
                <div className="w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center text-blue-600 mb-4">
                  <Globe className="w-6 h-6" />
                </div>
                <h3 className="text-2xl font-bold font-display mb-2">Community Driven</h3>
                <p className="text-muted-foreground">
                  Dishapp is built for home cooks, by home cooks. We curate recipes that are 
                  accessible, delicious, and practical for everyday life.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
