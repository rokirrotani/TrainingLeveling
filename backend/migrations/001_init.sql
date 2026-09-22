CREATE TABLE IF NOT EXISTS user_profiles (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nickname TEXT NOT NULL,
    age INT NOT NULL,
    height_cm INT NOT NULL,
    weight_kg REAL NOT NULL,
    goal TEXT NOT NULL,
    activity_level TEXT NOT NULL,
    food_style TEXT NOT NULL,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS daily_logs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    log_date DATE NOT NULL,
    workout_done INTEGER NOT NULL DEFAULT 0,
    nutrition_done INTEGER NOT NULL DEFAULT 0,
    hydration_done INTEGER NOT NULL DEFAULT 0,
    notes TEXT NOT NULL,
    xp_gained INT NOT NULL DEFAULT 0,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES user_profiles(id) ON DELETE CASCADE,
    UNIQUE (user_id, log_date)
);
