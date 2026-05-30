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
// MODERN DASHBOARD JS
// ====================================

// USER

const user = JSON.parse(localStorage.getItem("user"));

if (!user) {
  window.location.href = "../Pages/html/login.html";
}

// ====================================
// USER NAME
// ====================================

const dashboardUserName = document.getElementById("dashboardUserName");

if (dashboardUserName) {
  dashboardUserName.innerText = user.name;
}

// ====================================
// LIVE PROVIDERS
// ====================================

async function loadLiveProvidersSection() {
  const providersGrid = document.getElementById("providersGrid");

  const onlineProviders = document.getElementById("onlineProviders");

  if (!providersGrid) return;

  try {
    const response = await fetch(
      "https://nexserve-hyperlocal-marketplace-platform.onrender.com/api/providers",
    );

    const data = await response.json();

    providersGrid.innerHTML = "";

    // FILTER ONLINE PROVIDERS

    const availableProviders = data.providers.filter(
      (provider) => provider.availability === true,
    );

    // LIVE COUNT

    if (onlineProviders) {
      onlineProviders.innerText = availableProviders.length;
    }

    // EMPTY

    if (availableProviders.length === 0) {
      providersGrid.innerHTML = `
      
      <div class="empty-booking">
        No providers online right now
      </div>

      `;

      return;
    }

    // CARDS

    availableProviders.slice(0, 6).forEach((provider) => {
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
// BOOKINGS
// ====================================

function loadActiveBookingsSection() {
  const customerBookings = document.getElementById("customerBookings");

  const totalBookings = document.getElementById("totalBookings");

  const acceptedBookings = document.getElementById("acceptedBookings");

  if (!customerBookings) return;

  // STORAGE

  const bookings = JSON.parse(localStorage.getItem("customerBookings")) || [];

  // COUNTS

  if (totalBookings) {
    totalBookings.innerText = bookings.length;
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

  // BOOKINGS UI

  bookings.reverse().forEach((booking) => {
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
// SCROLL BOOKINGS
// ====================================

function scrollBookings() {
  const bookingSection = document.querySelector(".modern-bookings-list");

  if (bookingSection) {
    bookingSection.scrollIntoView({
      behavior: "smooth",
    });
  }
}

// ====================================
// SIDEBAR BOOKING BUTTON
// ====================================

const bookingMenu = document.getElementById("bookingMenu");

if (bookingMenu) {
  bookingMenu.addEventListener("click", () => {
    window.location.href = "../pages/search-services.html";
  });
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
// INITIAL LOAD
// ====================================

loadLiveProvidersSection();

loadActiveBookingsSection();
