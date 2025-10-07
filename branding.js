// PERSONAL BRANDING MODULE - Based on Marketing Magic by Manuel Suarez
// Desktop-First Brand Assessment & Strategy Generator

const PersonalBranding = {
  // State Management
  currentStep: 1,
  totalSteps: 6,
  brandData: {
    assessmentId: null,
    brandState: "",
    platforms: {
      facebook: { active: false, followers: 0, engagement: 0 },
      instagram: { active: false, followers: 0, engagement: 0 },
      linkedin: { active: false, followers: 0, engagement: 0 },
      youtube: { active: false, followers: 0, engagement: 0 },
      tiktok: { active: false, followers: 0, engagement: 0 },
      twitter: { active: false, followers: 0, engagement: 0 }
    },
    contentStrategy: {
      frequency: "",
      types: [],
      topics: []
    },
    goals: [],
    brandScore: 0,
    recommendations: [],
    createdAt: null,
    updatedAt: null
  },

  // Initialize
  init() {
    this.brandData.assessmentId = Date.now();
    this.brandData.createdAt = new Date().toISOString();
    this.renderStep1();
  },

  // STEP 1: Introduction
  renderStep1() {
    const container = document.getElementById('brandingContainer');
    container.innerHTML = `
      <div class="brand-step" data-step="1">
        <div class="brand-hero">
          <div class="hero-icon">
            <i class="fas fa-bullhorn"></i>
          </div>
          <h1 class="hero-title">Personal Branding</h1>
          <p class="hero-subtitle">Build Your Digital Presence & Authority</p>
        </div>

        <div class="brand-explanation">
          <div class="explanation-card">
            <h2>What is Personal Branding?</h2>
            <p>
              Based on <strong>Marketing Magic by Manuel Suarez</strong>, personal branding is about 
              creating a <strong>digital presence</strong> that attracts your ideal audience and 
              establishes you as an <strong>authority</strong> in your field.
            </p>
            <ul class="benefit-list">
              <li>
                <i class="fas fa-check-circle"></i>
                <span>Build trust and credibility with your audience</span>
              </li>
              <li>
                <i class="fas fa-check-circle"></i>
                <span>Attract ideal clients and opportunities organically</span>
              </li>
              <li>
                <i class="fas fa-check-circle"></i>
                <span>Create consistent content across multiple platforms</span>
              </li>
              <li>
                <i class="fas fa-check-circle"></i>
                <span>Automate and scale your marketing efforts</span>
              </li>
            </ul>
          </div>

          <div class="platform-visual">
            <h3>The 6 Core Platforms:</h3>
            <div class="platform-grid">
              <div class="platform-card facebook">
                <i class="fab fa-facebook"></i>
                <span>Facebook</span>
                <p>Community Building</p>
              </div>
              <div class="platform-card instagram">
                <i class="fab fa-instagram"></i>
                <span>Instagram</span>
                <p>Visual Storytelling</p>
              </div>
              <div class="platform-card linkedin">
                <i class="fab fa-linkedin"></i>
                <span>LinkedIn</span>
                <p>Professional Network</p>
              </div>
              <div class="platform-card youtube">
                <i class="fab fa-youtube"></i>
                <span>YouTube</span>
                <p>Long-form Content</p>
              </div>
              <div class="platform-card tiktok">
                <i class="fab fa-tiktok"></i>
                <span>TikTok</span>
                <p>Viral Short Videos</p>
              </div>
              <div class="platform-card twitter">
                <i class="fab fa-twitter"></i>
                <span>Twitter/X</span>
                <p>Thought Leadership</p>
              </div>
            </div>
          </div>

          <div class="quote-card">
            <div class="quote-icon">
              <i class="fas fa-quote-left"></i>
            </div>
            <blockquote>
              "Your personal brand is what people say about you when you're not in the room. 
              Make sure they're saying the right things."
            </blockquote>
            <cite>— Manuel Suarez, Marketing Magic</cite>
          </div>
        </div>

        <div class="step-actions">
          <button class="btn btn-primary btn-large" onclick="PersonalBranding.nextStep()">
            Start Brand Assessment
            <i class="fas fa-rocket"></i>
          </button>
        </div>
      </div>
    `;
  },

  // STEP 2: Brand State Assessment
  renderStep2() {
    const container = document.getElementById('brandingContainer');
    container.innerHTML = `
      <div class="brand-step" data-step="2">
        <div class="step-header">
          <button class="back-btn" onclick="PersonalBranding.previousStep()">
            <i class="fas fa-arrow-left"></i>
          </button>
          <h2 class="step-title">Current Brand State</h2>
          <div class="step-badge">Step 1 of 5</div>
          <div class="step-progress">
            <div class="progress-bar" style="width: 20%;"></div>
          </div>
        </div>

        <div class="step-content">
          <div class="instruction-panel">
            <i class="fas fa-question-circle"></i>
            <p>
              <strong>How would you rate your personal brand?</strong>
              Be honest - this helps us create the perfect strategy for you.
            </p>
          </div>

          <div class="brand-state-options">
            <div class="state-option" data-state="none" onclick="PersonalBranding.selectBrandState('none')">
              <div class="state-icon">
                <i class="fas fa-user-slash"></i>
              </div>
              <h3>I Don't Have One</h3>
              <p>Starting from scratch, no online presence</p>
              <div class="state-indicator"></div>
            </div>

            <div class="state-option" data-state="basic" onclick="PersonalBranding.selectBrandState('basic')">
              <div class="state-icon">
                <i class="fas fa-seedling"></i>
              </div>
              <h3>Just Starting Out</h3>
              <p>Have some profiles but not active</p>
              <div class="state-indicator"></div>
            </div>

            <div class="state-option" data-state="inconsistent" onclick="PersonalBranding.selectBrandState('inconsistent')">
              <div class="state-icon">
                <i class="fas fa-random"></i>
              </div>
              <h3>Inconsistent</h3>
              <p>Post occasionally but no clear strategy</p>
              <div class="state-indicator"></div>
            </div>

            <div class="state-option" data-state="growing" onclick="PersonalBranding.selectBrandState('growing')">
              <div class="state-icon">
                <i class="fas fa-chart-line"></i>
              </div>
              <h3>Growing</h3>
              <p>Active presence, building momentum</p>
              <div class="state-indicator"></div>
            </div>

            <div class="state-option" data-state="established" onclick="PersonalBranding.selectBrandState('established')">
              <div class="state-icon">
                <i class="fas fa-star"></i>
              </div>
              <h3>Established</h3>
              <p>Strong brand, consistent content</p>
              <div class="state-indicator"></div>
            </div>

            <div class="state-option" data-state="automate" onclick="PersonalBranding.selectBrandState('automate')">
              <div class="state-icon">
                <i class="fas fa-robot"></i>
              </div>
              <h3>Ready to Automate</h3>
              <p>Great brand, need efficiency & scale</p>
              <div class="state-indicator"></div>
            </div>
          </div>
        </div>

        <div class="step-actions">
          <button class="btn btn-secondary" onclick="PersonalBranding.previousStep()">
            <i class="fas fa-arrow-left"></i>
            Back
          </button>
          <button 
            class="btn btn-primary" 
            onclick="PersonalBranding.saveBrandStateAndContinue()"
            id="continueStep2"
            disabled
          >
            Continue
            <i class="fas fa-arrow-right"></i>
          </button>
        </div>
      </div>
    `;
  },

  selectBrandState(state) {
    // Remove previous selection
    document.querySelectorAll('.state-option').forEach(opt => {
      opt.classList.remove('selected');
    });

    // Select new state
    const option = document.querySelector(`.state-option[data-state="${state}"]`);
    option.classList.add('selected');

    // Enable continue button
    document.getElementById('continueStep2').disabled = false;

    // Store state
    this.brandData.brandState = state;
  },

  saveBrandStateAndContinue() {
    if (!this.brandData.brandState) {
      this.showNotification('Please select your current brand state', 'warning');
      return;
    }
    this.nextStep();
  },

  // STEP 3: Platform Audit
  renderStep3() {
    const container = document.getElementById('brandingContainer');
    container.innerHTML = `
      <div class="brand-step" data-step="3">
        <div class="step-header">
          <button class="back-btn" onclick="PersonalBranding.previousStep()">
            <i class="fas fa-arrow-left"></i>
          </button>
          <h2 class="step-title">Platform Audit</h2>
          <div class="step-badge">Step 2 of 5</div>
          <div class="step-progress">
            <div class="progress-bar" style="width: 40%;"></div>
          </div>
        </div>

        <div class="step-content">
          <div class="instruction-panel">
            <i class="fas fa-search"></i>
            <p>
              <strong>Which platforms are you currently using?</strong>
              Select all that apply and provide your current metrics.
            </p>
          </div>

          <div class="platform-audit-grid">
            ${this.renderPlatformCard('facebook', 'Facebook', 'fab fa-facebook', '#1877f2')}
            ${this.renderPlatformCard('instagram', 'Instagram', 'fab fa-instagram', '#e4405f')}
            ${this.renderPlatformCard('linkedin', 'LinkedIn', 'fab fa-linkedin', '#0a66c2')}
            ${this.renderPlatformCard('youtube', 'YouTube', 'fab fa-youtube', '#ff0000')}
            ${this.renderPlatformCard('tiktok', 'TikTok', 'fab fa-tiktok', '#000000')}
            ${this.renderPlatformCard('twitter', 'Twitter/X', 'fab fa-twitter', '#1da1f2')}
          </div>

          <div class="audit-summary" id="auditSummary" style="display: none;">
            <div class="summary-icon">
              <i class="fas fa-check-circle"></i>
            </div>
            <div class="summary-content">
              <h3>Platforms Selected: <span id="platformCount">0</span></h3>
              <p>Total Followers: <span id="totalFollowers">0</span></p>
            </div>
          </div>
        </div>

        <div class="step-actions">
          <button class="btn btn-secondary" onclick="PersonalBranding.previousStep()">
            <i class="fas fa-arrow-left"></i>
            Back
          </button>
          <button 
            class="btn btn-primary" 
            onclick="PersonalBranding.savePlatformAudit()"
            id="continueStep3"
          >
            Continue
            <i class="fas fa-arrow-right"></i>
          </button>
        </div>
      </div>
    `;

    this.setupPlatformAuditListeners();
  },

  renderPlatformCard(id, name, icon, color) {
    return `
      <div class="platform-audit-card" data-platform="${id}">
        <div class="audit-card-header">
          <div class="platform-toggle">
            <input 
              type="checkbox" 
              id="toggle_${id}" 
              class="platform-checkbox"
              onchange="PersonalBranding.togglePlatform('${id}')"
            >
            <label for="toggle_${id}" class="toggle-label">
              <i class="${icon}" style="color: ${color};"></i>
              <span>${name}</span>
            </label>
          </div>
        </div>
        <div class="audit-card-body" id="body_${id}" style="display: none;">
          <div class="metric-input">
            <label>Followers/Connections:</label>
            <input 
              type="number" 
              id="followers_${id}" 
              placeholder="0"
              min="0"
              onchange="PersonalBranding.updateAuditSummary()"
            >
          </div>
          <div class="metric-input">
            <label>Avg. Engagement Rate (%):</label>
            <input 
              type="number" 
              id="engagement_${id}" 
              placeholder="0"
              min="0"
              max="100"
              step="0.1"
              onchange="PersonalBranding.updateAuditSummary()"
            >
          </div>
        </div>
      </div>
    `;
  },

  togglePlatform(platform) {
    const checkbox = document.getElementById(`toggle_${platform}`);
    const body = document.getElementById(`body_${platform}`);
    
    if (checkbox.checked) {
      body.style.display = 'block';
      this.brandData.platforms[platform].active = true;
    } else {
      body.style.display = 'none';
      this.brandData.platforms[platform].active = false;
      document.getElementById(`followers_${platform}`).value = '';
      document.getElementById(`engagement_${platform}`).value = '';
    }

    this.updateAuditSummary();
  },

  setupPlatformAuditListeners() {
    // Show summary when at least one platform is selected
    const checkboxes = document.querySelectorAll('.platform-checkbox');
    checkboxes.forEach(cb => {
      cb.addEventListener('change', () => {
        const anyChecked = Array.from(checkboxes).some(c => c.checked);
        document.getElementById('auditSummary').style.display = anyChecked ? 'flex' : 'none';
      });
    });
  },

  updateAuditSummary() {
    const checkboxes = document.querySelectorAll('.platform-checkbox:checked');
    const platformCount = checkboxes.length;
    
    let totalFollowers = 0;
    checkboxes.forEach(cb => {
      const platform = cb.id.replace('toggle_', '');
      const followers = parseInt(document.getElementById(`followers_${platform}`).value) || 0;
      totalFollowers += followers;
    });

    document.getElementById('platformCount').textContent = platformCount;
    document.getElementById('totalFollowers').textContent = totalFollowers.toLocaleString();
  },

  savePlatformAudit() {
    // Save all platform data
    Object.keys(this.brandData.platforms).forEach(platform => {
      const checkbox = document.getElementById(`toggle_${platform}`);
      if (checkbox && checkbox.checked) {
        this.brandData.platforms[platform].active = true;
        this.brandData.platforms[platform].followers = parseInt(document.getElementById(`followers_${platform}`).value) || 0;
        this.brandData.platforms[platform].engagement = parseFloat(document.getElementById(`engagement_${platform}`).value) || 0;
      }
    });

    this.nextStep();
  },

  // STEP 4: Content Strategy
  renderStep4() {
    const container = document.getElementById('brandingContainer');
    container.innerHTML = `
      <div class="brand-step" data-step="4">
        <div class="step-header">
          <button class="back-btn" onclick="PersonalBranding.previousStep()">
            <i class="fas fa-arrow-left"></i>
          </button>
          <h2 class="step-title">Content Strategy</h2>
          <div class="step-badge">Step 3 of 5</div>
          <div class="step-progress">
            <div class="progress-bar" style="width: 60%;"></div>
          </div>
        </div>

        <div class="step-content">
          <div class="instruction-panel">
            <i class="fas fa-pen"></i>
            <p>
              <strong>Let's define your content strategy.</strong>
              Consistency is key to building a strong brand.
            </p>
          </div>

          <div class="strategy-section">
            <h3>Posting Frequency</h3>
            <div class="frequency-options">
              <div class="frequency-card" data-freq="daily" onclick="PersonalBranding.selectFrequency('daily')">
                <i class="fas fa-calendar-day"></i>
                <h4>Daily</h4>
                <p>Maximum growth & engagement</p>
              </div>
              <div class="frequency-card" data-freq="3x-week" onclick="PersonalBranding.selectFrequency('3x-week')">
                <i class="fas fa-calendar-week"></i>
                <h4>3x Per Week</h4>
                <p>Balanced & sustainable</p>
              </div>
              <div class="frequency-card" data-freq="weekly" onclick="PersonalBranding.selectFrequency('weekly')">
                <i class="fas fa-calendar-alt"></i>
                <h4>Weekly</h4>
                <p>Minimal commitment</p>
              </div>
            </div>
          </div>

          <div class="strategy-section">
            <h3>Content Types</h3>
            <p class="section-hint">Select all content types you can create:</p>
            <div class="content-type-grid">
              <label class="content-type-item">
                <input type="checkbox" value="video" onchange="PersonalBranding.updateContentTypes()">
                <div class="type-card">
                  <i class="fas fa-video"></i>
                  <span>Video</span>
                </div>
              </label>
              <label class="content-type-item">
                <input type="checkbox" value="image" onchange="PersonalBranding.updateContentTypes()">
                <div class="type-card">
                  <i class="fas fa-image"></i>
                  <span>Images</span>
                </div>
              </label>
              <label class="content-type-item">
                <input type="checkbox" value="text" onchange="PersonalBranding.updateContentTypes()">
                <div class="type-card">
                  <i class="fas fa-align-left"></i>
                  <span>Text Posts</span>
                </div>
              </label>
              <label class="content-type-item">
                <input type="checkbox" value="article" onchange="PersonalBranding.updateContentTypes()">
                <div class="type-card">
                  <i class="fas fa-newspaper"></i>
                  <span>Articles</span>
                </div>
              </label>
              <label class="content-type-item">
                <input type="checkbox" value="stories" onchange="PersonalBranding.updateContentTypes()">
                <div class="type-card">
                  <i class="fas fa-bolt"></i>
                  <span>Stories/Reels</span>
                </div>
              </label>
              <label class="content-type-item">
                <input type="checkbox" value="live" onchange="PersonalBranding.updateContentTypes()">
                <div class="type-card">
                  <i class="fas fa-broadcast-tower"></i>
                  <span>Live Streams</span>
                </div>
              </label>
            </div>
          </div>

          <div class="strategy-section">
            <h3>Content Topics</h3>
            <p class="section-hint">What will you talk about? (Select 3-5 topics)</p>
            <div class="topics-grid">
              ${this.renderTopicOptions()}
            </div>
          </div>
        </div>

        <div class="step-actions">
          <button class="btn btn-secondary" onclick="PersonalBranding.previousStep()">
            <i class="fas fa-arrow-left"></i>
            Back
          </button>
          <button 
            class="btn btn-primary" 
            onclick="PersonalBranding.saveContentStrategy()"
            id="continueStep4"
            disabled
          >
            Continue
            <i class="fas fa-arrow-right"></i>
          </button>
        </div>
      </div>
    `;
  },

  renderTopicOptions() {
    const topics = [
      { value: 'industry', label: 'Industry Insights', icon: 'fa-lightbulb' },
      { value: 'tips', label: 'Tips & How-Tos', icon: 'fa-magic' },
      { value: 'success', label: 'Success Stories', icon: 'fa-trophy' },
      { value: 'behind', label: 'Behind the Scenes', icon: 'fa-eye' },
      { value: 'personal', label: 'Personal Journey', icon: 'fa-hiking' },
      { value: 'trends', label: 'Market Trends', icon: 'fa-chart-line' },
      { value: 'qa', label: 'Q&A / AMA', icon: 'fa-question-circle' },
      { value: 'testimonials', label: 'Client Testimonials', icon: 'fa-star' }
    ];

    return topics.map(topic => `
      <label class="topic-item">
        <input type="checkbox" value="${topic.value}" onchange="PersonalBranding.updateTopics()">
        <div class="topic-card">
          <i class="fas ${topic.icon}"></i>
          <span>${topic.label}</span>
        </div>
      </label>
    `).join('');
  },

  selectFrequency(freq) {
    document.querySelectorAll('.frequency-card').forEach(card => {
      card.classList.remove('selected');
    });
    document.querySelector(`.frequency-card[data-freq="${freq}"]`).classList.add('selected');
    this.brandData.contentStrategy.frequency = freq;
    this.checkStrategyComplete();
  },

  updateContentTypes() {
    const selected = Array.from(document.querySelectorAll('.content-type-item input:checked'))
      .map(cb => cb.value);
    this.brandData.contentStrategy.types = selected;
    this.checkStrategyComplete();
  },

  updateTopics() {
    const selected = Array.from(document.querySelectorAll('.topic-item input:checked'))
      .map(cb => cb.value);
    this.brandData.contentStrategy.topics = selected;
    this.checkStrategyComplete();
  },

  checkStrategyComplete() {
    const hasFrequency = this.brandData.contentStrategy.frequency !== '';
    const hasTypes = this.brandData.contentStrategy.types.length > 0;
    const hasTopics = this.brandData.contentStrategy.topics.length >= 3;

    document.getElementById('continueStep4').disabled = !(hasFrequency && hasTypes && hasTopics);
  },

  saveContentStrategy() {
    if (this.brandData.contentStrategy.topics.length < 3) {
      this.showNotification('Please select at least 3 content topics', 'warning');
      return;
    }
    this.nextStep();
  },

  // STEP 5: Goals
  renderStep5() {
    const container = document.getElementById('brandingContainer');
    container.innerHTML = `
      <div class="brand-step" data-step="5">
        <div class="step-header">
          <button class="back-btn" onclick="PersonalBranding.previousStep()">
            <i class="fas fa-arrow-left"></i>
          </button>
          <h2 class="step-title">Brand Goals</h2>
          <div class="step-badge">Step 4 of 5</div>
          <div class="step-progress">
            <div class="progress-bar" style="width: 80%;"></div>
          </div>
        </div>

        <div class="step-content">
          <div class="instruction-panel">
            <i class="fas fa-bullseye"></i>
            <p>
              <strong>What do you want to achieve with your personal brand?</strong>
              Select your top 3 goals.
            </p>
          </div>

          <div class="goals-grid">
            ${this.renderGoalOptions()}
          </div>

          <div class="selected-goals" id="selectedGoals" style="display: none;">
            <h3>Your Selected Goals:</h3>
            <div id="goalsList"></div>
          </div>
        </div>

        <div class="step-actions">
          <button class="btn btn-secondary" onclick="PersonalBranding.previousStep()">
            <i class="fas fa-arrow-left"></i>
            Back
          </button>
          <button 
            class="btn btn-primary" 
            onclick="PersonalBranding.calculateBrandScore()"
            id="continueStep5"
            disabled
          >
            Generate Strategy
            <i class="fas fa-chart-line"></i>
          </button>
        </div>
      </div>
    `;
  },

  renderGoalOptions() {
    const goals = [
      { id: 'leads', title: 'Generate Leads', desc: 'Attract potential clients', icon: 'fa-users' },
      { id: 'authority', title: 'Build Authority', desc: 'Become industry expert', icon: 'fa-medal' },
      { id: 'sales', title: 'Increase Sales', desc: 'Drive direct revenue', icon: 'fa-dollar-sign' },
      { id: 'network', title: 'Expand Network', desc: 'Connect with peers', icon: 'fa-handshake' },
      { id: 'awareness', title: 'Brand Awareness', desc: 'Get recognized', icon: 'fa-eye' },
      { id: 'community', title: 'Build Community', desc: 'Loyal following', icon: 'fa-heart' }
    ];

    return goals.map(goal => `
      <div class="goal-card" data-goal="${goal.id}" onclick="PersonalBranding.toggleGoal('${goal.id}')">
        <div class="goal-icon">
          <i class="fas ${goal.icon}"></i>
        </div>
        <h4>${goal.title}</h4>
        <p>${goal.desc}</p>
        <div class="goal-checkbox">
          <i class="fas fa-check"></i>
        </div>
      </div>
    `).join('');
  },

  toggleGoal(goalId) {
    const goalCard = document.querySelector(`.goal-card[data-goal="${goalId}"]`);
    
    if (goalCard.classList.contains('selected')) {
      goalCard.classList.remove('selected');
      this.brandData.goals = this.brandData.goals.filter(g => g !== goalId);
    } else {
      if (this.brandData.goals.length >= 3) {
        this.showNotification('You can only select up to 3 goals', 'warning');
        return;
      }
      goalCard.classList.add('selected');
      this.brandData.goals.push(goalId);
    }

    this.updateSelectedGoals();
  },

  updateSelectedGoals() {
    const selectedGoalsDiv = document.getElementById('selectedGoals');
    const goalsList = document.getElementById('goalsList');

    if (this.brandData.goals.length > 0) {
      selectedGoalsDiv.style.display = 'block';
      goalsList.innerHTML = this.brandData.goals.map((goal, index) => 
        `<span class="goal-badge">${index + 1}. ${this.getGoalTitle(goal)}</span>`
      ).join('');
    } else {
      selectedGoalsDiv.style.display = 'none';
    }

    document.getElementById('continueStep5').disabled = this.brandData.goals.length !== 3;
  },

  getGoalTitle(goalId) {
    const titles = {
      leads: 'Generate Leads',
      authority: 'Build Authority',
      sales: 'Increase Sales',
      network: 'Expand Network',
      awareness: 'Brand Awareness',
      community: 'Build Community'
    };
    return titles[goalId] || goalId;
  },

  calculateBrandScore() {
    if (this.brandData.goals.length !== 3) {
      this.showNotification('Please select exactly 3 goals', 'warning');
      return;
    }

    // Calculate brand score based on multiple factors
    let score = 0;

    // Brand state score (0-30)
    const stateScores = {
      none: 0,
      basic: 5,
      inconsistent: 10,
      growing: 20,
      established: 25,
      automate: 30
    };
    score += stateScores[this.brandData.brandState] || 0;

    // Platform presence score (0-30)
    const activePlatforms = Object.values(this.brandData.platforms).filter(p => p.active).length;
    score += Math.min(activePlatforms * 5, 30);

    // Content strategy score (0-20)
    const freqScores = { daily: 20, '3x-week': 15, weekly: 10 };
    score += freqScores[this.brandData.contentStrategy.frequency] || 0;

    // Engagement score (0-20)
    const avgEngagement = this.calculateAverageEngagement();
    score += Math.min(avgEngagement * 4, 20);

    this.brandData.brandScore = Math.round(score);

    // Generate recommendations
    this.generateRecommendations();

    this.nextStep();
  },

  calculateAverageEngagement() {
    const activePlatforms = Object.values(this.brandData.platforms).filter(p => p.active);
    if (activePlatforms.length === 0) return 0;

    const totalEngagement = activePlatforms.reduce((sum, p) => sum + p.engagement, 0);
    return totalEngagement / activePlatforms.length;
  },

  generateRecommendations() {
    const recs = [];

    // Based on brand state
    if (this.brandData.brandState === 'none' || this.brandData.brandState === 'basic') {
      recs.push({
        type: 'priority',
        title: 'Start with 2-3 Core Platforms',
        description: 'Focus on LinkedIn + Instagram or Facebook. Master these before expanding.',
        action: 'Set up profiles & post 3x/week for 90 days'
      });
    }

    // Based on platforms
    const activePlatforms = Object.keys(this.brandData.platforms).filter(k => this.brandData.platforms[k].active);
    if (!activePlatforms.includes('linkedin')) {
      recs.push({
        type: 'platform',
        title: 'Add LinkedIn',
        description: 'LinkedIn is essential for B2B and professional networking.',
        action: 'Create optimized LinkedIn profile this week'
      });
    }

    if (!activePlatforms.includes('youtube')) {
      recs.push({
        type: 'platform',
        title: 'Start YouTube Channel',
        description: 'Long-form video content builds authority and is great for SEO.',
        action: 'Launch with 1 video per week'
      });
    }

    // Content strategy recommendations
    if (this.brandData.contentStrategy.frequency === 'weekly') {
      recs.push({
        type: 'strategy',
        title: 'Increase Posting Frequency',
        description: 'Weekly posts won\'t build momentum. Aim for 3x per week minimum.',
        action: 'Batch-create content on Sundays for the week ahead'
      });
    }

    // Goal-based recommendations
    if (this.brandData.goals.includes('leads')) {
      recs.push({
        type: 'tactic',
        title: 'Add Lead Magnets',
        description: 'Offer free value (eBook, checklist, webinar) in exchange for email.',
        action: 'Create 1 lead magnet per platform'
      });
    }

    if (this.brandData.goals.includes('authority')) {
      recs.push({
        type: 'tactic',
        title: 'Publish Thought Leadership',
        description: 'Share insights, predictions, and original research in your niche.',
        action: 'Write 1 LinkedIn article per week'
      });
    }

    this.brandData.recommendations = recs.slice(0, 6); // Top 6 recommendations
  },

  // STEP 6: Results & Strategy
  renderStep6() {
    const score = this.brandData.brandScore;
    const level = this.getBrandLevel(score);
    const activePlatforms = Object.keys(this.brandData.platforms).filter(k => this.brandData.platforms[k].active);

    const container = document.getElementById('brandingContainer');
    container.innerHTML = `
      <div class="brand-step full-width" data-step="6">
        <div class="step-header">
          <button class="back-btn" onclick="PersonalBranding.previousStep()">
            <i class="fas fa-arrow-left"></i>
          </button>
          <h2 class="step-title">Your Brand Strategy</h2>
          <div class="step-badge">Step 5 of 5</div>
          <div class="step-progress">
            <div class="progress-bar" style="width: 100%;"></div>
          </div>
        </div>

        <div class="step-content">
          <div class="score-showcase">
            <div class="score-card">
              <h3>Your Brand Score</h3>
              <div class="score-circle" data-score="${score}">
                <svg viewBox="0 0 200 200">
                  <circle cx="100" cy="100" r="90" class="score-bg"></circle>
                  <circle cx="100" cy="100" r="90" class="score-fill" 
                    style="stroke-dasharray: ${score * 5.65} 565;"></circle>
                </svg>
                <div class="score-number">${score}</div>
                <div class="score-max">/100</div>
              </div>
              <div class="score-level ${level.class}">
                <i class="${level.icon}"></i>
                ${level.label}
              </div>
            </div>

            <div class="score-breakdown">
              <h3>Score Breakdown</h3>
              <div class="breakdown-items">
                <div class="breakdown-item">
                  <span>Brand State</span>
                  <div class="breakdown-bar">
                    <div class="bar-fill" style="width: ${this.getStateScore()}%;"></div>
                  </div>
                  <span>${this.getStateScore()}/30</span>
                </div>
                <div class="breakdown-item">
                  <span>Platform Presence</span>
                  <div class="breakdown-bar">
                    <div class="bar-fill" style="width: ${Math.min(activePlatforms.length * 5 / 30 * 100, 100)}%;"></div>
                  </div>
                  <span>${Math.min(activePlatforms.length * 5, 30)}/30</span>
                </div>
                <div class="breakdown-item">
                  <span>Content Strategy</span>
                  <div class="breakdown-bar">
                    <div class="bar-fill" style="width: ${this.getFreqScore() / 20 * 100}%;"></div>
                  </div>
                  <span>${this.getFreqScore()}/20</span>
                </div>
                <div class="breakdown-item">
                  <span>Engagement Quality</span>
                  <div class="breakdown-bar">
                    <div class="bar-fill" style="width: ${Math.min(this.calculateAverageEngagement() * 4 / 20 * 100, 100)}%;"></div>
                  </div>
                  <span>${Math.min(Math.round(this.calculateAverageEngagement() * 4), 20)}/20</span>
                </div>
              </div>
            </div>
          </div>

          <div class="strategy-summary">
            <h3>Your Strategy Summary</h3>
            <div class="summary-grid">
              <div class="summary-item">
                <i class="fas fa-calendar-alt"></i>
                <div class="item-content">
                  <span class="item-label">Posting Frequency</span>
                  <span class="item-value">${this.getFrequencyLabel()}</span>
                </div>
              </div>
              <div class="summary-item">
                <i class="fas fa-network-wired"></i>
                <div class="item-content">
                  <span class="item-label">Active Platforms</span>
                  <span class="item-value">${activePlatforms.length} platforms</span>
                </div>
              </div>
              <div class="summary-item">
                <i class="fas fa-pen-fancy"></i>
                <div class="item-content">
                  <span class="item-label">Content Types</span>
                  <span class="item-value">${this.brandData.contentStrategy.types.length} types</span>
                </div>
              </div>
              <div class="summary-item">
                <i class="fas fa-bullseye"></i>
                <div class="item-content">
                  <span class="item-label">Primary Goals</span>
                  <span class="item-value">${this.brandData.goals.length} goals</span>
                </div>
              </div>
            </div>
          </div>

          <div class="recommendations-section">
            <h3>
              <i class="fas fa-lightbulb"></i>
              Personalized Recommendations
            </h3>
            <div class="recommendations-grid">
              ${this.brandData.recommendations.map((rec, index) => `
                <div class="recommendation-card">
                  <div class="rec-header">
                    <span class="rec-number">${index + 1}</span>
                    <span class="rec-type ${rec.type}">${rec.type}</span>
                  </div>
                  <h4>${rec.title}</h4>
                  <p>${rec.description}</p>
                  <div class="rec-action">
                    <i class="fas fa-play-circle"></i>
                    <strong>Action:</strong> ${rec.action}
                  </div>
                </div>
              `).join('')}
            </div>
          </div>

          <div class="mit-conversion-section">
            <h3>
              <i class="fas fa-tasks"></i>
              Convert to MITs (Most Important Tasks)
            </h3>
            <p>Select recommendations to add as MITs:</p>
            <div class="mit-checklist">
              ${this.brandData.recommendations.map((rec, index) => `
                <label class="mit-item">
                  <input type="checkbox" id="mit_${index}" checked>
                  <span>${rec.title}</span>
                </label>
              `).join('')}
            </div>
          </div>
        </div>

        <div class="step-actions">
          <button class="btn btn-secondary" onclick="PersonalBranding.saveAndExit()">
            <i class="fas fa-save"></i>
            Save for Later
          </button>
          <button class="btn btn-primary btn-large" onclick="PersonalBranding.completeAssessment()">
            <i class="fas fa-check-circle"></i>
            Complete & Create MITs
          </button>
        </div>
      </div>
    `;
  },

  getBrandLevel(score) {
    if (score >= 80) return { label: 'Exceptional', class: 'exceptional', icon: 'fas fa-crown' };
    if (score >= 60) return { label: 'Strong', class: 'strong', icon: 'fas fa-star' };
    if (score >= 40) return { label: 'Growing', class: 'growing', icon: 'fas fa-seedling' };
    if (score >= 20) return { label: 'Developing', class: 'developing', icon: 'fas fa-flag' };
    return { label: 'Starting Out', class: 'starting', icon: 'fas fa-rocket' };
  },

  getStateScore() {
    const scores = { none: 0, basic: 5, inconsistent: 10, growing: 20, established: 25, automate: 30 };
    return scores[this.brandData.brandState] || 0;
  },

  getFreqScore() {
    const scores = { daily: 20, '3x-week': 15, weekly: 10 };
    return scores[this.brandData.contentStrategy.frequency] || 0;
  },

  getFrequencyLabel() {
    const labels = { daily: 'Daily', '3x-week': '3x Per Week', weekly: 'Weekly' };
    return labels[this.brandData.contentStrategy.frequency] || 'Not set';
  },

  completeAssessment() {
    // Save assessment
    this.brandData.updatedAt = new Date().toISOString();
    
    // Get selected MITs
    const selectedMITs = [];
    this.brandData.recommendations.forEach((rec, index) => {
      if (document.getElementById(`mit_${index}`)?.checked) {
        selectedMITs.push(rec);
      }
    });

    this.brandData.selectedMITs = selectedMITs;

    // Save to localStorage
    this.saveToLocalStorage();

    // Show success
    this.showNotification('Brand Assessment Complete!', 'success');

    // Redirect to home
    setTimeout(() => {
      window.location.href = 'home.html?branding_complete=true';
    }, 1500);
  },

  saveAndExit() {
    this.brandData.updatedAt = new Date().toISOString();
    this.saveToLocalStorage();
    
    this.showNotification('Brand assessment saved!', 'success');
    
    setTimeout(() => {
      window.location.href = 'home.html';
    }, 1000);
  },

  saveToLocalStorage() {
    const allAssessments = JSON.parse(localStorage.getItem('brandAssessments') || '[]');
    
    const existingIndex = allAssessments.findIndex(a => a.assessmentId === this.brandData.assessmentId);
    
    if (existingIndex >= 0) {
      allAssessments[existingIndex] = this.brandData;
    } else {
      allAssessments.push(this.brandData);
    }

    localStorage.setItem('brandAssessments', JSON.stringify(allAssessments));
    localStorage.setItem('currentBrand', JSON.stringify(this.brandData));
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
      showNotification('Personal Branding', message, type);
    } else {
      alert(message);
    }
  }
};

// Auto-initialize
if (document.getElementById('brandingContainer')) {
  document.addEventListener('DOMContentLoaded', () => {
    PersonalBranding.init();
  });
}
