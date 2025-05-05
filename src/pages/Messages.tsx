
import React, { useState } from "react";
import ContactList from "@/components/messages/ContactList";
import MessageList from "@/components/messages/MessageList";
import MessageInput from "@/components/messages/MessageInput";
import { mockContacts, mockMessages } from "@/data/mockMessages";

const Messages = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedContact, setSelectedContact] = useState<string | null>(null);

  // Filter contacts based on search query
  const filteredContacts = mockContacts.filter((contact) =>
    contact.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSelectContact = (contactId: string) => {
    setSelectedContact(contactId);
  };

  const handleSendMessage = (messageText: string) => {
    // In a real app, we'd send the message to the backend
    console.log("Sending message:", messageText);
  };

  return (
    <div className="container py-8">
      <h1 className="text-4xl font-bold mb-8">Messages</h1>

      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="flex h-[600px]">
          {/* Contacts sidebar */}
          <ContactList
            contacts={filteredContacts}
            selectedContact={selectedContact}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            onSelectContact={handleSelectContact}
          />

          {/* Chat area */}
          <div className="w-2/3 flex flex-col">
            <MessageList
              selectedContactId={selectedContact}
              messages={selectedContact ? mockMessages[selectedContact] : []}
              contacts={mockContacts}
            />
            
            {selectedContact && (
              <MessageInput 
                onSendMessage={handleSendMessage}
                disabled={!selectedContact}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Messages;
