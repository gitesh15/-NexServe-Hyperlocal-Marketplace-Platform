// ====================================
// USER
// ====================================

const user = JSON.parse(localStorage.getItem("user"));

if (!user) {
  window.location.href = "../Pages/html/login.html";
}

// ====================================
// ELEMENTS
// ====================================

const profileName = document.getElementById("profileName");
const profileEmail = document.getElementById("profileEmail");
const totalBookings = document.getElementById("totalBookings");
const savedCount = document.getElementById("savedCount");
const activityList = document.getElementById("activityList");
const logoutBtn = document.getElementById("logoutBtn");

// ====================================
// USER DATA
// ====================================

profileName.innerText = user.name || "Customer";

profileEmail.innerText = user.email || "user@nexserve.com";

// ====================================
// BOOKINGS
// ====================================

const bookings = JSON.parse(localStorage.getItem("customerBookings")) || [];

if (totalBookings) {
  totalBookings.innerText = bookings.length;
}

// ====================================
// SAVED
// ====================================

const savedProviders = JSON.parse(localStorage.getItem("savedProviders")) || [];

if (savedCount) {
  savedCount.innerText = savedProviders.length;
}

// ====================================
// ACTIVITY
// ====================================

if (activityList) {
  if (bookings.length === 0) {
    activityList.innerHTML = `
    
    <div class="activity-card">
      <h3>No recent activity</h3>
      <p>Your latest bookings and activity will appear here.</p>
    </div>

    `;
  } else {
    bookings
      .slice()
      .reverse()
      .slice(0, 4)
      .forEach((booking) => {
        activityList.innerHTML += `
        
        <div class="activity-card">

          <h3>${booking.service}</h3>

          <p>
            Booking scheduled for ${booking.date} at ${booking.time}
          </p>

        </div>

        `;
      });
  }
}

// ====================================
// LOGOUT
// ====================================

logoutBtn.addEventListener("click", () => {
  localStorage.removeItem("user");

  window.location.href = "../index.html";
});
// =========================
// ELEMENTS
// =========================

const openEditProfile = document.getElementById("openEditProfile");

const closeEditProfile = document.getElementById("closeEditProfile");

const editProfilePanel = document.getElementById("editProfilePanel");

const profileOverlay = document.getElementById("profileOverlay");

// =========================
// OPEN PANEL
// =========================

if (openEditProfile) {
  openEditProfile.addEventListener("click", () => {
    editProfilePanel.classList.add("active-panel");

    profileOverlay.classList.add("active-overlay");
  });
}

// =========================
// CLOSE PANEL
// =========================

function closeProfilePanel() {
  editProfilePanel.classList.remove("active-panel");

  profileOverlay.classList.remove("active-overlay");
}

if (closeEditProfile) {
  closeEditProfile.addEventListener("click", closeProfilePanel);
}

if (profileOverlay) {
  profileOverlay.addEventListener("click", closeProfilePanel);
}

// =========================
// LOAD USER DATA
// =========================

const currentUser = JSON.parse(localStorage.getItem("user"));

if (currentUser) {
  document.getElementById("editName").value = currentUser.name || "";

  document.getElementById("editEmail").value = currentUser.email || "";
}

// =========================
// SAVE PROFILE
// =========================

const editProfileForm = document.getElementById("editProfileForm");

if (editProfileForm) {
  editProfileForm.addEventListener("submit", (e) => {
    e.preventDefault();

    currentUser.name = document.getElementById("editName").value;

    currentUser.email = document.getElementById("editEmail").value;

    localStorage.setItem("user", JSON.stringify(currentUser));

    alert("Profile Updated");

    closeProfilePanel();

    location.reload();
  });
}
