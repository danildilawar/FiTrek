import React, { useState, useMemo } from 'react';
import { Dumbbell, Search, Plus, Filter, PlusCircle, Pencil, Trash2, User, Users, Zap, Mountain, Flame, Activity } from 'lucide-react';
import { useUserStore } from '../store/userStore';
import { WorkoutForm } from '../components/WorkoutForm';
import { WorkoutCard } from '../components/WorkoutCard';
import { CustomExerciseForm } from '../components/CustomExerciseForm';
import { WorkoutTemplates } from '../components/WorkoutTemplates';
import { WorkoutCardSkeleton, ExerciseCardSkeleton, SkeletonLoader } from '../components/SkeletonLoader';
import type { WorkoutProgram, CustomExercise } from '../types';
import exercises from '../data/fitness_exercises.json';

export function ExerciseLogPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [showWorkoutForm, setShowWorkoutForm] = useState(false);
  const [showWorkoutTemplates, setShowWorkoutTemplates] = useState(false);
  const [showCustomExerciseForm, setShowCustomExerciseForm] = useState(false);
  const [editingWorkout, setEditingWorkout] = useState<WorkoutProgram | null>(null);
  const [editingCustomExercise, setEditingCustomExercise] = useState<CustomExercise | null>(null);
  const [selectedFilter, setSelectedFilter] = useState<string>('all');

  const {
    programs,
    customExercises,
    isLoadingData,
    addProgram,
    editProgram,
    deleteProgram,
    addCustomExercise,
    editCustomExercise,
    deleteCustomExercise,
  } = useUserStore();

  const allExercises = useMemo(() => {
    return [...exercises, ...customExercises];
  }, [customExercises]);

  const filteredExercises = useMemo(() => {
    const query = searchQuery.toLowerCase().trim();
    let filtered = allExercises;

    if (selectedFilter !== 'all') {
      filtered = filtered.filter(exercise => exercise.muscle_group === selectedFilter);
    }

    if (!query) return filtered;

    return filtered.filter((exercise) => 
      exercise.name.toLowerCase().includes(query) ||
      exercise.muscle_group.toLowerCase().includes(query) ||
      exercise.equipment.toLowerCase().includes(query) ||
      exercise.difficulty.toLowerCase().includes(query)
    );
  }, [searchQuery, selectedFilter, allExercises]);

  const muscleGroups = useMemo(() => {
    const groups = new Set([
      ...exercises.map(ex => ex.muscle_group),
      ...customExercises.map(ex => ex.muscle_group)
    ]);
    return Array.from(groups);
  }, [customExercises]);

  const getMuscleGroupIcon = (muscleGroup: string) => {
    switch (muscleGroup.toLowerCase()) {
      case 'chest':
        return User; // Represents chest/torso area
      case 'back':
        return Users; // Represents back muscles/broader back
      case 'legs':
        return Activity; // Represents leg movement/activity
      case 'shoulders':
        return Mountain;
      case 'arms':
        return Zap;
      default:
        return Dumbbell;
    }
  };
  const handleSaveWorkout = (workout: WorkoutProgram) => {
    if (editingWorkout) {
      editProgram(workout);
    } else {
      addProgram(workout);
    }
    setShowWorkoutForm(false);
    setEditingWorkout(null);
  };

  const handleEditWorkout = (workout: WorkoutProgram) => {
    setEditingWorkout(workout);
    setShowWorkoutForm(true);
  };

  const handleCancelWorkout = () => {
    setShowWorkoutForm(false);
    setShowWorkoutTemplates(false);
    setEditingWorkout(null);
  };

  const handleSaveCustomExercise = (exercise: CustomExercise) => {
    if (editingCustomExercise) {
      editCustomExercise(exercise);
    } else {
      addCustomExercise(exercise);
    }
    setShowCustomExerciseForm(false);
    setEditingCustomExercise(null);
  };

  const handleEditCustomExercise = (exercise: CustomExercise) => {
    setEditingCustomExercise(exercise);
    setShowCustomExerciseForm(true);
  };

  const handleDeleteCustomExercise = (id: string) => {
    deleteCustomExercise(id);
  };

  const handleSelectTemplate = (programs: WorkoutProgram[]) => {
    // Add all programs from the template
    programs.forEach(program => {
      addProgram(program);
    });
    setShowWorkoutTemplates(false);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner': return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400';
      case 'Intermediate': return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400';
      case 'Advanced': return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400';
      case 'Custom': return 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400';
      default: return 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400';
    }
  };

  return (
    <div className="space-y-6">
      {showWorkoutTemplates ? (
        <div className="card">
          <WorkoutTemplates
            onSelectTemplate={handleSelectTemplate}
            onBack={() => setShowWorkoutTemplates(false)}
            allExercises={allExercises}
          />
        </div>
      ) : showWorkoutForm ? (
        <div className="card">
          <div className="flex items-center gap-3 mb-6">
            <Dumbbell className="h-7 w-7 text-primary" />
            <h2 className="text-2xl font-bold font-poppins bg-gradient-to-r from-primary to-accent-dark bg-clip-text text-transparent">
              {editingWorkout ? 'Edit Workout' : 'Create New Workout'}
            </h2>
          </div>
          <WorkoutForm
            initialWorkout={editingWorkout || undefined}
            onSave={handleSaveWorkout}
            onCancel={handleCancelWorkout}
            allExercises={allExercises}
          />
        </div>
      ) : showCustomExerciseForm ? (
        <div className="card">
          <div className="flex items-center gap-3 mb-6">
            <PlusCircle className="h-7 w-7 text-primary" />
            <h2 className="text-2xl font-bold font-poppins bg-gradient-to-r from-primary to-accent-dark bg-clip-text text-transparent">
              {editingCustomExercise ? 'Edit Custom Exercise' : 'Create Custom Exercise'}
            </h2>
          </div>
          <CustomExerciseForm
            initialExercise={editingCustomExercise || undefined}
            onSave={handleSaveCustomExercise}
            onCancel={() => {
              setShowCustomExerciseForm(false);
              setEditingCustomExercise(null);
            }}
          />
        </div>
      ) : (
        <>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="flex items-center gap-3">
              <Dumbbell className="h-6 w-6 sm:h-7 sm:w-7 text-primary" />
              <h2 className="text-xl sm:text-2xl font-bold font-poppins text-gray-900 dark:text-white">
                Exercises
              </h2>
            </div>
            <div className="flex flex-wrap gap-2 sm:gap-4 w-full sm:w-auto">
              <button
                onClick={() => setShowCustomExerciseForm(true)}
                className="button-primary flex items-center flex-1 sm:flex-none justify-center gap-2"
              >
                <PlusCircle className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                <span className="hidden sm:inline">Create Exercise</span>
                <span className="sm:hidden">Exercise</span>
              </button>
              <button
                onClick={() => setShowWorkoutTemplates(true)}
                className="button-primary flex items-center flex-1 sm:flex-none justify-center gap-2"
              >
                <Dumbbell className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                <span className="hidden sm:inline">Workout Templates</span>
                <span className="sm:hidden">Templates</span>
              </button>
              <button
                onClick={() => setShowWorkoutForm(true)}
                className="button-primary flex items-center flex-1 sm:flex-none justify-center gap-2"
              >
                <Plus className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                <span className="hidden sm:inline">Create Custom</span>
                <span className="sm:hidden">Custom</span>
              </button>
            </div>
          </div>

          {programs.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-lg sm:text-xl font-bold font-poppins text-gray-900 dark:text-white">Your Workouts</h3>
              {isLoadingData ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <WorkoutCardSkeleton />
                  <WorkoutCardSkeleton />
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {programs.map((program) => (
                    <WorkoutCard
                      key={program.id}
                      workout={program}
                      onEdit={handleEditWorkout}
                      onDelete={deleteProgram}
                      allExercises={allExercises}
                    />
                  ))}
                </div>
              )}
            </div>
          )}

          <div className="card">
            <div className="space-y-6">
              <div className="flex flex-col gap-4">
                <div className="flex-1 relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Search className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    placeholder="Search exercises..."
                    className="input-field pl-11"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <div className="relative sm:max-w-xs">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Filter className="h-5 w-5 text-white" />
                  </div>
                  <select
                    className="input-field pl-11 pr-8 appearance-none bg-primary text-white hover:bg-primary/90 transition-colors"
                    value={selectedFilter}
                    onChange={(e) => setSelectedFilter(e.target.value)}
                  >
                    <option value="all">All Muscle Groups</option>
                    {muscleGroups.map(group => (
                      <option key={group} value={group}>{group}</option>
                    ))}
                  </select>
                </div>
              </div>

              {muscleGroups.map(group => {
                const groupExercises = filteredExercises.filter(ex => ex.muscle_group === group);
                if (selectedFilter !== 'all' && group !== selectedFilter) return null;
                if (groupExercises.length === 0) return null;

                const MuscleGroupIcon = getMuscleGroupIcon(group);
                return (
                  <div key={group} className="space-y-4">
                    <h3 className="text-base sm:text-lg font-semibold font-poppins text-gray-900 dark:text-white">
                      {group}
                    </h3>
                    {isLoadingData ? (
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {Array.from({ length: 6 }).map((_, index) => (
                          <ExerciseCardSkeleton key={index} />
                        ))}
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {groupExercises.map((exercise) => (
                          <div
                            key={exercise.id}
                            className="bg-white dark:bg-gray-800 rounded-lg border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-md transition-all p-3 sm:p-4 hover:border-primary/20"
                          >
                            <div className="flex items-start justify-between mb-3">
                              <h4 className="font-semibold text-sm sm:text-base text-gray-900 dark:text-white">
                                {exercise.name}
                              </h4>
                              <span className={`px-3 py-1 rounded-full text-xs font-medium ${getDifficultyColor(exercise.difficulty)}`}>
                                {exercise.difficulty}
                              </span>
                            </div>
                            <div className="space-y-2">
                              <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                                <span className="font-medium text-xs sm:text-sm">Equipment:</span>
                                <span className="ml-2">{exercise.equipment}</span>
                              </div>
                              {exercise.isCustom && (
                                <div className="flex justify-end gap-2 mt-4">
                                  <button
                                    onClick={() => handleEditCustomExercise(exercise as CustomExercise)}
                                    className="button-icon p-1.5 rounded-full"
                                  >
                                    <Pencil className="w-4 h-4" />
                                  </button>
                                  <button
                                    onClick={() => handleDeleteCustomExercise(exercise.id as string)}
                                    className="p-1.5 text-gray-500 hover:text-red-500 rounded-full bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-600 hover:from-red-50 hover:to-red-100 dark:hover:from-red-900/20 dark:hover:to-red-800/20 transition-all duration-300 transform hover:scale-110 active:scale-95 shadow-soft hover:shadow-medium active:shadow-soft"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}

              {filteredExercises.length === 0 && (
                <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                  No exercises found matching your search criteria
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}