import React, { useMemo } from 'react';
import { useUserStore } from '../store/userStore';
import { Activity, Target, Calendar, TrendingUp, Dumbbell, Bot } from 'lucide-react';
import { WeightProgressionGraph } from '../components/WeightProgressionGraph';
import { SkeletonLoader } from '../components/SkeletonLoader';
import defaultExercises from '../data/fitness_exercises.json';

export function HomePage() {
  const { userData, workoutLogs, programs, customExercises, isLoadingData } = useUserStore();

  const allExercises = useMemo(() => {
    return [...defaultExercises, ...(customExercises || [])];
  }, [customExercises]);

  // Calculate workouts completed this week
  const getWorkoutsThisWeek = () => {
    const today = new Date();
    const startOfWeek = new Date(today.setDate(today.getDate() - today.getDay()));
    startOfWeek.setHours(0, 0, 0, 0);

    return workoutLogs.filter(log => {
      const logDate = new Date(log.date);
      return logDate >= startOfWeek;
    }).length;
  };

  const workoutsThisWeek = getWorkoutsThisWeek();
  const progressPercentage = Math.min((workoutsThisWeek / (userData?.weeklyWorkoutGoal || 1)) * 100, 100);

  if (isLoadingData) {
    return (
      <div className="space-y-16">
        <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-2xl shadow-soft p-4 sm:p-8 border border-white/20 dark:border-gray-700/50">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-7 h-7 bg-gray-300 dark:bg-gray-600 rounded animate-pulse" />
            <SkeletonLoader className="w-48 h-7" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-8">
            <SkeletonLoader variant="card" />
            <SkeletonLoader variant="card" />
          </div>
        </div>
        <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-2xl shadow-soft p-4 sm:p-8 border border-white/20 dark:border-gray-700/50">
          <SkeletonLoader variant="chart" className="h-96" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-16">
      <div className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-md rounded-2xl shadow-soft p-3 xs:p-4 sm:p-6 lg:p-8 border border-white/30 dark:border-gray-700/50 transition-all duration-300 hover:shadow-medium animate-slide-up">
        {/* AI Coach Help Note */}
        <div className="mb-6 xs:mb-8 p-3 xs:p-4 bg-blue-50/80 dark:bg-blue-900/20 backdrop-blur-sm rounded-xl border border-blue-200/50 dark:border-blue-800/50 shadow-soft">
          <div className="flex items-center gap-2 xs:gap-3">
            <div className="w-6 h-6 xs:w-7 xs:h-7 bg-gradient-to-r from-primary to-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
              <Bot className="w-3 h-3 xs:w-4 xs:h-4 text-white icon-crisp" />
            </div>
            <p className="text-xs xs:text-sm text-blue-700 dark:text-blue-300 font-medium leading-relaxed">
              If you're confused about the app, just ask the AI coach for help anytime!
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 xs:gap-3 mb-6 xs:mb-8">
          <Activity className="h-5 w-5 xs:h-6 xs:w-6 sm:h-7 sm:w-7 text-primary icon-crisp" />
          <h2 className="responsive-heading font-bold font-poppins text-gray-900 dark:text-white transition-all duration-300">
            Weekly Progress
          </h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 xs:gap-4 sm:gap-6 lg:gap-8">
          <div className="bg-primary/5 dark:bg-primary/10 backdrop-blur-md rounded-xl p-3 xs:p-4 sm:p-6 shadow-soft hover:bg-primary/10 dark:hover:bg-primary/20 transition-all duration-300 hover:shadow-medium hover:scale-[1.01] border border-primary/10 animate-slide-up">
            <div className="flex items-center gap-2 xs:gap-3 mb-3 xs:mb-4">
              <Target className="h-4 w-4 xs:h-5 xs:w-5 text-primary icon-crisp" />
              <h3 className="font-bold text-sm xs:text-base sm:text-lg font-poppins text-gray-900 dark:text-white transition-all duration-300">Weekly Goal</h3>
            </div>
            <div className="space-y-3 xs:space-y-4">
              <p className="text-xs xs:text-sm sm:text-base text-gray-700 dark:text-gray-300 font-medium transition-all duration-300">
                Target: {userData?.weeklyWorkoutGoal} workouts to complete this week
              </p>
              <div className="relative pt-1">
                <div className="flex mb-1 xs:mb-2 items-center justify-between">
                  <div>
                    <span className="text-xs font-semibold inline-block py-0.5 xs:py-1 px-1.5 xs:px-2 uppercase rounded-full text-primary bg-primary/10 dark:bg-primary/20">
                      Progress
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-semibold inline-block text-primary">
                      {progressPercentage.toFixed(0)}%
                    </span>
                  </div>
                </div>
                <div className="overflow-hidden h-2 mb-3 xs:mb-4 text-xs flex rounded-full bg-primary/10 dark:bg-primary/20">
                  <div
                    style={{ width: `${progressPercentage}%` }}
                    className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-gradient-to-r from-primary to-blue-500 transition-all duration-700 ease-out rounded-full"
                  ></div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-primary/5 dark:bg-primary/10 backdrop-blur-md rounded-xl p-3 xs:p-4 sm:p-6 shadow-soft hover:bg-primary/10 dark:hover:bg-primary/20 transition-all duration-300 hover:shadow-medium hover:scale-[1.01] border border-primary/10 animate-slide-up">
            <div className="flex items-center gap-2 xs:gap-3 mb-3 xs:mb-4">
              <Calendar className="h-4 w-4 xs:h-5 xs:w-5 text-primary icon-crisp" />
              <h3 className="font-bold text-sm xs:text-base sm:text-lg font-poppins text-gray-900 dark:text-white transition-all duration-300">Current Week</h3>
            </div>
            <p className="text-xs xs:text-sm sm:text-base text-gray-700 dark:text-gray-300 font-medium mb-2 xs:mb-3 transition-all duration-300">
              Completed: <span className="text-primary">{workoutsThisWeek} workouts</span>
            </p>
            <p className="text-xs xs:text-sm text-gray-600 dark:text-gray-400 transition-all duration-300">
              {workoutsThisWeek >= (userData?.weeklyWorkoutGoal || 0)
                ? "🎉 You've reached your weekly goal!"
                : `${userData?.weeklyWorkoutGoal - workoutsThisWeek} more to reach your goal`}
            </p>
            
            {/* Motivational Microcopy */}
            <div className="mt-2 xs:mt-3 text-center">
              {(() => {
                const remaining = (userData?.weeklyWorkoutGoal || 0) - workoutsThisWeek;
                const progressPercent = progressPercentage;
                
                if (workoutsThisWeek >= (userData?.weeklyWorkoutGoal || 0)) {
                  return (
                    <p className="text-xs xs:text-sm font-medium text-green-600 dark:text-green-400 animate-bounce-gentle success-glow">
                      🌟 Amazing work! You're crushing your goals!
                    </p>
                  );
                } else if (remaining === 1) {
                  return (
                    <p className="text-xs xs:text-sm font-medium text-primary animate-bounce-gentle">
                      You're almost there! 💪 One more to go!
                    </p>
                  );
                } else if (progressPercent >= 75) {
                  return (
                    <p className="text-xs xs:text-sm font-medium text-blue-600 dark:text-blue-400">
                      🔥 So close! Keep up the momentum!
                    </p>
                  );
                } else if (progressPercent >= 50) {
                  return (
                    <p className="text-xs xs:text-sm font-medium text-purple-600 dark:text-purple-400">
                      💜 Halfway there! You've got this!
                    </p>
                  );
                } else if (workoutsThisWeek > 0) {
                  return (
                    <p className="text-xs xs:text-sm font-medium text-orange-600 dark:text-orange-400">
                      🚀 Great start! Every workout counts!
                    </p>
                  );
                } else {
                  return (
                    <p className="text-xs xs:text-sm font-medium text-gray-500 dark:text-gray-400">
                      ✨ Ready to start your fitness journey?
                    </p>
                  );
                }
              })()}
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-md rounded-2xl shadow-soft p-3 xs:p-4 sm:p-6 lg:p-8 border border-white/30 dark:border-gray-700/50 transition-all duration-300 hover:shadow-medium animate-slide-up">
        <div className="flex items-center gap-2 xs:gap-3 mb-6 xs:mb-8">
          <Dumbbell className="h-5 w-5 xs:h-6 xs:w-6 sm:h-7 sm:w-7 text-primary icon-crisp" />
          <h2 className="responsive-heading font-bold font-poppins text-gray-900 dark:text-white transition-all duration-300">
            Weight Progression
          </h2>
        </div>
        <WeightProgressionGraph 
          workoutLogs={workoutLogs} 
          programs={programs} 
          exercises={allExercises}
        />
      </div>
    </div>
  );
}