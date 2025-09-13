"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Copy, Download } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { formatForMedium, createMediumVersion } from "@/lib/medium-formatter";

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
      const mediumFormattedContent = createMediumVersion(blogData.content);
      await navigator.clipboard.writeText(mediumFormattedContent);
      toast({
        title: "Copied!",
        description: "Blog content copied to clipboard in Medium format.",
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

    const mediumFormattedContent = createMediumVersion(blogData.content);
    const element = document.createElement("a");
    const file = new Blob([mediumFormattedContent], { type: "text/markdown" });
    element.href = URL.createObjectURL(file);
    element.download = `${blogData.topic
      .replace(/[^a-z0-9]/gi, "-")
      .toLowerCase()}-medium-format.md`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);

    toast({
      title: "Downloaded!",
      description: "Blog content downloaded in Medium format.",
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

  // Clean content for display (remove hashtags and fix formatting)
  const cleanContentForDisplay = (content: string) => {
    return formatForMedium(content);
  };

  return (
    <div className="space-y-6">
      {/* Header with actions */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <Button
          className="hover:cursor-pointer"
          variant="outline"
          onClick={() => router.push("/")}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Generate Another Blog
        </Button>

        <div className="flex gap-2">
          <Button
            className="hover:cursor-pointer"
            variant="outline"
            onClick={copyToClipboard}
          >
            <Copy className="w-4 h-4 mr-2" />
            Copy Blog
          </Button>
          <Button
            className="hover:cursor-pointer"
            variant="outline"
            onClick={downloadContent}
          >
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
          <div className="prose prose-lg max-w-none prose-headings:text-gray-900 prose-headings:font-bold prose-h1:text-3xl prose-h1:mb-4 prose-h2:text-2xl prose-h2:font-semibold prose-h2:mb-3 prose-h2:mt-6 prose-h2:text-gray-800 prose-h3:text-xl prose-h3:font-medium prose-h3:mb-2 prose-h3:mt-4 prose-h3:text-gray-700 prose-p:text-gray-700 prose-p:mb-4 prose-p:leading-relaxed prose-strong:font-semibold prose-strong:text-gray-900 prose-em:italic prose-ul:list-disc prose-ul:list-inside prose-ul:mb-4 prose-ul:space-y-1 prose-ol:list-decimal prose-ol:list-inside prose-ol:mb-4 prose-ol:space-y-1 prose-li:mb-1 prose-code:bg-gray-100 prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-code:text-sm prose-blockquote:border-l-4 prose-blockquote:border-gray-300 prose-blockquote:pl-4 prose-blockquote:italic">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                h1: ({ children }) => (
                  <h1 className="text-3xl font-bold mb-4 text-gray-900">
                    {children}
                  </h1>
                ),
                h2: ({ children }) => (
                  <h2 className="text-2xl font-semibold mb-3 mt-6 text-gray-800">
                    {children}
                  </h2>
                ),
                h3: ({ children }) => (
                  <h3 className="text-xl font-medium mb-2 mt-4 text-gray-700">
                    {children}
                  </h3>
                ),
                p: ({ children }) => (
                  <p className="mb-4 leading-relaxed text-gray-700">
                    {children}
                  </p>
                ),
                strong: ({ children }) => (
                  <strong className="font-semibold text-gray-900">
                    {children}
                  </strong>
                ),
                em: ({ children }) => <em className="italic">{children}</em>,
                ul: ({ children }) => (
                  <ul className="list-disc list-inside mb-4 space-y-1">
                    {children}
                  </ul>
                ),
                ol: ({ children }) => (
                  <ol className="list-decimal list-inside mb-4 space-y-1">
                    {children}
                  </ol>
                ),
                li: ({ children }) => <li className="mb-1">{children}</li>,
                code: ({ children }) => (
                  <code className="bg-gray-100 px-1 py-0.5 rounded text-sm">
                    {children}
                  </code>
                ),
                pre: ({ children }) => (
                  <pre className="bg-gray-100 p-4 rounded-lg overflow-x-auto mb-4">
                    {children}
                  </pre>
                ),
                blockquote: ({ children }) => (
                  <blockquote className="border-l-4 border-gray-300 pl-4 italic my-4">
                    {children}
                  </blockquote>
                ),
              }}
            >
              {cleanContentForDisplay(blogData.content)}
            </ReactMarkdown>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
