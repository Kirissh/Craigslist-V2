
import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ArrowLeft, Clock, Heart, Flag, Share, MessageSquare } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { Separator } from "@/components/ui/separator";

// Mock topic data - this would come from an API in a real app
const mockTopic = {
  id: "1",
  title: "How do I price my vintage furniture correctly?",
  content: "I have several mid-century pieces including a Danish teak dining table, several Eames-style chairs, and a credenza. They're all in good condition, but I'm not sure how to price them competitively. Any advice from experienced sellers would be greatly appreciated!",
  user: {
    id: "101",
    name: "SarahT",
    avatar: null,
    joinedDate: "January 2024"
  },
  views: 324,
  likes: 18,
  createdAt: new Date(2025, 4, 1),
};

// Mock replies
const mockReplies = [
  {
    id: "r1",
    content: "For mid-century furniture, I recommend looking at similar pieces on specialty marketplaces like 1stDibs or Chairish to get a sense of pricing. However, keep in mind those sites tend to price on the higher end. For local selling, you might want to price 20-30% lower than those references.",
    user: {
      id: "102",
      name: "VintagePro",
      avatar: null,
      joinedDate: "March 2023"
    },
    likes: 12,
    createdAt: new Date(2025, 4, 1, 12, 30),
  },
  {
    id: "r2",
    content: "Condition is everything with vintage pieces. Make sure to document any wear, repairs, or damage with clear photos. Authentic pieces from known designers will command higher prices, so research the maker's marks or any identifying features. I'd be happy to look at photos if you want to share them!",
    user: {
      id: "103",
      name: "FurnitureCollector",
      avatar: null,
      joinedDate: "September 2024"
    },
    likes: 8,
    createdAt: new Date(2025, 4, 1, 14, 15),
  },
  {
    id: "r3",
    content: "Don't forget to factor in your local market! Mid-century pieces sell for much more in major cities than in smaller towns. If you're in a less populated area, you might want to consider selling online with shipping options to reach more potential buyers.",
    user: {
      id: "104",
      name: "DesignLover",
      avatar: null,
      joinedDate: "July 2024"
    },
    likes: 5,
    createdAt: new Date(2025, 4, 2, 9, 45),
  }
];

const ForumTopic = () => {
  const { topicId } = useParams();
  const [topic, setTopic] = useState(mockTopic);
  const [replies, setReplies] = useState(mockReplies);
  const [newReply, setNewReply] = useState("");

  useEffect(() => {
    // In a real app, we'd fetch the topic and replies from the backend
    console.log("Fetching topic with ID:", topicId);
    // For now, we'll just use the mock data
  }, [topicId]);

  const handleSubmitReply = (e) => {
    e.preventDefault();
    if (!newReply.trim()) return;

    // In a real app, we'd post the reply to the backend
    const newReplyObj = {
      id: `r${replies.length + 1}`,
      content: newReply,
      user: {
        id: "current-user",
        name: "CurrentUser",
        avatar: null,
        joinedDate: "May 2025"
      },
      likes: 0,
      createdAt: new Date(),
    };

    setReplies([...replies, newReplyObj]);
    setNewReply("");
  };

  return (
    <div className="container py-8">
      {/* Back button */}
      <Link to="/forum" className="flex items-center text-gray-600 hover:text-classify-purple mb-4">
        <ArrowLeft className="h-4 w-4 mr-1" />
        <span>Back to Forum</span>
      </Link>

      {/* Topic */}
      <Card className="mb-6">
        <CardHeader className="pb-2">
          <h1 className="text-2xl font-bold">{topic.title}</h1>
          <div className="flex items-center text-sm text-gray-500">
            <Avatar className="h-6 w-6 mr-2">
              <AvatarFallback>{topic.user.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <span className="font-medium">{topic.user.name}</span>
            <span className="mx-2">•</span>
            <Clock className="h-3 w-3 mr-1" />
            <span>
              {formatDistanceToNow(topic.createdAt, { addSuffix: true })}
            </span>
          </div>
        </CardHeader>
        <CardContent>
          <p className="whitespace-pre-line">{topic.content}</p>
        </CardContent>
        <CardFooter className="flex justify-between">
          <div className="flex items-center space-x-4">
            <Button variant="outline" size="sm">
              <Heart className="h-4 w-4 mr-1" /> {topic.likes}
            </Button>
            <Button variant="outline" size="sm">
              <Share className="h-4 w-4 mr-1" /> Share
            </Button>
            <Button variant="outline" size="sm">
              <Flag className="h-4 w-4 mr-1" /> Report
            </Button>
          </div>
          <div className="text-sm text-gray-500">
            <span>{topic.views} views</span>
          </div>
        </CardFooter>
      </Card>

      {/* Replies section */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">
          {replies.length} {replies.length === 1 ? "Reply" : "Replies"}
        </h2>
        <div className="space-y-4">
          {replies.map((reply) => (
            <Card key={reply.id}>
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  <Avatar className="h-10 w-10">
                    <AvatarFallback>{reply.user.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex justify-between mb-1">
                      <div>
                        <span className="font-medium">{reply.user.name}</span>
                        <span className="text-sm text-gray-500 ml-2">Member since {reply.user.joinedDate}</span>
                      </div>
                      <span className="text-sm text-gray-500">
                        {formatDistanceToNow(reply.createdAt, { addSuffix: true })}
                      </span>
                    </div>
                    <p className="text-gray-800 whitespace-pre-line">{reply.content}</p>
                    <div className="flex items-center mt-4">
                      <Button variant="ghost" size="sm">
                        <Heart className="h-4 w-4 mr-1" /> {reply.likes}
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Flag className="h-4 w-4 mr-1" /> Report
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Reply form */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <h3 className="text-lg font-semibold mb-4">Add your reply</h3>
        <form onSubmit={handleSubmitReply}>
          <Textarea
            placeholder="Write your thoughts..."
            className="min-h-32 mb-4"
            value={newReply}
            onChange={(e) => setNewReply(e.target.value)}
          />
          <div className="flex justify-end">
            <Button type="submit" className="gradient-purple">
              <MessageSquare className="mr-2 h-4 w-4" /> Post Reply
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ForumTopic;
