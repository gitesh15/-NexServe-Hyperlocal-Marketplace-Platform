// // dashboard/dashboard.js

// console.log("NexServe Dashboard Loaded");
// const storedUser = JSON.parse(localStorage.getItem("nexserveUser"));

// const userName = document.getElementById("userName");

// if (storedUser && userName) {
//   userName.innerText = storedUser.name;
// }

// GET STORED USER

const storedUser = JSON.parse(localStorage.getItem("nexserveUser"));

// USER NAME

const userName = document.getElementById("userName");

if (storedUser && userName) {
  userName.innerText = storedUser.name;
}
// CREATE BOOKING

const bookingForm = document.getElementById("bookingForm");

if (bookingForm) {
  bookingForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const storedUser = JSON.parse(localStorage.getItem("nexserveUser"));

    const service = document.getElementById("service").value;

    const address = document.getElementById("address").value;

    try {
      const response = await fetch(
        "https://nexserve-hyperlocal-marketplace-platform.onrender.com/api/bookings/create",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            customerName: storedUser.name,

            service,

            address,
          }),
        },
      );

      const data = await response.json();

      console.log(data);

      alert("Booking Request Sent");
    } catch (error) {
      console.log(error);
    }
  });
}
// FETCH CUSTOMER BOOKINGS

const customerBookings = document.getElementById("customerBookings");

const fetchCustomerBookings = async () => {
  try {
    const storedUser = JSON.parse(localStorage.getItem("nexserveUser"));

    const response = await fetch(
      "https://nexserve-hyperlocal-marketplace-platform.onrender.com/api/bookings/all",
    );

    const data = await response.json();

    customerBookings.innerHTML = "";

    // FILTER CURRENT USER BOOKINGS

    const myBookings = data.bookings.filter(
      (booking) => booking.customerName === storedUser.name,
    );

    myBookings.forEach((booking) => {
      customerBookings.innerHTML += `

          <div class="booking-card">

            <h3>
              ${booking.service}
            </h3>

            <p>
              Address:
              ${booking.address}
            </p>

            <p>
              Status:
              <strong>
                ${booking.status}
              </strong>
            </p>

          </div>

        `;
    });
  } catch (error) {
    console.log(error);
  }
};

fetchCustomerBookings();

// LOGOUT

const logoutBtn = document.getElementById("logoutBtn");

if (logoutBtn) {
  logoutBtn.addEventListener("click", () => {
    // REMOVE USER DATA

    localStorage.removeItem("nexserveUser");

    // REDIRECT

    window.location.href = "../index.html";
  });
}
