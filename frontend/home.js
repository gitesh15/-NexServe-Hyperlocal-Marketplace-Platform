// ============================
// GET USER
// ============================

const user = JSON.parse(localStorage.getItem("user"));

const navButtons = document.getElementById("navButtons");

const userName = document.getElementById("userName");

// ============================
// IF USER NOT LOGGED IN
// ============================

if (!user) {
  window.location.href = "./Pages/html/login.html";
}

// ============================
// SHOW USER NAME
// ============================

userName.innerText = user.name;

// ============================
// NAVBAR BUTTONS
// ============================

// CUSTOMER
if (user.role === "customer") {
  navButtons.innerHTML = `

    <button class="profile-btn" id="profileBtn">
      <i class="fa-solid fa-user"></i>
      ${user.name}
    </button>

    <button class="logout-btn" id="logoutBtn">
      Logout
    </button>

  `;
}

// PROVIDER
else {
  navButtons.innerHTML = `

    <button class="profile-btn" id="profileBtn">
      <i class="fa-solid fa-briefcase"></i>
      ${user.service || "Provider"}
    </button>

    <button class="logout-btn" id="logoutBtn">
      Logout
    </button>

  `;
}

// ============================
// PROFILE BUTTON
// ============================

const profileBtn = document.getElementById("profileBtn");

profileBtn.addEventListener("click", () => {
  // CUSTOMER DASHBOARD

  if (user.role === "customer") {
    window.location.href = "./dashboard/customer-dashboard.html";
  }

  // PROVIDER DASHBOARD
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

// ============================
// SEARCH BUTTON
// ============================

const searchBtn = document.getElementById("searchBtn");

searchBtn.addEventListener("click", () => {
  // ONLY CUSTOMER CAN SEARCH

  if (user.role !== "customer") {
    alert("Providers cannot search services");

    return;
  }

  const service = document.getElementById("serviceSearch").value;

  // SAVE SEARCH

  localStorage.setItem("searchedService", service);

  // OPEN SEARCH PAGE

  window.location.href = "./Pages/html/search-services.html";
});
