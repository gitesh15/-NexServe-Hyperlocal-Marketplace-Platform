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

// ALL ROLE BUTTONS
const roleButtons = document.querySelectorAll(".role-btn");

// LOOP THROUGH BUTTONS
roleButtons.forEach((button) => {
  button.addEventListener("click", () => {
    // REMOVE ACTIVE CLASS FROM ALL BUTTONS

    roleButtons.forEach((btn) => {
      btn.classList.remove("active-role");
    });

    // ADD ACTIVE CLASS TO CLICKED BUTTON

    button.classList.add("active-role");

    // SAVE ROLE

    selectedRole = button.dataset.role;

    console.log("Selected Role:", selectedRole);
  });
});

// ============================
// SIGNUP FORM
// ============================

const authForm = document.querySelector(".auth-form");

// FORM SUBMIT
authForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  // GET INPUT VALUES

  const name = document.getElementById("name").value;

  const email = document.getElementById("email").value;

  const password = document.getElementById("password").value;

  // VALIDATION

  if (!name || !email || !password) {
    alert("Please fill all fields");

    return;
  }

  try {
    // API CALL

    const response = await fetch("http://localhost:5000/api/auth/register", {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify({
        name,
        email,
        password,
        role: selectedRole,
      }),
    });

    // CONVERT RESPONSE TO JSON

    const data = await response.json();

    console.log(data);

    // ============================
    // SUCCESS
    // ============================

    if (response.ok) {
      // SAVE USER IN LOCAL STORAGE

      localStorage.setItem("nexserveUser", JSON.stringify(data.user));

      alert("Signup Successful");

      // REDIRECT TO LOGIN PAGE

      window.location.href = "login.html";
    }

    // ============================
    // ERROR
    // ============================
    else {
      alert(data.message);
    }
  } catch (error) {
    console.log(error);

    alert("Server Error");
  }
});
