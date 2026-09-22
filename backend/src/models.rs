use chrono::{DateTime, NaiveDate, Utc};
use serde::{Deserialize, Serialize};
use sqlx::FromRow;

#[derive(Debug, Deserialize)]
pub struct OnboardingRequest {
    pub nickname: String,
    pub age: i32,
    pub height_cm: i32,
    pub weight_kg: f32,
    pub goal: String,
    pub activity_level: String,
    pub food_style: String,
    pub preferences: Vec<String>,
}

#[derive(Debug, Serialize)]
pub struct OnboardingResponse {
    pub user_id: i64,
    pub levellino_intro: String,
    pub plan_summary: PlanSummary,
}

#[derive(Debug, Serialize)]
pub struct PlanSummary {
    pub training: Vec<String>,
    pub nutrition: Vec<String>,
    pub daily_focus: Vec<String>,
}

#[derive(Debug, Serialize, FromRow)]
pub struct DailyLog {
    pub id: i64,
    pub user_id: i64,
    pub log_date: NaiveDate,
    pub workout_done: bool,
    pub nutrition_done: bool,
    pub hydration_done: bool,
    pub notes: String,
    pub xp_gained: i32,
    pub created_at: DateTime<Utc>,
}

#[derive(Debug, Deserialize)]
pub struct DailyLogRequest {
    pub user_id: i64,
    pub log_date: NaiveDate,
    pub workout_done: bool,
    pub nutrition_done: bool,
    pub hydration_done: bool,
    pub notes: Option<String>,
}

#[derive(Debug, Serialize)]
pub struct ProgressResponse {
    pub user_id: i64,
    pub total_xp: i64,
    pub level: i64,
    pub streak_days: i64,
    pub todays_mission_status: String,
    pub recent_logs: Vec<DailyLog>,
}

#[derive(Debug, Serialize)]
pub struct HealthResponse {
    pub status: String,
    pub service: String,
}
