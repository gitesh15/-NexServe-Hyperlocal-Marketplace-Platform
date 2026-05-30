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

if (userName) {
  userName.innerText = user.name;
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
// SEARCH PROVIDERS
// ====================================

const dashboardSearchBtn = document.getElementById("dashboardSearchBtn");

const dashboardSearchInput = document.getElementById("dashboardSearchInput");

const providersGrid = document.getElementById("providersGrid");

// SEARCH BUTTON

if (dashboardSearchBtn) {
  dashboardSearchBtn.addEventListener("click", async () => {
    const service = dashboardSearchInput.value.trim();

    if (!service) {
      alert("Please enter service");

      return;
    }

    try {
      const response = await fetch(
        `https://nexserve-hyperlocal-marketplace-platform.onrender.com/api/providers/search/${service}`,
      );

      const data = await response.json();

      providersGrid.innerHTML = "";

      // NO PROVIDERS

      if (!data.providers || data.providers.length === 0) {
        providersGrid.innerHTML = `
        
          <h2 class="no-results">
            No providers found
          </h2>
        
        `;

        return;
      }

      // SHOW PROVIDERS

      data.providers.forEach((provider) => {
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
              ${provider.location}
            </span>

            <span>
              <i class="fa-solid fa-briefcase"></i>
              ${provider.experience}
            </span>

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
}

// ====================================
// BOOKING SYSTEM
// ====================================

const bookingForm = document.getElementById("bookingForm");

const customerBookings = document.getElementById("customerBookings");

// LOAD BOOKINGS

let bookings = JSON.parse(localStorage.getItem("customerBookings")) || [];

// SHOW BOOKINGS

function renderBookings() {
  if (!customerBookings) return;

  customerBookings.innerHTML = "";

  if (bookings.length === 0) {
    customerBookings.innerHTML = `
    
      <p class="empty-booking">
        No bookings yet
      </p>
    
    `;

    return;
  }

  bookings.forEach((booking) => {
    customerBookings.innerHTML += `
    
    <div class="booking-card">

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

// INITIAL RENDER

renderBookings();

// BOOK FORM

if (bookingForm) {
  bookingForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const service = document.getElementById("service").value;

    const address = document.getElementById("address").value;

    const date = document.getElementById("date").value;

    const time = document.getElementById("time").value;

    const description = document.getElementById("description").value;

    const bookingData = {
      service,
      address,
      date,
      time,
      description,
    };

    bookings.push(bookingData);

    localStorage.setItem("customerBookings", JSON.stringify(bookings));

    renderBookings();

    bookingForm.reset();

    alert("Booking Created Successfully");
  });
  // ====================================
  // SEARCH PROVIDERS
  // ====================================

  const dashboardSearchBtn = document.getElementById("dashboardSearchBtn");

  const dashboardSearchInput = document.getElementById("dashboardSearchInput");

  const providersGrid = document.getElementById("providersGrid");

  // SEARCH BUTTON

  if (dashboardSearchBtn) {
    dashboardSearchBtn.addEventListener("click", async () => {
      const service = dashboardSearchInput.value.trim();

      if (!service) {
        alert("Please enter service");

        return;
      }

      try {
        const response = await fetch(
          `https://nexserve-hyperlocal-marketplace-platform.onrender.com/api/providers/search/${service}`,
        );

        const data = await response.json();

        providersGrid.innerHTML = "";

        // NO PROVIDERS

        if (!data.providers || data.providers.length === 0) {
          providersGrid.innerHTML = `
        
          <h2 class="no-results">
            No providers found
          </h2>
        
        `;

          return;
        }

        // SHOW PROVIDERS

        data.providers.forEach((provider) => {
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
              ${provider.location}
            </span>

            <span>
              <i class="fa-solid fa-briefcase"></i>
              ${provider.experience}
            </span>

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
    const bookingMenu = document.getElementById("bookingMenu");

    bookingMenu.addEventListener("click", () => {
      window.location.href = "./bookings.html";
    });
  }
}

// ====================================
// LIVE PROVIDERS SECTION ONLY
// ====================================

// THIS JS ONLY CONTROLS:
// 1. providersGrid rendering
// 2. "Explore All" button
// 3. loading live providers

// IT DOES NOT TOUCH:
// ❌ sidebar booking button
// ❌ sidebar navigation
// ❌ my bookings section
// ❌ your old booking system

// ====================================
// ELEMENTS
// ====================================

const providersGrid = document.getElementById("providersGrid");

const exploreAllBtn = document.getElementById("exploreAllBtn");

// ====================================
// LOAD LIVE PROVIDERS
// ====================================

async function loadLiveProviders() {
  // STOP IF SECTION DOESN'T EXIST
  if (!providersGrid) return;

  try {
    const response = await fetch(
      "https://nexserve-hyperlocal-marketplace-platform.onrender.com/api/providers",
    );

    const data = await response.json();

    providersGrid.innerHTML = "";

    // FILTER ONLINE PROVIDERS
    const liveProviders = data.providers.filter(
      (provider) => provider.availability === true,
    );

    // EMPTY STATE
    if (liveProviders.length === 0) {
      providersGrid.innerHTML = `
      
        <div class="empty-provider">
          No providers available right now
        </div>
      
      `;

      return;
    }

    // SHOW ONLY 6 CARDS
    liveProviders.slice(0, 6).forEach((provider) => {
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

          <div class="provider-middle">

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

            <div class="online-status">
              <span class="live-dot"></span>
              Available Now
            </div>

            <button
              class="provider-book-btn"
              onclick="window.location.href='../pages/search-services.html'"
            >
              Book Service
            </button>

          </div>

        </div>
      
      `;
    });
  } catch (error) {
    console.log("Live Providers Error:", error);

    providersGrid.innerHTML = `
    
      <div class="empty-provider">
        Failed to load providers
      </div>
    
    `;
  }
}

// ====================================
// EXPLORE ALL BUTTON
// ====================================

// THIS ONLY OPENS SEARCH PAGE
// DOES NOT CHANGE SIDEBAR LOGIC

if (exploreAllBtn) {
  exploreAllBtn.addEventListener("click", () => {
    window.location.href = "../pages/search-services.html";
  });
}

// ====================================
// INITIAL LOAD
// ====================================

loadLiveProviders();
// ====================================
// ACTIVE BOOKINGS SECTION
// ====================================

const customerBookings = document.getElementById("customerBookings");

// LOAD BOOKINGS FROM LOCAL STORAGE

function loadActiveBookings() {
  if (!customerBookings) return;

  const bookings = JSON.parse(localStorage.getItem("customerBookings")) || [];

  customerBookings.innerHTML = "";

  // EMPTY STATE

  if (bookings.length === 0) {
    customerBookings.innerHTML = `
    
      <div class="empty-booking-card">

        <i class="fa-solid fa-calendar-xmark"></i>

        <h3>No Active Bookings</h3>

        <p>
          Your booked services will appear here
        </p>

      </div>

    `;

    return;
  }

  // SHOW BOOKINGS

  bookings.reverse().forEach((booking) => {
    customerBookings.innerHTML += `

      <div class="active-booking-card">

        <div class="booking-provider">

          <img
            src="https://i.pravatar.cc/150?u=${booking.service}"
            alt=""
          />

          <div>

            <h3>
              ${booking.service}
            </h3>

            <p>
              ${booking.address}
            </p>

          </div>

        </div>

        <div class="booking-info">

          <div class="booking-meta">

            <span>
              <i class="fa-solid fa-calendar-days"></i>

              ${booking.date}
            </span>

            <span>
              <i class="fa-solid fa-clock"></i>

              ${booking.time}
            </span>

          </div>

          <div class="booking-status pending">

            <i class="fa-solid fa-spinner"></i>

            Pending

          </div>

        </div>

      </div>

    `;
  });
}

// ====================================
// INITIAL LOAD
// ====================================

loadActiveBookings();
// ====================================
// MARKETPLACE ACTIVITY
// ====================================

async function loadMarketplaceActivity() {
  try {
    // FETCH PROVIDERS

    const providersResponse = await fetch(
      "https://nexserve-hyperlocal-marketplace-platform.onrender.com/api/providers",
    );

    const providersData = await providersResponse.json();

    const providers = providersData.providers || [];

    // ONLINE PROVIDERS

    const onlineProviders = providers.filter(
      (provider) => provider.availability === true,
    );

    // UPDATE ONLINE COUNT

    const onlineProvidersCount = document.getElementById(
      "onlineProvidersCount",
    );

    if (onlineProvidersCount) {
      onlineProvidersCount.innerText = onlineProviders.length;
    }

    // ====================================
    // ACTIVE BOOKINGS COUNT
    // ====================================

    const savedBookings =
      JSON.parse(localStorage.getItem("customerBookings")) || [];

    const activeBookingsCount = document.getElementById("activeBookingsCount");

    if (activeBookingsCount) {
      activeBookingsCount.innerText = savedBookings.length;
    }
  } catch (error) {
    console.log("Marketplace Activity Error:", error);
  }
}

// ====================================
// INITIAL LOAD
// ====================================

loadMarketplaceActivity();
