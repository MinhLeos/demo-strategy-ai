// MIT NOTIFICATION SYSTEM - Push Notifications for Most Important Tasks
// Mobile-Optimized with Service Worker Support

const MITNotifications = {
  // State Management
  isSupported: false,
  isGranted: false,
  settings: {
    enabled: true,
    morningTime: '08:00',
    afternoonTime: '14:00',
    eveningTime: '20:00',
    soundEnabled: true,
    vibrationEnabled: true
  },
  
  scheduledNotifications: [],

  // Initialize
  async init() {
    // Check browser support
    this.isSupported = 'Notification' in window && 'serviceWorker' in navigator;
    
    if (!this.isSupported) {
      console.warn('Push notifications not supported in this browser');
      return false;
    }

    // Load settings from localStorage
    this.loadSettings();

    // Check current permission
    this.isGranted = Notification.permission === 'granted';

    // Register service worker
    if ('serviceWorker' in navigator) {
      try {
        const registration = await navigator.serviceWorker.register('/sw.js');
        console.log('Service Worker registered:', registration);
      } catch (error) {
        console.warn('Service Worker registration failed:', error);
      }
    }

    // Setup scheduled notifications if enabled
    if (this.isGranted && this.settings.enabled) {
      this.setupDailySchedule();
    }

    return true;
  },

  // Request Permission
  async requestPermission() {
    if (!this.isSupported) {
      return {
        success: false,
        message: 'Notifications are not supported in your browser'
      };
    }

    if (Notification.permission === 'granted') {
      this.isGranted = true;
      return {
        success: true,
        message: 'Notifications already enabled'
      };
    }

    if (Notification.permission === 'denied') {
      return {
        success: false,
        message: 'Notifications blocked. Please enable in browser settings.'
      };
    }

    try {
      const permission = await Notification.requestPermission();
      
      if (permission === 'granted') {
        this.isGranted = true;
        this.setupDailySchedule();
        
        // Show welcome notification
        this.showNotification(
          'MIT Notifications Enabled! 🎉',
          'You\'ll receive 3 daily reminders to help you stay on track with your Most Important Tasks.',
          { tag: 'welcome', requireInteraction: false }
        );

        return {
          success: true,
          message: 'Notifications enabled successfully!'
        };
      } else {
        return {
          success: false,
          message: 'Notification permission denied'
        };
      }
    } catch (error) {
      console.error('Error requesting notification permission:', error);
      return {
        success: false,
        message: 'Error requesting permissions'
      };
    }
  },

  // Show Notification
  showNotification(title, body, options = {}) {
    if (!this.isGranted) {
      console.warn('Notification permission not granted');
      return;
    }

    const defaultOptions = {
      body: body,
      icon: '/icon-192.png',
      badge: '/badge-72.png',
      vibrate: this.settings.vibrationEnabled ? [200, 100, 200] : undefined,
      requireInteraction: true,
      actions: options.actions || [],
      data: options.data || {},
      tag: options.tag || 'mit-notification'
    };

    const finalOptions = { ...defaultOptions, ...options };

    // Use Service Worker notification if available
    if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
      navigator.serviceWorker.ready.then(registration => {
        registration.showNotification(title, finalOptions);
      });
    } else {
      // Fallback to regular notification
      new Notification(title, finalOptions);
    }

    // Play sound if enabled
    if (this.settings.soundEnabled && options.tag !== 'welcome') {
      this.playNotificationSound();
    }
  },

  // Morning Notification (8:00 AM)
  sendMorningNotification() {
    const mits = this.getTodayMITs();
    
    let body = 'Start your day strong! ☀️';
    const actions = [];

    if (mits.length > 0) {
      body = `You have ${mits.length} MIT${mits.length > 1 ? 's' : ''} for today:\n`;
      body += mits.slice(0, 3).map((mit, i) => `${i + 1}. ${mit.text}`).join('\n');
      
      actions.push(
        { action: 'view', title: '👀 View MITs', icon: '/icons/view.png' },
        { action: 'dismiss', title: 'Dismiss', icon: '/icons/close.png' }
      );
    } else {
      body = 'No MITs scheduled for today. Plan your day now!';
      
      actions.push(
        { action: 'plan', title: '📝 Plan Today', icon: '/icons/add.png' },
        { action: 'dismiss', title: 'Dismiss', icon: '/icons/close.png' }
      );
    }

    this.showNotification(
      '🌅 Good Morning! Your MITs Await',
      body,
      {
        tag: 'morning-reminder',
        actions: actions,
        data: { type: 'morning', mits: mits }
      }
    );
  },

  // Afternoon Check-in (2:00 PM)
  sendAfternoonNotification() {
    const mits = this.getTodayMITs();
    const completed = mits.filter(m => m.status === 'completed').length;
    const total = mits.length;

    let body = '';
    let icon = '⏰';

    if (total === 0) {
      body = 'No MITs for today. Still time to add and complete one!';
      icon = '💡';
    } else if (completed === 0) {
      body = `You haven't completed any MITs yet. Let's get started! (0/${total})`;
      icon = '💪';
    } else if (completed === total) {
      body = `Amazing! All ${total} MITs completed! You're crushing it! 🎉`;
      icon = '🎉';
    } else {
      const percentage = Math.round((completed / total) * 100);
      body = `Progress check: ${completed}/${total} MITs completed (${percentage}%). Keep going!`;
      icon = '📊';
    }

    this.showNotification(
      `${icon} Midday Check-In`,
      body,
      {
        tag: 'afternoon-checkin',
        actions: [
          { action: 'view', title: '👀 View MITs', icon: '/icons/view.png' },
          { action: 'complete', title: '✅ Mark Complete', icon: '/icons/check.png' },
          { action: 'dismiss', title: 'Dismiss', icon: '/icons/close.png' }
        ],
        data: { type: 'afternoon', completed, total }
      }
    );
  },

  // Evening Review (8:00 PM)
  sendEveningNotification() {
    const mits = this.getTodayMITs();
    const completed = mits.filter(m => m.status === 'completed').length;
    const total = mits.length;

    let body = '';
    let title = '';

    if (total === 0) {
      title = '🌙 Evening Reflection';
      body = 'No MITs today. Plan ahead for tomorrow!';
    } else if (completed === total) {
      title = '🎉 Perfect Day!';
      body = `You completed all ${total} MITs! Celebrate your wins and rest well.`;
    } else if (completed >= total * 0.7) {
      title = '⭐ Great Work!';
      body = `You completed ${completed}/${total} MITs (${Math.round(completed/total*100)}%). Solid progress!`;
    } else if (completed > 0) {
      title = '💪 Keep Building';
      body = `You completed ${completed}/${total} MITs. Every step counts. Plan tomorrow now?`;
    } else {
      title = '🌙 End of Day';
      body = `MITs incomplete today. Tomorrow is a fresh start. Plan it now?`;
    }

    this.showNotification(
      title,
      body,
      {
        tag: 'evening-review',
        actions: [
          { action: 'review', title: '📝 Review Day', icon: '/icons/review.png' },
          { action: 'plan', title: '🗓️ Plan Tomorrow', icon: '/icons/calendar.png' },
          { action: 'dismiss', title: 'Dismiss', icon: '/icons/close.png' }
        ],
        data: { type: 'evening', completed, total }
      }
    );
  },

  // Setup Daily Schedule
  setupDailySchedule() {
    // Clear existing schedules
    this.scheduledNotifications.forEach(id => clearTimeout(id));
    this.scheduledNotifications = [];

    if (!this.settings.enabled || !this.isGranted) {
      return;
    }

    // Schedule morning notification
    const morningTimeout = this.scheduleNotification(
      this.settings.morningTime,
      () => this.sendMorningNotification()
    );
    if (morningTimeout) this.scheduledNotifications.push(morningTimeout);

    // Schedule afternoon notification
    const afternoonTimeout = this.scheduleNotification(
      this.settings.afternoonTime,
      () => this.sendAfternoonNotification()
    );
    if (afternoonTimeout) this.scheduledNotifications.push(afternoonTimeout);

    // Schedule evening notification
    const eveningTimeout = this.scheduleNotification(
      this.settings.eveningTime,
      () => this.sendEveningNotification()
    );
    if (eveningTimeout) this.scheduledNotifications.push(eveningTimeout);

    console.log('Daily MIT notifications scheduled');
  },

  // Schedule a notification at specific time
  scheduleNotification(timeString, callback) {
    const [hours, minutes] = timeString.split(':').map(Number);
    
    const now = new Date();
    const scheduled = new Date();
    scheduled.setHours(hours, minutes, 0, 0);

    // If time has passed today, schedule for tomorrow
    if (scheduled <= now) {
      scheduled.setDate(scheduled.getDate() + 1);
    }

    const delay = scheduled - now;

    const timeoutId = setTimeout(() => {
      callback();
      
      // Reschedule for next day
      setTimeout(() => {
        this.setupDailySchedule();
      }, 1000);
    }, delay);

    return timeoutId;
  },

  // Get Today's MITs
  getTodayMITs() {
    try {
      // Try to get from home.html's task list first (if on that page)
      const dailyTasksContainer = document.getElementById('dailyTasks');
      if (dailyTasksContainer) {
        const taskElements = dailyTasksContainer.querySelectorAll('.task-item');
        const mits = Array.from(taskElements).map((taskEl, index) => {
          const checkbox = taskEl.querySelector('input[type="checkbox"]');
          const label = taskEl.querySelector('label');
          
          return {
            id: index + 1,
            text: label ? label.textContent.trim() : `Task ${index + 1}`,
            completed: checkbox ? checkbox.checked : false
          };
        });
        
        if (mits.length > 0) {
          // Cache for future use
          localStorage.setItem('dailyMITs', JSON.stringify(mits));
          return mits;
        }
      }
      
      // Fallback: try localStorage
      const savedMITs = localStorage.getItem('dailyMITs');
      if (savedMITs) {
        const mits = JSON.parse(savedMITs);
        return Array.isArray(mits) ? mits : [];
      }
      
      // Final fallback: empty array
      return [];
    } catch (error) {
      console.error('Error getting MITs:', error);
      return [];
    }
  },

  // Update Settings
  updateSettings(newSettings) {
    this.settings = { ...this.settings, ...newSettings };
    this.saveSettings();

    // Restart schedule if enabled changed
    if (newSettings.enabled !== undefined) {
      if (newSettings.enabled) {
        this.setupDailySchedule();
      } else {
        this.scheduledNotifications.forEach(id => clearTimeout(id));
        this.scheduledNotifications = [];
      }
    }

    // Restart schedule if times changed
    if (newSettings.morningTime || newSettings.afternoonTime || newSettings.eveningTime) {
      this.setupDailySchedule();
    }
  },

  // Save Settings
  saveSettings() {
    localStorage.setItem('mitNotificationSettings', JSON.stringify(this.settings));
  },

  // Load Settings
  loadSettings() {
    const saved = localStorage.getItem('mitNotificationSettings');
    if (saved) {
      try {
        this.settings = { ...this.settings, ...JSON.parse(saved) };
      } catch (error) {
        console.error('Error loading notification settings:', error);
      }
    }
  },

  // Play Notification Sound
  playNotificationSound() {
    try {
      const audio = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSttwvLaizsIFWGx5t+lUxELTKXh8bllHAU2jdXvyXgiCCJ0w/LaiDcIF2Ow5+OmVBEKS6Pg8bllHAU3jtXvyXgiCCF0w/LaiDcIF2Ow5+OmVBEKS6Pg8bllHAU3jtXvyXgi');
      audio.volume = 0.3;
      audio.play().catch(e => console.warn('Could not play sound:', e));
    } catch (error) {
      console.warn('Error playing notification sound:', error);
    }
  },

  // Test Notifications
  testNotification(type = 'morning') {
    switch(type) {
      case 'morning':
        this.sendMorningNotification();
        break;
      case 'afternoon':
        this.sendAfternoonNotification();
        break;
      case 'evening':
        this.sendEveningNotification();
        break;
      default:
        this.showNotification(
          'Test Notification',
          'This is a test notification from MIT system.',
          { tag: 'test' }
        );
    }
  },

  // Disable Notifications
  disable() {
    this.settings.enabled = false;
    this.saveSettings();
    this.scheduledNotifications.forEach(id => clearTimeout(id));
    this.scheduledNotifications = [];
  },

  // Enable Notifications
  async enable() {
    if (!this.isGranted) {
      const result = await this.requestPermission();
      if (!result.success) {
        return result;
      }
    }

    this.settings.enabled = true;
    this.saveSettings();
    this.setupDailySchedule();

    return {
      success: true,
      message: 'Notifications enabled'
    };
  },

  // Get Status
  getStatus() {
    return {
      supported: this.isSupported,
      granted: this.isGranted,
      enabled: this.settings.enabled,
      permission: Notification.permission,
      settings: this.settings,
      scheduledCount: this.scheduledNotifications.length
    };
  }
};

// Handle notification clicks (via Service Worker)
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.addEventListener('message', (event) => {
    if (event.data.type === 'notification-click') {
      const action = event.data.action;
      const notifData = event.data.data;

      // Handle different actions
      switch(action) {
        case 'view':
          window.location.href = '/home.html';
          break;
        case 'plan':
          window.location.href = '/home.html#plan-mits';
          break;
        case 'complete':
          window.location.href = '/home.html#complete-mit';
          break;
        case 'review':
          window.location.href = '/home.html#review';
          break;
        default:
          // Default action - open home
          window.location.href = '/home.html';
      }
    }
  });
}

// Auto-initialize if on home page
if (window.location.pathname.includes('home.html') || window.location.pathname === '/') {
  document.addEventListener('DOMContentLoaded', () => {
    MITNotifications.init();
  });
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = MITNotifications;
}
