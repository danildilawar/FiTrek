export interface UserData {
  name: string;
  height: number;
  sex: 'male' | 'female' | 'other';
  email: string;
  weightUnit: 'Kgs' | 'Pounds';
  notifications: {
    workoutReminders: boolean;
    progressUpdates: boolean;
    newFeatures: boolean;
  };
  paymentMethod?: {
    type: 'card' | 'paypal';
    last4?: string;
    expiryDate?: string;
  };
  weeklyWorkoutGoal: number;
}

export interface Exercise {
  id: number | string;
  name: string;
  muscle_group: string;
  equipment: string;
  difficulty: string;
  isCustom?: boolean;
}

export interface CustomExercise extends Exercise {
  id: string;
  isCustom: true;
}

export interface WorkoutLog {
  id: string;
  workoutId: string;
  date: string;
  exercises: {
    exerciseId: number | string;
    sets: {
      weight: number;
      reps: number;
    }[];
  }[];
}

export interface WorkoutProgram {
  id: string;
  name: string;
  exercises: (number | string)[];
}