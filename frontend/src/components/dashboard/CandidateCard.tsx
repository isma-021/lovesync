import { useState, useMemo } from "react";
import { cn } from "@/lib/utils";

interface Candidate {
  id: string;
  name: string;
  age: number;
  bio: string;
  location: string;
}

interface CandidateCardProps {
  candidate: Candidate;
  isBackground?: boolean;
}

const CandidateCard = ({ candidate, isBackground = false }: CandidateCardProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

  // 1. Lógica para imagen única por carta:
  // Usamos el ID del candidato para generar un índice consistente entre 0 y 26.
  // Esto asegura que cada carta tenga su propia foto y no cambie aleatoriamente al hacer scroll.
  const photoIndex = useMemo(() => {
    const idHash = candidate.id.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return idHash % 27; // Devuelve un número entre 0 y 26
  }, [candidate.id]);

  const randomPhoto = `/img/${photoIndex}.png`;

  const handleMetaClick = () => {
    if (!isBackground) setIsExpanded(!isExpanded);
  };

  // Definimos la transición aquí para evitar el error de Tailwind con los corchetes
  const transitionStyle = {
    transitionTimingFunction: "cubic-bezier(0.2, 0.8, 0.2, 1)",
  };

  return (
    <div
      className={cn(
        "w-full h-full rounded-3xl bg-surface-100 border border-border overflow-hidden transition-shadow duration-500",
        isBackground ? "" : "shadow-[0px_12px_32px_-8px_rgba(0,0,0,0.08),0px_2px_6px_rgba(0,0,0,0.04)]"
      )}
    >
      {/* Photo Section */}
      <div
        className="relative overflow-hidden transition-all duration-500"
        style={{
          height: isExpanded ? "50%" : "85%",
          ...transitionStyle,
        }}
      >
        <img
          src={randomPhoto}
          alt={candidate.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-black/40 to-transparent" />
      </div>

      {/* Meta Data Section */}
      <div
        onClick={handleMetaClick}
        className={cn(
          "bg-surface-100 px-5 py-4 transition-all duration-500 cursor-pointer",
          isBackground ? "" : "hover:bg-surface-200/50"
        )}
        style={{
          height: isExpanded ? "50%" : "15%",
          ...transitionStyle,
        }}
      >
        <div className="flex items-baseline gap-2">
          <span className="text-xl font-bold text-text-primary">{candidate.name},</span>
          <span className="text-sm font-mono text-text-secondary">[{candidate.age}]</span>
        </div>

        <div className="mt-2 overflow-hidden">
          {isExpanded ? (
            <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
              <p className="text-sm text-text-secondary leading-relaxed">
                {candidate.bio}
              </p>
              <p className="text-xs text-text-tertiary mt-3">
                📍 {candidate.location}
              </p>
            </div>
          ) : (
            <p className="text-sm text-text-secondary truncate">
              {candidate.bio}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default CandidateCard;