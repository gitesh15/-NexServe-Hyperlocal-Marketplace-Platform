const services = [
  {
    name: "Electrician",
    category: "electrician",
    icon: "fa-bolt",
    providers: "120+",
    rating: "4.9",
    description:
      "Verified electricians for home wiring, repairs and installations.",
  },

  {
    name: "Plumbing",
    category: "plumbing",
    icon: "fa-faucet-drip",
    providers: "90+",
    rating: "4.8",
    description:
      "Professional plumbing experts for leak fixes and installations.",
  },

  {
    name: "Cleaning",
    category: "cleaning",
    icon: "fa-broom",
    providers: "210+",
    rating: "4.7",
    description: "Trusted home and office cleaning professionals near you.",
  },

  {
    name: "Tutoring",
    category: "tutoring",
    icon: "fa-book",
    providers: "340+",
    rating: "4.9",
    description:
      "Experienced tutors for school, college and competitive exams.",
  },

  {
    name: "AC Repair",
    category: "repair",
    icon: "fa-screwdriver-wrench",
    providers: "70+",
    rating: "4.8",
    description: "AC and appliance repair professionals with quick response.",
  },

  {
    name: "Carpentry",
    category: "repair",
    icon: "fa-hammer",
    providers: "65+",
    rating: "4.6",
    description: "Furniture repair and custom carpentry services.",
  },
];

const servicesGrid = document.getElementById("servicesGrid");

const searchInput = document.getElementById("searchInput");

const filterButtons = document.querySelectorAll(".filter-btn");

const resultsCount = document.getElementById("resultsCount");

const modal = document.getElementById("serviceModal");

const closeModal = document.getElementById("closeModal");

// RENDER SERVICES

function renderServices(serviceList) {
  servicesGrid.innerHTML = "";

  resultsCount.innerText = `${serviceList.length} services found`;

  serviceList.forEach((service) => {
    const card = document.createElement("div");

    card.classList.add("service-card");

    card.innerHTML = `
      <div class="service-icon">
        <i class="fa-solid ${service.icon}"></i>
      </div>

      <h3>${service.name}</h3>

      <p>${service.description}</p>

      <div class="service-bottom">
        <span>
          <i class="fa-solid fa-user-group"></i>
          ${service.providers}
        </span>

        <span>
          <i class="fa-solid fa-star"></i>
          ${service.rating}
        </span>
      </div>

      <button class="explore-btn">
        Explore Service
      </button>
    `;

    // OPEN MODAL

    card.querySelector(".explore-btn").addEventListener("click", () => {
      document.getElementById("modalTitle").innerText = service.name;

      document.getElementById("modalDescription").innerText =
        service.description;

      document.getElementById("modalProviders").innerText = service.providers;

      document.getElementById("modalRating").innerText = service.rating + "★";

      modal.classList.add("show-modal");
    });

    servicesGrid.appendChild(card);
  });
}

// INITIAL

renderServices(services);

// SEARCH

searchInput.addEventListener("input", () => {
  const value = searchInput.value.toLowerCase();

  const filtered = services.filter((service) =>
    service.name.toLowerCase().includes(value),
  );

  renderServices(filtered);
});

// FILTERS

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    filterButtons.forEach((btn) => {
      btn.classList.remove("active-filter");
    });

    button.classList.add("active-filter");

    const category = button.dataset.category;

    if (category === "all") {
      renderServices(services);

      return;
    }

    const filtered = services.filter(
      (service) => service.category === category,
    );

    renderServices(filtered);
  });
});

// CLOSE MODAL

closeModal.addEventListener("click", () => {
  modal.classList.remove("show-modal");
});

// CLOSE ON OUTSIDE CLICK

window.addEventListener("click", (e) => {
  if (e.target === modal) {
    modal.classList.remove("show-modal");
  }
});
// LOGIN CHECK

const loggedInUser = JSON.parse(localStorage.getItem("nexserveUser"));

// IF NOT LOGGED IN

if (!loggedInUser) {
  alert("Please login first");

  window.location.href = "login.html";
}

// ELEMENTS

const searchBtn = document.getElementById("searchBtn");

// const searchInput = document.getElementById("searchInput");

// const servicesGrid = document.getElementById("servicesGrid");

// SEARCH

searchBtn.addEventListener("click", async () => {
  const service = searchInput.value;

  if (!service) {
    alert("Enter service name");

    return;
  }

  try {
    const response = await fetch(
      `https://YOUR-RENDER-URL.onrender.com/api/providers/search/${service}`,
    );

    const data = await response.json();

    servicesGrid.innerHTML = "";

    // NO PROVIDERS

    if (data.providers.length === 0) {
      servicesGrid.innerHTML = `
        <h2 class="no-results">
          No providers found
        </h2>
      `;

      return;
    }

    // SHOW PROVIDERS

    data.providers.forEach((provider) => {
      servicesGrid.innerHTML += `
      
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
            ${provider.location}
          </span>

          <span>
            <i class="fa-solid fa-star"></i>
            ${provider.rating}
          </span>

          <span>
            <i class="fa-solid fa-briefcase"></i>
            ${provider.experience}
          </span>

        </div>

        <div class="provider-distance">
          <i class="fa-solid fa-route"></i>

          2.4 KM Away
        </div>

        <button class="book-provider-btn">
          Book Now
        </button>

      </div>
      
      `;
    });
  } catch (error) {
    console.log(error);

    alert("Server Error");
  }
});
