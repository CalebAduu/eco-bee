"use client";
import React, { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { FaLeaf, FaCheckCircle, FaArrowLeft } from "react-icons/fa";
import Link from "next/link";

function ResultsContent() {
  const searchParams = useSearchParams();
  const resultParam = searchParams.get("result");

  let result: any = null;
  try {
    result = resultParam ? JSON.parse(decodeURIComponent(resultParam)) : null;
  } catch (error) {
    console.error("Error parsing result:", error);
  }

  // Helper function to format values properly
  const formatValue = (value: any): string => {
    if (value === null || value === undefined) {
      return "N/A";
    }
    if (typeof value === "object") {
      // For objects, try to extract a meaningful representation
      if (Array.isArray(value)) {
        return value.join(", ");
      }
      // For objects like resource_savings, show a summary
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

  if (!result) {
    return (
      <div className="max-w-xl mx-auto bg-white shadow-xl rounded-2xl p-8 mt-8 animate-fade-in">
        <h2 className="text-2xl font-bold text-center">No Results Found</h2>
        <p className="text-center mt-4">
          Please complete the test to view your results.
        </p>
        <div className="text-center mt-6">
          <Link
            href="/"
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-all duration-200 inline-flex items-center"
          >
            <FaArrowLeft className="mr-2" />
            Back to Test
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto bg-white shadow-xl rounded-2xl p-8 mt-8 animate-fade-in">
      <div className="flex items-center mb-6">
        <FaLeaf className="text-green-600 text-3xl mr-2" />
        <h2 className="text-2xl font-bold tracking-tight">
          Your Eco-Bee Results
        </h2>
      </div>

      {/* Score Display */}
      {(result.score || result.eco_score) && (
        <div className="bg-gradient-to-r from-green-100 to-blue-100 p-6 rounded-xl border border-green-200 mb-6">
          <div className="text-center mb-4">
            <div className="text-4xl font-bold text-green-600">
              {result.eco_score?.overall_score || result.score?.total || 0}/100
            </div>
            <div className="text-lg font-semibold text-gray-700">
              {result.eco_score?.grade || result.score?.level || "N/A"}
            </div>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
            <div className="bg-white p-3 rounded-lg">
              <div className="font-semibold text-gray-600">Food Choices</div>
              <div className="text-lg font-bold text-green-600">
                {result.eco_score?.category_scores?.meal ||
                  result.score?.breakdown?.food_choices ||
                  0}
                /100
              </div>
            </div>
            <div className="bg-white p-3 rounded-lg">
              <div className="font-semibold text-gray-600">Transportation</div>
              <div className="text-lg font-bold text-blue-600">
                {result.eco_score?.category_scores?.transportation ||
                  result.score?.breakdown?.transportation ||
                  0}
                /100
              </div>
            </div>
            <div className="bg-white p-3 rounded-lg">
              <div className="font-semibold text-gray-600">Daily Actions</div>
              <div className="text-lg font-bold text-purple-600">
                {result.eco_score?.category_scores?.environmental_actions ||
                  result.score?.breakdown?.daily_actions ||
                  0}
                /100
              </div>
            </div>
            <div className="bg-white p-3 rounded-lg">
              <div className="font-semibold text-gray-600">Clothing</div>
              <div className="text-lg font-bold text-yellow-600">
                {result.eco_score?.category_scores?.clothing ||
                  result.score?.breakdown?.clothing ||
                  0}
                /100
              </div>
            </div>
            <div className="bg-white p-3 rounded-lg">
              <div className="font-semibold text-gray-600">Reflection</div>
              <div className="text-lg font-bold text-indigo-600">
                {result.score?.breakdown?.reflection || 0}/10
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Reflection Analysis */}
      {result.analysis && result.analysis.reflection_analysis && (
        <div className="bg-gradient-to-r from-purple-50 to-indigo-50 p-6 rounded-xl border border-purple-200 mb-6">
          <h3 className="font-bold text-gray-800 mb-4 flex items-center">
            <span className="text-2xl mr-2">💭</span>
            Your Sustainability Reflection
          </h3>

          <div className="space-y-4">
            {/* Score Display */}
            <div className="bg-white p-4 rounded-lg border-l-4 border-indigo-400">
              <div className="flex justify-between items-center mb-2">
                <h4 className="font-semibold text-indigo-800">
                  Reflection Score:
                </h4>
                <div className="text-2xl font-bold text-indigo-600">
                  {result.analysis.reflection_analysis.reflection_score || 0}/10
                </div>
              </div>
              {result.analysis.reflection_analysis.scoring_criteria && (
                <p className="text-sm text-gray-600">
                  {result.analysis.reflection_analysis.scoring_criteria}
                </p>
              )}
            </div>

            {/* AI Insights */}
            <div className="bg-white p-4 rounded-lg border-l-4 border-purple-400">
              <h4 className="font-semibold text-purple-800 mb-2">
                AI Analysis:
              </h4>
              <p className="text-gray-700 leading-relaxed">
                {result.analysis.reflection_analysis.insights}
              </p>
            </div>

            {/* Strengths and Suggestions */}
            <div className="grid md:grid-cols-2 gap-4">
              {result.analysis.reflection_analysis.strengths &&
                result.analysis.reflection_analysis.strengths.length > 0 && (
                  <div className="bg-green-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-green-800 mb-2">
                      Strengths:
                    </h4>
                    <ul className="space-y-1">
                      {result.analysis.reflection_analysis.strengths.map(
                        (strength: string, index: number) => (
                          <li
                            key={index}
                            className="text-green-700 text-sm flex items-start"
                          >
                            <span className="mr-2">✓</span>
                            {strength}
                          </li>
                        )
                      )}
                    </ul>
                  </div>
                )}

              {result.analysis.reflection_analysis.suggestions &&
                result.analysis.reflection_analysis.suggestions.length > 0 && (
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-blue-800 mb-2">
                      Consider:
                    </h4>
                    <ul className="space-y-1">
                      {result.analysis.reflection_analysis.suggestions.map(
                        (suggestion: string, index: number) => (
                          <li
                            key={index}
                            className="text-blue-700 text-sm flex items-start"
                          >
                            <span className="mr-2">💡</span>
                            {suggestion}
                          </li>
                        )
                      )}
                    </ul>
                  </div>
                )}
            </div>

            {/* Key Themes */}
            {result.analysis.reflection_analysis.themes &&
              result.analysis.reflection_analysis.themes.length > 0 && (
                <div>
                  <h4 className="font-semibold text-gray-700 mb-2">
                    Key Themes Identified:
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {result.analysis.reflection_analysis.themes.map(
                      (theme: string, index: number) => (
                        <span
                          key={index}
                          className="inline-block bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm font-medium"
                        >
                          {theme}
                        </span>
                      )
                    )}
                  </div>
                </div>
              )}

            {/* Encouragement */}
            <div className="bg-gradient-to-r from-green-50 to-blue-50 p-4 rounded-lg">
              <p className="text-gray-800 font-medium">
                {result.analysis.reflection_analysis.encouragement}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Analysis */}
      {(result.analysis || result.comprehensive_analysis) && (
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm mb-6">
          <h3 className="font-bold text-gray-800 mb-4 flex items-center">
            <FaLeaf className="text-green-600 mr-2" />
            Your Impact Today
          </h3>

          {(result.analysis?.impact_summary ||
            result.comprehensive_analysis?.overall_impact) && (
            <div className="bg-green-50 p-4 rounded-lg mb-4">
              <p className="text-green-800 font-medium">
                {result.analysis?.impact_summary ||
                  `Environmental Actions: ${
                    result.comprehensive_analysis?.overall_impact
                      ?.environmental_actions_taken || 0
                  } actions taken`}
              </p>
            </div>
          )}

          {(result.analysis?.recommendations ||
            result.comprehensive_analysis?.recommendations) &&
            ((result.analysis?.recommendations?.length || 0) > 0 ||
              (result.comprehensive_analysis?.recommendations?.length || 0) >
                0) && (
              <div>
                <h4 className="font-semibold text-gray-700 mb-2">
                  Recommendations:
                </h4>
                <ul className="space-y-2">
                  {(
                    result.analysis?.recommendations ||
                    result.comprehensive_analysis?.recommendations ||
                    []
                  ).map((rec: string, index: number) => (
                    <li key={index} className="flex items-start">
                      <FaCheckCircle className="text-green-500 mt-1 mr-2 flex-shrink-0" />
                      <span className="text-gray-700">{rec}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
        </div>
      )}

      {/* Actions */}
      <div className="text-center space-y-4">
        <Link
          href="/"
          className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-all duration-200 inline-flex items-center"
        >
          <FaArrowLeft className="mr-2" />
          Take Another Assessment
        </Link>
      </div>
    </div>
  );
}

function LoadingFallback() {
  return (
    <div className="max-w-xl mx-auto bg-white shadow-xl rounded-2xl p-8 mt-8">
      <div className="flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
        <span className="ml-3 text-gray-600">Loading results...</span>
      </div>
    </div>
  );
}

export default function ResultsPage() {
  return (
    <Suspense fallback={<LoadingFallback/>}>
      <ResultsContent />
    </Suspense>
  );
}
