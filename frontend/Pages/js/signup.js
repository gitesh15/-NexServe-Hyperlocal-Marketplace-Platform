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

let selectedRole = "customer";

const roleButtons = document.querySelectorAll(".role-btn");

roleButtons.forEach((button) => {
  button.addEventListener("click", () => {
    roleButtons.forEach((btn) => {
      btn.classList.remove("active-role");
    });

    button.classList.add("active-role");

    selectedRole = button.dataset.role;

    console.log("Selected Role:", selectedRole);
  });
});

// ============================
// SIGNUP FORM
// ============================

const authForm = document.querySelector(".auth-form");

authForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const name = document.getElementById("name").value.trim();

  const email = document.getElementById("email").value.trim();

  const password = document.getElementById("password").value.trim();

  // VALIDATION

  if (!name || !email || !password) {
    alert("Please fill all fields");

    return;
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

        body: JSON.stringify({
          name,
          email,
          password,
          role: selectedRole,
        }),
      },
    );

    const data = await response.json();

    console.log(data);

    // SUCCESS

    if (response.ok) {
      localStorage.setItem("nexserveUser", JSON.stringify(data.user));

      alert("Signup Successful");

      // REDIRECT

      window.location.href = "./login.html";
    }

    // ERROR
    else {
      alert(data.message || "Signup failed");
    }
  } catch (error) {
    console.log(error);

    alert("Cannot connect to server. Check Render backend or MongoDB.");
  }
});
