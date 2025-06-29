// script.js
document.getElementById("calculate-protein").addEventListener("click", function() {
    // Function to sanitize input (mainly to trim whitespace)
    function sanitizeInput(input) {
        return input.trim();
    }

    var weight = parseFloat(sanitizeInput(document.getElementById("weight-protein").value));
    // NEW: Get Body Fat Percentage input
    var bodyFatPercentageInput = sanitizeInput(document.getElementById("body-fat-percentage").value);
    var bodyFatPercentage = parseFloat(bodyFatPercentageInput); // Will be NaN if input is empty or invalid

    var activity = document.getElementById("activity-level").value;
    var goal = document.getElementById("goal").value;
    var proteinFactor; // This will represent grams per POUND of body weight OR grams per POUND of Lean Body Mass

    // Input Validation for Weight
    if (isNaN(weight)) {
        document.getElementById("protein-result").textContent = "Please enter a valid weight.";
        return;
    }
    if (weight <= 0) {
        document.getElementById("protein-result").textContent = "Weight must be greater than zero.";
        return;
    }

    // Input Validation for optional Body Fat Percentage
    var useLeanBodyMass = false;
    var leanBodyMass;

    if (bodyFatPercentageInput !== "") { // Check if input was provided
        if (isNaN(bodyFatPercentage) || bodyFatPercentage < 1 || bodyFatPercentage > 60) {
            document.getElementById("protein-result").textContent = "Please enter a valid Body Fat Percentage (1-60%).";
            return;
        }
        // Calculate Lean Body Mass
        var fatMass = weight * (bodyFatPercentage / 100);
        leanBodyMass = weight - fatMass;

        if (leanBodyMass <= 0) { // Safety check for extreme cases
            document.getElementById("protein-result").textContent = "Invalid Body Fat Percentage resulting in zero or negative lean mass. Please check your inputs.";
            return;
        }

        useLeanBodyMass = true;
        console.log("Using Lean Body Mass for calculation:", leanBodyMass.toFixed(2), "lbs");
    } else {
        console.log("Body Fat Percentage not provided. Using total body weight for calculation.");
    }


    // Determine protein factor based on activity and goal
    // THESE FACTORS ARE NOW FOR GRAMS PER POUND OF *LEAN BODY MASS* (g/lb LBM)
    // Or for grams per POUND OF *TOTAL BODY WEIGHT* if LBM isn't used.
    // Recommendations often range from 0.8 to 1.2+ g/lb LBM
    // If using total body weight, factors are generally lower (0.6-1.0 g/lb total body weight)

    // Let's establish two sets of factors: one for LBM, one for Total Body Weight (TBW)
    // Adjust these values based on YOUR specific recommendations for g/lb LBM
    // A common range is 0.8-1.0g/lb LBM for maintenance/mild gain, up to 1.2g/lb LBM or more for aggressive gain/fat loss.

    var proteinFactorsLBM = {
        "sedentary":    {"maintenance": 0.8, "muscle-gain": 1.0, "fat-loss": 1.1},
        "light":        {"maintenance": 0.9, "muscle-gain": 1.1, "fat-loss": 1.2},
        "moderate":     {"maintenance": 1.0, "muscle-gain": 1.2, "fat-loss": 1.3}, // Potentially higher for moderate/intense
        "very":         {"maintenance": 1.0, "muscle-gain": 1.2, "fat-loss": 1.3}, // Keep it consistent, very active might need max
        "extremely":    {"maintenance": 1.0, "muscle-gain": 1.2, "fat-loss": 1.3}  // Assuming a value if you add this activity level
    };

    var proteinFactorsTBW = {
        "sedentary":    {"maintenance": 0.6, "muscle-gain": 0.8, "fat-loss": 0.8},
        "light":        {"maintenance": 0.7, "muscle-gain": 0.9, "fat-loss": 0.9},
        "moderate":     {"maintenance": 0.8, "muscle-gain": 1.0, "fat-loss": 1.0},
        "very":         {"maintenance": 0.8, "muscle-gain": 1.0, "fat-loss": 1.0},
        "extremely":    {"maintenance": 0.8, "muscle-gain": 1.0, "fat-loss": 1.0}
    };


    if (useLeanBodyMass) {
        proteinFactor = proteinFactorsLBM[activity][goal];
        console.log("Protein factor (g/lb LBM):", proteinFactor);
    } else {
        proteinFactor = proteinFactorsTBW[activity][goal];
        console.log("Protein factor (g/lb Total BW):", proteinFactor);
    }


    // Perform the final calculation using LBM or total weight
    var proteinIntake;
    if (useLeanBodyMass) {
        proteinIntake = leanBodyMass * proteinFactor;
    } else {
        proteinIntake = weight * proteinFactor;
    }

    document.getElementById("protein-result").textContent = "Recommended protein intake: " + proteinIntake.toFixed(2) + " grams.";
});
