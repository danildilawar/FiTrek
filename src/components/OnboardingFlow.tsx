import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight, ChevronLeft, Target, Zap, Calendar, Bot, Sparkles, CheckCircle, ArrowRight, Dumbbell, TrendingUp, Heart } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface OnboardingFlowProps {
  onComplete: (userData: {
    name: string;
    height: number;
    sex: 'male' | 'female' | 'other';
    fitnessGoal: string;
  }) => void;
}

export function OnboardingFlow({ onComplete }: OnboardingFlowProps) {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [userData, setUserData] = useState({
    name: '',
    height: '',
    sex: 'male',
    fitnessGoal: '',
  });

  const fitnessGoals = [
    {
      id: 'hypertrophy',
      title: 'Build Muscle',
      subtitle: 'Hypertrophy Training',
      description: 'Focus on muscle growth and size',
      icon: Dumbbell,
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-50 dark:bg-blue-900/20',
      borderColor: 'border-blue-200 dark:border-blue-800',
    },
    {
      id: 'strength',
      title: 'Get Stronger',
      subtitle: 'Strength Training',
      description: 'Increase your maximum power and strength',
      icon: Zap,
      color: 'from-yellow-500 to-orange-500',
      bgColor: 'bg-yellow-50 dark:bg-yellow-900/20',
      borderColor: 'border-yellow-200 dark:border-yellow-800',
    },
    {
      id: 'fat_loss',
      title: 'Lose Weight',
      subtitle: 'Fat Loss & Conditioning',
      description: 'Burn fat and improve cardiovascular health',
      icon: Heart,
      color: 'from-red-500 to-pink-500',
      bgColor: 'bg-red-50 dark:bg-red-900/20',
      borderColor: 'border-red-200 dark:border-red-800',
    },
    {
      id: 'general',
      title: 'Stay Fit',
      subtitle: 'General Fitness',
      description: 'Maintain overall health and wellness',
      icon: TrendingUp,
      color: 'from-green-500 to-emerald-500',
      bgColor: 'bg-green-50 dark:bg-green-900/20',
      borderColor: 'border-green-200 dark:border-green-800',
    },
  ];

  const features = [
    {
      icon: Bot,
      title: 'AI Coach',
      description: 'Get personalized guidance and answers to your fitness questions 24/7',
      action: 'Ask anything about exercises, form, or nutrition',
    },
    {
      icon: Calendar,
      title: 'Workout Logging',
      description: 'Track your exercises, sets, reps, and weights to monitor progress',
      action: 'Log your workouts and see your strength gains',
    },
    {
      icon: TrendingUp,
      title: 'Progress Tracking',
      description: 'Visualize your improvements with detailed charts and analytics',
      action: 'Watch your progress grow over time',
    },
  ];

  const nextStep = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleComplete = () => {
    // Create the user profile in Supabase when onboarding completes
    createUserProfile();
    onComplete({
      name: userData.name,
      height: Number(userData.height),
      sex: userData.sex as 'male' | 'female' | 'other',
      fitnessGoal: userData.fitnessGoal,
    });
  };

  const handleCompleteWithRedirect = (redirectTo: string) => {
    // Create the user profile in Supabase when onboarding completes
    createUserProfile();
    onComplete({
      name: userData.name,
      height: Number(userData.height),
      sex: userData.sex as 'male' | 'female' | 'other',
      fitnessGoal: userData.fitnessGoal,
    });
    navigate(redirectTo);
  };

  const createUserProfile = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { error } = await supabase
        .from('users')
        .insert([
          {
            id: user.id,
            email: user.email,
            name: userData.name,
            height: Number(userData.height),
            sex: userData.sex,
            weight_unit: 'Kgs',
            weekly_workout_goal: 3,
            notifications: {
              workoutReminders: true,
              progressUpdates: true,
              newFeatures: true,
            }
          }
        ]);

      if (error) {
        console.error('Error creating user profile:', error);
      }
    } catch (error) {
      console.error('Error in createUserProfile:', error);
    }
  };
  const canProceed = () => {
    switch (currentStep) {
      case 0: return true; // Welcome screen
      case 1: return userData.name && userData.height && userData.sex; // Basic info
      case 2: return userData.fitnessGoal; // Goal selection
      case 3: return true; // Feature walkthrough
      case 4: return true; // Action screen
      default: return false;
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className="text-center space-y-8 animate-fade-in">
            <div className="space-y-4">
              <div className="flex justify-center">
                <div className="w-20 h-20 bg-gradient-to-r from-primary to-blue-500 rounded-full flex items-center justify-center shadow-glow">
                  <Sparkles className="w-10 h-10 text-white" />
                </div>
              </div>
              <h1 className="text-3xl sm:text-4xl font-bold font-poppins bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
                Welcome to FiTrek
              </h1>
              <p className="text-lg text-gray-600 dark:text-gray-300 max-w-md mx-auto leading-relaxed">
                Your personal fitness companion powered by AI. Let's get you started on your fitness journey!
              </p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-2xl mx-auto">
              <div className="bg-primary/5 dark:bg-primary/10 rounded-xl p-4 border border-primary/20">
                <Target className="w-6 h-6 text-primary mx-auto mb-2" />
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Set Goals</p>
              </div>
              <div className="bg-primary/5 dark:bg-primary/10 rounded-xl p-4 border border-primary/20">
                <Bot className="w-6 h-6 text-primary mx-auto mb-2" />
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300">AI Coaching</p>
              </div>
              <div className="bg-primary/5 dark:bg-primary/10 rounded-xl p-4 border border-primary/20">
                <TrendingUp className="w-6 h-6 text-primary mx-auto mb-2" />
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Track Progress</p>
              </div>
            </div>
          </div>
        );

      case 1:
        return (
          <div className="space-y-8 animate-slide-up">
            <div className="text-center space-y-4">
              <div className="flex justify-center">
                <div className="w-16 h-16 bg-gradient-to-r from-primary to-blue-500 rounded-full flex items-center justify-center">
                  <Target className="w-8 h-8 text-white" />
                </div>
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold font-poppins text-gray-900 dark:text-white">
                Tell us about yourself
              </h2>
              <p className="text-gray-600 dark:text-gray-300">
                Help us personalize your fitness experience
              </p>
            </div>

            <div className="space-y-6 max-w-md mx-auto">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  What's your name?
                </label>
                <input
                  type="text"
                  id="name"
                  className="input-field"
                  placeholder="Enter your name"
                  value={userData.name}
                  onChange={(e) => setUserData({ ...userData, name: e.target.value })}
                />
              </div>

              <div>
                <label htmlFor="height" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Height (cm)
                </label>
                <input
                  type="number"
                  id="height"
                  className="input-field"
                  placeholder="Enter your height"
                  value={userData.height}
                  onChange={(e) => setUserData({ ...userData, height: e.target.value })}
                />
              </div>

              <div>
                <label htmlFor="sex" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Sex
                </label>
                <select
                  id="sex"
                  className="input-field"
                  value={userData.sex}
                  onChange={(e) => setUserData({ ...userData, sex: e.target.value })}
                >
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-8 animate-slide-up">
            <div className="text-center space-y-4">
              <div className="flex justify-center">
                <div className="w-16 h-16 bg-gradient-to-r from-primary to-blue-500 rounded-full flex items-center justify-center">
                  <Target className="w-8 h-8 text-white" />
                </div>
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold font-poppins text-gray-900 dark:text-white">
                What's your fitness goal?
              </h2>
              <p className="text-gray-600 dark:text-gray-300">
                Choose your primary focus to get personalized recommendations
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl mx-auto">
              {fitnessGoals.map((goal) => {
                const Icon = goal.icon;
                const isSelected = userData.fitnessGoal === goal.id;
                
                return (
                  <button
                    key={goal.id}
                    onClick={() => setUserData({ ...userData, fitnessGoal: goal.id })}
                    className={`p-6 rounded-2xl border-2 transition-all duration-300 text-left hover:scale-105 active:scale-95 ${
                      isSelected
                        ? `${goal.bgColor} ${goal.borderColor} shadow-medium`
                        : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:border-primary/50'
                    }`}
                  >
                    <div className="flex items-start gap-4">
                      <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${goal.color} flex items-center justify-center shadow-soft`}>
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-1">
                          {goal.title}
                        </h3>
                        <p className="text-sm font-medium text-primary mb-2">
                          {goal.subtitle}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {goal.description}
                        </p>
                      </div>
                      {isSelected && (
                        <CheckCircle className="w-6 h-6 text-primary animate-scale-in" />
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-8 animate-slide-up">
            <div className="text-center space-y-4">
              <div className="flex justify-center">
                <div className="w-16 h-16 bg-gradient-to-r from-primary to-blue-500 rounded-full flex items-center justify-center">
                  <Sparkles className="w-8 h-8 text-white" />
                </div>
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold font-poppins text-gray-900 dark:text-white">
                Discover FiTrek Features
              </h2>
              <p className="text-gray-600 dark:text-gray-300">
                Here's how FiTrek will help you achieve your fitness goals
              </p>
            </div>

            <div className="space-y-6 max-w-2xl mx-auto">
              {features.map((feature, index) => {
                const Icon = feature.icon;
                
                return (
                  <div
                    key={index}
                    className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 shadow-soft hover:shadow-medium transition-all duration-300 animate-slide-up"
                    style={{ animationDelay: `${index * 150}ms` }}
                  >
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-gradient-to-r from-primary to-blue-500 rounded-xl flex items-center justify-center shadow-soft">
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-2">
                          {feature.title}
                        </h3>
                        <p className="text-gray-600 dark:text-gray-400 mb-3">
                          {feature.description}
                        </p>
                        <p className="text-sm font-medium text-primary">
                          {feature.action}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-8 animate-slide-up">
            <div className="text-center space-y-4">
              <div className="flex justify-center">
                <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center">
                  <CheckCircle className="w-8 h-8 text-white" />
                </div>
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold font-poppins text-gray-900 dark:text-white">
                You're all set, {userData.name}!
              </h2>
              <p className="text-gray-600 dark:text-gray-300">
                Ready to start your fitness journey? Choose your first action
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl mx-auto">
              <div className="bg-gradient-to-br from-primary/5 to-blue-50 dark:from-primary/10 dark:to-blue-900/20 rounded-2xl p-6 border border-primary/20">
                <div className="text-center space-y-4 h-full flex flex-col">
                  <div className="w-12 h-12 bg-gradient-to-r from-primary to-blue-500 rounded-xl flex items-center justify-center mx-auto">
                    <Bot className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="font-bold text-lg text-gray-900 dark:text-white">
                    Chat with Coach FiTrek
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 flex-grow">
                    Ask questions about exercises, get workout recommendations, or learn about proper form
                  </p>
                  <button
                    onClick={() => handleCompleteWithRedirect('/ai-assistant')}
                    className="button-primary w-full flex items-center justify-center gap-2"
                  >
                    Start Chatting
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-2xl p-6 border border-green-200 dark:border-green-800">
                <div className="text-center space-y-4 h-full flex flex-col">
                  <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center mx-auto">
                    <Calendar className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="font-bold text-lg text-gray-900 dark:text-white">
                    Log Your First Workout
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 flex-grow">
                    Start tracking your progress by logging your exercises, sets, and reps
                  </p>
                  <button
                    onClick={handleComplete}
                    className="w-full bg-gradient-to-r from-green-500 to-emerald-500 text-white font-semibold py-3 px-4 rounded-2xl hover:from-green-600 hover:to-emerald-600 transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-soft hover:shadow-medium flex items-center justify-center gap-2"
                  >
                    Start Logging
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            <div className="text-center">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                You can always access these features from the navigation bar below
              </p>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-soft dark:bg-gradient-soft-dark flex flex-col">
      {/* Progress Bar */}
      <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-md border-b border-white/30 dark:border-gray-700/50 p-4">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
              Step {currentStep + 1} of 5
            </span>
            <span className="text-sm font-medium text-primary">
              {Math.round(((currentStep + 1) / 5) * 100)}%
            </span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <div
              className="bg-gradient-to-r from-primary to-blue-500 h-2 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${((currentStep + 1) / 5) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center p-4 sm:p-6">
        <div className="w-full max-w-4xl">
          {renderStep()}
        </div>
      </div>

      {/* Navigation */}
      <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-md border-t border-white/30 dark:border-gray-700/50 p-4">
        <div className="max-w-2xl mx-auto flex justify-between items-center">
          <button
            onClick={prevStep}
            disabled={currentStep === 0}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all duration-300 ${
              currentStep === 0
                ? 'text-gray-400 dark:text-gray-600 cursor-not-allowed'
                : 'text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-primary hover:bg-primary/5 dark:hover:bg-primary/10'
            }`}
          >
            <ChevronLeft className="w-4 h-4" />
            Back
          </button>

          {currentStep < 4 ? (
            <button
              onClick={nextStep}
              disabled={!canProceed()}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 active:scale-95 ${
                canProceed()
                  ? 'bg-gradient-to-r from-primary to-blue-500 text-white shadow-soft hover:shadow-medium'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-400 dark:text-gray-600 cursor-not-allowed'
              }`}
            >
              Continue
              <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <div className="text-sm text-gray-500 dark:text-gray-400">
              Choose an action above to get started
            </div>
          )}
        </div>
      </div>
    </div>
  );
}