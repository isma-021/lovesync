import { useState } from "react";
import { ChatContact } from "@/pages/Dashboard";
import { cn } from "@/lib/utils";

interface Message {
  id: string;
  content: string;
  isOwn: boolean;
  timestamp: string;
}

interface ChatStreamProps {
  contact: ChatContact;
}

// Mock messages for demo
const getMockMessages = (contactName: string): Message[] => [
  {
    id: "1",
    content: "¡Hola! Vi que también te gusta viajar 🌍",
    isOwn: false,
    timestamp: "14:30",
  },
  {
    id: "2",
    content: "¡Sí! Me encanta descubrir nuevos lugares. ¿Cuál ha sido tu viaje favorito?",
    isOwn: true,
    timestamp: "14:32",
  },
  {
    id: "3",
    content: "Definitivamente Japón. La cultura, la comida, todo fue increíble.",
    isOwn: false,
    timestamp: "14:35",
  },
  {
    id: "4",
    content: "¡Japón está en mi lista! Me muero por ir a Kioto.",
    isOwn: true,
    timestamp: "14:38",
  },
];

const ChatStream = ({ contact }: ChatStreamProps) => {
  const [messages, setMessages] = useState<Message[]>(
    contact.isNewMatch ? [] : getMockMessages(contact.name)
  );
  const [inputValue, setInputValue] = useState("");

  const handleSend = () => {
    if (!inputValue.trim()) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      content: inputValue,
      isOwn: true,
      timestamp: new Date().toLocaleTimeString("es-ES", {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    setMessages((prev) => [...prev, newMessage]);
    setInputValue("");
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="h-16 px-6 flex items-center border-b border-border">
        <h2 className="text-lg font-semibold text-text-primary">{contact.name}</h2>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {messages.length === 0 ? (
          <div className="h-full flex items-center justify-center">
            <p className="text-text-tertiary text-center">
              Nueva conexión con {contact.name}.<br />
              ¡Envía el primer mensaje!
            </p>
          </div>
        ) : (
          messages.map((message) => (
            <div
              key={message.id}
              className={cn("flex", message.isOwn ? "justify-end" : "justify-start")}
            >
              <div
                className={cn(
                  "max-w-[60%] px-4 py-3 rounded-2xl",
                  message.isOwn
                    ? "bg-surface-300 text-text-primary"
                    : "bg-surface-200 text-text-primary"
                )}
              >
                <p className="text-sm leading-relaxed">{message.content}</p>
                <p className="text-[10px] text-text-tertiary mt-1 text-right">
                  {message.timestamp}
                </p>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Input Area */}
      <div className="p-4 border-t border-border">
        <div className="flex gap-3 items-center">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Escribe un mensaje..."
            className="flex-1 px-4 py-3 bg-surface-200 rounded-xl text-sm text-text-primary placeholder:text-text-tertiary focus:outline-none focus:ring-2 focus:ring-ring"
          />
          <button
            onClick={handleSend}
            disabled={!inputValue.trim()}
            className={cn(
              "px-4 py-3 text-sm font-medium transition-opacity",
              inputValue.trim()
                ? "text-text-primary opacity-100"
                : "text-text-tertiary opacity-50"
            )}
          >
            Enviar
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatStream;
