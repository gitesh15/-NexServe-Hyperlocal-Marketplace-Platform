console.log("NexServe Loaded Successfully");

const signupBtn = document.getElementById("signupBtn");

if (signupBtn) {
  signupBtn.addEventListener("click", () => {
    window.location.href = "Pages/html/signup.html";
  });
}

// LOGIN BUTTON

const loginBtn = document.getElementById("loginBtn");

if (loginBtn) {
  loginBtn.addEventListener("click", () => {
    window.location.href = "Pages/html/login.html";
  });
}
