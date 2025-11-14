// DOM Elements
const searchForm = document.getElementById('searchForm');
const topicInput = document.getElementById('topicInput');
const searchBtn = document.getElementById('searchBtn');
const resultsSection = document.getElementById('resultsSection');
const errorMessage = document.getElementById('errorMessage');
const exampleBtns = document.querySelectorAll('.example-btn');
const providerSelect = document.getElementById('providerSelect');
const modelSelect = document.getElementById('modelSelect');

// Modal Elements
const settingsBtn = document.getElementById('settingsBtn');
const settingsModal = document.getElementById('settingsModal');
const closeModal = document.getElementById('closeModal');
const openaiKeyInput = document.getElementById('openaiKeyInput');
const openrouterKeyInput = document.getElementById('openrouterKeyInput');
const saveKeysBtn = document.getElementById('saveKeysBtn');
const clearKeysBtn = document.getElementById('clearKeysBtn');
const keyStatus = document.getElementById('keyStatus');

// State
let availableModels = {};
let currentProvider = '';

// API Key Management
const API_KEYS = {
    openai: 'temp_openai_key',
    openrouter: 'temp_openrouter_key'
};

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    loadModels();
    loadSavedKeys();
    setupModalListeners();
});

// Event Listeners
searchForm.addEventListener('submit', handleSearch);

exampleBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        const topic = btn.getAttribute('data-topic');
        topicInput.value = topic;
        handleSearch(new Event('submit'));
    });
});

providerSelect.addEventListener('change', (e) => {
    currentProvider = e.target.value;
    updateModelOptions();
});

// Load available models
async function loadModels() {
    try {
        const response = await fetch('/api/models');
        const data = await response.json();

        availableModels = data.models;
        const defaults = data.defaults;

        // Populate provider dropdown
        providerSelect.innerHTML = '';
        Object.keys(availableModels).forEach(provider => {
            const option = document.createElement('option');
            option.value = provider;
            option.textContent = provider.charAt(0).toUpperCase() + provider.slice(1);
            if (provider === defaults.provider) {
                option.selected = true;
            }
            providerSelect.appendChild(option);
        });

        // Set current provider and update models
        currentProvider = providerSelect.value || defaults.provider;
        updateModelOptions(defaults.model);
    } catch (error) {
        console.error('Failed to load models:', error);
        providerSelect.innerHTML = '<option value="openai">OpenAI</option>';
        modelSelect.innerHTML = '<option value="gpt-4o-mini">GPT-4o Mini</option>';
    }
}

// Update model options based on selected provider
function updateModelOptions(defaultModel = null) {
    const models = availableModels[currentProvider] || [];

    modelSelect.innerHTML = '';

    if (models.length === 0) {
        const option = document.createElement('option');
        option.value = '';
        option.textContent = 'No models available';
        modelSelect.appendChild(option);
        return;
    }

    // Group models by category if using OpenRouter
    if (currentProvider === 'openrouter') {
        const categories = {};
        models.forEach(model => {
            if (!categories[model.category]) {
                categories[model.category] = [];
            }
            categories[model.category].push(model);
        });

        Object.keys(categories).forEach(category => {
            const optgroup = document.createElement('optgroup');
            optgroup.label = category.charAt(0).toUpperCase() + category.slice(1);

            categories[category].forEach(model => {
                const option = document.createElement('option');
                option.value = model.id;
                option.textContent = model.name;
                if (defaultModel && model.id === defaultModel) {
                    option.selected = true;
                }
                optgroup.appendChild(option);
            });

            modelSelect.appendChild(optgroup);
        });
    } else {
        // Simple list for OpenAI
        models.forEach(model => {
            const option = document.createElement('option');
            option.value = model.id;
            option.textContent = model.name;
            if (defaultModel && model.id === defaultModel) {
                option.selected = true;
            }
            modelSelect.appendChild(option);
        });
    }
}

// Modal Management
function setupModalListeners() {
    // Open modal
    settingsBtn.addEventListener('click', () => {
        settingsModal.style.display = 'flex';
        loadSavedKeys();
    });

    // Close modal
    closeModal.addEventListener('click', () => {
        settingsModal.style.display = 'none';
    });

    // Close modal on outside click
    settingsModal.addEventListener('click', (e) => {
        if (e.target === settingsModal) {
            settingsModal.style.display = 'none';
        }
    });

    // Close modal on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && settingsModal.style.display === 'flex') {
            settingsModal.style.display = 'none';
        }
    });

    // Toggle password visibility
    document.querySelectorAll('.toggle-visibility').forEach(btn => {
        btn.addEventListener('click', () => {
            const targetId = btn.getAttribute('data-target');
            const input = document.getElementById(targetId);
            if (input.type === 'password') {
                input.type = 'text';
            } else {
                input.type = 'password';
            }
        });
    });

    // Save keys
    saveKeysBtn.addEventListener('click', saveKeys);

    // Clear keys
    clearKeysBtn.addEventListener('click', clearKeys);
}

// Load saved keys from sessionStorage
function loadSavedKeys() {
    const openaiKey = sessionStorage.getItem(API_KEYS.openai);
    const openrouterKey = sessionStorage.getItem(API_KEYS.openrouter);

    if (openaiKey) {
        openaiKeyInput.value = openaiKey;
    }
    if (openrouterKey) {
        openrouterKeyInput.value = openrouterKey;
    }

    updateKeyStatus();
}

// Save keys to sessionStorage
function saveKeys() {
    const openaiKey = openaiKeyInput.value.trim();
    const openrouterKey = openrouterKeyInput.value.trim();

    if (!openaiKey && !openrouterKey) {
        showKeyStatus('Please enter at least one API key', 'error');
        return;
    }

    if (openaiKey) {
        sessionStorage.setItem(API_KEYS.openai, openaiKey);
    }
    if (openrouterKey) {
        sessionStorage.setItem(API_KEYS.openrouter, openrouterKey);
    }

    showKeyStatus('API keys saved successfully! (Session only)', 'success');
    updateKeyStatus();

    // Reload models with new keys
    setTimeout(() => {
        settingsModal.style.display = 'none';
        loadModels();
    }, 1500);
}

// Clear keys from sessionStorage
function clearKeys() {
    sessionStorage.removeItem(API_KEYS.openai);
    sessionStorage.removeItem(API_KEYS.openrouter);
    openaiKeyInput.value = '';
    openrouterKeyInput.value = '';
    showKeyStatus('All API keys cleared', 'success');
    updateKeyStatus();
}

// Get stored API keys
function getStoredKeys() {
    return {
        openaiKey: sessionStorage.getItem(API_KEYS.openai) || null,
        openrouterKey: sessionStorage.getItem(API_KEYS.openrouter) || null
    };
}

// Update key status display
function updateKeyStatus() {
    const { openaiKey, openrouterKey } = getStoredKeys();

    if (!openaiKey && !openrouterKey) {
        keyStatus.style.display = 'none';
        return;
    }

    let statusText = 'Configured: ';
    const keys = [];
    if (openaiKey) keys.push('OpenAI');
    if (openrouterKey) keys.push('OpenRouter');
    statusText += keys.join(', ');

    keyStatus.textContent = statusText;
    keyStatus.className = 'key-status success';
    keyStatus.style.display = 'flex';
}

// Show key status message
function showKeyStatus(message, type) {
    keyStatus.textContent = message;
    keyStatus.className = `key-status ${type}`;
    keyStatus.style.display = 'flex';
}

// Handle search submission
async function handleSearch(e) {
    e.preventDefault();

    const topic = topicInput.value.trim();
    const provider = providerSelect.value;
    const model = modelSelect.value;

    if (!topic) {
        showError('Please enter a topic to analyze');
        return;
    }

    // Show loading state
    setLoadingState(true);
    hideError();
    resultsSection.style.display = 'none';

    try {
        // Get stored API keys
        const { openaiKey, openrouterKey } = getStoredKeys();

        // Prepare request body
        const requestBody = {
            topic,
            provider,
            model
        };

        // Add API keys if available (frontend keys override backend)
        if (openaiKey) {
            requestBody.openaiKey = openaiKey;
        }
        if (openrouterKey) {
            requestBody.openrouterKey = openrouterKey;
        }

        const response = await fetch('/api/analyze', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestBody),
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || 'Failed to analyze niche');
        }

        displayResults(data);
        scrollToResults();
    } catch (error) {
        console.error('Error:', error);
        showError(error.message || 'Failed to analyze niche. Please try again.');
    } finally {
        setLoadingState(false);
    }
}

// Set loading state
function setLoadingState(isLoading) {
    const btnText = searchBtn.querySelector('.btn-text');
    const btnLoading = searchBtn.querySelector('.btn-loading');

    if (isLoading) {
        btnText.style.display = 'none';
        btnLoading.style.display = 'flex';
        searchBtn.disabled = true;
    } else {
        btnText.style.display = 'block';
        btnLoading.style.display = 'none';
        searchBtn.disabled = false;
    }
}

// Display results
function displayResults(data) {
    const modelInfo = data.provider && data.model
        ? `<p style="font-size: 0.875rem; color: var(--text-light); margin-top: 0.5rem;">
            Powered by ${data.provider.charAt(0).toUpperCase() + data.provider.slice(1)}: ${data.model}
           </p>`
        : '';

    const html = `
        <div class="results-header">
            <h2 class="results-title">Analysis Results for: ${data.topic}</h2>
            ${modelInfo}
            <div class="scores-grid">
                ${createScoreCard('Competition Score', data.competitionScore, 'Lower is better')}
                ${createScoreCard('Trend Score', data.trendScore, 'Market interest', 'success')}
                ${createScoreCard('Opportunity Rating', data.opportunityRating, 'Overall potential', 'success')}
                ${createMarketSizeCard(data.marketSize, data.difficultyLevel)}
            </div>
        </div>

        <div class="analysis-grid">
            ${createCompetitionAnalysis(data.competitionAnalysis)}
            ${createTrendAnalysis(data.trendAnalysis)}
        </div>

        <div class="app-concepts">
            <div class="app-concepts-header">
                <h2>💡 AI-Generated App Concepts</h2>
                <p class="subtitle">Actionable web app ideas tailored for this niche</p>
            </div>
            <div class="app-concepts-grid">
                ${data.appConcepts.map(app => createAppCard(app)).join('')}
            </div>
        </div>

        ${createRecommendationsAndRisks(data.recommendations, data.risks)}
    `;

    resultsSection.innerHTML = html;
    resultsSection.style.display = 'block';

    // Animate score bars
    setTimeout(() => {
        document.querySelectorAll('.score-bar-fill').forEach(bar => {
            const width = bar.getAttribute('data-width');
            bar.style.width = width + '%';
        });
    }, 100);
}

// Create score card
function createScoreCard(label, value, description, type = '') {
    return `
        <div class="score-card ${type}">
            <div class="score-label">${label}</div>
            <div class="score-value">${value}</div>
            <div class="score-bar">
                <div class="score-bar-fill" data-width="${value}" style="width: 0%;"></div>
            </div>
            <p style="margin-top: 0.5rem; font-size: 0.875rem; color: var(--text-light);">${description}</p>
        </div>
    `;
}

// Create market size card
function createMarketSizeCard(marketSize, difficulty) {
    return `
        <div class="score-card">
            <div class="score-label">Market Overview</div>
            <div style="margin-top: 0.75rem;">
                <div style="margin-bottom: 0.75rem;">
                    <span style="font-size: 0.875rem; color: var(--text-light);">Market Size:</span>
                    <span class="badge ${marketSize}" style="margin-left: 0.5rem;">${marketSize}</span>
                </div>
                <div>
                    <span style="font-size: 0.875rem; color: var(--text-light);">Difficulty:</span>
                    <span class="badge ${difficulty}" style="margin-left: 0.5rem;">${difficulty}</span>
                </div>
            </div>
        </div>
    `;
}

// Create competition analysis
function createCompetitionAnalysis(competition) {
    return `
        <div class="analysis-card">
            <h3>
                🎯 Competition Analysis
                <span class="badge ${competition.level}">${competition.level}</span>
            </h3>
            <p>${competition.description}</p>
            ${competition.keyCompetitors && competition.keyCompetitors.length > 0 ? `
                <div style="margin-top: 1rem;">
                    <strong style="font-size: 0.875rem; color: var(--text-light);">Key Competitors:</strong>
                    <div class="chip-list">
                        ${competition.keyCompetitors.map(comp => `<span class="chip">${comp}</span>`).join('')}
                    </div>
                </div>
            ` : ''}
        </div>
    `;
}

// Create trend analysis
function createTrendAnalysis(trend) {
    return `
        <div class="analysis-card">
            <h3>
                📈 Trend Analysis
                <span class="badge ${trend.direction}">${trend.direction}</span>
            </h3>
            <p>${trend.description}</p>
            <div style="margin-top: 1rem;">
                <strong style="font-size: 0.875rem; color: var(--text-light);">Growth Potential:</strong>
                <span class="badge ${trend.growthPotential}" style="margin-left: 0.5rem;">${trend.growthPotential}</span>
            </div>
        </div>
    `;
}

// Create app card
function createAppCard(app) {
    return `
        <div class="app-card">
            <div class="app-card-header">
                <h3>${app.name}</h3>
                <p style="opacity: 0.9; margin-top: 0.5rem;">${app.description}</p>
            </div>
            <div class="app-card-body">
                <div class="info-grid">
                    <div class="info-item">
                        <div class="info-label">Target Audience</div>
                        <div class="info-value">${app.targetAudience}</div>
                    </div>
                    <div class="info-item">
                        <div class="info-label">Dev Time</div>
                        <div class="info-value">${app.estimatedDevTime}</div>
                    </div>
                </div>

                ${app.uniqueSellingPoint ? `
                    <div class="app-section">
                        <h4>🌟 Unique Selling Point</h4>
                        <p>${app.uniqueSellingPoint}</p>
                    </div>
                ` : ''}

                <div class="app-section">
                    <h4>✨ Key Features</h4>
                    <ul class="feature-list">
                        ${app.features.map(feature => `<li>${feature}</li>`).join('')}
                    </ul>
                </div>

                <div class="app-section">
                    <h4>💰 Monetization Strategies</h4>
                    <ul class="monetization-list">
                        ${app.monetization.map(strategy => `<li>${strategy}</li>`).join('')}
                    </ul>
                </div>

                ${app.techStack && app.techStack.length > 0 ? `
                    <div class="app-section">
                        <h4>🛠️ Recommended Tech Stack</h4>
                        <div class="tech-tags">
                            ${app.techStack.map(tech => `<span class="tech-tag">${tech}</span>`).join('')}
                        </div>
                    </div>
                ` : ''}
            </div>
        </div>
    `;
}

// Create recommendations and risks
function createRecommendationsAndRisks(recommendations, risks) {
    return `
        <div class="recommendations-risks">
            <div class="recommendation-card">
                <h3>✅ Recommendations</h3>
                <ul class="list-items">
                    ${recommendations.map(rec => `<li>${rec}</li>`).join('')}
                </ul>
            </div>
            <div class="risk-card">
                <h3>⚠️ Potential Risks</h3>
                <ul class="list-items">
                    ${risks.map(risk => `<li>${risk}</li>`).join('')}
                </ul>
            </div>
        </div>
    `;
}

// Show error message
function showError(message) {
    errorMessage.textContent = message;
    errorMessage.style.display = 'block';
    setTimeout(() => {
        errorMessage.style.display = 'none';
    }, 5000);
}

// Hide error message
function hideError() {
    errorMessage.style.display = 'none';
}

// Scroll to results
function scrollToResults() {
    resultsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
}
