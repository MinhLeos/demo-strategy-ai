document.addEventListener("DOMContentLoaded", () => {
  // ===================================
  // STATE MANAGEMENT
  // ===================================
  let currentStep = 0;
  const totalSteps = 7;
  let userData = {
    industries: [],
    roles: [], // Updated to array for multi-select
    otherRole: "",
    workStyle: "",
    priorities: [],
    challenges: [],
    preferences: {},
  };

  // ===================================
  // ELEMENT REFERENCES
  // ===================================
  const steps = document.querySelectorAll(".onboarding-step");
  const progressBar = document.getElementById("progressBar");
  const currentStepElement = document.getElementById("currentStep");
  const totalStepsElement = document.getElementById("totalSteps");
  const progressPercent = document.getElementById("progressPercent");
  const skipBtn = document.getElementById("skipBtn");

  // ===================================
  // INITIALIZATION
  // ===================================
  showStep(0);
  updateProgress();

  // Set total steps if element exists
  if (totalStepsElement) {
    totalStepsElement.textContent = totalSteps;
  }

  // ===================================
  // EVENT LISTENERS - MAIN NAVIGATION
  // ===================================

  // Start button (Welcome screen)
  document.getElementById("startBtn")?.addEventListener("click", () => {
    nextStep();
  });

  // Skip button - Updated to redirect to home.html
  document.getElementById("skipBtn")?.addEventListener("click", () => {
    if (confirm("Are you sure you want to skip the onboarding? You can complete it later in Settings.")) {
      // Save skip status
      localStorage.setItem("onboardingSkipped", "true");
      // Redirect to home.html instead of index.html
      window.location.href = "home.html";
    }
  });

  // ===================================
  // STEP NAVIGATION
  // ===================================

  // Navigation buttons for each step
  for (let i = 1; i <= 7; i++) {
    // Next buttons
    document.getElementById(`nextStep${i}`)?.addEventListener("click", () => {
      if (validateStep(i)) {
        saveStepData(i);

        // Special handling for step transitions
        if (i === 4) {
          updateIndustrySections();
        }
        if (i === 6) {
          updateSummary();
        }

        nextStep();
      }
    });

    // Back buttons
    document.getElementById(`backStep${i}`)?.addEventListener("click", () => {
      previousStep();
    });
  }

  // Complete button - Updated to redirect to home.html
  document.getElementById("completeBtn")?.addEventListener("click", () => {
    completeOnboarding();
  });

  // ===================================
  // DYNAMIC FORM INTERACTIONS
  // ===================================

  // Video Placeholder Click Handler
  const videoPlaceholder = document.getElementById('videoPlaceholder');
  if (videoPlaceholder) {
    videoPlaceholder.addEventListener('click', () => {
      showNotification(
        'Coming Soon',
        'The introduction video will be available shortly. You can proceed with the survey.',
        'info'
      );
    });
  }

  // Role "Other" checkbox handler
  document.querySelectorAll('input[name="role"]').forEach((checkbox) => {
    checkbox.addEventListener("change", function () {
      const otherCheckbox = document.querySelector('input[name="role"][value="other"]');
      const otherInput = document.getElementById("otherRoleInput");
      
      if (otherCheckbox && otherCheckbox.checked) {
        otherInput.style.display = "block";
      } else if (otherInput) {
        otherInput.style.display = "none";
      }
    });
  });

  // Priority selection limit (max 2)
  document.querySelectorAll('input[name="priorities"]').forEach((checkbox) => {
    checkbox.addEventListener("change", function () {
      const checked = document.querySelectorAll('input[name="priorities"]:checked');
      if (checked.length >= 2) {
        // Disable unchecked checkboxes
        document.querySelectorAll('input[name="priorities"]:not(:checked)').forEach((cb) => {
          cb.disabled = true;
        });
      } else {
        // Re-enable all checkboxes
        document.querySelectorAll('input[name="priorities"]').forEach((cb) => {
          cb.disabled = false;
        });
      }

      // Update UI to show limit reached
      if (checked.length === 2) {
        showNotification("Maximum Selected", "You have selected the maximum 2 priorities", "info");
      }
    });
  });

  // Dynamic industry sections
  document.querySelectorAll('input[name="industry"]').forEach((checkbox) => {
    checkbox.addEventListener("change", updateIndustrySections);
  });

  // ===================================
  // NAVIGATION FUNCTIONS
  // ===================================

  function showStep(stepIndex) {
    steps.forEach((step, index) => {
      step.classList.toggle("active", index === stepIndex);
    });

    // Update skip button visibility (hide on welcome screen)
    if (skipBtn) {
      skipBtn.style.display = stepIndex === 0 ? "none" : "flex";
    }

    // Scroll to top when changing steps
    window.scrollTo(0, 0);

    updateProgress();
  }

  function nextStep() {
    if (currentStep < totalSteps) {
      currentStep++;
      showStep(currentStep);

      // Auto-save progress
      saveProgress();
    }
  }

  function previousStep() {
    if (currentStep > 0) {
      currentStep--;
      showStep(currentStep);
    }
  }

  function updateProgress() {
    const percent = (currentStep / totalSteps) * 100;

    if (progressBar) {
      progressBar.style.width = `${percent}%`;
    }

    if (currentStepElement) {
      currentStepElement.textContent = Math.max(1, currentStep);
    }

    if (progressPercent) {
      progressPercent.textContent = `${Math.round(percent)}%`;
    }
  }

  // ===================================
  // VALIDATION FUNCTIONS
  // ===================================

  function validateStep(step) {
    let isValid = true;
    let message = "";

    switch (step) {
      case 1:
        const industries = document.querySelectorAll('input[name="industry"]:checked');
        const otherIndustry = document.getElementById("otherIndustry")?.value.trim();
        const roles = document.querySelectorAll('input[name="role"]:checked');
        const workStyle = document.getElementById("workStyle")?.value;

        if (industries.length === 0 && !otherIndustry) {
          message = "Please select at least one industry or enter other";
          isValid = false;
        } else if (roles.length === 0) {
          message = "Please select at least one role";
          isValid = false;
        } else if (!workStyle) {
          message = "Please select your work style";
          isValid = false;
        }
        break;

      case 2:
        const priorities = document.querySelectorAll('input[name="priorities"]:checked');
        const challenges = document.querySelectorAll('input[name="challenges"]:checked');

        if (priorities.length === 0) {
          message = "Please select at least one priority";
          isValid = false;
        } else if (challenges.length === 0) {
          message = "Please select at least one challenge";
          isValid = false;
        }
        break;

      case 3:
        const commStyle = document.getElementById("communicationStyle")?.value;
        const supportStyle = document.getElementById("supportStyle")?.value;
        const inputMethod = document.getElementById("inputMethod")?.value;
        const viewPref = document.getElementById("viewPreference")?.value;

        if (!commStyle || !supportStyle || !inputMethod || !viewPref) {
          message = "Please complete all preferences";
          isValid = false;
        }
        break;

      case 4:
        // Industry-specific validation
        if (userData.industries.includes("real-estate")) {
          const repTracking = document.getElementById("repTracking")?.value;
          if (!repTracking) {
            message = "Please complete Real Estate settings";
            isValid = false;
          }
        }
        if (userData.industries.includes("content")) {
          const contentType = document.getElementById("contentType")?.value;
          if (!contentType) {
            message = "Please complete Content & Branding settings";
            isValid = false;
          }
        }
        break;

      case 5:
        const gapAnalysis = document.getElementById("gapAnalysis")?.value;
        const skillFocus = document.getElementById("skillFocus")?.value;
        const progressTracking = document.getElementById("progressTracking")?.value;

        if (!gapAnalysis || !skillFocus || !progressTracking) {
          message = "Please complete all growth preferences";
          isValid = false;
        }
        break;

      case 6:
        const aiLearning = document.getElementById("aiLearning")?.value;
        const dailyReminder = document.getElementById("dailyReminder")?.value;
        const weeklyPlanning = document.getElementById("weeklyPlanning")?.value;

        if (!aiLearning || !dailyReminder || !weeklyPlanning) {
          message = "Please complete all final preferences";
          isValid = false;
        }
        break;
    }

    if (!isValid) {
      showNotification("Required Information", message, "warning");
    }

    return isValid;
  }

  // ===================================
  // DATA MANAGEMENT
  // ===================================

  function saveStepData(step) {
    switch (step) {
      case 1:
        userData.industries = Array.from(document.querySelectorAll('input[name="industry"]:checked')).map(
          (cb) => cb.value
        );
        userData.otherIndustry = document.getElementById("otherIndustry")?.value.trim();
        
        // Updated: Multi-select roles
        userData.roles = Array.from(document.querySelectorAll('input[name="role"]:checked')).map(
          (cb) => cb.value
        );
        if (userData.roles.includes('other')) {
          userData.otherRole = document.getElementById("otherRoleText")?.value.trim();
        }
        
        userData.workStyle = document.getElementById("workStyle")?.value;
        break;

      case 2:
        userData.priorities = Array.from(document.querySelectorAll('input[name="priorities"]:checked')).map(
          (cb) => cb.value
        );
        userData.challenges = Array.from(document.querySelectorAll('input[name="challenges"]:checked')).map(
          (cb) => cb.value
        );
        break;

      case 3:
        userData.preferences.communication = document.getElementById("communicationStyle")?.value;
        userData.preferences.support = document.getElementById("supportStyle")?.value;
        userData.preferences.input = document.getElementById("inputMethod")?.value;
        userData.preferences.view = document.getElementById("viewPreference")?.value;
        break;

      case 4:
        // Save industry-specific settings
        if (userData.industries.includes("real-estate")) {
          userData.preferences.repTracking = document.getElementById("repTracking")?.value;
          userData.preferences.repInput = document.getElementById("repInput")?.value;
        }
        if (userData.industries.includes("content")) {
          userData.preferences.platforms = Array.from(document.querySelectorAll('input[name="platforms"]:checked')).map(
            (cb) => cb.value
          );
          userData.preferences.otherPlatforms = document.getElementById("otherPlatforms")?.value.trim();
          userData.preferences.contentType = document.getElementById("contentType")?.value;
          userData.preferences.writingTone = document.getElementById("writingTone")?.value;
        }
        break;

      case 5:
        userData.preferences.gapAnalysis = document.getElementById("gapAnalysis")?.value;
        userData.preferences.skillFocus = document.getElementById("skillFocus")?.value;
        userData.preferences.progressTracking = document.getElementById("progressTracking")?.value;
        break;

      case 6:
        userData.preferences.aiLearning = document.getElementById("aiLearning")?.value;
        userData.preferences.dailyReminder = document.getElementById("dailyReminder")?.value;
        userData.preferences.weeklyPlanning = document.getElementById("weeklyPlanning")?.value;
        break;
    }

    console.log("Step", step, "data saved:", userData);

    // Save to localStorage for persistence
    saveProgress();
  }

  function saveProgress() {
    const progressData = {
      currentStep: currentStep,
      userData: userData,
      timestamp: new Date().toISOString(),
    };
    localStorage.setItem("onboardingProgress", JSON.stringify(progressData));
  }

  function loadProgress() {
    const savedProgress = localStorage.getItem("onboardingProgress");
    if (savedProgress) {
      const progressData = JSON.parse(savedProgress);
      currentStep = progressData.currentStep;
      userData = progressData.userData;
      showStep(currentStep);

      // Show notification that progress was restored
      showNotification("Progress Restored", "Your previous progress has been loaded", "info");
    }
  }

  // ===================================
  // UI UPDATE FUNCTIONS
  // ===================================

  function updateIndustrySections() {
    const selectedIndustries = Array.from(document.querySelectorAll('input[name="industry"]:checked')).map(
      (cb) => cb.value
    );

    const realEstateSection = document.getElementById("realEstateSection");
    const contentSection = document.getElementById("contentSection");
    const noIndustryMessage = document.getElementById("noIndustryMessage");

    // Show/hide Real Estate section
    if (realEstateSection) {
      realEstateSection.style.display = selectedIndustries.includes("real-estate") ? "block" : "none";
    }

    // Show/hide Content section
    if (contentSection) {
      contentSection.style.display = selectedIndustries.includes("content") ? "block" : "none";
    }

    // Show/hide no industry message
    if (noIndustryMessage) {
      const hasIndustrySettings = selectedIndustries.includes("real-estate") || selectedIndustries.includes("content");
      noIndustryMessage.style.display = hasIndustrySettings ? "none" : "block";
    }
  }

  function updateSummary() {
    const summaryContainer = document.getElementById("setupSummary");
    if (!summaryContainer) return;

    let summaryHTML = "";

    // Industries
    if (userData.industries.length > 0 || userData.otherIndustry) {
      const allIndustries = [...userData.industries];
      if (userData.otherIndustry) {
        allIndustries.push(userData.otherIndustry);
      }
      summaryHTML += `
                <div class="summary-item">
                    <i class="fas fa-briefcase"></i>
                    <span><strong>Industries:</strong> ${allIndustries.join(", ")}</span>
                </div>
            `;
    }

    // Roles (updated for multi-select)
    if (userData.roles && userData.roles.length > 0) {
      const roleLabels = {
        'leader': 'Team Leader / Manager',
        'investor': 'Investor',
        'entrepreneur': 'Entrepreneur / Business Owner',
        'professional': 'Professional Employee',
        'consultant': 'Consultant / Advisor',
        'other': userData.otherRole || 'Other'
      };
      
      const rolesText = userData.roles.map(role => roleLabels[role] || role).join(", ");
      summaryHTML += `
                <div class="summary-item">
                    <i class="fas fa-user"></i>
                    <span><strong>Role(s):</strong> ${rolesText}</span>
                </div>
            `;
    }

    // Work Style
    if (userData.workStyle) {
      const workStyleText = document.querySelector(`#workStyle option[value="${userData.workStyle}"]`)?.textContent;
      summaryHTML += `
                <div class="summary-item">
                    <i class="fas fa-users"></i>
                    <span><strong>Work Style:</strong> ${workStyleText}</span>
                </div>
            `;
    }

    // Priorities
    if (userData.priorities.length > 0) {
      const priorityLabels = {
        productivity: "Increase Productivity",
        "mental-load": "Reduce Mental Load",
        branding: "Personal Branding",
        "rep-tracking": "REP Tracking",
        "gap-analysis": "Gap Analysis",
        strategy: "Strategic Planning",
      };
      const priorityTexts = userData.priorities.map((p) => priorityLabels[p] || p);
      summaryHTML += `
                <div class="summary-item">
                    <i class="fas fa-bullseye"></i>
                    <span><strong>Top Priorities:</strong> ${priorityTexts.join(", ")}</span>
                </div>
            `;
    }

    // Communication style
    if (userData.preferences.communication) {
      const commText = document.querySelector(
        `#communicationStyle option[value="${userData.preferences.communication}"]`
      )?.textContent;
      summaryHTML += `
                <div class="summary-item">
                    <i class="fas fa-comments"></i>
                    <span><strong>AI Communication:</strong> ${commText}</span>
                </div>
            `;
    }

    // Input method
    if (userData.preferences.input) {
      const inputText = document.querySelector(
        `#inputMethod option[value="${userData.preferences.input}"]`
      )?.textContent;
      summaryHTML += `
                <div class="summary-item">
                    <i class="fas fa-keyboard"></i>
                    <span><strong>Input Method:</strong> ${inputText}</span>
                </div>
            `;
    }

    // Daily reminders
    if (userData.preferences.dailyReminder && userData.preferences.dailyReminder !== "none") {
      const reminderText = document.querySelector(
        `#dailyReminder option[value="${userData.preferences.dailyReminder}"]`
      )?.textContent;
      summaryHTML += `
                <div class="summary-item">
                    <i class="fas fa-bell"></i>
                    <span><strong>Daily Reminders:</strong> ${reminderText}</span>
                </div>
            `;
    }

    summaryContainer.innerHTML = summaryHTML || "<p>Your preferences have been saved.</p>";
  }

  // ===================================
  // COMPLETION FUNCTION - REDIRECTS TO HOME.HTML
  // ===================================

  function completeOnboarding() {
    // Save final data
    localStorage.setItem("onboardingComplete", "true");
    localStorage.setItem("userPreferences", JSON.stringify(userData));
    localStorage.setItem("onboardingDate", new Date().toISOString());

    // Remove progress data since onboarding is complete
    localStorage.removeItem("onboardingProgress");

    // Show success notification
    showNotification(
      "Setup Complete!",
      "Your personalized AI assistant is ready. Redirecting to dashboard...",
      "success"
    );

    // Log completion for analytics (if needed)
    console.log("Onboarding completed:", {
      userData: userData,
      completedAt: new Date().toISOString(),
    });

    // Redirect to home.html after short delay
    setTimeout(() => {
      window.location.href = "home.html";
    }, 1500);
  }

  // ===================================
  // NOTIFICATION SYSTEM
  // ===================================

  function showNotification(title, message, type = "info") {
    // Remove any existing notifications
    const existingNotifications = document.querySelectorAll(".notification");
    existingNotifications.forEach((notif) => notif.remove());

    // Create notification element
    const notification = document.createElement("div");
    notification.className = "notification";
    notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: white;
            padding: 16px 20px;
            border-radius: 10px;
            box-shadow: 0 5px 20px rgba(0,0,0,0.15);
            z-index: 3000;
            max-width: 350px;
            display: flex;
            align-items: flex-start;
            gap: 12px;
            animation: slideIn 0.3s ease;
        `;

    let iconClass = "fa-info-circle";
    let iconColor = "#00BCD4";

    if (type === "success") {
      iconClass = "fa-check-circle";
      iconColor = "#4CAF50";
    } else if (type === "warning") {
      iconClass = "fa-exclamation-triangle";
      iconColor = "#FF9800";
    } else if (type === "error") {
      iconClass = "fa-exclamation-circle";
      iconColor = "#F44336";
    }

    notification.innerHTML = `
            <i class="fas ${iconClass}" style="color: ${iconColor}; font-size: 1.3rem; margin-top: 2px;"></i>
            <div>
                <strong style="display: block; margin-bottom: 4px; color: #2C3E50;">${title}</strong>
                <p style="margin: 0; font-size: 0.9rem; color: #666;">${message}</p>
            </div>
        `;

    document.body.appendChild(notification);

    // Auto remove after 4 seconds
    setTimeout(() => {
      notification.style.animation = "slideOut 0.3s ease";
      setTimeout(() => {
        if (notification.parentElement) {
          document.body.removeChild(notification);
        }
      }, 300);
    }, 4000);
  }

  // ===================================
  // CHECK FOR SAVED PROGRESS ON LOAD
  // ===================================

  // Check if user has saved progress and ask if they want to continue
  const savedProgress = localStorage.getItem("onboardingProgress");
  if (savedProgress && currentStep === 0) {
    const progressData = JSON.parse(savedProgress);
    const savedDate = new Date(progressData.timestamp);
    const hoursSinceLastSave = (new Date() - savedDate) / (1000 * 60 * 60);

    // Only offer to restore if saved within last 7 days
    if (hoursSinceLastSave < 168) {
      setTimeout(() => {
        if (
          confirm("You have saved progress from a previous session. Would you like to continue where you left off?")
        ) {
          loadProgress();
        }
      }, 500);
    }
  }

  // ===================================
  // KEYBOARD NAVIGATION
  // ===================================

  document.addEventListener("keydown", (e) => {
    // ALT + N for Next
    if (e.altKey && e.key === "n") {
      e.preventDefault();
      const nextBtn = document.querySelector(`.onboarding-step.active .btn-primary`);
      if (nextBtn) nextBtn.click();
    }

    // ALT + B for Back
    if (e.altKey && e.key === "b") {
      e.preventDefault();
      const backBtn = document.querySelector(`.onboarding-step.active .btn-secondary`);
      if (backBtn) backBtn.click();
    }

    // ESC to skip (with confirmation)
    if (e.key === "Escape" && currentStep > 0) {
      if (confirm("Are you sure you want to skip the remaining questions?")) {
        window.location.href = "home.html";
      }
    }
  });
});

// ===================================
// ADD ANIMATION STYLES
// ===================================
const style = document.createElement("style");
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
    
    .notification {
        transition: all 0.3s ease;
    }
    
    /* Pulse animation for important elements */
    @keyframes pulse {
        0% {
            transform: scale(1);
        }
        50% {
            transform: scale(1.05);
        }
        100% {
            transform: scale(1);
        }
    }
    
    .btn-complete:hover {
        animation: pulse 0.5s ease;
    }
`;
document.head.appendChild(style);
