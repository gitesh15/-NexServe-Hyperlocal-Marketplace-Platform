// ============================
// GET USER
// ============================

const user = JSON.parse(localStorage.getItem("user"));

// ============================
// LOGIN CHECK
// ============================

if (!user) {
  window.location.href = "../Pages/html/login.html";
}

// ============================
// ELEMENTS
// ============================

const navButtons = document.getElementById("navButtons");

const userName = document.getElementById("userName");

const searchBtn = document.getElementById("searchBtn");

const providersGrid = document.getElementById("providersGrid");

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
      ${user.name}
    </button>

    <button class="logout-btn" id="logoutBtn">
      Logout
    </button>

  `;
}

// ============================
// BUTTONS
// ============================

const profileBtn = document.getElementById("profileBtn");

const logoutBtn = document.getElementById("logoutBtn");

// ============================
// PROFILE BUTTON
// ============================

profileBtn.addEventListener("click", () => {
  // CUSTOMER

  if (user.role === "customer") {
    window.location.href = "../dashboard/customer-dashboard.html";
  }

  // PROVIDER
  else {
    window.location.href = "../dashboard/provider-dashboard.html";
  }
});

// ============================
// LOGOUT
// ============================

logoutBtn.addEventListener("click", () => {
  localStorage.removeItem("user");

  window.location.href = "../index.html";
});

// ============================
// SEARCH BUTTON
// ============================

searchBtn.addEventListener("click", () => {
  // ONLY CUSTOMER

  if (user.role !== "customer") {
    alert("Providers cannot search services");

    return;
  }

  const service = document.getElementById("serviceSearch").value;

  // SAVE SEARCH

  localStorage.setItem("searchedService", service);

  // OPEN SEARCH PAGE

  window.location.href = "../Pages/html/search-services.html";
});

// ============================
// LOAD REAL PROVIDERS
// ============================

async function loadProviders() {
  try {
    const response = await fetch(
      "https://nexserve-hyperlocal-marketplace-platform.onrender.com/api/providers",
    );

    const data = await response.json();

    providersGrid.innerHTML = "";

    // NO PROVIDERS

    if (data.providers.length === 0) {
      providersGrid.innerHTML = `
      
        <h2 class="no-provider-text">
          No providers available
        </h2>

      `;

      return;
    }

    // SHOW PROVIDERS

    data.providers.forEach((provider) => {
      providersGrid.innerHTML += `
      
      <div class="provider-card">

        <div class="provider-top">

          <div class="provider-avatar">
            ${provider.name.charAt(0)}
          </div>

          <div>

            <h3>${provider.name}</h3>

            <span>${provider.service}</span>

          </div>

        </div>

        <div class="provider-meta">

          <p>
            <i class="fa-solid fa-location-dot"></i>

            ${provider.location}
          </p>

          <p>
            <i class="fa-solid fa-briefcase"></i>

            ${provider.experience}
          </p>

        </div>

        <button class="book-btn">
          Book Now
        </button>

      </div>
      
      `;
    });
  } catch (error) {
    console.log(error);
  }
}

// ============================
// CALL FUNCTION
// ============================

loadProviders();
