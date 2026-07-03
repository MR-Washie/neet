

'use client';
import { useState, useEffect, useRef } from 'react';
import { SessionProvider, useSession } from 'next-auth/react';

interface QuestionSchema {
  _id?: string;
  id?: number;
  questionText: string;
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

// NTA Question Status Operational Enum Map
type QuestionStatus = 'NOT_VISITED' | 'NOT_ANSWERED' | 'ANSWERED' | 'MARKED_FOR_REVIEW' | 'ANSWERED_AND_MARKED';

function StudentTestsMarketplaceContent() {
  const { data: session } = useSession();
  
  const [tests, setTests] = useState<TestSchema[]>([]);
  const [history, setHistory] = useState<AttemptHistoryRecord[]>([]);
  const [loading, setLoading] = useState(true);
  
  // NTA Engine Core Runtime Configuration States
  const [activeTest, setActiveTest] = useState<TestSchema | null>(null);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, number>>({});
  const [questionStatuses, setQuestionStatuses] = useState<Record<string, QuestionStatus>>({});
  const [timeLeft, setTimeLeft] = useState<number>(0);
  
  // Operational Dialog Windows
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

  // Sync structural application dashboard context loops
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

  // Track Visited Question Status Changes Based on Current Index Positions
  useEffect(() => {
    if (activeTest && !showAnalysis) {
      const qId = activeTest.questions[currentIdx]?._id || String(currentIdx);
      setQuestionStatuses((prev) => {
        const currentStatus = prev[qId];
        // If it is completely unvisited, transition it immediately into Not Answered
        if (!currentStatus || currentStatus === 'NOT_VISITED') {
          return { ...prev, [qId]: 'NOT_ANSWERED' };
        }
        return prev;
      });
    }
  }, [currentIdx, activeTest, showAnalysis]);

  // Proctored Environment Security Filters
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

  // Countdown Loop Engine
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
    
    // Seed initial unvisited schemas for the visual grid tracking components
    const initialStatuses: Record<string, QuestionStatus> = {};
    testObj.questions.forEach((q, i) => {
      const id = q._id || String(i);
      initialStatuses[id] = 'NOT_VISITED';
    });
    // Prime the first element right at initialization layer
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

  // NTA Navigation Control Handlers
  const handleSaveAndNext = () => {
    if (!activeTest) return;
    const qId = activeTest.questions[currentIdx]?._id || String(currentIdx);
    
    setQuestionStatuses((prev) => ({
      ...prev,
      [qId]: selectedAnswers[qId] !== undefined ? 'ANSWERED' : 'NOT_ANSWERED'
    }));

    if (currentIdx < activeTest.questions.length - 1) {
      setCurrentIdx(currentIdx + 1);
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

  // NTA Visual Polygon Grid Shapes Renders
  const renderNtaBadgeSymbol = (status: QuestionStatus, indexLabel: number | string) => {
    switch (status) {
      case 'ANSWERED':
        return (
          <div className="w-10 h-9 bg-emerald-600 text-white font-bold text-xs flex items-center justify-center relative rounded-t-md rounded-b-md shadow-sm">
            {indexLabel}
          </div>
        );
      case 'NOT_ANSWERED':
        return (
          <div className="w-10 h-9 bg-red-500 text-white font-bold text-xs flex items-center justify-center relative rounded-t-xl rounded-b-xl shadow-sm">
            {indexLabel}
          </div>
        );
      case 'MARKED_FOR_REVIEW':
        return (
          <div className="w-10 h-10 bg-indigo-600 text-white font-bold text-xs flex items-center justify-center rounded-full shadow-sm">
            {indexLabel}
          </div>
        );
      case 'ANSWERED_AND_MARKED':
        return (
          <div className="w-10 h-10 bg-indigo-600 text-white font-bold text-xs flex items-center justify-center rounded-full relative shadow-sm">
            {indexLabel}
            <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 rounded-full border-2 border-slate-900"></span>
          </div>
        );
      case 'NOT_VISITED':
      default:
        return (
          <div className="w-10 h-9 bg-slate-100 text-slate-700 border border-slate-300 font-bold text-xs flex items-center justify-center rounded shadow-sm">
            {indexLabel}
          </div>
        );
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3">
        <div className="w-10 h-10 border-4 border-slate-200 border-t-blue-600 rounded-full animate-spin"></div>
        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Synchronizing secure connection profiles...</p>
      </div>
    );
  }

  // ==========================================
  // VIEW CONTEXT 1: OFFICIAL SECURE NTA LOCKDOWN MODE
  // ==========================================
  if (activeTest && !showAnalysis) {
    const activeQuestion = activeTest.questions[currentIdx];
    const qId = activeQuestion._id || String(currentIdx);

    // Dynamic Counter Computations for Side Status Metrics Block
    const totalCount = activeTest.questions.length;
    let counts = { ANSWERED: 0, NOT_ANSWERED: 0, MARKED_FOR_REVIEW: 0, ANSWERED_AND_MARKED: 0, NOT_VISITED: 0 };
    activeTest.questions.forEach((q, i) => {
      const id = q._id || String(i);
      const status = questionStatuses[id] || 'NOT_VISITED';
      counts[status]++;
    });

    return (
      <div className="fixed inset-0 z-[9999] bg-slate-50 text-slate-900 flex flex-col justify-between w-screen h-screen overflow-hidden select-none">
        
        {/* NTA Structural Secure Top Header Grid Layout */}
        <div className="bg-gradient-to-r from-blue-900 to-indigo-950 border-b border-slate-700 text-white px-6 py-3.5 flex justify-between items-center shadow-md">
          <div>
            <h1 className="font-extrabold text-sm uppercase tracking-wider text-slate-200">National Testing Agency Assessment Frame</h1>
            <h2 className="font-black text-base text-white tracking-tight truncate max-w-xl">{activeTest.title}</h2>
          </div>
          <div className="flex items-center gap-6">
            <div className="bg-slate-950/60 border border-slate-700/80 px-4 py-2 rounded-xl text-right">
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Time Remaining</p>
              <p className="font-mono text-lg font-black text-amber-400 tracking-wider">{formatClockTime(timeLeft)}</p>
            </div>
          </div>
        </div>

        {/* NTA Standard Dual Column Flex Matrix Workspace Section */}
        <div className="flex-1 flex overflow-hidden w-full bg-slate-200">
          
          {/* LEFT SECTION FRAMEWORK: Question Body Presentation Area */}
          <div className="flex-1 flex flex-col justify-between bg-white overflow-y-auto">
            <div className="p-6 sm:p-10 max-w-4xl w-full mx-auto">
              
              <div className="flex justify-between items-center border-b border-slate-200 pb-4 mb-6">
                <span className="text-xs font-black bg-blue-50 text-blue-800 border border-blue-200 px-3 py-1.5 rounded-lg uppercase tracking-wide">
                  Section: {activeQuestion.subject || 'General Assessment Pattern'}
                </span>
                <span className="text-xs font-bold text-slate-500">
                  Question Number: <strong className="text-slate-900 text-sm font-black">{currentIdx + 1}</strong> of {totalCount}
                </span>
              </div>

              <div className="mb-8">
                <p className="text-base sm:text-lg font-bold text-slate-900 leading-relaxed whitespace-pre-wrap">
                  {activeQuestion.questionText}
                </p>
              </div>

              <div className="space-y-3">
                {activeQuestion.options.map((opt, i) => {
                  const isChosen = selectedAnswers[qId] === i;
                  return (
                    <button
                      key={i} 
                      onClick={() => setSelectedAnswers({ ...selectedAnswers, [qId]: i })}
                      className={`w-full p-4 text-left text-xs sm:text-sm font-semibold rounded-xl border transition-all flex items-center gap-4 ${
                        isChosen 
                          ? 'border-blue-600 bg-blue-50 text-blue-900 ring-1 ring-blue-600 shadow-sm' 
                          : 'border-slate-200 bg-slate-50/50 hover:bg-slate-100 text-slate-700'
                      }`}
                    >
                      <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-black transition-colors ${isChosen ? 'bg-blue-600 text-white' : 'bg-slate-200 text-slate-500'}`}>
                        {String.fromCharCode(65 + i)}
                      </span>
                      <span>{opt}</span>
                    </button>
                  );
                })}
              </div>

            </div>

            {/* NTA Question Left Pane Foot Action Operations Strip */}
            <div className="bg-slate-100 border-t border-slate-200 px-6 py-4 flex flex-wrap gap-3 justify-between items-center shadow-inner">
              <div className="flex gap-2.5">
                <button
                  onClick={handleMarkForReviewAndNext}
                  className="px-4 py-2.5 bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-bold rounded-lg hover:bg-indigo-100 transition-colors"
                >
                  Mark for Review & Next
                </button>
                <button
                  onClick={handleClearResponse}
                  className="px-4 py-2.5 bg-white border border-slate-300 text-slate-700 text-xs font-bold rounded-lg hover:bg-slate-50 transition-colors"
                >
                  Clear Response
                </button>
              </div>

              <div className="flex gap-2.5">
                <button
                  disabled={currentIdx === 0}
                  onClick={() => setCurrentIdx(currentIdx - 1)}
                  className="px-4 py-2.5 bg-white border border-slate-300 text-slate-700 text-xs font-bold rounded-lg hover:bg-slate-50 disabled:opacity-30 disabled:pointer-events-none transition-colors"
                >
                  Back
                </button>
                <button
                  onClick={handleSaveAndNext}
                  className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black tracking-wide rounded-lg transition-all shadow-sm"
                >
                  Save & Next
                </button>
              </div>
            </div>
          </div>

          {/* RIGHT SECTION FRAMEWORK: Question Status Navigation Matrix Panel */}
          <div className="w-80 border-l border-slate-300 bg-slate-50 flex flex-col justify-between">
            
            <div className="p-4 flex-1 overflow-y-auto">
              
              {/* Profile Context Display Card Layout */}
              <div className="bg-white p-3.5 border border-slate-200 rounded-xl mb-4 flex items-center gap-3 shadow-sm">
                <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center text-slate-600 font-black text-sm">
                  EX
                </div>
                <div>
                  <p className="text-[10px] uppercase font-black text-slate-400 tracking-wider">Candidate Context</p>
                  <p className="text-xs font-bold text-slate-800 truncate max-w-[180px]">{session?.user?.email || 'Guest Examinee Instance'}</p>
                </div>
              </div>

              {/* Legend Summary Status Parameters Matrix Block */}
              <div className="grid grid-cols-2 gap-2 text-[11px] font-bold text-slate-600 bg-white p-3 border border-slate-200 rounded-xl mb-4 shadow-sm">
                <div className="flex items-center gap-2">
                  {renderNtaBadgeSymbol('ANSWERED', counts.ANSWERED)} <span>Answered</span>
                </div>
                <div className="flex items-center gap-2">
                  {renderNtaBadgeSymbol('NOT_ANSWERED', counts.NOT_ANSWERED)} <span>Not Answered</span>
                </div>
                <div className="flex items-center gap-2">
                  {renderNtaBadgeSymbol('MARKED_FOR_REVIEW', counts.MARKED_FOR_REVIEW)} <span>Marked for Review</span>
                </div>
                <div className="flex items-center gap-2">
                  {renderNtaBadgeSymbol('ANSWERED_AND_MARKED', counts.ANSWERED_AND_MARKED)} <span>Marked & Answered</span>
                </div>
                <div className="flex items-center gap-2 col-span-2 border-t border-slate-100 pt-2 mt-1">
                  {renderNtaBadgeSymbol('NOT_VISITED', counts.NOT_VISITED)} <span className="ml-1">Not Visited</span>
                </div>
              </div>

              {/* NTA Grid Array Index Display Matrix Block */}
              <div className="bg-white border border-slate-200 rounded-xl p-3.5 shadow-sm">
                <p className="text-[10px] uppercase font-black tracking-widest text-slate-400 mb-3 border-b border-slate-100 pb-1.5">Question Palette Array</p>
                <div className="grid grid-cols-4 gap-2.5">
                  {activeTest.questions.map((q, i) => {
                    const currentId = q._id || String(i);
                    const status = questionStatuses[currentId] || 'NOT_VISITED';
                    const isSelected = i === currentIdx;

                    return (
                      <button
                        key={currentId}
                        onClick={() => setCurrentIdx(i)}
                        className={`transition-transform active:scale-95 focus:outline-none flex items-center justify-center ${isSelected ? 'ring-2 ring-blue-600 ring-offset-2 rounded-lg' : ''}`}
                      >
                        {renderNtaBadgeSymbol(status, i + 1)}
                      </button>
                    );
                  })}
                </div>
              </div>

            </div>

            {/* Permanent Termination Secure Trigger Button Frame */}
            <div className="p-4 bg-slate-100 border-t border-slate-200 w-full">
              <button 
                onClick={() => { if(confirm("Confirmation: Are you sure you want to finalize and submit this examination text package for automatic server scoring?")) compileAndSavePayloadCloud(); }}
                className="w-full text-xs font-black text-white bg-red-600 hover:bg-red-700 py-3 rounded-xl transition-all shadow-md tracking-wider uppercase"
              >
                Submit Examination Paper
              </button>
            </div>

          </div>
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
      <div className="max-w-4xl mx-auto px-4 py-10 w-full min-h-screen">
        <div className="bg-white p-6 sm:p-10 rounded-3xl border border-slate-200 shadow-xl mb-8">
          
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4 border-b border-slate-100 pb-6 mb-8">
            <div>
              <div className="flex flex-wrap gap-2 items-center">
                <span className="text-[10px] font-black tracking-widest text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-md uppercase">
                  {savingProgress ? 'Archiving Score Record...' : 'Performance Evaluation Analysis'}
                </span>
                {siblingAttempts.length > 1 && (
                  <span className="text-[10px] font-black tracking-widest text-blue-600 bg-blue-50 px-2.5 py-1 rounded-md uppercase">
                    Attempt Assessment {siblingAttempts.length - siblingAttempts.findIndex(x => x._id === currentAnalysisRecord._id)} of {siblingAttempts.length}
                  </span>
                )}
              </div>
              <h2 className="text-2xl font-black text-slate-900 mt-2 tracking-tight">{activeTest.title}</h2>
              
              {siblingAttempts.length > 1 && (
                <div className="mt-3 flex items-center gap-2">
                  <label className="text-xs font-bold text-slate-500">Switch Historical Evaluation View:</label>
                  <select 
                    value={currentAnalysisRecord._id}
                    onChange={(e) => {
                      const target = siblingAttempts.find(a => a._id === e.target.value);
                      if (target) inspectLegacyAnalysisNode(target);
                    }}
                    className="text-xs font-bold bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-700 outline-none focus:ring-1 focus:ring-blue-500"
                  >
                    {siblingAttempts.map((att, index) => (
                      <option key={att._id} value={att._id}>
                        Attempt Sequence #{siblingAttempts.length - index} ({new Date(att.attemptedAt).toLocaleDateString()}) — Final Score: {att.totalMarks}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>
            
            <div className="flex flex-wrap sm:flex-nowrap gap-2 w-full sm:w-auto">
              <button 
                onClick={() => setConfirmationModal({ isOpen: true, testObj: activeTest, isReattempt: true })}
                className="flex-1 sm:flex-none px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl transition-all shadow-sm whitespace-nowrap"
              >
                Start New Reattempt
              </button>
              <button 
                onClick={() => {
                  setActiveTest(null);
                  setShowAnalysis(false);
                  setCurrentAnalysisRecord(null);
                }}
                className="flex-1 sm:flex-none px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-all"
              >
                Exit Analysis Dashboard
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 text-center">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-wide">Final Marks Earned</p>
              <h3 className="text-2xl font-black mt-1 text-slate-900">
                {currentAnalysisRecord.totalMarks} <span className="text-xs text-slate-400 font-normal">/ {currentAnalysisRecord.maxPossibleMarks}</span>
              </h3>
            </div>
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 text-center">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-wide">Accuracy Rating</p>
              <h3 className="text-2xl font-black text-blue-600 mt-1">
                {currentAnalysisRecord.attemptedCount > 0 ? Math.round((currentAnalysisRecord.correctAnswers / currentAnalysisRecord.attemptedCount) * 100) : 0}%
              </h3>
            </div>
            <div className="bg-emerald-50/60 p-4 rounded-xl border border-emerald-100 text-center">
              <p className="text-[10px] font-black text-emerald-600 uppercase tracking-wide">Correct Validations</p>
              <h3 className="text-2xl font-black text-emerald-700 mt-1">✓ {currentAnalysisRecord.correctAnswers}</h3>
            </div>
            <div className="bg-rose-50/60 p-4 rounded-xl border border-rose-100 text-center">
              <p className="text-[10px] font-black text-rose-600 uppercase tracking-wide">Incorrect Validations</p>
              <h3 className="text-2xl font-black text-rose-700 mt-1">✗ {currentAnalysisRecord.wrongAnswers}</h3>
            </div>
          </div>

          <div className="space-y-6">
            {activeTest.questions.map((q, idx) => {
              const currentId = q._id || String(idx);
              const userChosenIdx = safeSnapshot[currentId];
              const isUnattempted = userChosenIdx === undefined;
              const isCorrect = !isUnattempted && userChosenIdx === q.correctOptionIndex;

              return (
                <div key={currentId} className={`p-5 rounded-2xl border ${isUnattempted ? 'border-slate-200 bg-slate-50/40' : isCorrect ? 'border-emerald-200 bg-emerald-50/10' : 'border-rose-200 bg-rose-50/10'}`}>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-xs font-bold text-slate-400">Question Item Vector Sequence {idx + 1}</span>
                    <span className={`text-[10px] font-black px-2 py-0.5 rounded uppercase ${isUnattempted ? 'bg-slate-100 text-slate-500' : isCorrect ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>
                      {isUnattempted ? 'Skipped' : isCorrect ? 'Correct Option Metric' : 'Incorrect Option Metric'}
                    </span>
                  </div>
                  <p className="text-sm font-bold text-slate-800 mb-4">{q.questionText}</p>
                  <div className="grid grid-cols-1 gap-2">
                    {q.options.map((opt, optIdx) => {
                      const wasSelected = userChosenIdx === optIdx;
                      const isOptionCorrect = q.correctOptionIndex === optIdx;
                      let rowStyle = 'border-slate-200 text-slate-600 bg-white';
                      if (isOptionCorrect) rowStyle = 'border-emerald-500 bg-emerald-50 text-emerald-900 font-bold';
                      else if (wasSelected) rowStyle = 'border-rose-400 bg-rose-50 text-rose-900';

                      return (
                        <div key={optIdx} className={`p-3 text-xs rounded-xl border flex items-center justify-between ${rowStyle}`}>
                          <span>{opt}</span>
                          <span className="text-[10px] font-black uppercase tracking-wider">
                            {isOptionCorrect && 'Verified Master Key Target'}
                            {wasSelected && !isOptionCorrect && 'Examinee Answer Selection'}
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
    <div className="max-w-6xl mx-auto px-6 py-12 w-full min-h-screen relative">
      
      {/* ENTERPRISE FORMAL CONFIRMATION DIALOG ENVELOPE MODAL */}
      {confirmationModal.isOpen && confirmationModal.testObj && (
        <div className="fixed inset-0 z-[99999] bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white max-w-md w-full rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-2xl">
            <div className="text-center">
              <div className="mx-auto w-12 h-12 rounded-full bg-amber-50 border border-amber-200 flex items-center justify-center text-xl shadow-inner mb-4">🔒</div>
              <h3 className="text-xl font-black text-slate-900 tracking-tight">
                {confirmationModal.isReattempt ? 'Confirm Secure Examination Reattempt' : 'Confirm Examination Initialization'}
              </h3>
              <p className="text-xs text-slate-500 mt-2.5 leading-relaxed">
                You are entering a high-security assessment lock environment configuration. 
                Any operation leading to window blurring events, tab switching, or device minimization routines triggers an instant automated exam termination payload sequence.
              </p>
              
              <div className="my-4 p-3 bg-slate-50 border border-slate-100 rounded-xl text-left text-xs font-bold text-slate-600 space-y-1">
                <div className="flex justify-between"><span>Allotted Duration Parameters:</span> <span className="text-slate-900 font-extrabold">{confirmationModal.testObj.duration} Minutes</span></div>
                <div className="flex justify-between"><span>Total Evaluation Elements:</span> <span className="text-slate-900 font-extrabold">{confirmationModal.testObj.questions?.length || 0} Core Items</span></div>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => setConfirmationModal({ isOpen: false, testObj: null, isReattempt: false })}
                  className="flex-1 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-black rounded-xl transition-all"
                >
                  Return to Dashboard
                </button>
                <button
                  onClick={() => {
                    initiateFreshExamEngine(confirmationModal.testObj!);
                  }}
                  className="flex-1 py-3 bg-blue-600 hover:bg-blue-700 text-white text-xs font-black rounded-xl shadow-md transition-all"
                >
                  Authorize Lockdown Launch
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="mb-10 border-b border-slate-100 pb-6">
        <span className="text-[10px] font-black tracking-widest text-blue-600 uppercase bg-blue-50 px-2.5 py-1 rounded-md">
          Portal Identity Token Framework Status: Authorized Execution Trace
        </span>
        <h1 className="text-3xl font-black text-slate-900 tracking-tight mt-2">NTA Standardized Mock Assessment Directories</h1>
        <p className="text-sm text-slate-500 mt-1">
          {session ? `Authentication context established for account proxy: ${session.user?.email}. Progression telemetry enabled.` : 'Authentication context empty. Please establish system session profile.'}
        </p>
      </div>

      <h2 className="text-sm font-black text-slate-900 uppercase tracking-wider mb-4">Available Examination Packages</h2>
      {tests.length === 0 ? (
        <div className="p-8 border border-dashed border-slate-200 bg-white text-center rounded-2xl mb-12">
          <p className="text-xs font-bold text-slate-400">No active test matrices configured inside this cluster instance profile.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-14">
          {tests.map((test) => {
            const pastAttempts = getAttemptsForTest(test._id);
            const isAttempted = pastAttempts.length > 0;
            const latestAttempt = pastAttempts[0];

            return (
              <div key={test._id} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between items-start hover:shadow-md transition-shadow relative overflow-hidden">
                
                {isAttempted && (
                  <div className="absolute top-0 right-0 bg-emerald-600 text-white px-3 py-1 rounded-bl-xl text-[10px] font-black tracking-wide uppercase shadow-sm">
                    Evaluated Asset ({pastAttempts.length}x)
                  </div>
                )}

                <div className="w-full">
                  <h3 className="text-base font-black text-slate-900 tracking-tight mb-2 pr-24">{test.title}</h3>
                  <div className="flex gap-4 text-xs font-bold text-slate-400 mb-4">
                    <span>Duration: {test.duration} Minutes</span>
                    <span>Elements Array Count: {test.questions?.length || 0} Questions</span>
                  </div>
                  
                  {isAttempted && latestAttempt && (
                    <div className="mb-5 bg-slate-50 border border-slate-100 p-2.5 rounded-xl text-[11px] flex justify-between items-center text-slate-600">
                      <span>Latest Historical Score Result: <strong className="text-slate-900 font-extrabold">{latestAttempt.totalMarks}</strong>/{latestAttempt.maxPossibleMarks}</span>
                      <span className="text-blue-600 font-bold">Accuracy Factor: {latestAttempt.attemptedCount > 0 ? Math.round((latestAttempt.correctAnswers / latestAttempt.attemptedCount) * 100) : 0}%</span>
                    </div>
                  )}
                </div>

                {isAttempted ? (
                  <div className="flex gap-2 w-full mt-2">
                    <button
                      onClick={() => inspectLegacyAnalysisNode(latestAttempt)}
                      className="flex-1 py-2.5 bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-black uppercase tracking-wider rounded-xl transition-all text-center"
                    >
                      Inspect Performance Analytics
                    </button>
                    <button
                      onClick={() => setConfirmationModal({ isOpen: true, testObj: test, isReattempt: true })}
                      className="py-2.5 px-4 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold uppercase rounded-xl transition-all text-center"
                    >
                      Reattempt
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setConfirmationModal({ isOpen: true, testObj: test, isReattempt: false })}
                    className="w-full mt-2 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-black uppercase tracking-wider rounded-xl transition-all text-center"
                  >
                    Launch Assessment Core Module
                  </button>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* CORE TELEMETRY TRACKING DATAGRID LAYER */}
      {/* <div className="bg-white border border-slate-200 rounded-3xl shadow-sm p-6">
        <h2 className="text-sm font-black text-slate-900 uppercase tracking-wider mb-1">Authenticated Candidate Examination History Ledger</h2>
        <p className="text-xs text-slate-500 mb-4">System architecture interface audit track listing persistent execution records tracking framework nodes.</p>

        {!session ? (
          <div className="p-6 bg-slate-50 text-center rounded-xl text-xs font-bold text-slate-500">
            System Notification: An active authenticated tracking session state context is required to read telemetry records.
          </div>
        ) : history.length === 0 ? (
          <div className="p-8 text-center text-xs font-bold text-slate-400">
            No historical records discovered linked to the current unique credential array identifier.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 text-[10px] font-black text-slate-400 uppercase tracking-wider">
                  <th className="py-3 px-4">Evaluation Asset Title Target</th>
                  <th className="py-3 px-4">Aggregate Score Parameters</th>
                  <th className="py-3 px-4">Accuracy Scale</th>
                  <th className="py-3 px-4">Execution Timestamp</th>
                  <th className="py-3 px-4 text-right">Records Action Map</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs font-semibold text-slate-700">
                {history.map((record) => (
                  <tr key={record._id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-3.5 px-4 font-bold text-slate-900">{record.testTitle}</td>
                    <td className="py-3.5 px-4">
                      <span className={`font-black ${record.totalMarks >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                        {record.totalMarks}
                      </span>
                      <span className="text-slate-400 font-normal"> / {record.maxPossibleMarks}</span>
                    </td>
                    <td className="py-3.5 px-4 text-blue-600 font-bold">
                      {record.attemptedCount > 0 ? Math.round((record.correctAnswers / record.attemptedCount) * 100) : 0}%
                    </td>
                    <td className="py-3.5 px-4 text-slate-400 text-[11px]">
                      {new Date(record.attemptedAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute:'2-digit' })}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button 
                        onClick={() => inspectLegacyAnalysisNode(record)}
                        className="text-[11px] font-black text-blue-600 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-lg transition-colors"
                      >
                        Inspect Core Matrix Metrics
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div> */}

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