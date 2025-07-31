import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { NavigationBar } from './components/NavigationBar';
import { HomePage } from './pages/HomePage';
import { ConfigCheckPage } from './pages/ConfigCheckPage';
import { ExerciseLogPage } from './pages/ExerciseLogPage';
import { AIAssistantPage } from './pages/AIAssistantPage';
import { WorkoutLogPage } from './pages/WorkoutLogPage';
import { ProfilePage } from './pages/ProfilePage';
import { LoginForm } from './components/LoginForm';
import { OnboardingFlow } from './components/OnboardingFlow';
import { useUserStore } from './store/userStore';
import { supabase } from './lib/supabase';
import { Dumbbell } from 'lucide-react';
import { Toast } from './components/Toast';

function App() {
  const { userData, isDarkMode, isAuthenticated, loadUserData, setUserData } = useUserStore();
  const [isLoading, setIsLoading] = useState(true);
  const [showOnboarding, setShowOnboarding] = useState(false);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  useEffect(() => {
    // Check initial auth state
    const checkAuth = async () => {
      console.log('🔍 Checking auth state...');
      try {
        const { data: { session } } = await supabase.auth.getSession();
        console.log('📋 Session:', session ? 'exists' : 'none');
        if (session) {
          console.log('✅ User authenticated, setting auth state');
          useUserStore.setState({ isAuthenticated: true });
          console.log('📊 Loading user data...');
          await loadUserData();
          
          // Check if user needs onboarding (no user data means first time)
          const currentUserData = useUserStore.getState().userData;
          console.log('👤 Current user data:', currentUserData);
          if (!currentUserData || !currentUserData.name) {
            console.log('🚀 No user data found, showing onboarding');
            setShowOnboarding(true);
          } else {
            console.log('✅ User data exists, skipping onboarding');
          }
        } else {
          console.log('❌ No session found');
        }
      } catch (error) {
        console.error('Error checking auth state:', error);
      } finally {
        console.log('🏁 Auth check complete, setting loading to false');
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [loadUserData]);

  const handleOnboardingComplete = (onboardingData: {
    name: string;
    height: number;
    sex: 'male' | 'female' | 'other';
    fitnessGoal: string;
  }) => {
    setUserData({
      name: onboardingData.name,
      height: onboardingData.height,
      sex: onboardingData.sex,
      email: '', // Will be filled from auth
      weightUnit: 'Kgs',
      notifications: {
        workoutReminders: true,
        progressUpdates: true,
        newFeatures: true,
      },
      weeklyWorkoutGoal: 3,
    });
    setShowOnboarding(false);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background-light dark:bg-background-dark flex items-center justify-center">
        <div className="text-center">
          <Dumbbell className="h-12 w-12 text-primary mx-auto mb-4 animate-pulse" />
          <p className="text-gray-600 dark:text-gray-300">Loading FiTrek...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <LoginForm onComplete={() => {}} />;
  }

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gradient-soft dark:bg-gradient-soft-dark flex flex-col transition-all duration-500">
        {showOnboarding ? (
          <OnboardingFlow onComplete={handleOnboardingComplete} />
        ) : (
          <>
            <header className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-md shadow-soft border-b border-white/30 dark:border-gray-700/50 sticky top-0 z-40">
              <div className="max-w-7xl mx-auto px-3 xs:px-4 py-3 xs:py-4 sm:py-6 sm:px-6 lg:px-8 flex justify-between items-center">
                <div className="flex flex-col">
                  <span className="text-2xl xs:text-3xl sm:text-4xl lg:text-5xl font-montserrat font-bold bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent transition-all duration-300">
                    FiTrek
                  </span>
                  <span className="text-xs xs:text-sm sm:text-lg lg:text-xl text-gray-600 dark:text-gray-300 mt-0.5 xs:mt-1 sm:mt-2 transition-all duration-300 truncate">
                    Welcome back, {userData?.name}
                  </span>
                </div>
              </div>
            </header>
            
            <main className="flex-grow max-w-7xl mx-auto px-3 xs:px-4 py-3 xs:py-4 sm:py-6 sm:px-6 lg:px-8 pb-20 xs:pb-24 transition-all duration-500 animate-fade-in">
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/config-check" element={<ConfigCheckPage />} />
                <Route path="/exercise-log" element={<ExerciseLogPage />} />
                <Route path="/workout-log" element={<WorkoutLogPage />} />
                <Route path="/ai-assistant" element={<AIAssistantPage />} />
                <Route path="/profile" element={<ProfilePage />} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </main>

            <NavigationBar />
          </>
        )}
        <Toast />
      </div>
    </BrowserRouter>
  );
}

export default App;