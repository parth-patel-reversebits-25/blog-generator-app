"use client";
import BlogDisplay from "@/components/blog-display";

export default function BlogPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <BlogDisplay />
      </div>
    </div>
  );
}
