
import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Send } from "lucide-react";

interface MessageInputProps {
  onSendMessage: (message: string) => void;
  disabled?: boolean;
}

const MessageInput = ({ onSendMessage, disabled = false }: MessageInputProps) => {
  const [messageText, setMessageText] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageText.trim()) return;

    onSendMessage(messageText);
    setMessageText("");
  };

  return (
    <div className="p-4 border-t">
      <form onSubmit={handleSubmit} className="flex items-center">
        <Input
          type="text"
          placeholder="Type your message..."
          className="flex-1"
          value={messageText}
          onChange={(e) => setMessageText(e.target.value)}
          disabled={disabled}
        />
        <Button
          type="submit"
          className="ml-2 gradient-purple"
          disabled={disabled || !messageText.trim()}
        >
          <Send className="h-4 w-4" />
        </Button>
      </form>
    </div>
  );
};

export default MessageInput;
