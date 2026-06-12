import { Routes, Route, Navigate } from 'react-router-dom';

// App 1: Patient Questionnaire — public pages
import LandingPage      from './questionnaire/LandingPage';
import QuestionnairePage from './questionnaire/QuestionnairePage';
import ThankYouPage     from './questionnaire/ThankYouPage';

// App 1: Admin Portal — protected pages
import AdminLoginPage   from './questionnaire/admin/LoginPage';
import AdminDashboard   from './questionnaire/admin/Dashboard';
import SubmissionDetail from './questionnaire/admin/SubmissionDetail';

// App 2: Clinical Notes — standalone application
import ClinicalNotesPage from './clinical-notes/ClinicalNotesPage';

// Shared auth guard
import ProtectedRoute from './shared/ProtectedRoute';

export default function App() {
  return (
    <Routes>
      {/* ── App 1: Patient Questionnaire ── */}
      <Route path="/"             element={<LandingPage />} />
      <Route path="/questionnaire" element={<QuestionnairePage />} />
      <Route path="/thank-you"    element={<ThankYouPage />} />

      {/* ── App 1: Admin Portal ── */}
      <Route path="/admin/login" element={<AdminLoginPage />} />
      <Route
        path="/admin"
        element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>}
      />
      <Route
        path="/admin/submissions/:id"
        element={<ProtectedRoute><SubmissionDetail /></ProtectedRoute>}
      />

      {/* ── App 2: Clinical Notes (completely independent) ── */}
      <Route path="/notes" element={<ClinicalNotesPage />} />

      {/* Catch-all */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
