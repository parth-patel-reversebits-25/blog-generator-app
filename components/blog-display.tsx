"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Copy, Download } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

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
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    const storedBlog = localStorage.getItem("generatedBlog");
    if (storedBlog) {
      setBlogData(JSON.parse(storedBlog));
    } else {
      // Redirect to home if no blog data
      router.push("/");
    }
  }, [router]);

  const copyToClipboard = async () => {
    if (!blogData?.content) return;

    try {
      await navigator.clipboard.writeText(blogData.content);
      toast({
        title: "Copied!",
        description: "Blog content copied to clipboard.",
      });
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to copy content to clipboard.",
        variant: "destructive",
      });
    }
  };

  const downloadContent = () => {
    if (!blogData?.content) return;

    const element = document.createElement("a");
    const file = new Blob([blogData.content], { type: "text/plain" });
    element.href = URL.createObjectURL(file);
    element.download = `${blogData.topic
      .replace(/[^a-z0-9]/gi, "-")
      .toLowerCase()}.md`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);

    toast({
      title: "Downloaded!",
      description: "Blog content downloaded as markdown file.",
    });
  };

  if (!blogData) {
    return (
      <Card className="w-full">
        <CardContent className="flex flex-col items-center justify-center py-12">
          <p className="text-gray-600 mb-4">No blog content found.</p>
          <Button onClick={() => router.push("/")}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Generator
          </Button>
        </CardContent>
      </Card>
    );
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

  // Convert markdown to HTML for display
  const formatContent = (content: string) => {
    return content
      .replace(
        /^# (.*$)/gm,
        '<h1 class="text-3xl font-bold mb-4 text-gray-900">$1</h1>'
      )
      .replace(
        /^## (.*$)/gm,
        '<h2 class="text-2xl font-semibold mb-3 mt-6 text-gray-800">$1</h2>'
      )
      .replace(
        /^### (.*$)/gm,
        '<h3 class="text-xl font-medium mb-2 mt-4 text-gray-700">$1</h3>'
      )
      .replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold">$1</strong>')
      .replace(/\*(.*?)\*/g, '<em class="italic">$1</em>')
      .replace(/^- (.*$)/gm, '<li class="mb-1">$1</li>')
      .replace(
        /(<li.*<\/li>)/,
        '<ul class="list-disc list-inside mb-4 space-y-1">$1</ul>'
      )
      .replace(/^\d+\. (.*$)/gm, '<li class="mb-1">$1</li>')
      .replace(
        /^([^<\n].*)$/gm,
        '<p class="mb-4 leading-relaxed text-gray-700">$1</p>'
      );
  };

  return (
    <div className="space-y-6">
      {/* Header with actions */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <Button variant="outline" onClick={() => router.push("/")}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Generate Another Blog
        </Button>

        <div className="flex gap-2">
          <Button variant="outline" onClick={copyToClipboard}>
            <Copy className="w-4 h-4 mr-2" />
            Copy Blog
          </Button>
          <Button variant="outline" onClick={downloadContent}>
            <Download className="w-4 h-4 mr-2" />
            Download
          </Button>
        </div>
      </div>

      {/* Blog content */}
      <Card className="w-full">
        <CardHeader className="border-b">
          <div className="space-y-4">
            <h1 className="text-3xl font-bold text-gray-900 leading-tight">
              {blogData.topic}
            </h1>

            <div className="flex flex-wrap gap-2">
              <Badge variant="secondary">
                {blogData.tone?.charAt(0).toUpperCase() +
                  blogData.tone?.slice(1) || "Professional"}
              </Badge>
              <Badge variant="outline">
                {blogData.audience
                  ?.replace("-", " ")
                  .split(" ")
                  .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                  .join(" ") || "Technical Audience"}
              </Badge>
            </div>

            <p className="text-sm text-gray-500">
              Generated on {formatDate(blogData.generatedAt)}
            </p>
          </div>
        </CardHeader>

        <CardContent className="pt-8">
          <div
            className="prose prose-lg max-w-none"
            dangerouslySetInnerHTML={{
              __html: formatContent(blogData.content),
            }}
          />
        </CardContent>
      </Card>
    </div>
  );
}
