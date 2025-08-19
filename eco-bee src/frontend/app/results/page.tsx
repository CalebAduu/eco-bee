"use client";
import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import {
  FaLeaf,
  FaCheckCircle,
  FaArrowLeft,
  FaTrophy,
  FaLightbulb,
  FaStar,
  FaGlobe,
  FaRecycle,
  FaShareAlt,
  FaChartBar,
} from "react-icons/fa";
import Link from "next/link";

export default function ResultsPage() {
  const searchParams = useSearchParams();
  const resultParam = searchParams.get("result");
  const [saveStatus, setSaveStatus] = useState<
    "idle" | "saving" | "saved" | "error"
  >("idle");

  let result = null;
  try {
    result = resultParam ? JSON.parse(decodeURIComponent(resultParam)) : null;
  } catch (error) {
    console.error("Error parsing result:", error);
  }

  // Save results to Supabase automatically when page loads
  useEffect(() => {
    if (result && saveStatus === "idle") {
      saveResultsToDatabase(result);
    }
  }, [result, saveStatus]);

  const saveResultsToDatabase = async (resultData: any) => {
    setSaveStatus("saving");
    try {
      const response = await fetch("http://localhost:8000/api/save-results", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          quiz_responses: resultData.quiz_responses || [],
          scoring_result: resultData.eco_score || resultData.score || {},
          user_metadata: {
            timestamp: new Date().toISOString(),
            user_agent: navigator.userAgent,
            screen_resolution: `${screen.width}x${screen.height}`,
          },
          session_id: resultData.session_id || `session_${Date.now()}`,
        }),
      });

      if (response.ok) {
        setSaveStatus("saved");
        console.log("✅ Results saved to database successfully");
      } else {
        throw new Error(`Server error: ${response.status}`);
      }
    } catch (error) {
      console.error("❌ Error saving results to database:", error);
      setSaveStatus("error");
    }
  };

  const formatValue = (value: any): string => {
    if (value === null || value === undefined) {
      return "N/A";
    }
    if (typeof value === "object") {
      if (Array.isArray(value)) {
        return value.join(", ");
      }
      const entries = Object.entries(value);
      if (entries.length === 0) return "none";
      if (entries.length === 1) {
        const [key, val] = entries[0];
        return `${key}: ${val}`;
      }
      return `${entries.length} items`;
    }
    if (typeof value === "boolean") {
      return value ? "yes" : "no";
    }
    if (typeof value === "number") {
      return value.toString();
    }
    return String(value);
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600";
    if (score >= 60) return "text-blue-600";
    if (score >= 40) return "text-yellow-600";
    return "text-red-600";
  };

  const getScoreBg = (score: number) => {
    if (score >= 80) return "bg-green-100 border-green-200";
    if (score >= 60) return "bg-blue-100 border-blue-200";
    if (score >= 40) return "bg-yellow-100 border-yellow-200";
    return "bg-red-100 border-red-200";
  };

  if (!result) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 p-4">
        <div className="max-w-md mx-auto bg-white shadow-lg rounded-xl p-6 mt-20">
          <div className="text-center">
            <div className="text-6xl mb-4">🌱</div>
            <h2 className="text-xl font-bold text-gray-800 mb-2">
              No Results Found
            </h2>
            <p className="text-gray-600 mb-6">
              Please complete the test to view your results.
            </p>
            <Link
              href="/"
              className="inline-flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
            >
              <FaArrowLeft className="mr-2" />
              Back to Test
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const overallScore =
    result.eco_score?.overall_score || result.score?.total || 0;
  const grade = result.eco_score?.grade || result.score?.level || "N/A";

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header Card */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="bg-green-100 p-3 rounded-full mr-4">
                <FaTrophy className="text-green-600 text-2xl" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-800">
                  Your EcoBee Results
                </h1>
                <p className="text-gray-600">Environmental Impact Assessment</p>
                {/* Save status indicator */}
                {saveStatus === "saving" && (
                  <p className="text-blue-600 text-sm mt-1">
                    💾 Saving results...
                  </p>
                )}
                {saveStatus === "saved" && (
                  <p className="text-green-600 text-sm mt-1">
                    ✅ Results saved securely
                  </p>
                )}
                {saveStatus === "error" && (
                  <p className="text-red-600 text-sm mt-1">
                    ⚠️ Save failed (results still visible)
                  </p>
                )}
              </div>
            </div>
            <button
              className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
              title="Share Results"
              aria-label="Share Results"
            >
              <FaShareAlt className="text-xl" />
            </button>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-3 gap-4">
          {/* Score Circle Card */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-lg p-6 h-fit">
              <div className="text-center">
                <div className="relative inline-block mb-4">
                  <svg
                    className="w-32 h-32 transform -rotate-90"
                    viewBox="0 0 100 100"
                  >
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      stroke="#e5e7eb"
                      strokeWidth="8"
                      fill="none"
                    />
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      stroke={
                        overallScore >= 80
                          ? "#10b981"
                          : overallScore >= 60
                          ? "#3b82f6"
                          : overallScore >= 40
                          ? "#f59e0b"
                          : "#ef4444"
                      }
                      strokeWidth="8"
                      fill="none"
                      strokeLinecap="round"
                      strokeDasharray={`${2 * Math.PI * 40}`}
                      strokeDashoffset={`${
                        2 * Math.PI * 40 * (1 - overallScore / 100)
                      }`}
                      className="transition-all duration-1000"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center flex-col">
                    <div
                      className={`text-3xl font-bold ${getScoreColor(
                        overallScore
                      )}`}
                    >
                      {overallScore}
                    </div>
                    <div className="text-sm text-gray-500">/ 100</div>
                    <div
                      className={`text-lg font-bold px-3 py-1 rounded-full mt-1 ${getScoreBg(
                        overallScore
                      )}`}
                    >
                      {grade}
                    </div>
                  </div>
                </div>
                <p className="text-sm text-gray-600">
                  {overallScore >= 80
                    ? "Excellent! You're living sustainably."
                    : overallScore >= 60
                    ? "Good progress! Keep improving."
                    : "There's room for improvement."}
                </p>
              </div>
            </div>
          </div>

          {/* Category Scores */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
                <FaChartBar className="mr-2 text-blue-600" />
                Category Breakdown
              </h3>
              <div className="grid grid-cols-2 gap-3">
                {[
                  {
                    name: "Food Choices",
                    score:
                      result.eco_score?.category_scores?.meal ||
                      result.score?.breakdown?.food_choices ||
                      0,
                    icon: "🍽️",
                    color: "green",
                  },
                  {
                    name: "Transportation",
                    score:
                      result.eco_score?.category_scores?.transportation ||
                      result.score?.breakdown?.transportation ||
                      0,
                    icon: "🚗",
                    color: "blue",
                  },
                  {
                    name: "Daily Actions",
                    score:
                      result.eco_score?.category_scores
                        ?.environmental_actions ||
                      result.score?.breakdown?.daily_actions ||
                      0,
                    icon: "♻️",
                    color: "purple",
                  },
                  {
                    name: "Clothing",
                    score:
                      result.eco_score?.category_scores?.clothing ||
                      result.score?.breakdown?.clothing ||
                      0,
                    icon: "👕",
                    color: "yellow",
                  },
                ].map((category, index) => (
                  <div
                    key={index}
                    className={`p-3 rounded-lg border-2 ${getScoreBg(
                      category.score
                    )}`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <span className="text-lg mr-2">{category.icon}</span>
                        <div>
                          <div className="font-medium text-gray-800 text-sm">
                            {category.name}
                          </div>
                          <div className="text-xs text-gray-500">Score</div>
                        </div>
                      </div>
                      <div
                        className={`text-xl font-bold ${getScoreColor(
                          category.score
                        )}`}
                      >
                        {category.score}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Reflection Analysis */}
        {result.analysis?.reflection_analysis && (
          <div className="bg-white rounded-xl shadow-lg p-6 mt-4">
            <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
              <FaStar className="mr-2 text-purple-600" />
              Sustainability Reflection
              <span className="ml-auto bg-purple-100 text-purple-600 px-3 py-1 rounded-full text-sm font-medium">
                {result.analysis.reflection_analysis.reflection_score || 0}/10
              </span>
            </h3>

            <div className="grid md:grid-cols-2 gap-4">
              {/* AI Insights */}
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-semibold text-blue-800 mb-2 flex items-center">
                  <FaLightbulb className="mr-1 text-sm" />
                  AI Analysis
                </h4>
                <p className="text-blue-700 text-sm leading-relaxed">
                  {result.analysis.reflection_analysis.insights}
                </p>
              </div>

              {/* Strengths & Suggestions */}
              <div className="space-y-3">
                {result.analysis.reflection_analysis.strengths?.length > 0 && (
                  <div className="bg-green-50 p-3 rounded-lg">
                    <h4 className="font-semibold text-green-800 text-sm mb-2">
                      Strengths
                    </h4>
                    <ul className="space-y-1">
                      {result.analysis.reflection_analysis.strengths
                        .slice(0, 2)
                        .map((strength: string, index: number) => (
                          <li
                            key={index}
                            className="text-green-700 text-xs flex items-start"
                          >
                            <span className="mr-1">✓</span>
                            {strength}
                          </li>
                        ))}
                    </ul>
                  </div>
                )}

                {result.analysis.reflection_analysis.suggestions?.length >
                  0 && (
                  <div className="bg-amber-50 p-3 rounded-lg">
                    <h4 className="font-semibold text-amber-800 text-sm mb-2">
                      Suggestions
                    </h4>
                    <ul className="space-y-1">
                      {result.analysis.reflection_analysis.suggestions
                        .slice(0, 2)
                        .map((suggestion: string, index: number) => (
                          <li
                            key={index}
                            className="text-amber-700 text-xs flex items-start"
                          >
                            <span className="mr-1">💡</span>
                            {suggestion}
                          </li>
                        ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>

            {/* Themes */}
            {result.analysis.reflection_analysis.themes?.length > 0 && (
              <div className="mt-4 pt-4 border-t border-gray-200">
                <h4 className="font-semibold text-gray-700 text-sm mb-2">
                  Key Themes
                </h4>
                <div className="flex flex-wrap gap-2">
                  {result.analysis.reflection_analysis.themes
                    .slice(0, 5)
                    .map((theme: string, index: number) => (
                      <span
                        key={index}
                        className="bg-purple-100 text-purple-700 px-2 py-1 rounded-full text-xs"
                      >
                        {theme}
                      </span>
                    ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Impact & Recommendations */}
        {(result.analysis || result.comprehensive_analysis) && (
          <div className="bg-white rounded-xl shadow-lg p-6 mt-4">
            <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
              <FaGlobe className="mr-2 text-green-600" />
              Environmental Impact & Recommendations
            </h3>

            <div className="grid md:grid-cols-2 gap-4">
              {/* Impact Summary */}
              {(result.analysis?.impact_summary ||
                result.comprehensive_analysis?.overall_impact) && (
                <div className="bg-green-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-green-800 mb-2">
                    Today's Impact
                  </h4>
                  <p className="text-green-700 text-sm">
                    {result.analysis?.impact_summary ||
                      `${
                        result.comprehensive_analysis?.overall_impact
                          ?.environmental_actions_taken || 0
                      } environmental actions taken`}
                  </p>
                </div>
              )}

              {/* Top Recommendations */}
              {(
                result.analysis?.recommendations ||
                result.comprehensive_analysis?.recommendations
              )?.length > 0 && (
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-blue-800 mb-2">
                    Top Recommendations
                  </h4>
                  <ul className="space-y-1">
                    {(
                      result.analysis?.recommendations ||
                      result.comprehensive_analysis?.recommendations ||
                      []
                    )
                      .slice(0, 3)
                      .map((rec: string, index: number) => (
                        <li
                          key={index}
                          className="text-blue-700 text-sm flex items-start"
                        >
                          <FaCheckCircle className="text-blue-500 mt-0.5 mr-2 flex-shrink-0 text-xs" />
                          <span>{rec}</span>
                        </li>
                      ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="bg-white rounded-xl shadow-lg p-6 mt-4">
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/"
              className="inline-flex items-center justify-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
            >
              <FaArrowLeft className="mr-2" />
              Take Another Assessment
            </Link>
            <button className="inline-flex items-center justify-center px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors">
              <FaShareAlt className="mr-2" />
              Share Results
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
