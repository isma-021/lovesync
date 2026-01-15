import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import DashboardSidebar from "@/components/dashboard/DashboardSidebar";
import DiscoveryMode from "@/components/dashboard/DiscoveryMode";
import MessagingMode from "@/components/dashboard/MessagingMode";
import ProfileEditor from "@/components/dashboard/ProfileEditor";

export interface ChatContact {
  id: string;
  name: string;
  avatar: string;
  lastMessage: string;
  timestamp: string;
  isNewMatch: boolean;
}

type ViewMode = "discovery" | "messaging" | "profile";

const Dashboard = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const userId = localStorage.getItem("userId");

  const [contacts, setContacts] = useState<ChatContact[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeChat, setActiveChat] = useState<ChatContact | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>("discovery");

  useEffect(() => {
    // Si no hay token, lo mandamos al login de inmediato
    if (!token) {
      navigate("/");
      return;
    }

    // Cargar matches del usuario
    const loadMatches = async () => {
      try {
        const response = await fetch("http://localhost:3001/api/matches", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          }
        });

        const data = await response.json();

        if (response.ok) {
          // Convertir usuarios a formato ChatContact
          const chatContacts: ChatContact[] = data.matches.map((user: any) => ({
            id: user.id.toString(),
            name: user.nombre,
            avatar: user.avatar || "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop&crop=face",
            lastMessage: "Nueva conexión establecida.",
            timestamp: "Reciente",
            isNewMatch: true
          }));
          setContacts(chatContacts);
          setActiveChat(null); // Volver a la lista de chats
          setViewMode("discovery");
        } else {
          setContacts([]);
        }
      } catch (error) {
        console.error("Error cargando matches:", error);
        setContacts([]);
      } finally {
        setLoading(false);
      }
    };

    loadMatches();
  }, [token, navigate]);

  // Si no hay token, no renderizamos nada mientras redirige
  if (!token) return null;

  const handleSelectChat = (contact: ChatContact) => {
    setActiveChat(contact);
    setViewMode("messaging");
  };

  const handleBackToDiscovery = () => {
    setActiveChat(null);
    setViewMode("discovery");
  };

  const handleMatchDeleted = () => {
    // Recargar la lista de matches después de eliminar uno
    const loadMatches = async () => {
      try {
        const response = await fetch("http://localhost:3001/api/matches", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          }
        });

        const data = await response.json();

        if (response.ok) {
          const chatContacts: ChatContact[] = data.matches.map((user: any) => ({
            id: user.id.toString(),
            name: user.nombre,
            avatar: user.avatar || "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop&crop=face",
            lastMessage: "Nueva conexión establecida.",
            timestamp: "Reciente",
            isNewMatch: true
          }));
          setContacts(chatContacts);
        }
      } catch (error) {
        console.error("Error recargando matches:", error);
      }
    };

    loadMatches();
    setActiveChat(null);
    setViewMode("discovery");
  };

  const handleProfileClick = () => {
    setActiveChat(null);
    setViewMode("profile");
  };

  const renderRightColumn = () => {
    switch (viewMode) {
      case "messaging":
        return activeChat ? (
          <MessagingMode
            contact={activeChat}
            onBack={handleBackToDiscovery}
            onMatchDeleted={handleMatchDeleted}
          />
        ) : null;
      case "profile":
        return (
          <ProfileEditor
            onCancel={handleBackToDiscovery}
            onSave={handleBackToDiscovery}
          />
        );
      default:
        return <DiscoveryMode />;
    }
  };

  return (
    <div className="h-screen w-full flex overflow-hidden">
      {/* Left Sidebar - 40% */}
      <DashboardSidebar
        contacts={contacts}
        activeChat={activeChat}
        isDiscoveryActive={viewMode === "discovery"}
        onSelectChat={handleSelectChat}
        onDiscoveryClick={handleBackToDiscovery}
        onProfileClick={handleProfileClick}
        isEmpty={contacts.length === 0}
      />

      {/* Right Stage - 60% */}
      <div className="w-[60%] h-full bg-surface-100 relative">
        {renderRightColumn()}
      </div>
    </div>
  );
};

export default Dashboard;
