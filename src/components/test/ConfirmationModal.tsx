import type { TestSchema } from './types';

interface ConfirmationModalProps {
  isOpen: boolean;
  testObj: TestSchema | null;
  isReattempt: boolean;
  onClose: () => void;
  onConfirm: (testObj: TestSchema) => void;
}

export function ConfirmationModal({ isOpen, testObj, isReattempt, onClose, onConfirm }: ConfirmationModalProps) {
  if (!isOpen || !testObj) return null;

  return (
    <div className="fixed inset-0 z-[99999] bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white max-w-md w-full rounded-2xl sm:rounded-3xl border border-slate-200 p-5 sm:p-8 shadow-2xl overflow-y-auto max-h-[90vh]">
        <div className="text-center">
          <div className="mx-auto w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-amber-50 border border-amber-200 flex items-center justify-center text-lg shadow-inner mb-3 sm:mb-4">🔒</div>
          <h3 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight">
            {isReattempt ? 'Confirm Secure Reattempt' : 'Confirm Examination Launch'}
          </h3>
          <p className="text-[11px] sm:text-xs text-slate-500 mt-2 leading-relaxed">
            You are executing a high-security assessment framework lock routine.
            Any runtime operations initiating blurring loops, background shifts, or task minimization triggers an immediate server scoring package compilation sequence.
          </p>

          <div className="my-4 p-3 bg-slate-50 border border-slate-100 rounded-xl text-left text-[11px] sm:text-xs font-bold text-slate-600 space-y-1.5">
            <div className="flex justify-between"><span>Allotted Duration:</span> <span className="text-slate-900 font-extrabold">{testObj.duration} Minutes</span></div>
            <div className="flex justify-between"><span>Evaluation Targets:</span> <span className="text-slate-900 font-extrabold">{testObj.questions?.length || 0} Core Elements</span></div>
          </div>

          <div className="flex flex-col sm:flex-row gap-2 mt-5 sm:mt-6">
            <button
              onClick={onClose}
              className="w-full sm:flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-black rounded-xl transition-all order-2 sm:order-1"
            >
              Return to Dashboard
            </button>
            <button
              onClick={() => onConfirm(testObj)}
              className="w-full sm:flex-1 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-black rounded-xl shadow-md transition-all order-1 sm:order-2"
            >
              Launch Environment
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
