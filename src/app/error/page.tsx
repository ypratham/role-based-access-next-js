"use client";

import { useState } from "react";
import { AlertTriangle, Lock, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { redirect, useSearchParams } from "next/navigation";
import Navbar from "@/components/navbar";

export default function ErrorDisplay() {
  const [isLoading, setIsLoading] = useState(false);
  const searchParam = useSearchParams();

  const errorType = searchParam.get("error");

  const handleCTA = () => {
    setIsLoading(true);
    redirect("/");
  };

  let { icon, title, description, ctaText } = {
    icon: <AlertTriangle className="h-12 w-12 text-gray-500" />,
    title: "Unknown Error",
    description: "An unexpected error occurred. Please try again later.",
    ctaText: "Go Back",
  };

  if (errorType === "Configuration") {
    icon = <Settings className="h-12 w-12 text-yellow-500" />;
    title = "Configuration Error";
    description = "There was an issue with the system configuration.";
    ctaText = "Retry Configuration";
  } else if (errorType === "AccessDenied") {
    icon = <Lock className="h-12 w-12 text-red-500" />;
    title = "Access Denied";
    description = "You do not have permission to access the content.";
    ctaText = "Go back";
  } else if (errorType === "Verification") {
    icon = <AlertTriangle className="h-12 w-12 text-orange-500" />;
    title = "Verification Required";
    description = "Please verify your account to continue.";
    ctaText = "Try again";
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex flex-1 flex-col items-center justify-center text-center">
        <div className="mb-4 flex justify-center">{icon}</div>
        <h1 className="mb-2 text-2xl font-bold">{title}</h1>
        <p className="mb-6 text-gray-600">{description}</p>
        <Button onClick={handleCTA} disabled={isLoading}>
          {isLoading ? "Processing..." : ctaText}
        </Button>
      </main>
    </div>
  );
}
