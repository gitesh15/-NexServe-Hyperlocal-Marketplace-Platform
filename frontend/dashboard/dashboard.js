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

const userName = document.getElementById("userName");

const logoutBtn = document.getElementById("logoutBtn");

const dashboardSearchBtn = document.getElementById("dashboardSearchBtn");

const dashboardSearchInput = document.getElementById("dashboardSearchInput");

const providersGrid = document.getElementById("providersGrid");

const customerBookings = document.getElementById("customerBookings");

const bookingMenu = document.getElementById("bookingMenu");

// ====================================
// USER DATA
// ====================================

if (userName) {
  userName.innerText = user.name || "Customer";
}

// ====================================
// LOGOUT
// ====================================

if (logoutBtn) {
  logoutBtn.addEventListener("click", () => {
    localStorage.removeItem("user");

    window.location.href = "../index.html";
  });
}

// ====================================
// BOOKING MENU
// ====================================

if (bookingMenu) {
  bookingMenu.addEventListener("click", () => {
    window.location.href = "../pages/search-services.html";
  });
}

// ====================================
// SEARCH PROVIDERS
// ====================================

async function searchProviders(service = "") {
  try {
    let url =
      "https://nexserve-hyperlocal-marketplace-platform.onrender.com/api/providers";

    if (service) {
      url = `https://nexserve-hyperlocal-marketplace-platform.onrender.com/api/providers/search/${service}`;
    }

    const response = await fetch(url);

    const data = await response.json();

    renderProviders(data.providers || []);
  } catch (error) {
    console.log(error);

    providersGrid.innerHTML = `
    
      <div class="empty-state">
        <h2>Server Error</h2>
      </div>
    
    `;
  }
}

// ====================================
// RENDER PROVIDERS
// ====================================

function renderProviders(providers) {
  if (!providersGrid) return;

  providersGrid.innerHTML = "";

  // FILTER AVAILABLE PROVIDERS

  const availableProviders = providers.filter(
    (provider) => provider.availability === true,
  );

  // COUNTS

  const onlineProvidersCount = document.getElementById("onlineProvidersCount");

  if (onlineProvidersCount) {
    onlineProvidersCount.innerText = availableProviders.length;
  }

  // EMPTY

  if (availableProviders.length === 0) {
    providersGrid.innerHTML = `
    
      <div class="empty-state">

        <i class="fa-solid fa-user-xmark"></i>

        <h2>No Providers Available</h2>

        <p>Try another service search.</p>

      </div>
    
    `;

    return;
  }

  // LOOP

  availableProviders.forEach((provider) => {
    providersGrid.innerHTML += `
    
    <div class="provider-card">

      <div class="provider-top">

        <img
          src="https://i.pravatar.cc/150?u=${provider.email}"
          alt="${provider.name}"
        />

        <div>

          <h3>${provider.name}</h3>

          <p>${provider.service}</p>

        </div>

      </div>

      <div class="provider-meta">

        <span>
          <i class="fa-solid fa-location-dot"></i>
          ${provider.location || "India"}
        </span>

        <span>
          <i class="fa-solid fa-briefcase"></i>
          ${provider.experience || "1+ Years"}
        </span>

      </div>

      <div class="provider-bottom">

        <div class="online-badge">

          <i class="fa-solid fa-circle"></i>

          Available

        </div>

        <button
          class="provider-book-btn"
          onclick="openBookingPage('${provider.service}')"
        >
          Book Service
        </button>

      </div>

    </div>
    
    `;
  });
}

// ====================================
// OPEN BOOKING PAGE
// ====================================

function openBookingPage(service) {
  localStorage.setItem("searchedService", service);

  window.location.href = "../pages/search-services.html";
}

// ====================================
// SEARCH BUTTON
// ====================================

if (dashboardSearchBtn) {
  dashboardSearchBtn.addEventListener("click", () => {
    const service = dashboardSearchInput.value.trim();

    searchProviders(service);
  });
}

// ====================================
// ENTER SEARCH
// ====================================

if (dashboardSearchInput) {
  dashboardSearchInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      searchProviders(dashboardSearchInput.value.trim());
    }
  });
}

// ====================================
// LOAD BOOKINGS
// ====================================

async function loadBookings() {
  try {
    const response = await fetch(
      `https://nexserve-hyperlocal-marketplace-platform.onrender.com/api/bookings/customer/${user._id}`,
    );

    const data = await response.json();

    const bookings = data.bookings || [];

    // ACTIVE BOOKINGS COUNT

    const activeBookingsCount = document.getElementById("activeBookingsCount");

    if (activeBookingsCount) {
      activeBookingsCount.innerText = bookings.length;
    }

    // TOTAL BOOKINGS COUNT

    const totalBookingsCount = document.getElementById("totalBookingsCount");

    if (totalBookingsCount) {
      totalBookingsCount.innerText = bookings.length;
    }

    // PENDING BOOKINGS

    const pendingBookings = bookings.filter(
      (booking) => booking.status === "pending",
    );

    const pendingServicesCount = document.getElementById(
      "pendingServicesCount",
    );

    if (pendingServicesCount) {
      pendingServicesCount.innerText = pendingBookings.length;
    }

    // EMPTY

    if (!customerBookings) return;

    customerBookings.innerHTML = "";

    if (bookings.length === 0) {
      customerBookings.innerHTML = `
      
      <div class="empty-booking">

        <i class="fa-solid fa-calendar-xmark"></i>

        <h3>No Bookings Yet</h3>

        <p>Your booking requests will appear here.</p>

      </div>
      
      `;

      return;
    }

    // BOOKINGS

    bookings.forEach((booking) => {
      customerBookings.innerHTML += `
      
      <div class="booking-card modern-booking-card">

        <div class="booking-left">

          <div class="booking-avatar">
            ${booking.providerName.charAt(0).toUpperCase()}
          </div>

          <div>

            <h3>${booking.providerName}</h3>

            <p>${booking.service}</p>

            <span>

              <i class="fa-solid fa-calendar"></i>

              ${booking.date}

            </span>

            <span>

              <i class="fa-solid fa-clock"></i>

              ${booking.time}

            </span>

          </div>

        </div>

        <div class="booking-right">

          <div class="booking-status ${booking.status}">

            ${booking.status}

          </div>

          ${
            booking.status === "accepted"
              ? `
              
              <div class="accepted-info">

                <i class="fa-solid fa-circle-check"></i>

                Provider accepted your booking

              </div>
              
              `
              : `
              
              <div class="pending-info">

                <i class="fa-solid fa-hourglass-half"></i>

                Waiting for provider response

              </div>
              
              `
          }

        </div>

      </div>
      
      `;
    });
  } catch (error) {
    console.log(error);

    if (customerBookings) {
      customerBookings.innerHTML = `
      
      <div class="empty-booking">

        <h3>Failed to load bookings</h3>

      </div>
      
      `;
    }
  }
}

// ====================================
// HERO BUTTON
// ====================================

const exploreBtn = document.querySelector(".hero-content button");

if (exploreBtn) {
  exploreBtn.addEventListener("click", () => {
    window.location.href = "../pages/search-services.html";
  });
}

// ====================================
// INITIAL LOAD
// ====================================

searchProviders();

loadBookings();
