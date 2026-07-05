// src/components/UploadForm.tsx
'use client';

export default function UploadForm({ onFileChange }: { onFileChange: (f: File | null) => void }) {
  return (
    <input 
      type="file" 
      accept="image/*"
      onChange={(e) => {
        const file = e.target.files?.[0] || null;
        onFileChange(file);
      }}
      className="w-full p-3 rounded-xl border border-slate-200 text-sm mb-4"
    />
  );
}