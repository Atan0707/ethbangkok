import React, { useState, useEffect } from "react";
import { Spinner } from "@material-tailwind/react";

function Suggestions() {
  const [analysis, setAnalysis] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalysis = async () => {
      try {
        const response = await fetch(
          "http://localhost:3005/api/violations/analysis"
        );
        const data = await response.json();
        setAnalysis(data.analysis);
      } catch (error) {
        console.error("Error fetching analysis:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalysis();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4">
        <Spinner className="h-12 w-12 animate-spin" />
        <p className="text-gray-600 animate-pulse">
          Analyzing traffic violations...
        </p>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Traffic Violation Analysis</h1>
      <div className="prose prose-lg">
        {analysis.split("\n\n").map((paragraph, index) => {
          if (paragraph.startsWith("*")) {
            return (
              <ul key={index} className="list-disc pl-6 my-2">
                <li className="text-gray-700">{paragraph.replace("* ", "")}</li>
              </ul>
            );
          } else if (paragraph.startsWith("**")) {
            return (
              <h2 key={index} className="text-xl font-semibold mt-6 mb-3">
                {paragraph.replace(/\*\*/g, "")}
              </h2>
            );
          } else {
            return (
              <p key={index} className="text-gray-700 mb-4">
                {paragraph}
              </p>
            );
          }
        })}
      </div>
    </div>
  );
}

export default Suggestions;
