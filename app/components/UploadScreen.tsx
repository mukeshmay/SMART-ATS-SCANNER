"use client";

import { useState, useRef, useCallback } from "react";
import { Upload, FileText, X, CheckCircle, AlertCircle, Loader2, Briefcase } from "lucide-react";

interface UploadScreenProps {
  onAnalyze: (file: File, jobDescription: string) => void;
  isAnalyzing: boolean;
}

export default function UploadScreen({ onAnalyze, isAnalyzing }: UploadScreenProps) {
  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [jobDescription, setJobDescription] = useState("");
  const [fileError, setFileError] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = (f: File) => {
    setFileError("");
    if (f.type !== "application/pdf") {
      setFileError("Only PDF files are accepted.");
      return;
    }
    if (f.size > 10 * 1024 * 1024) {
      setFileError("File size must be under 10MB.");
      return;
    }
    setFile(f);
  };

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) handleFile(droppedFile);
  }, []);

  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const onDragLeave = () => setIsDragging(false);

  const handleSubmit = () => {
    if (file && jobDescription.trim().length > 20) {
      onAnalyze(file, jobDescription.trim());
    }
  };

  const canAnalyze = file && jobDescription.trim().length > 20 && !isAnalyzing;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex flex-col">
      {/* Header */}
      <header className="py-6 px-8 flex items-center gap-3">
        <div className="w-9 h-9 bg-indigo-600 rounded-xl flex items-center justify-center">
          <FileText size={20} className="text-white" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-slate-900">SMART ATS SCANNER</h1>
          <p className="text-xs text-slate-500 -mt-0.5">AI-Powered Resume Optimizer</p>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 py-8">
        <div className="w-full max-w-2xl">
          {/* Hero */}
          <div className="text-center mb-10">
            <h2 className="text-4xl font-bold text-slate-900 mb-3">
              Land Your Dream Job
            </h2>
            <p className="text-lg text-slate-600 max-w-lg mx-auto">
              Upload your resume and paste the job description. Our AI will analyze ATS compatibility and show you exactly what to improve.
            </p>
          </div>

          <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/60 border border-slate-100 overflow-hidden">
            {/* Step 1: Upload */}
            <div className="p-8 border-b border-slate-100">
              <div className="flex items-center gap-2 mb-5">
                <span className="w-7 h-7 rounded-full bg-indigo-100 text-indigo-700 text-sm font-bold flex items-center justify-center">1</span>
                <h3 className="text-base font-semibold text-slate-800">Upload Your Resume</h3>
              </div>

              {!file ? (
                <div
                  onClick={() => fileInputRef.current?.click()}
                  onDrop={onDrop}
                  onDragOver={onDragOver}
                  onDragLeave={onDragLeave}
                  className={`border-2 border-dashed rounded-2xl p-10 cursor-pointer text-center transition-all
                    ${isDragging
                      ? "border-indigo-400 bg-indigo-50"
                      : "border-slate-200 bg-slate-50 hover:border-indigo-300 hover:bg-indigo-50/40"
                    }`}
                >
                  <div className="flex flex-col items-center gap-3">
                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-colors
                      ${isDragging ? "bg-indigo-100" : "bg-white shadow-sm"}`}>
                      <Upload size={24} className={isDragging ? "text-indigo-600" : "text-slate-400"} />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-slate-700">
                        Drop your PDF here, or{" "}
                        <span className="text-indigo-600">browse files</span>
                      </p>
                      <p className="text-xs text-slate-400 mt-1">PDF only · Max 10MB</p>
                    </div>
                  </div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".pdf,application/pdf"
                    className="hidden"
                    onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
                  />
                </div>
              ) : (
                <div className="flex items-center gap-3 p-4 bg-green-50 border border-green-200 rounded-2xl">
                  <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <FileText size={18} className="text-green-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-slate-800 truncate">{file.name}</p>
                    <p className="text-xs text-slate-500">{(file.size / 1024).toFixed(1)} KB · PDF</p>
                  </div>
                  <CheckCircle size={18} className="text-green-500 flex-shrink-0" />
                  <button
                    onClick={() => setFile(null)}
                    className="w-7 h-7 rounded-full bg-slate-100 hover:bg-red-100 flex items-center justify-center transition-colors flex-shrink-0"
                  >
                    <X size={14} className="text-slate-500 hover:text-red-500" />
                  </button>
                </div>
              )}

              {fileError && (
                <div className="flex items-center gap-2 mt-3 text-red-600 text-sm">
                  <AlertCircle size={14} />
                  <span>{fileError}</span>
                </div>
              )}
            </div>

            {/* Step 2: Job Description — slides in after file upload */}
            <div className={`transition-all duration-500 ${file ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0 overflow-hidden"}`}>
              <div className="p-8">
                <div className="flex items-center gap-2 mb-5">
                  <span className="w-7 h-7 rounded-full bg-indigo-100 text-indigo-700 text-sm font-bold flex items-center justify-center">2</span>
                  <h3 className="text-base font-semibold text-slate-800">Paste the Job Description</h3>
                </div>

                <div className="relative">
                  <Briefcase size={16} className="absolute left-4 top-4 text-slate-400" />
                  <textarea
                    value={jobDescription}
                    onChange={(e) => setJobDescription(e.target.value)}
                    placeholder="Paste the full job description here — include required skills, responsibilities, and qualifications for best results..."
                    rows={6}
                    className="w-full pl-10 pr-4 py-3 text-sm rounded-2xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400 resize-none bg-slate-50 text-slate-800 placeholder:text-slate-400 transition-all"
                  />
                  <div className="absolute bottom-3 right-3 text-xs text-slate-400">
                    {jobDescription.length} chars
                  </div>
                </div>

                {jobDescription.trim().length > 0 && jobDescription.trim().length < 20 && (
                  <p className="text-xs text-amber-600 mt-2 flex items-center gap-1">
                    <AlertCircle size={12} />
                    Please add more details about the job for accurate analysis.
                  </p>
                )}

                <button
                  onClick={handleSubmit}
                  disabled={!canAnalyze}
                  className={`w-full mt-5 py-4 px-6 rounded-2xl font-semibold text-base transition-all flex items-center justify-center gap-2
                    ${canAnalyze
                      ? "bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-200 hover:shadow-indigo-300 active:scale-[0.98]"
                      : "bg-slate-100 text-slate-400 cursor-not-allowed"
                    }`}
                >
                  {isAnalyzing ? (
                    <>
                      <Loader2 size={18} className="animate-spin" />
                      Analyzing your resume...
                    </>
                  ) : (
                    <>
                      <FileText size={18} />
                      Analyze Resume
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Features row */}
          <div className="mt-8 grid grid-cols-3 gap-4">
            {[
              { icon: "🎯", label: "ATS Score", desc: "Formatting & structure check" },
              { icon: "🔍", label: "Job Match", desc: "Keyword alignment analysis" },
              { icon: "✏️", label: "Smart Edits", desc: "Line-by-line suggestions" },
            ].map((f) => (
              <div key={f.label} className="bg-white/70 backdrop-blur rounded-2xl p-4 text-center border border-slate-100">
                <div className="text-2xl mb-1">{f.icon}</div>
                <div className="text-sm font-semibold text-slate-700">{f.label}</div>
                <div className="text-xs text-slate-500 mt-0.5">{f.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
