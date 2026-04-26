"use client";

import { useEffect, useState } from "react";
import { FileText } from "lucide-react";

const steps = [
  "Extracting text from your PDF...",
  "Validating resume structure...",
  "Analyzing ATS compatibility...",
  "Matching against job description...",
  "Generating improvement suggestions...",
  "Building your report...",
];

export default function AnalyzingScreen() {
  const [currentStep, setCurrentStep] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStep((prev) => (prev < steps.length - 1 ? prev + 1 : prev));
      setProgress((prev) => Math.min(prev + 100 / steps.length, 95));
    }, 2200);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex flex-col items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Icon */}
        <div className="flex justify-center mb-8">
          <div className="relative">
            <div className="w-20 h-20 bg-indigo-600 rounded-3xl flex items-center justify-center shadow-xl shadow-indigo-200">
              <FileText size={36} className="text-white" />
            </div>
            <div className="absolute -inset-2 rounded-[2rem] border-2 border-indigo-200 animate-pulse" />
          </div>
        </div>

        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Analyzing Your Resume</h2>
          <p className="text-slate-500 text-sm">Our AI is working through every detail...</p>
        </div>

        {/* Progress bar */}
        <div className="bg-white rounded-2xl p-6 shadow-lg shadow-slate-200/50 border border-slate-100 mb-4">
          <div className="h-2 bg-slate-100 rounded-full overflow-hidden mb-4">
            <div
              className="h-full bg-gradient-to-r from-indigo-500 to-blue-500 rounded-full transition-all duration-700"
              style={{ width: `${progress}%` }}
            />
          </div>

          {/* Steps */}
          <div className="space-y-2">
            {steps.map((step, i) => (
              <div
                key={i}
                className={`flex items-center gap-3 text-sm transition-all duration-300 ${
                  i < currentStep
                    ? "text-green-600"
                    : i === currentStep
                    ? "text-indigo-700 font-medium"
                    : "text-slate-300"
                }`}
              >
                <span className={`w-4 h-4 rounded-full flex-shrink-0 flex items-center justify-center text-xs
                  ${i < currentStep ? "bg-green-100 text-green-600" : i === currentStep ? "bg-indigo-100" : "bg-slate-100"}`}>
                  {i < currentStep ? "✓" : i === currentStep ? "●" : "○"}
                </span>
                {step}
              </div>
            ))}
          </div>
        </div>

        <p className="text-center text-xs text-slate-400">This usually takes 15–30 seconds</p>
      </div>
    </div>
  );
}
