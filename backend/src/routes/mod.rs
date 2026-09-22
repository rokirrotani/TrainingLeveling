mod health;
mod onboarding;
mod progress;

use crate::state::AppState;
use axum::{routing::get, Router};

pub fn create_router(state: AppState) -> Router {
    Router::new()
        .route("/api/health", get(health::health_check))
        .route("/api/onboarding", axum::routing::post(onboarding::create_profile))
        .route("/api/progress/:user_id", get(progress::get_progress))
        .route("/api/progress/log", axum::routing::post(progress::create_daily_log))
        .with_state(state)
}
