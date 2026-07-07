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
  const safeSnapshot = currentAnalysisRecord.selectedAnswersSnapshot || {};

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 sm:py-10 w-full min-h-screen">
      <div className="bg-white p-4 sm:p-6 md:p-10 rounded-2xl sm:rounded-3xl border border-slate-200 shadow-xl mb-8">
        <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4 border-b border-slate-100 pb-6 mb-6 sm:mb-8">
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap gap-1.5 items-center">
              <span className="text-[9px] sm:text-[10px] font-black tracking-widest text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md uppercase">
                {savingProgress ? 'Archiving Score Record...' : 'Performance Evaluation Analysis'}
              </span>
              {siblingAttempts.length > 1 && (
                <span className="text-[9px] sm:text-[10px] font-black tracking-widest text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md uppercase">
                  Attempt {siblingAttempts.length - siblingAttempts.findIndex(x => x._id === currentAnalysisRecord._id)} of {siblingAttempts.length}
                </span>
              )}
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 mt-2 tracking-tight break-words">{activeTest.title}</h2>

            {siblingAttempts.length > 1 && (
              <div className="mt-3 flex flex-col sm:flex-row sm:items-center gap-2">
                <label className="text-xs font-bold text-slate-500 whitespace-nowrap">Switch History View:</label>
                <select
                  value={currentAnalysisRecord._id}
                  onChange={(e) => {
                    const target = siblingAttempts.find(a => a._id === e.target.value);
                    if (target) onSelectAttempt(target);
                  }}
                  className="w-full sm:w-auto text-xs font-bold bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-700 outline-none focus:ring-1 focus:ring-blue-500"
                >
                  {siblingAttempts.map((att, index) => (
                    <option key={att._id} value={att._id}>
                      Attempt #{siblingAttempts.length - index} ({new Date(att.attemptedAt).toLocaleDateString()}) — Marks: {att.totalMarks}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>

          <div className="flex gap-2 w-full md:w-auto flex-wrap sm:flex-nowrap">
            <button
              onClick={onStartReattempt}
              className="flex-1 md:flex-none px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl transition-all shadow-sm whitespace-nowrap text-center"
            >
              Start Reattempt
            </button>
            <button
              onClick={onExitDashboard}
              className="flex-1 md:flex-none px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-all text-center whitespace-nowrap"
            >
              Exit Dashboard
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mb-8 sm:mb-10">
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 text-center">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-wide">Final Marks Earned</p>
            <h3 className="text-xl sm:text-2xl font-black mt-1 text-slate-900">
              {currentAnalysisRecord.totalMarks} <span className="text-xs text-slate-400 font-normal">/ {currentAnalysisRecord.maxPossibleMarks}</span>
            </h3>
          </div>
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 text-center">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-wide">Accuracy Rating</p>
            <h3 className="text-xl sm:text-2xl font-black text-blue-600 mt-1">
              {currentAnalysisRecord.attemptedCount > 0 ? Math.round((currentAnalysisRecord.correctAnswers / currentAnalysisRecord.attemptedCount) * 100) : 0}%
            </h3>
          </div>
          <div className="bg-emerald-50/60 p-4 rounded-xl border border-emerald-100 text-center">
            <p className="text-[10px] font-black text-emerald-600 uppercase tracking-wide">Correct Validations</p>
            <h3 className="text-xl sm:text-2xl font-black text-emerald-700 mt-1">✓ {currentAnalysisRecord.correctAnswers}</h3>
          </div>
          <div className="bg-rose-50/60 p-4 rounded-xl border border-rose-100 text-center">
            <p className="text-[10px] font-black text-rose-600 uppercase tracking-wide">Incorrect Validations</p>
            <h3 className="text-xl sm:text-2xl font-black text-rose-700 mt-1">✗ {currentAnalysisRecord.wrongAnswers}</h3>
          </div>
        </div>

        <div className="space-y-4 sm:space-y-6">
          {activeTest.questions.map((q, idx) => {
            const currentId = q._id || String(idx);
            const userChosenIdx = safeSnapshot[currentId];
            const isUnattempted = userChosenIdx === undefined;
            const isCorrect = !isUnattempted && userChosenIdx === q.correctOptionIndex;

            return (
              <div key={currentId} className={`p-4 sm:p-5 rounded-2xl border ${isUnattempted ? 'border-slate-200 bg-slate-50/40' : isCorrect ? 'border-emerald-200 bg-emerald-50/10' : 'border-rose-200 bg-rose-50/10'}`}>
                <div className="flex justify-between items-center mb-2.5 gap-2">
                  <span className="text-[11px] font-bold text-slate-400 truncate">Sequence Array Key {idx + 1}</span>
                  <span className={`text-[9px] font-black px-2 py-0.5 rounded uppercase flex-shrink-0 ${isUnattempted ? 'bg-slate-100 text-slate-500' : isCorrect ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>
                    {isUnattempted ? 'Skipped' : isCorrect ? 'Correct' : 'Incorrect'}
                  </span>
                </div>
                {q.imageUrl ? (
                  <div className="mb-4 flex justify-center">
                    <img src={q.imageUrl} alt={`Question ${idx + 1} visual`} className="w-full max-w-2xl object-contain rounded-xl border border-slate-200 shadow-sm bg-slate-50" />
                  </div>
                ) : null}

                <p className="text-xs sm:text-sm font-bold text-slate-800 mb-4 whitespace-pre-wrap">
                  {q.questionText || (q.topic ? `Topic: ${q.topic}` : 'No text prompt provided for this question.')}
                </p>
                <div className="grid grid-cols-1 gap-2">
                  {q.options.map((opt, optIdx) => {
                    const wasSelected = userChosenIdx === optIdx;
                    const isOptionCorrect = q.correctOptionIndex === optIdx;
                    let rowStyle = 'border-slate-200 text-slate-600 bg-white';
                    if (isOptionCorrect) rowStyle = 'border-emerald-500 bg-emerald-50 text-emerald-900 font-bold';
                    else if (wasSelected) rowStyle = 'border-rose-400 bg-rose-50 text-rose-900';

                    return (
                      <div key={optIdx} className={`p-3 text-[11px] sm:text-xs rounded-xl border flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1.5 ${rowStyle}`}>
                        <span className="break-words">{opt}</span>
                        <span className="text-[9px] font-black uppercase tracking-wider self-start sm:self-auto flex-shrink-0">
                          {isOptionCorrect && '✓ Master Verification Key'}
                          {wasSelected && !isOptionCorrect && '✗ Your Answer'}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
