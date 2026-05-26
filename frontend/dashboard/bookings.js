const user = JSON.parse(localStorage.getItem("user"));

if (!user) {
  window.location.href = "../Pages/html/login.html";
}

// USER LOGOUT

const logoutBtn = document.getElementById("logoutBtn");

logoutBtn.addEventListener("click", () => {
  localStorage.removeItem("user");

  window.location.href = "../index.html";
});

// ELEMENTS

const providersGrid = document.getElementById("providersGrid");

const searchBtn = document.getElementById("searchBtn");

const searchInput = document.getElementById("searchInput");

const bookingsContainer = document.getElementById("bookingsContainer");

// LOAD PROVIDERS

async function loadProviders(service = "") {
  try {
    let url =
      "https://nexserve-hyperlocal-marketplace-platform.onrender.com/api/providers";

    if (service) {
      url += `/search/${service}`;
    }

    const response = await fetch(url);

    const data = await response.json();

    providersGrid.innerHTML = "";

    if (data.providers.length === 0) {
      providersGrid.innerHTML = `
        <h2>No providers found</h2>
      `;

      return;
    }

    data.providers.forEach((provider) => {
      providersGrid.innerHTML += `
      
      <div class="provider-card">

        <div class="provider-top">

          <img src="https://i.pravatar.cc/150?u=${provider.email}" />

          <div>
            <h3>${provider.name}</h3>

            <p>${provider.service}</p>
          </div>

        </div>

        <div class="provider-meta">

          <span>
            <i class="fa-solid fa-location-dot"></i>
            ${provider.location}
          </span>

          <span>
            <i class="fa-solid fa-briefcase"></i>
            ${provider.experience}
          </span>

          <span class="${
            provider.isAvailable ? "status-online" : "status-offline"
          }">
            <i class="fa-solid fa-circle"></i>
            ${provider.isAvailable ? "Available Now" : "Currently Unavailable"}
          </span>

        </div>

        <button class="book-btn">
          Book Service
        </button>

      </div>
      
      `;
    });
  } catch (error) {
    console.log(error);
  }
}

// SEARCH

searchBtn.addEventListener("click", () => {
  const service = searchInput.value;

  loadProviders(service);
});

// INITIAL LOAD

loadProviders();

// DUMMY BOOKINGS UI

bookingsContainer.innerHTML = `

<div class="booking-card">

  <div class="booking-left">
    <h3>Rahul Electrician</h3>

    <p>Electrical Wiring Service</p>
  </div>

  <div class="booking-status pending">
    Pending
  </div>

</div>

<div class="booking-card">

  <div class="booking-left">
    <h3>Priya Cleaning</h3>

    <p>Deep Home Cleaning</p>
  </div>

  <div class="booking-status accepted">
    Accepted
  </div>

</div>

`;
