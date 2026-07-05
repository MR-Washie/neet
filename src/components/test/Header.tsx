export const ExamHeader = ({ title, timeLeft, onToggleSidebar, formatTime }: any) => (
  <div className="bg-gradient-to-r from-blue-900 to-indigo-950 border-b border-slate-700 text-white px-4 py-3 flex justify-between items-center shadow-md">
    <div className="min-w-0 flex-1 pr-2">
      <h1 className="font-extrabold text-[10px] uppercase tracking-wider text-slate-200 truncate">NTA Assessment Frame</h1>
      <h2 className="font-black text-sm truncate">{title}</h2>
    </div>
    <div className="flex items-center gap-4">
      <div className="bg-slate-950/60 border border-slate-700 px-4 py-2 rounded-xl text-right">
        <p className="text-[9px] text-slate-400 font-bold uppercase hidden sm:block">Time Remaining</p>
        <p className="font-mono text-lg font-black text-amber-400">{formatTime(timeLeft)}</p>
      </div>
      <button onClick={onToggleSidebar} className="lg:hidden p-2 bg-slate-800 rounded-xl text-xs">Menu</button>
    </div>
  </div>
);