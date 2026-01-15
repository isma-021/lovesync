import { Layers } from "lucide-react";
import { ChatContact } from "@/pages/Dashboard";
import ChatListItem from "./ChatListItem";
import UserMenu from "./UserMenu";
import React, { useState, useEffect } from "react";

interface DashboardSidebarProps {
  contacts: ChatContact[];
  activeChat: ChatContact | null;
  isDiscoveryActive: boolean;
  onSelectChat: (contact: ChatContact) => void;
  onDiscoveryClick: () => void;
  onProfileClick: () => void;
  isEmpty?: boolean;
}

const DashboardSidebar = ({ 
  contacts, 
  activeChat, 
  isDiscoveryActive,
  onSelectChat, 
  onDiscoveryClick,
  onProfileClick,
  isEmpty = false,
}: DashboardSidebarProps) => {
  const [userName, setUserName] = useState<string | null>(null);

  useEffect(() => {
    const storedUserName = localStorage.getItem("userName");
    setUserName(storedUserName);
  }, []);
  return (
    <div className="w-[40%] h-full bg-surface-200 noise-overlay border-r border-border-subtle flex flex-col">
      {/* User Menu Header */}
      <UserMenu
        userName={userName || "Usuario"}
        userAvatar="https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&h=200&fit=crop&crop=face"
        onProfileClick={onProfileClick}
      />

      {/* Discovery Portal */}
      <div className="px-4 py-3">
        <button
          onClick={onDiscoveryClick}
          className={`
            w-full h-[88px] px-4 py-3 rounded-2xl
            bg-surface-100 border transition-all duration-200
            flex items-center gap-4
            hover:-translate-y-px hover:shadow-md hover:border-border
            ${isDiscoveryActive 
              ? 'border-2 border-text-primary shadow-md' 
              : 'border-border-subtle shadow-sm'
            }
          `}
        >
          {/* Icon Circle */}
          <div className="w-12 h-12 rounded-full bg-[#1F2937] flex items-center justify-center flex-shrink-0 transition-transform duration-200 group-hover:rotate-[15deg] hover:rotate-[15deg]">
            <Layers className="w-5 h-5 text-white" strokeWidth={2} />
          </div>
          
          {/* Text Stack */}
          <div className="flex flex-col items-start text-left">
            <span className="text-[15px] font-semibold text-text-primary">
              Descubre Nuevos Matches
            </span>
            <span className="text-[13px] text-text-secondary">
              Entra para descubrir nueva gente
            </span>
          </div>
        </button>
      </div>

      {/* Spacer - natural break from white card */}
      <div className="h-6" />

      {/* Messages Section */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <span className="px-6 text-[11px] font-medium uppercase tracking-[0.08em] text-[#9CA3AF] mb-3">
          Mensajes
        </span>

        {/* Chat List */}
        <div className="flex-1 overflow-y-auto">
          {isEmpty || contacts.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center px-6">
              <p className="text-text-secondary text-sm">
                Aún no has conectado con nadie
              </p>
              <p className="text-text-tertiary text-xs mt-2">
                Explora nuevos perfiles para encontrar matches
              </p>
            </div>
          ) : (
            contacts.map((contact) => (
              <ChatListItem
                key={contact.id}
                contact={contact}
                isActive={activeChat?.id === contact.id}
                onClick={() => onSelectChat(contact)}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardSidebar;
