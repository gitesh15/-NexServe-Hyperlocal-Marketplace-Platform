// ====================================
// LOGIN CHECK
// ====================================

const user = JSON.parse(localStorage.getItem("user"));

if (!user) {
  window.location.href = "../Pages/html/login.html";
}

// ====================================
// ELEMENTS
// ====================================

const providersGrid = document.getElementById("providersGrid");

const searchInput = document.getElementById("searchInput");

const searchBtn = document.getElementById("searchBtn");

const resultsCount = document.getElementById("resultsCount");

// ====================================
// FETCH PROVIDERS
// ====================================

async function fetchProviders(service = "") {
  try {
    let url = "";

    if (service) {
      url = `https://nexserve-hyperlocal-marketplace-platform.onrender.com/api/providers/search/${service}`;
    } else {
      url =
        "https://nexserve-hyperlocal-marketplace-platform.onrender.com/api/providers";
    }

    const response = await fetch(url);

    const data = await response.json();

    let providers = data.providers || [];

    providers = providers.filter((provider) => provider.availability === true);

    renderProviders(providers);
  } catch (error) {
    console.log(error);

    providersGrid.innerHTML = `
    
    <div class="empty-state">
      Server Error
    </div>

    `;
  }
}

// ====================================
// RENDER
// ====================================

function renderProviders(providers) {
  providersGrid.innerHTML = "";

  resultsCount.innerText = `${providers.length} providers found`;

  if (providers.length === 0) {
    providersGrid.innerHTML = `
    
    <div class="empty-state">
      No providers found
    </div>

    `;

    return;
  }

  providers.forEach((provider) => {
    providersGrid.innerHTML += `
    
    <div class="provider-card">

      <div class="provider-top">

        <img
          src="https://i.pravatar.cc/150?u=${provider.email}"
        />

        <div>
          <h3>${provider.name}</h3>

          <p>${provider.service}</p>
        </div>

      </div>

      <div class="provider-details">

        <span>
          <i class="fa-solid fa-location-dot"></i>
          ${provider.location || "India"}
        </span>

        <span>
          <i class="fa-solid fa-briefcase"></i>
          ${provider.experience || "Experienced"}
        </span>

      </div>

      <div class="provider-bottom">

        <div class="provider-status status-online">

          <span class="status-dot"></span>

          Online Now

        </div>

      </div>

    </div>

    `;
  });
}

// ====================================
// SEARCH BUTTON
// ====================================

if (searchBtn) {
  searchBtn.addEventListener("click", () => {
    const service = searchInput.value.trim();

    fetchProviders(service);
  });
}

// ====================================
// ENTER SEARCH
// ====================================

if (searchInput) {
  searchInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      fetchProviders(searchInput.value.trim());
    }
  });
}

// ====================================
// CHIP SEARCH
// ====================================

const chipButtons = document.querySelectorAll(".chip-btn");

chipButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const service = button.innerText;

    searchInput.value = service;

    fetchProviders(service);
  });
});

// ====================================
// AUTO SEARCH
// ====================================

const searchedService = localStorage.getItem("searchedService");

if (searchedService) {
  searchInput.value = searchedService;

  fetchProviders(searchedService);

  localStorage.removeItem("searchedService");
} else {
  fetchProviders();
}
