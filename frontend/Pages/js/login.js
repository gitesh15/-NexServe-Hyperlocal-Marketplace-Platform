// ================= ROLE SWITCH =================

const customerRole = document.getElementById("customerRole");

const providerRole = document.getElementById("providerRole");

// DEFAULT ROLE
let selectedRole = "customer";

// CUSTOMER BUTTON
customerRole.addEventListener("click", () => {
  selectedRole = "customer";

  customerRole.classList.add("active-role");

  providerRole.classList.remove("active-role");
});

// PROVIDER BUTTON
providerRole.addEventListener("click", () => {
  selectedRole = "provider";

  providerRole.classList.add("active-role");

  customerRole.classList.remove("active-role");
});

// ================= LOGIN =================

const loginForm = document.getElementById("loginForm");

loginForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = document.getElementById("email").value;

  const password = document.getElementById("password").value;

  try {
    const response = await fetch(
      "https://nexserve-hyperlocal-marketplace-platform.onrender.com/api/auth/login",
      {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          email,
          password,
          role: selectedRole,
        }),
      },
    );

    const data = await response.json();

    // ERROR
    if (!response.ok) {
      alert(data.message);

      return;
    }

    // SAVE USER
    localStorage.setItem("user", JSON.stringify(data.user));

    alert("Login Successful");

    // REDIRECT
    if (data.user.role === "customer") {
      window.location.href = "../../dashboard/customer-dashboard.html";
    } else {
      window.location.href = "../../dashboard/provider-dashboard.html";
    }
  } catch (error) {
    console.log(error);

    alert("Server Error");
  }
});
