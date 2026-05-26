const user = JSON.parse(localStorage.getItem("user"));

if (!user) {
  window.location.href = "../Pages/html/login.html";
}

// LOGOUT

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

const bookingDrawer = document.getElementById("bookingDrawer");

const closeDrawer = document.getElementById("closeDrawer");

const selectedProvider = document.getElementById("selectedProvider");

const bookingForm = document.getElementById("bookingForm");

// CURRENT PROVIDER

let currentProvider = null;

// CLOSE DRAWER

closeDrawer.addEventListener("click", () => {
  bookingDrawer.classList.remove("show-drawer");
});

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
      const card = document.createElement("div");

      card.classList.add("provider-card");

      card.innerHTML = `
      
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
      
      `;

      // BOOK BUTTON

      const bookBtn = card.querySelector(".book-btn");

      bookBtn.addEventListener("click", () => {
        currentProvider = provider;

        selectedProvider.innerHTML = `
        
        <h3>${provider.name}</h3>

        <p>${provider.service}</p>

        <span>
          <i class="fa-solid fa-location-dot"></i>
          ${provider.location}
        </span>
        
        `;

        bookingDrawer.classList.add("show-drawer");
      });

      providersGrid.appendChild(card);
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

// CREATE BOOKING

bookingForm.addEventListener("submit", async (e) => {
  e.preventDefault();

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

    if (!response.ok) {
      alert(data.message);

      return;
    }

    alert("Booking Created Successfully");

    bookingDrawer.classList.remove("show-drawer");

    bookingForm.reset();

    loadBookings();
  } catch (error) {
    console.log(error);

    alert("Server Error");
  }
});

// LOAD BOOKINGS

async function loadBookings() {
  try {
    const response = await fetch(
      `https://nexserve-hyperlocal-marketplace-platform.onrender.com/api/bookings/customer/${user._id}`,
    );

    const data = await response.json();

    bookingsContainer.innerHTML = "";

    if (data.bookings.length === 0) {
      bookingsContainer.innerHTML = `
        <h3>No bookings yet</h3>
      `;

      return;
    }

    data.bookings.forEach((booking) => {
      bookingsContainer.innerHTML += `
      
      <div class="booking-card">

        <div class="booking-left">

          <h3>${booking.providerName}</h3>

          <p>${booking.service}</p>

          <span>
            ${booking.date} • ${booking.time}
          </span>

        </div>

        <div class="booking-status ${booking.status}">
          ${booking.status}
        </div>

      </div>
      
      `;
    });
  } catch (error) {
    console.log(error);
  }
}

// INITIAL

loadProviders();

loadBookings();
