// ============================
// NAVBAR BUTTONS
// ============================

const navButtons = document.getElementById("navButtons");

// GET USER FROM LOCAL STORAGE

const loggedInUser = JSON.parse(localStorage.getItem("user"));

// ============================
// IF USER LOGGED IN
// ============================

if (loggedInUser) {
  navButtons.innerHTML = `
  
    <button class="profile-btn" id="profileBtn">
      <i class="fa-solid fa-user"></i>
      ${loggedInUser.name}
    </button>

    <button class="logout-btn" id="logoutBtn">
      Logout
    </button>

  `;

  // PROFILE BUTTON

  const profileBtn = document.getElementById("profileBtn");

  profileBtn.addEventListener("click", () => {
    // CUSTOMER DASHBOARD

    if (loggedInUser.role === "customer") {
      window.location.href = "./dashboard/customer-dashboard.html";
    }

    // PROVIDER DASHBOARD
    else {
      window.location.href = "./dashboard/provider-dashboard.html";
    }
  });

  // LOGOUT BUTTON

  const logoutBtn = document.getElementById("logoutBtn");

  logoutBtn.addEventListener("click", () => {
    localStorage.removeItem("user");

    window.location.reload();
  });
}

// ============================
// IF USER NOT LOGGED IN
// ============================
else {
  navButtons.innerHTML = `
  
    <button class="login-btn" id="loginBtn">
      Login
    </button>

    <button class="signup-btn" id="signupBtn">
      Sign Up
    </button>

  `;

  // LOGIN PAGE

  document.getElementById("loginBtn").addEventListener("click", () => {
    window.location.href = "./Pages/html/login.html";
  });

  // SIGNUP PAGE

  document.getElementById("signupBtn").addEventListener("click", () => {
    window.location.href = "./Pages/html/signup.html";
  });
}

// ============================
// SEARCH SERVICE CARD
// ============================

const searchCard = document.querySelector(".step-card");

if (searchCard) {
  searchCard.addEventListener("click", () => {
    // CHECK LOGIN

    if (!loggedInUser) {
      alert("Please login as customer first");

      window.location.href = "./Pages/html/login.html";

      return;
    }

    // CUSTOMER ONLY

    if (loggedInUser.role !== "customer") {
      alert("Only customers can search services");

      return;
    }

    // OPEN SEARCH PAGE

    window.location.href = "./Pages/html/search-services.html";
  });
}
