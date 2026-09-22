use crate::models::{DailyLog, DailyLogRequest, ProgressResponse};
use crate::services::leveling::{calculate_xp, level_from_xp};
use crate::state::AppState;
use axum::{extract::Path, extract::State, http::StatusCode, Json};

pub async fn create_daily_log(
    State(state): State<AppState>,
    Json(payload): Json<DailyLogRequest>,
) -> Result<(StatusCode, Json<DailyLog>), (StatusCode, String)> {
    let xp = calculate_xp(
        payload.workout_done,
        payload.nutrition_done,
        payload.hydration_done,
    );

    let notes = payload.notes.unwrap_or_default();

    let insert_query = r#"
        INSERT INTO daily_logs
        (user_id, log_date, workout_done, nutrition_done, hydration_done, notes, xp_gained)
        VALUES (?, ?, ?, ?, ?, ?, ?)
    "#;

    let result = sqlx::query(insert_query)
        .bind(payload.user_id)
        .bind(payload.log_date)
        .bind(payload.workout_done)
        .bind(payload.nutrition_done)
        .bind(payload.hydration_done)
        .bind(notes)
        .bind(xp)
        .execute(&state.db)
        .await
        .map_err(internal_error)?;

    let inserted_id = result.last_insert_rowid();

    let record = sqlx::query_as::<_, DailyLog>(
        r#"
        SELECT id, user_id, log_date, workout_done, nutrition_done, hydration_done, notes, xp_gained, created_at
        FROM daily_logs
        WHERE id = ?
    "#,
    )
    .bind(inserted_id)
    .fetch_one(&state.db)
    .await
    .map_err(internal_error)?;

    Ok((StatusCode::CREATED, Json(record)))
}

pub async fn get_progress(
    State(state): State<AppState>,
    Path(user_id): Path<i64>,
) -> Result<Json<ProgressResponse>, (StatusCode, String)> {
    let total_xp: i64 = sqlx::query_scalar(
        r#"
        SELECT COALESCE(SUM(xp_gained), 0) as total_xp
        FROM daily_logs
        WHERE user_id = ?
    "#,
    )
    .bind(user_id)
    .fetch_one(&state.db)
    .await
    .map_err(internal_error)?;

    let recent_logs = sqlx::query_as::<_, DailyLog>(
        r#"
        SELECT id, user_id, log_date, workout_done, nutrition_done, hydration_done, notes, xp_gained, created_at
        FROM daily_logs
        WHERE user_id = ?
        ORDER BY log_date DESC
        LIMIT 14
    "#,
    )
    .bind(user_id)
    .fetch_all(&state.db)
    .await
    .map_err(internal_error)?;

    let streak_days: i64 = sqlx::query_scalar(
        r#"
        SELECT COUNT(*)
        FROM daily_logs
        WHERE user_id = ?
          AND xp_gained > 0
                    AND log_date >= date('now', '-6 day')
    "#,
    )
    .bind(user_id)
    .fetch_one(&state.db)
    .await
    .map_err(internal_error)?;

    let level = level_from_xp(total_xp);
    let todays_mission_status = if recent_logs.first().map(|d| d.xp_gained > 0).unwrap_or(false) {
        "Missione giornaliera completata".to_string()
    } else {
        "Missione giornaliera in attesa".to_string()
    };

    Ok(Json(ProgressResponse {
        user_id,
        total_xp,
        level,
        streak_days,
        todays_mission_status,
        recent_logs,
    }))
}

fn internal_error(err: sqlx::Error) -> (StatusCode, String) {
    (StatusCode::INTERNAL_SERVER_ERROR, format!("Database error: {err}"))
}
