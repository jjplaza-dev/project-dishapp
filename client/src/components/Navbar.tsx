import { Link, useLocation } from "wouter";
import { UtensilsCrossed, Heart, Search, Menu, X } from "lucide-react";
import { useState, useEffect } from "react";
import { useFavoritesStore } from "@/lib/store";

export function Navbar() {
  const [location] = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const favoritesCount = useFavoritesStore((state) => state.favorites.length);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/search", label: "Search" },
    { href: "/about", label: "About" },
  ];

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled || isMobileOpen ? "bg-background/80 backdrop-blur-md shadow-sm border-b border-border/50" : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2 group">
            <div className="bg-primary p-2 rounded-xl text-primary-foreground group-hover:rotate-12 transition-transform duration-300">
              <UtensilsCrossed className="w-5 h-5" />
            </div>
            <span className="font-display font-bold text-xl tracking-tight text-foreground">
              Dishapp
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm font-medium transition-colors hover:text-primary ${
                  location === link.href ? "text-primary" : "text-muted-foreground"
                }`}
              >
                {link.label}
              </Link>
            ))}
            
            <Link href="/favorites" className="relative group">
              <div className={`p-2 rounded-full transition-colors ${location === '/favorites' ? 'bg-primary/10 text-primary' : 'hover:bg-muted text-muted-foreground'}`}>
                <Heart className={`w-5 h-5 ${location === '/favorites' ? 'fill-current' : ''}`} />
                {favoritesCount > 0 && (
                  <span className="absolute top-0 right-0 -mt-1 -mr-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-white shadow-sm">
                    {favoritesCount}
                  </span>
                )}
              </div>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
             <Link href="/favorites" className="relative mr-4">
              <div className={`p-2 rounded-full ${location === '/favorites' ? 'text-primary' : 'text-muted-foreground'}`}>
                <Heart className={`w-5 h-5 ${location === '/favorites' ? 'fill-current' : ''}`} />
                 {favoritesCount > 0 && (
                  <span className="absolute top-0 right-0 -mt-1 -mr-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-white shadow-sm">
                    {favoritesCount}
                  </span>
                )}
              </div>
            </Link>
            <button
              onClick={() => setIsMobileOpen(!isMobileOpen)}
              className="text-foreground p-2"
            >
              {isMobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileOpen && (
        <div className="md:hidden bg-background border-b border-border animate-in slide-in-from-top-5">
          <div className="px-4 pt-2 pb-6 space-y-2">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsMobileOpen(false)}
                className={`block px-3 py-2 rounded-md text-base font-medium ${
                  location === link.href
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
}
