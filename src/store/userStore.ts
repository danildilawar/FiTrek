import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { supabase } from '../lib/supabase';
import type { UserData, WorkoutLog, WorkoutProgram, CustomExercise } from '../types';

interface UserStore {
  userData: UserData | null;
  workoutLogs: WorkoutLog[];
  programs: WorkoutProgram[];
  customExercises: CustomExercise[];
  isDarkMode: boolean;
  isAuthenticated: boolean;
  isLoading: boolean;
  isLoadingData: boolean;
  showToast: boolean;
  toastMessage: string;
  
  // Auth methods
  login: (email: string, password: string) => Promise<{ needsEmailConfirmation: boolean }>;
  signup: (email: string, password: string, username?: string) => Promise<{ needsEmailConfirmation: boolean }>;
  logout: () => Promise<void>;
  
  // Data methods
  setUserData: (data: UserData) => void;
  loadUserData: () => Promise<void>;
  addWorkoutLog: (log: WorkoutLog) => void;
  addProgram: (program: WorkoutProgram) => void;
  editProgram: (program: WorkoutProgram) => void;
  deleteProgram: (id: string) => void;
  deleteWorkoutLog: (id: string) => void;
  addCustomExercise: (exercise: CustomExercise) => void;
  editCustomExercise: (exercise: CustomExercise) => void;
  deleteCustomExercise: (id: string) => void;
  toggleDarkMode: () => void;
  showToastMessage: (message: string) => void;
  hideToast: () => void;
}

export const useUserStore = create<UserStore>()(
  persist(
    (set, get) => ({
      userData: null,
      workoutLogs: [],
      programs: [],
      customExercises: [],
      isDarkMode: false,
      isAuthenticated: false,
      isLoading: false,
      isLoadingData: false,
      showToast: false,
      toastMessage: '',

      login: async (email: string, password: string) => {
        set({ isLoading: true });
        try {
          // Check if Supabase is configured
          if (!import.meta.env.VITE_SUPABASE_URL || !import.meta.env.VITE_SUPABASE_ANON_KEY) {
            throw new Error('Supabase configuration is missing. Please check your environment variables.');
          }

          const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
          });

          if (error) {
            console.error('Login error:', error);
            if (error.message.includes('Email not confirmed')) {
              return { needsEmailConfirmation: true };
            }
            throw error;
          }

          if (data.user) {
            set({ isAuthenticated: true });
            await get().loadUserData();
          }

          return { needsEmailConfirmation: false };
        } catch (error) {
          console.error('Login failed:', error);
          throw error;
        } finally {
          set({ isLoading: false });
        }
      },

      signup: async (email: string, password: string, username?: string) => {
        set({ isLoading: true });
        try {
          // Check if Supabase is configured
          if (!import.meta.env.VITE_SUPABASE_URL || !import.meta.env.VITE_SUPABASE_ANON_KEY) {
            throw new Error('Supabase configuration is missing. Please check your environment variables.');
          }

          const { data, error } = await supabase.auth.signUp({
            email,
            password,
          });

          if (error) {
            console.error('Signup error:', error);
            throw error;
          }

          if (data.user && !data.user.email_confirmed_at) {
            return { needsEmailConfirmation: true };
          }

          if (data.user) {
            set({ isAuthenticated: true });
            // Don't create user profile here - let onboarding handle it
            // This ensures onboarding shows for new users
          }

          return { needsEmailConfirmation: false };
        } catch (error) {
          console.error('Signup failed:', error);
          throw error;
        } finally {
          set({ isLoading: false });
        }
      },

      logout: async () => {
        await supabase.auth.signOut();
        set({
          userData: null,
          workoutLogs: [],
          programs: [],
          customExercises: [],
          isAuthenticated: false,
        });
      },

      loadUserData: async () => {
        set({ isLoadingData: true });
        console.log('📊 Starting loadUserData...');
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          console.log('❌ No user found in loadUserData');
          set({ isLoadingData: false });
          return;
        }
        console.log('👤 User found:', user.id);

        try {
          // Load user profile
          console.log('🔍 Querying user profile...');
          const { data: profile } = await supabase
            .from('users')
            .select('*')
            .eq('id', user.id)
            .maybeSingle();

          console.log('📋 Profile data:', profile);
          if (profile) {
            console.log('✅ Setting user data from profile');
            set({
              userData: {
                name: profile.name,
                height: profile.height,
                sex: profile.sex,
                email: profile.email,
                weightUnit: profile.weight_unit || 'Kgs',
                notifications: profile.notifications,
                weeklyWorkoutGoal: profile.weekly_workout_goal,
              }
            });
          } else {
            console.log('❌ No profile found in database');
          }

          // Load custom exercises
          const { data: customExercises } = await supabase
            .from('custom_exercises')
            .select('*')
            .eq('user_id', user.id);

          if (customExercises) {
            set({
              customExercises: customExercises.map(ex => ({
                id: ex.id,
                name: ex.name,
                muscle_group: ex.muscle_group,
                equipment: ex.equipment,
                difficulty: ex.difficulty,
                isCustom: true,
              }))
            });
          }

          // Load workout programs
          const { data: programs } = await supabase
            .from('workout_programs')
            .select('*')
            .eq('user_id', user.id);

          if (programs) {
            set({
              programs: programs.map(p => ({
                id: p.id,
                name: p.name,
                exercises: p.exercises,
              }))
            });
          }

          // Load workout logs
          const { data: workoutLogs } = await supabase
            .from('workout_logs')
            .select('*')
            .eq('user_id', user.id)
            .order('date', { ascending: false });

          if (workoutLogs) {
            set({
              workoutLogs: workoutLogs.map(log => ({
                id: log.id,
                workoutId: log.workout_id,
                date: log.date,
                exercises: log.exercises,
              }))
            });
          }
        } catch (error) {
          console.error('Error loading user data:', error);
        } finally {
          set({ isLoadingData: false });
        }
      },

      setUserData: async (data) => {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        try {
          const { error } = await supabase
            .from('users')
            .upsert({
              id: user.id,
             email: user.email,
              name: data.name,
              height: data.height,
              sex: data.sex,
              weekly_workout_goal: data.weeklyWorkoutGoal,
              weight_unit: data.weightUnit,
              notifications: data.notifications,
            });

          if (error) throw error;

          set({ userData: data });
        } catch (error) {
          console.error('Error updating user data:', error);
        }
      },

      addWorkoutLog: async (log) => {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        try {
          const { error } = await supabase
            .from('workout_logs')
            .insert([
              {
                id: log.id,
                user_id: user.id,
                workout_id: log.workoutId,
                date: log.date,
                exercises: log.exercises,
              }
            ]);

          if (error) throw error;

          set((state) => ({ workoutLogs: [log, ...state.workoutLogs] }));
        } catch (error) {
          console.error('Error adding workout log:', error);
        }
      },

      addProgram: async (program) => {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        try {
          const { error } = await supabase
            .from('workout_programs')
            .insert([
              {
                id: program.id,
                user_id: user.id,
                name: program.name,
                exercises: program.exercises,
              }
            ]);

          if (error) throw error;

          set((state) => ({ programs: [...state.programs, program] }));
        } catch (error) {
          console.error('Error adding program:', error);
        }
      },

      editProgram: async (program) => {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        try {
          const { error } = await supabase
            .from('workout_programs')
            .update({
              name: program.name,
              exercises: program.exercises,
            })
            .eq('id', program.id)
            .eq('user_id', user.id);

          if (error) throw error;

          set((state) => ({
            programs: state.programs.map((p) =>
              p.id === program.id ? program : p
            ),
          }));
        } catch (error) {
          console.error('Error editing program:', error);
        }
      },

      deleteProgram: async (id) => {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        try {
          const { error } = await supabase
            .from('workout_programs')
            .delete()
            .eq('id', id)
            .eq('user_id', user.id);

          if (error) throw error;

          set((state) => ({
            programs: state.programs.filter((p) => p.id !== id),
          }));
        } catch (error) {
          console.error('Error deleting program:', error);
        }
      },

      deleteWorkoutLog: async (id) => {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        try {
          const { error } = await supabase
            .from('workout_logs')
            .delete()
            .eq('id', id)
            .eq('user_id', user.id);

          if (error) throw error;

          set((state) => ({
            workoutLogs: state.workoutLogs.filter((log) => log.id !== id),
          }));
        } catch (error) {
          console.error('Error deleting workout log:', error);
        }
      },

      addCustomExercise: async (exercise) => {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        try {
          const { error } = await supabase
            .from('custom_exercises')
            .insert([
              {
                id: exercise.id,
                user_id: user.id,
                name: exercise.name,
                muscle_group: exercise.muscle_group,
                equipment: exercise.equipment,
                difficulty: exercise.difficulty,
              }
            ]);

          if (error) throw error;

          set((state) => ({
            customExercises: [...state.customExercises, exercise],
          }));
        } catch (error) {
          console.error('Error adding custom exercise:', error);
        }
      },

      editCustomExercise: async (exercise) => {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        try {
          const { error } = await supabase
            .from('custom_exercises')
            .update({
              name: exercise.name,
              muscle_group: exercise.muscle_group,
              equipment: exercise.equipment,
              difficulty: exercise.difficulty,
            })
            .eq('id', exercise.id)
            .eq('user_id', user.id);

          if (error) throw error;

          set((state) => ({
            customExercises: state.customExercises.map((e) =>
              e.id === exercise.id ? exercise : e
            ),
          }));
        } catch (error) {
          console.error('Error editing custom exercise:', error);
        }
      },

      deleteCustomExercise: async (id) => {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        try {
          const { error } = await supabase
            .from('custom_exercises')
            .delete()
            .eq('id', id)
            .eq('user_id', user.id);

          if (error) throw error;

          set((state) => ({
            customExercises: state.customExercises.filter((e) => e.id !== id),
          }));
        } catch (error) {
          console.error('Error deleting custom exercise:', error);
        }
      },

      toggleDarkMode: () =>
        set((state) => ({ isDarkMode: !state.isDarkMode })),

      showToastMessage: (message: string) => {
        set({ showToast: true, toastMessage: message });
        // Auto-hide after 3 seconds
        setTimeout(() => {
          set({ showToast: false, toastMessage: '' });
        }, 3000);
      },

      hideToast: () => set({ showToast: false, toastMessage: '' }),
    }),
    {
      name: 'fitrek-storage',
      partialize: (state) => ({ isDarkMode: state.isDarkMode }),
    }
  )
);

// Initialize auth state
supabase.auth.onAuthStateChange((event, session) => {
  const store = useUserStore.getState();
  
  if (event === 'SIGNED_IN' && session) {
    store.isAuthenticated = true;
    store.loadUserData();
  } else if (event === 'SIGNED_OUT') {
    useUserStore.setState({
      userData: null,
      workoutLogs: [],
      programs: [],
      customExercises: [],
      isAuthenticated: false,
    });
  }
});