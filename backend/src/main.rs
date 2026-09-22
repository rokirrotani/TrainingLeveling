mod config;
mod models;
mod routes;
mod services;
mod state;

use axum::http::{header, Method};
use config::AppConfig;
use routes::create_router;
use sqlx::sqlite::SqlitePoolOptions;
use std::time::Duration;
use tower_http::cors::CorsLayer;
use tower_http::trace::TraceLayer;
use tracing::info;

#[tokio::main]
async fn main() -> anyhow::Result<()> {
    dotenvy::dotenv().ok();

    tracing_subscriber::fmt()
        .with_env_filter(tracing_subscriber::EnvFilter::from_default_env())
        .init();

    let config = AppConfig::from_env()?;

    let db = SqlitePoolOptions::new()
        .max_connections(10)
        .acquire_timeout(Duration::from_secs(10))
        .connect(&config.database_url)
        .await?;

    sqlx::migrate!("./migrations").run(&db).await?;

    let state = state::AppState { db };

    let allowed_origin = config.frontend_origin.parse::<axum::http::HeaderValue>()?;

    let cors = CorsLayer::new()
        .allow_origin(allowed_origin)
        .allow_methods([Method::GET, Method::POST, Method::OPTIONS])
        .allow_headers([header::CONTENT_TYPE, header::ACCEPT]);

    let app = create_router(state).layer(cors).layer(TraceLayer::new_for_http());

    let bind_addr = format!("{}:{}", config.app_host, config.app_port);
    let listener = tokio::net::TcpListener::bind(&bind_addr).await?;

    info!("TrainingLeveling API listening on {bind_addr}");
    axum::serve(listener, app).await?;

    Ok(())
}
