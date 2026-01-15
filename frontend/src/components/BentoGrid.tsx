import { Filter, Share2, BarChart3, Columns3, Sparkles, Heart, Users, Zap } from "lucide-react";
const BentoGrid = () => {
  return <section className="py-24 relative noise-overlay" id="manifesto">
      <div className="container mx-auto px-6 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16">
          <p className="micro-label mb-4">CARACTERÍSTICAS</p>
          <h2 className="text-4xl md:text-5xl font-semibold tracking-tight text-foreground mb-4">
            Stack de emparejamiento optimizado
          </h2>
          <p className="text-lg text-text-secondary max-w-xl mx-auto">
            Todas las funciones están diseñadas para maximizar las conexiones genuinas y minimizar la pérdida de tiempo.
          </p>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {/* Card 1 - Large (2x2) */}
          <div className="bento-card md:col-span-2 md:row-span-2 p-8">
            <div className="h-full flex flex-col">
              <div className="mb-6">
                <div className="w-12 h-12 rounded-2xl bg-surface-300 flex items-center justify-center mb-4">
                  <Filter className="w-6 h-6 text-foreground" strokeWidth={1.5} />
                </div>
                <h3 className="text-2xl font-semibold text-foreground mb-2">Filtrado granular</h3>
                <p className="text-text-secondary">
                  Filtra, no te limites a deslizar el dedo. Define tus criterios de selección con más de 140+ puntos de datos.
                </p>
              </div>
              
              {/* Visual: Floating Tags */}
              <div className="flex-1 relative min-h-[200px]">
                <div className="absolute inset-0 flex flex-wrap gap-2 content-start">
                  {["Dog Lover", "ENTP", "Height > 6ft", "Active Lifestyle", "Creative", "Night Owl", "Foodie", "Traveler"].map((tag, i) => <span key={tag} className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-500 ${i < 4 ? "bg-signal-green/10 text-signal-green border border-signal-green/20" : "bg-surface-300 text-text-secondary border border-transparent"}`} style={{
                  animationDelay: `${i * 100}ms`,
                  transform: `translateY(${Math.sin(i) * 5}px)`
                }}>
                      {tag}
                    </span>)}
                </div>
              </div>
            </div>
          </div>

          {/* Card 2 - Tall (1x2) */}
          <div className="bento-card md:row-span-2 p-6">
            <div className="h-full flex flex-col">
              <div className="mb-6">
                <div className="w-12 h-12 rounded-2xl bg-surface-300 flex items-center justify-center mb-4">
                  <Share2 className="w-6 h-6 text-foreground" strokeWidth={1.5} />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-2">Motor de publicación cruzada</h3>
                <p className="text-text-secondary text-sm">
                  Publica en todas partes. Sincroniza tu biografía de LoveSync con tus redes sociales al instante.
                </p>
              </div>
              
              {/* Visual: Phone with orbiting icons */}
              <div className="flex-1 flex items-center justify-center relative">
                <div className="w-32 h-48 bg-surface-300 rounded-3xl border border-border relative">
                  <div className="absolute inset-2 bg-background rounded-2xl" />
                </div>
                
                {/* Orbiting icons */}
                <div className="absolute inset-0 flex items-center justify-center">
                  {[{
                  icon: "IG",
                  angle: 0
                }, {
                  icon: "TT",
                  angle: 120
                }, {
                  icon: "X",
                  angle: 240
                }].map((item, i) => <div key={item.icon} className="absolute w-8 h-8 bg-surface-200 border border-border rounded-full flex items-center justify-center text-xs font-medium text-text-secondary" style={{
                  transform: `rotate(${item.angle}deg) translateY(-70px) rotate(-${item.angle}deg)`
                }}>
                      {item.icon}
                    </div>)}
                </div>
              </div>
            </div>
          </div>

          {/* Card 3 - Small (1x1) */}
          <div className="bento-card p-6">
            <div className="h-full flex flex-col">
              <div className="w-10 h-10 rounded-xl bg-surface-300 flex items-center justify-center mb-3">
                <BarChart3 className="w-5 h-5 text-foreground" strokeWidth={1.5} />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-1">Análisis de ghosting</h3>
              <p className="text-text-secondary text-sm mb-4">
                Consulte sus índices de respuesta en tiempo real y reciba asesoramiento de nuestros profesionales.
              </p>
              
              {/* Mini graph */}
              <div className="flex-1 flex items-end">
                <svg viewBox="0 0 100 40" className="w-full h-16">
                  <path d="M0 35 Q25 30, 40 25 T70 15 T100 10" fill="none" stroke="hsl(var(--signal-green))" strokeWidth="2" />
                  <circle cx="100" cy="10" r="3" fill="hsl(var(--signal-green))" />
                </svg>
              </div>
            </div>
          </div>

          {/* Card 4 - Small (1x1) */}
          <div className="bento-card p-6">
            <div className="h-full flex flex-col">
              <div className="w-10 h-10 rounded-xl bg-surface-300 flex items-center justify-center mb-3">
                <Sparkles className="w-5 h-5 text-foreground" strokeWidth={1.5} />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-1">Rompe el hielo con IA</h3>
              <p className="text-text-secondary text-sm">
                Temas de conversación inteligentes y probados basados en intereses comunes.
              </p>
            </div>
          </div>

          {/* Card 5 - Wide (3x1) */}
          <div className="bento-card md:col-span-3 p-6">
            <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 rounded-2xl bg-surface-300 flex items-center justify-center mb-4 md:mb-0">
                  <Columns3 className="w-6 h-6 text-foreground" strokeWidth={1.5} />
                </div>
              </div>
              
              <div className="flex-1">
                <h3 className="text-xl font-semibold text-foreground mb-1">Canalización de relaciones</h3>
                <p className="text-text-secondary">
                  Gestiona tus coincidencias. Visualiza en qué punto se encuentra cada conversación.
                </p>
              </div>
              
              {/* Mini Kanban */}
              <div className="flex gap-3 overflow-x-auto py-2 w-full md:w-auto">
                {[{
                label: "Matched",
                count: 12,
                color: "bg-text-tertiary"
              }, {
                label: "Talking",
                count: 5,
                color: "bg-text-secondary"
              }, {
                label: "First Date",
                count: 2,
                color: "bg-signal-green"
              }, {
                label: "Exclusive",
                count: 1,
                color: "bg-foreground"
              }].map(col => <div key={col.label} className="flex-shrink-0 w-24">
                    <div className="text-xs font-medium text-text-tertiary mb-2 uppercase tracking-wider">
                      {col.label}
                    </div>
                    <div className={`h-1 rounded-full ${col.color} opacity-60`} style={{
                  width: `${col.count * 8}%`
                }} />
                    <div className="text-sm font-mono text-foreground mt-1">{col.count}</div>
                  </div>)}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>;
};
export default BentoGrid;