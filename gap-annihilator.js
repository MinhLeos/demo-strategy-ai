// GAP ANNIHILATOR MODULE - Desktop-First Strategic Planning
// 5-Step Gap Analysis Wizard

const GapAnnihilator = {
  // State Management
  currentStep: 1,
  totalSteps: 6,
  gapData: {
    goalId: null,
    goal: "",
    desiredState: {
      description: "",
      metric: "",
      value: 0,
      timeframe: "year",
      monthly: 0
    },
    currentState: {
      description: "",
      metric: "",
      value: 0,
      period: "last-year",
      monthly: 0
    },
    gap: {
      absolute: 0,
      percentage: 0,
      monthly: 0,
      weekly: 0,
      daily: 0
    },
    funnel: [],
    strategy: {
      milestones: [],
      activities: [],
      mits: []
    },
    createdAt: null,
    updatedAt: null
  },

  // Initialize
  init() {
    this.gapData.goalId = Date.now();
    this.gapData.createdAt = new Date().toISOString();
    this.renderStep1();
  },

  // STEP 1: Introduction
  renderStep1() {
    const container = document.getElementById('gapAnnihilatorContainer');
    container.innerHTML = `
      <div class="gap-step" data-step="1">
        <div class="gap-hero">
          <div class="hero-icon">
            <i class="fas fa-bullseye"></i>
          </div>
          <h1 class="hero-title">Gap Annihilator</h1>
          <p class="hero-subtitle">Turn Goals into Strategic Action Plans</p>
        </div>

        <div class="gap-explanation">
          <div class="explanation-card">
            <h2>What is Gap Analysis?</h2>
            <p>
              Gap Annihilator is here to help you <strong>capitalize on opportunities</strong> 
              or <strong>resolve non-optimum situations</strong>.
            </p>
            <p>
              We use <strong>Gap Analysis</strong> technique as a tool to help you:
            </p>
            <ul class="benefit-list">
              <li>
                <i class="fas fa-check-circle"></i>
                <span>Cleanly state your goal</span>
              </li>
              <li>
                <i class="fas fa-check-circle"></i>
                <span>Understand the gap between desired state and current state</span>
              </li>
              <li>
                <i class="fas fa-check-circle"></i>
                <span>Strategically work towards achieving that goal</span>
              </li>
            </ul>
          </div>

          <div class="gap-visual">
            <div class="visual-diagram">
              <div class="state-box current-state-box">
                <i class="fas fa-map-marker-alt"></i>
                <span>Current State</span>
                <p>Where you are now</p>
              </div>
              
              <div class="gap-arrow">
                <div class="arrow-line"></div>
                <div class="arrow-label">
                  <i class="fas fa-chart-line"></i>
                  <span>The Gap</span>
                </div>
                <div class="arrow-head">
                  <i class="fas fa-arrow-right"></i>
                </div>
              </div>
              
              <div class="state-box desired-state-box">
                <i class="fas fa-trophy"></i>
                <span>Desired State</span>
                <p>Where you want to be</p>
              </div>
            </div>
          </div>

          <div class="example-card">
            <h3><i class="fas fa-lightbulb"></i> Real Estate Example:</h3>
            <div class="example-content">
              <div class="example-row">
                <strong>Desired State:</strong>
                <span>Selling $20M worth of real estate per year</span>
              </div>
              <div class="example-row">
                <strong>Current State:</strong>
                <span>Sold $11M in the past 12 months ($917K/month avg)</span>
              </div>
              <div class="example-row highlight">
                <strong>Gap:</strong>
                <span>$9M per year shortfall ($750K/month to close)</span>
              </div>
            </div>
          </div>
        </div>

        <div class="step-actions">
          <button class="btn btn-primary btn-large" onclick="GapAnnihilator.nextStep()">
            Start Gap Analysis
            <i class="fas fa-rocket"></i>
          </button>
        </div>
      </div>
    `;
  },

  // STEP 2: Goal Definition
  renderStep2() {
    const container = document.getElementById('gapAnnihilatorContainer');
    container.innerHTML = `
      <div class="gap-step" data-step="2">
        <div class="step-header">
          <button class="back-btn" onclick="GapAnnihilator.previousStep()">
            <i class="fas fa-arrow-left"></i>
          </button>
          <h2 class="step-title">Define Your Goal</h2>
          <div class="step-badge">Step 1 of 5</div>
          <div class="step-progress">
            <div class="progress-bar" style="width: 20%;"></div>
          </div>
        </div>

        <div class="step-content">
          <div class="instruction-panel">
            <i class="fas fa-question-circle"></i>
            <p><strong>What is your first goal?</strong> Describe what you want to achieve. Be specific!</p>
          </div>

          <div class="goal-input-section">
            <label class="input-label">Your Goal</label>
            <textarea 
              id="goalInput" 
              class="goal-textarea"
              placeholder="Example: Increase my real estate sales revenue"
              rows="3"
            ></textarea>
            <div class="input-hint">
              <i class="fas fa-info-circle"></i>
              Be clear and specific about what you want to achieve
            </div>
          </div>

          <div class="goal-templates">
            <h3>Or choose a template:</h3>
            <div class="template-grid">
              <button class="template-card" onclick="GapAnnihilator.useTemplate('revenue')">
                <i class="fas fa-dollar-sign"></i>
                <div class="template-content">
                  <h4>Increase Revenue</h4>
                  <p>Grow sales or income</p>
                </div>
              </button>
              
              <button class="template-card" onclick="GapAnnihilator.useTemplate('time')">
                <i class="fas fa-clock"></i>
                <div class="template-content">
                  <h4>Free Up Time</h4>
                  <p>Increase productivity</p>
                </div>
              </button>
              
              <button class="template-card" onclick="GapAnnihilator.useTemplate('clients')">
                <i class="fas fa-users"></i>
                <div class="template-content">
                  <h4>Grow Client Base</h4>
                  <p>Expand customer reach</p>
                </div>
              </button>
              
              <button class="template-card" onclick="GapAnnihilator.useTemplate('skill')">
                <i class="fas fa-graduation-cap"></i>
                <div class="template-content">
                  <h4>Develop New Skill</h4>
                  <p>Learn and improve</p>
                </div>
              </button>
            </div>
          </div>
        </div>

        <div class="step-actions">
          <button class="btn btn-secondary" onclick="GapAnnihilator.previousStep()">
            <i class="fas fa-arrow-left"></i>
            Back
          </button>
          <button 
            class="btn btn-primary" 
            onclick="GapAnnihilator.saveGoalAndContinue()"
            id="continueStep2"
            disabled
          >
            Continue
            <i class="fas fa-arrow-right"></i>
          </button>
        </div>
      </div>
    `;

    // Enable continue button when text is entered
    const goalInput = document.getElementById('goalInput');
    const continueBtn = document.getElementById('continueStep2');
    
    goalInput.addEventListener('input', (e) => {
      continueBtn.disabled = e.target.value.trim().length < 10;
    });
  },

  useTemplate(type) {
    const templates = {
      revenue: "Increase my annual revenue to $500,000",
      time: "Free up 20 hours per week for strategic work",
      clients: "Grow my client base from 50 to 200 active clients",
      skill: "Master digital marketing and generate 100 qualified leads per month"
    };

    document.getElementById('goalInput').value = templates[type];
    document.getElementById('continueStep2').disabled = false;
  },

  saveGoalAndContinue() {
    const goal = document.getElementById('goalInput').value.trim();
    if (goal.length < 10) {
      this.showNotification('Please provide more detail about your goal', 'warning');
      return;
    }

    this.gapData.goal = goal;
    this.nextStep();
  },

  // STEP 3: Desired State
  renderStep3() {
    const container = document.getElementById('gapAnnihilatorContainer');
    container.innerHTML = `
      <div class="gap-step" data-step="3">
        <div class="step-header">
          <button class="back-btn" onclick="GapAnnihilator.previousStep()">
            <i class="fas fa-arrow-left"></i>
          </button>
          <h2 class="step-title">Define Desired State</h2>
          <div class="step-badge">Step 2 of 5</div>
          <div class="step-progress">
            <div class="progress-bar" style="width: 40%;"></div>
          </div>
        </div>

        <div class="step-content">
          <div class="instruction-panel">
            <i class="fas fa-bullseye"></i>
            <p>
              <strong>Now let's name the desired state as a measurable and achievable goal.</strong>
              Make it specific with numbers!
            </p>
          </div>

          <div class="goal-context-card">
            <div class="context-label">Your Goal:</div>
            <div class="context-value">${this.gapData.goal}</div>
          </div>

          <div class="form-grid">
            <div class="form-group">
              <label class="input-label">
                Metric / What to Measure
                <span class="required">*</span>
              </label>
              <input 
                type="text" 
                id="desiredMetric" 
                class="form-input"
                placeholder="e.g., Real estate sold per year"
              />
            </div>

            <div class="form-group">
              <label class="input-label">
                Target Value
                <span class="required">*</span>
              </label>
              <input 
                type="text" 
                id="desiredValue" 
                class="form-input"
                placeholder="e.g., $20M or 200 clients"
              />
            </div>

            <div class="form-group">
              <label class="input-label">
                Time Frame
                <span class="required">*</span>
              </label>
              <select id="desiredTimeframe" class="form-input">
                <option value="month">Per Month</option>
                <option value="quarter">Per Quarter</option>
                <option value="year" selected>Per Year</option>
              </select>
            </div>
          </div>

          <div class="ai-suggestion" id="aiSuggestion" style="display: none;">
            <div class="suggestion-icon">
              <i class="fas fa-magic"></i>
            </div>
            <div class="suggestion-content">
              <strong>AI Suggestion:</strong>
              <p id="suggestionText"></p>
              <button class="btn btn-sm" onclick="GapAnnihilator.applySuggestion()">
                <i class="fas fa-check"></i>
                Use This
              </button>
            </div>
          </div>

          <div class="preview-card desired-preview">
            <div class="preview-label">
              <i class="fas fa-eye"></i>
              Preview - Desired State:
            </div>
            <div class="preview-text" id="desiredPreview">
              <em>Fill in the fields above to see preview...</em>
            </div>
          </div>
        </div>

        <div class="step-actions">
          <button class="btn btn-secondary" onclick="GapAnnihilator.previousStep()">
            <i class="fas fa-arrow-left"></i>
            Back
          </button>
          <button 
            class="btn btn-primary" 
            onclick="GapAnnihilator.saveDesiredState()"
            id="continueStep3"
            disabled
          >
            Continue
            <i class="fas fa-arrow-right"></i>
          </button>
        </div>
      </div>
    `;

    this.setupDesiredStateListeners();
  },

  setupDesiredStateListeners() {
    const metric = document.getElementById('desiredMetric');
    const value = document.getElementById('desiredValue');
    const timeframe = document.getElementById('desiredTimeframe');
    const preview = document.getElementById('desiredPreview');
    const continueBtn = document.getElementById('continueStep3');

    const updatePreview = () => {
      const m = metric.value.trim();
      const v = value.value.trim();
      const t = timeframe.value;

      if (m && v) {
        const timeframeText = {
          'month': 'per month',
          'quarter': 'per quarter',
          'year': 'per year'
        };

        preview.innerHTML = `
          As a <strong>${this.detectRole()}</strong>, I am achieving 
          <strong>${v}</strong> of <strong>${m}</strong> 
          <strong>${timeframeText[t]}</strong>.
        `;

        continueBtn.disabled = false;
      } else {
        preview.innerHTML = '<em>Fill in the fields above to see preview...</em>';
        continueBtn.disabled = true;
      }
    };

    metric.addEventListener('input', updatePreview);
    value.addEventListener('input', updatePreview);
    timeframe.addEventListener('change', updatePreview);
  },

  detectRole() {
    // Try to detect from goal text
    const goal = this.gapData.goal.toLowerCase();
    if (goal.includes('realtor') || goal.includes('real estate')) return 'realtor';
    if (goal.includes('entrepreneur') || goal.includes('business')) return 'entrepreneur';
    if (goal.includes('consultant')) return 'consultant';
    return 'professional';
  },

  saveDesiredState() {
    const metric = document.getElementById('desiredMetric').value.trim();
    const value = document.getElementById('desiredValue').value.trim();
    const timeframe = document.getElementById('desiredTimeframe').value;

    if (!metric || !value) {
      this.showNotification('Please fill in all required fields', 'warning');
      return;
    }

    // Extract numeric value
    const numericValue = this.extractNumber(value);
    
    this.gapData.desiredState = {
      description: `${value} of ${metric} ${timeframe}`,
      metric: metric,
      value: numericValue,
      timeframe: timeframe,
      monthly: this.convertToMonthly(numericValue, timeframe)
    };

    this.nextStep();
  },

  extractNumber(text) {
    // Extract first number from text (handles $20M, 200, etc.)
    const match = text.match(/[\d,.]+/);
    if (!match) return 0;
    
    let num = parseFloat(match[0].replace(/,/g, ''));
    
    // Handle M, K suffixes
    if (text.toLowerCase().includes('m')) num *= 1000000;
    if (text.toLowerCase().includes('k')) num *= 1000;
    
    return num;
  },

  convertToMonthly(value, timeframe) {
    if (timeframe === 'year') return value / 12;
    if (timeframe === 'quarter') return value / 3;
    return value;
  },

  // STEP 4: Current State
  renderStep4() {
    const container = document.getElementById('gapAnnihilatorContainer');
    container.innerHTML = `
      <div class="gap-step" data-step="4">
        <div class="step-header">
          <button class="back-btn" onclick="GapAnnihilator.previousStep()">
            <i class="fas fa-arrow-left"></i>
          </button>
          <h2 class="step-title">Define Current State</h2>
          <div class="step-badge">Step 3 of 5</div>
          <div class="step-progress">
            <div class="progress-bar" style="width: 60%;"></div>
          </div>
        </div>

        <div class="step-content">
          <div class="instruction-panel">
            <i class="fas fa-chart-bar"></i>
            <p>
              <strong>Now let's name the current state.</strong>
              Use the same metric to measure where you are now.
            </p>
          </div>

          <div class="comparison-card">
            <div class="comparison-label">Desired State (Target):</div>
            <div class="comparison-value desired">
              ${this.gapData.desiredState.description}
            </div>
          </div>

          <div class="form-grid">
            <div class="form-group">
              <label class="input-label">
                Current Value
                <span class="required">*</span>
              </label>
              <input 
                type="text" 
                id="currentValue" 
                class="form-input"
                placeholder="e.g., $11M or 120 clients"
              />
              <div class="input-hint">
                <i class="fas fa-info-circle"></i>
                Be honest - this is just for you
              </div>
            </div>

            <div class="form-group">
              <label class="input-label">
                Time Period
                <span class="required">*</span>
              </label>
              <select id="currentPeriod" class="form-input">
                <option value="last-month">Last Month</option>
                <option value="last-quarter">Last Quarter</option>
                <option value="last-year" selected>Last 12 Months</option>
                <option value="ytd">Year to Date</option>
              </select>
            </div>
          </div>

          <div class="calculation-helper" id="calculationHelper" style="display: none;">
            <div class="helper-icon">
              <i class="fas fa-calculator"></i>
            </div>
            <div class="helper-content">
              <div class="helper-label">Average per Month:</div>
              <div class="helper-value" id="avgPerMonth">$0</div>
            </div>
          </div>

          <div class="preview-card current-preview">
            <div class="preview-label">
              <i class="fas fa-eye"></i>
              Preview - Current State:
            </div>
            <div class="preview-text" id="currentPreview">
              <em>Fill in the fields above to see preview...</em>
            </div>
          </div>
        </div>

        <div class="step-actions">
          <button class="btn btn-secondary" onclick="GapAnnihilator.previousStep()">
            <i class="fas fa-arrow-left"></i>
            Back
          </button>
          <button 
            class="btn btn-primary" 
            onclick="GapAnnihilator.calculateGap()"
            id="continueStep4"
            disabled
          >
            Analyze Gap
            <i class="fas fa-chart-line"></i>
          </button>
        </div>
      </div>
    `;

    this.setupCurrentStateListeners();
  },

  setupCurrentStateListeners() {
    const value = document.getElementById('currentValue');
    const period = document.getElementById('currentPeriod');
    const preview = document.getElementById('currentPreview');
    const continueBtn = document.getElementById('continueStep4');
    const calculationHelper = document.getElementById('calculationHelper');
    const avgPerMonth = document.getElementById('avgPerMonth');

    const updatePreview = () => {
      const v = value.value.trim();
      const p = period.value;

      if (v) {
        const numericValue = this.extractNumber(v);
        const periodMonths = {
          'last-month': 1,
          'last-quarter': 3,
          'last-year': 12,
          'ytd': new Date().getMonth() + 1
        };

        const months = periodMonths[p];
        const monthly = numericValue / months;

        const periodText = {
          'last-month': 'last month',
          'last-quarter': 'the last quarter',
          'last-year': 'the past 12 months',
          'ytd': 'year to date'
        };

        preview.innerHTML = `
          As a <strong>${this.detectRole()}</strong>, I achieved 
          <strong>${v}</strong> of <strong>${this.gapData.desiredState.metric}</strong> in 
          <strong>${periodText[p]}</strong>, which is an average of 
          <strong>${this.formatCurrency(monthly)}/month</strong>.
        `;

        // Show calculation helper
        calculationHelper.style.display = 'flex';
        avgPerMonth.textContent = this.formatCurrency(monthly);

        continueBtn.disabled = false;
      } else {
        preview.innerHTML = '<em>Fill in the fields above to see preview...</em>';
        calculationHelper.style.display = 'none';
        continueBtn.disabled = true;
      }
    };

    value.addEventListener('input', updatePreview);
    period.addEventListener('change', updatePreview);
  },

  formatCurrency(value) {
    if (value >= 1000000) {
      return '$' + (value / 1000000).toFixed(2) + 'M';
    } else if (value >= 1000) {
      return '$' + (value / 1000).toFixed(0) + 'K';
    }
    return '$' + value.toFixed(0);
  },

  calculateGap() {
    const value = document.getElementById('currentValue').value.trim();
    const period = document.getElementById('currentPeriod').value;

    if (!value) {
      this.showNotification('Please enter your current value', 'warning');
      return;
    }

    const numericValue = this.extractNumber(value);
    const periodMonths = {
      'last-month': 1,
      'last-quarter': 3,
      'last-year': 12,
      'ytd': new Date().getMonth() + 1
    };

    this.gapData.currentState = {
      description: `${value} in ${period}`,
      metric: this.gapData.desiredState.metric,
      value: numericValue,
      period: period,
      monthly: numericValue / periodMonths[period]
    };

    // Calculate gap
    this.gapData.gap = {
      absolute: this.gapData.desiredState.value - this.gapData.currentState.value,
      percentage: ((this.gapData.desiredState.value - this.gapData.currentState.value) / this.gapData.currentState.value * 100).toFixed(1),
      monthly: this.gapData.desiredState.monthly - this.gapData.currentState.monthly,
      weekly: (this.gapData.desiredState.monthly - this.gapData.currentState.monthly) / 4,
      daily: (this.gapData.desiredState.monthly - this.gapData.currentState.monthly) / 30
    };

    this.nextStep();
  },

  // STEP 5: Gap Analysis Results
  renderStep5() {
    const gap = this.gapData.gap;
    const desired = this.gapData.desiredState;
    const current = this.gapData.currentState;

    const currentPercent = (current.value / desired.value * 100).toFixed(0);
    const gapPercent = (gap.absolute / desired.value * 100).toFixed(0);

    const container = document.getElementById('gapAnnihilatorContainer');
    container.innerHTML = `
      <div class="gap-step full-width" data-step="5">
        <div class="step-header">
          <button class="back-btn" onclick="GapAnnihilator.previousStep()">
            <i class="fas fa-arrow-left"></i>
          </button>
          <h2 class="step-title">Gap Analysis Results</h2>
          <div class="step-badge">Step 4 of 5</div>
          <div class="step-progress">
            <div class="progress-bar" style="width: 80%;"></div>
          </div>
        </div>

        <div class="step-content">
          <div class="gap-visualization">
            <div class="chart-container">
              <div class="chart-bars">
                <div class="bar current-bar" style="height: ${currentPercent}%;">
                  <div class="bar-label">Current</div>
                  <div class="bar-value">${this.formatCurrency(current.value)}</div>
                </div>
                <div class="bar gap-bar" style="height: ${gapPercent}%;">
                  <div class="bar-label">Gap</div>
                  <div class="bar-value">${this.formatCurrency(gap.absolute)}</div>
                  <div class="bar-percentage">${gap.percentage}%</div>
                </div>
                <div class="bar desired-bar" style="height: 100%;">
                  <div class="bar-label">Target</div>
                  <div class="bar-value">${this.formatCurrency(desired.value)}</div>
                </div>
              </div>
            </div>

            <div class="gap-summary-grid">
              <div class="summary-card current-card">
                <div class="card-icon">
                  <i class="fas fa-map-marker-alt"></i>
                </div>
                <div class="card-content">
                  <div class="card-label">Current State</div>
                  <div class="card-value">${this.formatCurrency(current.value)} / ${desired.timeframe}</div>
                  <div class="card-sub">${this.formatCurrency(current.monthly)} / month avg</div>
                </div>
              </div>

              <div class="summary-card gap-card highlight">
                <div class="card-icon">
                  <i class="fas fa-chart-line"></i>
                </div>
                <div class="card-content">
                  <div class="card-label">The Gap</div>
                  <div class="card-value">${this.formatCurrency(gap.absolute)} / ${desired.timeframe}</div>
                  <div class="card-sub">${this.formatCurrency(gap.monthly)} / month to close</div>
                </div>
              </div>

              <div class="summary-card desired-card">
                <div class="card-icon">
                  <i class="fas fa-trophy"></i>
                </div>
                <div class="card-content">
                  <div class="card-label">Desired State</div>
                  <div class="card-value">${this.formatCurrency(desired.value)} / ${desired.timeframe}</div>
                  <div class="card-sub">${this.formatCurrency(desired.monthly)} / month target</div>
                </div>
              </div>
            </div>
          </div>

          <div class="ai-insight-card">
            <div class="insight-header">
              <i class="fas fa-brain"></i>
              <span>Strategic Insight</span>
            </div>
            <div class="insight-body">
              <p>
                To reach your desired state, you need to achieve an average of 
                <strong>${this.formatCurrency(desired.monthly)}</strong> per month.
              </p>
              <p>
                This is a <strong>${gap.percentage}% increase</strong> from your current 
                average of ${this.formatCurrency(current.monthly)} per month.
              </p>
              <div class="insight-cta">
                <i class="fas fa-rocket"></i>
                <p>
                  Let's look for strategic ways we can increase your results from 
                  <strong>${this.formatCurrency(current.monthly)}/month</strong> to 
                  <strong>${this.formatCurrency(desired.monthly)}/month</strong>.
                </p>
              </div>
            </div>
          </div>

          <div class="breakdown-section">
            <h3>Monthly Breakdown</h3>
            <div class="breakdown-grid">
              <div class="breakdown-item">
                <span class="breakdown-label">Current Monthly Avg:</span>
                <span class="breakdown-value">${this.formatCurrency(current.monthly)}</span>
              </div>
              <div class="breakdown-item">
                <span class="breakdown-label">Target Monthly Avg:</span>
                <span class="breakdown-value">${this.formatCurrency(desired.monthly)}</span>
              </div>
              <div class="breakdown-item highlight">
                <span class="breakdown-label">Monthly Gap to Close:</span>
                <span class="breakdown-value">${this.formatCurrency(gap.monthly)}</span>
              </div>
              <div class="breakdown-item">
                <span class="breakdown-label">Weekly Gap:</span>
                <span class="breakdown-value">${this.formatCurrency(gap.weekly)}</span>
              </div>
            </div>
          </div>
        </div>

        <div class="step-actions">
          <button class="btn btn-secondary" onclick="GapAnnihilator.previousStep()">
            <i class="fas fa-arrow-left"></i>
            Back to Edit
          </button>
          <button class="btn btn-primary btn-large" onclick="GapAnnihilator.nextStep()">
            Build Strategy
            <i class="fas fa-rocket"></i>
          </button>
        </div>
      </div>
    `;
  },

  // STEP 6: Strategic Planning
  renderStep6() {
    const desired = this.gapData.desiredState;
    const current = this.gapData.currentState;
    const gap = this.gapData.gap;

    // Calculate funnel (example for real estate)
    const avgDealSize = 500000; // Example
    const requiredDeals = desired.monthly / avgDealSize;
    
    const funnel = [
      { stage: 'Closed Deals', value: requiredDeals.toFixed(1), rate: 100 },
      { stage: 'Contracts', value: (requiredDeals / 0.3).toFixed(0), rate: 80, conversion: '30% close rate' },
      { stage: 'Showings', value: (requiredDeals / 0.3 / 0.2).toFixed(0), rate: 60, conversion: '20% to contract' },
      { stage: 'Qualified Leads', value: (requiredDeals / 0.3 / 0.2 / 0.4).toFixed(0), rate: 40, conversion: '40% to showing' },
      { stage: 'Total Leads', value: (requiredDeals / 0.3 / 0.2 / 0.4 / 0.1).toFixed(0), rate: 20, conversion: '10% qualified' }
    ];

    this.gapData.funnel = funnel;

    const container = document.getElementById('gapAnnihilatorContainer');
    container.innerHTML = `
      <div class="gap-step full-width" data-step="6">
        <div class="step-header">
          <button class="back-btn" onclick="GapAnnihilator.previousStep()">
            <i class="fas fa-arrow-left"></i>
          </button>
          <h2 class="step-title">Strategic Action Plan</h2>
          <div class="step-badge">Step 5 of 5</div>
          <div class="step-progress">
            <div class="progress-bar" style="width: 100%;"></div>
          </div>
        </div>

        <div class="step-content">
          <div class="strategy-intro">
            <p>
              To achieve <strong>${this.formatCurrency(desired.monthly)}/month</strong>, 
              we need to work backwards from that number and understand what it takes.
            </p>
          </div>

          <div class="reverse-calc-section">
            <h3>
              <i class="fas fa-calculator"></i>
              What does ${this.formatCurrency(desired.monthly)}/month require?
            </h3>

            <div class="calc-input-row">
              <div class="calc-input-group">
                <label>Average Deal/Sale Size:</label>
                <input 
                  type="number" 
                  id="avgDealSize" 
                  value="500000"
                  class="calc-input"
                  onchange="GapAnnihilator.recalculateFunnel()"
                />
              </div>
              <div class="calc-result">
                <div class="result-label">Required Sales per Month:</div>
                <div class="result-value" id="requiredSales">${requiredDeals.toFixed(1)} deals</div>
              </div>
            </div>
          </div>

          <div class="funnel-section">
            <h3>
              <i class="fas fa-filter"></i>
              Sales Funnel Breakdown
            </h3>
            <div class="funnel-visualization">
              ${funnel.map((item, index) => `
                <div class="funnel-stage" style="--stage-width: ${item.rate}%;">
                  <div class="stage-content">
                    <div class="stage-number">${item.value}</div>
                    <div class="stage-label">${item.stage}</div>
                    ${item.conversion ? `<div class="stage-conversion">${item.conversion}</div>` : ''}
                  </div>
                  ${index < funnel.length - 1 ? '<div class="stage-arrow"><i class="fas fa-arrow-down"></i></div>' : ''}
                </div>
              `).join('')}
            </div>
          </div>

          <div class="action-items-section">
            <h3>
              <i class="fas fa-tasks"></i>
              Recommended Action Items
            </h3>
            <p class="section-subtitle">Select actions to convert to MIT tasks</p>

            <div class="action-items-list">
              <div class="action-item">
                <div class="action-checkbox">
                  <input type="checkbox" id="action1" checked>
                  <label for="action1"></label>
                </div>
                <div class="action-content">
                  <div class="action-header">
                    <h4>Increase Lead Generation</h4>
                    <span class="priority-badge high">High Priority</span>
                  </div>
                  <p>Need ${funnel[4].value} leads/month. Current sources generating enough?</p>
                  <div class="action-tags">
                    <span class="tag">Weekly MIT</span>
                    <span class="tag">Marketing</span>
                  </div>
                </div>
              </div>

              <div class="action-item">
                <div class="action-checkbox">
                  <input type="checkbox" id="action2" checked>
                  <label for="action2"></label>
                </div>
                <div class="action-content">
                  <div class="action-header">
                    <h4>Improve Conversion Rates</h4>
                    <span class="priority-badge medium">Medium Priority</span>
                  </div>
                  <p>Optimize funnel: Lead → Qualified → Showing → Contract → Close</p>
                  <div class="action-tags">
                    <span class="tag">Monthly MIT</span>
                    <span class="tag">Process</span>
                  </div>
                </div>
              </div>

              <div class="action-item">
                <div class="action-checkbox">
                  <input type="checkbox" id="action3">
                  <label for="action3"></label>
                </div>
                <div class="action-content">
                  <div class="action-header">
                    <h4>Increase Average Deal Size</h4>
                    <span class="priority-badge low">Lower Priority</span>
                  </div>
                  <p>Target higher-value properties or markets to reduce volume needed</p>
                  <div class="action-tags">
                    <span class="tag">Quarterly Goal</span>
                    <span class="tag">Strategy</span>
                  </div>
                </div>
              </div>

              <div class="action-item">
                <div class="action-checkbox">
                  <input type="checkbox" id="action4" checked>
                  <label for="action4"></label>
                </div>
                <div class="action-content">
                  <div class="action-header">
                    <h4>Streamline Sales Process</h4>
                    <span class="priority-badge medium">Medium Priority</span>
                  </div>
                  <p>Reduce time per deal to handle higher volume efficiently</p>
                  <div class="action-tags">
                    <span class="tag">Weekly MIT</span>
                    <span class="tag">Efficiency</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="step-actions">
          <button class="btn btn-secondary" onclick="GapAnnihilator.saveAndExit()">
            <i class="fas fa-save"></i>
            Save for Later
          </button>
          <button class="btn btn-primary btn-large" onclick="GapAnnihilator.completeAnalysis()">
            <i class="fas fa-check-circle"></i>
            Complete & Create MITs
          </button>
        </div>
      </div>
    `;
  },

  recalculateFunnel() {
    const avgDealSize = parseFloat(document.getElementById('avgDealSize').value);
    const requiredDeals = this.gapData.desiredState.monthly / avgDealSize;
    document.getElementById('requiredSales').textContent = requiredDeals.toFixed(1) + ' deals';
  },

  completeAnalysis() {
    // Save gap analysis
    this.gapData.updatedAt = new Date().toISOString();
    
    // Get selected actions
    const selectedActions = [];
    for (let i = 1; i <= 4; i++) {
      if (document.getElementById(`action${i}`)?.checked) {
        selectedActions.push(i);
      }
    }

    this.gapData.strategy.selectedActions = selectedActions;

    // Save to localStorage
    this.saveToLocalStorage();

    // Show success
    this.showNotification('Gap Analysis Complete!', 'success');

    // Redirect to home with success message
    setTimeout(() => {
      window.location.href = 'home.html?gap_complete=true';
    }, 1500);
  },

  saveAndExit() {
    this.gapData.updatedAt = new Date().toISOString();
    this.saveToLocalStorage();
    
    this.showNotification('Gap analysis saved!', 'success');
    
    setTimeout(() => {
      window.location.href = 'home.html';
    }, 1000);
  },

  saveToLocalStorage() {
    const allGaps = JSON.parse(localStorage.getItem('gapAnalyses') || '[]');
    
    // Find and update or add new
    const existingIndex = allGaps.findIndex(g => g.goalId === this.gapData.goalId);
    
    if (existingIndex >= 0) {
      allGaps[existingIndex] = this.gapData;
    } else {
      allGaps.push(this.gapData);
    }

    localStorage.setItem('gapAnalyses', JSON.stringify(allGaps));
    localStorage.setItem('currentGap', JSON.stringify(this.gapData));
  },

  // Navigation
  nextStep() {
    if (this.currentStep < this.totalSteps) {
      this.currentStep++;
      this[`renderStep${this.currentStep}`]();
    }
  },

  previousStep() {
    if (this.currentStep > 1) {
      this.currentStep--;
      this[`renderStep${this.currentStep}`]();
    }
  },

  // Utilities
  showNotification(message, type = 'info') {
    if (typeof showNotification === 'function') {
      showNotification('Gap Annihilator', message, type);
    } else {
      alert(message);
    }
  }
};

// Auto-initialize
if (document.getElementById('gapAnnihilatorContainer')) {
  document.addEventListener('DOMContentLoaded', () => {
    GapAnnihilator.init();
  });
}
