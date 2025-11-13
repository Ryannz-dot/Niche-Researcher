// DOM Elements
const searchForm = document.getElementById('searchForm');
const topicInput = document.getElementById('topicInput');
const searchBtn = document.getElementById('searchBtn');
const resultsSection = document.getElementById('resultsSection');
const errorMessage = document.getElementById('errorMessage');
const exampleBtns = document.querySelectorAll('.example-btn');

// Event Listeners
searchForm.addEventListener('submit', handleSearch);

exampleBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        const topic = btn.getAttribute('data-topic');
        topicInput.value = topic;
        handleSearch(new Event('submit'));
    });
});

// Handle search submission
async function handleSearch(e) {
    e.preventDefault();

    const topic = topicInput.value.trim();

    if (!topic) {
        showError('Please enter a topic to analyze');
        return;
    }

    // Show loading state
    setLoadingState(true);
    hideError();
    resultsSection.style.display = 'none';

    try {
        const response = await fetch('/api/analyze', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ topic }),
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
    const html = `
        <div class="results-header">
            <h2 class="results-title">Analysis Results for: ${data.topic}</h2>
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
