const steps = document.querySelectorAll(".step");
const emailNextBtn = document.getElementById("emailNextBtn");
const codeNextBtn = document.getElementById("codeNextBtn");
const skipToPassword = document.getElementById("skipToPassword");
const loginForm = document.getElementById("loginForm");

let currentStep = 0;

function goToStep(index) {
  steps[currentStep].classList.remove("active");
  currentStep = index;
  steps[currentStep].classList.add("active");
}

// ===== خطوة 1: الإيميل =====
emailNextBtn.addEventListener("click", () => {
  const email = document.getElementById("loginEmail");
  const errorMsg = email.nextElementSibling;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailRegex.test(email.value)) {
    email.classList.add("input-error");
    errorMsg.style.display = "block";
    return;
  }

  email.classList.remove("input-error");
  errorMsg.style.display = "none";

  // هنا يُرسل الكود تلقائياً للإيميل
  console.log(`تم إرسال كود التحقق إلى: ${email.value}`);

  goToStep(1);
});

// ===== خطوة 2: الكود =====

// زر "تسجيل الدخول" بالكود
codeNextBtn.addEventListener("click", () => {
  const code = document.getElementById("loginCode");
  const errorMsg = code.nextElementSibling;

  if (code.value.trim() === "") {
    code.classList.add("input-error");
    errorMsg.style.display = "block";
    return;
  }

  code.classList.remove("input-error");
  errorMsg.style.display = "none";

  // هنا ترسل الكود للـ backend للتحقق منه
  console.log("تم تسجيل الدخول بالكود ✅");
  alert("تم تسجيل الدخول بنجاح! ✅");
});

// زر "أدخل كلمة المرور بدلاً من ذلك"
skipToPassword.addEventListener("click", () => {
  goToStep(2);
});

// ===== أزرار الرجوع =====
document.querySelectorAll(".prevBtn").forEach((btn) => {
  btn.addEventListener("click", () => {
    if (currentStep > 0) {
      goToStep(currentStep - 1); // دائماً يرجع خطوة واحدة للخلف
    }
  });
});

// ===== خطوة 3: كلمة المرور =====
loginForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const password = document.getElementById("loginPassword");
  const errorMsg = password.nextElementSibling;

  if (password.value.trim() === "") {
    password.classList.add("input-error");
    errorMsg.style.display = "block";
    return;
  }

  password.classList.remove("input-error");
  errorMsg.style.display = "none";

  console.log("تم تسجيل الدخول بكلمة المرور ✅");
  alert("تم تسجيل الدخول بنجاح! ✅");
});