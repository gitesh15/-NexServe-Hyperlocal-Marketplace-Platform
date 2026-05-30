// ====================================
// USER AUTH
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
// PROFILE DATA
// ====================================

if (profileName) {
  profileName.innerText = user.name || "Customer";
}

if (profileEmail) {
  profileEmail.innerText = user.email || "user@nexserve.com";
}

// ====================================
// BOOKINGS
// ====================================

const bookings = JSON.parse(localStorage.getItem("customerBookings")) || [];

if (totalBookings) {
  totalBookings.innerText = bookings.length;
}

// ====================================
// SAVED PROVIDERS
// ====================================

const savedProviders = JSON.parse(localStorage.getItem("savedProviders")) || [];

if (savedCount) {
  savedCount.innerText = savedProviders.length;
}

// ====================================
// ACTIVITY LIST
// ====================================

if (activityList) {
  activityList.innerHTML = "";

  // EMPTY

  if (bookings.length === 0) {
    activityList.innerHTML = `
    
    <div class="activity-card">

      <h3>
        No recent activity
      </h3>

      <p>
        Your latest bookings and activity
        will appear here.
      </p>

    </div>

    `;
  }

  // BOOKINGS
  else {
    bookings
      .slice()
      .reverse()
      .slice(0, 4)
      .forEach((booking) => {
        activityList.innerHTML += `
        
        <div class="activity-card">

          <div class="activity-top">

            <div class="activity-icon">

              <i class="fa-solid fa-calendar-check"></i>

            </div>

            <div>

              <h3>
                ${booking.service}
              </h3>

              <p>
                ${booking.address}
              </p>

            </div>

          </div>

          <span class="activity-time">
            ${booking.date} • ${booking.time}
          </span>

        </div>

        `;
      });
  }
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
// EDIT PROFILE PANEL
// ====================================

const openEditProfile = document.getElementById("openEditProfile");

const openEditProfile2 = document.getElementById("openEditProfile2");

const closeEditProfile = document.getElementById("closeEditProfile");

const editProfilePanel = document.getElementById("editProfilePanel");

const profileOverlay = document.getElementById("profileOverlay");

// ====================================
// OPEN PANEL
// ====================================

function openProfilePanel() {
  if (editProfilePanel) {
    editProfilePanel.classList.add("show-edit-panel");
  }

  if (profileOverlay) {
    profileOverlay.classList.add("show-overlay");
  }
}

// ====================================
// CLOSE PANEL
// ====================================

function closeProfilePanel() {
  if (editProfilePanel) {
    editProfilePanel.classList.remove("show-edit-panel");
  }

  if (profileOverlay) {
    profileOverlay.classList.remove("show-overlay");
  }
}

// ====================================
// BUTTON EVENTS
// ====================================

if (openEditProfile) {
  openEditProfile.addEventListener("click", openProfilePanel);
}

if (openEditProfile2) {
  openEditProfile2.addEventListener("click", openProfilePanel);
}

if (closeEditProfile) {
  closeEditProfile.addEventListener("click", closeProfilePanel);
}

if (profileOverlay) {
  profileOverlay.addEventListener("click", closeProfilePanel);
}

// ====================================
// EDIT FORM
// ====================================

const editProfileForm = document.getElementById("editProfileForm");

const editName = document.getElementById("editName");

const editEmail = document.getElementById("editEmail");

const editAddress = document.getElementById("editAddress");

// ====================================
// LOAD USER INTO FORM
// ====================================

if (user) {
  if (editName) {
    editName.value = user.name || "";
  }

  if (editEmail) {
    editEmail.value = user.email || "";
  }

  if (editAddress) {
    editAddress.value = user.address || "";
  }
}

// ====================================
// SAVE PROFILE
// ====================================

if (editProfileForm) {
  editProfileForm.addEventListener("submit", (e) => {
    e.preventDefault();

    // UPDATE USER

    user.name = editName.value;

    user.email = editEmail.value;

    user.address = editAddress.value;

    // SAVE

    localStorage.setItem("user", JSON.stringify(user));

    // UPDATE UI

    if (profileName) {
      profileName.innerText = user.name;
    }

    if (profileEmail) {
      profileEmail.innerText = user.email;
    }

    // CLOSE

    closeProfilePanel();

    // ALERT

    alert("Profile Updated Successfully");
  });
}
