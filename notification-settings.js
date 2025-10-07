// NOTIFICATION SETTINGS UI MANAGER
// Manages the notification settings modal and user preferences

const NotificationSettingsUI = {
  modal: null,
  settings: {},

  // Initialize the settings UI
  init() {
    this.loadSettings();
    this.createModal();
    this.attachEventListeners();
    this.updateUI();
  },

  // Load settings from localStorage
  loadSettings() {
    const defaults = {
      enabled: false,
      morningTime: '08:00',
      afternoonTime: '14:00',
      eveningTime: '20:00',
      soundEnabled: true,
      vibrationEnabled: true
    };

    const saved = localStorage.getItem('mitNotificationSettings');
    this.settings = saved ? { ...defaults, ...JSON.parse(saved) } : defaults;
  },

  // Save settings to localStorage
  saveSettings() {
    localStorage.setItem('mitNotificationSettings', JSON.stringify(this.settings));
    
    // Update MITNotifications if it exists
    if (typeof MITNotifications !== 'undefined' && MITNotifications.updateSettings) {
      MITNotifications.updateSettings(this.settings);
    }
  },

  // Create the settings modal HTML
  createModal() {
    const modalHTML = `
      <div class="notification-settings-modal" id="notificationSettingsModal">
        <div class="settings-content">
          <div class="settings-header">
            <h2>🔔 Notification Settings</h2>
            <button class="settings-close" id="closeSettings">×</button>
          </div>

          <div class="settings-body">
            <!-- Permission Status -->
            <div class="permission-status" id="permissionStatus">
              <div class="status-icon" id="statusIcon">🔔</div>
              <div class="status-content">
                <p class="status-title" id="statusTitle">Notifications Disabled</p>
                <p class="status-description" id="statusDescription">
                  Enable notifications to get 3 daily reminders for your Most Important Tasks
                </p>
              </div>
              <button class="enable-btn" id="enableBtn" style="display: none;">
                Enable
              </button>
            </div>

            <!-- Main Toggle -->
            <div class="settings-section">
              <div class="setting-item">
                <div class="setting-label">
                  <p class="setting-title">Daily MIT Reminders</p>
                  <p class="setting-description">Get 3 daily notifications to stay on track</p>
                </div>
                <label class="toggle-switch">
                  <input type="checkbox" id="toggleEnabled">
                  <span class="toggle-slider"></span>
                </label>
              </div>
            </div>

            <!-- Schedule Settings -->
            <div class="settings-section" id="scheduleSection">
              <h3 class="section-title">
                <i>⏰</i> Notification Schedule
              </h3>

              <div class="setting-item">
                <div class="time-input-group">
                  <label for="morningTime">🌅 Morning Reminder</label>
                  <input type="time" id="morningTime" class="time-input" value="08:00">
                </div>
              </div>

              <div class="setting-item">
                <div class="time-input-group">
                  <label for="afternoonTime">☀️ Afternoon Check-in</label>
                  <input type="time" id="afternoonTime" class="time-input" value="14:00">
                </div>
              </div>

              <div class="setting-item">
                <div class="time-input-group">
                  <label for="eveningTime">🌙 Evening Review</label>
                  <input type="time" id="eveningTime" class="time-input" value="20:00">
                </div>
              </div>
            </div>

            <!-- Sound & Vibration -->
            <div class="settings-section" id="preferencesSection">
              <h3 class="section-title">
                <i>🎵</i> Preferences
              </h3>

              <div class="setting-item">
                <div class="setting-label">
                  <p class="setting-title">Notification Sound</p>
                  <p class="setting-description">Play sound when notification appears</p>
                </div>
                <label class="toggle-switch">
                  <input type="checkbox" id="toggleSound">
                  <span class="toggle-slider"></span>
                </label>
              </div>

              <div class="setting-item">
                <div class="setting-label">
                  <p class="setting-title">Vibration</p>
                  <p class="setting-description">Vibrate device on notification (mobile only)</p>
                </div>
                <label class="toggle-switch">
                  <input type="checkbox" id="toggleVibration">
                  <span class="toggle-slider"></span>
                </label>
              </div>
            </div>

            <!-- Test Notifications -->
            <div class="test-section">
              <h3>🧪 Test Notifications</h3>
              <div class="test-buttons">
                <button class="test-btn" id="testMorning">
                  <span>🌅</span> Morning
                </button>
                <button class="test-btn" id="testAfternoon">
                  <span>☀️</span> Afternoon
                </button>
                <button class="test-btn" id="testEvening">
                  <span>🌙</span> Evening
                </button>
              </div>
            </div>

            <!-- Info Box -->
            <div class="info-box">
              <i>💡</i>
              <p>
                <strong>How it works:</strong> You'll receive 3 daily reminders about your MITs.
                Morning shows your tasks, afternoon checks progress, and evening reviews your day.
              </p>
            </div>
          </div>

          <div class="settings-footer">
            <button class="footer-btn btn-cancel" id="cancelSettings">
              Cancel
            </button>
            <button class="footer-btn btn-save" id="saveSettings">
              <span>💾</span> Save Changes
            </button>
          </div>
        </div>
      </div>
    `;

    // Add to body
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    this.modal = document.getElementById('notificationSettingsModal');
  },

  // Attach event listeners
  attachEventListeners() {
    // Close buttons
    document.getElementById('closeSettings').addEventListener('click', () => this.close());
    document.getElementById('cancelSettings').addEventListener('click', () => this.close());
    
    // Click outside to close
    this.modal.addEventListener('click', (e) => {
      if (e.target === this.modal) {
        this.close();
      }
    });

    // Enable button (request permission)
    document.getElementById('enableBtn').addEventListener('click', async () => {
      await this.requestPermission();
    });

    // Main toggle
    document.getElementById('toggleEnabled').addEventListener('change', (e) => {
      this.settings.enabled = e.target.checked;
      this.updateScheduleVisibility();
    });

    // Time inputs
    document.getElementById('morningTime').addEventListener('change', (e) => {
      this.settings.morningTime = e.target.value;
    });
    document.getElementById('afternoonTime').addEventListener('change', (e) => {
      this.settings.afternoonTime = e.target.value;
    });
    document.getElementById('eveningTime').addEventListener('change', (e) => {
      this.settings.eveningTime = e.target.value;
    });

    // Sound & Vibration toggles
    document.getElementById('toggleSound').addEventListener('change', (e) => {
      this.settings.soundEnabled = e.target.checked;
    });
    document.getElementById('toggleVibration').addEventListener('change', (e) => {
      this.settings.vibrationEnabled = e.target.checked;
    });

    // Test buttons
    document.getElementById('testMorning').addEventListener('click', () => this.testNotification('morning'));
    document.getElementById('testAfternoon').addEventListener('click', () => this.testNotification('afternoon'));
    document.getElementById('testEvening').addEventListener('click', () => this.testNotification('evening'));

    // Save button
    document.getElementById('saveSettings').addEventListener('click', () => {
      this.save();
    });

    // Listen for Notification permission changes
    if ('permissions' in navigator) {
      navigator.permissions.query({ name: 'notifications' }).then((permission) => {
        permission.addEventListener('change', () => {
          this.updatePermissionStatus();
        });
      }).catch(err => console.log('Permission query not supported:', err));
    }
  },

  // Request notification permission
  async requestPermission() {
    if (!('Notification' in window)) {
      alert('This browser does not support notifications');
      return;
    }

    try {
      const permission = await Notification.requestPermission();
      
      if (permission === 'granted') {
        this.settings.enabled = true;
        this.saveSettings();
        
        // Send welcome notification
        if (typeof MITNotifications !== 'undefined') {
          MITNotifications.showNotification(
            '🎉 Notifications Enabled!',
            'You\'ll now receive 3 daily reminders for your Most Important Tasks',
            { tag: 'welcome' }
          );
        }
      }
      
      this.updateUI();
    } catch (error) {
      console.error('Error requesting permission:', error);
      alert('Failed to request notification permission');
    }
  },

  // Update permission status display
  updatePermissionStatus() {
    const statusDiv = document.getElementById('permissionStatus');
    const statusIcon = document.getElementById('statusIcon');
    const statusTitle = document.getElementById('statusTitle');
    const statusDescription = document.getElementById('statusDescription');
    const enableBtn = document.getElementById('enableBtn');

    if (!('Notification' in window)) {
      statusDiv.className = 'permission-status denied';
      statusIcon.textContent = '❌';
      statusTitle.textContent = 'Not Supported';
      statusDescription.textContent = 'Your browser does not support notifications';
      enableBtn.style.display = 'none';
      return;
    }

    const permission = Notification.permission;

    if (permission === 'granted') {
      statusDiv.className = 'permission-status granted';
      statusIcon.textContent = '✅';
      statusTitle.textContent = 'Notifications Enabled';
      statusDescription.textContent = 'You\'ll receive daily reminders for your MITs';
      enableBtn.style.display = 'none';
    } else if (permission === 'denied') {
      statusDiv.className = 'permission-status denied';
      statusIcon.textContent = '🚫';
      statusTitle.textContent = 'Notifications Blocked';
      statusDescription.textContent = 'Please enable notifications in your browser settings';
      enableBtn.style.display = 'none';
    } else {
      statusDiv.className = 'permission-status default';
      statusIcon.textContent = '🔔';
      statusTitle.textContent = 'Notifications Disabled';
      statusDescription.textContent = 'Enable notifications to get daily MIT reminders';
      enableBtn.style.display = 'block';
    }
  },

  // Update schedule section visibility
  updateScheduleVisibility() {
    const scheduleSection = document.getElementById('scheduleSection');
    const preferencesSection = document.getElementById('preferencesSection');
    const enabled = this.settings.enabled && Notification.permission === 'granted';
    
    scheduleSection.style.opacity = enabled ? '1' : '0.5';
    scheduleSection.style.pointerEvents = enabled ? 'auto' : 'none';
    preferencesSection.style.opacity = enabled ? '1' : '0.5';
    preferencesSection.style.pointerEvents = enabled ? 'auto' : 'none';
  },

  // Update all UI elements with current settings
  updateUI() {
    this.updatePermissionStatus();

    // Update toggles
    document.getElementById('toggleEnabled').checked = this.settings.enabled;
    document.getElementById('toggleSound').checked = this.settings.soundEnabled;
    document.getElementById('toggleVibration').checked = this.settings.vibrationEnabled;

    // Update time inputs
    document.getElementById('morningTime').value = this.settings.morningTime;
    document.getElementById('afternoonTime').value = this.settings.afternoonTime;
    document.getElementById('eveningTime').value = this.settings.eveningTime;

    this.updateScheduleVisibility();
  },

  // Test notification
  testNotification(type) {
    if (Notification.permission !== 'granted') {
      alert('Please enable notifications first');
      return;
    }

    if (typeof MITNotifications !== 'undefined' && MITNotifications.testNotification) {
      MITNotifications.testNotification(type);
    } else {
      // Fallback if MITNotifications not loaded
      const titles = {
        morning: '🌅 Good Morning! Your MITs Await',
        afternoon: '☀️ Afternoon Check-In',
        evening: '🌙 Evening Review'
      };
      
      const bodies = {
        morning: 'Time to review your Most Important Tasks for today!',
        afternoon: 'How are you doing with your MITs?',
        evening: 'Let\'s review your day\'s progress!'
      };

      new Notification(titles[type], {
        body: bodies[type],
        icon: '/icon.png',
        badge: '/badge.png',
        tag: `test-${type}`
      });
    }
  },

  // Save settings
  save() {
    // Validate times
    if (!this.settings.morningTime || !this.settings.afternoonTime || !this.settings.eveningTime) {
      alert('Please set all notification times');
      return;
    }

    // Check if enabled but permission not granted
    if (this.settings.enabled && Notification.permission !== 'granted') {
      alert('Please enable browser notifications first');
      return;
    }

    this.saveSettings();

    // Show success message
    this.showSuccessMessage();

    // Close modal after short delay
    setTimeout(() => {
      this.close();
    }, 1500);
  },

  // Show success message
  showSuccessMessage() {
    const saveBtn = document.getElementById('saveSettings');
    const originalHTML = saveBtn.innerHTML;
    
    saveBtn.innerHTML = '<span>✅</span> Saved!';
    saveBtn.style.background = 'linear-gradient(135deg, #48bb78 0%, #38a169 100%)';
    
    setTimeout(() => {
      saveBtn.innerHTML = originalHTML;
    }, 2000);
  },

  // Open modal
  open() {
    this.loadSettings();
    this.updateUI();
    this.modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  },

  // Close modal
  close() {
    this.modal.classList.remove('active');
    document.body.style.overflow = '';
  }
};

// Notification Bell Component
const NotificationBell = {
  // Add bell icon to header
  addToHeader(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    const permission = Notification.permission;
    const bellClass = permission === 'granted' ? 'active' : 
                     permission === 'denied' ? 'disabled' : '';

    const bellHTML = `
      <div class="notification-bell ${bellClass}" id="notificationBell">
        <span class="bell-icon">🔔</span>
        ${permission === 'granted' ? '<span class="notification-badge"></span>' : ''}
      </div>
    `;

    container.insertAdjacentHTML('beforeend', bellHTML);

    // Add click handler
    document.getElementById('notificationBell').addEventListener('click', () => {
      NotificationSettingsUI.open();
    });
  },

  // Update bell status
  updateStatus() {
    const bell = document.getElementById('notificationBell');
    if (!bell) return;

    const permission = Notification.permission;
    bell.className = 'notification-bell ' + 
      (permission === 'granted' ? 'active' : 
       permission === 'denied' ? 'disabled' : '');

    // Update badge
    const existingBadge = bell.querySelector('.notification-badge');
    if (permission === 'granted' && !existingBadge) {
      bell.insertAdjacentHTML('beforeend', '<span class="notification-badge"></span>');
    } else if (permission !== 'granted' && existingBadge) {
      existingBadge.remove();
    }
  }
};

// Auto-initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    NotificationSettingsUI.init();
  });
} else {
  NotificationSettingsUI.init();
}

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { NotificationSettingsUI, NotificationBell };
}
