use anyhow::{Context, Result};
use std::env;

#[derive(Clone)]
pub struct AppConfig {
    pub app_host: String,
    pub app_port: u16,
    pub database_url: String,
    pub frontend_origin: String,
}

impl AppConfig {
    pub fn from_env() -> Result<Self> {
        let app_host = env::var("APP_HOST").unwrap_or_else(|_| "0.0.0.0".to_string());

        let app_port = env::var("APP_PORT")
            .unwrap_or_else(|_| "8080".to_string())
            .parse::<u16>()
            .context("APP_PORT must be a valid u16 number")?;

        let database_url = env::var("DATABASE_URL")
            .unwrap_or_else(|_| "mysql://app:app_password@localhost:3306/training_leveling".to_string());

        let frontend_origin = env::var("FRONTEND_ORIGIN")
            .unwrap_or_else(|_| "http://localhost:5173".to_string());

        Ok(Self {
            app_host,
            app_port,
            database_url,
            frontend_origin,
        })
    }
}
