import { lazy, Suspense } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import { Loader2 } from "lucide-react";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Background from "./components/Background";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

import Landing from "./pages/Landing";
import Login from "./pages/Login";

const Dashboard = lazy(() => import("./pages/Dashboard"));
const Builder = lazy(() => import("./pages/Builder"));
const ResumeView = lazy(() => import("./pages/Resumeview"));
const Prep = lazy(() => import("./pages/Prep"));
const Templates = lazy(() => import("./pages/Templates"));
const Checker = lazy(() => import("./pages/Checker"));
const Todo = lazy(() => import("./pages/Todo"));
const Pricing = lazy(() => import("./pages/Pricing"));
const AiTools = lazy(() => import("./pages/AiTools"));
const Settings = lazy(() => import("./pages/Settings"));
const Progress = lazy(() => import("./pages/Progress"));
const Terms = lazy(() => import("./pages/Terms"));
const Privacy = lazy(() => import("./pages/Privacy"));
const PublicResume = lazy(() => import("./pages/PublicResume"));

const Private = ({ children }) => {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" replace />;
};

function PageLoader() {
  return (
    <div className="flex-1 grid place-items-center py-32 text-ink2">
      <Loader2 className="animate-spin" size={28} />
    </div>
  );
}

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
        <Suspense fallback={<PageLoader />}>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/pricing" element={<Pricing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Login />} />
            <Route path="/reset" element={<Login />} />

            <Route path="/terms" element={<Terms />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/r/:slug" element={<PublicResume />} />

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
            <Route
              path="/settings"
              element={
                <Private>
                  <Settings />
                </Private>
              }
            />
            <Route
              path="/progress"
              element={
                <Private>
                  <Progress />
                </Private>
              }
            />

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
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
