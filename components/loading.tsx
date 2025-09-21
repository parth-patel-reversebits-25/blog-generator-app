"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { CheckCircle, Circle } from "lucide-react";
import { useEffect, useRef, useState } from "react";

interface LoadingProps {
  simpleLoader?: boolean;
  currentStep?: string;
  progress?: number;
}

const AGENT_STEPS = [
  {
    id: 1,
    emoji: "🔍",
    title: "Analyzing Requirements",
    description: "Setting up specialized AI agents for your content",
  },
  {
    id: 2,
    emoji: "📊",
    title: "Evidence Agent",
    description: "Gathering research, statistics, and real-world examples",
  },
  {
    id: 3,
    emoji: "⚙️",
    title: "Practical Agent",
    description: "Creating step-by-step guides and actionable frameworks",
  },
  {
    id: 4,
    emoji: "🧠",
    title: "Analytical Agent",
    description: "Developing deep technical insights and comparisons",
  },
  {
    id: 5,
    emoji: "🔮",
    title: "Speculative Agent",
    description: "Exploring future trends and innovative possibilities",
  },
  {
    id: 6,
    emoji: "🌍",
    title: "Contextual Agent",
    description: "Adding industry perspective and historical context",
  },
  {
    id: 7,
    emoji: "✨",
    title: "Engagement Agent",
    description: "Crafting compelling narrative and storytelling elements",
  },
  {
    id: 8,
    emoji: "📝",
    title: "Master Writer",
    description: "Assembling all elements into exceptional blog content",
  },
  {
    id: 9,
    emoji: "🎉",
    title: "Finalizing",
    description: "Polishing and optimizing your content for publication",
  },
];

export default function Loading({
  simpleLoader = false,
  currentStep = "",
  progress = 0,
}: LoadingProps) {
  const [animatedProgress, setAnimatedProgress] = useState(0);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  const activeRef = useRef<HTMLDivElement | null>(null);

  // animate progress
  useEffect(() => {
    const timer = setTimeout(() => setAnimatedProgress(progress), 100);
    return () => clearTimeout(timer);
  }, [progress]);

  // detect current step index
  useEffect(() => {
    if (currentStep) {
      const stepIndex = AGENT_STEPS.findIndex(
        (step) =>
          currentStep.toLowerCase().includes(step.title.toLowerCase()) ||
          currentStep.includes(step.emoji)
      );
      if (stepIndex !== -1) {
        setCurrentStepIndex(stepIndex);
      }
    }
  }, [currentStep]);

  // scroll active step into view, then scroll to top
  useEffect(() => {
    if (activeRef.current) {
      activeRef.current.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  }, [currentStepIndex]);

  if (simpleLoader) {
    return (
      <Card className="w-full max-w-2xl mx-auto">
        <CardContent className="flex flex-col items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Generating Your Blog Content
          </h3>
          <p className="text-gray-600 text-center max-w-md">
            Our AI is crafting exceptional content tailored to your
            specifications. This may take a moment...
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardContent className="py-8">
        <div className="text-center mb-8">
          <div className="relative mb-6">
            <div className="relative">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-2xl text-white font-bold animate-pulse">
                🤖
              </div>
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full animate-ping"></div>
              <div className="absolute -bottom-1 -left-1 w-3 h-3 bg-yellow-400 animate-bounce"></div>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Crafting Your Exceptional Blog
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Our specialized AI agents are working together using Robert
              Roskam&apos;s 6-pillar framework to create compelling,
              research-backed content.
            </p>
          </div>

          <div className="mb-8">
            <Progress value={animatedProgress} className="h-3 mb-2" />
            <p className="text-sm text-gray-500">
              {Math.round(animatedProgress)}% Complete
            </p>
          </div>
        </div>

        <div className="space-y-4">
          {AGENT_STEPS.map((step, index) => {
            const isActive = index === currentStepIndex;
            const isCompleted =
              index < currentStepIndex ||
              (index === currentStepIndex && progress === 100);

            return (
              <div
                key={step.id}
                className={`flex items-center p-4 rounded-lg border transition-all duration-500 ${
                  isActive
                    ? "border-blue-200 bg-blue-50 shadow-md scale-105"
                    : isCompleted
                    ? "border-green-200 bg-green-50"
                    : "border-gray-200 bg-gray-50"
                }`}
              >
                <div className="flex-shrink-0 mr-4">
                  {isCompleted ? (
                    <CheckCircle className="w-6 h-6 text-green-600" />
                  ) : isActive ? (
                    <div className="w-6 h-6 rounded-full border-2 border-blue-600 flex items-center justify-center">
                      <div className="w-3 h-3 rounded-full bg-blue-600 animate-pulse"></div>
                    </div>
                  ) : (
                    <Circle className="w-6 h-6 text-gray-400" />
                  )}
                </div>

                <div className="flex-grow">
                  <div className="flex items-center mb-1">
                    <span className="text-2xl mr-3">{step.emoji}</span>
                    <h3
                      className={`font-semibold ${
                        isActive
                          ? "text-blue-900"
                          : isCompleted
                          ? "text-green-900"
                          : "text-gray-700"
                      }`}
                    >
                      {step.title}
                    </h3>
                    {isActive && (
                      <div
                        ref={activeRef}
                        className="ml-3 flex items-center space-x-2"
                      >
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"></div>
                          <div
                            className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"
                            style={{ animationDelay: "0.1s" }}
                          ></div>
                          <div
                            className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"
                            style={{ animationDelay: "0.2s" }}
                          ></div>
                        </div>
                        <div className="flex space-x-px">
                          <div
                            className="w-1 h-4 bg-blue-400 animate-pulse"
                            style={{ animationDelay: "0s" }}
                          ></div>
                          <div
                            className="w-1 h-6 bg-blue-500 animate-pulse"
                            style={{ animationDelay: "0.1s" }}
                          ></div>
                          <div
                            className="w-1 h-3 bg-blue-400 animate-pulse"
                            style={{ animationDelay: "0.2s" }}
                          ></div>
                          <div
                            className="w-1 h-5 bg-blue-500 animate-pulse"
                            style={{ animationDelay: "0.3s" }}
                          ></div>
                          <div
                            className="w-1 h-4 bg-blue-400 animate-pulse"
                            style={{ animationDelay: "0.4s" }}
                          ></div>
                        </div>
                      </div>
                    )}
                  </div>
                  <p
                    className={`text-sm ${
                      isActive
                        ? "text-blue-700"
                        : isCompleted
                        ? "text-green-700"
                        : "text-gray-500"
                    }`}
                  >
                    {step.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {currentStep && (
          <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-200">
            <p className="text-center text-blue-800 font-medium">
              {currentStep}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
