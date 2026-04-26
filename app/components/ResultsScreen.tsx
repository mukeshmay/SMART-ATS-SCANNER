"use client";

import { useState } from "react";
import {
  ArrowLeft, ChevronRight, CheckCircle2, AlertTriangle,
  XCircle, Tag, Lightbulb, FileText, Sparkles, TrendingUp
} from "lucide-react";
import { ATSAnalysis, Suggestion } from "../types";
import ScoreCircle from "./ScoreCircle";

interface ResultsScreenProps {
  analysis: ATSAnalysis;
  resumeText: string;
  onReset: () => void;
}

const priorityOrder = { high: 0, medium: 1, low: 2 };

export default function ResultsScreen({ analysis, resumeText, onReset }: ResultsScreenProps) {
  const [activeSuggestionId, setActiveSuggestionId] = useState<string | null>(
    analysis.suggestions[0]?.id ?? null
  );
  const [activeTab, setActiveTab] = useState<"suggestions" | "keywords">("suggestions");

  const activeSuggestion = analysis.suggestions.find(s => s.id === activeSuggestionId);
  const highlightedSectionId = activeSuggestion?.sectionId;

  const sortedSuggestions = [...analysis.suggestions].sort(
    (a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]
  );

  const getStatusIcon = (status: string) => {
    if (status === "good") return <CheckCircle2 size={14} className="text-green-500" />;
    if (status === "warning") return <AlertTriangle size={14} className="text-amber-500" />;
    return <XCircle size={14} className="text-red-500" />;
  };

  const getStatusColor = (status: string) => {
    if (status === "good") return "border-l-green-400 bg-green-50/30";
    if (status === "warning") return "border-l-amber-400 bg-amber-50/30";
    return "border-l-red-400 bg-red-50/40";
  };

  const getHighlightColor = (status: string, isActive: boolean) => {
    if (!isActive) return "";
    if (status === "good") return "bg-green-100 ring-2 ring-green-300";
    if (status === "warning") return "bg-amber-100 ring-2 ring-amber-300";
    return "bg-red-100 ring-2 ring-red-300";
  };

  const getPriorityBadge = (priority: string) => {
    if (priority === "high") return "bg-red-100 text-red-700";
    if (priority === "medium") return "bg-amber-100 text-amber-700";
    return "bg-blue-100 text-blue-700";
  };

  const getTypeBadge = (type: string) => {
    if (type === "replace") return "bg-purple-100 text-purple-700";
    if (type === "add") return "bg-green-100 text-green-700";
    if (type === "remove") return "bg-red-100 text-red-700";
    return "bg-slate-100 text-slate-700";
  };

  const overallScore = Math.round((analysis.atsFriendlinessScore + analysis.jobMatchScore) / 2);

  return (
    <div className="h-screen flex flex-col bg-slate-50 overflow-hidden">
      {/* Top bar */}
      <header className="flex-shrink-0 bg-white border-b border-slate-200 px-6 py-3 flex items-center justify-between gap-4 shadow-sm">
        <div className="flex items-center gap-3">
          <button
            onClick={onReset}
            className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-800 transition-colors"
          >
            <ArrowLeft size={16} />
            <span>New Analysis</span>
          </button>
          <div className="w-px h-5 bg-slate-200" />
          <div className="flex items-center gap-1.5">
            <FileText size={16} className="text-indigo-500" />
            <span className="text-sm font-semibold text-slate-800">SMART ATS SCANNER</span>
          </div>
        </div>

        {/* Scores in header */}
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="text-right">
              <div className="text-xs text-slate-500">ATS Friendliness</div>
              <div className={`text-lg font-bold ${analysis.atsFriendlinessScore >= 75 ? "text-green-600" : analysis.atsFriendlinessScore >= 50 ? "text-amber-600" : "text-red-600"}`}>
                {analysis.atsFriendlinessScore}%
              </div>
            </div>
            <div className="w-px h-8 bg-slate-200" />
            <div className="text-right">
              <div className="text-xs text-slate-500">Job Match</div>
              <div className={`text-lg font-bold ${analysis.jobMatchScore >= 75 ? "text-green-600" : analysis.jobMatchScore >= 50 ? "text-amber-600" : "text-red-600"}`}>
                {analysis.jobMatchScore}%
              </div>
            </div>
            <div className="w-px h-8 bg-slate-200" />
            <div className="text-right">
              <div className="text-xs text-slate-500">Overall</div>
              <div className={`text-lg font-bold ${overallScore >= 75 ? "text-green-600" : overallScore >= 50 ? "text-amber-600" : "text-red-600"}`}>
                {overallScore}%
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 bg-indigo-50 rounded-xl px-3 py-1.5">
            <Sparkles size={14} className="text-indigo-500" />
            <span className="text-xs font-medium text-indigo-700">
              {analysis.suggestions.length} suggestions
            </span>
          </div>
        </div>
      </header>

      {/* Main two-panel layout */}
      <div className="flex-1 flex overflow-hidden">
        {/* LEFT PANEL: Resume with highlights */}
        <div className="w-[58%] flex flex-col border-r border-slate-200 bg-white overflow-hidden">
          <div className="px-6 py-3 border-b border-slate-100 flex items-center justify-between bg-slate-50/60">
            <h2 className="text-sm font-semibold text-slate-700 flex items-center gap-2">
              <FileText size={14} className="text-slate-500" />
              Resume Analysis
            </h2>
            <div className="flex items-center gap-3 text-xs text-slate-500">
              <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-sm bg-red-200 border border-red-300 inline-block" />Critical</span>
              <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-sm bg-amber-200 border border-amber-300 inline-block" />Needs Work</span>
              <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-sm bg-green-200 border border-green-300 inline-block" />Good</span>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-6">
            {/* Score cards */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <ScoreCircle
                score={analysis.atsFriendlinessScore}
                label="ATS Friendliness"
                sublabel="Formatting & Structure"
              />
              <ScoreCircle
                score={analysis.jobMatchScore}
                label="Job Match Score"
                sublabel="Keyword Alignment"
              />
            </div>

            {/* ATS breakdown */}
            <div className="mb-6 bg-slate-50 rounded-2xl p-4 border border-slate-200">
              <h3 className="text-xs font-semibold text-slate-600 mb-3 uppercase tracking-wide">ATS Score Breakdown</h3>
              {Object.entries(analysis.atsFriendlinessBreakdown).map(([key, val]) => (
                <div key={key} className="flex items-center gap-3 mb-2">
                  <span className="text-xs text-slate-600 capitalize w-20 flex-shrink-0">{key}</span>
                  <div className="flex-1 h-1.5 bg-slate-200 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-700 ${val >= 75 ? "bg-green-500" : val >= 50 ? "bg-amber-500" : "bg-red-500"}`}
                      style={{ width: `${val}%` }}
                    />
                  </div>
                  <span className="text-xs font-medium text-slate-700 w-8 text-right">{val}%</span>
                </div>
              ))}
            </div>

            {/* General feedback */}
            <div className="mb-6 bg-indigo-50 border border-indigo-100 rounded-2xl p-4">
              <div className="flex items-start gap-2">
                <Lightbulb size={14} className="text-indigo-500 flex-shrink-0 mt-0.5" />
                <p className="text-xs text-indigo-800 leading-relaxed">{analysis.generalFeedback}</p>
              </div>
            </div>

            {/* Resume sections */}
            <div className="space-y-3">
              <h3 className="text-xs font-semibold text-slate-600 uppercase tracking-wide">Resume Sections</h3>
              {analysis.resumeSections.map((section) => {
                const isHighlighted = section.id === highlightedSectionId;
                return (
                  <div
                    key={section.id}
                    id={`section-${section.id}`}
                    onClick={() => {
                      const matchingSuggestion = analysis.suggestions.find(s => s.sectionId === section.id);
                      if (matchingSuggestion) setActiveSuggestionId(matchingSuggestion.id);
                    }}
                    className={`border-l-4 rounded-r-xl p-4 cursor-pointer transition-all duration-200
                      ${getStatusColor(section.status)}
                      ${isHighlighted ? getHighlightColor(section.status, true) : "hover:shadow-sm"}
                      ${isHighlighted ? "scale-[1.01]" : ""}
                    `}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        {getStatusIcon(section.status)}
                        <span className="text-sm font-semibold text-slate-800">{section.title}</span>
                      </div>
                      {analysis.suggestions.some(s => s.sectionId === section.id) && (
                        <ChevronRight size={14} className="text-slate-400" />
                      )}
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed line-clamp-3 font-mono">
                      {section.content}
                    </p>
                    {section.issues.length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-1">
                        {section.issues.slice(0, 2).map((issue, i) => (
                          <span key={i} className="text-xs bg-white/70 text-slate-600 px-2 py-0.5 rounded-full border border-slate-200">
                            {issue}
                          </span>
                        ))}
                        {section.issues.length > 2 && (
                          <span className="text-xs text-slate-400">+{section.issues.length - 2} more</span>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* RIGHT PANEL: Suggestions sidebar */}
        <div className="w-[42%] flex flex-col bg-slate-50 overflow-hidden">
          <div className="px-5 py-3 border-b border-slate-200 bg-white">
            <div className="flex gap-1 bg-slate-100 rounded-xl p-1">
              <button
                onClick={() => setActiveTab("suggestions")}
                className={`flex-1 py-1.5 rounded-lg text-xs font-semibold transition-all ${activeTab === "suggestions" ? "bg-white shadow text-slate-800" : "text-slate-500 hover:text-slate-700"}`}
              >
                Suggestions ({analysis.suggestions.length})
              </button>
              <button
                onClick={() => setActiveTab("keywords")}
                className={`flex-1 py-1.5 rounded-lg text-xs font-semibold transition-all ${activeTab === "keywords" ? "bg-white shadow text-slate-800" : "text-slate-500 hover:text-slate-700"}`}
              >
                Keywords ({analysis.missingKeywords.length} missing)
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto">
            {activeTab === "suggestions" && (
              <div className="p-4 space-y-3">
                {sortedSuggestions.length === 0 ? (
                  <div className="text-center py-12 text-slate-400">
                    <CheckCircle2 size={40} className="mx-auto mb-3 text-green-400" />
                    <p className="text-sm font-medium">Great resume! No major issues found.</p>
                  </div>
                ) : (
                  sortedSuggestions.map((suggestion: Suggestion) => {
                    const isActive = suggestion.id === activeSuggestionId;
                    return (
                      <div
                        key={suggestion.id}
                        onClick={() => {
                          setActiveSuggestionId(suggestion.id);
                          const el = document.getElementById(`section-${suggestion.sectionId}`);
                          el?.scrollIntoView({ behavior: "smooth", block: "center" });
                        }}
                        className={`rounded-2xl border cursor-pointer transition-all duration-150 overflow-hidden
                          ${isActive
                            ? "border-indigo-300 bg-white shadow-md shadow-indigo-100 scale-[1.01]"
                            : "border-slate-200 bg-white hover:border-indigo-200 hover:shadow-sm"
                          }`}
                      >
                        {/* Suggestion header */}
                        <div className="px-4 pt-3 pb-2">
                          <div className="flex items-center justify-between mb-1.5">
                            <div className="flex items-center gap-1.5 flex-wrap">
                              <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${getPriorityBadge(suggestion.priority)}`}>
                                {suggestion.priority} priority
                              </span>
                              <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${getTypeBadge(suggestion.type)}`}>
                                {suggestion.type}
                              </span>
                            </div>
                            <TrendingUp size={13} className="text-indigo-400 flex-shrink-0" />
                          </div>
                          <h4 className="text-sm font-semibold text-slate-800">{suggestion.title}</h4>
                          <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">{suggestion.reason}</p>
                        </div>

                        {/* Before / After */}
                        {isActive && (
                          <div className="border-t border-slate-100">
                            {suggestion.currentText && (
                              <div className="px-4 py-3 bg-red-50/50 border-b border-slate-100">
                                <div className="flex items-center gap-1.5 mb-1.5">
                                  <XCircle size={11} className="text-red-500" />
                                  <span className="text-xs font-semibold text-red-700 uppercase tracking-wide">Remove / Replace</span>
                                </div>
                                <p className="text-xs text-red-800 bg-red-100/70 rounded-lg p-2.5 font-mono leading-relaxed line-through decoration-red-400">
                                  {suggestion.currentText}
                                </p>
                              </div>
                            )}
                            {suggestion.suggestedText && (
                              <div className="px-4 py-3 bg-green-50/50">
                                <div className="flex items-center gap-1.5 mb-1.5">
                                  <CheckCircle2 size={11} className="text-green-500" />
                                  <span className="text-xs font-semibold text-green-700 uppercase tracking-wide">
                                    {suggestion.currentText ? "Replace With" : "Add"}
                                  </span>
                                </div>
                                <p className="text-xs text-green-800 bg-green-100/70 rounded-lg p-2.5 font-mono leading-relaxed">
                                  {suggestion.suggestedText}
                                </p>
                              </div>
                            )}
                            {suggestion.impact && (
                              <div className="px-4 py-2 bg-indigo-50/40 flex items-center gap-1.5">
                                <TrendingUp size={11} className="text-indigo-500" />
                                <p className="text-xs text-indigo-700">{suggestion.impact}</p>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })
                )}
              </div>
            )}

            {activeTab === "keywords" && (
              <div className="p-4 space-y-4">
                {/* Missing keywords */}
                <div className="bg-white rounded-2xl border border-slate-200 p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <XCircle size={14} className="text-red-500" />
                    <h3 className="text-sm font-semibold text-slate-800">Missing Keywords</h3>
                    <span className="ml-auto text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded-full font-medium">
                      {analysis.missingKeywords.length}
                    </span>
                  </div>
                  {analysis.missingKeywords.length === 0 ? (
                    <p className="text-xs text-slate-500">All key terms are present!</p>
                  ) : (
                    <div className="flex flex-wrap gap-2">
                      {analysis.missingKeywords.map((kw, i) => (
                        <span key={i} className="flex items-center gap-1 text-xs bg-red-50 text-red-700 border border-red-200 px-2.5 py-1 rounded-full">
                          <Tag size={10} />
                          {kw}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Matched keywords */}
                <div className="bg-white rounded-2xl border border-slate-200 p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <CheckCircle2 size={14} className="text-green-500" />
                    <h3 className="text-sm font-semibold text-slate-800">Matched Keywords</h3>
                    <span className="ml-auto text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-medium">
                      {analysis.matchedKeywords.length}
                    </span>
                  </div>
                  {analysis.matchedKeywords.length === 0 ? (
                    <p className="text-xs text-slate-500">No matching keywords found.</p>
                  ) : (
                    <div className="flex flex-wrap gap-2">
                      {analysis.matchedKeywords.map((kw, i) => (
                        <span key={i} className="flex items-center gap-1 text-xs bg-green-50 text-green-700 border border-green-200 px-2.5 py-1 rounded-full">
                          <Tag size={10} />
                          {kw}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Keyword match rate */}
                <div className="bg-white rounded-2xl border border-slate-200 p-4">
                  <h3 className="text-sm font-semibold text-slate-800 mb-3">Keyword Match Rate</h3>
                  <div className="flex items-center gap-3">
                    <div className="flex-1 h-3 bg-slate-100 rounded-full overflow-hidden">
                      {(() => {
                        const total = analysis.matchedKeywords.length + analysis.missingKeywords.length;
                        const pct = total > 0 ? Math.round((analysis.matchedKeywords.length / total) * 100) : 0;
                        return (
                          <>
                            <div
                              className="h-full bg-gradient-to-r from-indigo-500 to-green-500 rounded-full"
                              style={{ width: `${pct}%` }}
                            />
                          </>
                        );
                      })()}
                    </div>
                    <span className="text-sm font-bold text-slate-700">
                      {(() => {
                        const total = analysis.matchedKeywords.length + analysis.missingKeywords.length;
                        return total > 0 ? Math.round((analysis.matchedKeywords.length / total) * 100) : 0;
                      })()}%
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-2">
                    {analysis.matchedKeywords.length} of {analysis.matchedKeywords.length + analysis.missingKeywords.length} keywords matched
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
