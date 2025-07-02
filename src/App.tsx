import { KanbanBoard } from './components/KanbanBoard';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Button } from './components/ui/button';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import SignIn from './components/SignIn';

function AppContent() {
  const { user, loading, logout } = useAuth();


  if (loading) return <div>Loading...</div>;

  if (!user) return <SignIn />;

  return (
    <div className="min-h-screen !bg-white !w-full ">
     <header className="bg-white shadow-sm !px-5" style={{
          margin: "8px",
        }}>
        <div className="max-w-7xl mx-auto px-4  py-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <h1 className="!text-xs font-semibold text-black ">Team Task Board</h1>
          <Button onClick={logout}>Logout</Button>
        </div>
      </header>
      <main className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8"  style={{
          margin: "8px",
        }}>
        <DndProvider backend={HTML5Backend}>
          <KanbanBoard />
        </DndProvider>
      </main>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}