import { BrowserRouter as Router, Routes, Route } from "react-router";
import HomePage from "@/react-app/pages/Home";
import TeamsPage from "@/react-app/pages/Teams";
import ImportPage from "@/react-app/pages/Import";
import ScoutingPage from "@/react-app/pages/Scouting";

export default function App() {
  return (
    <Router>
      <div className="min-h-screen bg-background">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/teams" element={<TeamsPage />} />
          <Route path="/import" element={<ImportPage />} />
          <Route path="/scouting" element={<ScoutingPage />} />
        </Routes>
      </div>
    </Router>
  );
}
