import type { AttemptHistoryRecord, TestSchema } from './types';

interface TestCardProps {
  test: TestSchema;
  pastAttempts: AttemptHistoryRecord[];
  latestAttempt?: AttemptHistoryRecord;
  onViewAnalysis: (attempt: AttemptHistoryRecord) => void;
  onStartTest: (test: TestSchema) => void;
  onReattempt: (test: TestSchema) => void;
}

export function TestCard({ test, pastAttempts, latestAttempt, onViewAnalysis, onStartTest, onReattempt }: TestCardProps) {
  const isAttempted = pastAttempts.length > 0;

  return (
    <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between items-start hover:shadow-md transition-shadow relative overflow-hidden">
      {isAttempted && (
        <div className="absolute top-0 right-0 bg-emerald-600 text-white px-3 py-1 rounded-bl-xl text-[9px] font-black tracking-wide uppercase shadow-sm">
          Evaluated Asset ({pastAttempts.length}x)
        </div>
      )}

      <div className="w-full">
        <h3 className="text-sm sm:text-base font-black text-slate-900 tracking-tight mb-2 pr-24 line-clamp-2">{test.title}</h3>
        <div className="flex flex-wrap gap-x-4 gap-y-1 text-[11px] sm:text-xs font-bold text-slate-400 mb-4">
          <span>Duration: {test.duration} Min</span>
          <span>Elements: {test.questions?.length || 0} Questions</span>
        </div>

        {isAttempted && latestAttempt && (
          <div className="mb-4 bg-slate-50 border border-slate-100 p-2.5 rounded-xl text-[10px] sm:text-[11px] flex justify-between items-center text-slate-600 gap-2">
            <span className="truncate">Latest Run Score: <strong className="text-slate-900 font-extrabold">{latestAttempt.totalMarks}</strong>/{latestAttempt.maxPossibleMarks}</span>
            <span className="text-blue-600 font-bold flex-shrink-0">Accuracy: {latestAttempt.attemptedCount > 0 ? Math.round((latestAttempt.correctAnswers / latestAttempt.attemptedCount) * 100) : 0}%</span>
          </div>
        )}
      </div>

      {isAttempted ? (
        <div className="flex gap-2 w-full mt-2">
          <button
            onClick={() => onViewAnalysis(latestAttempt!)}
            className="flex-1 py-2.5 bg-blue-50 hover:bg-blue-100 text-blue-700 text-[11px] sm:text-xs font-black uppercase tracking-wider rounded-xl transition-all text-center truncate px-2"
          >
            Metrics Profile
          </button>
          <button
            onClick={() => onReattempt(test)}
            className="py-2.5 px-3 sm:px-4 bg-slate-900 hover:bg-slate-800 text-white text-[11px] sm:text-xs font-bold uppercase rounded-xl transition-all text-center flex-shrink-0"
          >
            Reattempt
          </button>
        </div>
      ) : (
        <button
          onClick={() => onStartTest(test)}
          className="w-full mt-2 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-[11px] sm:text-xs font-black uppercase tracking-wider rounded-xl transition-all text-center"
        >
          Launch Assessment Core Module
        </button>
      )}
    </div>
  );
}
