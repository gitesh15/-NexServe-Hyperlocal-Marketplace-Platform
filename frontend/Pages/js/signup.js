let otpVerified = false;
let generatedOtp = "";
// ============================
// PASSWORD TOGGLE
// ============================

const togglePassword = document.getElementById("togglePassword");

const passwordInput = document.getElementById("password");

if (togglePassword && passwordInput) {
  togglePassword.addEventListener("click", () => {
    const type =
      passwordInput.getAttribute("type") === "password" ? "text" : "password";

    passwordInput.setAttribute("type", type);

    togglePassword.classList.toggle("fa-eye");

    togglePassword.classList.toggle("fa-eye-slash");
  });
}

// ============================
// PASSWORD STRENGTH
// ============================

const strengthText = document.getElementById("passwordStrength");

passwordInput.addEventListener("input", () => {
  const password = passwordInput.value;

  let strength = "Weak";

  if (
    password.length >= 8 &&
    /[A-Z]/.test(password) &&
    /[0-9]/.test(password)
  ) {
    strength = "Strong";
  } else if (password.length >= 6) {
    strength = "Medium";
  }

  strengthText.innerText = `Password Strength: ${strength}`;
});

// ============================
// ROLE SYSTEM
// ============================

let selectedRole = "customer";

const providerFields = document.querySelectorAll(".provider-field");

providerFields.forEach((field) => {
  field.style.display = "none";
});

const roleButtons = document.querySelectorAll(".role-btn");

roleButtons.forEach((button) => {
  button.addEventListener("click", () => {
    roleButtons.forEach((btn) => {
      btn.classList.remove("active-role");
    });

    button.classList.add("active-role");

    selectedRole = button.dataset.role;

    if (selectedRole === "provider") {
      providerFields.forEach((field) => {
        field.style.display = "block";
      });
    } else {
      providerFields.forEach((field) => {
        field.style.display = "none";
      });
    }
  });
});

// ============================
// ELEMENTS
// ============================

const authForm = document.querySelector(".auth-form");

const signupBtn = document.querySelector(".auth-btn");

const otpSection = document.getElementById("otpSection");

const otpInput = document.getElementById("otp");

const verifyOtpBtn = document.getElementById("verifyOtpBtn");

// ============================
// SEND OTP + REGISTER FLOW
// ============================

authForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  // ============================
  // GET VALUES
  // ============================

  const name = document.getElementById("name").value.trim();

  const email = document.getElementById("email").value.trim();

  const mobile = document.getElementById("mobile").value.trim();

  const password = passwordInput.value.trim();

  // ============================
  // VALIDATION
  // ============================

  if (!name || !email || !mobile || !password) {
    alert("Please fill all fields");

    return;
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailRegex.test(email)) {
    alert("Enter valid email");

    return;
  }

  const mobileRegex = /^[6-9]\d{9}$/;

  if (!mobileRegex.test(mobile)) {
    alert("Enter valid mobile number");

    return;
  }

  if (password.length < 6) {
    alert("Password must be at least 6 characters");

    return;
  }

  // ============================
  // USER DATA
  // ============================

  let userData = {
    name,
    email,
    mobile,
    password,
    role: selectedRole,
  };

  // ============================
  // PROVIDER DATA
  // ============================

  if (selectedRole === "provider") {
    const service = document.getElementById("service").value.trim();

    const location = document.getElementById("location").value.trim();

    const experience = document.getElementById("experience").value.trim();

    if (!service || !location || !experience) {
      alert("Please fill provider details");

      return;
    }

    userData.service = service;

    userData.location = location;

    userData.experience = experience;
  }

  // ============================
  // IF OTP NOT VERIFIED
  // ============================

  if (!otpVerified) {
    try {
      signupBtn.innerText = "Sending OTP...";

      signupBtn.disabled = true;

      const response = await fetch(
        "https://nexserve-hyperlocal-marketplace-platform.onrender.com/api/otp/send-otp",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            email,
          }),
        },
      );

      const data = await response.json();

      signupBtn.innerText = "Continue";

      signupBtn.disabled = false;

      if (!response.ok) {
        alert(data.message);

        return;
      }

      generatedOtp = data.otp;

      document.getElementById("captchaPopup").style.display = "flex";

      otpSection.style.display = "block";
    } catch (error) {
      console.log(error);

      signupBtn.innerText = "Continue";

      signupBtn.disabled = false;

      alert("Server Error");
    }

    return;
  }

  // ============================
  // FINAL REGISTER
  // ============================

  try {
    signupBtn.innerText = "Creating Account...";

    signupBtn.disabled = true;

    const response = await fetch(
      "https://nexserve-hyperlocal-marketplace-platform.onrender.com/api/auth/register",
      {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify(userData),
      },
    );

    const data = await response.json();

    signupBtn.innerText = "Continue";

    signupBtn.disabled = false;

    if (response.ok) {
      // STORE JWT TOKEN

      localStorage.setItem("token", data.token);

      localStorage.setItem("user", JSON.stringify(data.user));

      alert("Signup Successful");

      window.location.href = "login.html";
    } else {
      alert(data.message);
    }
  } catch (error) {
    console.log(error);

    signupBtn.innerText = "Continue";

    signupBtn.disabled = false;

    alert("Server Error");
  }
});

// ============================
// VERIFY OTP
// ============================

verifyOtpBtn.addEventListener("click", async () => {
  const email = document.getElementById("email").value.trim();

  const otp = otpInput.value.trim();

  if (!otp) {
    alert("Enter OTP");

    return;
  }

  try {
    verifyOtpBtn.innerText = "Verifying...";

    verifyOtpBtn.disabled = true;

    const response = await fetch(
      "https://nexserve-hyperlocal-marketplace-platform.onrender.com/api/otp/verify",
      {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          email,
          otp,
        }),
      },
    );

    const data = await response.json();

    verifyOtpBtn.disabled = false;

    if (response.ok) {
      otpVerified = true;

      verifyOtpBtn.innerText = "Verified";

      verifyOtpBtn.style.background = "#22c55e";

      alert("Email verified successfully");
    } else {
      verifyOtpBtn.innerText = "Verify OTP";

      alert(data.message);
    }
  } catch (error) {
    console.log(error);

    verifyOtpBtn.innerText = "Verify OTP";

    verifyOtpBtn.disabled = false;

    alert("Server Error");
  }
});
// CAPTCHA OTP REVEAL

const showOtpBtn = document.getElementById("showOtpBtn");

showOtpBtn.addEventListener("click", () => {
  const captchaTick = document.getElementById("captchaTick");

  if (!captchaTick.checked) {
    alert("Please verify captcha");

    return;
  }

  document.getElementById("demoOtp").innerText = generatedOtp;
});
