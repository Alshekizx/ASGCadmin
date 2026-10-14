import { useState } from 'react';
import type { AdminPage } from './types/admin';
import AdminShell from './pages/AdminShell';

export default function App() {
  const [currentSection, setCurrentSection] = useState<AdminPage>('dashboard');

  return (
    <AdminShell
      currentSection={currentSection}
      setCurrentSection={setCurrentSection}
    />
  );
}
