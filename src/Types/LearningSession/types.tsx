export interface LearningSession {
  session_id: string;
  user_id: string;
  topic: string;
  subtopic?: string;
  level: 'basico' | 'intermedio' | 'avanzado';
  status: 'active' | 'paused' | 'completed';
  created_at: string;
  updated_at: string;
  completed_at?: string;
}

export interface LearningSessionStats {
  total_messages: number;
  duration_minutes: number;
  concepts_covered?: string[];
  exercises_completed: number;
  success_rate: number;
  learning_objectives_met?: string[];
  concepts_list?: string[];
}

export interface LearningSessionHistory {
  session_id: string;
  messages: Array<{
    role: 'user' | 'assistant';
    content: string;
    timestamp: string;
  }>;
  exercises: Array<{
    id: string;
    question: string;
    answer: string;
    is_correct: boolean;
    timestamp: string;
  }>;
}

export interface CreateLearningSessionData {
  user_id: string;
  topic: string;
  subtopic?: string;
  level: 'basico' | 'intermedio' | 'avanzado';
}

export interface ChatInSessionData {
  session_id: string;
  message: string;
  context?: Record<string, unknown>;
}

export interface DashboardData {
  active_sessions_count: number;
  completed_sessions_count: number;
  total_study_time_minutes: number;
  topics_studied: string[];
  current_streak_days: number;
  weekly_progress: Array<{
    date: string;
    study_time_minutes: number;
    sessions_completed: number;
  }>;
}

export interface ProgressData {
  user_id: string;
  overall_progress: number;
  topics_progress: Array<{
    topic: string;
    progress_percentage: number;
    sessions_completed: number;
    mastery_level: 'beginner' | 'intermediate' | 'advanced';
  }>;
  strengths: string[];
  improvement_areas: string[];
  study_streaks: {
    current_streak: number;
    longest_streak: number;
  };
}

export interface Recommendation {
  id: string;
  type: 'topic' | 'exercise' | 'review';
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  estimated_time_minutes: number;
  related_topic?: string;
}

export interface AdaptiveExercise {
  id: string;
  question: string;
  type: 'multiple_choice' | 'open_ended' | 'calculation';
  difficulty: 'easy' | 'medium' | 'hard';
  options?: string[];
  correct_answer?: string;
  explanation?: string;
  hints?: string[];
}

export interface ExerciseBatch {
  exercises: AdaptiveExercise[];
  batch_id: string;
  estimated_time_minutes: number;
}

export interface ExerciseCompletion {
  exercise_id: string;
  user_answer: string;
  time_taken_seconds: number;
  session_id?: string;
}
