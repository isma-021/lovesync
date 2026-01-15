import { useState, useCallback, useEffect } from "react";
import CandidateCard from "./CandidateCard";
import { X, Heart } from "lucide-react";

interface Match {
  match_id: number;
  match_nombre: string;
  match_email: string;
  match_fechaNacimiento: string;
  match_bio: string;
  match_edad: number;
  match_intereses: string[];
  score: number;
}

interface Candidate {
  id: string;
  name: string;
  age: number;
  photo: string;
  bio: string;
  location: string;
  compatibilityScore?: number;
  source?: "local" | "external"; // 🔥 Nuevo campo para distinguir origen
}

const DiscoveryMode = () => {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [loading, setLoading] = useState(true);
  const [swipeDirection, setSwipeDirection] = useState<"left" | "right" | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    const loadCandidates = async () => {
      try {
        const token = localStorage.getItem("token");
        
        // 🔥 Cargar desde /api/discovery (mezcla matches externos y locales)
        const response = await fetch("http://localhost:3001/api/discovery", {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${token}`
          }
        });

        if (!response.ok) {
          throw new Error(`Error: ${response.status}`);
        }

        const data = await response.json();
        
        if (!data.users || data.users.length === 0) {
          console.warn("No hay usuarios disponibles");
          setLoading(false);
          return;
        }

        // 🔥 Convertir usuarios al formato Candidate
        const convertedCandidates = data.users.map((user: any) => ({
          id: user.id.toString(),
          name: user.nombre,
          age: user.fechaNacimiento ? new Date().getFullYear() - new Date(user.fechaNacimiento).getFullYear() : 0,
          photo: user.avatar || "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=600&h=900&fit=crop&crop=face",
          bio: user.bio || "Usuario sin bio",
          location: "No especificada",
          compatibilityScore: Math.round(user.compatibilityScore || 0),
          source: user.source || "local" // Marcar si es externo o local
        }));

        setCandidates(convertedCandidates);
        console.log("✅ Candidatos cargados desde /api/discovery:", convertedCandidates);
      } catch (error) {
        console.error("Error cargando candidatos:", error);
        setCandidates([]);
      } finally {
        setLoading(false);
      }
    };

    loadCandidates();
  }, []);

  const handleSwipe = useCallback(async (direction) => {
    if (isAnimating || candidates.length === 0) return;

    setIsAnimating(true);
    setSwipeDirection(direction);

    const currentCandidate = candidates[0];

    // Si es derecha (like), hacer match SOLO si es usuario local
    if (direction === "right" && currentCandidate.source === "local") {
      try {
        const token = localStorage.getItem("token");
        
        // 🔥 Guardar el match en la BD
        const response = await fetch("http://localhost:3001/api/makeMatch", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          },
          body: JSON.stringify({
            targetUserId: parseInt(currentCandidate.id)
          })
        });

        const data = await response.json();
        if (response.ok) {
          console.log("✅ Match creado:", data);
        } else {
          console.warn("⚠️ Error al crear match:", data.error);
        }
      } catch (error) {
        console.error("Error al hacer match:", error);
      }
    } else if (direction === "right" && currentCandidate.source === "external") {
      console.log("ℹ️ No se puede hacer match con usuario del servicio externo");
    }

    setTimeout(() => {
      setCandidates((prev) => prev.slice(1));
      setSwipeDirection(null);
      setIsAnimating(false);
    }, 400);
  }, [isAnimating, candidates]);

  const currentCandidate = candidates[0];
  const nextCandidate = candidates[1];

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center">
          <p className="text-text-primary">Cargando perfiles...</p>
        </div>
      </div>
    );
  }

  if (candidates.length === 0) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl font-medium text-text-primary mb-2">
            No hay más perfiles por ahora
          </p>
          <p className="text-text-secondary">
            Vuelve más tarde para descubrir nuevas conexiones
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col items-center justify-center">
      {/* Card Stack */}
      <div className="relative w-[420px] aspect-[9/16]">
        {/* Next Card (Behind) */}
        {nextCandidate && (
          <div
            className="absolute inset-0 transition-all duration-300"
            style={{
              transform: swipeDirection ? "scale(1) translateY(0)" : "scale(0.95) translateY(20px)",
              opacity: swipeDirection ? 1 : 0.5,
            }}
          >
            <CandidateCard candidate={nextCandidate} isBackground />
          </div>
        )}

        {/* Current Card */}
        <div
          className={`absolute inset-0 transition-all duration-400 ease-out ${
            swipeDirection === "right"
              ? "translate-x-[150%] rotate-[15deg] opacity-0"
              : swipeDirection === "left"
              ? "-translate-x-[150%] -rotate-[15deg] opacity-0"
              : ""
          }`}
          style={{
            transitionTimingFunction: "cubic-bezier(0.2, 0.8, 0.2, 1)",
          }}
        >
          <CandidateCard candidate={currentCandidate} />
        </div>
      </div>

      {/* Control Buttons */}
      <div className="flex gap-8 mt-8">
        <button
          onClick={() => handleSwipe("left")}
          disabled={isAnimating}
          className="w-16 h-16 rounded-full bg-surface-100 border-[1.5px] border-text-tertiary flex items-center justify-center transition-all duration-200 hover:border-text-primary hover:bg-surface-200 disabled:opacity-50 group"
        >
          <X className="w-6 h-6 text-text-tertiary group-hover:text-text-primary transition-colors" strokeWidth={2} />
        </button>

        <button
          onClick={() => handleSwipe("right")}
          disabled={isAnimating}
          className="w-16 h-16 rounded-full bg-surface-100 border-[1.5px] border-text-tertiary flex items-center justify-center transition-all duration-200 hover:border-text-primary hover:bg-surface-200 disabled:opacity-50 group"
        >
          <Heart className="w-6 h-6 text-text-tertiary group-hover:text-text-primary transition-colors" strokeWidth={2} />
        </button>
      </div>
    </div>
  );
};

export default DiscoveryMode;
