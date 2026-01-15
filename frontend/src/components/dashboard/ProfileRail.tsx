import { useState, useMemo } from "react"; // Añadido useMemo
import { ChatContact } from "@/pages/Dashboard";
import { MapPin, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ProfileRailProps {
  contact: ChatContact;
  onMatchDeleted?: () => void;
}

const getProfileData = (contact: ChatContact) => ({
  ...contact,
  age: 27,
  location: "Madrid, España",
  fullBio: "Apasionada por el arte y el diseño. Me encanta pasar las tardes en museos y galerías, o simplemente paseando por la ciudad con un buen café. Busco a alguien con quien compartir conversaciones profundas y aventuras espontáneas. También me gusta la fotografía y cocinar platos nuevos los fines de semana.",
});

const ProfileRail = ({ contact, onMatchDeleted }: ProfileRailProps) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const profile = getProfileData(contact);

  // Mismos cálculos que en ChatListItem para mantener la consistencia visual
  const avatarUrl = useMemo(() => {
    const identifier = contact.id || contact.name;
    const hash = identifier.split("").reduce((acc, char) => {
      return char.charCodeAt(0) + ((acc << 5) - acc);
    }, 0);
    const index = Math.abs(hash) % 27;
    return `/img/${index}.png`;
  }, [contact.id, contact.name]);

  const handleDeleteMatch = async () => {
    if (!confirm("¿Estás seguro de que quieres eliminar este match?")) {
      return;
    }

    setIsDeleting(true);
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:3001/api/deleteMatch", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          targetUserId: parseInt(contact.id)
        })
      });

      if (response.ok) {
        if (onMatchDeleted) onMatchDeleted();
      } else {
        const data = await response.json();
        alert(`Error: ${data.error}`);
      }
    } catch (error) {
      console.error("Error al eliminar match:", error);
      alert("Error al eliminar el match");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="h-full bg-surface-100 overflow-y-auto">
      {/* Profile Photo - Usando la imagen dinámica */}
      <div className="w-full aspect-[3/4] bg-surface-200">
        <img
          src={avatarUrl}
          alt={contact.name}
          className="w-full h-full object-cover"
          onError={(e) => {
            (e.target as HTMLImageElement).src = "/img/0.png";
          }}
        />
      </div>

      {/* Profile Data */}
      <div className="p-4 space-y-4">
        <div>
          <h3 className="text-lg font-semibold text-text-primary">
            {contact.name}
          </h3>
          <span className="text-sm font-mono text-text-secondary">
            {profile.age} años
          </span>
        </div>

        <div className="flex items-center gap-2 text-text-secondary">
          <MapPin className="w-4 h-4" />
          <span className="text-sm">{profile.location}</span>
        </div>

        <div>
          <p className="text-sm text-text-secondary leading-relaxed">
            {profile.fullBio}
          </p>
        </div>

        <div className="pt-2">
          <Button
            onClick={handleDeleteMatch}
            disabled={isDeleting}
            variant="destructive"
            className="w-full flex items-center justify-center gap-2"
          >
            <Trash2 className="w-4 h-4" />
            {isDeleting ? "Eliminando..." : "Eliminar Match"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProfileRail;