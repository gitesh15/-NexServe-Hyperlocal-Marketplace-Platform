// ============================
// CHECK USER
// ============================

const user = JSON.parse(localStorage.getItem("user"));

const navButtons = document.getElementById("navButtons");

// NOT LOGGED IN

if (!user) {
  window.location.href = "./Pages/html/login.html";
}

// ============================
// SHOW PROFILE BUTTON
// ============================

navButtons.innerHTML = `

  <button class="profile-btn" id="profileBtn">
    <i class="fa-solid fa-user"></i>
    ${user.name}
  </button>

  <button class="logout-btn" id="logoutBtn">
    Logout
  </button>

`;

// ============================
// PROFILE BUTTON
// ============================

const profileBtn = document.getElementById("profileBtn");

profileBtn.addEventListener("click", () => {
  // CUSTOMER

  if (user.role === "customer") {
    window.location.href = "./dashboard/customer-dashboard.html";
  }

  // PROVIDER
  else {
    window.location.href = "./dashboard/provider-dashboard.html";
  }
});

// ============================
// LOGOUT
// ============================

const logoutBtn = document.getElementById("logoutBtn");

logoutBtn.addEventListener("click", () => {
  localStorage.removeItem("user");

  window.location.href = "./index.html";
});
