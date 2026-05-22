// ============================
// PASSWORD TOGGLE
// ============================

const togglePassword = document.getElementById("togglePassword");

const password = document.getElementById("password");

if (togglePassword && password) {
  togglePassword.addEventListener("click", () => {
    const type =
      password.getAttribute("type") === "password" ? "text" : "password";

    password.setAttribute("type", type);

    togglePassword.classList.toggle("fa-eye");

    togglePassword.classList.toggle("fa-eye-slash");
  });
}

// ============================
// ROLE SYSTEM
// ============================

// DEFAULT ROLE

let selectedRole = "customer";

// PROVIDER FIELDS

const providerFields = document.querySelectorAll(".provider-field");

// HIDE PROVIDER FIELDS INITIALLY

providerFields.forEach((field) => {
  field.style.display = "none";
});

// ROLE BUTTONS

const roleButtons = document.querySelectorAll(".role-btn");

// ROLE SWITCH

roleButtons.forEach((button) => {
  button.addEventListener("click", () => {
    // REMOVE ACTIVE CLASS

    roleButtons.forEach((btn) => {
      btn.classList.remove("active-role");
    });

    // ADD ACTIVE CLASS

    button.classList.add("active-role");

    // SAVE ROLE

    selectedRole = button.dataset.role;

    console.log("Selected Role:", selectedRole);

    // SHOW/HIDE PROVIDER FIELDS

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
// SIGNUP FORM
// ============================

const authForm = document.querySelector(".auth-form");

// SUBMIT

authForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  // COMMON FIELDS

  const name = document.getElementById("name").value;

  const email = document.getElementById("email").value;

  const password = document.getElementById("password").value;

  // VALIDATION

  if (!name || !email || !password) {
    alert("Please fill all fields");

    return;
  }

  // BODY OBJECT

  let userData = {
    name,
    email,
    password,
    role: selectedRole,
  };

  // ============================
  // PROVIDER DATA
  // ============================

  if (selectedRole === "provider") {
    const service = document.getElementById("service").value;

    const location = document.getElementById("location").value;

    const experience = document.getElementById("experience").value;

    // VALIDATE PROVIDER FIELDS

    if (!service || !location || !experience) {
      alert("Please fill provider details");

      return;
    }

    // ADD TO BODY

    userData.service = service;

    userData.location = location;

    userData.experience = experience;
  }

  try {
    // API CALL

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

    // JSON

    const data = await response.json();

    console.log(data);

    // SUCCESS

    if (response.ok) {
      localStorage.setItem("nexserveUser", JSON.stringify(data.user));

      alert("Signup Successful");

      // REDIRECT

      window.location.href = "login.html";
    }

    // ERROR
    else {
      alert(data.message);
    }
  } catch (error) {
    console.log(error);

    alert("Server Error");
  }
});
