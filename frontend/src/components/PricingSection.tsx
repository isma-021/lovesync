import { Check, Diamond, Zap, Crown } from "lucide-react";
import { Button } from "@/components/ui/button";
const plans = [{
  name: "Casual",
  description: "Para aquellos que están empezando a explorar",
  price: "Gratis",
  period: "",
  icon: Zap,
  features: [
    "15 matches diarios",
    "Filtros Básicos",
    "Visibilidad Estandard",
    "Mensajería dentro de la aplicación",
  ],
  cta: "Empezar",
  variant: "subtle" as const,
  featured: false
}, {
    name: "Intencional",
    description: "Para personas que buscan relaciones serias",
    price: "24,99€",
    period: "/mes",
    icon: Diamond,
    features: [
      "Partidos ilimitados",
      "Filtros avanzados (más de 140 puntos)",
      "Visibilidad del perfil 5 veces mayor",
      "Ver quién te ha gustado",
      "Asistencia prioritaria",
    ],
    cta: "Iniciar prueba",
    variant: "hero" as const,
    featured: true,
  },
  {
    name: "Prioridad",
    description: "Exposición máxima",
    price: "49€",
    period: "/mes",
    icon: Crown,
    features: [
      "Todo en Intentional",
      "Enviar un mensaje directo a cualquiera",
      "Destacado en Discovery",
      "Incognito browsing",
      "Profile review by experts",
      "Early access to features",
    ],
    cta: "Contact Sales",
    variant: "subtle" as const,
    featured: false,
  }
];
const PricingSection = () => {
  return <section className="py-24 bg-surface-200 relative noise-overlay">
      <div className="container mx-auto px-6 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16">
          <p className="micro-label mb-4">PRECIOS</p>
          <h2 className="text-4xl md:text-5xl font-semibold tracking-tight text-foreground mb-4">
            ​Actualiza tu algoritmo
          </h2>
          <p className="text-lg text-text-secondary max-w-xl mx-auto">
            Elige el nivel de acceso que se ajuste a tus objetivos en materia de citas.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto items-start">
          {plans.map((plan, index) => <div key={plan.name} className={`bg-background rounded-3xl border transition-all duration-300 ${plan.featured ? "border-foreground/20 shadow-hover scale-105 md:-mt-4 md:mb-4" : "border-border hover:border-foreground/10"}`}>
              {/* Header */}
              <div className={`p-6 pb-0 ${plan.featured ? "pt-8" : ""}`}>
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-4 ${plan.featured ? "bg-foreground" : "bg-surface-300"}`}>
                  <plan.icon className={`w-6 h-6 ${plan.featured ? "text-background" : "text-foreground"}`} strokeWidth={1.5} />
                </div>
                
                <h3 className="text-xl font-semibold text-foreground">{plan.name}</h3>
                <p className="text-sm text-text-secondary mt-1">{plan.description}</p>
                
                <div className="mt-4 flex items-baseline gap-1">
                  <span className="text-4xl font-semibold text-foreground">{plan.price}</span>
                  <span className="text-text-secondary">{plan.period}</span>
                </div>
              </div>

              {/* Features */}
              <div className="p-6">
                <ul className="space-y-3">
                  {plan.features.map(feature => <li key={feature} className="flex items-start gap-3">
                      <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${plan.featured ? "bg-signal-green/10" : "bg-surface-300"}`}>
                        {plan.featured ? <Diamond className="w-3 h-3 text-signal-green" strokeWidth={2} /> : <Check className="w-3 h-3 text-foreground" strokeWidth={2} />}
                      </div>
                      <span className="text-sm text-text-secondary">{feature}</span>
                    </li>)}
                </ul>

                <Button variant={plan.variant} className="w-full mt-6" size="lg">
                  {plan.cta}
                </Button>
              </div>
            </div>)}
        </div>
      </div>
    </section>;
};
export default PricingSection;