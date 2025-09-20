"use client";

import React from "react";
import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { ArrowLeft } from "lucide-react";

import { useRouter } from "next/navigation";

const NoBlogFound = () => {
  const router = useRouter();
  return (
    <div>
      <Card className="w-full">
        <CardContent className="flex flex-col items-center justify-center py-12">
          <p className="text-gray-600 mb-4">No blog content found.</p>
          <Button onClick={() => router.push("/")}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Generator
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default NoBlogFound;
