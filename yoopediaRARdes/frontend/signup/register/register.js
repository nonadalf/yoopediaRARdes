const steps = document.querySelectorAll(".step");
const nextButtons = document.querySelectorAll(".nextBtn");
const prevButtons = document.querySelectorAll(".prevBtn");

let currentStep = 0;

// ===== إظهار خطوة معينة =====
function showStep(index) {
  steps.forEach(step => step.classList.remove("active"));
  steps[index].classList.add("active");
}

// ===== التحقق من كلمة المرور =====
function validatePassword(input) {
  const value = input.value;
  const ruleLetter = document.getElementById("rule-letter");
  const ruleNumber = document.getElementById("rule-number");
  const ruleLength = document.getElementById("rule-length");

  ruleLetter.checked = /[a-zA-Z]/.test(value);
  ruleNumber.checked = /\d/.test(value);
  ruleLength.checked = value.length >= 10;

  return ruleLetter.checked && ruleNumber.checked && ruleLength.checked;
}

// ===== التحقق من مدخلات الخطوة الحالية =====
function validateStep(stepIndex) {
  const inputs = steps[stepIndex].querySelectorAll("input:not([type='checkbox']):not([disabled]), select");
  let valid = true;

  inputs.forEach(input => {
    if (input.type === "password") {
      if (!validatePassword(input)) {
        input.classList.add("input-error");
        valid = false;
      } else {
        input.classList.remove("input-error");
      }
    } else if (!input.checkValidity() || input.value.trim() === "") {
      input.classList.add("input-error");
      valid = false;
    } else {
      input.classList.remove("input-error");
    }
  });

  return valid;
}

// ===== زر التالي =====
nextButtons.forEach(button => {
  button.addEventListener("click", () => {
    if (!validateStep(currentStep)) return;

    if (currentStep < steps.length - 1) {
      currentStep++;
      showStep(currentStep);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  });
});

// ===== زر الرجوع =====
prevButtons.forEach(button => {
  button.addEventListener("click", () => {
    if (currentStep > 0) {
      currentStep--;
      showStep(currentStep);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  });
});

// ===== منع إعادة تحميل الصفحة =====
document.getElementById("registerForm").addEventListener("submit", function (e) {
  e.preventDefault();
  if (!validateStep(currentStep)) return;
  console.log("تم التسجيل بنجاح ✅");
  alert("تم إنشاء الحساب بنجاح! ✅");
});

// ===== اختيار تشيك بوكس واحد فقط في الجنس =====
const singleChoices = document.querySelectorAll(".single-choice");
singleChoices.forEach(cb => {
  cb.addEventListener("change", () => {
    if (cb.checked) {
      singleChoices.forEach(other => {
        if (other !== cb) other.checked = false;
      });
    }
  });
});

// ===== تحديث checkboxes كلمة المرور أثناء الكتابة =====
const passwordInput = document.getElementById("password");
if (passwordInput) {
  passwordInput.addEventListener("input", () => validatePassword(passwordInput));
}

// ===== إظهار/إخفاء كلمة المرور =====
const togglePassword = document.getElementById("togglePassword");
if (togglePassword) {
  togglePassword.addEventListener("click", () => {
    const icon = togglePassword.querySelector("i");
    if (passwordInput.type === "password") {
      passwordInput.type = "text";
      icon.classList.replace("fa-eye", "fa-eye-slash");
    } else {
      passwordInput.type = "password";
      icon.classList.replace("fa-eye-slash", "fa-eye");
    }
  });
}