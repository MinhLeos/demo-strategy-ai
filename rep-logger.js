// REP LOGGER JAVASCRIPT - Mobile-First Logic

let activities = JSON.parse(localStorage.getItem('repActivities')) || [];
let selectedDuration = null;
let isListening = false;

// Initialize
document.addEventListener('DOMContentLoaded', () => {
  initializeREPLogger();
  loadTodayActivities();
  detectLocation();
});

function initializeREPLogger() {
  // Quick action buttons
  document.querySelectorAll('.quick-action-btn').forEach(btn => {
    btn.addEventListener('click', () => handleQuickAction(btn.dataset.type));
  });

  // Voice input
  const micBtn = document.getElementById('repMicBtn');
  micBtn.addEventListener('click', toggleVoiceInput);

  // Manual entry expand/collapse
  const expandBtn = document.getElementById('expandBtn');
  const manualEntry = document.getElementById('manualEntry');
  expandBtn.addEventListener('click', () => {
    manualEntry.classList.toggle('collapsed');
  });

  // Duration buttons
  document.querySelectorAll('.duration-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      selectDuration(btn);
    });
  });

  // GPS button
  const gpsBtn = document.getElementById('gpsBtn');
  gpsBtn.addEventListener('click', (e) => {
    e.preventDefault();
    detectLocation();
  });

  // Form submission
  const form = document.getElementById('repForm');
  form.addEventListener('submit', handleFormSubmit);
}

// Quick Action Handler
function handleQuickAction(type) {
  const typeNames = {
    property: 'Property Visit',
    call: 'Phone Call',
    showing: 'Property Showing',
    meeting: 'Client Meeting'
  };

  const activity = {
    id: Date.now(),
    type: type,
    typeName: typeNames[type],
    duration: 1, // Default 1 hour
    timestamp: new Date().toISOString(),
    location: document.getElementById('currentLocation').textContent,
    notes: '',
    method: 'quick-action'
  };

  saveActivity(activity);
  showNotification(`${typeNames[type]} logged successfully!`, 'success');
}

// Voice Input Handler
function toggleVoiceInput() {
  const micBtn = document.getElementById('repMicBtn');
  const voiceStatus = document.getElementById('voiceStatus');

  if (!isListening) {
    // Start listening
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      
      recognition.lang = 'en-US';
      recognition.continuous = false;
      recognition.interimResults = false;

      recognition.onstart = () => {
        isListening = true;
        micBtn.classList.add('listening');
        voiceStatus.querySelector('.status-text').textContent = 'Listening...';
      };

      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        processVoiceInput(transcript);
      };

      recognition.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        showNotification('Voice input error. Please try again.', 'error');
        resetVoiceInput();
      };

      recognition.onend = () => {
        resetVoiceInput();
      };

      recognition.start();
    } else {
      showNotification('Voice input not supported in this browser', 'error');
    }
  } else {
    // Stop listening
    resetVoiceInput();
  }
}

function resetVoiceInput() {
  isListening = false;
  const micBtn = document.getElementById('repMicBtn');
  const voiceStatus = document.getElementById('voiceStatus');
  micBtn.classList.remove('listening');
  voiceStatus.querySelector('.status-text').textContent = 'Ready to listen';
}

function processVoiceInput(transcript) {
  console.log('Voice input:', transcript);
  
  // Simple parsing logic - can be enhanced with NLP
  const lowerTranscript = transcript.toLowerCase();
  let activityType = 'meeting'; // default
  let duration = 1; // default
  
  // Detect activity type
  if (lowerTranscript.includes('property') || lowerTranscript.includes('visit')) {
    activityType = 'property';
  } else if (lowerTranscript.includes('call') || lowerTranscript.includes('phone')) {
    activityType = 'call';
  } else if (lowerTranscript.includes('showing')) {
    activityType = 'showing';
  } else if (lowerTranscript.includes('meeting')) {
    activityType = 'meeting';
  }
  
  // Detect duration
  const hourMatch = lowerTranscript.match(/(\d+(\.\d+)?)\s*(hour|hr)/);
  const minuteMatch = lowerTranscript.match(/(\d+)\s*(minute|min)/);
  
  if (hourMatch) {
    duration = parseFloat(hourMatch[1]);
  } else if (minuteMatch) {
    duration = parseInt(minuteMatch[1]) / 60;
  }

  const typeNames = {
    property: 'Property Visit',
    call: 'Phone Call',
    showing: 'Property Showing',
    meeting: 'Client Meeting'
  };

  const parsedActivity = {
    id: Date.now(),
    type: activityType,
    typeName: typeNames[activityType],
    duration: duration,
    timestamp: new Date().toISOString(),
    location: document.getElementById('currentLocation').textContent,
    notes: transcript,
    method: 'voice'
  };

  // Show confirmation dialog before saving
  showVoiceConfirmation(parsedActivity);
}

// Voice Confirmation Dialog
function showVoiceConfirmation(activity) {
  const confirmationHTML = `
    <div class="voice-confirmation-overlay" id="voiceConfirmationOverlay">
      <div class="voice-confirmation-card">
        <div class="confirmation-header">
          <i class="fas fa-check-circle"></i>
          <h3>Confirm Activity</h3>
        </div>
        
        <div class="confirmation-body">
          <p class="confirmation-intro">I heard:</p>
          
          <div class="parsed-details">
            <div class="detail-row">
              <span class="detail-label">Activity:</span>
              <span class="detail-value">${activity.typeName}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Duration:</span>
              <span class="detail-value">${activity.duration} hour${activity.duration !== 1 ? 's' : ''}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Location:</span>
              <span class="detail-value">${activity.location}</span>
            </div>
            ${activity.notes ? `
            <div class="detail-row">
              <span class="detail-label">Notes:</span>
              <span class="detail-value">"${activity.notes}"</span>
            </div>
            ` : ''}
          </div>
          
          <p class="confirmation-question">Is this correct?</p>
        </div>
        
        <div class="confirmation-actions">
          <button class="btn-secondary" onclick="cancelVoiceActivity()">
            <i class="fas fa-times"></i> Try Again
          </button>
          <button class="btn-primary" onclick="confirmVoiceActivity(${JSON.stringify(activity).replace(/"/g, '&quot;')})">
            <i class="fas fa-check"></i> Yes, Log It
          </button>
        </div>
      </div>
    </div>
  `;
  
  document.body.insertAdjacentHTML('beforeend', confirmationHTML);
}

// Confirm and save activity
function confirmVoiceActivity(activity) {
  saveActivity(activity);
  showNotification(`${activity.typeName} logged successfully!`, 'success');
  closeVoiceConfirmation();
  resetVoiceInput();
}

// Cancel and try again
function cancelVoiceActivity() {
  closeVoiceConfirmation();
  showNotification('Try saying it again', 'info');
  // Auto-restart voice input
  setTimeout(() => {
    const micBtn = document.getElementById('micBtn');
    if (micBtn && !micBtn.classList.contains('listening')) {
      toggleVoiceInput();
    }
  }, 500);
}

// Close confirmation dialog
function closeVoiceConfirmation() {
  const overlay = document.getElementById('voiceConfirmationOverlay');
  if (overlay) {
    overlay.remove();
  }
}

// Duration Selection
function selectDuration(btn) {
  document.querySelectorAll('.duration-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  selectedDuration = parseFloat(btn.dataset.value);
  document.getElementById('customDuration').value = '';
}

// Location Detection
function detectLocation() {
  const locationInput = document.getElementById('location');
  const currentLocation = document.getElementById('currentLocation');
  
  if ('geolocation' in navigator) {
    locationInput.placeholder = 'Detecting...';
    currentLocation.textContent = 'Detecting location...';
    
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;
        
        // Use reverse geocoding (simplified - in production use Google Maps API)
        const locationStr = `${lat.toFixed(4)}, ${lon.toFixed(4)}`;
        locationInput.value = locationStr;
        currentLocation.textContent = locationStr;
      },
      (error) => {
        console.error('Geolocation error:', error);
        locationInput.placeholder = 'Enter manually...';
        currentLocation.textContent = 'Location unavailable';
      }
    );
  } else {
    locationInput.placeholder = 'Not supported';
    currentLocation.textContent = 'Location not available';
  }
}

// Form Submission
function handleFormSubmit(e) {
  e.preventDefault();
  
  const form = e.target;
  const activityType = form.querySelector('#activityType').value;
  const customDuration = form.querySelector('#customDuration').value;
  const location = form.querySelector('#location').value;
  const notes = form.querySelector('#notes').value;

  if (!activityType) {
    showNotification('Please select an activity type', 'error');
    return;
  }

  const duration = customDuration ? parseFloat(customDuration) : selectedDuration || 1;

  const typeNames = {
    property: 'Property Visit',
    call: 'Phone Call',
    showing: 'Property Showing',
    meeting: 'Client Meeting',
    paperwork: 'Paperwork',
    marketing: 'Marketing Activity'
  };

  const activity = {
    id: Date.now(),
    type: activityType,
    typeName: typeNames[activityType] || activityType,
    duration: duration,
    timestamp: new Date().toISOString(),
    location: location || document.getElementById('currentLocation').textContent,
    notes: notes,
    method: 'manual'
  };

  saveActivity(activity);
  showNotification(`${activity.typeName} logged successfully!`, 'success');
  
  // Reset form
  form.reset();
  selectedDuration = null;
  document.querySelectorAll('.duration-btn').forEach(b => b.classList.remove('active'));
  document.getElementById('manualEntry').classList.add('collapsed');
}

// Save Activity
function saveActivity(activity) {
  activities.unshift(activity);
  localStorage.setItem('repActivities', JSON.stringify(activities));
  loadTodayActivities();
  updateTodayHours();
}

// Load Today's Activities
function loadTodayActivities() {
  const activityList = document.getElementById('activityList');
  const emptyState = document.getElementById('emptyState');
  
  const today = new Date().toDateString();
  const todayActivities = activities.filter(activity => {
    const activityDate = new Date(activity.timestamp).toDateString();
    return activityDate === today;
  });

  if (todayActivities.length === 0) {
    emptyState.style.display = 'block';
    activityList.innerHTML = '';
    activityList.appendChild(emptyState);
    return;
  }

  emptyState.style.display = 'none';
  activityList.innerHTML = '';

  todayActivities.forEach(activity => {
    const activityItem = createActivityItem(activity);
    activityList.appendChild(activityItem);
  });
}

// Create Activity Item
function createActivityItem(activity) {
  const item = document.createElement('div');
  item.className = 'activity-item';
  
  const icons = {
    property: 'fa-home',
    call: 'fa-phone',
    showing: 'fa-key',
    meeting: 'fa-users',
    paperwork: 'fa-file-alt',
    marketing: 'fa-bullhorn'
  };

  const time = new Date(activity.timestamp);
  const timeStr = time.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

  item.innerHTML = `
    <div class="activity-icon">
      <i class="fas ${icons[activity.type] || 'fa-clock'}"></i>
    </div>
    <div class="activity-content">
      <div class="activity-header">
        <span class="activity-type">${activity.typeName}</span>
        <span class="activity-time">${timeStr}</span>
      </div>
      <div class="activity-duration">${activity.duration}h REP</div>
      ${activity.location ? `<div class="activity-location"><i class="fas fa-map-marker-alt"></i>${activity.location}</div>` : ''}
      ${activity.notes ? `<div class="activity-notes">${activity.notes}</div>` : ''}
    </div>
  `;

  return item;
}

// Update Today Hours
function updateTodayHours() {
  const today = new Date().toDateString();
  const todayActivities = activities.filter(activity => {
    const activityDate = new Date(activity.timestamp).toDateString();
    return activityDate === today;
  });

  const totalHours = todayActivities.reduce((sum, activity) => sum + activity.duration, 0);
  const hoursText = `${totalHours.toFixed(1)}h`;
  
  // Update mobile stats
  const mobileStats = document.getElementById('todayHours');
  if (mobileStats) {
    mobileStats.textContent = hoursText;
  }
  
  // Update desktop stats
  const desktopStats = document.getElementById('todayHoursDesktop');
  if (desktopStats) {
    desktopStats.textContent = hoursText;
  }
}

// Show Notification
function showNotification(message, type = 'success') {
  // Create notification element
  const notification = document.createElement('div');
  notification.className = `notification notification-${type}`;
  notification.textContent = message;
  notification.style.cssText = `
    position: fixed;
    top: 80px;
    left: 50%;
    transform: translateX(-50%);
    background: ${type === 'success' ? '#10b981' : '#ef4444'};
    color: white;
    padding: 12px 24px;
    border-radius: 8px;
    font-size: 14px;
    font-weight: 600;
    z-index: 1000;
    animation: slideDown 0.3s ease;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  `;

  document.body.appendChild(notification);

  setTimeout(() => {
    notification.style.animation = 'slideUp 0.3s ease';
    setTimeout(() => notification.remove(), 300);
  }, 3000);
}

// Animations
const style = document.createElement('style');
style.textContent = `
  @keyframes slideDown {
    from {
      transform: translateX(-50%) translateY(-20px);
      opacity: 0;
    }
    to {
      transform: translateX(-50%) translateY(0);
      opacity: 1;
    }
  }
  @keyframes slideUp {
    from {
      transform: translateX(-50%) translateY(0);
      opacity: 1;
    }
    to {
      transform: translateX(-50%) translateY(-20px);
      opacity: 0;
    }
  }
`;
document.head.appendChild(style);
