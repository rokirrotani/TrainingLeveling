use crate::models::PlanSummary;

pub fn calculate_xp(workout_done: bool, nutrition_done: bool, hydration_done: bool) -> i32 {
    let mut xp = 0;

    if workout_done {
        xp += 50;
    }
    if nutrition_done {
        xp += 30;
    }
    if hydration_done {
        xp += 20;
    }

    xp
}

pub fn level_from_xp(total_xp: i64) -> i64 {
    // Progressive level curve with a simple formula.
    1 + ((total_xp as f64 / 120.0).sqrt().floor() as i64)
}

pub fn build_plan(goal: &str, activity_level: &str, food_style: &str, prefs: &[String]) -> PlanSummary {
    let mut training = vec![];
    let mut nutrition = vec![];
    let mut daily_focus = vec![];

    match goal {
        "fat_loss" => {
            training.push("3 sessioni cardio HIIT leggere/moderate a settimana".to_string());
            training.push("2 sessioni forza full-body da 35-45 minuti".to_string());
            nutrition.push("Deficit calorico controllato e porzioni bilanciate".to_string());
        }
        "muscle_gain" => {
            training.push("4 sessioni forza progressive a settimana".to_string());
            training.push("1 giornata recupero attivo o mobilita".to_string());
            nutrition.push("Surplus calorico leggero con proteine elevate".to_string());
        }
        _ => {
            training.push("3 sessioni miste forza/cardio a settimana".to_string());
            training.push("2 giornate camminata veloce o mobilita".to_string());
            nutrition.push("Alimentazione normocalorica con pasti regolari".to_string());
        }
    }

    match activity_level {
        "beginner" => daily_focus.push("Obiettivo: costanza > intensita".to_string()),
        "intermediate" => daily_focus.push("Obiettivo: progressione graduale".to_string()),
        _ => daily_focus.push("Obiettivo: performance e recovery ottimizzato".to_string()),
    }

    if food_style == "vegetarian" {
        nutrition.push("Proteine vegetali: legumi, tofu, tempeh, yogurt greco".to_string());
    } else if food_style == "vegan" {
        nutrition.push("Abbinare legumi + cereali per profilo aminoacidico completo".to_string());
    } else {
        nutrition.push("Distribuire proteine in 3-4 pasti giornalieri".to_string());
    }

    if prefs.iter().any(|p| p == "home_workout") {
        training.push("Allenamenti adattati per casa senza attrezzatura".to_string());
    }
    if prefs.iter().any(|p| p == "quick_meals") {
        nutrition.push("Meal prep da 15 minuti con ingredienti semplici".to_string());
    }

    daily_focus.push("Completa almeno 2 missioni al giorno per XP bonus".to_string());
    daily_focus.push("Check giornaliero con Levellino per mantenere streak".to_string());

    PlanSummary {
        training,
        nutrition,
        daily_focus,
    }
}
