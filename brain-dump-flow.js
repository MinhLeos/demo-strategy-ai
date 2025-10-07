// BRAIN DUMP CONVERSATIONAL FLOW - Desktop-First
// 5-Step AI-Powered Brain Dump Experience

const BrainDumpFlow = {
  // State Management
  currentStep: 1,
  totalSteps: 5,
  userData: {
    rawDump: "",
    understood: [],
    confirmed: false,
    organized: {},
    additionalDetails: {},
    transcript: ""
  },
  isRecording: false,
  recognition: null,

  // Initialize
  init() {
    this.setupSpeechRecognition();
    this.renderStep1();
  },

  // Setup Web Speech API
  setupSpeechRecognition() {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      this.recognition = new SpeechRecognition();
      this.recognition.continuous = true;
      this.recognition.interimResults = true;
      this.recognition.lang = 'en-US';

      this.recognition.onresult = (event) => {
        let interimTranscript = '';
        let finalTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += transcript + ' ';
          } else {
            interimTranscript += transcript;
          }
        }

        this.updateTranscript(finalTranscript, interimTranscript);
      };

      this.recognition.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        this.stopRecording();
        this.showNotification('Recognition error. Please try again.', 'error');
      };

      this.recognition.onend = () => {
        if (this.isRecording) {
          this.recognition.start(); // Auto-restart if still recording
        }
      };
    }
  },

  // STEP 1: Initial Prompt
  renderStep1() {
    const container = document.getElementById('brainDumpFlowContainer');
    container.innerHTML = `
      <div class="brain-dump-step" data-step="1">
        <div class="step-header">
          <h1 class="step-title">Brain Dump Session</h1>
          <p class="step-subtitle">Let's clear your mental clutter</p>
        </div>

        <div class="step-content">
          <div class="intro-message">
            <div class="intro-icon">
              <i class="fas fa-brain"></i>
            </div>
            <p class="intro-text">
              Are you feeling like you have a lot of tasks in your head? 
              <strong>Let the Personal Strategy AI pull that chaos out of your head</strong> 
              and help you start to organize it and build strategy around it.
            </p>
          </div>

          <div class="step-visual">
            <div class="chaos-illustration">
              <div class="thought-bubble">💭</div>
              <div class="thought-bubble">✏️</div>
              <div class="thought-bubble">📞</div>
              <div class="thought-bubble">📅</div>
              <div class="thought-bubble">💼</div>
            </div>
            <div class="arrow-down">
              <i class="fas fa-arrow-down"></i>
            </div>
            <div class="organized-illustration">
              <i class="fas fa-check-circle"></i>
              <span>Organized & Actionable</span>
            </div>
          </div>
        </div>

        <div class="step-actions">
          <button class="btn btn-primary btn-large" onclick="BrainDumpFlow.nextStep()">
            Let's Begin
            <i class="fas fa-arrow-right"></i>
          </button>
        </div>
      </div>
    `;
  },

  // STEP 2: Free Flow Input
  renderStep2() {
    const container = document.getElementById('brainDumpFlowContainer');
    container.innerHTML = `
      <div class="brain-dump-step" data-step="2">
        <div class="step-header">
          <button class="back-btn" onclick="BrainDumpFlow.previousStep()">
            <i class="fas fa-arrow-left"></i>
          </button>
          <div>
            <h2 class="step-title">Let It Rip!</h2>
            <p class="step-subtitle">Step 2 of 5</p>
          </div>
        </div>

        <div class="step-content">
          <div class="instruction-card">
            <p>
              <strong>In a free flow method, tell me what is on your mind.</strong> 
              Let it rip! Give as much detail as you want, so I can understand 
              your thoughts and help you organize it.
            </p>
          </div>

          <div class="input-workspace">
            <div class="input-column">
              <div class="voice-input-section">
                <button class="mic-btn-large" id="micBtnLarge" onclick="BrainDumpFlow.toggleRecording()">
                  <i class="fas fa-microphone"></i>
                </button>
                <p class="voice-status" id="voiceStatus">Click to start speaking</p>
              </div>

              <div class="or-divider">
                <span>OR</span>
              </div>

              <div class="text-input-section">
                <textarea 
                  id="brainDumpTextarea" 
                  placeholder="Type your thoughts here..."
                  rows="10"
                  class="brain-dump-textarea"
                ></textarea>
              </div>
            </div>

            <div class="preview-column">
              <h3>Your Brain Dump</h3>
              <div class="transcript-preview" id="transcriptPreview">
                <p class="empty-state">
                  <i class="fas fa-comment-dots"></i>
                  Start speaking or typing, and your content will appear here...
                </p>
              </div>
              <div class="word-count" id="wordCount">0 words</div>
            </div>
          </div>
        </div>

        <div class="step-actions">
          <button 
            class="btn btn-primary btn-large" 
            onclick="BrainDumpFlow.processAndContinue()"
            id="continueBtn"
            disabled
          >
            Process My Thoughts
            <i class="fas fa-arrow-right"></i>
          </button>
        </div>
      </div>
    `;

    // Setup real-time sync
    this.setupInputSync();
  },

  // Setup input synchronization
  setupInputSync() {
    const textarea = document.getElementById('brainDumpTextarea');
    const preview = document.getElementById('transcriptPreview');
    const wordCount = document.getElementById('wordCount');
    const continueBtn = document.getElementById('continueBtn');

    textarea.addEventListener('input', (e) => {
      const text = e.target.value;
      this.userData.rawDump = text;
      
      if (text.trim().length > 0) {
        preview.innerHTML = `<p>${text.replace(/\n/g, '<br>')}</p>`;
        const words = text.trim().split(/\s+/).length;
        wordCount.textContent = `${words} word${words !== 1 ? 's' : ''}`;
        continueBtn.disabled = text.trim().length < 50;
      } else {
        preview.innerHTML = `
          <p class="empty-state">
            <i class="fas fa-comment-dots"></i>
            Start speaking or typing, and your content will appear here...
          </p>
        `;
        wordCount.textContent = '0 words';
        continueBtn.disabled = true;
      }
    });
  },

  // Toggle voice recording
  toggleRecording() {
    const micBtn = document.getElementById('micBtnLarge');
    const voiceStatus = document.getElementById('voiceStatus');

    if (!this.recognition) {
      this.showNotification('Speech recognition not supported', 'error');
      return;
    }

    if (this.isRecording) {
      this.stopRecording();
    } else {
      this.startRecording();
    }
  },

  startRecording() {
    this.isRecording = true;
    const micBtn = document.getElementById('micBtnLarge');
    const voiceStatus = document.getElementById('voiceStatus');
    
    micBtn.classList.add('recording');
    voiceStatus.textContent = 'Listening... Speak now';
    
    try {
      this.recognition.start();
    } catch (error) {
      console.error('Failed to start recording:', error);
    }
  },

  stopRecording() {
    this.isRecording = false;
    const micBtn = document.getElementById('micBtnLarge');
    const voiceStatus = document.getElementById('voiceStatus');
    
    micBtn.classList.remove('recording');
    voiceStatus.textContent = 'Click to start speaking';
    
    if (this.recognition) {
      this.recognition.stop();
    }
  },

  updateTranscript(finalText, interimText) {
    const textarea = document.getElementById('brainDumpTextarea');
    const preview = document.getElementById('transcriptPreview');
    const wordCount = document.getElementById('wordCount');
    const continueBtn = document.getElementById('continueBtn');

    // Append final text to userData
    if (finalText) {
      this.userData.transcript += finalText;
      this.userData.rawDump = this.userData.transcript + interimText;
    } else {
      this.userData.rawDump = this.userData.transcript + interimText;
    }

    // Update textarea
    textarea.value = this.userData.rawDump;

    // Update preview
    const displayText = this.userData.rawDump;
    if (displayText.trim().length > 0) {
      preview.innerHTML = `
        <p>${displayText.replace(/\n/g, '<br>')}</p>
        ${interimText ? '<span class="interim-text">' + interimText + '</span>' : ''}
      `;
      
      const words = displayText.trim().split(/\s+/).length;
      wordCount.textContent = `${words} word${words !== 1 ? 's' : ''}`;
      continueBtn.disabled = displayText.trim().length < 50;
    }
  },

  // Process and move to Step 3
  processAndContinue() {
    if (this.userData.rawDump.trim().length < 50) {
      this.showNotification('Please provide more detail (at least 50 characters)', 'warning');
      return;
    }

    // Stop recording if active
    if (this.isRecording) {
      this.stopRecording();
    }

    // Show processing
    this.showProcessing();

    // Simulate AI processing (1.5s)
    setTimeout(() => {
      this.userData.understood = this.parseIntoConcepts(this.userData.rawDump);
      this.nextStep();
    }, 1500);
  },

  // Parse text into concepts (Mock AI)
  parseIntoConcepts(text) {
    const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
    
    return sentences.map((sentence, index) => ({
      id: `concept-${index}`,
      text: sentence.trim(),
      category: this.detectCategory(sentence),
      priority: this.detectPriority(sentence),
      actionable: this.isActionable(sentence)
    }));
  },

  detectCategory(text) {
    const lower = text.toLowerCase();
    if (/\b(client|sale|revenue|marketing|business)\b/.test(lower)) return 'business';
    if (/\b(health|family|home|personal)\b/.test(lower)) return 'personal';
    if (/\b(build|create|launch|develop|project)\b/.test(lower)) return 'project';
    if (/\b(learn|study|course|skill|training)\b/.test(lower)) return 'learning';
    if (/\b(quick|easy|simple|fast)\b/.test(lower)) return 'quick-win';
    return 'other';
  },

  detectPriority(text) {
    const lower = text.toLowerCase();
    if (/\b(urgent|asap|immediately|critical|important)\b/.test(lower)) return 'high';
    if (/\b(soon|next|upcoming)\b/.test(lower)) return 'medium';
    return 'normal';
  },

  isActionable(text) {
    const actionWords = /\b(need to|should|must|have to|want to|will|going to|plan to)\b/i;
    return actionWords.test(text);
  },

  // STEP 3: Confirmation
  renderStep3() {
    const container = document.getElementById('brainDumpFlowContainer');
    
    const conceptsHTML = this.userData.understood.map(concept => {
      const priorityClass = concept.priority === 'high' ? 'high-priority' : concept.priority === 'medium' ? 'medium-priority' : '';
      const actionableIcon = concept.actionable ? '<i class="fas fa-check-square action-icon"></i>' : '';
      
      return `
        <div class="concept-card ${priorityClass}" data-id="${concept.id}">
          <div class="concept-content">
            ${actionableIcon}
            <p>${concept.text}</p>
          </div>
          <div class="concept-meta">
            <span class="category-badge category-${concept.category}">
              ${this.getCategoryLabel(concept.category)}
            </span>
            ${concept.actionable ? '<span class="actionable-badge">Actionable</span>' : ''}
          </div>
          <button class="concept-edit-btn" onclick="BrainDumpFlow.editConcept('${concept.id}')">
            <i class="fas fa-edit"></i>
          </button>
        </div>
      `;
    }).join('');

    container.innerHTML = `
      <div class="brain-dump-step" data-step="3">
        <div class="step-header">
          <button class="back-btn" onclick="BrainDumpFlow.previousStep()">
            <i class="fas fa-arrow-left"></i>
          </button>
          <div>
            <h2 class="step-title">Understanding Check</h2>
            <p class="step-subtitle">Step 3 of 5</p>
          </div>
        </div>

        <div class="step-content">
          <div class="instruction-card">
            <p>
              <strong>Here is what I understood you say.</strong> 
              Is this correct? Did we get everything? If not, let it rip again.
            </p>
          </div>

          <div class="concepts-grid">
            ${conceptsHTML}
          </div>

          <div class="concept-stats">
            <div class="stat-item">
              <i class="fas fa-lightbulb"></i>
              <span>${this.userData.understood.length} concepts extracted</span>
            </div>
            <div class="stat-item">
              <i class="fas fa-check-circle"></i>
              <span>${this.userData.understood.filter(c => c.actionable).length} actionable items</span>
            </div>
          </div>
        </div>

        <div class="step-actions">
          <button class="btn btn-secondary" onclick="BrainDumpFlow.addMore()">
            <i class="fas fa-plus"></i>
            Add More
          </button>
          <button class="btn btn-primary" onclick="BrainDumpFlow.nextStep()">
            Yes, That's Everything
            <i class="fas fa-arrow-right"></i>
          </button>
        </div>
      </div>
    `;
  },

  getCategoryLabel(category) {
    const labels = {
      'business': 'Business',
      'personal': 'Personal',
      'project': 'Project',
      'learning': 'Learning',
      'quick-win': 'Quick Win',
      'other': 'Other'
    };
    return labels[category] || 'Other';
  },

  editConcept(conceptId) {
    const concept = this.userData.understood.find(c => c.id === conceptId);
    if (!concept) return;

    const newText = prompt('Edit this concept:', concept.text);
    if (newText && newText.trim()) {
      concept.text = newText.trim();
      this.renderStep3(); // Re-render
    }
  },

  addMore() {
    this.userData.rawDump = ''; // Reset for new input
    this.userData.transcript = '';
    this.renderStep2();
  },

  // STEP 4: Organization Offer
  renderStep4() {
    const categoryCounts = this.getCategoryCounts();
    const previewHTML = Object.entries(categoryCounts).map(([category, count]) => {
      return `
        <div class="category-preview-item">
          <span class="category-name">${this.getCategoryLabel(category)}</span>
          <span class="category-count">${count} item${count !== 1 ? 's' : ''}</span>
        </div>
      `;
    }).join('');

    const container = document.getElementById('brainDumpFlowContainer');
    container.innerHTML = `
      <div class="brain-dump-step" data-step="4">
        <div class="step-header">
          <h2 class="step-title">Ready to Organize?</h2>
          <p class="step-subtitle">Step 4 of 5</p>
        </div>

        <div class="step-content">
          <div class="instruction-card">
            <p>
              <strong>Now that we have everything out of your head, 
              would you like me to help you organize these thoughts?</strong>
            </p>
          </div>

          <div class="category-preview">
            <h3>I'll organize your thoughts into these categories:</h3>
            <div class="category-preview-grid">
              ${previewHTML}
            </div>
          </div>

          <div class="organization-benefits">
            <h4>Benefits of organizing:</h4>
            <ul>
              <li><i class="fas fa-check"></i> Clear action items</li>
              <li><i class="fas fa-check"></i> Priority ranking</li>
              <li><i class="fas fa-check"></i> Convert to MIT tasks</li>
              <li><i class="fas fa-check"></i> Track progress</li>
            </ul>
          </div>
        </div>

        <div class="step-actions">
          <button class="btn btn-secondary" onclick="BrainDumpFlow.skipOrganization()">
            Skip for Now
          </button>
          <button class="btn btn-primary btn-large" onclick="BrainDumpFlow.organizeNow()">
            <i class="fas fa-magic"></i>
            Yes, Organize It!
          </button>
        </div>
      </div>
    `;
  },

  getCategoryCounts() {
    const counts = {};
    this.userData.understood.forEach(concept => {
      counts[concept.category] = (counts[concept.category] || 0) + 1;
    });
    return counts;
  },

  organizeNow() {
    this.showProcessing('Organizing your thoughts...');
    setTimeout(() => {
      this.userData.organized = this.organizeConcepts();
      this.nextStep();
    }, 2000);
  },

  organizeConcepts() {
    const organized = {};
    this.userData.understood.forEach(concept => {
      if (!organized[concept.category]) {
        organized[concept.category] = [];
      }
      organized[concept.category].push(concept);
    });

    // Sort by priority within each category
    Object.keys(organized).forEach(category => {
      organized[category].sort((a, b) => {
        const priorityOrder = { high: 0, medium: 1, normal: 2 };
        return priorityOrder[a.priority] - priorityOrder[b.priority];
      });
    });

    return organized;
  },

  skipOrganization() {
    // Save unorganized and exit
    this.saveToLocalStorage();
    this.showNotification('Brain dump saved!', 'success');
    setTimeout(() => {
      window.location.href = 'brain-dump.html';
    }, 1000);
  },

  // STEP 5: Live Categorization
  renderStep5() {
    const container = document.getElementById('brainDumpFlowContainer');
    
    const categoriesHTML = Object.entries(this.userData.organized).map(([category, concepts]) => {
      const conceptsHTML = concepts.map(concept => `
        <div class="kanban-card" data-id="${concept.id}" draggable="true">
          ${concept.actionable ? '<i class="fas fa-check-square"></i>' : ''}
          <p>${concept.text}</p>
          <div class="card-actions">
            <button class="card-action-btn" onclick="BrainDumpFlow.addDetails('${concept.id}')">
              <i class="fas fa-plus"></i>
            </button>
            <button class="card-action-btn" onclick="BrainDumpFlow.convertToTask('${concept.id}')">
              <i class="fas fa-tasks"></i>
            </button>
          </div>
        </div>
      `).join('');

      return `
        <div class="kanban-column" data-category="${category}">
          <div class="column-header">
            <h3>${this.getCategoryLabel(category)}</h3>
            <span class="item-count">${concepts.length}</span>
          </div>
          <div class="column-body">
            ${conceptsHTML}
          </div>
        </div>
      `;
    }).join('');

    container.innerHTML = `
      <div class="brain-dump-step full-screen" data-step="5">
        <div class="step-header">
          <h2 class="step-title">Organize & Refine</h2>
          <p class="step-subtitle">Step 5 of 5 - Drag cards to re-categorize</p>
        </div>

        <div class="step-content">
          <div class="instruction-card">
            <p>
              You should now see the data start to be organized by categories. 
              <strong>Share more details, as needed</strong>, so we can get this 
              information properly categorized.
            </p>
          </div>

          <div class="kanban-board">
            ${categoriesHTML}
          </div>

          <div class="side-panel">
            <h3>Add More Details</h3>
            <textarea 
              id="additionalDetails" 
              placeholder="Type or speak to add clarifications to any category..."
              rows="4"
            ></textarea>
            <button class="btn btn-primary" onclick="BrainDumpFlow.addClarification()">
              <i class="fas fa-plus"></i>
              Add Clarification
            </button>
          </div>
        </div>

        <div class="step-actions">
          <button class="btn btn-secondary" onclick="BrainDumpFlow.saveAndContinue()">
            <i class="fas fa-save"></i>
            Save as Brain Dump
          </button>
          <button class="btn btn-primary btn-large" onclick="BrainDumpFlow.convertToMITs()">
            <i class="fas fa-rocket"></i>
            Create MIT Tasks
          </button>
        </div>
      </div>
    `;

    this.setupDragAndDrop();
  },

  setupDragAndDrop() {
    // Will implement drag & drop functionality
    console.log('Drag and drop setup');
  },

  addDetails(conceptId) {
    const concept = this.userData.understood.find(c => c.id === conceptId);
    if (!concept) return;

    const details = prompt('Add more details:', concept.text);
    if (details && details.trim()) {
      concept.text = details.trim();
      this.renderStep5(); // Re-render
    }
  },

  convertToTask(conceptId) {
    // Open task modal with pre-filled data
    console.log('Convert to task:', conceptId);
    // Will integrate with existing task modal
  },

  addClarification() {
    const textarea = document.getElementById('additionalDetails');
    const text = textarea.value.trim();
    
    if (text) {
      // Process and add to appropriate category
      const newConcept = {
        id: `concept-${Date.now()}`,
        text: text,
        category: this.detectCategory(text),
        priority: this.detectPriority(text),
        actionable: this.isActionable(text)
      };

      this.userData.understood.push(newConcept);
      this.userData.organized = this.organizeConcepts();
      
      textarea.value = '';
      this.renderStep5();
    }
  },

  convertToMITs() {
    // Save organized data
    this.saveToLocalStorage();
    
    // Show success
    this.showNotification('Brain dump organized! Creating tasks...', 'success');
    
    // Redirect to task creation
    setTimeout(() => {
      window.location.href = 'home.html';
    }, 1500);
  },

  saveAndContinue() {
    this.saveToLocalStorage();
    this.showNotification('Brain dump saved successfully!', 'success');
    
    setTimeout(() => {
      window.location.href = 'brain-dump.html';
    }, 1000);
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
  saveToLocalStorage() {
    const data = {
      ...this.userData,
      timestamp: new Date().toISOString(),
      step: this.currentStep
    };
    localStorage.setItem('brainDumpFlow', JSON.stringify(data));
  },

  showProcessing(message = 'Processing...') {
    const container = document.getElementById('brainDumpFlowContainer');
    container.innerHTML = `
      <div class="processing-screen">
        <div class="spinner"></div>
        <p>${message}</p>
      </div>
    `;
  },

  showNotification(message, type = 'info') {
    // Reuse existing notification system
    if (typeof showNotification === 'function') {
      showNotification('Brain Dump', message, type);
    } else {
      alert(message);
    }
  }
};

// Auto-initialize when included
if (document.getElementById('brainDumpFlowContainer')) {
  document.addEventListener('DOMContentLoaded', () => {
    BrainDumpFlow.init();
  });
}
