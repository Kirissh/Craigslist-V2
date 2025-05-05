
import React from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface Message {
  id: string;
  senderId: string;
  content: string;
  timestamp: Date;
}

interface Contact {
  id: string;
  name: string;
  avatar: string | null;
}

interface MessageListProps {
  selectedContactId: string | null;
  messages: Message[];
  contacts: Contact[];
}

const MessageList = ({ 
  selectedContactId, 
  messages, 
  contacts 
}: MessageListProps) => {
  const selectedContact = contacts.find((c) => c.id === selectedContactId);
  
  if (!selectedContactId || !selectedContact) {
    return (
      <div className="flex-1 flex items-center justify-center text-gray-500">
        Select a conversation to start chatting
      </div>
    );
  }

  return (
    <>
      {/* Chat header */}
      <div className="p-4 border-b flex items-center">
        <Avatar className="h-10 w-10">
          <AvatarFallback>
            {selectedContact.name.charAt(0)}
          </AvatarFallback>
        </Avatar>
        <div className="ml-3">
          <h2 className="font-medium">{selectedContact.name}</h2>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 p-4 space-y-4 overflow-y-auto">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${
              message.senderId === "current-user"
                ? "justify-end"
                : "justify-start"
            }`}
          >
            <div
              className={`max-w-[70%] p-3 rounded-lg ${
                message.senderId === "current-user"
                  ? "bg-classify-purple text-white"
                  : "bg-gray-100"
              }`}
            >
              <p>{message.content}</p>
              <div
                className={`text-xs mt-1 ${
                  message.senderId === "current-user"
                    ? "text-white/70"
                    : "text-gray-500"
                }`}
              >
                {message.timestamp.toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default MessageList;
