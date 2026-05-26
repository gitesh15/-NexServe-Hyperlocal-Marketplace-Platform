// ====================================
// LOGIN CHECK
// ====================================

const loggedInUser = JSON.parse(localStorage.getItem("user"));

if (!loggedInUser) {
  window.location.href = "./login.html";
}

// ====================================
// ELEMENTS
// ====================================

const servicesGrid = document.getElementById("servicesGrid");

const searchInput = document.getElementById("searchInput");

const searchBtn = document.getElementById("searchBtn");

const filterButtons = document.querySelectorAll(".filter-btn");

const resultsCount = document.getElementById("resultsCount");

const modal = document.getElementById("serviceModal");

const closeModal = document.getElementById("closeModal");

// ====================================
// FETCH PROVIDERS
// ====================================

async function fetchProviders(service = "") {
  try {
    let url = "";

    // SEARCH PROVIDERS

    if (service && service !== "all") {
      url = `https://nexserve-hyperlocal-marketplace-platform.onrender.com/api/providers/search/${service}`;
    }

    // ALL PROVIDERS
    else {
      url =
        "https://nexserve-hyperlocal-marketplace-platform.onrender.com/api/providers";
    }

    const response = await fetch(url);

    const data = await response.json();

    renderProviders(data.providers);
  } catch (error) {
    console.log(error);

    alert("Server Error");
  }
}

// ====================================
// RENDER PROVIDERS
// ====================================

function renderProviders(providers) {
  servicesGrid.innerHTML = "";

  resultsCount.innerText = `${providers.length} providers found`;

  // NO PROVIDERS

  if (providers.length === 0) {
    servicesGrid.innerHTML = `
    
      <h2 class="no-results">
        No providers found
      </h2>
    
    `;

    return;
  }

  // LOOP

  providers.forEach((provider) => {
    servicesGrid.innerHTML += `
    
    <div class="provider-card">

      <div class="provider-top">

        <img
          src="https://i.pravatar.cc/150?u=${provider.email}"
          class="provider-img"
        />

        <div>

          <h3>${provider.name}</h3>

          <p>${provider.service}</p>

        </div>

      </div>

      <div class="provider-details">

        <span>
          <i class="fa-solid fa-location-dot"></i>
          ${provider.location}
        </span>

        <span>
          <i class="fa-solid fa-briefcase"></i>
          ${provider.experience}
        </span>

      </div>

      <button class="explore-btn">
        View Details
      </button>

    </div>
    
    `;
  });

  // ====================================
  // MODAL
  // ====================================

  const exploreButtons = document.querySelectorAll(".explore-btn");

  exploreButtons.forEach((button, index) => {
    button.addEventListener("click", () => {
      const provider = providers[index];

      document.getElementById("modalTitle").innerText = provider.name;

      document.getElementById("modalDescription").innerText =
        `${provider.service} expert available in ${provider.location}`;

      document.getElementById("modalProviders").innerText = provider.experience;

      document.getElementById("modalRating").innerText = "Verified";

      modal.classList.add("show-modal");
    });
  });
}

// ====================================
// INITIAL LOAD
// ====================================

fetchProviders();

// ====================================
// SEARCH BUTTON
// ====================================

searchBtn.addEventListener("click", () => {
  const service = searchInput.value.trim();

  fetchProviders(service);
});

// ====================================
// ENTER KEY SEARCH
// ====================================

searchInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    fetchProviders(searchInput.value.trim());
  }
});

// ====================================
// FILTER BUTTONS
// ====================================

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    filterButtons.forEach((btn) => {
      btn.classList.remove("active-filter");
    });

    button.classList.add("active-filter");

    const category = button.dataset.category;

    fetchProviders(category);
  });
});

// ====================================
// CLOSE MODAL
// ====================================

closeModal.addEventListener("click", () => {
  modal.classList.remove("show-modal");
});

// ====================================
// OUTSIDE CLICK CLOSE
// ====================================

window.addEventListener("click", (e) => {
  if (e.target === modal) {
    modal.classList.remove("show-modal");
  }
});

// ====================================
// AUTO SEARCH FROM HOME PAGE
// ====================================

const searchedService = localStorage.getItem("searchedService");

if (searchedService) {
  searchInput.value = searchedService;

  fetchProviders(searchedService);

  localStorage.removeItem("searchedService");
}
