'use client';
import { useState, useEffect } from 'react';
import { SessionProvider } from 'next-auth/react';
import { uploadImageAction } from '@/app/actions/uploadImage';
import UploadForm from '@/components/UploadForm';

interface QuestionSchema {
  imageUrl: string;
  options: string[];
  correctOptionIndex: number;
  subject: string;
  topic: string;
}

function AdminAddTestContent() {
  const [testTitle, setTestTitle] = useState('');
  const [durationMinutes, setDurationMinutes] = useState(180);
  const [questions, setQuestions] = useState<QuestionSchema[]>([]);

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string>('');

  // Track index when editing an existing question in the stack
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  // Current working question single state
  const [currentQ, setCurrentQ] = useState<QuestionSchema>({
    imageUrl: '',
    options: ['', '', '', ''],
    correctOptionIndex: 0,
    subject: 'Physics',
    topic: ''
  });

  const handleOptionChange = (idx: number, val: string) => {
    const updatedOptions = [...currentQ.options];
    updatedOptions[idx] = val;
    setCurrentQ({ ...currentQ, options: updatedOptions });
  };

  const uploadSingleImage = async (file: File): Promise<string | null> => {
    setIsUploading(true);
    const formData = new FormData();
    formData.append('image', file);

    try {
      const res = await uploadImageAction(formData);
      console.log(res);
      if (res.success && res.url) return res.url;
      alert("Upload failed: " + res.error);
    } catch (err) {
      console.error("Upload error:", err);
    } finally {
      setIsUploading(false);
    }
    return null;
  };

  // Manage preview URL for selected file or existing imageUrl when editing
  useEffect(() => {
    let obj: string | undefined;
    if (imageFile) {
      obj = URL.createObjectURL(imageFile);
      setPreviewUrl(obj);
    } else if (currentQ.imageUrl) {
      setPreviewUrl(currentQ.imageUrl);
    } else {
      setPreviewUrl('');
    }

    return () => {
      if (obj) URL.revokeObjectURL(obj);
    };
  }, [imageFile, currentQ.imageUrl]);

  // Add OR Update question node in local list array
  const addQuestionToFormList = async () => {
    if (currentQ.options.some(o => !o.trim())) {
      alert('Please fill all 4 options!');
      return;
    }

    let finalUrl = currentQ.imageUrl;

    if (!imageFile && !finalUrl) {
      alert('Please upload an image before adding this question.');
      return;
    }

    if (imageFile) {
      const uploadedUrl = await uploadSingleImage(imageFile);
      if (!uploadedUrl) return;
      finalUrl = uploadedUrl;
    }

    const newQuestion = { ...currentQ, imageUrl: finalUrl };

    if (editingIndex !== null) {
      const updatedQuestions = [...questions];
      updatedQuestions[editingIndex] = newQuestion;
      setQuestions(updatedQuestions);
      setEditingIndex(null);
    } else {
      setQuestions([...questions, newQuestion]);
    }

    setImageFile(null);
    setCurrentQ({
      imageUrl: '',
      options: ['', '', '', ''],
      correctOptionIndex: 0,
      subject: currentQ.subject,
      topic: ''
    });
  };

  // Trigger Edit Mode: Pull question data back into form inputs
  const startEditQuestion = (index: number) => {
    setCurrentQ(questions[index]);
    setEditingIndex(index);
  };

  // Remove single question object out of array stack completely
  const removeQuestionFromList = (index: number) => {
    const updated = questions.filter((_, i) => i !== index);
    setQuestions(updated);
    if (editingIndex === index) {
      setEditingIndex(null); // Clear editing lock state if active item is deleted
    }
  };

  const handleFinalSubmit = async () => {
    console.log("SENDING TO API:", questions);
    if (!testTitle || questions.length === 0) {
      alert('Test Title aur kam se kam 1 Question hona jaroori hai!');
      return;
    }

    const hasInvalidQuestion = questions.some(q => !q.imageUrl || q.imageUrl === "");
    if (hasInvalidQuestion) {
      alert("One or more questions are missing an image URL!");
      return;
    }

    const testPayload = { title: testTitle, duration: durationMinutes, questions };

    try {
      const res = await fetch('/api/admin/create-test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(testPayload),
      });

      if (res.ok) {
        alert('🎯 Test and questions successfully added to Database!');
        setTestTitle('');
        setQuestions([]);
        setEditingIndex(null);
      } else {
        alert('Server database submission failure caught.');
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-10 flex-grow w-full">
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm mb-8">
        <h1 className="text-2xl font-black text-slate-900 mb-6">👑 Admin Command Dashboard: Create Mock Test</h1>

        {/* Core Metadata Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          <div>
            <label className="text-xs font-bold text-slate-500 uppercase">Test Title Name</label>
            <input
              type="text" value={testTitle} onChange={(e) => setTestTitle(e.target.value)}
              placeholder="e.g., NEET Full Syllabus Mock Test - 01"
              className="w-full mt-1 p-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none text-sm font-medium"
            />
          </div>
          <div>
            <label className="text-xs font-bold text-slate-500 uppercase">Duration (Minutes)</label>
            <input
              type="number" value={durationMinutes} onChange={(e) => setDurationMinutes(Number(e.target.value))}
              className="w-full mt-1 p-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none text-sm font-medium"
            />
          </div>
        </div>

        {/* Individual Add/Edit Question Sector */}
        <div className={`p-5 rounded-2xl border mb-6 transition-colors ${editingIndex !== null ? 'bg-amber-50/40 border-amber-200' : 'bg-slate-50 border-slate-200/60'}`}>
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold text-slate-800 text-sm">
              {editingIndex !== null ? `⚠️ Editing Question #${editingIndex + 1}` : '📝 Append New Question Node'}
            </h3>
            {editingIndex !== null && (
              <button
                onClick={() => {
                  setEditingIndex(null);
                  setCurrentQ({ imageUrl: '', options: ['', '', '', ''], correctOptionIndex: 0, subject: 'Biology', topic: '' });
                }}
                className="text-xs font-bold text-amber-700 bg-amber-100 px-2 py-1 rounded"
              >
                Cancel Edit
              </button>
            )}
          </div>

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
              type="text" placeholder="Topic (e.g., Thermodynamics)" value={currentQ.topic}
              onChange={(e) => setCurrentQ({ ...currentQ, topic: e.target.value })}
              className="p-2.5 bg-white border border-slate-200 rounded-lg text-xs font-medium outline-none"
            />
          </div>

          {/* <input 
            placeholder="Add question image"
            type='file'
            value={currentQ.imageUrl} onChange={(e) => setCurrentQ({...currentQ, imageUrl: e.target.value})}
            className="w-full p-3 rounded-xl border border-slate-200 text-sm font-medium outline-none mb-4"
          /> */}
          <UploadForm onFileChange={(file) => setImageFile(file)} />

          {previewUrl ? (
            <div className="mb-4 flex justify-center">
              <img src={previewUrl} alt="Preview" className="max-w-full max-h-56 object-contain rounded-lg border border-slate-200 shadow-sm" />
            </div>
          ) : (
            <p className="text-xs text-slate-500 mb-4">No image selected</p>
          )}

          {/* Options Quadrant mapping */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
            {currentQ.options.map((opt, i) => (
              <input
                key={i} type="text" placeholder={`Option ${String.fromCharCode(65 + i)}`}
                value={opt} onChange={(e) => handleOptionChange(i, e.target.value)}
                className="p-3 bg-white border border-slate-200 rounded-xl text-xs font-medium outline-none"
              />
            ))}
          </div>

          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-500">Correct Answer:</span>
              <select
                value={currentQ.correctOptionIndex} onChange={(e) => setCurrentQ({ ...currentQ, correctOptionIndex: Number(e.target.value) })}
                className="p-1.5 bg-white border border-slate-200 rounded-md text-xs font-bold"
              >
                <option value={0}>Option A</option>
                <option value={1}>Option B</option>
                <option value={2}>Option C</option>
                <option value={3}>Option D</option>
              </select>
            </div>
            <button
              type="button" onClick={addQuestionToFormList}
              className={`px-4 py-2 text-white font-bold text-xs rounded-lg transition-colors ${editingIndex !== null ? 'bg-amber-600 hover:bg-amber-700' : 'bg-slate-800 hover:bg-slate-900'}`}
            >
              {editingIndex !== null ? '💾 Update Question Node' : '+ Add Question Node'}
            </button>
          </div>
        </div>

        {/* Live Preview List Stack Component */}
        {questions.length > 0 && (
          <div className="mb-6 border border-slate-100 rounded-2xl p-4 bg-white shadow-inner">
            <h3 className="text-xs font-black text-slate-400 uppercase tracking-wider mb-3">Live Test Stack Preview</h3>
            <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
              {questions.map((q, idx) => (
                <div key={idx} className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex justify-between items-start gap-4">
                  <div className="text-xs">
                    <p className="font-bold text-slate-800">
                      <span className="text-slate-400 mr-1">#{idx + 1}</span> {q.imageUrl}
                    </p>
                    <span className="text-[10px] mt-1 inline-block bg-blue-50 text-blue-600 px-1.5 py-0.5 rounded font-bold">{q.subject}</span>
                    {q.topic && <span className="text-[10px] mt-1 inline-block bg-slate-200 text-slate-600 px-1.5 py-0.5 rounded font-medium ml-1">{q.topic}</span>}
                  </div>
                  <div className="flex gap-2 shrink-0">
                    <button
                      onClick={() => startEditQuestion(idx)}
                      className="p-1 text-xs font-bold text-blue-600 hover:bg-blue-50 rounded"
                    >
                      ✏️ Edit
                    </button>
                    <button
                      onClick={() => removeQuestionFromList(idx)}
                      className="p-1 text-xs font-bold text-red-600 hover:bg-red-50 rounded"
                    >
                      🗑️ Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Live Manifest Preview Trace Count */}
        <div className="border-t border-slate-100 pt-4 flex justify-between items-center">
          <span className="text-xs font-bold text-slate-500">
            Total Questions Stacked: <span className="text-blue-600 font-extrabold">{questions.length}</span>
          </span>
          <button
            onClick={handleFinalSubmit}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm rounded-xl shadow-md transition-all active:scale-95"
          >
            🚀 Push Complete Test to Cloud
          </button>
        </div>
      </div>
    </div>
  );
}

export default function AdminAddTestPage() {
  return (
    <SessionProvider>
      <AdminAddTestContent />
    </SessionProvider>
  );
}