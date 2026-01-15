import { useRef, useEffect, useState } from "react";
const testimonials = [
  {
    quote: "Finalmente, una app de citas que respeta mi tiempo. El filtrado es increíblemente preciso.",
    name: "Sarah M.",
    location: "Londres",
    timeToMatch: "3 días",
    avatar: "SM",
  },
  {
    quote: "Encontré a mi pareja en dos semanas. La vista tipo pipeline me mantuvo organizado y con intención.",
    name: "James K.",
    location: "Nueva York",
    timeToMatch: "14 días",
    avatar: "JK",
  },
  {
    quote: "Se acabó el deslizamiento infinito. LoveSync se siente como una herramienta, no como una pérdida de tiempo.",
    name: "Priya R.",
    location: "Singapur",
    timeToMatch: "7 días",
    avatar: "PR",
  },
  {
    quote: "La analítica me mostró qué funcionaba. Las citas basadas en datos realmente funcionan.",
    name: "Marcus L.",
    location: "Berlín",
    timeToMatch: "10 días",
    avatar: "ML",
  },
  {
    quote: "Limpia, minimalista, efectiva. Esto es lo que las apps de citas deberían haber sido desde el principio.",
    name: "Emma T.",
    location: "Sídney",
    timeToMatch: "5 días",
    avatar: "ET",
  },

  // 10 testimonios nuevos
  {
    quote: "Pasé meses sin resultados en otras apps. Aquí encontré conexiones reales en cuestión de días.",
    name: "Laura G.",
    location: "Madrid",
    timeToMatch: "6 días",
    avatar: "LG",
  },
  {
    quote: "La función de prioridades cambió por completo mi experiencia. Mucho más enfoque y cero ruido.",
    name: "Daniel S.",
    location: "Toronto",
    timeToMatch: "4 días",
    avatar: "DS",
  },
  {
    quote: "Me encantó cómo los filtros se adaptan a lo que realmente busco. No vuelvo atrás.",
    name: "Nina V.",
    location: "Ámsterdam",
    timeToMatch: "8 días",
    avatar: "NV",
  },
  {
    quote: "Por primera vez sentí que tenía control sobre mi proceso de citas. Todo está estructurado.",
    name: "Hugo C.",
    location: "Buenos Aires",
    timeToMatch: "12 días",
    avatar: "HC",
  },
  {
    quote: "El seguimiento de conversaciones me ayudó a no perder oportunidades. Muy bien pensado.",
    name: "Sofía D.",
    location: "Roma",
    timeToMatch: "5 días",
    avatar: "SD",
  },
  {
    quote: "Sincero: no esperaba que funcionara tan bien. Las recomendaciones fueron casi perfectas.",
    name: "Adrian F.",
    location: "Chicago",
    timeToMatch: "9 días",
    avatar: "AF",
  },
  {
    quote: "Por fin una app que entiende que tengo una vida ocupada. Todo es rápido y claro.",
    name: "María P.",
    location: "Ciudad de México",
    timeToMatch: "3 días",
    avatar: "MP",
  },
  {
    quote: "La calidad de los matches es mucho mayor. Poca cantidad, pero mucha intención.",
    name: "Omar Z.",
    location: "Dubái",
    timeToMatch: "11 días",
    avatar: "OZ",
  },
  {
    quote: "Lo mejor es la transparencia. Sé exactamente qué funciona en mi perfil y qué no.",
    name: "Kira L.",
    location: "Oslo",
    timeToMatch: "6 días",
    avatar: "KL",
  },
  {
    quote: "El enfoque estratégico de la app me ayudó a dejar de improvisar. Todo fluye mejor.",
    name: "Leo W.",
    location: "San Francisco",
    timeToMatch: "7 días",
    avatar: "LW",
  },
];
const Testimonials = () => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isPaused, setIsPaused] = useState(false);
  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;
    let animationId: number;
    let scrollPos = 0;
    const speed = 0.5;
    const animate = () => {
      if (!isPaused) {
        scrollPos += speed;
        if (scrollPos >= container.scrollWidth / 2) {
          scrollPos = 0;
        }
        container.scrollLeft = scrollPos;
      }
      animationId = requestAnimationFrame(animate);
    };
    animationId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationId);
  }, [isPaused]);
  return <section className="py-24" id="safety">
      <div className="container mx-auto px-6 mb-12">
        <div className="text-center">
          <p className="micro-label mb-4">Logs del Amor</p>
          <h2 className="text-4xl md:text-5xl font-semibold tracking-tight text-foreground mb-4">
            Conexiones reales, historias reales
          </h2>
        </div>
      </div>

      {/* Carousel */}
      <div className="relative">
        {/* Gradient Masks */}
        <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none" />

        <div ref={scrollRef} className="flex gap-6 overflow-x-hidden px-6" onMouseEnter={() => setIsPaused(true)} onMouseLeave={() => setIsPaused(false)}>
          {[...testimonials, ...testimonials].map((testimonial, index) => <div key={index} className={`flex-shrink-0 w-80 bg-background border border-border rounded-2xl p-6 transition-opacity duration-300 ${isPaused ? "opacity-100" : "opacity-90 hover:opacity-100"}`}>
              {/* Header */}
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-surface-300 flex items-center justify-center text-sm font-medium text-text-secondary">
                  {testimonial.avatar}
                </div>
                <div>
                  <p className="font-medium text-foreground text-sm">{testimonial.name}</p>
                  <p className="text-xs text-text-tertiary">Match en {testimonial.location}</p>
                </div>
              </div>

              {/* Quote */}
              <blockquote className="text-lg text-foreground leading-relaxed tracking-tight mb-4">
                "{testimonial.quote}"
              </blockquote>

              {/* Time to Match */}
              <div className="pt-4 border-t border-border">
                <span className="micro-label">Tiempo en hacer match:</span>
                <span className="ml-2 font-mono text-sm text-signal-green">{testimonial.timeToMatch}</span>
              </div>
            </div>)}
        </div>
      </div>
    </section>;
};
export default Testimonials;