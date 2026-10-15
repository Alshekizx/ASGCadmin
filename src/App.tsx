import SupabaseAuth from "./components/SupabaseAuth";
import { supabase } from "./lib/supabase";
import LoadingIndicator from "./components/LoadingIndicator";
import { useState } from "react";
import type { AdminPage } from "./types/admin";
import AdminShell from "./pages/AdminShell";

export default function App() {
  const [currentSection, setCurrentSection] = useState<AdminPage>("dashboard");

  return (
    <>
      <LoadingIndicator navigationKey={currentSection} />
      <SupabaseAuth>
        <AdminShell
          onLogout={() => {
            void supabase?.auth.signOut({ scope: "local" });
          }}
          currentSection={currentSection}
          setCurrentSection={setCurrentSection}
        />
      </SupabaseAuth>
    </>
  );
}
