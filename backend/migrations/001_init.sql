CREATE TABLE IF NOT EXISTS user_profiles (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    nickname VARCHAR(120) NOT NULL,
    age INT NOT NULL,
    height_cm INT NOT NULL,
    weight_kg DECIMAL(6,2) NOT NULL,
    goal VARCHAR(40) NOT NULL,
    activity_level VARCHAR(30) NOT NULL,
    food_style VARCHAR(30) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS daily_logs (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    log_date DATE NOT NULL,
    workout_done BOOLEAN NOT NULL DEFAULT FALSE,
    nutrition_done BOOLEAN NOT NULL DEFAULT FALSE,
    hydration_done BOOLEAN NOT NULL DEFAULT FALSE,
    notes TEXT NOT NULL,
    xp_gained INT NOT NULL DEFAULT 0,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_daily_logs_user
        FOREIGN KEY (user_id)
        REFERENCES user_profiles(id)
        ON DELETE CASCADE,
    UNIQUE KEY uq_daily_user_date (user_id, log_date)
);
