"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

// Data array for easy scaling
const EXAM_OPTIONS = [
  {
    id: "neet",
    name: "NEET",
    fullName: "National Eligibility cum Entrance Test",
    description: "Medical entrance preparation, mock tests, and physics/chemistry/biology structural revision.",
    icon: "🩺",
    badgeColor: "bg-teal-100 text-teal-800 dark:bg-teal-900/30 dark:text-teal-400",
  },
  {
    id: "jee",
    name: "JEE",
    fullName: "Joint Entrance Examination",
    description: "Engineering prep engine featuring advanced physics, chemistry, and mathematics modules.",
    icon: "📐",
    badgeColor: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
  },
  {
    id: "ssc",
    name: "SSC",
    fullName: "Staff Selection Commission",
    description: "Government tier-based competitive exams mapping aptitude, reasoning, and general awareness.",
    icon: "💼",
    badgeColor: "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400",
  },
];

export default function ExamSelectionPage() {
  const [selectedExam, setSelectedExam] = useState(null);
  const router = useRouter();

  const handleProceed = () => {
    if (!selectedExam) return;
    
    // Smoothly route the user to their target dashboard framework workspace
    // e.g., /aiguide?exam=neet or /dashboard/neet
    router.push(`/?exam=${selectedExam}`);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 transition-colors duration-200">
      <div className="max-w-4xl mx-auto w-full space-y-8">
        
        {/* Header Block */}
        <div className="text-center">
          <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight sm:text-4xl">
            Choose Your Target Track
          </h1>
          <p className="mt-3 max-w-2xl mx-auto text-base text-gray-500 dark:text-gray-400 sm:mt-4">
            Select one of the structural preparation pathways below to calibrate your AI-guided portal experience.
          </p>
        </div>

        {/* Card Options Matrix */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-3 mt-8">
          {EXAM_OPTIONS.map((exam) => {
            const isSelected = selectedExam === exam.id;
            return (
              <div
                key={exam.id}
                onClick={() => setSelectedExam(exam.id)}
                className={`relative rounded-2xl p-6 bg-white dark:bg-gray-800 border-2 shadow-sm cursor-pointer transition-all duration-200 ease-in-out flex flex-col justify-between hover:shadow-md ${
                  isSelected
                    ? "border-indigo-600 ring-2 ring-indigo-600/20 dark:border-indigo-500"
                    : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
                }`}
              >
                <div>
                  {/* Top Header Grid inside card */}
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-3xl">{exam.icon}</span>
                    <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${exam.badgeColor}`}>
                      Active Track
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                    {exam.name}
                  </h3>
                  <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5 leading-tight">
                    {exam.fullName}
                  </p>
                  <p className="mt-3 text-sm text-gray-500 dark:text-gray-400 line-clamp-4">
                    {exam.description}
                  </p>
                </div>

                {/* Selection Visual Cue Indicator */}
                <div className="mt-6 flex items-center justify-end">
                  <div
                    className={`w-5 h-5 rounded-full border flex items-center justify-center transition-colors ${
                      isSelected
                        ? "border-indigo-600 bg-indigo-600 text-white"
                        : "border-gray-300 dark:border-gray-600"
                    }`}
                  >
                    {isSelected && (
                      <svg className="w-3 h-3 fill-current" viewBox="0 0 20 20">
                        <path d="M0 11l2-2 5 5L18 3l2 2L7 18z" />
                      </svg>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Active Action Submission Drawer */}
        <div className="pt-4 flex justify-center">
          <button
            onClick={handleProceed}
            disabled={!selectedExam}
            className={`w-full sm:w-64 py-3.5 px-6 rounded-xl font-semibold shadow-sm text-sm tracking-wide transition-all duration-200 ${
              selectedExam
                ? "bg-indigo-600 text-white hover:bg-indigo-700 active:scale-95 cursor-pointer"
                : "bg-gray-200 text-gray-400 dark:bg-gray-800 dark:text-gray-600 cursor-not-allowed"
            }`}
          >
            {selectedExam 
              ? `Open ${selectedExam.toUpperCase()} Workspace` 
              : "Select an Exam to Proceed"
            }
          </button>
        </div>

      </div>
    </div>
  );
}