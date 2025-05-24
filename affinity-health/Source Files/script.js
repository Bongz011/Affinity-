document.addEventListener("DOMContentLoaded", () => {
  const quoteForm = document.getElementById("quoteForm");
  const planSelection = document.getElementById("planSelection");
  const ageInput = document.getElementById("age");
  const dependentsInput = document.getElementById("dependents");
  const provinceSelection = document.getElementById("province");
  const premiumAmountSpan = document.getElementById("premiumAmount");
  const darkModeToggle = document.getElementById("darkModeToggle");
  const body = document.body;

  // New: Reference to the single icon element
  const toggleIcon = document.querySelector(".toggle-icon");

  // Error message elements
  const ageError = document.getElementById("ageError");
  const dependentsError = document.getElementById("dependentsError");
  const provinceError = document.getElementById("provinceError");

  // Function to calculate mock premium
  function calculatePremium() {
    const plan = planSelection.value;
    const age = parseInt(ageInput.value);
    const dependents = parseInt(dependentsInput.value);
    const province = provinceSelection.value;

    let basePrice = 0;
    let ageFactor = 0;
    let dependentFactor = 100;
    let provinceFactor = 1;

    // Base price based on plan
    switch (plan) {
      case "basic":
        basePrice = 500;
        ageFactor = 10;
        break;
      case "standard":
        basePrice = 800;
        ageFactor = 15;
        break;
      case "premium":
        basePrice = 1200;
        ageFactor = 20;
        break;
      default:
        basePrice = 0; // Should be caught by validation
    }

    // Province factor (example)
    if (province === "gauteng") {
      provinceFactor = 1.1;
    } else if (province === "westernCape") {
      provinceFactor = 1.05;
    } else if (province === "kzn") {
      provinceFactor = 1.03;
    }

    let estimatedPremium =
      (basePrice + ageFactor * age + dependents * dependentFactor) *
      provinceFactor;

    return estimatedPremium.toFixed(2); // Format to 2 decimal places
  }

  // --- Basic Form Validation ---
  function validateForm() {
    let isValid = true;

    // Clear previous errors
    ageError.textContent = "";
    dependentsError.textContent = "";
    provinceError.textContent = "";

    // Determine current border color based on theme
    const currentBorderColor = getComputedStyle(
      document.documentElement
    ).getPropertyValue("--border-color-light"); // Default to light
    const darkBorderColor = getComputedStyle(
      document.documentElement
    ).getPropertyValue("--border-color-dark");
    const effectiveBorderColor = body.classList.contains("dark-mode")
      ? darkBorderColor
      : currentBorderColor;

    // Validate Plan selection (handled by 'required' in HTML, but can add JS check)
    if (planSelection.value === "") {
      planSelection.style.borderColor = "var(--error-red)";
      isValid = false;
    } else {
      planSelection.style.borderColor = effectiveBorderColor; // Reset if valid
    }

    // Validate Age
    if (
      isNaN(ageInput.value) ||
      ageInput.value === "" ||
      parseInt(ageInput.value) < 0
    ) {
      ageError.textContent = "Please enter a valid age.";
      ageInput.style.borderColor = "var(--error-red)"; // Apply to full border
      isValid = false;
    } else {
      ageInput.style.borderColor = effectiveBorderColor; // Reset if valid
    }

    // Validate Dependents
    if (
      isNaN(dependentsInput.value) ||
      dependentsInput.value === "" ||
      parseInt(dependentsInput.value) < 0
    ) {
      dependentsError.textContent =
        "Please enter a valid number of dependents.";
      dependentsInput.style.borderColor = "var(--error-red)"; // Apply to full border
      isValid = false;
    } else {
      dependentsInput.style.borderColor = effectiveBorderColor; // Reset if valid
    }

    // Validate Province
    if (provinceSelection.value === "") {
      provinceError.textContent = "Please select your province.";
      provinceSelection.style.borderColor = "var(--error-red)"; // Apply to full border
      isValid = false;
    } else {
      provinceSelection.style.borderColor = effectiveBorderColor; // Reset if valid
    }

    return isValid;
  }

  // Event listener for form submission
  quoteForm.addEventListener("submit", (event) => {
    event.preventDefault(); // Prevent default form submission

    if (validateForm()) {
      const premium = calculatePremium();
      premiumAmountSpan.textContent = premium;
    } else {
      premiumAmountSpan.textContent = "---.--"; // Reset if validation fails
    }
  });

  // Add input event listeners for real-time feedback on input fields
  // Reusing the general border color logic for consistency
  const updateInputBorder = (inputElement, errorElement, validationFn) => {
    const currentBorderColor = getComputedStyle(
      document.documentElement
    ).getPropertyValue("--primary-green"); // Use primary-green for valid state
    const errorBorderColor = getComputedStyle(
      document.documentElement
    ).getPropertyValue("--error-red");
    const defaultBorderColor = body.classList.contains("dark-mode")
      ? getComputedStyle(document.documentElement).getPropertyValue(
          "--border-color-dark"
        )
      : getComputedStyle(document.documentElement).getPropertyValue(
          "--border-color-light"
        );

    if (validationFn()) {
      errorElement.textContent = "";
      inputElement.style.borderColor = currentBorderColor;
    } else {
      errorElement.textContent = `Please enter a valid ${inputElement.id}.`; // More generic message
      inputElement.style.borderColor = errorBorderColor;
    }
  };

  ageInput.addEventListener("input", () => {
    updateInputBorder(
      ageInput,
      ageError,
      () =>
        !isNaN(ageInput.value) &&
        ageInput.value !== "" &&
        parseInt(ageInput.value) >= 0
    );
  });

  dependentsInput.addEventListener("input", () => {
    updateInputBorder(
      dependentsInput,
      dependentsError,
      () =>
        !isNaN(dependentsInput.value) &&
        dependentsInput.value !== "" &&
        parseInt(dependentsInput.value) >= 0
    );
  });

  provinceSelection.addEventListener("change", () => {
    updateInputBorder(
      provinceSelection,
      provinceError,
      () => provinceSelection.value !== ""
    );
  });

  planSelection.addEventListener("change", () => {
    // Plan selection doesn't have a dedicated error message div, relies on validation state
    const currentBorderColor = getComputedStyle(
      document.documentElement
    ).getPropertyValue("--primary-green");
    const errorBorderColor = getComputedStyle(
      document.documentElement
    ).getPropertyValue("--error-red");
    if (planSelection.value !== "") {
      planSelection.style.borderColor = currentBorderColor;
    } else {
      planSelection.style.borderColor = errorBorderColor;
    }
  });

  // --- Dark Mode Toggle ---
  darkModeToggle.addEventListener("change", () => {
    body.classList.toggle("dark-mode");

    // Toggle icon based on dark mode state
    if (body.classList.contains("dark-mode")) {
      toggleIcon.classList.remove("fa-sun");
      toggleIcon.classList.add("fa-moon");
    } else {
      toggleIcon.classList.remove("fa-moon");
      toggleIcon.classList.add("fa-sun");
    }

    // Store user preference in localStorage
    if (body.classList.contains("dark-mode")) {
      localStorage.setItem("theme", "dark");
    } else {
      localStorage.setItem("theme", "light");
    }
    // Re-validate to update border colors to reflect new theme immediately
    validateForm(); // This will re-apply appropriate border colors
  });

  // Check for saved theme preference on page load
  const savedTheme = localStorage.getItem("theme");
  if (savedTheme === "dark") {
    body.classList.add("dark-mode");
    darkModeToggle.checked = true; // Ensure checkbox state reflects dark mode
    toggleIcon.classList.remove("fa-sun"); // Set initial icon to moon
    toggleIcon.classList.add("fa-moon");
  } else {
    // Ensure checkbox is unchecked and icon is sun if no saved theme or light theme
    darkModeToggle.checked = false;
    toggleIcon.classList.remove("fa-moon");
    toggleIcon.classList.add("fa-sun");
  }
});
