// ====================================
// LOGIN CHECK
// ====================================

const user = JSON.parse(localStorage.getItem("user"));

if (!user) {
  window.location.href = "../Pages/html/login.html";
}

// ====================================
// USER DATA
// ====================================

const userName = document.getElementById("userName");

const dashboardUserName = document.getElementById("dashboardUserName");

if (userName) {
  userName.innerText = user.name;
}

if (dashboardUserName) {
  dashboardUserName.innerText = user.name;
}

// ====================================
// LOGOUT
// ====================================

const logoutBtn = document.getElementById("logoutBtn");

if (logoutBtn) {
  logoutBtn.addEventListener("click", () => {
    localStorage.removeItem("user");

    window.location.href = "../index.html";
  });
}

// ====================================
// SIDEBAR BOOKINGS BUTTON
// ====================================

const bookingMenu = document.getElementById("bookingMenu");

if (bookingMenu) {
  bookingMenu.addEventListener("click", () => {
    window.location.href = "./bookings.html";
  });
}

// ====================================
// SEARCH
// ====================================

const dashboardSearchBtn = document.getElementById("dashboardSearchBtn");

const dashboardSearchInput = document.getElementById("dashboardSearchInput");

if (dashboardSearchBtn) {
  dashboardSearchBtn.addEventListener("click", () => {
    const service = dashboardSearchInput.value.trim();

    if (!service) return;

    localStorage.setItem("searchedService", service);

    window.location.href = "../pages/search-services.html";
  });
}

// ====================================
// LOAD PROVIDERS
// ====================================

async function loadProviders() {
  const providersGrid = document.getElementById("providersGrid");

  if (!providersGrid) return;

  try {
    const response = await fetch(
      "https://nexserve-hyperlocal-marketplace-platform.onrender.com/api/providers",
    );

    const data = await response.json();

    const providers = data.providers.filter(
      (provider) => provider.availability === true,
    );

    providersGrid.innerHTML = "";

    // ONLINE COUNT

    const onlineProviders = document.getElementById("onlineProviders");

    const onlineProvidersCount = document.getElementById(
      "onlineProvidersCount",
    );

    if (onlineProviders) {
      onlineProviders.innerText = providers.length;
    }

    if (onlineProvidersCount) {
      onlineProvidersCount.innerText = providers.length;
    }

    // EMPTY

    if (providers.length === 0) {
      providersGrid.innerHTML = `
      
      <div class="empty-booking">
        No providers online
      </div>

      `;

      return;
    }

    // CARDS

    providers.slice(0, 6).forEach((provider) => {
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

            <span class="online-badge">
              Available
            </span>

            <button
              class="provider-book-btn"
              onclick="window.location.href='../pages/search-services.html'"
            >
              Explore All
            </button>

          </div>

        </div>

        `;
    });
  } catch (error) {
    console.log(error);
  }
}

// ====================================
// LOAD BOOKINGS
// ====================================

function loadBookings() {
  const customerBookings = document.getElementById("customerBookings");

  if (!customerBookings) return;

  const bookings = JSON.parse(localStorage.getItem("customerBookings")) || [];

  // COUNTS

  const totalBookings = document.getElementById("totalBookings");

  const activeBookingsCount = document.getElementById("activeBookingsCount");

  if (totalBookings) {
    totalBookings.innerText = bookings.length;
  }

  if (activeBookingsCount) {
    activeBookingsCount.innerText = bookings.length;
  }

  // EMPTY

  if (bookings.length === 0) {
    customerBookings.innerHTML = `
    
    <div class="empty-booking">
      No bookings yet
    </div>

    `;

    return;
  }

  customerBookings.innerHTML = "";

  // BOOKINGS

  bookings
    .slice()
    .reverse()
    .forEach((booking) => {
      customerBookings.innerHTML += `
      
      <div class="booking-item">

        <div class="booking-left">

          <img
            src="https://i.pravatar.cc/120?u=${booking.service}"
          />

          <div>

            <h3>${booking.service}</h3>

            <p>${booking.address}</p>

            <span>
              ${booking.date} • ${booking.time}
            </span>

          </div>

        </div>

        <div class="booking-status pending">
          Pending
        </div>

      </div>

      `;
    });
}

// ====================================
// SCROLL BOOKINGS
// ====================================

function scrollBookings() {
  const section = document.querySelector(".active-bookings-section");

  if (section) {
    section.scrollIntoView({
      behavior: "smooth",
    });
  }
}

// ====================================
// INITIAL LOAD
// ====================================

loadProviders();

loadBookings();
