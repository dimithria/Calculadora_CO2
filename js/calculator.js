// Calculator: Global object containing calculation methods for CO2 emissions
// This object provides methods to calculate emissions, compare transport modes,
// calculate savings, and estimate carbon credits and prices.

var Calculator = {
    // calculateEmission: Calculates CO2 emission for a given distance and transport mode
    // Formula: emission = distanceKm * emissionFactor
    // Returns emission in kg, rounded to 2 decimal places
    calculateEmission: function (distanceKm, transportMode) {
        var factor = CONFIG.EMISSION_FACTORS[transportMode];
        if (factor === undefined) {
            throw new Error("Invalid transport mode: " + transportMode);
        }
        var emission = distanceKm * factor;
        return Math.round(emission * 100) / 100; // Round to 2 decimal places
    },

    // calculateAllModes: Calculates emissions for all transport modes and compares to car
    // Returns sorted array of objects with mode, emission, and percentage vs car
    // Sorted by emission (lowest first)
    calculateAllModes: function (distanceKm) {
        var results = [];
        var carEmission = this.calculateEmission(distanceKm, 'car'); // Baseline
        for (var mode in CONFIG.EMISSION_FACTORS) {
            var emission = this.calculateEmission(distanceKm, mode);
            var percentageVsCar = (emission / carEmission) * 100;
            results.push({
                mode: mode,
                emission: emission,
                percentageVsCar: Math.round(percentageVsCar * 100) / 100 // Round to 2 decimals
            });
        }
        // Sort by emission (lowest first)
        results.sort(function (a, b) {
            return a.emission - b.emission;
        });
        return results;
    },

    // calculateSavings: Calculates savings compared to a baseline emission
    // savedKg = baselineEmission - emission
    // percentage = (savedKg / baselineEmission) * 100
    // Returns object with savedKg and percentage, both rounded to 2 decimals
    calculateSavings: function (emission, baselineEmission) {
        var savedKg = baselineEmission - emission;
        var percentage = (savedKg / baselineEmission) * 100;
        return {
            savedKg: Math.round(savedKg * 100) / 100,
            percentage: Math.round(percentage * 100) / 100
        };
    },

    // calculateCarbonCredits: Calculates number of carbon credits needed to offset emission
    // credits = emissionKg / KG_PER_CREDIT
    // Returns credits rounded to 4 decimal places
    calculateCarbonCredits: function (emissionKg) {
        var credits = emissionKg / CONFIG.CARBON_CREDIT.KG_PER_CREDIT;
        return Math.round(credits * 10000) / 10000; // Round to 4 decimal places
    },

    // estimateCreditPrice: Estimates price range for carbon credits in BRL
    // min = credits * PRICE_MIN_BRL
    // max = credits * PRICE_MAX_BRL
    // average = (min + max) / 2
    // Returns object with min, max, average prices
    estimateCreditPrice: function (credits) {
        var min = credits * CONFIG.CARBON_CREDIT.PRICE_MIN_BRL;
        var max = credits * CONFIG.CARBON_CREDIT.PRICE_MAX_BRL;
        var average = (min + max) / 2;
        return {
            min: Math.round(min * 100) / 100, // Round to 2 decimals
            max: Math.round(max * 100) / 100,
            average: Math.round(average * 100) / 100
        };
    }
};