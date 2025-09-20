"use client";

import type React from "react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Alert, AlertDescription } from "@/components/ui/alert";
import Loading from "@/components/loading";

interface FormData {
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
}

export default function BlogForm() {
  const [formData, setFormData] = useState<FormData>({
    topic: "",
    audience: "",
    mainProblem: "",
    tone: "professional",
    evidence: [],
    practical: [],
    analytical: [],
    speculative: [],
    contextual: [],
    engagement: [],
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleCheckboxChange = (
    category: keyof FormData,
    value: string,
    checked: boolean
  ) => {
    setFormData((prev) => {
      const currentArray = prev[category] as string[];
      if (checked) {
        return { ...prev, [category]: [...currentArray, value] };
      } else {
        return {
          ...prev,
          [category]: currentArray.filter((item) => item !== value),
        };
      }
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Validate required fields
    if (!formData.topic || !formData.mainProblem) {
      setError("Please fill in all required fields.");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Failed to generate blog content");
      }

      const data = await response.json();

      // Store the generated blog in localStorage
      localStorage.setItem(
        "generatedBlog",
        JSON.stringify({
          ...formData,
          content: data.content,
          generatedAt: new Date().toISOString(),
        })
      );

      // Redirect to blog display page
      router.push("/blog");
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "An error occurred while generating content"
      );
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <Loading />;
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Core Topic & Approach */}
      <div className="bg-slate-50 p-6 rounded-2xl border-l-4 border-[#3498db]">
        <h3 className="text-[#2c3e50] text-xl font-semibold mb-4">
          📝 Core Topic & Approach{" "}
        </h3>

        <div className="space-y-5">
          <div>
            <Label
              htmlFor="topic"
              className="block mb-2 text-gray-600 font-semibold"
            >
              Blog Topic/Title <span className="text-red-500 font-bold">*</span>
            </Label>
            <Input
              id="topic"
              placeholder="e.g., 'Microservices vs Monoliths: When to Choose What'"
              value={formData.topic}
              onChange={(e) => handleInputChange("topic", e.target.value)}
              required
              className="selection:bg-[#7955FF] selection:text-white w-full p-3 border-2 border-gray-200 rounded-lg text-base transition-all focus:border-[#3498db] focus:shadow-[0_0_0_3px_rgba(52,152,219,0.1)]"
            />
          </div>

          <div>
            <Label
              htmlFor="audience"
              className="block mb-2 text-gray-600 font-semibold"
            >
              Target Audience
            </Label>
            <Select
              value={formData.audience}
              onValueChange={(value) => handleInputChange("audience", value)}
            >
              <SelectTrigger className="w-full p-3 border-2 border-gray-200 rounded-lg text-base">
                <SelectValue placeholder="Select audience..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="junior-developers">
                  Junior Developers
                </SelectItem>
                <SelectItem value="senior-engineers">
                  Senior Engineers
                </SelectItem>
                <SelectItem value="engineering-managers">
                  Engineering Managers
                </SelectItem>
                <SelectItem value="technical-leads">Technical Leads</SelectItem>
                <SelectItem value="architects">Solution Architects</SelectItem>
                <SelectItem value="mixed-technical">
                  Mixed Technical Audience
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label
              htmlFor="mainProblem"
              className="block mb-2 text-gray-600 font-semibold "
            >
              Primary Problem/Challenge to Address{" "}
              <span className="text-red-500 font-bold">*</span>
            </Label>
            <Textarea
              id="mainProblem"
              placeholder="What specific problem or challenge will this blog help readers solve?"
              value={formData.mainProblem}
              onChange={(e) => handleInputChange("mainProblem", e.target.value)}
              required
              className="selection:bg-[#7955FF] selection:text-white  w-full p-3 border-2 border-gray-200 rounded-lg text-base min-h-[100px] resize-y transition-all focus:border-[#3498db] focus:shadow-[0_0_0_3px_rgba(52,152,219,0.1)]"
            />
          </div>
        </div>
      </div>

      {/* Evidence & Research */}
      <div className="bg-slate-50 p-6 rounded-2xl border-l-4 border-[#3498db]">
        <h3 className="text-[#2c3e50] text-xl font-semibold mb-4">
          🔍 Evidence & Research (Select what to include)
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { id: "stats", label: "Current Statistics & Benchmarks" },
            { id: "research", label: "Recent Research & Studies" },
            { id: "examples", label: "Real-world Examples" },
            { id: "expert-quotes", label: "Expert Opinions & Quotes" },
            { id: "case-studies", label: "Industry Case Studies" },
          ].map((item) => (
            <div
              key={item.id}
              className="flex items-center p-3 bg-white rounded-lg border-2 border-gray-200 hover:border-[#3498db] hover:-translate-y-0.5 transition-all"
            >
              <Checkbox
                id={item.id}
                checked={formData.evidence.includes(item.id)}
                onCheckedChange={(checked) =>
                  handleCheckboxChange("evidence", item.id, checked as boolean)
                }
                className="mr-3"
              />
              <Label htmlFor={item.id} className="cursor-pointer font-medium">
                {item.label}
              </Label>
            </div>
          ))}
        </div>
      </div>

      {/* Practical Elements */}
      <div className="bg-slate-50 p-6 rounded-2xl border-l-4 border-[#3498db]">
        <h3 className="text-[#2c3e50] text-xl font-semibold mb-4">
          ⚙️ Practical Elements
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { id: "step-by-step", label: "Step-by-step Instructions" },
            { id: "frameworks", label: "Frameworks & Mental Models" },
            { id: "code-examples", label: "Code Examples & Snippets" },
            { id: "checklists", label: "Actionable Checklists" },
            { id: "tools", label: "Tools & Resources" },
          ].map((item) => (
            <div
              key={item.id}
              className="flex items-center p-3 bg-white rounded-lg border-2 border-gray-200 hover:border-[#3498db] hover:-translate-y-0.5 transition-all"
            >
              <Checkbox
                id={item.id}
                checked={formData.practical.includes(item.id)}
                onCheckedChange={(checked) =>
                  handleCheckboxChange("practical", item.id, checked as boolean)
                }
                className="mr-3"
              />
              <Label htmlFor={item.id} className="cursor-pointer font-medium">
                {item.label}
              </Label>
            </div>
          ))}
        </div>
      </div>

      {/* Analytical Depth */}
      <div className="bg-slate-50 p-6 rounded-2xl border-l-4 border-[#3498db]">
        <h3 className="text-[#2c3e50] text-xl font-semibold mb-4">
          🧠 Analytical Depth
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { id: "comparisons", label: "Technology/Approach Comparisons" },
            { id: "trade-offs", label: "Trade-off Analysis" },
            { id: "root-causes", label: "Root Cause Analysis" },
            { id: "limitations", label: "Limitations & Constraints" },
            {
              id: "counterarguments",
              label: "Counterarguments & Alternative Views",
            },
          ].map((item) => (
            <div
              key={item.id}
              className="flex items-center p-3 bg-white rounded-lg border-2 border-gray-200 hover:border-[#3498db] hover:-translate-y-0.5 transition-all"
            >
              <Checkbox
                id={item.id}
                checked={formData.analytical.includes(item.id)}
                onCheckedChange={(checked) =>
                  handleCheckboxChange(
                    "analytical",
                    item.id,
                    checked as boolean
                  )
                }
                className="mr-3"
              />
              <Label htmlFor={item.id} className="cursor-pointer font-medium">
                {item.label}
              </Label>
            </div>
          ))}
        </div>
      </div>

      {/* Speculative & Future-Focused */}
      <div className="bg-slate-50 p-6 rounded-2xl border-l-4 border-[#3498db]">
        <h3 className="text-[#2c3e50] text-xl font-semibold mb-4">
          🔮 Speculative & Future-Focused
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { id: "trends", label: "Future Trends & Predictions" },
            { id: "scenarios", label: "Best/Worst Case Scenarios" },
            { id: "thought-experiments", label: "Thought Experiments" },
          ].map((item) => (
            <div
              key={item.id}
              className="flex items-center p-3 bg-white rounded-lg border-2 border-gray-200 hover:border-[#3498db] hover:-translate-y-0.5 transition-all"
            >
              <Checkbox
                id={item.id}
                checked={formData.speculative.includes(item.id)}
                onCheckedChange={(checked) =>
                  handleCheckboxChange(
                    "speculative",
                    item.id,
                    checked as boolean
                  )
                }
                className="mr-3"
              />
              <Label htmlFor={item.id} className="cursor-pointer font-medium">
                {item.label}
              </Label>
            </div>
          ))}
        </div>
      </div>

      {/* Contextual Understanding */}
      <div className="bg-slate-50 p-6 rounded-2xl border-l-4 border-[#3498db]">
        <h3 className="text-[#2c3e50] text-xl font-semibold mb-4">
          🌍 Contextual Understanding
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { id: "history", label: "Historical Context & Evolution" },
            { id: "industry", label: "Industry Context & Trends" },
            { id: "culture", label: "Cultural & Organizational Perspectives" },
            { id: "ethics", label: "Ethical Considerations" },
          ].map((item) => (
            <div
              key={item.id}
              className="flex items-center p-3 bg-white rounded-lg border-2 border-gray-200 hover:border-[#3498db] hover:-translate-y-0.5 transition-all"
            >
              <Checkbox
                id={item.id}
                checked={formData.contextual.includes(item.id)}
                onCheckedChange={(checked) =>
                  handleCheckboxChange(
                    "contextual",
                    item.id,
                    checked as boolean
                  )
                }
                className="mr-3"
              />
              <Label htmlFor={item.id} className="cursor-pointer font-medium">
                {item.label}
              </Label>
            </div>
          ))}
        </div>
      </div>

      {/* Engagement & Style */}
      <div className="bg-slate-50 p-6 rounded-2xl border-l-4 border-[#3498db]">
        <h3 className="text-[#2c3e50] text-xl font-semibold mb-4">
          ✨ Engagement & Style
        </h3>

        <div className="space-y-5">
          <div>
            <Label
              htmlFor="tone"
              className="block mb-2 text-gray-600 font-semibold"
            >
              Writing Tone
            </Label>
            <Select
              value={formData.tone}
              onValueChange={(value) => handleInputChange("tone", value)}
            >
              <SelectTrigger className="w-full p-3 border-2 border-gray-200 rounded-lg text-base">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="professional">
                  Professional & Authoritative
                </SelectItem>
                <SelectItem value="conversational">
                  Conversational & Approachable
                </SelectItem>
                <SelectItem value="provocative">
                  Provocative & Thought-provoking
                </SelectItem>
                <SelectItem value="educational">
                  Educational & Explanatory
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { id: "metaphors", label: "Metaphors & Analogies" },
              { id: "questions", label: "Thought-provoking Questions" },
              { id: "stories", label: "Personal Stories & Anecdotes" },
              { id: "benefits", label: "Benefits-forward Language" },
            ].map((item) => (
              <div
                key={item.id}
                className="flex items-center p-3 bg-white rounded-lg border-2 border-gray-200 hover:border-[#3498db] hover:-translate-y-0.5 transition-all"
              >
                <Checkbox
                  id={item.id}
                  checked={formData.engagement.includes(item.id)}
                  onCheckedChange={(checked) =>
                    handleCheckboxChange(
                      "engagement",
                      item.id,
                      checked as boolean
                    )
                  }
                  className="mr-3"
                />
                <Label htmlFor={item.id} className="cursor-pointer font-medium">
                  {item.label}
                </Label>
              </div>
            ))}
          </div>
        </div>
      </div>

      <button
        type="submit"
        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-5 px-10 rounded-full text-lg font-semibold transition-all hover:-translate-y-1 hover:shadow-lg mt-8 border-0 cursor-pointer"
      >
        🎯 Generate Exceptional Blog Content
      </button>
    </form>
  );
}
