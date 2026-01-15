import { useState, useRef, useEffect } from "react";
import { User, Settings, LogOut, ChevronDown } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface UserMenuProps {
  userName: string;
  userAvatar: string;
  onProfileClick: () => void;
}

const UserMenu = ({ userName, userAvatar, onProfileClick }: UserMenuProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    // 1. Borrar los datos del almacenamiento
    localStorage.removeItem("token");
    localStorage.removeItem("userName");
    localStorage.removeItem("mail");
    localStorage.removeItem("userId");
    localStorage.removeItem("cumpl");

    // 2. Redirigir al login
    window.location.href = "/"; 
  };

  const handleProfileClick = () => {
    setIsOpen(false);
    onProfileClick();
  };

  return (
    <div ref={menuRef} className="relative">
      {/* User Header Trigger */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="h-20 w-full px-6 flex items-center gap-3 hover:bg-surface-200 transition-colors duration-200"
      >
        <img
          src={userAvatar}
          alt={userName}
          className="w-8 h-8 rounded-full object-cover shadow-inner"
        />
        <span className="text-sm font-medium text-text-primary">{userName}</span>
        <ChevronDown
          className={`w-3.5 h-3.5 text-text-tertiary transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div
          className="absolute top-[72px] left-4 w-60 bg-surface-100 border border-border-subtle rounded-xl z-[100] animate-in fade-in slide-in-from-top-2 duration-200"
          style={{
            boxShadow: "0px 10px 15px -3px rgba(0, 0, 0, 0.05), 0px 4px 6px -2px rgba(0, 0, 0, 0.025)",
          }}
        >
          {/* Mi perfil */}
          <button
            onClick={handleProfileClick}
            className="w-full px-4 py-3 flex items-center gap-3 hover:bg-[#F9FAFB] transition-colors rounded-t-xl"
          >
            <User className="w-4 h-4 text-text-secondary" strokeWidth={1.5} />
            <span className="text-[13px] text-[#374151]">Mi perfil</span>
          </button>

          {/* Opciones */}
          <button
            onClick={() => setIsOpen(false)}
            className="w-full px-4 py-3 flex items-center gap-3 hover:bg-[#F9FAFB] transition-colors"
          >
            <Settings className="w-4 h-4 text-text-secondary" strokeWidth={1.5} />
            <span className="text-[13px] text-[#374151]">Opciones</span>
          </button>

          {/* Divider */}
          <div className="h-px bg-[#F3F4F6] mx-0" />

          {/* Cerrar Sesión */}
          <button
            onClick={handleLogout}
            className="w-full px-4 py-3 flex items-center gap-3 hover:bg-[#FEF2F2] transition-colors rounded-b-xl"
          >
            <LogOut className="w-4 h-4 text-[#EF4444]" strokeWidth={1.5} />
            <span className="text-[13px] font-medium text-[#DC2626]">Cerrar Sesión</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default UserMenu;
