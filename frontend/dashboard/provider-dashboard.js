// ============================
// USER CHECK
// ============================

const storedUser = JSON.parse(localStorage.getItem("nexserveUser"));

if (!storedUser) {
  window.location.href = "../index.html";
}

// ============================
// SHOW PROVIDER NAME
// ============================

const providerName = document.getElementById("providerName");

if (providerName) {
  providerName.innerText = storedUser.name;
}

// ============================
// AVAILABILITY TOGGLE
// ============================

const availabilityToggle = document.getElementById("availabilityToggle");

// INITIAL STATE

if (availabilityToggle) {
  availabilityToggle.checked = storedUser.availability || false;
}

// CHANGE AVAILABILITY

availabilityToggle.addEventListener("change", async () => {
  try {
    const response = await fetch(
      `https://nexserve-hyperlocal-marketplace-platform.onrender.com/api/provider/availability/${storedUser._id}`,
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

    if (!response.ok) {
      alert(data.message);

      return;
    }

    // UPDATE LOCAL STORAGE

    localStorage.setItem("nexserveUser", JSON.stringify(data.provider));

    alert(
      availabilityToggle.checked
        ? "You are now available"
        : "You are now unavailable",
    );
  } catch (error) {
    console.log(error);

    alert("Server Error");
  }
});

// ============================
// FETCH BOOKINGS
// ============================

const bookingRequests = document.getElementById("bookingRequests");

const fetchBookings = async () => {
  try {
    const response = await fetch(
      "https://nexserve-hyperlocal-marketplace-platform.onrender.com/api/bookings/all",
    );

    const data = await response.json();

    bookingRequests.innerHTML = "";

    data.bookings.forEach((booking) => {
      bookingRequests.innerHTML += `
      
      <div class="booking-card">

        <h3>${booking.customerName}</h3>

        <p>
          Service:
          ${booking.service}
        </p>

        <p>
          Address:
          ${booking.address}
        </p>

        <p>
          Status:
          ${booking.status}
        </p>

        ${
          booking.status === "pending"
            ? `
          <button
            onclick="acceptBooking('${booking._id}')"
          >
            Accept Task
          </button>
          `
            : `
          <button disabled>
            Accepted
          </button>
          `
        }

      </div>
      
      `;
    });
  } catch (error) {
    console.log(error);
  }
};

fetchBookings();

// ============================
// ACCEPT BOOKING
// ============================

const acceptBooking = async (id) => {
  try {
    const response = await fetch(
      `https://nexserve-hyperlocal-marketplace-platform.onrender.com/api/bookings/accept/${id}`,
      {
        method: "PUT",
      },
    );

    await response.json();

    fetchBookings();
  } catch (error) {
    console.log(error);
  }
};

// ============================
// LOGOUT
// ============================

const logoutBtn = document.getElementById("logoutBtn");

if (logoutBtn) {
  logoutBtn.addEventListener("click", () => {
    localStorage.removeItem("nexserveUser");

    window.location.href = "../index.html";
  });
}
