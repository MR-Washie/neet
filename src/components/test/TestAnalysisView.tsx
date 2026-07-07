import { useState } from 'react';
import { QuestionStatusBadge } from './QuestionStatusBadge';
import type { AttemptHistoryRecord, TestSchema } from './types';

interface TestAnalysisViewProps {
  activeTest: TestSchema;
  currentAnalysisRecord: AttemptHistoryRecord;
  siblingAttempts: AttemptHistoryRecord[];
  savingProgress: boolean;
  onSelectAttempt: (attempt: AttemptHistoryRecord) => void;
  onStartReattempt: () => void;
  onExitDashboard: () => void;
}

export function TestAnalysisView({
  activeTest,
  currentAnalysisRecord,
  siblingAttempts,
  savingProgress,
  onSelectAttempt,
  onStartReattempt,
  onExitDashboard,
}: TestAnalysisViewProps) {
  const [currentIdx, setCurrentIdx] = useState(0);
  const safeSnapshot = currentAnalysisRecord.selectedAnswersSnapshot || {};

  const totalCount = activeTest.questions.length;
  const activeQuestion = activeTest.questions[currentIdx] ?? activeTest.questions[0];

  const questionStatuses = activeTest.questions.map((q, index) => {
    const currentId = q._id || String(index);
    const userChosenIdx = safeSnapshot[currentId];

    if (userChosenIdx === undefined) return 'NOT_VISITED' as const;
    return userChosenIdx === q.correctOptionIndex ? 'ANSWERED' : 'NOT_ANSWERED';
  });

  if (!activeQuestion) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
        <div className="rounded-2xl border border-slate-200 bg-white px-6 py-8 text-center shadow-sm">
          <p className="text-sm font-black uppercase tracking-[0.25em] text-slate-400">No review content available</p>
        </div>
      </div>
    );
  }

  const currentId = activeQuestion._id || String(currentIdx);
  const userChosenIdx = safeSnapshot[currentId];
  const isUnattempted = userChosenIdx === undefined;
  const isCorrect = !isUnattempted && userChosenIdx === activeQuestion.correctOptionIndex;

  return (
    <div className="fixed inset-0 z-[9999] bg-slate-50 text-slate-900 flex flex-col justify-between w-screen h-screen overflow-hidden select-none">
      <div className="bg-gradient-to-r from-slate-900 to-slate-800 border-b border-slate-700 text-white px-4 sm:px-6 py-3 flex flex-col gap-3 sm:flex-row sm:justify-between sm:items-center shadow-md">
        <div className="min-w-0 flex-1 pr-2">
          <h1 className="font-extrabold text-[10px] sm:text-sm uppercase tracking-wider text-slate-300 truncate">Performance Review Frame</h1>
          <h2 className="font-black text-sm sm:text-base text-white tracking-tight truncate max-w-xl">{activeTest.title}</h2>
          {siblingAttempts.length > 1 && (
            <div className="mt-2 flex flex-col sm:flex-row sm:items-center gap-2">
              <label className="text-[10px] font-bold uppercase tracking-[0.25em] text-slate-400">Attempt</label>
              <select
                value={currentAnalysisRecord._id}
                onChange={(event) => {
                  const target = siblingAttempts.find((attempt) => attempt._id === event.target.value);
                  if (target) onSelectAttempt(target);
                }}
                className="rounded-lg border border-slate-700 bg-slate-950/80 px-2.5 py-1.5 text-xs font-bold text-slate-100 outline-none"
              >
                {siblingAttempts.map((attempt, index) => (
                  <option key={attempt._id} value={attempt._id}>
                    #{siblingAttempts.length - index} • {new Date(attempt.attemptedAt).toLocaleDateString()}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>
        <div className="flex flex-wrap items-center gap-2 sm:gap-3 flex-shrink-0">
          <div className="rounded-xl border border-slate-700/80 bg-slate-950/60 px-3 py-2 text-right">
            <p className="text-[9px] font-bold uppercase tracking-widest text-slate-400">Marks</p>
            <p className="font-mono text-sm font-black text-emerald-400">{currentAnalysisRecord.totalMarks}/{currentAnalysisRecord.maxPossibleMarks}</p>
          </div>
          <div className="rounded-xl border border-slate-700/80 bg-slate-950/60 px-3 py-2 text-left text-[10px] font-bold uppercase tracking-[0.25em] text-slate-400">
            {savingProgress ? 'Archiving...' : 'Analysis Ready'}
          </div>
          <button
            onClick={onStartReattempt}
            className="px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-bold rounded-lg"
          >
            Start Reattempt
          </button>
          <button
            onClick={onExitDashboard}
            className="px-3 py-2 bg-white/10 hover:bg-white/20 text-white text-xs sm:text-sm font-bold rounded-lg"
          >
            Exit Dashboard
          </button>
        </div>
      </div>

      <div className="lg:hidden bg-white border-b border-slate-200 p-2 overflow-x-auto">
        <div className="flex gap-2">
          {activeTest.questions.map((q, index) => {
            const id = q._id || String(index);
            const isSelected = index === currentIdx;
            const status = questionStatuses[index] || 'NOT_VISITED';

            return (
              <button
                key={id}
                onClick={() => setCurrentIdx(index)}
                className={`flex-shrink-0 rounded-lg p-0.5 transition-all ${isSelected ? 'ring-2 ring-blue-600 ring-offset-1' : ''}`}
              >
                <QuestionStatusBadge status={status} indexLabel={index + 1} />
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden w-full relative bg-slate-200">
        <div className="flex-1 flex flex-col bg-white w-full h-full overflow-hidden min-h-0">
          <div className="flex-1 overflow-y-auto min-h-0 overscroll-contain">
            <div className="p-4 sm:p-6 md:p-10 max-w-4xl w-full mx-auto pb-28 sm:pb-24">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center border-b border-slate-200 pb-3 mb-4 sm:mb-6 gap-2">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-[10px] sm:text-xs font-black bg-blue-50 text-blue-800 border border-blue-200 px-2.5 py-1 rounded-lg uppercase tracking-wide self-start">
                    Section: {activeQuestion.subject || 'General Pattern'}
                  </span>
                  <span className={`text-[10px] sm:text-xs font-black px-2.5 py-1 rounded-lg uppercase tracking-wide self-start ${isUnattempted ? 'bg-slate-100 text-slate-500' : isCorrect ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>
                    {isUnattempted ? 'Skipped' : isCorrect ? 'Correct' : 'Incorrect'}
                  </span>
                </div>
                <span className="text-xs font-bold text-slate-500">
                  Question Number: <strong className="text-slate-900 text-sm font-black">{currentIdx + 1}</strong> of {totalCount}
                </span>
              </div>

              <div className="mb-6 sm:mb-8">
                {activeQuestion.imageUrl ? (
                  <div className="flex justify-center">
                    <img
                      src={activeQuestion.imageUrl}
                      alt={`Question ${currentIdx + 1} visual`}
                      className="w-full max-w-2xl max-h-[420px] object-contain rounded-xl border border-slate-200 shadow-sm bg-slate-50"
                    />
                  </div>
                ) : (
                  <p className="text-sm sm:text-base md:text-lg font-bold text-slate-900 leading-relaxed whitespace-pre-wrap">
                    No image provided for this question.
                  </p>
                )}
              </div>


              <div className="space-y-2.5 sm:space-y-3 pb-4">
                {activeQuestion.options.map((opt, optionIndex) => {
                  const wasSelected = userChosenIdx === optionIndex;
                  const isOptionCorrect = activeQuestion.correctOptionIndex === optionIndex;
                  let rowStyle = 'border-slate-200 bg-slate-50/60 text-slate-700';

                  if (isOptionCorrect) {
                    rowStyle = 'border-emerald-500 bg-emerald-50 text-emerald-900 font-bold';
                  } else if (wasSelected) {
                    rowStyle = 'border-rose-400 bg-rose-50 text-rose-900';
                  }

                  return (
                    <div
                      key={optionIndex}
                      className={`w-full p-3.5 sm:p-4 text-left text-xs sm:text-sm rounded-xl border transition-all flex items-start gap-3 sm:gap-4 ${rowStyle}`}
                    >
                      <span className={`w-5 h-5 sm:w-6 sm:h-6 rounded-full flex-shrink-0 flex items-center justify-center text-xs font-black transition-colors ${isOptionCorrect ? 'bg-emerald-600 text-white' : wasSelected ? 'bg-rose-500 text-white' : 'bg-slate-200 text-slate-500'}`}>
                        {String.fromCharCode(65 + optionIndex)}
                      </span>
                      <div className="flex-1 min-w-0">
                        <div className="break-words">{opt}</div>
                        <div className="mt-1 text-[10px] sm:text-[11px] font-black uppercase tracking-wider">
                          {isOptionCorrect && '✓ Correct Key'}
                          {wasSelected && !isOptionCorrect && '✗ Your Answer'}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="sticky bottom-0 z-20 shrink-0 w-full bg-slate-100/95 border-t border-slate-200 p-3 sm:px-6 sm:py-4 shadow-inner backdrop-blur-sm pb-[calc(0.75rem+env(safe-area-inset-bottom))] sm:pb-4">
            <div className="hidden sm:flex w-full items-center justify-between gap-3">
              <button
                disabled={currentIdx === 0}
                onClick={() => setCurrentIdx((prev) => prev - 1)}
                className="text-center px-16 py-2.5 bg-white border border-slate-300 text-slate-700 text-[11px] sm:text-xs font-bold rounded-lg hover:bg-slate-50 disabled:opacity-30 disabled:pointer-events-none transition-colors"
              >
                Back
              </button>
              <button
                disabled={currentIdx === totalCount - 1}
                onClick={() => setCurrentIdx((prev) => prev + 1)}
                className="text-center px-16 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-[11px] sm:text-xs font-black tracking-wide rounded-lg transition-all shadow-sm disabled:opacity-30 disabled:pointer-events-none"
              >
                Next
              </button>
            </div>

            <div className="flex sm:hidden gap-2">
              <button
                disabled={currentIdx === 0}
                onClick={() => setCurrentIdx((prev) => prev - 1)}
                className="flex-1 text-center px-4 py-2.5 bg-white border border-slate-300 text-slate-700 text-[11px] sm:text-xs font-bold rounded-lg hover:bg-slate-50 disabled:opacity-30 disabled:pointer-events-none transition-colors"
              >
                Back
              </button>
              <button
                disabled={currentIdx === totalCount - 1}
                onClick={() => setCurrentIdx((prev) => prev + 1)}
                className="flex-1 text-center px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-[11px] sm:text-xs font-black tracking-wide rounded-lg transition-all shadow-sm disabled:opacity-30 disabled:pointer-events-none"
              >
                Next
              </button>
            </div>
          </div>
        </div>

        <div className="hidden lg:flex absolute lg:relative top-0 bottom-0 right-0 z-50 lg:z-0 w-72 sm:w-80 border-l border-slate-300 bg-slate-50 flex-col justify-between transform transition-transform duration-300 ease-in-out h-full lg:translate-x-0">
          <div className="p-4 flex-1 overflow-y-auto">
            <div className="bg-white p-3 border border-slate-200 rounded-xl mb-4 shadow-sm">
              <p className="text-[9px] uppercase font-black tracking-wider text-slate-400 mb-2">Attempt Summary</p>
              <div className="grid grid-cols-2 gap-2 text-xs font-bold text-slate-700">
                <div className="rounded-lg bg-slate-50 p-2">
                  <p className="text-[10px] uppercase tracking-wider text-slate-400">Marks</p>
                  <p className="mt-1 text-sm text-slate-900">{currentAnalysisRecord.totalMarks}/{currentAnalysisRecord.maxPossibleMarks}</p>
                </div>
                <div className="rounded-lg bg-slate-50 p-2">
                  <p className="text-[10px] uppercase tracking-wider text-slate-400">Accuracy</p>
                  <p className="mt-1 text-sm text-blue-600">{currentAnalysisRecord.attemptedCount > 0 ? Math.round((currentAnalysisRecord.correctAnswers / currentAnalysisRecord.attemptedCount) * 100) : 0}%</p>
                </div>
              </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl p-3 shadow-sm">
              <p className="text-[9px] uppercase font-black tracking-widest text-slate-400 mb-3 border-b border-slate-100 pb-1.5">Question Array</p>
              <div className="grid grid-cols-4 gap-2">
                {activeTest.questions.map((q, index) => {
                  const currentQuestionId = q._id || String(index);
                  const status = questionStatuses[index] || 'NOT_VISITED';
                  const isSelected = index === currentIdx;

                  return (
                    <button
                      key={currentQuestionId}
                      onClick={() => setCurrentIdx(index)}
                      className={`transition-transform active:scale-95 focus:outline-none flex items-center justify-center ${isSelected ? 'ring-2 ring-blue-600 ring-offset-1 rounded-lg' : ''}`}
                    >
                      <QuestionStatusBadge status={status} indexLabel={index + 1} />
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="p-4 bg-slate-100 border-t border-slate-200 w-full">
            <button
              onClick={onStartReattempt}
              className="w-full text-xs font-black text-white bg-blue-600 hover:bg-blue-700 py-3 rounded-xl transition-all shadow-md tracking-wider uppercase"
            >
              Reattempt This Paper
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
