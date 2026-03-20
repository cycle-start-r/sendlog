import { auth, signOut } from "@/lib/auth";
import { LogOut, User } from "lucide-react";
import { MobileNav } from "./MobileNav";

export async function Header() {
  const session = await auth();

  return (
    <header className="bg-white border-b px-4 py-3 flex items-center justify-between">
      <MobileNav />

      <div className="flex-1" />

      <div className="flex items-center gap-3">
        <span className="text-sm text-slate-600 hidden sm:block">
          {session?.user?.name ?? session?.user?.email}
        </span>

        <div className="flex items-center gap-1">
          <div className="w-8 h-8 rounded-full bg-brand-100 flex items-center justify-center">
            <User className="w-4 h-4 text-brand-600" />
          </div>

          <form
            action={async () => {
              "use server";
              await signOut({ redirectTo: "/login" });
            }}
          >
            <button
              type="submit"
              className="p-2 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors"
              title="Sign out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </header>
  );
}
