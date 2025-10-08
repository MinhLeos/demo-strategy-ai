document.addEventListener("DOMContentLoaded", () => {
  // Search functionality
  const searchInput = document.getElementById("searchInput");
  const brainDumpEntries = document.querySelectorAll(".brain-dump-entry");

  if (searchInput) {
    searchInput.addEventListener("input", (e) => {
      const searchTerm = e.target.value.toLowerCase();

      brainDumpEntries.forEach((entry) => {
        const content = entry.querySelector(".entry-content").textContent.toLowerCase();
        const tags = Array.from(entry.querySelectorAll(".tag"))
          .map((tag) => tag.textContent.toLowerCase())
          .join(" ");

        if (content.includes(searchTerm) || tags.includes(searchTerm)) {
          entry.style.display = "block";
        } else {
          entry.style.display = "none";
        }
      });

      updateEntryCount();
    });
  }

  // Filter dropdown functionality
  const filterBtn = document.getElementById("filterBtn");
  const filterMenu = document.getElementById("filterMenu");
  const filterOptions = document.querySelectorAll(".filter-option");

  if (filterBtn && filterMenu) {
    filterBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      filterMenu.classList.toggle("show");
      filterBtn.classList.toggle("active");
    });

    // Close filter menu when clicking outside
    document.addEventListener("click", () => {
      filterMenu.classList.remove("show");
      filterBtn.classList.remove("active");
    });

    filterOptions.forEach((option) => {
      option.addEventListener("click", (e) => {
        e.preventDefault();

        // Update active state
        filterOptions.forEach((opt) => opt.classList.remove("active"));
        option.classList.add("active");

        // Update button text
        const btnText = filterBtn.querySelector("span");
        btnText.textContent = option.textContent;

        // Filter entries
        const filterValue = option.dataset.filter;
        filterEntries(filterValue);

        // Close menu
        filterMenu.classList.remove("show");
        filterBtn.classList.remove("active");
      });
    });
  }

  function filterEntries(category) {
    brainDumpEntries.forEach((entry) => {
      if (category === "all" || entry.dataset.category === category) {
        entry.style.display = "block";
      } else {
        entry.style.display = "none";
      }
    });

    updateEntryCount();
  }

  function updateEntryCount() {
    const visibleEntries = document.querySelectorAll('.brain-dump-entry:not([style*="display: none"])');
    const countElement = document.querySelector(".entry-count");
    if (countElement) {
      const count = visibleEntries.length;
      countElement.textContent = `${count} ${count === 1 ? "entry" : "entries"}`;
    }
  }

  // Entry Actions
  document.querySelectorAll(".brain-dump-entry").forEach((entry) => {
    // Convert to Task
    const taskBtn = entry.querySelector('.action-icon[title="Convert to Task"]');
    if (taskBtn) {
      taskBtn.addEventListener("click", () => {
        const content =
          entry.querySelector(".entry-content p")?.textContent ||
          entry.querySelector(".structured-content h4")?.textContent;
        showNotification("Task Created", `"${content.substring(0, 50)}..." has been added to your tasks.`);
      });
    }

    // Edit Entry
    const editBtn = entry.querySelector('.action-icon[title="Edit"]');
    if (editBtn) {
      editBtn.addEventListener("click", () => {
        const content = entry.querySelector(".entry-content");
        const originalContent = content.innerHTML;

        // Create editable textarea
        const textarea = document.createElement("textarea");
        textarea.className = "edit-textarea";
        textarea.value = content.textContent.trim();
        textarea.style.width = "100%";
        textarea.style.minHeight = "100px";
        textarea.style.padding = "10px";
        textarea.style.border = "2px solid #00BCD4";
        textarea.style.borderRadius = "8px";
        textarea.style.fontSize = "1rem";
        textarea.style.fontFamily = "inherit";

        content.innerHTML = "";
        content.appendChild(textarea);
        textarea.focus();

        // Save on blur or Enter key
        const saveEdit = () => {
          const newContent = textarea.value.trim();
          if (newContent) {
            content.innerHTML = `<p>${newContent}</p>`;
            showNotification("Entry Updated", "Your brain dump has been updated successfully.");
          } else {
            content.innerHTML = originalContent;
          }
        };

        textarea.addEventListener("blur", saveEdit);
        textarea.addEventListener("keydown", (e) => {
          if (e.key === "Enter" && e.ctrlKey) {
            saveEdit();
          }
        });
      });
    }

    // Delete Entry
    const deleteBtn = entry.querySelector('.action-icon[title="Delete"]');
    if (deleteBtn) {
      deleteBtn.addEventListener("click", () => {
        if (confirm("Are you sure you want to delete this brain dump entry?")) {
          entry.style.animation = "fadeOut 0.3s ease";
          setTimeout(() => {
            entry.remove();
            updateEntryCount();
            showNotification("Entry Deleted", "Brain dump entry has been removed.");
          }, 300);
        }
      });
    }

    // Structure with AI button
    const structureBtn = entry.querySelector(".structure-ai-btn");
    if (structureBtn) {
      structureBtn.addEventListener("click", () => {
        const content = entry.querySelector(".entry-content p")?.textContent;
        if (content) {
          openTaskModal(content, 'create');
        } else {
          showNotification("Error", "No content found to structure.");
        }
      });
    }
  });

  function generateStructuredContent(text) {
    // Simulate AI structuring
    return `
            <div class="structured-content">
                <h4>Structured Tasks</h4>
                <ul class="structured-list">
                    <li><i class="fas fa-circle"></i> ${text.substring(0, 50)}...</li>
                    <li><i class="fas fa-circle"></i> Follow up on pending items</li>
                    <li><i class="fas fa-circle"></i> Review and finalize details</li>
                </ul>
            </div>
        `;
  }

  // Load More functionality
  const loadMoreBtn = document.querySelector(".load-more-btn");
  if (loadMoreBtn) {
    loadMoreBtn.addEventListener("click", () => {
      // Show loading state
      loadMoreBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Loading...';
      loadMoreBtn.disabled = true;

      // Simulate loading more entries
      setTimeout(() => {
        // Add more entries (you would fetch from API in real app)
        const list = document.querySelector(".brain-dump-list");
        const newEntry = createNewEntry();
        list.appendChild(newEntry);

        // Reset button
        loadMoreBtn.innerHTML = '<i class="fas fa-spinner"></i> Load More Entries';
        loadMoreBtn.disabled = false;

        updateEntryCount();
        showNotification("Loaded", "More entries have been loaded.");
      }, 1000);
    });
  }

  function createNewEntry() {
    const entry = document.createElement("div");
    entry.className = "brain-dump-entry";
    entry.dataset.category = "other";
    entry.innerHTML = `
            <div class="entry-header">
                <div class="entry-time">
                    <i class="fas fa-clock"></i>
                    <span>Dec 25, 2023</span>
                </div>
                <div class="entry-actions">
                    <button class="action-icon" title="Convert to Task">
                        <i class="fas fa-tasks"></i>
                    </button>
                    <button class="action-icon" title="Edit">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="action-icon" title="Delete">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
            <div class="entry-content">
                <p>New dynamically loaded content. This would come from your API in a real application.</p>
            </div>
            <div class="entry-footer">
                <div class="entry-tags">
                    <span class="tag tag-business">Business</span>
                </div>
                <button class="structure-ai-btn">
                    <i class="fas fa-robot"></i>
                    Structure with AI
                </button>
            </div>
        `;

    // Add fade in animation
    entry.style.animation = "fadeIn 0.5s ease";

    return entry;
  }

  // Floating Action Button & Modal (Reuse from dashboard)
  const fab = document.getElementById("fabButton");
  const modalOverlay = document.getElementById("modalOverlay");
  const modalClose = document.getElementById("modalClose");
  const micButton = document.getElementById("micButton");
  const brainDumpInput = document.getElementById("brainDumpInput");
  const structureBtn = document.getElementById("structureBtn");
  const voiceIndicator = document.getElementById("voiceIndicator");

  let isRecording = false;
  let recognition = null;

  // Initialize Speech Recognition
  if ("webkitSpeechRecognition" in window || "SpeechRecognition" in window) {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = "en-US";

    recognition.onstart = () => {
      isRecording = true;
      micButton.classList.add("recording");
      fab.classList.add("active");
      voiceIndicator.classList.add("show");
      showNotification("Recording Started", "Speak now...");
    };

    recognition.onend = () => {
      isRecording = false;
      micButton.classList.remove("recording");
      fab.classList.remove("active");
      voiceIndicator.classList.remove("show");
    };

    recognition.onresult = (event) => {
      let transcript = "";
      for (let i = event.resultIndex; i < event.results.length; i++) {
        if (event.results[i].isFinal) {
          transcript += event.results[i][0].transcript + " ";
        }
      }
      if (transcript) {
        brainDumpInput.value += transcript;
      }
    };

    recognition.onerror = (event) => {
      console.error("Speech recognition error:", event.error);
      showNotification("Error", "Speech recognition failed. Please try again.");
      stopRecording();
    };
  }

  // Open Modal
  if (fab) {
    fab.addEventListener("click", () => {
      openModal();
    });
  }

  // Close Modal
  if (modalClose) {
    modalClose.addEventListener("click", () => {
      closeModal();
    });
  }

  // Close modal when clicking outside
  if (modalOverlay) {
    modalOverlay.addEventListener("click", (e) => {
      if (e.target === modalOverlay) {
        closeModal();
      }
    });
  }

  // Mic Button Toggle
  if (micButton) {
    micButton.addEventListener("click", () => {
      if (recognition) {
        if (isRecording) {
          stopRecording();
        } else {
          startRecording();
        }
      } else {
        showNotification("Not Supported", "Speech recognition is not supported in your browser.");
      }
    });
  }

  // Structure with AI Button in Modal
  if (structureBtn) {
    structureBtn.addEventListener("click", () => {
      const text = brainDumpInput.value.trim();
      if (text) {
        // Switch to conversation view instead of directly creating task
        document.getElementById('initialInputView').style.display = 'none';
        document.getElementById('conversationView').style.display = 'flex';
        
        // Hide modal close button when in conversation
        if (modalClose) {
          modalClose.style.display = 'none';
        }
        
        initializeConversation(text);
      } else {
        showNotification("Empty Input", "Please enter or record some text first.");
      }
    });
  }

  // Functions
  function openModal() {
    modalOverlay.classList.add("show");
    document.body.style.overflow = "hidden";
    brainDumpInput.focus();
  }

  function closeModal() {
    modalOverlay.classList.remove("show");
    document.body.style.overflow = "";
    if (isRecording) {
      stopRecording();
    }
    
    // Reset to initial view and show close button
    document.getElementById('conversationView').style.display = 'none';
    document.getElementById('initialInputView').style.display = 'flex';
    if (modalClose) {
      modalClose.style.display = 'block';
    }
    
    // Clear input after closing
    setTimeout(() => {
      brainDumpInput.value = "";
    }, 300);
  }

  function startRecording() {
    if (recognition && !isRecording) {
      recognition.start();
    }
  }

  function stopRecording() {
    if (recognition && isRecording) {
      recognition.stop();
    }
  }

  function processWithAI(text) {
    // Create new entry at the top of the list first
    const list = document.querySelector(".brain-dump-list");
    const newEntry = createBrainDumpEntry(text);
    list.insertBefore(newEntry, list.firstChild);

    // Close modal first
    closeModal();

    // Update entry count
    updateEntryCount();

    // Show success message
    showNotification("Brain Dump Added", "Your thoughts have been captured and saved.");

    // Open task modal to create task from this content
    setTimeout(() => {
      openTaskModal(text, 'create');
    }, 500);
  }

  function createBrainDumpEntry(text) {
    const entry = document.createElement("div");
    entry.className = "brain-dump-entry";
    entry.dataset.category = "other";

    const now = new Date();
    const timeString = `Today, ${now.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    })}`;

    entry.innerHTML = `
            <div class="entry-header">
                <div class="entry-time">
                    <i class="fas fa-clock"></i>
                    <span>${timeString}</span>
                </div>
                <div class="entry-actions">
                    <button class="action-icon" title="Convert to Task">
                        <i class="fas fa-tasks"></i>
                    </button>
                    <button class="action-icon" title="Edit">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="action-icon" title="Delete">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
            <div class="entry-content">
                <p>${text}</p>
            </div>
            <div class="entry-footer">
                <div class="entry-tags">
                    <span class="tag tag-ideas">Ideas</span>
                </div>
                <button class="structure-ai-btn">
                    <i class="fas fa-robot"></i>
                    Structure with AI
                </button>
            </div>
        `;

    // Add fade in animation
    entry.style.animation = "fadeIn 0.5s ease";

    return entry;
  }

  function showNotification(title, message) {
    // Create notification element
    const notification = document.createElement("div");
    notification.className = "notification";
    notification.innerHTML = `
            <strong>${title}</strong>
            <p>${message}</p>
        `;

    // Add to body
    document.body.appendChild(notification);

    // Trigger animation
    setTimeout(() => {
      notification.classList.add("show");
    }, 100);

    // Remove after 3 seconds
    setTimeout(() => {
      notification.classList.remove("show");
      setTimeout(() => {
        document.body.removeChild(notification);
      }, 300);
    }, 3000);
  }

  // Keyboard shortcuts
  document.addEventListener("keydown", (e) => {
    // Escape to close modal
    if (e.key === "Escape" && modalOverlay.classList.contains("show")) {
      closeModal();
    }

    // Ctrl/Cmd + M to open modal
    if ((e.ctrlKey || e.metaKey) && e.key === "m") {
      e.preventDefault();
      openModal();
    }

    // Ctrl/Cmd + K to focus search
    if ((e.ctrlKey || e.metaKey) && e.key === "k") {
      e.preventDefault();
      searchInput?.focus();
    }
  });

  // --- Task Management Modal Functions ---
  
  // Task Management Variables
  const taskModalOverlay = document.getElementById("taskModalOverlay");
  const taskModalClose = document.getElementById("taskModalClose");
  const taskCancelBtn = document.getElementById("taskCancelBtn");
  const taskSaveBtn = document.getElementById("taskSaveBtn");
  const taskModalTitle = document.getElementById("taskModalTitle");
  const taskForm = document.getElementById("taskForm");
  
  let currentTaskMode = 'create'; // 'create' or 'edit'
  let currentTaskElement = null;

  // Task Modal Event Listeners
  if (taskModalClose) {
    taskModalClose.addEventListener("click", closeTaskModal);
  }
  
  if (taskCancelBtn) {
    taskCancelBtn.addEventListener("click", closeTaskModal);
  }
  
  if (taskSaveBtn) {
    taskSaveBtn.addEventListener("click", handleTaskSave);
  }
  
  if (taskModalOverlay) {
    taskModalOverlay.addEventListener("click", (e) => {
      if (e.target === taskModalOverlay) {
        closeTaskModal();
      }
    });
  }

  // Open Task Modal Function
  function openTaskModal(content = '', mode = 'create', taskElement = null) {
    currentTaskMode = mode;
    currentTaskElement = taskElement;
    
    // Set modal title
    taskModalTitle.textContent = mode === 'create' ? 'Create New Task' : 'Edit Task';
    
    // Pre-fill form if editing or from brain dump
    if (mode === 'create' && content) {
      document.getElementById("taskName").value = content.substring(0, 60) + (content.length > 60 ? '...' : '');
      document.getElementById("taskDescription").value = content;
      document.getElementById("taskPriority").value = "normal";
      document.getElementById("taskCategory").value = "daily";
      document.getElementById("taskDueDate").value = "";
    } else if (mode === 'edit' && taskElement) {
      // Extract task info from DOM element
      const taskText = taskElement.querySelector(".task-text").textContent.trim();
      const priority = taskElement.classList.contains("high-priority") ? "high" : 
                     taskElement.classList.contains("near-due") ? "urgent" : "normal";
      
      document.getElementById("taskName").value = taskText;
      document.getElementById("taskDescription").value = "";
      document.getElementById("taskPriority").value = priority;
      document.getElementById("taskCategory").value = "daily"; // Could be enhanced to detect current category
      document.getElementById("taskDueDate").value = "";
    }
    
    // Show modal
    taskModalOverlay.classList.add("show");
    document.body.style.overflow = "hidden";
    
    // Focus first input
    setTimeout(() => {
      document.getElementById("taskName").focus();
    }, 300);
  }

  // Close Task Modal Function
  function closeTaskModal() {
    taskModalOverlay.classList.remove("show");
    document.body.style.overflow = "";
    
    // Reset form
    taskForm.reset();
    currentTaskMode = 'create';
    currentTaskElement = null;
  }

  // Handle Task Save
  function handleTaskSave() {
    const formData = new FormData(taskForm);
    const taskData = {
      name: formData.get("taskName").trim(),
      description: formData.get("taskDescription").trim(),
      priority: formData.get("taskPriority"),
      category: formData.get("taskCategory"),
      dueDate: formData.get("taskDueDate")
    };
    
    // Validate required fields
    if (!taskData.name) {
      showNotification("Validation Error", "Task name is required.");
      return;
    }
    
    // Show loading state
    taskSaveBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Saving...';
    taskSaveBtn.disabled = true;
    
    // Simulate save delay
    setTimeout(() => {
      if (currentTaskMode === 'create') {
        createNewTask(taskData);
      } else if (currentTaskMode === 'edit') {
        updateExistingTask(taskData);
      }
      
      // Reset button
      taskSaveBtn.innerHTML = '<i class="fas fa-save"></i> Save Task';
      taskSaveBtn.disabled = false;
      
      // Close modal
      closeTaskModal();
    }, 1000);
  }

  // Create New Task Function
  function createNewTask(taskData) {
    showNotification("Task Created", `"${taskData.name}" has been added to your tasks.`);
    
    // Here you would typically add the task to your task management system
    // For now, we'll just show the notification
    console.log("New task created:", taskData);
    
    // You could also add it directly to the DOM if needed
    // addTaskToDOM(taskData);
  }

  // Update Existing Task Function
  function updateExistingTask(taskData) {
    if (currentTaskElement) {
      // Update task text
      const taskTextElement = currentTaskElement.querySelector(".task-text");
      taskTextElement.textContent = taskData.name;
      
      // Update priority classes
      currentTaskElement.classList.remove("high-priority", "near-due");
      if (taskData.priority === "high") {
        currentTaskElement.classList.add("high-priority");
      } else if (taskData.priority === "urgent") {
        currentTaskElement.classList.add("near-due");
      }
      
      showNotification("Task Updated", `"${taskData.name}" has been updated.`);
      console.log("Task updated:", taskData);
    }
  }

  // Add click event listeners to existing task names
  function addTaskClickListeners() {
    const taskTexts = document.querySelectorAll(".task-text");
    taskTexts.forEach((taskText) => {
      taskText.addEventListener("click", (e) => {
        e.stopPropagation();
        const taskItem = taskText.closest(".task-item");
        if (taskItem) {
          openTaskModal('', 'edit', taskItem);
        }
      });
    });
  }

  // Initialize task click listeners
  addTaskClickListeners();

  // Expose openTaskModal globally for use in other parts of the app
  window.openTaskModal = openTaskModal;

  // --- AI Conversation Logic ---
  
  let conversationHistory = [];
  let conversationRecognition = null;
  let isConversationRecording = false;

  // Initialize Speech Recognition for conversation
  if ("webkitSpeechRecognition" in window || "SpeechRecognition" in window) {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    conversationRecognition = new SpeechRecognition();
    conversationRecognition.continuous = false;
    conversationRecognition.interimResults = false;
    conversationRecognition.lang = "en-US";

    conversationRecognition.onstart = () => {
      isConversationRecording = true;
      const micBtn = document.getElementById('conversationMicBtn');
      const voiceIndicator = document.getElementById('conversationVoiceIndicator');
      if (micBtn) micBtn.classList.add('recording');
      if (voiceIndicator) voiceIndicator.classList.add('active');
    };

    conversationRecognition.onend = () => {
      isConversationRecording = false;
      const micBtn = document.getElementById('conversationMicBtn');
      const voiceIndicator = document.getElementById('conversationVoiceIndicator');
      if (micBtn) micBtn.classList.remove('recording');
      if (voiceIndicator) voiceIndicator.classList.remove('active');
    };

    conversationRecognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      const conversationInput = document.getElementById('conversationInput');
      if (conversationInput) {
        conversationInput.value += transcript + ' ';
      }
    };

    conversationRecognition.onerror = (event) => {
      console.error('Conversation speech recognition error:', event.error);
      showNotification("Error", "Speech recognition failed. Please try again.");
      isConversationRecording = false;
      const micBtn = document.getElementById('conversationMicBtn');
      if (micBtn) micBtn.classList.remove('recording');
    };
  }

  // Conversation Mic Button
  const conversationMicBtn = document.getElementById('conversationMicBtn');
  if (conversationMicBtn) {
    conversationMicBtn.addEventListener('click', () => {
      if (conversationRecognition) {
        if (isConversationRecording) {
          conversationRecognition.stop();
        } else {
          conversationRecognition.start();
        }
      } else {
        showNotification("Not Supported", "Speech recognition is not supported in your browser.");
      }
    });
  }

  // Send Message Button
  const sendMessageBtn = document.getElementById('sendMessageBtn');
  if (sendMessageBtn) {
    sendMessageBtn.addEventListener('click', sendUserMessage);
  }

  // Enter key to send message
  const conversationInput = document.getElementById('conversationInput');
  if (conversationInput) {
    conversationInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        sendUserMessage();
      }
    });
  }

  // Reset Conversation
  const conversationReset = document.getElementById('conversationReset');
  if (conversationReset) {
    conversationReset.addEventListener('click', () => {
      resetConversation();
    });
  }

  // Create Task Button
  const createTaskBtn = document.getElementById('createTaskBtn');
  if (createTaskBtn) {
    createTaskBtn.addEventListener('click', () => {
      createTaskFromConversation();
    });
  }

  function initializeConversation(initialText) {
    conversationHistory = [];
    
    // Add user's initial message
    addMessage('user', initialText);
    
    // Simulate AI response with questions
    setTimeout(() => {
      const aiResponse = analyzeInitialInput(initialText);
      addMessage('ai', aiResponse);
    }, 1000);
  }

  function analyzeInitialInput(text) {
    // Simple AI logic to ask clarifying questions
    const lowerText = text.toLowerCase();
    
    if (lowerText.length < 20) {
      return "I'd love to help you create a task! Can you provide more details about what you want to accomplish?";
    }
    
    // Check for time-related info
    const hasDeadline = /deadline|due|by|before|until/i.test(text);
    const hasPriority = /urgent|important|asap|critical|priority/i.test(text);
    const hasCategory = /daily|weekly|monthly/i.test(text);
    
    let questions = [];
    
    if (!hasDeadline) {
      questions.push("When do you need this completed?");
    }
    
    if (!hasPriority) {
      questions.push("How important is this task? (High priority, normal, or urgent?)");
    }
    
    if (!hasCategory) {
      questions.push("Is this a daily, weekly, or monthly task?");
    }
    
    if (questions.length === 0) {
      // All info present, ready to create task
      document.getElementById('createTaskBtn').style.display = 'block';
      return "Great! I have all the information I need. Here's what I understood:\n\n" +
             `📝 Task: ${text}\n\n` +
             "Click 'Create Task' to add this to your MITs, or let me know if you'd like to adjust anything.";
    }
    
    return "Thanks for sharing that! To create the perfect task, I need a bit more information:\n\n" +
           questions.map((q, i) => `${i + 1}. ${q}`).join('\n');
  }

  function addMessage(type, text) {
    const messagesContainer = document.getElementById('conversationMessages');
    if (!messagesContainer) return;
    
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${type}`;
    
    const time = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    
    messageDiv.innerHTML = `
      <div class="message-avatar">
        <i class="fas fa-${type === 'ai' ? 'robot' : 'user'}"></i>
      </div>
      <div class="message-content">
        <div class="message-bubble">${text.replace(/\n/g, '<br>')}</div>
        <div class="message-time">${time}</div>
      </div>
    `;
    
    messagesContainer.appendChild(messageDiv);
    
    // Scroll to bottom
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
    
    // Store in history
    conversationHistory.push({ type, text, time });
  }

  function addTypingIndicator() {
    const messagesContainer = document.getElementById('conversationMessages');
    if (!messagesContainer) return;
    
    const typingDiv = document.createElement('div');
    typingDiv.className = 'message ai';
    typingDiv.id = 'typingIndicator';
    
    typingDiv.innerHTML = `
      <div class="message-avatar">
        <i class="fas fa-robot"></i>
      </div>
      <div class="message-content">
        <div class="message-bubble">
          <div class="typing-indicator">
            <div class="typing-dot"></div>
            <div class="typing-dot"></div>
            <div class="typing-dot"></div>
          </div>
        </div>
      </div>
    `;
    
    messagesContainer.appendChild(typingDiv);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
  }

  function removeTypingIndicator() {
    const typingIndicator = document.getElementById('typingIndicator');
    if (typingIndicator) {
      typingIndicator.remove();
    }
  }

  function sendUserMessage() {
    const input = document.getElementById('conversationInput');
    if (!input) return;
    
    const message = input.value.trim();
    if (!message) {
      showNotification("Empty Message", "Please type a message or use voice input.");
      return;
    }
    
    // Add user message
    addMessage('user', message);
    
    // Clear input
    input.value = '';
    
    // Show typing indicator
    addTypingIndicator();
    
    // Simulate AI processing
    setTimeout(() => {
      removeTypingIndicator();
      const aiResponse = generateAIResponse(message);
      addMessage('ai', aiResponse);
    }, 1500);
  }

  function generateAIResponse(userMessage) {
    const lowerMessage = userMessage.toLowerCase();
    
    // Check if user provided all information
    const hasDeadline = /today|tomorrow|monday|tuesday|wednesday|thursday|friday|saturday|sunday|next week|this week|\d+ day|\d+ hour/i.test(userMessage);
    const hasPriority = /high|normal|low|urgent|important|critical/i.test(userMessage);
    const hasCategory = /daily|weekly|monthly/i.test(userMessage);
    
    // Count how many questions we've asked
    const aiMessages = conversationHistory.filter(m => m.type === 'ai');
    const questionsAsked = aiMessages.length;
    
    if (questionsAsked >= 3 || (hasDeadline && hasPriority && hasCategory)) {
      // Ready to create task
      document.getElementById('createTaskBtn').style.display = 'block';
      return "Perfect! I now have all the information needed:\n\n" +
             "✅ Task details captured\n" +
             "✅ Priority level set\n" +
             "✅ Deadline noted\n" +
             "✅ Category assigned\n\n" +
             "Click 'Create Task' when you're ready, or let me know if you'd like to make any changes.";
    }
    
    // Ask follow-up questions
    if (!hasDeadline && questionsAsked === 1) {
      return "Great! Now, when would you like to complete this task? (e.g., today, tomorrow, next week)";
    }
    
    if (!hasPriority && questionsAsked === 2) {
      return "Got it! How would you prioritize this task? (High priority, normal, or urgent?)";
    }
    
    if (!hasCategory) {
      return "Thanks! Is this something you need to do daily, weekly, or monthly?";
    }
    
    // Default response
    return "I understand. Could you provide more details to help me create the best task for you?";
  }

  function resetConversation() {
    // Clear conversation
    conversationHistory = [];
    const messagesContainer = document.getElementById('conversationMessages');
    if (messagesContainer) {
      messagesContainer.innerHTML = '';
    }
    
    // Hide create task button
    document.getElementById('createTaskBtn').style.display = 'none';
    
    // Switch back to initial view
    document.getElementById('conversationView').style.display = 'none';
    document.getElementById('initialInputView').style.display = 'flex';
    
    // Show modal close button again
    if (modalClose) {
      modalClose.style.display = 'block';
    }
    
    // Clear initial input
    document.getElementById('brainDumpInput').value = '';
    
    showNotification("Conversation Reset", "Start a new brain dump!");
  }

  function createTaskFromConversation() {
    // Extract task information from conversation
    const userMessages = conversationHistory.filter(m => m.type === 'user').map(m => m.text);
    const allText = userMessages.join(' ');
    
    // Close brain dump modal
    closeModal();
    
    // Show processing notification
    showNotification("Creating Task", "AI is structuring your task...");
    
    // Create task with AI-processed data
    setTimeout(() => {
      const taskData = extractTaskDataFromConversation(allText);
      openTaskModal(taskData.name, 'create');
      
      // Pre-fill the task form
      if (taskData.description) {
        document.getElementById('taskDescription').value = taskData.description;
      }
      if (taskData.priority) {
        document.getElementById('taskPriority').value = taskData.priority;
      }
      if (taskData.category) {
        document.getElementById('taskCategory').value = taskData.category;
      }
      
      showNotification("Task Structured", "Please review and save your task!");
    }, 1000);
  }

  function extractTaskDataFromConversation(text) {
    // Simple extraction logic (can be enhanced with real AI)
    const lowerText = text.toLowerCase();
    
    let priority = 'normal';
    if (/urgent|critical|asap/i.test(text)) {
      priority = 'urgent';
    } else if (/high|important/i.test(text)) {
      priority = 'high';
    }
    
    let category = 'daily';
    if (/weekly|week/i.test(text)) {
      category = 'weekly';
    } else if (/monthly|month/i.test(text)) {
      category = 'monthly';
    }
    
    return {
      name: text.substring(0, 80),
      description: text,
      priority: priority,
      category: category
    };
  }
});

// Add animation styles
const animationStyles = `
<style>
@keyframes fadeIn {
    from {
        opacity: 0;
        transform: translateY(20px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

@keyframes fadeOut {
    from {
        opacity: 1;
        transform: translateX(0);
    }
    to {
        opacity: 0;
        transform: translateX(-20px);
    }
}

.edit-textarea {
    resize: vertical;
    font-family: inherit;
    line-height: 1.6;
}
</style>
`;

document.head.insertAdjacentHTML("beforeend", animationStyles);
