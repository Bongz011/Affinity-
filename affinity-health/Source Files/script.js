document.addEventListener("DOMContentLoaded", function () {
  const darkModeToggle = document.getElementById("darkModeToggle");
  const toggleIcon = document.getElementById("toggleIcon");
  const body = document.body;

  if (
    localStorage.getItem("darkMode") === "enabled" ||
    (!localStorage.getItem("darkMode") &&
      window.matchMedia("(prefers-color-scheme: dark)").matches)
  ) {
    body.classList.add("dark-mode");
    toggleIcon.classList.remove("fa-sun");
    toggleIcon.classList.add("fa-moon");
  }

  darkModeToggle.addEventListener("click", function () {
    body.classList.toggle("dark-mode");
    if (body.classList.contains("dark-mode")) {
      localStorage.setItem("darkMode", "enabled");
      toggleIcon.classList.remove("fa-sun");
      toggleIcon.classList.add("fa-moon");
    } else {
      localStorage.setItem("darkMode", "disabled");
      toggleIcon.classList.remove("fa-moon");
      toggleIcon.classList.add("fa-sun");
    }
  });

  const burgerToggle = document.querySelector(".burger-menu-toggle");
  const mainNav = document.querySelector(".main-nav");

  if (burgerToggle && mainNav && body) {
    burgerToggle.addEventListener("click", function () {
      mainNav.classList.toggle("active");
      burgerToggle.classList.toggle("active");
      body.classList.toggle("menu-open");
    });

    const navLinks = mainNav.querySelectorAll("a");
    navLinks.forEach((link) => {
      link.addEventListener("click", function () {
        if (mainNav.classList.contains("active")) {
          mainNav.classList.remove("active");
          burgerToggle.classList.remove("active");
          body.classList.remove("menu-open");
        }
      });
    });
  }

  const quoteForm = document.getElementById("quoteForm");
  const planSelection = document.getElementById("planSelection");
  const ageInput = document.getElementById("age");
  const dependentsInput = document.getElementById("dependents");
  const provinceSelection = document.getElementById("province");
  const premiumAmountDisplay = document.getElementById("premiumAmount");
  const resultMessage = document.getElementById("resultMessage");

  const planSelectionError = document.getElementById("planSelectionError");
  const ageError = document.getElementById("ageError");
  const dependentsError = document.getElementById("dependentsError");
  const provinceError = document.getElementById("provinceError");

  quoteForm.addEventListener("submit", function (event) {
    event.preventDefault();

    let isValid = true;

    planSelectionError.textContent = "";
    ageError.textContent = "";
    dependentsError.textContent = "";
    provinceError.textContent = "";

    if (planSelection.value === "") {
      planSelectionError.textContent = "Please select a plan.";
      isValid = false;
    }

    const age = parseInt(ageInput.value);
    if (isNaN(age) || age < 18 || age > 99) {
      ageError.textContent = "Please enter a valid age (18-99).";
      isValid = false;
    }

    const dependents = parseInt(dependentsInput.value);
    if (isNaN(dependents) || dependents < 0) {
      dependentsError.textContent = "Dependents must be a non-negative number.";
      isValid = false;
    }

    if (provinceSelection.value === "") {
      provinceError.textContent = "Please select your province.";
      isValid = false;
    }

    if (isValid) {
      const plan = planSelection.value;
      const province = provinceSelection.value;
      let basePremium = 0;
      let ageFactor = 1;
      let dependentsFactor = 0;
      let provinceFactor = 1;

      switch (plan) {
        case "basic":
          basePremium = 250;
          break;
        case "standard":
          basePremium = 400;
          break;
        case "premium":
          basePremium = 600;
          break;
      }

      if (age >= 18 && age <= 25) {
        ageFactor = 1.3;
      } else if (age >= 26 && age <= 45) {
        ageFactor = 1.0;
      } else if (age >= 46 && age <= 65) {
        ageFactor = 1.1;
      } else {
        ageFactor = 1.4;
      }

      dependentsFactor = dependents * 50;

      switch (province) {
        case "Gauteng":
          provinceFactor = 1.15;
          break;
        case "Western Cape":
          provinceFactor = 1.1;
          break;
        case "KwaZulu-Natal":
          provinceFactor = 1.05;
          break;
        default:
          provinceFactor = 1.0;
          break;
      }

      let calculatedPremium = basePremium * ageFactor + dependentsFactor;
      calculatedPremium = calculatedPremium * provinceFactor;

      premiumAmountDisplay.textContent = `R${calculatedPremium.toFixed(2)}`;
      resultMessage.textContent = `Your estimated monthly premium for the ${plan} plan in ${province} is shown above.`;
    } else {
      premiumAmountDisplay.textContent = "R0.00";
      resultMessage.textContent =
        "Please correct the errors to get your quote.";
    }
  });
});
