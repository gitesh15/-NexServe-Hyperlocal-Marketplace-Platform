// ====================================
// LOGIN CHECK new
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
// LIVE PROVIDERS SECTION
// ====================================

async function loadLiveProvidersSection() {
  if (!providersGrid) return;

  try {
    const response = await fetch(
      "https://nexserve-hyperlocal-marketplace-platform.onrender.com/api/providers",
    );

    const data = await response.json();

    providersGrid.innerHTML = "";

    // FILTER ONLINE

    const onlineProviders = data.providers.filter(
      (provider) => provider.availability === true,
    );

    // ONLINE COUNTS

    const onlineProvidersCount = document.getElementById(
      "onlineProvidersCount",
    );

    const onlineProvidersLive = document.getElementById("onlineProviders");

    if (onlineProvidersCount) {
      onlineProvidersCount.innerText = onlineProviders.length;
    }

    if (onlineProvidersLive) {
      onlineProvidersLive.innerText = onlineProviders.length;
    }

    // EMPTY

    if (onlineProviders.length === 0) {
      providersGrid.innerHTML = `
      
      <div class="empty-booking">
        No providers online
      </div>

      `;

      return;
    }

    // CARDS

    onlineProviders.slice(0, 6).forEach((provider) => {
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
// BOOKINGS SECTION
// ====================================

function loadActiveBookingsSection() {
  const customerBookings = document.getElementById("customerBookings");

  if (!customerBookings) return;

  // STORAGE

  const bookings = JSON.parse(localStorage.getItem("customerBookings")) || [];

  // COUNTS

  const totalBookings = document.getElementById("totalBookings");

  const activeBookingsCount = document.getElementById("activeBookingsCount");

  const acceptedBookings = document.getElementById("acceptedBookings");

  if (totalBookings) {
    totalBookings.innerText = bookings.length;
  }

  if (activeBookingsCount) {
    activeBookingsCount.innerText = bookings.length;
  }

  const acceptedCount = bookings.filter(
    (booking) => booking.status === "accepted",
  ).length;

  if (acceptedBookings) {
    acceptedBookings.innerText = acceptedCount;
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
          ${booking.status || "Pending"}
        </div>

      </div>

      `;
    });
}

// ====================================
// MY BOOKINGS BUTTON
// ====================================

function scrollBookings() {
  const bookingSection = document.querySelector(".active-bookings-section");

  if (bookingSection) {
    bookingSection.scrollIntoView({
      behavior: "smooth",
    });
  }
}

// ====================================
// INITIAL LOAD
// ====================================

loadLiveProvidersSection();

loadActiveBookingsSection();
