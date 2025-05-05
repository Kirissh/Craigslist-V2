
import React from "react";
import { formatDistanceToNow } from "date-fns";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface Contact {
  id: string;
  name: string;
  avatar: string | null;
  lastMessage: string;
  timestamp: Date;
  unread: number;
}

interface ContactListProps {
  contacts: Contact[];
  selectedContact: string | null;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onSelectContact: (contactId: string) => void;
}

const ContactList = ({
  contacts,
  selectedContact,
  searchQuery,
  onSearchChange,
  onSelectContact,
}: ContactListProps) => {
  return (
    <div className="w-1/3 border-r">
      <div className="p-4">
        <div className="relative mb-4">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            type="text"
            placeholder="Search contacts"
            className="pl-10"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>

        <div className="divide-y">
          {contacts.map((contact) => (
            <div
              key={contact.id}
              className={`py-3 px-2 cursor-pointer rounded-md ${
                selectedContact === contact.id
                  ? "bg-gray-100"
                  : "hover:bg-gray-50"
              }`}
              onClick={() => onSelectContact(contact.id)}
            >
              <div className="flex items-start">
                <Avatar className="h-10 w-10">
                  <AvatarFallback>
                    {contact.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div className="ml-3 flex-1">
                  <div className="flex justify-between">
                    <span className="font-medium">{contact.name}</span>
                    <span className="text-xs text-gray-500">
                      {formatDistanceToNow(contact.timestamp, {
                        addSuffix: true,
                      })}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 line-clamp-1">
                    {contact.lastMessage}
                  </p>
                </div>
                {contact.unread > 0 && (
                  <div className="ml-2 bg-classify-purple text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {contact.unread}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ContactList;
