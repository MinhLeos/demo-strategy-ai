document.addEventListener("DOMContentLoaded", () => {
  // Period Dropdown functionality
  const periodBtn = document.getElementById("periodBtn");
  const periodMenu = document.getElementById("periodMenu");
  const periodOptions = document.querySelectorAll(".period-option");
  const periodText = document.getElementById("periodText");
  const mitTitle = document.getElementById("mitTitle");

  // Task lists
  const dailyTasks = document.getElementById("dailyTasks");
  const weeklyTasks = document.getElementById("weeklyTasks");
  const monthlyTasks = document.getElementById("monthlyTasks");

  // Summary elements
  const summaryTitle = document.getElementById("summaryTitle");
  const totalTasks = document.getElementById("totalTasks");
  const activeProjects = document.getElementById("activeProjects");
  const deadlines = document.getElementById("deadlines");
  const deadlineText = document.getElementById("deadlineText");

  // REP elements
  const repGoal = document.getElementById("repGoal");
  const repCurrent = document.getElementById("repCurrent");
  const repTarget = document.getElementById("repTarget");
  const repPeriod = document.getElementById("repPeriod");
  const repMessage = document.getElementById("repMessage");
  const repProgressBar = document.getElementById("repProgressBar");

  // Period dropdown toggle
  if (periodBtn && periodMenu) {
    periodBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      periodMenu.classList.toggle("show");
      periodBtn.classList.toggle("active");
    });

    // Close dropdown when clicking outside
    document.addEventListener("click", () => {
      periodMenu.classList.remove("show");
      periodBtn.classList.remove("active");
    });

    // Period option selection
    periodOptions.forEach((option) => {
      option.addEventListener("click", (e) => {
        e.preventDefault();

        // Update active state
        periodOptions.forEach((opt) => opt.classList.remove("active"));
        option.classList.add("active");

        // Get selected period
        const period = option.dataset.period;

        // Update dropdown text
        periodText.textContent = option.textContent.trim();

        // Update view based on period
        updateDashboardView(period);

        // Close menu
        periodMenu.classList.remove("show");
        periodBtn.classList.remove("active");
      });
    });
  }

  function updateDashboardView(period) {
    // Hide all task lists first
    dailyTasks.classList.add("hidden");
    weeklyTasks.classList.add("hidden");
    monthlyTasks.classList.add("hidden");

    switch (period) {
      case "daily":
        dailyTasks.classList.remove("hidden");
        mitTitle.textContent = "DAILY";

        // Update summary card
        summaryTitle.textContent = "Weekly Plan Summary";
        totalTasks.textContent = "18";
        activeProjects.textContent = "4";
        deadlines.textContent = "3";
        deadlineText.textContent = "(Next 7 days)";

        // Update REP card
        repGoal.textContent = "(Goal: 15 hrs)";
        repCurrent.textContent = "8";
        repTarget.textContent = "15";
        repPeriod.textContent = "this week";
        repMessage.textContent = "Need 7 more hours by Sunday.";
        repProgressBar.style.width = "53%";
        break;

      case "weekly":
        weeklyTasks.classList.remove("hidden");
        mitTitle.textContent = "WEEKLY";

        // Update summary card
        summaryTitle.textContent = "Monthly Plan Summary";
        totalTasks.textContent = "42";
        activeProjects.textContent = "8";
        deadlines.textContent = "12";
        deadlineText.textContent = "(Next 30 days)";

        // Update REP card
        repGoal.textContent = "(Goal: 60 hrs)";
        repCurrent.textContent = "32";
        repTarget.textContent = "60";
        repPeriod.textContent = "this month";
        repMessage.textContent = "Need 28 more hours by month end.";
        repProgressBar.style.width = "53%";
        break;

      case "monthly":
        monthlyTasks.classList.remove("hidden");
        mitTitle.textContent = "MONTHLY";

        // Update summary card
        summaryTitle.textContent = "Quarterly Plan Summary";
        totalTasks.textContent = "125";
        activeProjects.textContent = "15";
        deadlines.textContent = "25";
        deadlineText.textContent = "(Next 90 days)";

        // Update REP card
        repGoal.textContent = "(Goal: 180 hrs)";
        repCurrent.textContent = "95";
        repTarget.textContent = "180";
        repPeriod.textContent = "this quarter";
        repMessage.textContent = "Need 85 more hours by quarter end.";
        repProgressBar.style.width = "53%";
        break;
    }

    showNotification("View Changed", `Switched to ${period} view`);
  }

  // Task Management
  const taskLists = document.querySelectorAll(".task-list");

  taskLists.forEach((taskList) => {
    taskList.addEventListener("click", (e) => {
      const button = e.target.closest(".action-btn");

      if (button) {
        const taskItem = button.closest(".task-item");
        const taskText = taskItem.querySelector(".task-text").textContent.trim();

        if (button.classList.contains("done")) {
          toggleTaskStatus(taskItem);
        } else if (button.classList.contains("swap")) {
          showNotification("Swap Task", `"${taskText}" will be replaced with the next priority task.`);
        } else if (button.classList.contains("defer")) {
          showNotification("Defer Task", `"${taskText}" has been moved to tomorrow.`);
        }
      }
    });
  });

  function toggleTaskStatus(taskItem) {
    const currentStatus = taskItem.getAttribute("data-status");

    if (currentStatus === "pending") {
      taskItem.classList.add("completed");
      taskItem.setAttribute("data-status", "completed");
      showNotification("Task Completed", "Great job! Task marked as done.");
    } else {
      taskItem.classList.remove("completed");
      taskItem.setAttribute("data-status", "pending");
      showNotification("Task Restored", "Task has been restored to pending.");
    }
  }

  // Floating Action Button & Modal
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

  // Structure with AI Button
  if (structureBtn) {
    structureBtn.addEventListener("click", () => {
      const text = brainDumpInput.value.trim();
      if (text) {
        processWithAI(text);
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
    // Show success message
    showNotification("Brain Dump Captured", "Your thoughts have been captured. Creating task...");

    // Close brain dump modal
    closeModal();

    // Open task modal to create task from this content
    setTimeout(() => {
      openTaskModal(text, 'create');
    }, 500);
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

    // Ctrl/Cmd + D for Daily view
    if ((e.ctrlKey || e.metaKey) && e.key === "d") {
      e.preventDefault();
      updateDashboardView("daily");
    }

    // Ctrl/Cmd + W for Weekly view
    if ((e.ctrlKey || e.metaKey) && e.key === "w") {
      e.preventDefault();
      updateDashboardView("weekly");
    }
  });

  // REP Progress Animation
  const repProgressBarElement = document.querySelector(".progress-bar");
  if (repProgressBarElement) {
    const currentProgress = parseFloat(repProgressBarElement.style.width);
    if (currentProgress >= 70) {
      repProgressBarElement.style.backgroundColor = "#4CAF50";
    }
  }

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
    // Create new task element
    const taskList = document.querySelector(`#${taskData.category}Tasks`);
    if (taskList) {
      const taskItem = document.createElement("li");
      taskItem.className = "task-item";
      taskItem.setAttribute("data-status", "pending");
      taskItem.setAttribute("data-task-id", `${taskData.category}-${Date.now()}`);
      
      // Add priority class
      if (taskData.priority === "high") {
        taskItem.classList.add("high-priority");
      } else if (taskData.priority === "urgent") {
        taskItem.classList.add("near-due");
      }
      
      taskItem.innerHTML = `
        <span class="task-text">${taskData.name}</span>
        <div class="task-actions">
          <button class="action-btn swap"><i class="fas fa-exchange-alt"></i><span> Swap</span></button>
          <button class="action-btn defer"><i class="fas fa-clock"></i><span> Defer</span></button>
          <button class="action-btn done"><i class="fas fa-check"></i><span> Done</span></button>
        </div>
      `;
      
      taskList.appendChild(taskItem);
      
      // Add click listener to new task
      const newTaskText = taskItem.querySelector(".task-text");
      newTaskText.addEventListener("click", (e) => {
        e.stopPropagation();
        openTaskModal('', 'edit', taskItem);
      });
    }
    
    showNotification("Task Created", `"${taskData.name}" has been added to your ${taskData.category} tasks.`);
    console.log("New task created:", taskData);
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

  // --- MIT Info Modal ---
  const mitInfoBtn = document.getElementById("mitInfoBtn");
  const mitInfoModal = document.getElementById("mitInfoModal");
  const mitInfoClose = document.getElementById("mitInfoClose");

  if (mitInfoBtn) {
    mitInfoBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      mitInfoModal.classList.add("show");
      document.body.style.overflow = "hidden";
    });
  }

  if (mitInfoClose) {
    mitInfoClose.addEventListener("click", () => {
      mitInfoModal.classList.remove("show");
      document.body.style.overflow = "";
    });
  }

  if (mitInfoModal) {
    mitInfoModal.addEventListener("click", (e) => {
      if (e.target === mitInfoModal) {
        mitInfoModal.classList.remove("show");
        document.body.style.overflow = "";
      }
    });
  }

  // Close on Escape key
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && mitInfoModal && mitInfoModal.classList.contains("show")) {
      mitInfoModal.classList.remove("show");
      document.body.style.overflow = "";
    }
  });
});
