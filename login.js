document.addEventListener("DOMContentLoaded", () => {
  // Elements
  const emailLoginBtn = document.getElementById("emailLoginBtn");
  const emailLoginModal = document.getElementById("emailLoginModal");
  const emailModalClose = document.getElementById("emailModalClose");
  const backToSocial = document.getElementById("backToSocial");

  const signupLink = document.getElementById("signupLink");
  const signupModal = document.getElementById("signupModal");
  const signupModalClose = document.getElementById("signupModalClose");
  const backToMain = document.getElementById("backToMain");

  const forgotPasswordLink = document.getElementById("forgotPasswordLink");
  const forgotModal = document.getElementById("forgotModal");
  const forgotModalClose = document.getElementById("forgotModalClose");
  const backToEmailLogin = document.getElementById("backToEmailLogin");

  const emailLoginForm = document.getElementById("emailLoginForm");
  const signupForm = document.getElementById("signupForm");
  const forgotForm = document.getElementById("forgotForm");

  const togglePasswordBtn = document.getElementById("togglePassword");
  const passwordInput = document.getElementById("password");

  // Password strength
  const signupPassword = document.getElementById("signupPassword");
  const strengthFill = document.getElementById("strengthFill");
  const strengthText = document.getElementById("strengthText");

  // Social Login Buttons
  const googleLogin = document.getElementById("googleLogin");
  const facebookLogin = document.getElementById("facebookLogin");
  const appleLogin = document.getElementById("appleLogin");
  const microsoftLogin = document.getElementById("microsoftLogin");

  // Social Login Handlers
  if (googleLogin) {
    googleLogin.addEventListener("click", () => {
      showNotification("Google Sign In", "Redirecting to Google...", "info");
      // Simulate OAuth redirect
      setTimeout(() => {
        console.log("Google OAuth flow");
        // window.location.href = '/auth/google';
      }, 1000);
    });
  }

  if (facebookLogin) {
    facebookLogin.addEventListener("click", () => {
      showNotification("Facebook Sign In", "Redirecting to Facebook...", "info");
      // Simulate OAuth redirect
      setTimeout(() => {
        console.log("Facebook OAuth flow");
        // window.location.href = '/auth/facebook';
      }, 1000);
    });
  }

  if (appleLogin) {
    appleLogin.addEventListener("click", () => {
      showNotification("Apple Sign In", "Redirecting to Apple...", "info");
      // Simulate OAuth redirect
      setTimeout(() => {
        console.log("Apple OAuth flow");
        // window.location.href = '/auth/apple';
      }, 1000);
    });
  }

  if (microsoftLogin) {
    microsoftLogin.addEventListener("click", () => {
      showNotification("Microsoft Sign In", "Redirecting to Microsoft...", "info");
      // Simulate OAuth redirect
      setTimeout(() => {
        console.log("Microsoft OAuth flow");
        // window.location.href = '/auth/microsoft';
      }, 1000);
    });
  }

  // Email Login Modal
  if (emailLoginBtn) {
    emailLoginBtn.addEventListener("click", () => {
      openModal(emailLoginModal);
      // Auto focus email input
      setTimeout(() => {
        document.getElementById("email")?.focus();
      }, 300);
    });
  }

  if (emailModalClose) {
    emailModalClose.addEventListener("click", () => {
      closeModal(emailLoginModal);
    });
  }

  if (backToSocial) {
    backToSocial.addEventListener("click", (e) => {
      e.preventDefault();
      closeModal(emailLoginModal);
    });
  }

  // Sign Up Modal
  if (signupLink) {
    signupLink.addEventListener("click", (e) => {
      e.preventDefault();
      openModal(signupModal);
    });
  }

  if (signupModalClose) {
    signupModalClose.addEventListener("click", () => {
      closeModal(signupModal);
    });
  }

  if (backToMain) {
    backToMain.addEventListener("click", (e) => {
      e.preventDefault();
      closeModal(signupModal);
    });
  }

  // Forgot Password Modal
  if (forgotPasswordLink) {
    forgotPasswordLink.addEventListener("click", (e) => {
      e.preventDefault();
      closeModal(emailLoginModal);
      setTimeout(() => {
        openModal(forgotModal);
      }, 300);
    });
  }

  if (forgotModalClose) {
    forgotModalClose.addEventListener("click", () => {
      closeModal(forgotModal);
    });
  }

  if (backToEmailLogin) {
    backToEmailLogin.addEventListener("click", (e) => {
      e.preventDefault();
      closeModal(forgotModal);
      setTimeout(() => {
        openModal(emailLoginModal);
      }, 300);
    });
  }

  // Toggle Password Visibility
  if (togglePasswordBtn) {
    togglePasswordBtn.addEventListener("click", () => {
      const type = passwordInput.type === "password" ? "text" : "password";
      passwordInput.type = type;

      const icon = togglePasswordBtn.querySelector("i");
      icon.className = type === "password" ? "fas fa-eye" : "fas fa-eye-slash";
    });
  }

  // Email Login Form
  if (emailLoginForm) {
    emailLoginForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      // Clear previous errors
      clearErrors();

      // Get values
      const email = document.getElementById("email").value.trim();
      const password = passwordInput.value;
      const remember = document.getElementById("remember").checked;

      // Validation
      let hasError = false;

      if (!validateEmail(email)) {
        showError("emailError", "Please enter a valid email address");
        hasError = true;
      }

      if (password.length < 6) {
        showError("passwordError", "Password must be at least 6 characters");
        hasError = true;
      }

      if (hasError) return;

      // Show loading state
      const submitBtn = emailLoginForm.querySelector(".btn-primary");
      const originalText = submitBtn.innerHTML;
      submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Signing in...';
      submitBtn.disabled = true;

      // Simulate API call
      setTimeout(() => {
        // Success
        console.log("Login successful:", { email, remember });
        showNotification("Login Successful", "Redirecting to onboarding...", "success");

        // Redirect after 1 second
        setTimeout(() => {
          window.location.href = "/onboarding.html";
        }, 1000);

        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
      }, 1500);
    });
  }

  // Forgot Password Form
  if (forgotForm) {
    forgotForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      const resetEmail = document.getElementById("resetEmail").value.trim();

      if (!validateEmail(resetEmail)) {
        showNotification("Invalid Email", "Please enter a valid email address", "error");
        return;
      }

      // Show loading state
      const submitBtn = forgotForm.querySelector(".btn-primary");
      const originalText = submitBtn.innerHTML;
      submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
      submitBtn.disabled = true;

      // Simulate API call
      setTimeout(() => {
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
        closeModal(forgotModal);
        showNotification("Email Sent", "Password reset link has been sent to your email", "success");
      }, 1500);
    });
  }

  // Password Strength Checker
  if (signupPassword) {
    signupPassword.addEventListener("input", (e) => {
      const password = e.target.value;
      const strength = checkPasswordStrength(password);

      strengthFill.className = "strength-fill";

      if (password.length === 0) {
        strengthText.textContent = "Password strength";
        return;
      }

      switch (strength) {
        case "weak":
          strengthFill.classList.add("weak");
          strengthText.textContent = "Weak password";
          break;
        case "medium":
          strengthFill.classList.add("medium");
          strengthText.textContent = "Medium strength";
          break;
        case "strong":
          strengthFill.classList.add("strong");
          strengthText.textContent = "Strong password";
          break;
      }
    });
  }

  // Sign Up Form
  if (signupForm) {
    signupForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      const firstName = document.getElementById("firstName").value.trim();
      const lastName = document.getElementById("lastName").value.trim();
      const email = document.getElementById("signupEmail").value.trim();
      const password = document.getElementById("signupPassword").value;
      const termsAccepted = document.getElementById("terms").checked;

      // Validation
      if (!firstName || !lastName) {
        showNotification("Missing Information", "Please enter your full name", "error");
        return;
      }

      if (!validateEmail(email)) {
        showNotification("Invalid Email", "Please enter a valid email address", "error");
        return;
      }

      if (password.length < 8) {
        showNotification("Weak Password", "Password must be at least 8 characters", "error");
        return;
      }

      if (!termsAccepted) {
        showNotification("Terms Required", "Please accept the terms and conditions", "error");
        return;
      }

      // Show loading state
      const submitBtn = signupForm.querySelector(".btn-primary");
      const originalText = submitBtn.innerHTML;
      submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Creating account...';
      submitBtn.disabled = true;

      // Simulate API call
      setTimeout(() => {
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
        closeModal(signupModal);
        showNotification("Account Created", "Welcome! Your account has been created successfully", "success");

        // Redirect to onboarding after 2 seconds
        setTimeout(() => {
          window.location.href = "/onboarding";
        }, 2000);
      }, 2000);
    });
  }

  // Social Sign Up Buttons in Modal
  const googleSignup = document.querySelector(".btn-google-signup");
  const facebookSignup = document.querySelector(".btn-facebook-signup");

  if (googleSignup) {
    googleSignup.addEventListener("click", () => {
      showNotification("Google Sign Up", "Redirecting to Google...", "info");
      // Implement Google OAuth signup
    });
  }

  if (facebookSignup) {
    facebookSignup.addEventListener("click", () => {
      showNotification("Facebook Sign Up", "Redirecting to Facebook...", "info");
      // Implement Facebook OAuth signup
    });
  }

  // Close modal on outside click
  window.addEventListener("click", (e) => {
    if (e.target === emailLoginModal) {
      closeModal(emailLoginModal);
    }
    if (e.target === signupModal) {
      closeModal(signupModal);
    }
    if (e.target === forgotModal) {
      closeModal(forgotModal);
    }
  });

  // Helper Functions
  function openModal(modal) {
    modal.classList.add("show");
    document.body.style.overflow = "hidden";
  }

  function closeModal(modal) {
    modal.classList.remove("show");
    document.body.style.overflow = "";
  }

  function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  }

  function showError(elementId, message) {
    const errorElement = document.getElementById(elementId);
    if (errorElement) {
      errorElement.textContent = message;
      errorElement.classList.add("show");
    }
  }

  function clearErrors() {
    const errorMessages = document.querySelectorAll(".error-message");
    errorMessages.forEach((msg) => {
      msg.textContent = "";
      msg.classList.remove("show");
    });
  }

  function checkPasswordStrength(password) {
    let strength = 0;

    // Length check
    if (password.length >= 8) strength++;
    if (password.length >= 12) strength++;

    // Character variety
    if (/[a-z]/.test(password)) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;

    if (strength <= 2) return "weak";
    if (strength <= 4) return "medium";
    return "strong";
  }

  function showNotification(title, message, type = "info") {
    // Create notification element
    const notification = document.createElement("div");
    notification.className = `notification notification-${type}`;

    let icon = "fa-info-circle";
    if (type === "success") icon = "fa-check-circle";
    if (type === "error") icon = "fa-exclamation-circle";
    if (type === "warning") icon = "fa-exclamation-triangle";

    notification.innerHTML = `
            <i class="fas ${icon}"></i>
            <div>
                <strong>${title}</strong>
                <p>${message}</p>
            </div>
        `;

    // Add to body
    document.body.appendChild(notification);

    // Trigger animation
    setTimeout(() => {
      notification.classList.add("show");
    }, 100);

    // Remove after 4 seconds
    setTimeout(() => {
      notification.classList.remove("show");
      setTimeout(() => {
        document.body.removeChild(notification);
      }, 300);
    }, 4000);
  }

  // Keyboard shortcuts
  document.addEventListener("keydown", (e) => {
    // Escape to close modals
    if (e.key === "Escape") {
      if (emailLoginModal.classList.contains("show")) {
        closeModal(emailLoginModal);
      }
      if (signupModal.classList.contains("show")) {
        closeModal(signupModal);
      }
      if (forgotModal.classList.contains("show")) {
        closeModal(forgotModal);
      }
    }
  });
});
