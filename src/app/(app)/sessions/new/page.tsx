import { NewSessionForm } from "@/components/sessions/SessionForm";

export default function NewSessionPage() {
  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Log a Session</h1>
      <NewSessionForm />
    </div>
  );
}
