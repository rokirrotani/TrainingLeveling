export type GoalType = "fat_loss" | "muscle_gain" | "recomposition";
export type ActivityType = "beginner" | "intermediate" | "advanced";
export type FoodType = "balanced" | "vegetarian" | "vegan";

export interface OnboardingInput {
  nickname: string;
  age: number;
  height_cm: number;
  weight_kg: number;
  goal: GoalType;
  activity_level: ActivityType;
  food_style: FoodType;
  preferences: string[];
}

export interface PlanSummary {
  training: string[];
  nutrition: string[];
  daily_focus: string[];
}

export interface OnboardingResponse {
  user_id: number;
  levellino_intro: string;
  plan_summary: PlanSummary;
}

export interface DailyLog {
  id: number;
  user_id: number;
  log_date: string;
  workout_done: boolean;
  nutrition_done: boolean;
  hydration_done: boolean;
  notes: string;
  xp_gained: number;
  created_at: string;
}

export interface ProgressResponse {
  user_id: number;
  total_xp: number;
  level: number;
  streak_days: number;
  todays_mission_status: string;
  recent_logs: DailyLog[];
}
