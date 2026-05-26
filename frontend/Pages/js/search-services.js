// ====================================
// LOGIN CHECK
// ====================================

const loggedInUser = JSON.parse(localStorage.getItem("user"));

if (!loggedInUser) {
  window.location.href = "./login.html";
}

// ====================================
// ELEMENTS
// ====================================

const servicesGrid = document.getElementById("servicesGrid");

const searchInput = document.getElementById("searchInput");

const searchBtn = document.getElementById("searchBtn");

const resultsCount = document.getElementById("resultsCount");

const modal = document.getElementById("serviceModal");

const closeModal = document.getElementById("closeModal");

const providerStack = document.getElementById("providerStack");

const providersSection = document.getElementById("providersSection");

const myBookingsSection = document.getElementById("myBookingsSection");

const bookingsContainer = document.getElementById("bookingsContainer");

const bookServicesBtn = document.getElementById("bookServicesBtn");

const myBookingsBtn = document.getElementById("myBookingsBtn");

const userName = document.getElementById("userName");

// ====================================
// USER NAME
// ====================================

if (userName) {
  userName.innerText = loggedInUser.name;
}

// ====================================
// SIDEBAR TOGGLE
// ====================================

bookServicesBtn.addEventListener("click", () => {
  providersSection.classList.remove("hidden-section");

  myBookingsSection.classList.add("hidden-section");

  providersSection.scrollIntoView({
    behavior: "smooth",
  });
});

myBookingsBtn.addEventListener("click", () => {
  myBookingsSection.classList.remove("hidden-section");

  providersSection.classList.add("hidden-section");

  myBookingsSection.scrollIntoView({
    behavior: "smooth",
  });
});

// ====================================
// FETCH PROVIDERS
// ====================================

async function fetchProviders(service = "") {
  try {
    let url = "";

    if (service) {
      url = `https://nexserve-hyperlocal-marketplace-platform.onrender.com/api/providers/search/${service}`;
    } else {
      url =
        "https://nexserve-hyperlocal-marketplace-platform.onrender.com/api/providers";
    }

    const response = await fetch(url);

    const data = await response.json();

    renderProviders(data.providers);

    loadProviderStack(data.providers);
  } catch (error) {
    console.log(error);

    alert("Server Error");
  }
}

// ====================================
// RENDER PROVIDERS
// ====================================

function renderProviders(providers) {
  servicesGrid.innerHTML = "";

  resultsCount.innerText = `${providers.length} providers found`;

  if (providers.length === 0) {
    servicesGrid.innerHTML = `
    
      <h2 class="no-results">
        No providers found
      </h2>
    
    `;

    return;
  }

  providers.forEach((provider) => {
    servicesGrid.innerHTML += `
      
<div class="provider-card">

  <div class="provider-top">

    <img
      src="https://i.pravatar.cc/150?u=${provider.email}"
      class="provider-img"
    />

    <div>

      <h3>${provider.name}</h3>

      <p>${provider.service}</p>

    </div>

  </div>

  <div class="${provider.availability ? "online-badge" : "offline-badge"}">

    ${provider.availability ? "Available Now" : "Currently Unavailable"}

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

    <span>
      <i class="fa-solid fa-shield-halved"></i>

      Verified Professional
    </span>

  </div>

  <button
    class="explore-btn"
    onclick="openBookingModal('${provider._id}')"
    ${!provider.availability ? "disabled" : ""}
  >
    ${provider.availability ? "Book Service" : "Unavailable"}
  </button>

</div>

`;
  });

  window.allProviders = providers;
}

// ====================================
// OPEN BOOKING MODAL
// ====================================

let selectedProvider = null;

function openBookingModal(providerId) {
  const provider = window.allProviders.find((p) => p._id === providerId);

  selectedProvider = provider;

  document.getElementById("modalTitle").innerText = provider.name;

  document.getElementById("modalProviderName").innerText = provider.name;

  document.getElementById("modalDescription").innerText =
    `${provider.service} professional available in ${provider.location}`;

  document.getElementById("modalProviders").innerText = provider.experience;

  document.getElementById("modalRating").innerText = "Verified";

  document.getElementById("modalImage").src =
    `https://i.pravatar.cc/150?u=${provider.email}`;

  modal.classList.add("show-modal");
}

// ====================================
// BOOKING FORM
// ====================================

const bookingForm = document.getElementById("bookingForm");

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
          customerId: loggedInUser._id,

          providerId: selectedProvider._id,

          customerName: loggedInUser.name,

          providerName: selectedProvider.name,

          service: selectedProvider.service,

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

    modal.classList.remove("show-modal");

    bookingForm.reset();

    loadBookings();
  } catch (error) {
    console.log(error);

    alert("Server Error");
  }
});

// ====================================
// LOAD BOOKINGS
// ====================================

async function loadBookings() {
  try {
    const response = await fetch(
      `https://nexserve-hyperlocal-marketplace-platform.onrender.com/api/bookings/customer/${loggedInUser._id}`,
    );

    const data = await response.json();

    bookingsContainer.innerHTML = "";

    if (!data.bookings || data.bookings.length === 0) {
      bookingsContainer.innerHTML = `
      
      <div class="no-results">
        No bookings yet
      </div>
      
      `;

      return;
    }

    data.bookings.forEach((booking) => {
      bookingsContainer.innerHTML += `
      
<div class="booking-card">

  <div class="booking-left">

    <div class="booking-avatar">
      ${booking.providerName.charAt(0)}
    </div>

    <div>

      <h3>${booking.providerName}</h3>

      <p>${booking.service}</p>

      <span>
        ${booking.date} • ${booking.time}
      </span>

    </div>

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

// ====================================
// PROVIDER STACK
// ====================================

function loadProviderStack(providers) {
  providerStack.innerHTML = "";

  const availableProviders = providers.filter(
    (provider) => provider.availability === true,
  );

  availableProviders.slice(0, 6).forEach((provider) => {
    providerStack.innerHTML += `

<div class="stack-card">

  <div class="stack-top">

    <img
      src="https://i.pravatar.cc/150?u=${provider.email}"
    />

    <div>

      <h3>
        ${provider.name}
      </h3>

      <p>
        ${provider.service}
      </p>

    </div>

  </div>

  <div class="stack-meta">

    <span>
      <i class="fa-solid fa-location-dot"></i>

      ${provider.location || "India"}
    </span>

    <span class="online-badge">

      <i class="fa-solid fa-circle"></i>

      Available

    </span>

  </div>

  <button
    class="stack-book-btn"
    onclick="openBookingModal('${provider._id}')"
  >
    Book Now
  </button>

</div>

`;
  });
}

// ====================================
// SEARCH
// ====================================

searchBtn.addEventListener("click", () => {
  const service = searchInput.value.trim();

  fetchProviders(service);

  providersSection.classList.remove("hidden-section");
});

searchInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    fetchProviders(searchInput.value.trim());

    providersSection.classList.remove("hidden-section");
  }
});

// ====================================
// TRENDING
// ====================================

const trendButtons = document.querySelectorAll(".trend-btn");

trendButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const service = button.innerText;

    searchInput.value = service;

    fetchProviders(service);

    providersSection.classList.remove("hidden-section");
  });
});

// ====================================
// CLOSE MODAL
// ====================================

closeModal.addEventListener("click", () => {
  modal.classList.remove("show-modal");
});

window.addEventListener("click", (e) => {
  if (e.target === modal) {
    modal.classList.remove("show-modal");
  }
});

// ====================================
// LOGOUT
// ====================================

const logoutBtn = document.getElementById("logoutBtn");

logoutBtn.addEventListener("click", () => {
  localStorage.removeItem("user");

  window.location.href = "../index.html";
});

// ====================================
// INITIAL LOAD
// ====================================

fetchProviders();

loadBookings();
