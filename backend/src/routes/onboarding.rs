use crate::models::{OnboardingRequest, OnboardingResponse};
use crate::services::leveling::build_plan;
use crate::state::AppState;
use axum::{extract::State, http::StatusCode, Json};

pub async fn create_profile(
    State(state): State<AppState>,
    Json(payload): Json<OnboardingRequest>,
) -> Result<(StatusCode, Json<OnboardingResponse>), (StatusCode, String)> {
    let plan = build_plan(
        &payload.goal,
        &payload.activity_level,
        &payload.food_style,
        &payload.preferences,
    );

    let query = r#"
        INSERT INTO user_profiles
        (nickname, age, height_cm, weight_kg, goal, activity_level, food_style)
        VALUES (?, ?, ?, ?, ?, ?, ?)
    "#;

    let result = sqlx::query(query)
        .bind(&payload.nickname)
        .bind(payload.age)
        .bind(payload.height_cm)
        .bind(payload.weight_kg)
        .bind(&payload.goal)
        .bind(&payload.activity_level)
        .bind(&payload.food_style)
        .execute(&state.db)
        .await
        .map_err(internal_error)?;

    let user_id = result.last_insert_rowid();

    Ok((
        StatusCode::CREATED,
        Json(OnboardingResponse {
            user_id,
            levellino_intro: format!(
                "Io sono Levellino! Ottimo lavoro {}, da ora costruiamo il tuo percorso giorno per giorno.",
                payload.nickname
            ),
            plan_summary: plan,
        }),
    ))
}

fn internal_error(err: sqlx::Error) -> (StatusCode, String) {
    (StatusCode::INTERNAL_SERVER_ERROR, format!("Database error: {err}"))
}
