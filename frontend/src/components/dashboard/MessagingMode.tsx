import { useState } from "react";
import { ChatContact } from "@/pages/Dashboard";
import ChatStream from "./ChatStream";
import ProfileRail from "./ProfileRail";

interface MessagingModeProps {
  contact: ChatContact;
  onBack: () => void;
  onMatchDeleted?: () => void;
}

const MessagingMode = ({ contact, onBack, onMatchDeleted }: MessagingModeProps) => {
  return (
    <div className="h-full flex animate-fade-in-up" style={{ animationDuration: "0.3s" }}>
      {/* Chat Stream Area - 75% */}
      <div className="w-[75%] h-full flex flex-col">
        <ChatStream contact={contact} />
      </div>

      {/* Static Profile Rail - 25% */}
      <div className="w-[25%] h-full border-l border-border">
        <ProfileRail contact={contact} onMatchDeleted={onMatchDeleted} />
      </div>
    </div>
  );
};

export default MessagingMode;
