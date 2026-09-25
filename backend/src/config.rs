use anyhow::{Context, Result};
use std::env;

#[derive(Clone)]
pub struct AppConfig {
    pub app_host: String,
    pub app_port: u16,
    pub database_url: String,
    pub frontend_origins: Vec<String>,
}

impl AppConfig {
    pub fn from_env() -> Result<Self> {
        let app_host = env::var("APP_HOST").unwrap_or_else(|_| "0.0.0.0".to_string());

        let app_port = env::var("APP_PORT")
            .unwrap_or_else(|_| "8080".to_string())
            .parse::<u16>()
            .context("APP_PORT must be a valid u16 number")?;

        let database_url = env::var("DATABASE_URL")
            .unwrap_or_else(|_| "sqlite://training_leveling.db".to_string());

        let frontend_origins = if let Ok(raw_origins) = env::var("FRONTEND_ORIGINS") {
            let origins = raw_origins
                .split(',')
                .map(str::trim)
                .filter(|value| !value.is_empty())
                .map(ToOwned::to_owned)
                .collect::<Vec<_>>();

            if origins.is_empty() {
                vec!["http://localhost:5173".to_string(), "http://127.0.0.1:5173".to_string()]
            } else {
                origins
            }
        } else {
            let single_origin = env::var("FRONTEND_ORIGIN").unwrap_or_else(|_| "http://localhost:5173".to_string());
            vec![single_origin]
        };

        Ok(Self {
            app_host,
            app_port,
            database_url,
            frontend_origins,
        })
    }
}
