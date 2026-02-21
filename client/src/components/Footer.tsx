import { UtensilsCrossed, Github, Twitter, Instagram } from "lucide-react";
import { Link } from "wouter";

export function Footer() {
  return (
    <footer className="bg-muted/30 border-t border-border mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2 space-y-4">
            <Link href="/" className="flex items-center space-x-2 group w-fit">
              <div className="bg-primary p-2 rounded-xl text-primary-foreground">
                <UtensilsCrossed className="w-5 h-5" />
              </div>
              <span className="font-display font-bold text-xl tracking-tight text-foreground">
                Dishapp
              </span>
            </Link>
            <p className="text-muted-foreground max-w-sm text-sm leading-relaxed">
              Discover the joy of cooking with ingredients you already have. 
              Reduce waste, save money, and create delicious meals with Dishapp.
            </p>
          </div>
          
          <div className="space-y-4">
            <h4 className="font-display font-bold text-foreground">Navigation</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/" className="hover:text-primary transition-colors">Home</Link></li>
              <li><Link href="/search" className="hover:text-primary transition-colors">Find Recipes</Link></li>
              <li><Link href="/favorites" className="hover:text-primary transition-colors">My Favorites</Link></li>
              <li><Link href="/about" className="hover:text-primary transition-colors">About Us</Link></li>
            </ul>
          </div>
          
          <div className="space-y-4">
            <h4 className="font-display font-bold text-foreground">Connect</h4>
            <div className="flex space-x-4">
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Github className="w-5 h-5" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
            </div>
            <p className="text-xs text-muted-foreground mt-4">
              © {new Date().getFullYear()} Dishapp Inc.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
