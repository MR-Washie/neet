import type { QuestionStatus } from './types';

interface QuestionStatusBadgeProps {
  status: QuestionStatus;
  indexLabel: number | string;
}

export function QuestionStatusBadge({ status, indexLabel }: QuestionStatusBadgeProps) {
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
}
