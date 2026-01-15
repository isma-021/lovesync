import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import LoginDialog from "./LoginDialog";

const Navigation = () => {
  const [scrolled, setScrolled] = useState(false);
  const [loginOpen, setLoginOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <nav className={`fixed top-0 left-0 right-0 z-50 h-16 flex items-center transition-all duration-300 ${scrolled ? "glass" : "bg-transparent"}`}>
        <div className="container mx-auto px-6 flex items-center justify-between">
          {/* Logo */}
          <a href="/" className="atext-xl font-bold tracking-tight text-foreground">
            LoveSync
          </a>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center gap-8">
            <a href="#manifesto" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Manifiesto
            </a>
            <a href="#safety" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Seguridad
            </a>
            <a href="#download" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Acceder
            </a>
          </div>

          {/* CTA Buttons */}
          <div className="flex items-center gap-3">
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-muted-foreground hover:text-foreground"
              onClick={() => setLoginOpen(true)}
            >
              Iniciar sesión
            </Button>
          </div>
        </div>
      </nav>
      
      <LoginDialog open={loginOpen} onOpenChange={setLoginOpen} />
    </>
  );
};

export default Navigation;