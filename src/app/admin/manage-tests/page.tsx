'use client';
import { useState, useEffect } from 'react';
import { SessionProvider } from 'next-auth/react';

interface QuestionSchema {
  _id?: string;
  questionText: string;
  options: string[];
  correctOptionIndex: number;
  subject: string;
  topic: string;
}

interface TestSchema {
  _id: string;
  title: string;
  duration: number;
  questions: QuestionSchema[];
}

function AdminManageTestsContent() {
  const [tests, setTests] = useState<TestSchema[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Editing focus states
  const [editingTest, setEditingTest] = useState<TestSchema | null>(null);
  const [editingQuestionIdx, setEditingQuestionIdx] = useState<number | null>(null);

  // Form input state for individual question edits/adds
  const [currentQ, setCurrentQ] = useState<QuestionSchema>({
    questionText: '',
    options: ['', '', '', ''],
    correctOptionIndex: 0,
    subject: 'Biology',
    topic: ''
  });

  // Fetch all live database records on mount
  const fetchAllTests = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/tests'); // Using the student endpoint to pull data lists
      if (res.ok) {
        const data = await res.json();
        setTests(data);
      }
    } catch (err) {
      console.error('Error fetching data registry:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllTests();
  }, []);

  // Trigger absolute deletion of a test document
  const handleDeleteTestNode = async (id: string) => {
    if (!confirm('Bhai, are you sure? Yeh test database se permanently delete ho jayega!')) return;
    try {
      const res = await fetch(`/api/admin/tests/${id}`, { method: 'DELETE' });
      if (res.ok) {
        alert('🗑️ Test removed successfully.');
        fetchAllTests();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Push updated test blueprint to server
  const handleUpdateTestSubmit = async () => {
    if (!editingTest || editingTest.questions.length === 0) {
      alert('Test schema requires at least 1 nested question component.');
      return;
    }

    try {
      const res = await fetch(`/api/admin/tests/${editingTest._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingTest),
      });

      if (res.ok) {
        alert('🎯 Test cloud matrices updated and synced successfully!');
        setEditingTest(null);
        fetchAllTests();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleOptionChange = (idx: number, val: string) => {
    const updatedOptions = [...currentQ.options];
    updatedOptions[idx] = val;
    setCurrentQ({ ...currentQ, options: updatedOptions });
  };

  // Save current dynamic input to nested question array inside editing target
  const commitQuestionChanges = () => {
    if (!editingTest) return;
    if (!currentQ.questionText || currentQ.options.some(o => !o.trim())) {
      alert('Ensure question statement and options parameters are fully initialized.');
      return;
    }

    let updatedQuestions = [...editingTest.questions];

    if (editingQuestionIdx !== null) {
      // Modify existing index node
      updatedQuestions[editingQuestionIdx] = currentQ;
    } else {
      // Direct push node insertion
      updatedQuestions.push(currentQ);
    }

    setEditingTest({ ...editingTest, questions: updatedQuestions });
    setEditingQuestionIdx(null);
    setCurrentQ({ questionText: '', options: ['', '', '', ''], correctOptionIndex: 0, subject: 'Biology', topic: '' });
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3">
        <div className="w-10 h-10 border-4 border-slate-200 border-t-blue-600 rounded-full animate-spin"></div>
        <p className="text-xs font-bold text-slate-500 tracking-wider uppercase">Loading database manifests...</p>
      </div>
    );
  }

  // WORKSPACE VIEW: Active Edit Frame for specific targeted Test ID
  if (editingTest) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-10 w-full">
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm mb-6">
          <div className="flex justify-between items-center border-b border-slate-100 pb-4 mb-6">
            <h1 className="text-xl font-black text-slate-900">🛠️ Modify Test Framework Panel</h1>
            <button onClick={() => setEditingTest(null)} className="text-xs font-bold text-slate-500 bg-slate-100 px-3 py-1.5 rounded-lg">
              ← Return to List
            </button>
          </div>

          {/* Test Properties Control Blocks */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
            <div>
              <label className="text-xs font-bold text-slate-400 uppercase">Test Title Name</label>
              <input 
                type="text" value={editingTest.title} onChange={(e) => setEditingTest({ ...editingTest, title: e.target.value })}
                className="w-full mt-1 p-3 rounded-xl border border-slate-200 text-sm font-semibold text-slate-800 outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-400 uppercase">Timer Duration (Mins)</label>
              <input 
                type="number" value={editingTest.duration} onChange={(e) => setEditingTest({ ...editingTest, duration: Number(e.target.value) })}
                className="w-full mt-1 p-3 rounded-xl border border-slate-200 text-sm font-semibold text-slate-800 outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Nested In-line Question Form Workspace */}
          <div className={`p-5 rounded-2xl border mb-6 ${editingQuestionIdx !== null ? 'bg-amber-50/30 border-amber-200' : 'bg-slate-50 border-slate-200/60'}`}>
            <h3 className="font-bold text-slate-800 text-xs uppercase tracking-wider mb-4 text-slate-500">
              {editingQuestionIdx !== null ? `⚠️ Modifying Sub-Question Cluster #${editingQuestionIdx + 1}` : '➕ Append New Question To Matrix'}
            </h3>

            <div className="grid grid-cols-2 gap-3 mb-4">
              <select 
                value={currentQ.subject} onChange={(e) => setCurrentQ({ ...currentQ, subject: e.target.value })}
                className="p-2.5 bg-white border border-slate-200 rounded-lg text-xs font-semibold"
              >
                <option>Biology</option>
                <option>Physics</option>
                <option>Chemistry</option>
              </select>
              <input 
                type="text" placeholder="Topic schema" value={currentQ.topic}
                onChange={(e) => setCurrentQ({ ...currentQ, topic: e.target.value })}
                className="p-2.5 bg-white border border-slate-200 rounded-lg text-xs font-medium outline-none"
              />
            </div>

            <textarea 
              rows={2} placeholder="Write high yield target statement question..."
              value={currentQ.questionText} onChange={(e) => setCurrentQ({ ...currentQ, questionText: e.target.value })}
              className="w-full p-3 rounded-xl border border-slate-200 text-xs font-medium outline-none mb-4"
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-4">
              {currentQ.options.map((opt, i) => (
                <input 
                  key={i} type="text" placeholder={`Option ${String.fromCharCode(65 + i)}`}
                  value={opt} onChange={(e) => handleOptionChange(i, e.target.value)}
                  className="p-2.5 bg-white border border-slate-200 rounded-lg text-xs font-medium outline-none"
                />
              ))}
            </div>

            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-500">
                <span>Correct Option:</span>
                <select 
                  value={currentQ.correctOptionIndex} onChange={(e) => setCurrentQ({ ...currentQ, correctOptionIndex: Number(e.target.value) })}
                  className="p-1 bg-white border border-slate-200 rounded text-xs font-bold"
                >
                  <option value={0}>A</option>
                  <option value={1}>B</option>
                  <option value={2}>C</option>
                  <option value={3}>D</option>
                </select>
              </div>
              <div className="flex gap-2">
                {editingQuestionIdx !== null && (
                  <button 
                    onClick={() => {
                      setEditingQuestionIdx(null);
                      setCurrentQ({ questionText: '', options: ['', '', '', ''], correctOptionIndex: 0, subject: 'Biology', topic: '' });
                    }}
                    className="px-3 py-1.5 bg-slate-200 text-slate-700 text-xs font-bold rounded-lg"
                  >
                    Cancel
                  </button>
                )}
                <button onClick={commitQuestionChanges} className="px-4 py-1.5 bg-slate-800 text-white text-xs font-bold rounded-lg">
                  {editingQuestionIdx !== null ? 'Apply Changes to Stack' : 'Inject Question Node'}
                </button>
              </div>
            </div>
          </div>

          {/* Core Question Stack Loop Tracker Preview */}
          <div className="mb-6 border border-slate-100 rounded-2xl p-4 bg-slate-50/50">
            <h4 className="text-xs font-black text-slate-400 uppercase tracking-wider mb-3">Live Nested Array Questions Pipeline ({editingTest.questions.length})</h4>
            <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
              {editingTest.questions.map((q, idx) => (
                <div key={idx} className="p-3 bg-white border border-slate-200 rounded-xl flex justify-between items-center gap-4 shadow-sm">
                  <div className="text-xs">
                    <p className="font-bold text-slate-800"><span className="text-slate-400 mr-1">#{idx+1}</span> {q.questionText}</p>
                    <div className="mt-1 flex gap-1.5">
                      <span className="text-[9px] bg-blue-50 text-blue-600 px-1 rounded font-bold">{q.subject}</span>
                      <span className="text-[9px] bg-emerald-50 text-emerald-700 px-1 rounded font-bold">Ans Index: {q.correctOptionIndex}</span>
                    </div>
                  </div>
                  <div className="flex gap-2 shrink-0">
                    <button 
                      onClick={() => { setEditingQuestionIdx(idx); setCurrentQ(q); }}
                      className="text-xs font-bold text-blue-600 hover:underline"
                    >
                      ✏️ Edit
                    </button>
                    <button 
                      onClick={() => setEditingTest({ ...editingTest, questions: editingTest.questions.filter((_, i) => i !== idx) })}
                      className="text-xs font-bold text-red-500 hover:underline"
                    >
                      🗑️ Drop
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Action Footer */}
          <div className="border-t border-slate-100 pt-4 flex justify-end">
            <button onClick={handleUpdateTestSubmit} className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm rounded-xl shadow-md">
              💾 Save & Sync Modified Test with Database
            </button>
          </div>
        </div>
      </div>
    );
  }

  // DEFAULT VIEW: Master Directory Catalog Table Loop for Administrators
  return (
    <div className="max-w-6xl mx-auto px-4 py-10 w-full">
      <div className="mb-8">
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">👑 Cloud Engine Master Test Records</h1>
        <p className="text-sm text-slate-500 mt-1">Manage active mock parameters, monitor structural integrity models, modify arrays, or purge live database documents.</p>
      </div>

      {tests.length === 0 ? (
        <div className="p-12 border border-dashed border-slate-200 rounded-2xl text-center bg-white">
          <p className="text-sm text-slate-400 font-medium">No tests discovered in cloud cluster arrays.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {tests.map((test) => (
            <div key={test._id} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
              <div className="w-full">
                <div className="flex justify-between items-start">
                  <span className="text-[9px] uppercase font-black tracking-wider text-slate-400 bg-slate-100 px-2 py-0.5 rounded">ID: {test._id.slice(-6)}</span>
                  <div className="flex gap-2">
                    <button onClick={() => setEditingTest(JSON.parse(JSON.stringify(test)))} className="text-xs font-bold text-blue-600 hover:bg-blue-50 px-2 py-1 rounded">
                      ✏️ Edit Framework
                    </button>
                    <button onClick={() => handleDeleteTestNode(test._id)} className="text-xs font-bold text-red-600 hover:bg-red-50 px-2 py-1 rounded">
                      🗑️ Purge
                    </button>
                  </div>
                </div>
                <h3 className="text-base font-bold text-slate-900 mt-3 mb-2">{test.title}</h3>
                <div className="flex gap-4 text-xs font-semibold text-slate-400 mb-2">
                  <span>⏱️ {test.duration} Mins</span>
                  <span>📋 {test.questions?.length || 0} Questions Loaded</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function AdminManageTestsPage() {
  return (
    <SessionProvider>
      <AdminManageTestsContent />
    </SessionProvider>
  );
}