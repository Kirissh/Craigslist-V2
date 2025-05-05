
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search, Users, MessageSquare, Clock, Pin } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { formatDistanceToNow } from "date-fns";

// Mock forum data
const mockForumTopics = [
  {
    id: "1",
    title: "How do I price my vintage furniture correctly?",
    description: "I have several mid-century pieces and I'm not sure how to price them competitively.",
    user: {
      id: "101",
      name: "SarahT",
      avatar: null,
    },
    views: 324,
    replies: 18,
    isPinned: true,
    lastActivity: new Date(2025, 4, 1),
  },
  {
    id: "2",
    title: "Best practices for shipping large items",
    description: "Looking for advice on how to safely ship furniture and other large items.",
    user: {
      id: "102",
      name: "MikeJ",
      avatar: null,
    },
    views: 186,
    replies: 12,
    isPinned: false,
    lastActivity: new Date(2025, 5, 1),
  },
  {
    id: "3",
    title: "Experiences with local pickup vs. delivery?",
    description: "What's worked best for you when selling items locally?",
    user: {
      id: "103",
      name: "ElenaR",
      avatar: null,
    },
    views: 97,
    replies: 8,
    isPinned: false,
    lastActivity: new Date(2025, 5, 2),
  },
  {
    id: "4",
    title: "Avoid scams - share your tips!",
    description: "Let's compile a list of common scams and how to avoid them.",
    user: {
      id: "104",
      name: "JamesW",
      avatar: null,
    },
    views: 412,
    replies: 32,
    isPinned: true,
    lastActivity: new Date(2025, 5, 1),
  },
  {
    id: "5",
    title: "How to take better photos of your items",
    description: "Tips and tricks for making your listings stand out with great photography.",
    user: {
      id: "105",
      name: "PhotoPro",
      avatar: null,
    },
    views: 256,
    replies: 24,
    isPinned: false,
    lastActivity: new Date(2025, 4, 29),
  },
];

// Forum categories
const forumCategories = [
  { id: "all", name: "All Topics" },
  { id: "selling", name: "Selling Tips" },
  { id: "buying", name: "Buying Advice" },
  { id: "shipping", name: "Shipping & Delivery" },
  { id: "safety", name: "Safety & Scams" },
  { id: "community", name: "Community" },
];

const Forum = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  // Filter topics based on search and category
  const filteredTopics = mockForumTopics.filter((topic) => {
    const matchesSearch =
      searchQuery === "" ||
      topic.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      topic.description.toLowerCase().includes(searchQuery.toLowerCase());

    // For now, we're not filtering by category since we haven't assigned categories to topics
    // This would be implemented when connected to the backend

    return matchesSearch;
  });

  // Sort topics: pinned first, then by last activity
  const sortedTopics = [...filteredTopics].sort((a, b) => {
    if (a.isPinned && !b.isPinned) return -1;
    if (!a.isPinned && b.isPinned) return 1;
    return b.lastActivity.getTime() - a.lastActivity.getTime();
  });

  return (
    <div className="container py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div>
          <h1 className="text-4xl font-bold">Community Forum</h1>
          <p className="text-gray-600 mt-2">
            Join discussions, ask questions, and share your experiences
          </p>
        </div>
        <Button className="gradient-purple mt-4 md:mt-0" asChild>
          <Link to="/forum/new">
            <MessageSquare className="mr-2 h-4 w-4" /> New Topic
          </Link>
        </Button>
      </div>

      {/* Search and filters */}
      <div className="bg-white rounded-xl shadow-md p-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
            <Input
              type="text"
              placeholder="Search forum topics"
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="flex flex-wrap gap-2">
            {forumCategories.map((category) => (
              <Button
                key={category.id}
                variant={selectedCategory === category.id ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category.id)}
              >
                {category.name}
              </Button>
            ))}
          </div>
        </div>
      </div>

      {/* Topic list */}
      <div className="space-y-4">
        {sortedTopics.map((topic) => (
          <Card key={topic.id} className="relative">
            {topic.isPinned && (
              <div className="absolute top-4 right-4">
                <Pin className="h-4 w-4 text-classify-purple" />
              </div>
            )}
            <CardHeader className="pb-2">
              <CardTitle className="text-xl hover:text-classify-purple">
                <Link to={`/forum/${topic.id}`}>{topic.title}</Link>
              </CardTitle>
              <p className="text-gray-600 text-sm line-clamp-1">
                {topic.description}
              </p>
            </CardHeader>
            <CardContent className="pb-2">
              <div className="flex items-center text-sm text-gray-500">
                <Avatar className="h-6 w-6 mr-2">
                  <AvatarFallback>
                    {topic.user.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <span className="font-medium">{topic.user.name}</span>
                <span className="mx-2">•</span>
                <Clock className="h-3 w-3 mr-1" />
                <span>
                  {formatDistanceToNow(topic.lastActivity, { addSuffix: true })}
                </span>
              </div>
            </CardContent>
            <CardFooter className="pt-2 text-sm text-gray-500 flex justify-between">
              <div className="flex items-center">
                <Users className="h-4 w-4 mr-1" />
                <span>{topic.views} views</span>
              </div>
              <div className="flex items-center">
                <MessageSquare className="h-4 w-4 mr-1" />
                <span>{topic.replies} replies</span>
              </div>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Forum;
