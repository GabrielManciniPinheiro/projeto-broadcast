import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./hooks/useAuth";
import { AuthPage } from "./features/auth/AuthPage";
import { ConnectionsPage } from "./features/connections/ConnectionsPage";
import { ContactsPage } from "./features/contacts/ContactsPage";
import { MessagesPage } from "./features/messages/MessagesPage";

function PrivateRoute({ children }: { children: JSX.Element }) {
  const { user, loading } = useAuth();
  if (loading)
    return (
      <div className="flex h-screen items-center justify-center">
        Carregando...
      </div>
    );
  return user ? children : <Navigate to="/" />;
}

function App() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        Carregando...
      </div>
    );
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={user ? <Navigate to="/connections" /> : <AuthPage />}
        />

        <Route
          path="/connections"
          element={
            <PrivateRoute>
              <ConnectionsPage />
            </PrivateRoute>
          }
        />

        <Route
          path="/connections/:connectionId/contacts"
          element={
            <PrivateRoute>
              <ContactsPage />
            </PrivateRoute>
          }
        />

        <Route
          path="/connections/:connectionId/messages"
          element={
            <PrivateRoute>
              <MessagesPage />
            </PrivateRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
