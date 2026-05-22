// ============================
// LOGIN CHECK
// ============================

const user = JSON.parse(localStorage.getItem("user"));

// ONLY CUSTOMER

if (!user) {
  alert("Please login first");

  window.location.href = "./login.html";
}

if (user.role !== "customer") {
  alert("Only customers can search services");

  window.location.href = "../../home/home.html";
}

// ============================
// ELEMENTS
// ============================

const searchBtn = document.getElementById("searchBtn");

const searchInput = document.getElementById("searchInput");

const servicesGrid = document.getElementById("servicesGrid");

const resultsCount = document.getElementById("resultsCount");

// ============================
// SEARCH FUNCTION
// ============================

searchBtn.addEventListener("click", async () => {
  const service = searchInput.value.trim();

  // VALIDATION

  if (!service) {
    alert("Enter service name");

    return;
  }

  try {
    // LOADING

    servicesGrid.innerHTML = `
      <h2 class="loading-text">
        Searching providers...
      </h2>
    `;

    // API CALL

    const response = await fetch(
      `https://nexserve-hyperlocal-marketplace-platform.onrender.com/api/providers/search/${service}`,
    );

    const data = await response.json();

    // CLEAR GRID

    servicesGrid.innerHTML = "";

    // RESULTS COUNT

    resultsCount.innerText = `${data.providers.length} providers found`;

    // NO PROVIDERS

    if (data.providers.length === 0) {
      servicesGrid.innerHTML = `
        <div class="no-results">
          <h2>No providers found</h2>
          <p>Try searching another service</p>
        </div>
      `;

      return;
    }

    // SHOW PROVIDERS

    data.providers.forEach((provider) => {
      servicesGrid.innerHTML += `
      
      <div class="provider-card">

        <div class="provider-top">

          <img
            src="https://i.pravatar.cc/150?u=${provider.email}"
            class="provider-image"
          />

          <div>

            <h3>${provider.name}</h3>

            <p class="provider-service">
              ${provider.service}
            </p>

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

        <div class="provider-distance">

          <i class="fa-solid fa-route"></i>

          2.4 KM Away

        </div>

        <button class="book-provider-btn">
          Book Now
        </button>

      </div>
      
      `;
    });
  } catch (error) {
    console.log(error);

    alert("Server Error");
  }
});
