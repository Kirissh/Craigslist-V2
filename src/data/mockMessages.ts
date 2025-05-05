
// Mock contact and message data
export const mockContacts = [
  {
    id: "1",
    name: "John Smith",
    avatar: null,
    lastMessage: "Hey, is the iPhone still available?",
    timestamp: new Date(2025, 5, 1, 14, 23),
    unread: 2,
  },
  {
    id: "2",
    name: "Sarah Johnson",
    avatar: null,
    lastMessage: "I'll take it for $800. Can we meet tomorrow?",
    timestamp: new Date(2025, 5, 1, 10, 15),
    unread: 0,
  },
  {
    id: "3",
    name: "Mike Williams",
    avatar: null,
    lastMessage: "Thanks for the quick delivery!",
    timestamp: new Date(2025, 4, 30, 17, 45),
    unread: 0,
  },
];

export const mockMessages: Record<string, Array<{
  id: string;
  senderId: string;
  content: string;
  timestamp: Date;
}>> = {
  "1": [
    {
      id: "m1",
      senderId: "1",
      content: "Hi there, I saw your listing for the iPhone.",
      timestamp: new Date(2025, 5, 1, 14, 20),
    },
    {
      id: "m2",
      senderId: "current-user",
      content: "Yes, it's still available!",
      timestamp: new Date(2025, 5, 1, 14, 21),
    },
    {
      id: "m3",
      senderId: "1",
      content: "Great! How's the condition? Any scratches?",
      timestamp: new Date(2025, 5, 1, 14, 22),
    },
    {
      id: "m4",
      senderId: "1",
      content: "Hey, is the iPhone still available?",
      timestamp: new Date(2025, 5, 1, 14, 23),
    },
  ],
  "2": [
    {
      id: "m1",
      senderId: "2",
      content: "Hello, I'm interested in your laptop listing.",
      timestamp: new Date(2025, 5, 1, 9, 30),
    },
    {
      id: "m2",
      senderId: "current-user",
      content: "Hi Sarah! Yes, it's available. Were you interested in seeing it in person?",
      timestamp: new Date(2025, 5, 1, 9, 45),
    },
    {
      id: "m3",
      senderId: "2",
      content: "Yes, I'd like to check it out. Would $800 work for you?",
      timestamp: new Date(2025, 5, 1, 10, 10),
    },
    {
      id: "m4",
      senderId: "2",
      content: "I'll take it for $800. Can we meet tomorrow?",
      timestamp: new Date(2025, 5, 1, 10, 15),
    },
  ],
  "3": [
    {
      id: "m1",
      senderId: "current-user",
      content: "Hi Mike, your package has been shipped. Tracking number: TRK12345678",
      timestamp: new Date(2025, 4, 29, 11, 20),
    },
    {
      id: "m2",
      senderId: "3",
      content: "Got it, thanks! I'll keep an eye out for it.",
      timestamp: new Date(2025, 4, 29, 12, 5),
    },
    {
      id: "m3",
      senderId: "3",
      content: "Just received it. Everything looks great!",
      timestamp: new Date(2025, 4, 30, 16, 30),
    },
    {
      id: "m4",
      senderId: "3",
      content: "Thanks for the quick delivery!",
      timestamp: new Date(2025, 4, 30, 17, 45),
    },
  ],
};
