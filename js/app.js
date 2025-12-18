// app.js: Main application logic for the CO2 Calculator
// Handles initialization and form submission events

(function () {
    'use strict';

    // Initialization when DOM is ready
    document.addEventListener('DOMContentLoaded', function () {
        // 1. Populate cities datalist for autocomplete
        CONFIG.populateDatalist();

        // 2. Setup distance autofill functionality
        CONFIG.setupDistanceAutofill();

        // 3. Get the calculator form element
        var calculatorForm = document.getElementById('calculator-form');

        // 4. Add submit event listener to handle form submission
        calculatorForm.addEventListener('submit', handleFormSubmit);

        // 5. Log initialization message to console
        console.log('Calculadora inicializada!');
    });

    // Form submit handler
    function handleFormSubmit(event) {
        // 1. Prevent default form submission behavior
        event.preventDefault();

        // 2. Get form values
        var originValue = document.getElementById('origin').value.trim();
        var destinationValue = document.getElementById('destination').value.trim();
        var distanceValue = parseFloat(document.getElementById('distance').value);
        var transportModeValue = document.querySelector('input[name="transport"]:checked').value;

        // 3. Validate inputs
        if (!originValue || !destinationValue || isNaN(distanceValue) || distanceValue <= 0) {
            alert('Por favor, preencha todos os campos corretamente. A distância deve ser maior que zero.');
            return;
        }

        // 4. Get submit button element
        var submitButton = document.querySelector('#calculator-form button[type="submit"]');

        // 5. Show loading state on button
        UI.showLoading(submitButton);

        // 6. Hide previous results sections
        UI.hideElement('results');
        UI.hideElement('comparison');
        UI.hideElement('carbon-credits');

        // 7. Simulate processing with 1500ms delay
        setTimeout(function () {
            try {
                // Calculate emission for selected mode
                var selectedEmission = Calculator.calculateEmission(distanceValue, transportModeValue);

                // Calculate car emission as baseline
                var carEmission = Calculator.calculateEmission(distanceValue, 'car');

                // Calculate savings compared to car
                var savingsData = Calculator.calculateSavings(selectedEmission, carEmission);

                // Calculate all modes comparison
                var allModesComparison = Calculator.calculateAllModes(distanceValue);

                // Calculate carbon credits and price estimate
                var carbonCredits = Calculator.calculateCarbonCredits(selectedEmission);
                var creditPriceEstimate = Calculator.estimateCreditPrice(carbonCredits);

                // Build data objects for rendering
                var resultsData = {
                    origin: originValue,
                    destination: destinationValue,
                    distance: distanceValue,
                    mode: transportModeValue,
                    emission: selectedEmission,
                    savings: savingsData
                };

                var creditsData = {
                    credits: carbonCredits,
                    price: creditPriceEstimate
                };

                // Render and display results
                document.getElementById('results-content').innerHTML = UI.renderResults(resultsData);
                document.getElementById('comparison-content').innerHTML = UI.renderComparison(allModesComparison, transportModeValue);
                document.getElementById('carbon-credits-content').innerHTML = UI.renderCarbonCredits(creditsData);

                // Show all three sections
                UI.showElement('results');
                UI.showElement('comparison');
                UI.showElement('carbon-credits');

                // Scroll to results section
                UI.scrollToElement('results');

                // Hide loading state
                UI.hideLoading(submitButton);

            } catch (error) {
                // Log error to console
                console.error('Erro durante o cálculo:', error);

                // Show user-friendly alert
                alert('Ocorreu um erro durante o cálculo. Por favor, tente novamente.');

                // Hide loading state
                UI.hideLoading(submitButton);
            }
        }, 1500);
    }

})();