import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Register from "./pages/register";
import Login from "./pages/login";
import Dashboard from "./pages/dashboard";
import CreateWorkspace from "./pages/CreateWorkspace";
import JoinWorkspace from "./pages/JoinWorkspace";
import { WorkspaceSettings } from "./pages/WorkspaceSettings";
import Workspace from "./pages/Workspace";
import BoardPage from "./pages/BoardPage";
import DashboardPage from "./pages/DashboardPage";
import SettingsPage from "./components/Settings";

function App() {
  return (
      <div className="min-h-screen w-full">
        <Router>
          <Routes>
            <Route path="/" element={<Dashboard />}></Route>
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="/workspace/create" element={<CreateWorkspace />} />
            <Route path="/workspace/join" element={<JoinWorkspace />} />
            <Route path="/workspace/:id" element={<Workspace />} />
            <Route
              path="/workspace/settings/:id"
              element={<WorkspaceSettings />}
            />
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="/board/:boardId" element={<BoardPage />} />
            <Route path="/dashboard" element={<DashboardPage />} />
          </Routes>
        </Router>
      </div>
    
  );
}

export default App;
