


'use client';
import { useEffect, useRef, useState } from 'react';
import { SessionProvider, useSession } from 'next-auth/react';
import { ConfirmationModal } from '@/components/test/ConfirmationModal';
import { TestAnalysisView } from '@/components/test/TestAnalysisView';
import { TestCard } from '@/components/test/TestCard';
import { TestTakingView } from '@/components/test/TestTakingView';
import type { AttemptHistoryRecord, QuestionStatus, TestSchema } from '@/components/test/types';

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
  const [mobilePaletteOpen, setMobilePaletteOpen] = useState<boolean>(false);
  const [lastQuestionNotice, setLastQuestionNotice] = useState<boolean>(false);

  const [confirmationModal, setConfirmationModal] = useState<{ isOpen: boolean; testObj: TestSchema | null; isReattempt: boolean }>({
    isOpen: false,
    testObj: null,
    isReattempt: false,
  });

  const examDeadlineRef = useRef<number | null>(null);
  const [showAnalysis, setShowAnalysis] = useState<boolean>(false);
  const [currentAnalysisRecord, setCurrentAnalysisRecord] = useState<AttemptHistoryRecord | null>(null);
  const [savingProgress, setSavingProgress] = useState(false);

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
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
      e.returnValue = 'Warning: Active proctored examination lock configuration engaged.';
      return e.returnValue;
    };

    window.history.pushState(null, '', window.location.href);
    const handlePopStateLock = () => {
      window.history.pushState(null, '', window.location.href);
      alert('Security Restraint: Navigation via browser operational interface buttons is disabled during an active assessment.');
    };

    const handleVisibilitySwitchLock = () => {
      if (document.visibilityState === 'hidden' && stateRef.current.activeTest && !stateRef.current.showAnalysis) {
        alert('Proctor Alert: Application window defocus event detected. The examination has been automatically finalized and submitted.');
        void compileAndSavePayloadCloud();
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
          window.setTimeout(() => {
            void compileAndSavePayloadCloud();
          }, 100);
        } else {
          setTimeLeft(secondsRemaining);
        }
      }, 1000);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [activeTest, showAnalysis]);

  const initiateFreshExamEngine = (testObj: TestSchema) => {
    const element = document.documentElement;
    if (element.requestFullscreen) {
      element.requestFullscreen().catch((err) => {
        console.log('Fullscreen request denied or failed', err);
      });
    }

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
      selectedAnswersSnapshot: currentSelectedAnswers,
    };

    const mockRecord: AttemptHistoryRecord = {
      _id: 'temp_' + Date.now(),
      ...reportData,
      attemptedAt: new Date().toISOString(),
    };
    setCurrentAnalysisRecord(mockRecord);
    setShowAnalysis(true);

    try {
      await fetch('/api/attempts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(reportData),
      });

      const historyRes = await fetch('/api/attempts');
      if (historyRes.ok) {
        const detailedHistory: AttemptHistoryRecord[] = await historyRes.json();
        setHistory(detailedHistory);
        const newlySaved = detailedHistory.find((h) => h.testId === currentActiveTest._id);
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
      [qId]: selectedAnswers[qId] !== undefined ? 'ANSWERED' : 'NOT_ANSWERED',
    }));

    if (currentIdx < activeTest.questions.length - 1) {
      setCurrentIdx(currentIdx + 1);
      setLastQuestionNotice(false);
    } else {
      setLastQuestionNotice(true);
      window.setTimeout(() => setLastQuestionNotice(false), 3000);
    }
  };

  const handleMarkForReviewAndNext = () => {
    if (!activeTest) return;
    const qId = activeTest.questions[currentIdx]?._id || String(currentIdx);
    const hasAnswer = selectedAnswers[qId] !== undefined;

    setQuestionStatuses((prev) => ({
      ...prev,
      [qId]: hasAnswer ? 'ANSWERED_AND_MARKED' : 'MARKED_FOR_REVIEW',
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
      [qId]: 'NOT_ANSWERED',
    }));
  };

  const inspectLegacyAnalysisNode = (historyNode: AttemptHistoryRecord) => {
    const matchedOriginalTest = tests.find((t) => t._id === historyNode.testId);
    if (!matchedOriginalTest) {
      alert('The original examination record selected is currently missing from the remote endpoint profile registry.');
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

  const handleSelectAnswer = (questionId: string, optionIndex: number) => {
    setSelectedAnswers((prev) => ({ ...prev, [questionId]: optionIndex }));
  };

  const handleGoToQuestion = (index: number) => {
    setCurrentIdx(index);
  };

  const handleOpenReattemptModal = (testObj: TestSchema) => {
    setConfirmationModal({ isOpen: true, testObj, isReattempt: true });
  };

  const handleOpenLaunchModal = (testObj: TestSchema) => {
    setConfirmationModal({ isOpen: true, testObj, isReattempt: false });
  };

  const handleCloseConfirmationModal = () => {
    setConfirmationModal({ isOpen: false, testObj: null, isReattempt: false });
  };

  const handleExitAnalysis = () => {
    setActiveTest(null);
    setShowAnalysis(false);
    setCurrentAnalysisRecord(null);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3 px-4 text-center">
        <div className="w-10 h-10 border-4 border-slate-200 border-t-blue-600 rounded-full animate-spin"></div>
        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Synchronizing secure connection profiles...</p>
      </div>
    );
  }

  if (activeTest && !showAnalysis) {
    return (
      <TestTakingView
        activeTest={activeTest}
        currentIdx={currentIdx}
        selectedAnswers={selectedAnswers}
        questionStatuses={questionStatuses}
        timeLeft={timeLeft}
        sessionEmail={session?.user?.email}
        lastQuestionNotice={lastQuestionNotice}
        mobilePaletteOpen={mobilePaletteOpen}
        onSelectAnswer={handleSelectAnswer}
        onSaveAndNext={handleSaveAndNext}
        onMarkForReviewAndNext={handleMarkForReviewAndNext}
        onClearResponse={handleClearResponse}
        onGoToQuestion={handleGoToQuestion}
        onTogglePalette={setMobilePaletteOpen}
        onSubmit={() => {
          if (confirm('Confirmation: Finalize and submit examination package for score processing?')) {
            void compileAndSavePayloadCloud();
          }
        }}
        formatClockTime={formatClockTime}
      />
    );
  }

  if (activeTest && showAnalysis && currentAnalysisRecord) {
    return (
      <TestAnalysisView
        activeTest={activeTest}
        currentAnalysisRecord={currentAnalysisRecord}
        siblingAttempts={getAttemptsForTest(activeTest._id)}
        savingProgress={savingProgress}
        onSelectAttempt={inspectLegacyAnalysisNode}
        onStartReattempt={() => setConfirmationModal({ isOpen: true, testObj: activeTest, isReattempt: true })}
        onExitDashboard={handleExitAnalysis}
      />
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-12 w-full min-h-screen relative">
      <ConfirmationModal
        isOpen={confirmationModal.isOpen}
        testObj={confirmationModal.testObj}
        isReattempt={confirmationModal.isReattempt}
        onClose={handleCloseConfirmationModal}
        onConfirm={initiateFreshExamEngine}
      />

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
            const latestAttempt = pastAttempts[0];

            return (
              <TestCard
                key={test._id}
                test={test}
                pastAttempts={pastAttempts}
                latestAttempt={latestAttempt}
                onViewAnalysis={inspectLegacyAnalysisNode}
                onStartTest={handleOpenLaunchModal}
                onReattempt={handleOpenReattemptModal}
              />
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