import type { QuestionStatus, TestSchema } from './types';
import { QuestionStatusBadge } from './QuestionStatusBadge';

interface TestTakingViewProps {
  activeTest: TestSchema;
  currentIdx: number;
  selectedAnswers: Record<string, number>;
  questionStatuses: Record<string, QuestionStatus>;
  timeLeft: number;
  sessionEmail?: string | null;
  lastQuestionNotice: boolean;
  mobilePaletteOpen: boolean;
  onSelectAnswer: (questionId: string, optionIndex: number) => void;
  onSaveAndNext: () => void;
  onMarkForReviewAndNext: () => void;
  onClearResponse: () => void;
  onGoToQuestion: (index: number) => void;
  onTogglePalette: (open: boolean) => void;
  onSubmit: () => void;
  formatClockTime: (secs: number) => string;
}

export function TestTakingView({
  activeTest,
  currentIdx,
  selectedAnswers,
  questionStatuses,
  timeLeft,
  sessionEmail,
  lastQuestionNotice,
  mobilePaletteOpen,
  onSelectAnswer,
  onSaveAndNext,
  onMarkForReviewAndNext,
  onClearResponse,
  onGoToQuestion,
  onTogglePalette,
  onSubmit,
  formatClockTime,
}: TestTakingViewProps) {
  const activeQuestion = activeTest.questions[currentIdx];
  const qId = activeQuestion._id || String(currentIdx);
  const totalCount = activeTest.questions.length;
  const counts = { ANSWERED: 0, NOT_ANSWERED: 0, MARKED_FOR_REVIEW: 0, ANSWERED_AND_MARKED: 0, NOT_VISITED: 0 } as Record<QuestionStatus, number>;

  activeTest.questions.forEach((q, i) => {
    const id = q._id || String(i);
    const status = questionStatuses[id] || 'NOT_VISITED';
    counts[status]++;
  });

  return (
    <div className="fixed inset-0 z-[9999] bg-slate-50 text-slate-900 flex flex-col justify-between w-screen h-screen overflow-hidden select-none">
      <div className="bg-gradient-to-r from-blue-900 to-indigo-950 border-b border-slate-700 text-white px-4 sm:px-6 py-3 flex justify-between items-center shadow-md">
        <div className="min-w-0 flex-1 pr-2">
          <h1 className="font-extrabold text-[10px] sm:text-sm uppercase tracking-wider text-slate-200 truncate">NTA Assessment Frame</h1>
          <h2 className="font-black text-sm sm:text-base text-white tracking-tight truncate max-w-xl">{activeTest.title}</h2>
        </div>
        <div className="flex items-center gap-2 sm:gap-4 flex-shrink-0">
          <div className="bg-slate-950/60 border border-slate-700/80 px-2.5 py-1 sm:px-4 sm:py-2 rounded-xl text-right">
            <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest hidden sm:block">Time Remaining</p>
            <p className="font-mono text-sm sm:text-lg font-black text-amber-400 tracking-wider">{formatClockTime(timeLeft)}</p>
          </div>
          <button
            onClick={() => { if (confirm('Confirmation: Finalize and submit examination package for score processing?')) onSubmit(); }}
            className="ml-1 px-3 py-2 bg-red-600 hover:bg-red-700 text-white text-xs sm:text-sm font-bold rounded-lg"
          >
            Submit
          </button>
        </div>
      </div>

      <div className="lg:hidden bg-white border-b border-slate-200 p-2 overflow-x-auto">
        <div className="flex gap-2">
          {activeTest.questions.map((q, i) => {
            const id = q._id || String(i);
            const isSelected = i === currentIdx;
            const status = questionStatuses[id] || 'NOT_VISITED';
            return (
              <button
                key={id}
                onClick={() => onGoToQuestion(i)}
                className={`flex-shrink-0 rounded-lg p-0.5 transition-all ${isSelected ? 'ring-2 ring-blue-600 ring-offset-1' : ''}`}
              >
                <QuestionStatusBadge status={status} indexLabel={i + 1} />
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden w-full relative bg-slate-200">
        <div className="flex-1 flex flex-col bg-white w-full h-full overflow-hidden min-h-0">
          <div className="flex-1 overflow-y-auto min-h-0 overscroll-contain">
            <div className="p-4 sm:p-6 md:p-10 max-w-4xl w-full mx-auto pb-28 sm:pb-24">
              {lastQuestionNotice && (
                <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50">
                  <div className="px-4 py-2 bg-yellow-50 border border-yellow-200 text-yellow-800 rounded-lg shadow">This is the last question.</div>
                </div>
              )}

              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center border-b border-slate-200 pb-3 mb-4 sm:mb-6 gap-2">
                <span className="text-[10px] sm:text-xs font-black bg-blue-50 text-blue-800 border border-blue-200 px-2.5 py-1 rounded-lg uppercase tracking-wide self-start">
                  Section: {activeQuestion.subject || 'General Pattern'}
                </span>
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
                {activeQuestion.options.map((opt, i) => {
                  const isChosen = selectedAnswers[qId] === i;
                  return (
                    <button
                      key={i}
                      onClick={() => onSelectAnswer(qId, i)}
                      className={`w-full p-3.5 sm:p-4 text-left text-xs sm:text-sm font-semibold rounded-xl border transition-all flex items-center gap-3 sm:gap-4 ${isChosen
                        ? 'border-blue-600 bg-blue-50 text-blue-900 ring-1 ring-blue-600 shadow-sm'
                        : 'border-slate-200 bg-slate-50/50 hover:bg-slate-100 text-slate-700'}`}
                    >
                      <span className={`w-5 h-5 sm:w-6 sm:h-6 rounded-full flex-shrink-0 flex items-center justify-center text-xs font-black transition-colors ${isChosen ? 'bg-blue-600 text-white' : 'bg-slate-200 text-slate-500'}`}>
                        {String.fromCharCode(65 + i)}
                      </span>
                      <span className="break-words w-full">{opt}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="sticky bottom-0 z-20 shrink-0 w-full bg-slate-100/95 border-t border-slate-200 p-3 sm:px-6 sm:py-4 flex flex-col sm:flex-row gap-3 justify-between items-center shadow-inner backdrop-blur-sm pb-[calc(0.75rem+env(safe-area-inset-bottom))] sm:pb-4">
            <div className="sticky flex gap-2 w-full sm:w-auto">
              <button
                onClick={onMarkForReviewAndNext}
                className="flex-1 sm:flex-none text-center px-3 sm:px-4 py-2.5 bg-indigo-50 border border-indigo-200 text-indigo-700 text-[11px] sm:text-xs font-bold rounded-lg hover:bg-indigo-100 transition-colors whitespace-nowrap"
              >
                Review & Next
              </button>
              <button
                onClick={onClearResponse}
                className="flex-1 sm:flex-none text-center px-3 sm:px-4 py-2.5 bg-white border border-slate-300 text-slate-700 text-[11px] sm:text-xs font-bold rounded-lg hover:bg-slate-50 transition-colors"
              >
                Clear Response
              </button>
            </div>

            <div className="sticky flex gap-2 w-full sm:w-auto">
              <button
                disabled={currentIdx === 0}
                onClick={() => onGoToQuestion(currentIdx - 1)}
                className="flex-1 sm:flex-none text-center px-4 py-2.5 bg-white border border-slate-300 text-slate-700 text-[11px] sm:text-xs font-bold rounded-lg hover:bg-slate-50 disabled:opacity-30 disabled:pointer-events-none transition-colors"
              >
                Back
              </button>
              <button
                onClick={onSaveAndNext}
                className="flex-[2] sm:flex-none text-center px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] sm:text-xs font-black tracking-wide rounded-lg transition-all shadow-sm"
              >
                Save & Next
              </button>
            </div>
          </div>
        </div>

        <div className={`
          absolute lg:relative top-0 bottom-0 right-0 z-50 lg:z-0
          w-72 sm:w-80 border-l border-slate-300 bg-slate-50 flex flex-col justify-between
          transform transition-transform duration-300 ease-in-out h-full
          ${mobilePaletteOpen ? 'translate-x-0' : 'translate-x-full lg:translate-x-0'}
        `}>
          <div className="p-4 flex-1 overflow-y-auto">
            <div className="bg-white p-3 border border-slate-200 rounded-xl mb-4 flex items-center gap-3 shadow-sm">
              <div className="w-8 h-8 rounded-full bg-slate-200 flex-shrink-0 flex items-center justify-center text-slate-600 font-black text-xs">EX</div>
              <div className="min-w-0">
                <p className="text-[9px] uppercase font-black text-slate-400 tracking-wider">Candidate Context</p>
                <p className="text-xs font-bold text-slate-800 truncate max-w-[180px]">{sessionEmail || 'Guest Instance'}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 text-[10px] font-bold text-slate-600 bg-white p-3 border border-slate-200 rounded-xl mb-4 shadow-sm">
              <div className="flex items-center gap-1.5"><QuestionStatusBadge status="ANSWERED" indexLabel={counts.ANSWERED} /> <span className="truncate">Answered</span></div>
              <div className="flex items-center gap-1.5"><QuestionStatusBadge status="NOT_ANSWERED" indexLabel={counts.NOT_ANSWERED} /> <span className="truncate">Not Answered</span></div>
              <div className="flex items-center gap-1.5"><QuestionStatusBadge status="MARKED_FOR_REVIEW" indexLabel={counts.MARKED_FOR_REVIEW} /> <span className="truncate">For Review</span></div>
              <div className="flex items-center gap-1.5"><QuestionStatusBadge status="ANSWERED_AND_MARKED" indexLabel={counts.ANSWERED_AND_MARKED} /> <span className="truncate">Marked & Ans</span></div>
              <div className="flex items-center gap-1.5 col-span-2 border-t border-slate-100 pt-2 mt-1"><QuestionStatusBadge status="NOT_VISITED" indexLabel={counts.NOT_VISITED} /> <span className="ml-1">Not Visited</span></div>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl p-3 shadow-sm">
              <p className="text-[9px] uppercase font-black tracking-widest text-slate-400 mb-3 border-b border-slate-100 pb-1.5">Question Palette Array</p>
              <div className="grid grid-cols-4 gap-2">
                {activeTest.questions.map((q, i) => {
                  const currentId = q._id || String(i);
                  const status = questionStatuses[currentId] || 'NOT_VISITED';
                  const isSelected = i === currentIdx;

                  return (
                    <button
                      key={currentId}
                      onClick={() => {
                        onGoToQuestion(i);
                        onTogglePalette(false);
                      }}
                      className={`transition-transform active:scale-95 focus:outline-none flex items-center justify-center ${isSelected ? 'ring-2 ring-blue-600 ring-offset-1 rounded-lg' : ''}`}
                    >
                      <QuestionStatusBadge status={status} indexLabel={i + 1} />
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="p-4 bg-slate-100 border-t border-slate-200 w-full">
            <button
              onClick={() => { if (confirm('Confirmation: Finalize and submit examination package for score processing?')) onSubmit(); }}
              className="w-full text-xs font-black text-white bg-red-600 hover:bg-red-700 py-3 rounded-xl transition-all shadow-md tracking-wider uppercase"
            >
              Submit Examination Paper
            </button>
          </div>
        </div>

        {mobilePaletteOpen && (
          <div
            onClick={() => onTogglePalette(false)}
            className="lg:hidden fixed inset-0 bg-black/40 z-40"
          />
        )}
      </div>
    </div>
  );
}
