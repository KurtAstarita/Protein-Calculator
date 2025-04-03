// script.js
document.getElementById("calculate-protein").addEventListener("click", function() {
    // Function to sanitize input (mainly to trim whitespace)
    function sanitizeInput(input) {
        return input.trim();
    }

    var weight = parseFloat(sanitizeInput(document.getElementById("weight-protein").value));
    var activity = document.getElementById("activity-level").value;
    var goal = document.getElementById("goal").value;
    var proteinFactor;

    // Input Validation
    if (isNaN(weight)) {
        document.getElementById("protein-result").textContent = "Please enter a valid weight.";
        return;
    }

    if (weight <= 0) {
        document.getElementById("protein-result").textContent = "Weight must be greater than zero.";
        return;
    }

    // Determine protein factor based on activity and goal
    if (goal === "maintenance") {
        proteinFactor = (activity === "sedentary") ? 0.4 : (activity === "light") ? 0.5 : (activity === "moderate") ? 0.6 : (activity === "very") ? 0.7 : 0.8;
    } else if (goal === "muscle-gain") {
        proteinFactor = (activity === "sedentary") ? 0.8 : (activity === "light") ? 0.9 : (activity === "moderate") ? 1.0 : (activity === "very") ? 1.1 : 1.2;
    } else { // fat-loss
        proteinFactor = (activity === "sedentary") ? 0.6 : (activity === "light") ? 0.7 : (activity === "moderate") ? 0.8 : (activity === "very") ? 0.9 : 1.0;
    }

    // Convert weight to kg if in lbs
    if (document.getElementById("weight-protein").value > 200) {
        weight = weight / 2.205; // Convert lbs to kg
    }

    var proteinIntake = weight * proteinFactor;

    document.getElementById("protein-result").textContent = "Recommended protein intake: " + proteinIntake.toFixed(2) + " grams.";
});
