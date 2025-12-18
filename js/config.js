// CONFIG: Global object containing configuration data and utility methods for the CO2 calculator
// This object provides emission factors, transport modes metadata, carbon credit settings,
// and methods to populate UI elements and handle distance autofill.

var CONFIG = {
    // EMISSION_FACTORS: kg CO2 per km for each transport mode
    EMISSION_FACTORS: {
        bicycle: 0,
        car: 0.12,
        bus: 0.089,
        truck: 0.96
    },

    // TRANSPORT_MODES: Metadata for each transport mode including label, icon, and color
    TRANSPORT_MODES: {
        bicycle: {
            label: "Bicicleta",
            icon: "🚲",
            color: "#10b981"
        },
        car: {
            label: "Carro",
            icon: "🚗",
            color: "#059669"
        },
        bus: {
            label: "Ônibus",
            icon: "🚌",
            color: "#34d399"
        },
        truck: {
            label: "Caminhão",
            icon: "🚚",
            color: "#047857"
        }
    },

    // CARBON_CREDIT: Settings for carbon credits
    CARBON_CREDIT: {
        KG_PER_CREDIT: 1000,
        PRICE_MIN_BRL: 50,
        PRICE_MAX_BRL: 150
    },

    // populateDatalist: Populates the cities datalist with options from RoutesDB
    // Gets cities list from RoutesDB.getAllCities(), creates option elements, appends to datalist
    populateDatalist: function () {
        var cities = RoutesDB.getAllCities();
        var datalist = document.getElementById('cities-list');
        cities.forEach(function (city) {
            var option = document.createElement('option');
            option.value = city;
            datalist.appendChild(option);
        });
    },

    // setupDistanceAutofill: Sets up event listeners for origin and destination inputs
    // Handles automatic distance filling and manual distance toggle
    setupDistanceAutofill: function () {
        var originInput = document.getElementById('origin');
        var destinationInput = document.getElementById('destination');
        var distanceInput = document.getElementById('distance');
        var manualCheckbox = document.getElementById('manual-distance');
        var helperText = distanceInput.nextElementSibling; // The helper text paragraph

        function updateDistance() {
            var origin = originInput.value.trim();
            var destination = destinationInput.value.trim();
            if (origin && destination) {
                var distance = RoutesDB.findDistance(origin, destination);
                if (distance !== null) {
                    distanceInput.value = distance;
                    distanceInput.readOnly = true;
                    helperText.textContent = "Distância encontrada automaticamente";
                    helperText.style.color = "green";
                } else {
                    distanceInput.value = "";
                    distanceInput.readOnly = false;
                    helperText.textContent = "Rota não encontrada. Insira a distância manualmente.";
                    helperText.style.color = "orange";
                }
            } else {
                distanceInput.value = "";
                helperText.textContent = "A distância será preenchida automaticamente";
                helperText.style.color = ""; // Reset to default
            }
        }

        originInput.addEventListener('input', updateDistance);
        destinationInput.addEventListener('input', updateDistance);

        manualCheckbox.addEventListener('change', function () {
            if (manualCheckbox.checked) {
                distanceInput.readOnly = false;
                helperText.textContent = "Insira a distância manualmente";
                helperText.style.color = "";
            } else {
                updateDistance();
            }
        });
    }
};