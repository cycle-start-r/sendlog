import { auth } from "@/lib/auth";

export default async function SettingsPage() {
  const session = await auth();

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <h1 className="text-2xl font-bold">Settings</h1>

      <div className="bg-white border rounded-xl p-6 space-y-4">
        <h2 className="font-semibold text-slate-900">Account</h2>
        <div>
          <p className="text-sm text-slate-500">Name</p>
          <p className="font-medium">{session?.user?.name ?? "—"}</p>
        </div>
        <div>
          <p className="text-sm text-slate-500">Email</p>
          <p className="font-medium">{session?.user?.email}</p>
        </div>
      </div>

      <div className="bg-white border rounded-xl p-6">
        <h2 className="font-semibold text-slate-900 mb-1">Preferences</h2>
        <p className="text-sm text-slate-400">Grade system preferences and data export coming in Phase 4.</p>
      </div>
    </div>
  );
}
