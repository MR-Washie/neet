


'use client';
import { useState, useEffect, useRef } from 'react';
import { SessionProvider, useSession } from 'next-auth/react';

interface QuestionSchema {
  _id?: string;
  id?: number;
  questionText?: string;
  imageUrl: string;
  options: string[];
  correctOptionIndex: number;
  subject: string;
  topic?: string;
}

interface TestSchema {
  _id: string;
  title: string;
  duration: number; 
  questions: QuestionSchema[];
}

interface AttemptHistoryRecord {
  _id: string;
  testId: string;
  testTitle: string;
  totalMarks: number;
  maxPossibleMarks: number;
  correctAnswers: number;
  wrongAnswers: number;
  attemptedCount: number;
  selectedAnswersSnapshot: Record<string, number>;
  attemptedAt: string;
}

type QuestionStatus = 'NOT_VISITED' | 'NOT_ANSWERED' | 'ANSWERED' | 'MARKED_FOR_REVIEW' | 'ANSWERED_AND_MARKED';

function StudentTestsMarketplaceContent() {
  const { data: session } = useSession();
  
  const [tests, setTests] = useState<TestSchema[]>([]);
  const [history, setHistory] = useState<AttemptHistoryRecord[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [activeTest, setActiveTest] = useState<TestSchema | null>(null);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, number>>({});
  const [questionStatuses, setQuestionStatuses] = useState<Record<string, QuestionStatus>>({});
  const [timeLeft, setTimeLeft] = useState<number>(0);
  
  // Mobile responsive layout optimization state
  const [mobilePaletteOpen, setMobilePaletteOpen] = useState<boolean>(false);
  const [lastQuestionNotice, setLastQuestionNotice] = useState<boolean>(false);
  
  const [confirmationModal, setConfirmationModal] = useState<{ isOpen: boolean; testObj: TestSchema | null; isReattempt: boolean }>({
    isOpen: false,
    testObj: null,
    isReattempt: false
  });
  
  const examDeadlineRef = useRef<number | null>(null);
  const [showAnalysis, setShowAnalysis] = useState<boolean>(false);
  const [currentAnalysisRecord, setCurrentAnalysisRecord] = useState<AttemptHistoryRecord | null>(null);
  const [savingProgress, setSavingProgress] = useState(false);

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const stateRef = useRef({ selectedAnswers, activeTest, showAnalysis, questionStatuses });
  
  useEffect(() => {
    stateRef.current = { selectedAnswers, activeTest, showAnalysis, questionStatuses };
  }, [selectedAnswers, activeTest, showAnalysis, questionStatuses]);

  const loadEntireDashboardMatrix = async () => {
    try {
      setLoading(true);
      const testRes = await fetch('/api/tests');
      const testData = testRes.ok ? await testRes.json() : [];
      setTests(testData);

      if (session) {
        const historyRes = await fetch('/api/attempts');
        const historyData = historyRes.ok ? await historyRes.json() : [];
        setHistory(historyData);
      }
    } catch (err) {
      console.error('System pipeline integration tracking anomaly:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEntireDashboardMatrix();
  }, [session]);

  useEffect(() => {
    if (activeTest && !showAnalysis) {
      const qId = activeTest.questions[currentIdx]?._id || String(currentIdx);
      setQuestionStatuses((prev) => {
        const currentStatus = prev[qId];
        if (!currentStatus || currentStatus === 'NOT_VISITED') {
          return { ...prev, [qId]: 'NOT_ANSWERED' };
        }
        return prev;
      });
    }
  }, [currentIdx, activeTest, showAnalysis]);

  useEffect(() => {
    const isTestRunning = activeTest && !showAnalysis;
    if (!isTestRunning) return;

    const handleBeforeUnloadLock = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = "Warning: Active proctored examination lock configuration engaged.";
      return e.returnValue;
    };

    window.history.pushState(null, '', window.location.href);
    const handlePopStateLock = () => {
      window.history.pushState(null, '', window.location.href);
      alert("Security Restraint: Navigation via browser operational interface buttons is disabled during an active assessment.");
    };

    const handleVisibilitySwitchLock = () => {
      if (document.visibilityState === 'hidden' && stateRef.current.activeTest && !stateRef.current.showAnalysis) {
        alert("Proctor Alert: Application window defocus event detected. The examination has been automatically finalized and submitted.");
        compileAndSavePayloadCloud();
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnloadLock);
    window.addEventListener('popstate', handlePopStateLock);
    document.addEventListener('visibilitychange', handleVisibilitySwitchLock);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnloadLock);
      window.removeEventListener('popstate', handlePopStateLock);
      document.removeEventListener('visibilitychange', handleVisibilitySwitchLock);
    };
  }, [activeTest, showAnalysis]);

  useEffect(() => {
    if (activeTest && examDeadlineRef.current && !showAnalysis) {
      timerRef.current = setInterval(() => {
        const now = Date.now();
        const distance = examDeadlineRef.current! - now;
        const secondsRemaining = Math.max(0, Math.floor(distance / 1000));

        if (secondsRemaining <= 0) {
          clearInterval(timerRef.current!);
          setTimeLeft(0);
          setTimeout(() => compileAndSavePayloadCloud(), 100);
        } else {
          setTimeLeft(secondsRemaining);
        }
      }, 1000);
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [activeTest, showAnalysis]);

  const initiateFreshExamEngine = (testObj: TestSchema) => {
    setShowAnalysis(false);
    setCurrentAnalysisRecord(null);
    setSelectedAnswers({});
    setCurrentIdx(0);
    setMobilePaletteOpen(false);
    
    const initialStatuses: Record<string, QuestionStatus> = {};
    testObj.questions.forEach((q, i) => {
      const id = q._id || String(i);
      initialStatuses[id] = 'NOT_VISITED';
    });
    const firstId = testObj.questions[0]?._id || '0';
    initialStatuses[firstId] = 'NOT_ANSWERED';
    
    setQuestionStatuses(initialStatuses);
    setActiveTest(testObj);
    setConfirmationModal({ isOpen: false, testObj: null, isReattempt: false });
    
    const databaseDurationInMinutes = testObj.duration && testObj.duration > 0 ? testObj.duration : 180;
    const durationInSeconds = databaseDurationInMinutes * 60;
    
    examDeadlineRef.current = Date.now() + durationInSeconds * 1000;
    setTimeLeft(durationInSeconds);

    window.history.pushState(null, '', window.location.href);
  };

  const compileAndSavePayloadCloud = async () => {
    const currentActiveTest = stateRef.current.activeTest;
    const currentSelectedAnswers = stateRef.current.selectedAnswers || {};

    if (!currentActiveTest) return;
    if (timerRef.current) clearInterval(timerRef.current);

    setSavingProgress(true);
    let correct = 0;
    let wrong = 0;
    let attemptedCount = 0;

    currentActiveTest.questions.forEach((q, index) => {
      const tId = q._id || String(index);
      const chosen = currentSelectedAnswers[tId];
      if (chosen !== undefined) {
        attemptedCount++;
        if (chosen === q.correctOptionIndex) correct++;
        else wrong++;
      }
    });

    const totalMarks = (correct * 4) - (wrong * 1);
    const maxPossibleMarks = currentActiveTest.questions.length * 4;

    const reportData = {
      testId: currentActiveTest._id,
      testTitle: currentActiveTest.title,
      totalMarks,
      maxPossibleMarks,
      correctAnswers: correct,
      wrongAnswers: wrong,
      attemptedCount,
      selectedAnswersSnapshot: currentSelectedAnswers
    };

    const mockRecord: AttemptHistoryRecord = {
      _id: 'temp_' + Date.now(),
      ...reportData,
      attemptedAt: new Date().toISOString()
    };
    setCurrentAnalysisRecord(mockRecord);
    setShowAnalysis(true);

    try {
      await fetch('/api/attempts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(reportData)
      });
      
      const historyRes = await fetch('/api/attempts');
      if (historyRes.ok) {
        const detailedHistory: AttemptHistoryRecord[] = await historyRes.json();
        setHistory(detailedHistory);
        const newlySaved = detailedHistory.find(h => h.testId === currentActiveTest._id);
        if (newlySaved) setCurrentAnalysisRecord(newlySaved);
      }
    } catch (e) {
      console.error('Data pipeline error:', e);
    } finally {
      setSavingProgress(false);
    }
  };

  const handleSaveAndNext = () => {
    if (!activeTest) return;
    const qId = activeTest.questions[currentIdx]?._id || String(currentIdx);
    
    setQuestionStatuses((prev) => ({
      ...prev,
      [qId]: selectedAnswers[qId] !== undefined ? 'ANSWERED' : 'NOT_ANSWERED'
    }));

    // If this is the last question, show a toast notice instead of advancing
    if (currentIdx < activeTest.questions.length - 1) {
      setCurrentIdx(currentIdx + 1);
      setLastQuestionNotice(false);
    } else {
      setLastQuestionNotice(true);
      // auto-hide after 3 seconds
      setTimeout(() => setLastQuestionNotice(false), 3000);
    }
  };

  const handleMarkForReviewAndNext = () => {
    if (!activeTest) return;
    const qId = activeTest.questions[currentIdx]?._id || String(currentIdx);
    const hasAnswer = selectedAnswers[qId] !== undefined;

    setQuestionStatuses((prev) => ({
      ...prev,
      [qId]: hasAnswer ? 'ANSWERED_AND_MARKED' : 'MARKED_FOR_REVIEW'
    }));

    if (currentIdx < activeTest.questions.length - 1) {
      setCurrentIdx(currentIdx + 1);
    }
  };

  const handleClearResponse = () => {
    if (!activeTest) return;
    const qId = activeTest.questions[currentIdx]?._id || String(currentIdx);
    
    setSelectedAnswers((prev) => {
      const updated = { ...prev };
      delete updated[qId];
      return updated;
    });

    setQuestionStatuses((prev) => ({
      ...prev,
      [qId]: 'NOT_ANSWERED'
    }));
  };

  const inspectLegacyAnalysisNode = (historyNode: AttemptHistoryRecord) => {
    const matchedOriginalTest = tests.find(t => t._id === historyNode.testId);
    if (!matchedOriginalTest) {
      alert("The original examination record selected is currently missing from the remote endpoint profile registry.");
      return;
    }
    setActiveTest(matchedOriginalTest);
    setSelectedAnswers(historyNode.selectedAnswersSnapshot || {});
    setCurrentAnalysisRecord(historyNode);
    setShowAnalysis(true);
  };

  const formatClockTime = (secs: number) => {
    const hours = Math.floor(secs / 3600);
    const minutes = Math.floor((secs % 3600) / 60);
    const seconds = secs % 60;
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  };

  const getAttemptsForTest = (testId: string) => {
    return history
      .filter((h) => h.testId === testId)
      .sort((a, b) => new Date(b.attemptedAt).getTime() - new Date(a.attemptedAt).getTime());
  };

  const renderNtaBadgeSymbol = (status: QuestionStatus, indexLabel: number | string) => {
    switch (status) {
      case 'ANSWERED':
        return (
          <div className="w-9 h-8 sm:w-10 sm:h-9 bg-emerald-600 text-white font-bold text-xs flex items-center justify-center relative rounded-t-md rounded-b-md shadow-sm">
            {indexLabel}
          </div>
        );
      case 'NOT_ANSWERED':
        return (
          <div className="w-9 h-8 sm:w-10 sm:h-9 bg-red-500 text-white font-bold text-xs flex items-center justify-center relative rounded-t-xl rounded-b-xl shadow-sm">
            {indexLabel}
          </div>
        );
      case 'MARKED_FOR_REVIEW':
        return (
          <div className="w-9 h-9 sm:w-10 sm:h-10 bg-indigo-600 text-white font-bold text-xs flex items-center justify-center rounded-full shadow-sm">
            {indexLabel}
          </div>
        );
      case 'ANSWERED_AND_MARKED':
        return (
          <div className="w-9 h-9 sm:w-10 sm:h-10 bg-indigo-600 text-white font-bold text-xs flex items-center justify-center rounded-full relative shadow-sm">
            {indexLabel}
            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 sm:w-3 sm:h-3 bg-emerald-500 rounded-full border-2 border-slate-900"></span>
          </div>
        );
      case 'NOT_VISITED':
      default:
        return (
          <div className="w-9 h-8 sm:w-10 sm:h-9 bg-slate-100 text-slate-700 border border-slate-300 font-bold text-xs flex items-center justify-center rounded shadow-sm">
            {indexLabel}
          </div>
        );
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3 px-4 text-center">
        <div className="w-10 h-10 border-4 border-slate-200 border-t-blue-600 rounded-full animate-spin"></div>
        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Synchronizing secure connection profiles...</p>
      </div>
    );
  }

  // ==========================================
  // VIEW CONTEXT 1: OFFICIAL SECURE NTA LOCKDOWN MODE (FULL RESPONSIVE CODES)
  // ==========================================
  if (activeTest && !showAnalysis) {
    const activeQuestion = activeTest.questions[currentIdx];
    const qId = activeQuestion._id || String(currentIdx);

    const totalCount = activeTest.questions.length;
    let counts = { ANSWERED: 0, NOT_ANSWERED: 0, MARKED_FOR_REVIEW: 0, ANSWERED_AND_MARKED: 0, NOT_VISITED: 0 };
    activeTest.questions.forEach((q, i) => {
      const id = q._id || String(i);
      const status = questionStatuses[id] || 'NOT_VISITED';
      counts[status]++;
    });

    return (
      <div className="fixed inset-0 z-[9999] bg-slate-50 text-slate-900 flex flex-col justify-between w-screen h-screen overflow-hidden select-none">
        
        {/* Responsive Header Grid */}
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
              onClick={() => { if(confirm("Confirmation: Finalize and submit examination package for score processing?")) compileAndSavePayloadCloud(); }}
              className="ml-1 px-3 py-2 bg-red-600 hover:bg-red-700 text-white text-xs sm:text-sm font-bold rounded-lg"
            >
              Submit
            </button>
          </div>
        </div>

        {/* Mobile horizontal question palette (shows above content on small screens) */}
        <div className="lg:hidden bg-white border-b border-slate-200 p-2 overflow-x-auto">
          <div className="flex gap-2">
            {activeTest.questions.map((q, i) => {
              const id = q._id || String(i);
              const status = questionStatuses[id] || 'NOT_VISITED';
              const isSelected = i === currentIdx;
              return (
                <button
                  key={id}
                  onClick={() => { setCurrentIdx(i); }}
                  className={`min-w-[44px] h-10 flex items-center justify-center px-3 rounded-lg text-xs font-bold ${isSelected ? 'ring-2 ring-blue-600' : 'bg-slate-50 border border-slate-100'}`}>
                  {i + 1}
                </button>
              )
            })}
          </div>
        </div>

        {/* Responsive Core Flex Row Layout */}
        <div className="flex-1 flex overflow-hidden w-full relative bg-slate-200">
          
          {/* Main Body Column Pane */}
          <div className="flex-1 flex flex-col bg-white w-full h-full overflow-hidden">
            <div className="flex-1 overflow-y-auto">
              <div className="p-4 sm:p-6 md:p-10 max-w-4xl w-full mx-auto">
                {/* Toast for last question notice */}
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
                        onClick={() => setSelectedAnswers({ ...selectedAnswers, [qId]: i })}
                        className={`w-full p-3.5 sm:p-4 text-left text-xs sm:text-sm font-semibold rounded-xl border transition-all flex items-center gap-3 sm:gap-4 ${
                          isChosen 
                            ? 'border-blue-600 bg-blue-50 text-blue-900 ring-1 ring-blue-600 shadow-sm' 
                            : 'border-slate-200 bg-slate-50/50 hover:bg-slate-100 text-slate-700'
                        }`}
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

            {/* Responsive Actions Navigation Footer */}
            <div className="sticky bottom-0 z-20 shrink-0 bg-slate-100/95 border-t border-slate-200 p-3 sm:px-6 sm:py-4 flex flex-col sm:flex-row gap-3 justify-between items-center shadow-inner backdrop-blur-sm">
              <div className="flex gap-2 w-full sm:w-auto">
                <button
                  onClick={handleMarkForReviewAndNext}
                  className="flex-1 sm:flex-none text-center px-3 sm:px-4 py-2.5 bg-indigo-50 border border-indigo-200 text-indigo-700 text-[11px] sm:text-xs font-bold rounded-lg hover:bg-indigo-100 transition-colors whitespace-nowrap"
                >
                  Review & Next
                </button>
                <button
                  onClick={handleClearResponse}
                  className="flex-1 sm:flex-none text-center px-3 sm:px-4 py-2.5 bg-white border border-slate-300 text-slate-700 text-[11px] sm:text-xs font-bold rounded-lg hover:bg-slate-50 transition-colors"
                >
                  Clear Response
                </button>
              </div>

              <div className="flex gap-2 w-full sm:w-auto">
                <button
                  disabled={currentIdx === 0}
                  onClick={() => setCurrentIdx(currentIdx - 1)}
                  className="flex-1 sm:flex-none text-center px-4 py-2.5 bg-white border border-slate-300 text-slate-700 text-[11px] sm:text-xs font-bold rounded-lg hover:bg-slate-50 disabled:opacity-30 disabled:pointer-events-none transition-colors"
                >
                  Back
                </button>
                <button
                  onClick={handleSaveAndNext}
                  className="flex-[2] sm:flex-none text-center px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] sm:text-xs font-black tracking-wide rounded-lg transition-all shadow-sm"
                >
                  Save & Next
                </button>
              </div>
            </div>
          </div>

          {/* Sidebar Navigation Panel: Dynamic Drawer for Mobile, Permanent Column for Large Screens */}
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
                  <p className="text-xs font-bold text-slate-800 truncate max-w-[180px]">{session?.user?.email || 'Guest Instance'}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 text-[10px] font-bold text-slate-600 bg-white p-3 border border-slate-200 rounded-xl mb-4 shadow-sm">
                <div className="flex items-center gap-1.5">{renderNtaBadgeSymbol('ANSWERED', counts.ANSWERED)} <span className="truncate">Answered</span></div>
                <div className="flex items-center gap-1.5">{renderNtaBadgeSymbol('NOT_ANSWERED', counts.NOT_ANSWERED)} <span className="truncate">Not Answered</span></div>
                <div className="flex items-center gap-1.5">{renderNtaBadgeSymbol('MARKED_FOR_REVIEW', counts.MARKED_FOR_REVIEW)} <span className="truncate">For Review</span></div>
                <div className="flex items-center gap-1.5">{renderNtaBadgeSymbol('ANSWERED_AND_MARKED', counts.ANSWERED_AND_MARKED)} <span className="truncate">Marked & Ans</span></div>
                <div className="flex items-center gap-1.5 col-span-2 border-t border-slate-100 pt-2 mt-1">{renderNtaBadgeSymbol('NOT_VISITED', counts.NOT_VISITED)} <span className="ml-1">Not Visited</span></div>
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
                          setCurrentIdx(i);
                          setMobilePaletteOpen(false); // Close drawer on mobile click interaction
                        }}
                        className={`transition-transform active:scale-95 focus:outline-none flex items-center justify-center ${isSelected ? 'ring-2 ring-blue-600 ring-offset-1 rounded-lg' : ''}`}
                      >
                        {renderNtaBadgeSymbol(status, i + 1)}
                      </button>
                    );
                  })}
                </div>
              </div>

            </div>

            <div className="p-4 bg-slate-100 border-t border-slate-200 w-full">
              <button 
                onClick={() => { if(confirm("Confirmation: Finalize and submit examination package for score processing?")) compileAndSavePayloadCloud(); }}
                className="w-full text-xs font-black text-white bg-red-600 hover:bg-red-700 py-3 rounded-xl transition-all shadow-md tracking-wider uppercase"
              >
                Submit Examination Paper
              </button>
            </div>

          </div>

          {/* Backdrop Overlay shield for Mobile navigation panels */}
          {mobilePaletteOpen && (
            <div 
              onClick={() => setMobilePaletteOpen(false)}
              className="lg:hidden fixed inset-0 bg-black/40 z-40"
            />
          )}

        </div>

      </div>
    );
  }

  // ==========================================
  // VIEW CONTEXT 2: PERFORMANCE ANALYSIS ENGINE
  // ==========================================
  if (activeTest && showAnalysis && currentAnalysisRecord) {
    const siblingAttempts = getAttemptsForTest(activeTest._id);
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
                      if (target) inspectLegacyAnalysisNode(target);
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
                onClick={() => setConfirmationModal({ isOpen: true, testObj: activeTest, isReattempt: true })}
                className="flex-1 md:flex-none px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl transition-all shadow-sm whitespace-nowrap text-center"
              >
                Start Reattempt
              </button>
              <button 
                onClick={() => {
                  setActiveTest(null);
                  setShowAnalysis(false);
                  setCurrentAnalysisRecord(null);
                }}
                className="flex-1 md:flex-none px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-all text-center whitespace-nowrap"
              >
                Exit Dashboard
              </button>
            </div>
          </div>

          {/* Metric parameters grid structural breakpoints */}
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

  // ==========================================
  // VIEW CONTEXT 3: BASE APP MARKETPLACE HOME VIEW
  // ==========================================
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-12 w-full min-h-screen relative">
      
      {/* Dynamic Overlay Dialog Modal Frame */}
      {confirmationModal.isOpen && confirmationModal.testObj && (
        <div className="fixed inset-0 z-[99999] bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white max-w-md w-full rounded-2xl sm:rounded-3xl border border-slate-200 p-5 sm:p-8 shadow-2xl overflow-y-auto max-h-[90vh]">
            <div className="text-center">
              <div className="mx-auto w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-amber-50 border border-amber-200 flex items-center justify-center text-lg shadow-inner mb-3 sm:mb-4">🔒</div>
              <h3 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight">
                {confirmationModal.isReattempt ? 'Confirm Secure Reattempt' : 'Confirm Examination Launch'}
              </h3>
              <p className="text-[11px] sm:text-xs text-slate-500 mt-2 leading-relaxed">
                You are executing a high-security assessment framework lock routine. 
                Any runtime operations initiating blurring loops, background shifts, or task minimization triggers an immediate server scoring package compilation sequence.
              </p>
              
              <div className="my-4 p-3 bg-slate-50 border border-slate-100 rounded-xl text-left text-[11px] sm:text-xs font-bold text-slate-600 space-y-1.5">
                <div className="flex justify-between"><span>Allotted Duration:</span> <span className="text-slate-900 font-extrabold">{confirmationModal.testObj.duration} Minutes</span></div>
                <div className="flex justify-between"><span>Evaluation Targets:</span> <span className="text-slate-900 font-extrabold">{confirmationModal.testObj.questions?.length || 0} Core Elements</span></div>
              </div>

              <div className="flex flex-col sm:flex-row gap-2 mt-5 sm:mt-6">
                <button
                  onClick={() => setConfirmationModal({ isOpen: false, testObj: null, isReattempt: false })}
                  className="w-full sm:flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-black rounded-xl transition-all order-2 sm:order-1"
                >
                  Return to Dashboard
                </button>
                <button
                  onClick={() => initiateFreshExamEngine(confirmationModal.testObj!)}
                  className="w-full sm:flex-1 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-black rounded-xl shadow-md transition-all order-1 sm:order-2"
                >
                  Launch Environment
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Header Matrix Description Section */}
      <div className="mb-6 sm:mb-10 border-b border-slate-100 pb-4 sm:pb-6">
        <span className="text-[9px] sm:text-[10px] font-black tracking-widest text-blue-600 uppercase bg-blue-50 px-2.5 py-1 rounded-md inline-block">
          Cluster Identity Token Status: Connected
        </span>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mt-2">NTA Standardized Mock Assessment Directories</h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1 break-all">
          {session ? `Authenticated candidate array proxy account: ${session.user?.email}` : 'Authentication context empty. Establish profile node session parameters.'}
        </p>
      </div>

      <h2 className="text-xs font-black text-slate-900 uppercase tracking-wider mb-4">Available Packages</h2>
      {tests.length === 0 ? (
        <div className="p-8 border border-dashed border-slate-200 bg-white text-center rounded-2xl mb-12">
          <p className="text-xs font-bold text-slate-400">No active test matrices configured inside this cluster instance profile.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mb-10 sm:mb-14">
          {tests.map((test) => {
            const pastAttempts = getAttemptsForTest(test._id);
            const isAttempted = pastAttempts.length > 0;
            const latestAttempt = pastAttempts[0];

            return (
              <div key={test._id} className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between items-start hover:shadow-md transition-shadow relative overflow-hidden">
                
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
                      onClick={() => inspectLegacyAnalysisNode(latestAttempt)}
                      className="flex-1 py-2.5 bg-blue-50 hover:bg-blue-100 text-blue-700 text-[11px] sm:text-xs font-black uppercase tracking-wider rounded-xl transition-all text-center truncate px-2"
                    >
                      Metrics Profile
                    </button>
                    <button
                      onClick={() => setConfirmationModal({ isOpen: true, testObj: test, isReattempt: true })}
                      className="py-2.5 px-3 sm:px-4 bg-slate-900 hover:bg-slate-800 text-white text-[11px] sm:text-xs font-bold uppercase rounded-xl transition-all text-center flex-shrink-0"
                    >
                      Reattempt
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setConfirmationModal({ isOpen: true, testObj: test, isReattempt: false })}
                    className="w-full mt-2 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-[11px] sm:text-xs font-black uppercase tracking-wider rounded-xl transition-all text-center"
                  >
                    Launch Assessment Core Module
                  </button>
                )}
              </div>
            );
          })}
        </div>
      )}

    </div>
  );
}

export default function StudentTestsMarketplacePage() {
  return (
    <SessionProvider>
      <StudentTestsMarketplaceContent />
    </SessionProvider>
  );
}