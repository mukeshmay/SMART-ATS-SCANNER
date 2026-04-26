"use client";

import { useState } from "react";
import UploadScreen from "./components/UploadScreen";
import AnalyzingScreen from "./components/AnalyzingScreen";
import ResultsScreen from "./components/ResultsScreen";
import { ATSAnalysis, AppStep } from "./types";

export default function Home() {
  const [step, setStep] = useState<AppStep>("upload");
  const [analysis, setAnalysis] = useState<ATSAnalysis | null>(null);
  const [resumeText, setResumeText] = useState<string>("");
  const [error, setError] = useState<string>("");

  const handleAnalyze = async (file: File, jobDescription: string) => {
    setError("");
    setStep("analyzing");

    try {
      const formData = new FormData();
      formData.append("resume", file);
      formData.append("jobDescription", jobDescription);

      const res = await fetch("/api/analyze", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setError(data.error || "Analysis failed. Please try again.");
        setStep("upload");
        return;
      }

      setAnalysis(data.analysis);
      setResumeText(data.resumeText);
      setStep("results");
    } catch {
      setError("Network error. Please check your connection and try again.");
      setStep("upload");
    }
  };

  const handleReset = () => {
    setStep("upload");
    setAnalysis(null);
    setResumeText("");
    setError("");
  };

  if (step === "analyzing") {
    return <AnalyzingScreen />;
  }

  if (step === "results" && analysis) {
    return (
      <ResultsScreen
        analysis={analysis}
        resumeText={resumeText}
        onReset={handleReset}
      />
    );
  }

  return (
    <div>
      <UploadScreen onAnalyze={handleAnalyze} isAnalyzing={false} />
      {error && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-red-600 text-white text-sm px-5 py-3 rounded-2xl shadow-xl max-w-sm text-center z-50">
          {error}
        </div>
      )}
    </div>
  );
}
