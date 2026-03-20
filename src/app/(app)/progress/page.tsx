export default function ProgressPage() {
  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-2">Progress</h1>
      <p className="text-slate-500 text-sm mb-8">Charts and analytics coming in Phase 3.</p>
      <div className="grid grid-cols-1 gap-6">
        <Placeholder label="Grade Pyramid" />
        <Placeholder label="Volume Over Time" />
        <Placeholder label="Activity Calendar" />
      </div>
    </div>
  );
}

function Placeholder({ label }: { label: string }) {
  return (
    <div className="bg-white border-2 border-dashed rounded-xl p-12 text-center">
      <p className="text-slate-400 font-medium">{label}</p>
      <p className="text-slate-300 text-sm mt-1">Coming soon</p>
    </div>
  );
}
