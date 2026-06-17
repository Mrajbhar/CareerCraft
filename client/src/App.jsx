import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Background from "./components/Background";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Builder from "./pages/Builder";
import ResumeView from "./pages/ResumeView";
import Prep from "./pages/Prep";
import Templates from "./pages/Templates";
import Checker from "./pages/Checker";
import Todo from "./pages/Todo";
import Pricing from "./pages/Pricing";
import AiTools from "./pages/AiTools";

const Private = ({ children }) => {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" replace />;
};

function Shell() {
  const { pathname } = useLocation();
  const hideFooter =
    pathname.startsWith("/builder") ||
    pathname === "/login" ||
    pathname === "/signup";

  return (
    <div className="min-h-screen flex flex-col">
      <Background />
      <Navbar />
      <main className="flex-1 flex flex-col">
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Login />} />
          <Route path="/reset" element={<Login />} />

          <Route
            path="/dashboard"
            element={
              <Private>
                <Dashboard />
              </Private>
            }
          />
          <Route
            path="/templates"
            element={
              <Private>
                <Templates />
              </Private>
            }
          />
          <Route
            path="/builder/:id"
            element={
              <Private>
                <Builder />
              </Private>
            }
          />
          <Route
            path="/resume/:id"
            element={
              <Private>
                <ResumeView />
              </Private>
            }
          />
          <Route
            path="/prep"
            element={
              <Private>
                <Prep />
              </Private>
            }
          />
          <Route
            path="/checker"
            element={
              <Private>
                <Checker />
              </Private>
            }
          />
          <Route
            path="/todos"
            element={
              <Private>
                <Todo />
              </Private>
            }
          />
          <Route
            path="/ai-tools"
            element={
              <Private>
                <AiTools />
              </Private>
            }
          />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      {!hideFooter && <Footer />}
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Shell />
      </BrowserRouter>
    </AuthProvider>
  );
}
