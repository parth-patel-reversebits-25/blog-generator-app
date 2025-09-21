"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Loader2, Wand2 } from "lucide-react";
import toast from "react-hot-toast";

interface TextEnhancementPopupProps {
  selectedText: string;
  onEnhance: (enhancedText: string) => void;
  blogData: {
    topic: string;
    audience: string;
    content: string;
  };
  position: { x: number; y: number };
  onClose: () => void;
}

export default function TextEnhancementPopup({
  selectedText,
  onEnhance,
  blogData,
  position,
  onClose,
}: TextEnhancementPopupProps) {
  const [userRequest, setUserRequest] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(true);

  const handleEnhance = async () => {
    if (!userRequest.trim()) {
      toast.error("Please describe what enhancement you need");
      return;
    }

    if (selectedText.length < 10) {
      toast.error("Selected text is too short to enhance");
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch("/api/enhance", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          selectedText,
          userRequest: userRequest.trim(),
          fullContent: blogData.content,
          topic: blogData.topic,
          audience: blogData.audience,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || "Failed to enhance text");
      }

      const { enhancedContent } = await response.json();
      
      if (!enhancedContent) {
        toast.error("No enhancement was generated. Please try a different request.");
        return;
      }
      
      onEnhance(enhancedContent);
      toast.success("Content updated successfully!");
      handleClose();
    } catch (error) {
      console.error("Enhancement error:", error);
      const errorMessage = error instanceof Error ? error.message : "Failed to enhance text. Please try again.";
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setIsOpen(false);
    onClose();
  };

  return (
    <div
      className="fixed z-50 bg-white border rounded-lg shadow-lg p-4 w-80 text-enhancement-popup"
      style={{
        left: Math.min(position.x, window.innerWidth - 320),
        top: Math.min(position.y, window.innerHeight - 200),
      }}
      onClick={(e) => e.stopPropagation()}
      onMouseDown={(e) => e.stopPropagation()}
    >
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium text-gray-900">Enhance Text</h3>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClose}
            className="h-6 w-6 p-0"
          >
            ×
          </Button>
        </div>
        
        <div className="text-xs text-gray-500 bg-gray-50 p-2 rounded max-h-16 overflow-y-auto">
          Selected: "{selectedText.substring(0, 100)}..."
        </div>
        
        <Textarea
          placeholder="Describe what enhancement you need (e.g., 'make it more detailed', 'add code examples', 'simplify the language')"
          value={userRequest}
          onChange={(e) => setUserRequest(e.target.value)}
          className="min-h-[80px] text-sm"
          disabled={isLoading}
        />
        
        <div className="flex gap-2">
          <Button
            onClick={handleEnhance}
            disabled={isLoading || !userRequest.trim()}
            size="sm"
            className="flex-1"
          >
            {isLoading ? (
              <Loader2 className="w-3 h-3 mr-1 animate-spin" />
            ) : (
              <Wand2 className="w-3 h-3 mr-1" />
            )}
            {isLoading ? "Enhancing..." : "Enhance"}
          </Button>
          <Button
            variant="outline"
            onClick={handleClose}
            size="sm"
            disabled={isLoading}
          >
            Cancel
          </Button>
        </div>
      </div>
    </div>
  );
}