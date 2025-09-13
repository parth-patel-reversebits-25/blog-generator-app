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
    const file = new Blob([blogData.content], { type: "text/html" });
    element.href = URL.createObjectURL(file);
    element.download = `${blogData.topic
      .replace(/[^a-z0-9]/gi, "-")
      .toLowerCase()}.html`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);

    toast({
      title: "Downloaded!",
      description: "Blog content downloaded as HTML file.",
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

  // Process content - handle both HTML and markdown fallback
  const processContent = (content: string) => {
    // If content looks like HTML (contains HTML tags), enhance it
    if (
      content.includes("<h1>") ||
      content.includes("<h2>") ||
      content.includes("<p>")
    ) {
      return enhanceHTML(content);
    }

    // Fallback: if content is markdown, convert it to HTML
    return convertMarkdownToHTML(content);
  };

  // Enhanced HTML processing with better styling
  const enhanceHTML = (content: string) => {
    return content
      .replace(
        /<h1([^>]*)>/g,
        '<h1$1 class="text-4xl font-bold mb-6 mt-8 text-gray-900 border-b border-gray-200 pb-2">'
      )
      .replace(
        /<h2([^>]*)>/g,
        '<h2$1 class="text-3xl font-semibold mb-4 mt-8 text-gray-800">'
      )
      .replace(
        /<h3([^>]*)>/g,
        '<h3$1 class="text-2xl font-medium mb-3 mt-6 text-gray-700">'
      )
      .replace(
        /<h4([^>]*)>/g,
        '<h4$1 class="text-xl font-medium mb-2 mt-4 text-gray-700">'
      )
      .replace(
        /<h5([^>]*)>/g,
        '<h5$1 class="text-lg font-medium mb-2 mt-3 text-gray-700">'
      )
      .replace(
        /<p([^>]*)>/g,
        '<p$1 class="mb-4 leading-relaxed text-gray-700 text-base">'
      )
      .replace(/<ul([^>]*)>/g, '<ul$1 class="list-disc ml-6 mb-4 space-y-2">')
      .replace(
        /<ol([^>]*)>/g,
        '<ol$1 class="list-decimal ml-6 mb-4 space-y-2">'
      )
      .replace(/<li([^>]*)>/g, '<li$1 class="mb-1 text-gray-700">')
      .replace(/<strong([^>]*)>/g, '<strong$1 class="font-bold text-gray-900">')
      .replace(/<em([^>]*)>/g, '<em$1 class="italic text-gray-700">')
      .replace(
        /<blockquote([^>]*)>/g,
        '<blockquote$1 class="border-l-4 border-blue-500 pl-6 py-2 my-4 bg-blue-50 italic text-gray-600">'
      )
      .replace(
        /<code([^>]*)>/g,
        '<code$1 class="bg-gray-100 text-gray-800 px-2 py-1 rounded text-sm font-mono">'
      )
      .replace(
        /<pre([^>]*)>/g,
        '<pre$1 class="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto mb-4 text-sm">'
      )
      .replace(
        /<a([^>]*)>/g,
        '<a$1 class="text-blue-600 hover:text-blue-800 underline">'
      )
      .replace(
        /<table([^>]*)>/g,
        '<table$1 class="w-full border-collapse border border-gray-300 mb-4">'
      )
      .replace(
        /<th([^>]*)>/g,
        '<th$1 class="border border-gray-300 px-4 py-2 bg-gray-50 font-semibold text-left">'
      )
      .replace(
        /<td([^>]*)>/g,
        '<td$1 class="border border-gray-300 px-4 py-2">'
      );
  };

  // Fallback markdown to HTML converter (improved)
  const convertMarkdownToHTML = (content: string) => {
    return content
      .replace(
        /^# (.*$)/gm,
        '<h1 class="text-4xl font-bold mb-6 mt-8 text-gray-900 border-b border-gray-200 pb-2">$1</h1>'
      )
      .replace(
        /^## (.*$)/gm,
        '<h2 class="text-3xl font-semibold mb-4 mt-8 text-gray-800">$1</h2>'
      )
      .replace(
        /^### (.*$)/gm,
        '<h3 class="text-2xl font-medium mb-3 mt-6 text-gray-700">$1</h3>'
      )
      .replace(
        /^#### (.*$)/gm,
        '<h4 class="text-xl font-medium mb-2 mt-4 text-gray-700">$1</h4>'
      )
      .replace(
        /^##### (.*$)/gm,
        '<h5 class="text-lg font-medium mb-2 mt-3 text-gray-700">$1</h5>'
      )
      .replace(
        /\\(.?)\\*/g,
        '<strong class="font-bold text-gray-900">$1</strong>'
      )
      .replace(/\(.?)\*/g, '<em class="italic text-gray-700">$1</em>')
      .replace(
        /([^]+)`/g,
        '<code class="bg-gray-100 text-gray-800 px-2 py-1 rounded text-sm font-mono">$1</code>'
      )
      .replace(
        /([^`]+)/g,
        '<pre class="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto mb-4 text-sm"><code>$1</code></pre>'
      )
      .replace(
        /^> (.*$)/gm,
        '<blockquote class="border-l-4 border-blue-500 pl-6 py-2 my-4 bg-blue-50 italic text-gray-600">$1</blockquote>'
      )
      .replace(/^\* (.*$)/gm, '<li class="mb-1 text-gray-700">$1</li>')
      .replace(/^- (.*$)/gm, '<li class="mb-1 text-gray-700">$1</li>')
      .replace(/^\d+\. (.*$)/gm, '<li class="mb-1 text-gray-700">$1</li>')
      .replace(/(<li.*<\/li>)+/g, (match: string) => {
        if (match.includes("1.") || /^\d+\./.test(match)) {
          return `<ol class="list-decimal ml-6 mb-4 space-y-2">${match}</ol>`;
        }
        return `<ul class="list-disc ml-6 mb-4 space-y-2">${match}</ul>`;
      })
      .replace(
        /^([^<\n#*-].+)$/gm,
        '<p class="mb-4 leading-relaxed text-gray-700 text-base">$1</p>'
      )
      .replace(
        /\[([^\]]+)\]\(([^)]+)\)/g,
        '<a href="$2" class="text-blue-600 hover:text-blue-800 underline">$1</a>'
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
            className="max-w-none"
            dangerouslySetInnerHTML={{
              __html: processContent(blogData.content),
            }}
          />
        </CardContent>
      </Card>
    </div>
  );
}
