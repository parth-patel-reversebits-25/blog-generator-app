"use client";

import { enhanceHTML } from "@/app/utils/enhanceHTML";
import Loading from "@/components/loading";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { ArrowLeft, CircleCheckBig, Copy, Download } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import NoBlogFound from "./NoBlogFound";
import TextEnhancementPopup from "./text-enhancement-popup";

interface BlogData {
  topic: string;
  audience: string;
  mainProblem: string;
  tone: string;
  evidence: string[];
  practical: string[];
  analytical: string[];
  speculative: string[];
  contextual: string[];
  engagement: string[];
  content: string;
  generatedAt: string;
}

export default function BlogDisplay() {
  const [blogData, setBlogData] = useState<BlogData | null>(null);
  const [loader, setLoader] = useState(true);

  const [copy, setCopy] = useState(false);
  const [selectedText, setSelectedText] = useState("");
  const [showEnhancementPopup, setShowEnhancementPopup] = useState(false);
  const [popupPosition, setPopupPosition] = useState({ x: 0, y: 0 });
  const contentRef = useRef<HTMLDivElement>(null);
  const [download, setDownload] = useState(false);

  const router = useRouter();

  useEffect(() => {
    const storedBlog = localStorage.getItem("generatedBlog");
    if (storedBlog) {
      setBlogData(JSON.parse(storedBlog));
      setLoader(false);
    } else {
      setLoader(false);
    }
  }, []);

  const copyToClipboard = async () => {
    if (!blogData?.content) return;

    try {
      await navigator.clipboard.writeText(blogData.content);
      setCopy(true);
      toast.success("Blog content copied to clipboard.");
      setTimeout(() => {
        setCopy(false);
      }, 5000);
    } catch (err) {
      setCopy(false);
      toast.error("Failed to copy content to clipboard.");
    }
  };

  const downloadContent = () => {
    if (!blogData?.content) return;

    try {
      const element = document.createElement("a");
      const file = new Blob([blogData.content], { type: "text/html" });
      element.href = URL.createObjectURL(file);
      element.download = `${blogData.topic
        .replace(/[^a-z0-9]/gi, "-")
        .toLowerCase()}.html`;
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
      setDownload(true);
      toast.success("Blog content downloaded as HTML file.");
      setTimeout(() => {
        setDownload(false);
      }, 5000);
    } catch {
      setDownload(false);
      toast.error("Failed to download blog content as HTML file.");
    }
  };

  const handleTextSelection = () => {
    // Close existing popup first
    if (showEnhancementPopup) {
      handleClosePopup();
      return;
    }

    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return;

    const selectedText = selection.toString().trim();
    if (selectedText.length < 10) {
      if (selectedText.length > 0) {
        toast.error("Please select at least 10 characters to enhance");
      }
      return;
    }

    // Check if selection is within the content area
    const range = selection.getRangeAt(0);
    if (!contentRef.current?.contains(range.commonAncestorContainer)) {
      return;
    }

    const rect = range.getBoundingClientRect();

    setSelectedText(selectedText);
    setPopupPosition({
      x: Math.max(10, rect.left + window.scrollX),
      y: rect.bottom + window.scrollY + 5,
    });
    setShowEnhancementPopup(true);
  };

  const handleEnhancement = (enhancedContent: string) => {
    if (!blogData || !enhancedContent) return;

    const updatedBlogData = {
      ...blogData,
      content: enhancedContent,
      generatedAt: new Date().toISOString(),
    };

    setBlogData(updatedBlogData);
    localStorage.setItem("generatedBlog", JSON.stringify(updatedBlogData));

    setSelectedText("");
    setShowEnhancementPopup(false);
  };

  const handleClosePopup = () => {
    setShowEnhancementPopup(false);
    setSelectedText("");
    window.getSelection()?.removeAllRanges();
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      const popupElement = document.querySelector(".text-enhancement-popup");

      if (
        popupElement &&
        !popupElement.contains(target) &&
        contentRef.current &&
        !contentRef.current.contains(target)
      ) {
        handleClosePopup();
      }
    };

    if (showEnhancementPopup) {
      document.addEventListener("mousedown", handleClickOutside);
      return () =>
        document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [showEnhancementPopup]);

  if (loader) {
    return <Loading simpleLoader={false} />;
  }

  if (!blogData) {
    return <NoBlogFound />;
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Process content - handle both HTML and markdown fallback
  const processContent = (content: string) => {
    // If content looks like HTML (contains HTML tags), enhance it
    if (
      content?.includes("<h1>") ||
      content?.includes("<h2>") ||
      content?.includes("<p>")
    ) {
      // Enhanced HTML processing with better styling
      return enhanceHTML(content);
    }

    // Fallback: if content is markdown, convert it to HTML
    // Fallback markdown to HTML converter (improved)
    return convertMarkdownToHTML(content);
  };

  return (
    <div className="space-y-6">
      {/* Header with actions */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <Button
          variant="outline"
          className="hover:cursor-pointer"
          onClick={() => router.push("/")}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Generate Another Blog
        </Button>

        <div className="flex gap-2">
          <Button
            variant="outline"
            className="hover:cursor-pointer"
            onClick={copyToClipboard}
          >
            {copy ? (
              <CircleCheckBig className="w-4 h-4 mr-2" />
            ) : (
              <Copy className="w-4 h-4 mr-2" />
            )}
            {copy ? "Blog Copied" : "Copy Blog"}
          </Button>
          <Button
            variant="outline"
            className="hover:cursor-pointer"
            onClick={downloadContent}
          >
            {download ? (
              <CircleCheckBig className="w-4 h-4 mr-2" />
            ) : (
              <Download className="w-4 h-4 mr-2" />
            )}
            {download ? "Downloaded" : "Download"}
          </Button>
        </div>
      </div>

      {/* Blog content */}
      <Card className="w-full">
        <CardHeader className="border-b">
          <div className="space-y-4">
            <h1 className="text-3xl font-bold text-gray-900 leading-tight">
              {blogData?.topic}
            </h1>

            <div className="flex flex-wrap gap-2">
              <Badge variant="secondary">
                {blogData?.tone?.charAt(0).toUpperCase() +
                  blogData?.tone?.slice(1) || "Professional"}
              </Badge>
              <Badge variant="outline">
                {blogData?.audience
                  ?.replace("-", " ")
                  .split(" ")
                  .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                  .join(" ") || "Technical Audience"}
              </Badge>
            </div>

            <p className="text-sm text-gray-500">
              Generated on {formatDate(blogData?.generatedAt)}
            </p>
          </div>
        </CardHeader>

        <CardContent className="pt-8">
          <div
            ref={contentRef}
            className="max-w-none select-text cursor-text"
            onMouseUp={handleTextSelection}
            dangerouslySetInnerHTML={{
              __html: processContent(blogData?.content),
            }}
          />
        </CardContent>
      </Card>

      {showEnhancementPopup && selectedText && blogData && (
        <TextEnhancementPopup
          selectedText={selectedText}
          onEnhance={handleEnhancement}
          blogData={{
            topic: blogData.topic,
            audience: blogData.audience,
            content: blogData.content,
          }}
          position={popupPosition}
          onClose={handleClosePopup}
        />
      )}
    </div>
  );
}
