import { useState } from 'react';
import { Dashboard } from '@/pages/Dashboard';
import { LandingPage } from '@/pages/LandingPage';

function App() {
  const [view, setView] = useState<'landing' | 'dashboard'>('landing');

  return (
    <div className="bg-[#020617] min-h-screen text-white">
      {view === 'landing' ? (
        <LandingPage onStart={() => setView('dashboard')} />
      ) : (
        <Dashboard />
      )}
    </div>
  );
}

export default App;
