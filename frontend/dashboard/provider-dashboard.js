// ============================
// USER CHECK
// ============================

const provider = JSON.parse(localStorage.getItem("user"));

if (!provider) {
  window.location.href = "../Pages/html/login.html";
}

// ============================
// ELEMENTS
// ============================

const providerName = document.getElementById("providerName");

const bookingRequests = document.getElementById("bookingRequests");

const availabilityToggle = document.getElementById("availabilityToggle");

const totalRequests = document.getElementById("totalRequests");

const acceptedJobs = document.getElementById("acceptedJobs");

// ============================
// SHOW NAME
// ============================

providerName.innerText = `Welcome Back, ${provider.name}`;

// ============================
// INITIAL AVAILABILITY
// ============================

availabilityToggle.checked = provider.availability;

// ============================
// AVAILABILITY CHANGE
// ============================

availabilityToggle.addEventListener("change", async () => {
  try {
    const response = await fetch(
      `https://nexserve-hyperlocal-marketplace-platform.onrender.com/api/provider/availability/${provider._id}`,
      {
        method: "PUT",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          availability: availabilityToggle.checked,
        }),
      },
    );

    const data = await response.json();

    localStorage.setItem("user", JSON.stringify(data.provider));
  } catch (error) {
    console.log(error);
  }
});

// ============================
// LOAD BOOKINGS
// ============================

async function loadRequests() {
  try {
    const response = await fetch(
      `https://nexserve-hyperlocal-marketplace-platform.onrender.com/api/bookings/provider/${provider._id}`,
    );

    const data = await response.json();

    bookingRequests.innerHTML = "";

    totalRequests.innerText = data.bookings.length;

    let accepted = 0;

    data.bookings.forEach((booking) => {
      if (booking.status === "accepted") {
        accepted++;
      }

      bookingRequests.innerHTML += `

      <div class="request-card">

        <div class="request-top">

          <img
            src="https://i.pravatar.cc/150?u=${booking.customerName}"
          />

          <div>

            <h3>
              ${booking.customerName}
            </h3>

            <span>
              ${booking.service}
            </span>

          </div>

        </div>

        <p>
          <i class="fa-solid fa-location-dot"></i>
          ${booking.address}
        </p>

        <p>
          <i class="fa-solid fa-calendar"></i>
          ${booking.date}
        </p>

        <p>
          <i class="fa-solid fa-clock"></i>
          ${booking.time}
        </p>

        <p>
          ${booking.description}
        </p>

        ${
          booking.status === "pending"
            ? `
          <div class="request-actions">

            <button
              class="accept-btn"
              onclick="acceptBooking('${booking._id}')"
            >
              Accept Request
            </button>

          </div>
        `
            : `
          <div class="status-badge">
            Accepted
          </div>
        `
        }

      </div>

      `;
    });

    acceptedJobs.innerText = accepted;
  } catch (error) {
    console.log(error);
  }
}

// ============================
// ACCEPT BOOKING
// ============================

async function acceptBooking(id) {
  try {
    const response = await fetch(
      `https://nexserve-hyperlocal-marketplace-platform.onrender.com/api/bookings/accept/${id}`,
      {
        method: "PUT",
      },
    );

    const data = await response.json();

    alert(data.message);

    loadRequests();
  } catch (error) {
    console.log(error);
  }
}

// ============================
// LOGOUT
// ============================

const logoutBtn = document.getElementById("logoutBtn");

logoutBtn.addEventListener("click", () => {
  localStorage.removeItem("user");

  window.location.href = "../index.html";
});

// ============================
// INITIAL
// ============================

loadRequests();
