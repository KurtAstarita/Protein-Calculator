// script.js
document.getElementById("calculate-protein").addEventListener("click", function() {
    // Function to sanitize input (mainly to trim whitespace)
    function sanitizeInput(input) {
        return input.trim();
    }

    var weightInput = sanitizeInput(document.getElementById("weight-protein").value);
    var weight = parseFloat(weightInput);
    var weightUnit = document.getElementById("weight-unit").value;

    var bodyFatPercentageInput = sanitizeInput(document.getElementById("body-fat-percentage").value);
    var bodyFatPercentage = parseFloat(bodyFatPercentageInput);

    var activity = document.getElementById("activity-level").value;
    var goal = document.getElementById("goal").value;
    var proteinFactor; // This will now consistently be grams per POUND of the "effective" weight (LBM or Total BW)

    // Input Validation for Weight
    if (isNaN(weight)) {
        document.getElementById("protein-result").textContent = "Please enter a valid weight.";
        return;
    }
    if (weight <= 0) {
        document.getElementById("protein-result").textContent = "Weight must be greater than zero.";
        return;
    }

    // Convert weight to LBS if it's in KG to ensure all calculations are based on LBS internally
    if (weightUnit === "kg") {
        weight = weight * 2.20462; // Convert kg to lbs
        console.log("Converted weight from kg to lbs:", weight.toFixed(2));
    }

    // Determine the 'effective weight' for calculation: LBM or Total Body Weight
    var effectiveWeight = weight; // Default to total weight
    var calculationBasis = "Total Body Weight";

    // Input Validation and calculation for optional Body Fat Percentage
    if (bodyFatPercentageInput !== "") { // Check if input was provided
        if (isNaN(bodyFatPercentage) || bodyFatPercentage < 1 || bodyFatPercentage > 60) {
            document.getElementById("protein-result").textContent = "Please enter a valid Body Fat Percentage (1-60%).";
            return;
        }
        // Calculate Lean Body Mass
        var fatMass = weight * (bodyFatPercentage / 100);
        var leanBodyMass = weight - fatMass;

        if (leanBodyMass <= 0) { // Safety check for extreme cases
            document.getElementById("protein-result").textContent = "Invalid Body Fat Percentage resulting in zero or negative lean mass. Please check your inputs.";
            return;
        }

        effectiveWeight = leanBodyMass;
        calculationBasis = "Lean Body Mass";
        console.log("Using Lean Body Mass for calculation:", leanBodyMass.toFixed(2), "lbs");
    } else {
        console.log("Body Fat Percentage not provided. Using total body weight for calculation.");
    }


    // Define protein factors based on the *effective weight* (either LBM or Total BW)
    // These values represent grams per pound of the chosen weight basis.
    // **CRITICAL: THESE ARE THE VALUES YOU NEED TO FINE-TUNE FOR YOUR SPECIFIC RECOMMENDATIONS**
    // If effectiveWeight is LBM, these factors are typically 0.8-1.2+ g/lb LBM
    // If effectiveWeight is Total BW, these factors are typically 0.6-1.0 g/lb Total BW (lower to account for fat)

    var proteinFactors = {
        // Factors for Sedentary
        "sedentary": {
            "maintenance": (calculationBasis === "Lean Body Mass") ? 0.8 : 0.6,
            "muscle-gain": (calculationBasis === "Lean Body Mass") ? 1.0 : 0.8,
            "fat-loss":    (calculationBasis === "Lean Body Mass") ? 1.1 : 0.9 // Often higher for fat loss to spare muscle
        },
        // Factors for Lightly Active
        "light": {
            "maintenance": (calculationBasis === "Lean Body Mass") ? 0.9 : 0.7,
            "muscle-gain": (calculationBasis === "Lean Body Mass") ? 1.1 : 0.9,
            "fat-loss":    (calculationBasis === "Lean Body Mass") ? 1.2 : 1.0
        },
        // Factors for Moderately Active
        "moderate": {
            "maintenance": (calculationBasis === "Lean Body Mass") ? 1.0 : 0.8,
            "muscle-gain": (calculationBasis === "Lean Body Mass") ? 1.2 : 1.0,
            "fat-loss":    (calculationBasis === "Lean Body Mass") ? 1.3 : 1.1
        },
        // Factors for Very Active
        "very": {
            "maintenance": (calculationBasis === "Lean Body Mass") ? 1.1 : 0.9,
            "muscle-gain": (calculationBasis === "Lean Body Mass") ? 1.3 : 1.1,
            "fat-loss":    (calculationBasis === "Lean Body Mass") ? 1.4 : 1.2
        },
        // Factors for Extra Active (matching your HTML value="extra")
        "extra": {
            "maintenance": (calculationBasis === "Lean Body Mass") ? 1.2 : 1.0,
            "muscle-gain": (calculationBasis === "Lean Body Mass") ? 1.4 : 1.2,
            "fat-loss":    (calculationBasis === "Lean Body Mass") ? 1.5 : 1.3
        }
    };

    // Select the correct protein factor based on activity and goal
    proteinFactor = proteinFactors[activity][goal];
    console.log(`Protein factor (${calculationBasis}):`, proteinFactor);


    // Perform the final calculation using the effective weight and selected protein factor
    var proteinIntake = effectiveWeight * proteinFactor;

    document.getElementById("protein-result").textContent = "Recommended protein intake: " + proteinIntake.toFixed(2) + " grams.";
});
