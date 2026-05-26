// GET USER FROM LOCAL STORAGE

const storedUser = JSON.parse(localStorage.getItem("nexserveUser"));

// CHECK LOGIN

if (!storedUser) {
  window.location.href = "../index.html";
}

// SHOW PROVIDER NAME

const providerName = document.getElementById("providerName");

if (providerName) {
  providerName.innerText = storedUser.name;
}
// FETCH BOOKINGS

const bookingRequests = document.getElementById("bookingRequests");

const fetchBookings = async () => {
  try {
    const response = await fetch(
      "https://nexserve-hyperlocal-marketplace-platform.onrender.com/api/bookings/all",
    );

    const data = await response.json();

    console.log(data);

    bookingRequests.innerHTML = "";

    data.bookings.forEach((booking) => {
      bookingRequests.innerHTML += `

    <div class="booking-card">

      <h3>
        ${booking.customerName}
      </h3>

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
          ? `<button
          onclick="acceptBooking('${booking._id}')"
        >
          Accept Task
        </button>`
          : `<button disabled>
          Accepted
        </button>`
      }

    </div>

  `;
    });
  } catch (error) {
    console.log(error);
  }
};

fetchBookings();
// ACCEPT BOOKING

const acceptBooking = async (id) => {
  try {
    const response = await fetch(
      `https://nexserve-hyperlocal-marketplace-platform.onrender.com/api/bookings/accept/${id}`,

      {
        method: "PUT",
      },
    );

    const data = await response.json();

    console.log(data);

    // REFRESH BOOKINGS

    fetchBookings();
  } catch (error) {
    console.log(error);
  }
};
const provider = JSON.parse(localStorage.getItem("user"));

const availabilityToggle = document.getElementById("availabilityToggle");

// INITIAL STATE

availabilityToggle.checked = provider.availability;

// CHANGE

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

    // UPDATE LOCAL STORAGE

    localStorage.setItem("user", JSON.stringify(data.provider));

    alert(
      availabilityToggle.checked
        ? "You are now available"
        : "You are unavailable",
    );
  } catch (error) {
    console.log(error);

    alert("Server Error");
  }
});

// LOGOUT BUTTON

const logoutBtn = document.getElementById("logoutBtn");

if (logoutBtn) {
  logoutBtn.addEventListener("click", () => {
    // REMOVE USER

    localStorage.removeItem("nexserveUser");

    // REDIRECT TO LOGIN PAGE

    window.location.href = "../index.html";
  });
}
