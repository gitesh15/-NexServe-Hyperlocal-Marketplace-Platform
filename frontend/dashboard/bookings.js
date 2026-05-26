// ============================
// USER CHECK
// ============================

const user = JSON.parse(localStorage.getItem("user"));

if (!user) {
  window.location.href = "../Pages/html/login.html";
}

// ============================
// LOGOUT
// ============================

const logoutBtn = document.getElementById("logoutBtn");

if (logoutBtn) {
  logoutBtn.addEventListener("click", () => {
    localStorage.removeItem("user");

    window.location.href = "../index.html";
  });
}

// ============================
// ELEMENTS
// ============================

const providersGrid = document.getElementById("providersGrid");

const searchBtn = document.getElementById("searchBtn");

const searchInput = document.getElementById("searchInput");

const bookingsContainer = document.getElementById("bookingsContainer");

const bookingDrawer = document.getElementById("bookingDrawer");

const closeDrawer = document.getElementById("closeDrawer");

const selectedProvider = document.getElementById("selectedProvider");

const bookingForm = document.getElementById("bookingForm");

// ============================
// CURRENT PROVIDER
// ============================

let currentProvider = null;

// ============================
// CLOSE DRAWER
// ============================

if (closeDrawer) {
  closeDrawer.addEventListener("click", () => {
    bookingDrawer.classList.remove("show-drawer");
  });
}

// ============================
// LOAD PROVIDERS
// ============================

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

    // NO PROVIDERS

    if (!data.providers || data.providers.length === 0) {
      providersGrid.innerHTML = `
      
      <div class="empty-state">
        <i class="fa-solid fa-user-xmark"></i>

        <h2>No Providers Found</h2>

        <p>Try searching another service.</p>
      </div>

      `;

      return;
    }

    // PROVIDER CARDS

    data.providers.forEach((provider) => {
      const card = document.createElement("div");

      card.classList.add("provider-card");

      // DATABASE FIELD

      const isAvailable = provider.availability;

      card.innerHTML = `
      
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

        <div class="${isAvailable ? "status-online" : "status-offline"}">

          <i class="fa-solid fa-circle"></i>

          ${isAvailable ? "Available Now" : "Currently Unavailable"}

        </div>

        <button 
          class="book-btn" 
          ${!isAvailable ? "disabled" : ""}
        >
          ${isAvailable ? "Book Service" : "Unavailable"}
        </button>

      </div>
      
      `;

      // ============================
      // BOOK BUTTON
      // ============================

      const bookBtn = card.querySelector(".book-btn");

      if (isAvailable) {
        bookBtn.addEventListener("click", () => {
          currentProvider = provider;

          selectedProvider.innerHTML = `
          
          <div class="selected-provider-card">

            <img 
              src="https://i.pravatar.cc/150?u=${provider.email}" 
            />

            <div>

              <h3>${provider.name}</h3>

              <p>${provider.service}</p>

              <span>
                <i class="fa-solid fa-location-dot"></i>

                ${provider.location || "India"}
              </span>

            </div>

          </div>
          
          `;

          bookingDrawer.classList.add("show-drawer");
        });
      }

      providersGrid.appendChild(card);
    });
  } catch (error) {
    console.log(error);

    providersGrid.innerHTML = `
    
    <div class="empty-state">

      <h2>Server Error</h2>

    </div>

    `;
  }
}

// ============================
// SEARCH BUTTON
// ============================

if (searchBtn) {
  searchBtn.addEventListener("click", () => {
    const service = searchInput.value.trim();

    loadProviders(service);
  });
}

// ============================
// ENTER KEY SEARCH
// ============================

if (searchInput) {
  searchInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      loadProviders(searchInput.value.trim());
    }
  });
}

// ============================
// CREATE BOOKING
// ============================

if (bookingForm) {
  bookingForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    // NO PROVIDER SELECTED

    if (!currentProvider) {
      alert("Please select a provider");

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

            providerId: currentProvider._id,

            customerName: user.name,

            providerName: currentProvider.name,

            service: currentProvider.service,

            address: document.getElementById("bookingAddress").value,

            date: document.getElementById("bookingDate").value,

            time: document.getElementById("bookingTime").value,

            description: document.getElementById("bookingDescription").value,
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

      bookingDrawer.classList.remove("show-drawer");

      bookingForm.reset();

      loadBookings();
    } catch (error) {
      console.log(error);

      alert("Server Error");
    }
  });
}

// ============================
// LOAD BOOKINGS
// ============================

async function loadBookings() {
  try {
    const response = await fetch(
      `https://nexserve-hyperlocal-marketplace-platform.onrender.com/api/bookings/customer/${user._id}`,
    );

    const data = await response.json();

    bookingsContainer.innerHTML = "";

    // EMPTY STATE

    if (!data.bookings || data.bookings.length === 0) {
      bookingsContainer.innerHTML = `
      
      <div class="empty-state">

        <i class="fa-solid fa-calendar-xmark"></i>

        <h3>No Bookings Yet</h3>

      </div>

      `;

      return;
    }

    // BOOKINGS

    data.bookings.forEach((booking) => {
      bookingsContainer.innerHTML += `

      <div class="booking-card modern-booking-card">

        <div class="booking-left">

          <div class="booking-avatar">
            ${booking.providerName.charAt(0)}
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
  }
}

// ============================
// INITIAL LOAD
// ============================

loadProviders();

loadBookings();
