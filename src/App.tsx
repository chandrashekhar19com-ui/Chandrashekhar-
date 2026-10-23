import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { AuthScreen } from './components/AuthScreen';
import { OnboardingModal } from './components/OnboardingModal';
import { AboutAppModal } from './components/AboutAppModal';
import { Sidebar } from './components/Sidebar';
import { Navbar } from './components/Navbar';
import { MobileBottomNav } from './components/MobileBottomNav';

// Views
import { DashboardView } from './views/DashboardView';
import { EducationFieldView } from './views/EducationFieldView';
import { MyLearningView } from './views/MyLearningView';
import { CourseCareerExplorerView } from './views/CourseCareerExplorerView';
import { AcademicLibraryView } from './views/AcademicLibraryView';
import { SkillsCertificationsView } from './views/SkillsCertificationsView';
import { AITutorView } from './views/AITutorView';
import { CurriculumView } from './views/CurriculumView';
import { QuizArenaView } from './views/QuizArenaView';
import { ExamSimulatorView } from './views/ExamSimulatorView';
import { FlashcardsView } from './views/FlashcardsView';
import { StudyPlannerView } from './views/StudyPlannerView';
import { FocusTimerView } from './views/FocusTimerView';
import { PDFLearningView } from './views/PDFLearningView';
import { NotesLibraryView } from './views/NotesLibraryView';
import { VisualLearningView } from './views/VisualLearningView';
import { VoiceLearningView } from './views/VoiceLearningView';
import { WeakTopicsView } from './views/WeakTopicsView';
import { ProgressAnalyticsView } from './views/ProgressAnalyticsView';
import { MissionsRewardsView } from './views/MissionsRewardsView';
import { SettingsView } from './views/SettingsView';

const MainAppContent: React.FC = () => {
  const { isAuthenticated, isOnboarded, activeView, theme } = useApp();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Authentication Flow
  if (!isAuthenticated) {
    return <AuthScreen />;
  }

  // First-time Onboarding Flow
  if (!isOnboarded) {
    return <OnboardingModal />;
  }

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'bg-[#080d1a] text-slate-100' : 'bg-slate-100 text-slate-900'} flex flex-col font-sans transition-colors duration-200`}>
      {/* Background Cosmic Glow Accents */}
      <div className="fixed top-0 left-1/3 w-[500px] h-[500px] bg-cyan-600/5 rounded-full blur-[140px] pointer-events-none" />
      <div className="fixed bottom-0 right-1/4 w-[600px] h-[600px] bg-violet-600/5 rounded-full blur-[160px] pointer-events-none" />

      {/* Desktop Sidebar & Mobile Drawer */}
      <Sidebar
        isOpenMobile={mobileMenuOpen}
        onCloseMobile={() => setMobileMenuOpen(false)}
      />

      {/* Main Workspace Column */}
      <div className="lg:pl-64 flex flex-col min-h-screen">
        {/* Top Sticky Navbar */}
        <Navbar onOpenMobileMenu={() => setMobileMenuOpen(true)} />

        {/* Dynamic Route View */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          {activeView === 'dashboard' && <DashboardView />}
          {activeView === 'education-field' && <EducationFieldView />}
          {activeView === 'my-learning' && <MyLearningView />}
          {activeView === 'career-explorer' && <CourseCareerExplorerView />}
          {activeView === 'library' && <AcademicLibraryView />}
          {activeView === 'skills' && <SkillsCertificationsView />}
          {activeView === 'tutor' && <AITutorView />}
          {activeView === 'curriculum' && <CurriculumView />}
          {activeView === 'quiz' && <QuizArenaView />}
          {activeView === 'exam' && <ExamSimulatorView />}
          {activeView === 'flashcards' && <FlashcardsView />}
          {activeView === 'planner' && <StudyPlannerView />}
          {activeView === 'timer' && <FocusTimerView />}
          {activeView === 'pdf' && <PDFLearningView />}
          {activeView === 'notes' && <NotesLibraryView />}
          {activeView === 'visual' && <VisualLearningView />}
          {activeView === 'voice' && <VoiceLearningView />}
          {activeView === 'weak-topics' && <WeakTopicsView />}
          {activeView === 'analytics' && <ProgressAnalyticsView />}
          {activeView === 'missions' && <MissionsRewardsView />}
          {activeView === 'settings' && <SettingsView />}
          {activeView === 'profile' && <SettingsView />}
        </main>

        {/* Mobile Bottom Navigation Bar */}
        <MobileBottomNav />
      </div>

      {/* Global Modals */}
      <AboutAppModal />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainAppContent />
    </AppProvider>
  );
}
