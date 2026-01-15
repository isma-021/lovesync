import { useMemo } from "react"; // Importante para que no cambie la foto al hacer click
import { ChatContact } from "@/pages/Dashboard";
import { cn } from "@/lib/utils";

interface ChatListItemProps {
  contact: ChatContact;
  isActive: boolean;
  onClick: () => void;
}

const ChatListItem = ({ contact, isActive, onClick }: ChatListItemProps) => {
  // Generamos un índice basado en el ID del contacto (o el nombre si no hay ID)
  // Esto asegura que cada contacto tenga SIEMPRE la misma foto asignada.
  const photoIndex = useMemo(() => {
    const identifier = contact.id || contact.name;
    const hash = identifier.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return hash % 27; // Resultado entre 0 y 26
  }, [contact.id, contact.name]);

  const avatarUrl = `/img/${photoIndex}.png`;

  return (
    <button
      onClick={onClick}
      className={cn(
        "w-full h-[72px] px-4 flex items-center gap-3 transition-colors duration-200",
        isActive
          ? "bg-surface-300 border-l-2 border-l-charcoal"
          : "hover:bg-surface-300 border-l-2 border-l-transparent"
      )}
    >
      {/* Avatar with dynamic local image */}
      <div className="relative flex-shrink-0">
        <img
          src={avatarUrl}
          alt={contact.name}
          className="w-12 h-12 rounded-full object-cover bg-surface-200"
          // Añadimos un fallback por si la imagen tarda en cargar
          onError={(e) => {
            (e.target as HTMLImageElement).src = "/img/0.png";
          }}
        />
        {contact.isNewMatch && (
          <div className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-signal-green rounded-full border-2 border-surface-100" />
        )}
      </div>

      {/* Text Stack */}
      <div className="flex-1 min-w-0 text-left">
        <p className="text-[15px] font-semibold text-text-primary truncate">
          {contact.name}
        </p>
        <p className={cn(
          "text-[13px] truncate",
          contact.isNewMatch ? "text-text-primary font-medium" : "text-text-secondary"
        )}>
          {contact.lastMessage}
        </p>
      </div>

      {/* Timestamp */}
      <div className="flex flex-col items-end gap-1">
        <span className="text-[11px] text-text-secondary flex-shrink-0">
          {contact.timestamp}
        </span>
        {/* Opcional: un pequeño badge si es nuevo match */}
        {contact.isNewMatch && (
          <span className="text-[10px] bg-signal-green/10 text-signal-green px-1.5 rounded-full font-bold">
            NUEVO
          </span>
        )}
      </div>
    </button>
  );
};

export default ChatListItem;