// UI: Global object containing utility and rendering methods for the CO2 calculator interface
// This object provides methods to format data, manipulate DOM elements, and render HTML content.

var UI = {
    // UTILITY METHODS

    // formatNumber: Formats a number with specified decimals and thousand separators
    // Uses toFixed for decimals, then toLocaleString('pt-BR') for separators
    formatNumber: function (number, decimals) {
        return parseFloat(number).toFixed(decimals).toLocaleString('pt-BR');
    },

    // formatCurrency: Formats a value as Brazilian Real currency
    // Uses toLocaleString('pt-BR') with currency style
    formatCurrency: function (value) {
        return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    },

    // showElement: Shows an element by removing the 'hidden' class
    showElement: function (elementID) {
        var element = document.getElementById(elementID);
        if (element) {
            element.classList.remove('hidden');
        }
    },

    // hideElement: Hides an element by adding the 'hidden' class
    hideElement: function (elementID) {
        var element = document.getElementById(elementID);
        if (element) {
            element.classList.add('hidden');
        }
    },

    // scrollToElement: Smoothly scrolls to an element
    scrollToElement: function (elementId) {
        var element = document.getElementById(elementId);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
    },

    // RENDERING METHODS

    // renderResults: Renders the results section HTML
    // Creates cards for route, distance, emission, transport, and savings (if applicable)
    // Uses BEM naming: results_card, results_card__title, results_card__value, etc.
    renderResults: function (data) {
        var modeData = CONFIG.TRANSPORT_MODES[data.mode];
        var html = `
            <div class="results_card results_card--route">
                <h3 class="results_card__title">Rota</h3>
                <p class="results_card__value">${data.origin} → ${data.destination}</p>
            </div>
            <div class="results_card results_card--distance">
                <h3 class="results_card__title">Distância</h3>
                <p class="results_card__value">${this.formatNumber(data.distance, 0)} km</p>
            </div>
            <div class="results_card results_card--emission">
                <h3 class="results_card__title">Emissão de CO2</h3>
                <p class="results_card__value">${this.formatNumber(data.emission, 2)} kg 🌿</p>
            </div>
            <div class="results_card results_card--transport">
                <h3 class="results_card__title">Modo de Transporte</h3>
                <p class="results_card__value">${modeData.icon} ${modeData.label}</p>
            </div>
        `;
        if (data.mode !== 'car' && data.saving) {
            html += `
                <div class="results_card results_card--saving">
                    <h3 class="results_card__title">Economia vs Carro</h3>
                    <p class="results_card__value">${this.formatNumber(data.saving.savedKg, 2)} kg (${this.formatNumber(data.saving.percentage, 1)}%)</p>
                </div>
            `;
        }
        return html;
    },

    // renderComparison: Renders the comparison section HTML
    // Creates items for each transport mode with stats, progress bar, and selection indicator
    // Progress bar width based on emission relative to max emission
    // Color coding: green (0-25%), yellow (25-75%), orange (75-100%), red (>100%)
    renderComparison: function (modesArray, selectedMode) {
        var maxEmission = Math.max(...modesArray.map(m => m.emission));
        var html = '';
        modesArray.forEach(function (modeData) {
            var isSelected = modeData.mode === selectedMode;
            var modeMeta = CONFIG.TRANSPORT_MODES[modeData.mode];
            var percentage = modeData.percentageVsCar;
            var barWidth = (modeData.emission / maxEmission) * 100;
            var barColor = percentage <= 25 ? 'green' : percentage <= 75 ? 'yellow' : percentage <= 100 ? 'orange' : 'red';
            var selectedClass = isSelected ? ' comparison_item--selected' : '';
            html += `
                <div class="comparison_item${selectedClass}">
                    <div class="comparison_item__header">
                        <span class="comparison_item__icon">${modeMeta.icon}</span>
                        <span class="comparison_item__label">${modeMeta.label}</span>
                        ${isSelected ? '<span class="comparison_item__badge">Selecionado</span>' : ''}
                    </div>
                    <div class="comparison_item__stats">
                        <span class="comparison_item__emission">${UI.formatNumber(modeData.emission, 2)} kg CO2</span>
                        <span class="comparison_item__percentage">${UI.formatNumber(percentage, 1)}% vs carro</span>
                    </div>
                    <div class="comparison_item__bar">
                        <div class="comparison_item__bar-fill comparison_item__bar-fill--${barColor}" style="width: ${barWidth}%"></div>
                    </div>
                </div>
            `;
        });
        html += `
            <div class="comparison_tip">
                <p>Dica: Escolha modos de transporte com menor emissão para reduzir seu impacto ambiental.</p>
            </div>
        `;
        return html;
    },

    // renderCarbonCredits: Renders the carbon credits section HTML
    // Creates a grid with credits card and price card, plus info and button
    renderCarbonCredits: function (creditsData) {
        var html = `
            <div class="carbon-credits__grid">
                <div class="carbon-credits__card">
                    <h3 class="carbon-credits__card-title">Créditos Necessários</h3>
                    <p class="carbon-credits__card-value">${this.formatNumber(creditsData.credits, 4)}</p>
                    <p class="carbon-credits__card-helper">1 crédito = 1000 kg CO2</p>
                </div>
                <div class="carbon-credits__card">
                    <h3 class="carbon-credits__card-title">Preço Estimado</h3>
                    <p class="carbon-credits__card-value">${this.formatCurrency(creditsData.price.average)}</p>
                    <p class="carbon-credits__card-helper">Faixa: ${this.formatCurrency(creditsData.price.min)} - ${this.formatCurrency(creditsData.price.max)}</p>
                </div>
            </div>
            <div class="carbon-credits__info">
                <p>Créditos de carbono ajudam a compensar emissões apoiando projetos de redução de CO2, como reflorestamento e energias renováveis.</p>
            </div>
            <button class="carbon-credits__button">Compensar Emissões</button>
        `;
        return html;
    },

    // showLoading: Shows loading state on a button
    // Saves original text, disables button, shows spinner and "Calculando..." text
    showLoading: function (buttonElement) {
        buttonElement.dataset.originalText = buttonElement.innerHTML;
        buttonElement.disabled = true;
        buttonElement.innerHTML = '<span class="spinner"></span> Calculando...';
    },

    // hideLoading: Hides loading state on a button
    // Enables button, restores original text
    hideLoading: function (buttonElement) {
        buttonElement.disabled = false;
        buttonElement.innerHTML = buttonElement.dataset.originalText;
    }
};