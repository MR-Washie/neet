export const QuestionView = ({ question, selected, onSelect }: any) => {
  return (
    <div className="p-6 md:p-10 max-w-4xl w-full mx-auto">
      {question.imageUrl ? (
        <div className="mb-8 flex justify-center">
          <img
            src={question.imageUrl}
            alt="Question"
            className="max-w-full h-auto rounded-xl border border-slate-200 shadow-sm"
          />
        </div>
      ) : (
        <p className="mb-8 text-sm font-semibold text-slate-600">No image provided for this question.</p>
      )}

      <div className="space-y-3">
        {question.options.map((opt: string, i: number) => (
          <button
            key={i}
            onClick={() => onSelect(i)}
            className={`w-full p-4 text-left font-semibold rounded-xl border transition-all flex items-center gap-4 ${
              selected === i ? 'border-blue-600 bg-blue-50 ring-1' : 'border-slate-200 bg-slate-50'
            }`}
          >
            <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-black ${selected === i ? 'bg-blue-600 text-white' : 'bg-slate-200'}`}>
              {String.fromCharCode(65 + i)}
            </span>
            {opt}
          </button>
        ))}
      </div>
    </div>
  );
};