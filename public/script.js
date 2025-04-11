const loginForm = document.getElementById("loginForm");
const loginError = document.getElementById("loginError");
const dataContainer = document.getElementById("dataContainer");
const loadingIndicator = document.getElementById("loadingIndicator");

// --- Hardcoded Credentials (with basic encryption) ---
const encryptedUsername = btoa("bhagi"); // Basic Base64 encoding
const encryptedPassword = btoa("bhagi20");

function verifyLogin(username, password) {
  return (
    btoa(username) === encryptedUsername && btoa(password) === encryptedPassword
  );
}

// Login page handling
if (
  (loginForm && window.location.pathname.endsWith("index.html")) ||
  window.location.pathname === "/"
) {
  loginForm.addEventListener("submit", (event) => {
    event.preventDefault(); // Ensure the default form submission is prevented
    const usernameInput = document.getElementById("username").value;
    const passwordInput = document.getElementById("password").value;

    if (verifyLogin(usernameInput, passwordInput)) {
      localStorage.setItem("loggedIn", "true"); // Use localStorage for persistence
      window.location.href = "data.html";
    } else {
      loginError.textContent = "Invalid username or password.";
    }
  });
}

// --- Data Fetching and Display (on data.html) ---
// Use relative path to API endpoint for Vercel deployment
const apiEndpoint = "/api/signals";
let allData = [];
let displayedCount = 0;
const loadIncrement = 5; // Load this many items at a time

async function fetchData() {
  try {
    loadingIndicator.textContent = "Loading data...";
    loadingIndicator.style.display = "block";

    const response = await fetch(apiEndpoint);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const newData = await response.json();

    // Sort data by receivedAt in descending order
    newData.sort((a, b) => new Date(b.receivedAt) - new Date(a.receivedAt));
    allData = newData;
    displayData();
  } catch (error) {
    console.error("Error fetching data:", error);
    loadingIndicator.textContent = "Failed to load data.";
  } finally {
    loadingIndicator.style.display = "none";
  }
}

function displayData() {
  const nextData = allData.slice(
    displayedCount,
    displayedCount + loadIncrement
  );
  nextData.forEach((item) => {
    const dataBox = document.createElement("div");
    dataBox.classList.add("data-box");

    // Format the data nicely
    let content = `<div class="signal-header">
      <span class="signal-time">${formatDate(item.receivedAt)}</span>
    </div>`;

    // Create formatted content based on signal data
    content += `<div class="signal-content">`;
    for (const key in item) {
      if (key !== "receivedAt") {
        content += `<p><strong>${formatKey(key)}:</strong> ${item[key]}</p>`;
      }
    }
    content += `</div>`;

    dataBox.innerHTML = content;
    dataContainer.appendChild(dataBox);
  });
  displayedCount += nextData.length;

  // Check if all data is displayed
  if (displayedCount >= allData.length && allData.length > 0) {
    loadingIndicator.textContent = "No more data.";
  } else if (allData.length === 0) {
    loadingIndicator.textContent = "No signals received yet.";
  } else {
    loadingIndicator.style.display = "block";
  }
}

// Format date for display
function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleString();
}

// Format key names for display
function formatKey(key) {
  return key
    .replace(/([A-Z])/g, " $1")
    .replace(/^./, (str) => str.toUpperCase())
    .replace(/_/g, " ");
}

function handleScroll() {
  if (
    window.innerHeight + window.scrollY >= document.body.offsetHeight - 100 &&
    displayedCount < allData.length
  ) {
    loadingIndicator.style.display = "block";
    displayData();
  }
}

// --- Initialization on data.html ---
if (window.location.pathname.endsWith("data.html")) {
  // Check if the user is logged in using localStorage
  if (!localStorage.getItem("loggedIn")) {
    window.location.href = "index.html"; // Redirect to login if not "logged in"
  } else {
    fetchData();
    window.addEventListener("scroll", handleScroll);

    // Add periodic refresh every 60 seconds
    setInterval(fetchData, 60000);
  }
}

// Logout functionality
function logout() {
  localStorage.removeItem("loggedIn");
  window.location.href = "index.html";
}
