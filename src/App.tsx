import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Portfolio from './pages/Portfolio';
import Admin from './pages/Admin';
import InternshipsPage from './pages/Internships';
import CertificationsPage from './pages/Certifications';
import ProjectsPage from './pages/Projects';
import SkillsPage from './pages/Skills';
import AchievementsPage from './pages/Achievements';

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Portfolio />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/internships" element={<InternshipsPage />} />
        <Route path="/certifications" element={<CertificationsPage />} />
        <Route path="/projects" element={<ProjectsPage />} />
        <Route path="/skills" element={<SkillsPage />} />
        <Route path="/achievements" element={<AchievementsPage />} />
      </Routes>
    </Router>
  );
}
