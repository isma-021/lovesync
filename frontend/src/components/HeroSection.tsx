import { useState, useEffect } from "react";
import { ArrowRight, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import RegisterDialog from "./RegisterDialog";

const HeroSection = () => {
  const [interestedIn, setInterestedIn] = useState("Everyone");
  const [ageFrom, setAgeFrom] = useState("24");
  const [ageTo, setAgeTo] = useState("32");
  const [location, setLocation] = useState("Barcelona");
  const [matchCount, setMatchCount] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [registerOpen, setRegisterOpen] = useState(false);

  useEffect(() => {
    // Simulate dynamic match count
    const baseCount = 1240;
    const variation = Math.floor(Math.random() * 200) - 100;
    const targetCount = baseCount + variation;
    let current = 0;
    const increment = targetCount / 30;
    const timer = setInterval(() => {
      current += increment;
      if (current >= targetCount) {
        setMatchCount(targetCount);
        clearInterval(timer);
      } else {
        setMatchCount(Math.floor(current));
      }
    }, 50);
    return () => clearInterval(timer);
  }, [interestedIn, ageFrom, ageTo, location]);

  const handleStartRegistration = () => {
    setRegisterOpen(true);
  };

  return (
    <>
      <section className="relative min-h-screen flex items-center justify-center pt-16 overflow-hidden">
        {/* Background Grid */}
        <div className="absolute inset-0 bg-grid" />
        
        {/* Content */}
        <div className="relative z-10 container mx-auto px-6 text-center">
          {/* Headline */}
          <h1 className="text-5xl md:text-7xl font-semibold tracking-tight text-foreground mb-6 opacity-0 animate-fade-in-up">Citas, indexadas.</h1>
          
          {/* Subheadline */}
          <p className="text-lg md:text-xl text-text-secondary max-w-2xl mx-auto mb-12 opacity-0 animate-fade-in-up delay-100">El motor de relaciones más detallado del mundo. 
          <br className="hidden md:block" />
          Filtra por compatibilidad, no solo por proximidad.
          </p>

          {/* Query Box */}
          <div className="query-box max-w-3xl mx-auto rounded-2xl p-2 opacity-0 animate-fade-in-up delay-200" onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)}>
            <div className="flex flex-col md:flex-row items-stretch md:items-center gap-2 md:gap-0">
              {/* Interested In */}
              <div className="flex-1 px-4 py-3 border-b md:border-b-0 md:border-r border-border">
                <label className="micro-label block text-left mb-1">INTERESADO EN</label>
                <div className="relative">
                  <select value={interestedIn} onChange={e => setInterestedIn(e.target.value)} className="w-full bg-transparent text-foreground font-medium appearance-none cursor-pointer focus:outline-none pr-6">
                    <option value="Men">Hombres</option>
                    <option value="Women">Mujeres</option>
                    <option value="Everyone">Todos</option>
                  </select>
                  <ChevronDown className="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-4 text-text-tertiary pointer-events-none" />
                </div>
              </div>

              {/* Age Range */}
              <div className="flex-1 px-4 py-3 border-b md:border-b-0 md:border-r border-border">
                <label className="micro-label block text-left mb-1">ENTRE EDADES</label>
                <div className="flex items-center gap-2">
                  <input type="text" value={ageFrom} onChange={e => setAgeFrom(e.target.value)} className="w-12 bg-surface-200 rounded px-2 py-1 text-center font-mono text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-border" />
                  <span className="text-text-tertiary">-</span>
                  <input type="text" value={ageTo} onChange={e => setAgeTo(e.target.value)} className="w-12 bg-surface-200 rounded px-2 py-1 text-center font-mono text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-border" />
                </div>
              </div>

              {/* Location */}
              <div className="flex-1 px-4 py-3 border-b md:border-b-0 md:border-r border-border">
                <label className="micro-label block text-left mb-1">UBICACIÓN</label>
                <input type="text" value={location} onChange={e => setLocation(e.target.value)} placeholder="Ingresa ciudad..." className="w-full bg-transparent text-foreground font-medium focus:outline-none placeholder:text-text-tertiary" />
              </div>

              {/* Action Button */}
              <div className="py-2 px-[9px]">
                <Button 
                  variant="hero" 
                  size="lg" 
                  className={`w-full md:w-auto group transition-all duration-300 ${isHovered ? 'px-6' : 'px-4'}`}
                  onClick={handleStartRegistration}
                >
                  <span className={`transition-all duration-300 ${isHovered ? 'opacity-100 max-w-32' : 'opacity-0 max-w-0'} overflow-hidden whitespace-nowrap`}>Ver Coincidencias</span>
                  <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                </Button>
              </div>
            </div>
          </div>

          {/* Match Count */}
          <div className="mt-6 opacity-0 animate-fade-in-up delay-300">
            <span className="font-mono text-sm text-signal-green">
              {matchCount.toLocaleString()} matches encontrados
            </span>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 opacity-0 animate-fade-in-up delay-500">
          <div className="w-6 h-10 border-2 border-border rounded-full flex justify-center pt-2">
            <div className="w-1 h-2 bg-text-tertiary rounded-full animate-pulse" />
          </div>
        </div>
      </section>

      <RegisterDialog 
        open={registerOpen} 
        onOpenChange={setRegisterOpen}
        initialData={{ interestedIn, ageFrom, ageTo, location }}
      />
    </>
  );
};

export default HeroSection;