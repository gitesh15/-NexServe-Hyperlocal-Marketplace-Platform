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

const bookingSection = document.querySelector(".booking-section");

const providersSection = document.querySelector(".providers-section");

const bookingsSection = document.querySelector(".customer-bookings");

// ====================================
// USER NAME
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
// INITIAL SECTION STATE
// ====================================

// HIDE BOOKINGS SECTION INITIALLY

if (providersSection) {
  providersSection.style.display = "none";
}

if (bookingSection) {
  bookingSection.style.display = "none";
}

// ====================================
// SIDEBAR BOOKINGS BUTTON
// ====================================

// THIS OPENS PROVIDERS + BOOKING SECTION

if (bookingMenu) {
  bookingMenu.addEventListener("click", () => {
    // SHOW PROVIDERS

    if (providersSection) {
      providersSection.style.display = "block";
    }

    // SHOW BOOKING SECTION

    if (bookingSection) {
      bookingSection.style.display = "block";
    }

    // SCROLL TO PROVIDERS

    providersSection.scrollIntoView({
      behavior: "smooth",
    });

    // LOAD PROVIDERS

    loadProviders();
  });
}

// ====================================
// SEARCH PROVIDERS
// ====================================

if (dashboardSearchBtn) {
  dashboardSearchBtn.addEventListener("click", () => {
    const service = dashboardSearchInput.value.trim();

    loadProviders(service);

    // SHOW PROVIDERS SECTION

    if (providersSection) {
      providersSection.style.display = "block";
    }

    providersSection.scrollIntoView({
      behavior: "smooth",
    });
  });
}

// ====================================
// ENTER SEARCH
// ====================================

if (dashboardSearchInput) {
  dashboardSearchInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      const service = dashboardSearchInput.value.trim();

      loadProviders(service);

      // SHOW SECTION

      if (providersSection) {
        providersSection.style.display = "block";
      }

      providersSection.scrollIntoView({
        behavior: "smooth",
      });
    }
  });
}

// ====================================
// LOAD PROVIDERS
// ====================================

async function loadProviders(service = "") {
  try {
    let url =
      "https://nexserve-hyperlocal-marketplace-platform.onrender.com/api/providers";

    if (service) {
      url = `https://nexserve-hyperlocal-marketplace-platform.onrender.com/api/providers/search/${service}`;
    }

    const response = await fetch(url);

    const data = await response.json();

    providersGrid.innerHTML = "";

    // EMPTY

    if (!data.providers || data.providers.length === 0) {
      providersGrid.innerHTML = `
      
      <div class="empty-booking">

        <i class="fa-solid fa-user-xmark"></i>

        <h3>No Providers Found</h3>

      </div>
      
      `;

      return;
    }

    // FILTER AVAILABLE

    const availableProviders = data.providers.filter(
      (provider) => provider.availability === true,
    );

    // RENDER

    availableProviders.forEach((provider) => {
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
            onclick="selectProvider(
              '${provider._id}',
              '${provider.name}',
              '${provider.service}'
            )"
          >
            Book Service
          </button>

        </div>

      </div>

      `;
    });
  } catch (error) {
    console.log(error);

    providersGrid.innerHTML = `
    
    <div class="empty-booking">
      Server Error
    </div>
    
    `;
  }
}

// ====================================
// SELECTED PROVIDER
// ====================================

let selectedProvider = null;

// ====================================
// SELECT PROVIDER
// ====================================

function selectProvider(providerId, providerName, service) {
  selectedProvider = {
    providerId,
    providerName,
    service,
  };

  // AUTO FILL SERVICE

  const serviceInput = document.getElementById("service");

  if (serviceInput) {
    serviceInput.value = service;
  }

  // SHOW BOOKING SECTION

  if (bookingSection) {
    bookingSection.style.display = "block";
  }

  // SCROLL TO FORM

  bookingSection.scrollIntoView({
    behavior: "smooth",
  });

  // SUCCESS UI

  alert(`${providerName} selected successfully`);
}

// ====================================
// BOOKING FORM
// ====================================

const bookingForm = document.getElementById("bookingForm");

// ====================================
// CREATE BOOKING
// ====================================

if (bookingForm) {
  bookingForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    // NO PROVIDER

    if (!selectedProvider) {
      alert("Please select provider first");

      return;
    }

    try {
      const response = await fetch(
        "https://nexserve-hyperlocal-marketplace-platform.onrender.com/api/bookings/create",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            customerId: user._id,

            customerName: user.name,

            providerId: selectedProvider.providerId,

            providerName: selectedProvider.providerName,

            service: selectedProvider.service,

            address: document.getElementById("address").value,

            date: document.getElementById("date").value,

            time: document.getElementById("time").value,

            description: document.getElementById("description").value,
          }),
        },
      );

      const data = await response.json();

      // ERROR

      if (!response.ok) {
        alert(data.message);

        return;
      }

      // SUCCESS

      alert("Booking Created Successfully");

      bookingForm.reset();

      loadBookings();

      // OPEN BOOKINGS SECTION

      bookingsSection.scrollIntoView({
        behavior: "smooth",
      });
    } catch (error) {
      console.log(error);

      alert("Server Error");
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

    // EMPTY

    customerBookings.innerHTML = "";

    if (bookings.length === 0) {
      customerBookings.innerHTML = `
      
      <div class="empty-booking">

        <i class="fa-solid fa-calendar-xmark"></i>

        <h3>No Bookings Yet</h3>

      </div>
      
      `;

      return;
    }

    // RENDER BOOKINGS

    bookings.forEach((booking) => {
      customerBookings.innerHTML += `
      
      <div class="booking-card">

        <div class="booking-left">

          <img
            src="https://i.pravatar.cc/120?u=${booking.providerName}"
          />

          <div>

            <h3>
              ${booking.providerName}
            </h3>

            <p>
              ${booking.service}
            </p>

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

        <div
          class="booking-status ${booking.status}"
        >
          ${booking.status}
        </div>

      </div>

      `;
    });
  } catch (error) {
    console.log(error);
  }
}

// ====================================
// INITIAL LOAD
// ====================================

loadBookings();
