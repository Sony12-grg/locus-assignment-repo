const form = document.getElementById("regForm");
const information = document.getElementById("information");

// Load users from database
async function loadUsers() {
  const res = await fetch("http://localhost:3000/users");
  const users = await res.json();
  information.innerHTML = "";
if (users.length === 0) {
  information.innerHTML = "<p>No data available</p>";
} else {
  for (let i = 0; i < users.length; i++) {
    information.innerHTML += `
      <div style="border:1px solid #000; margin:6px; padding:6px;">
        <p><b>Name:</b> ${users[i].fullname}</p>
        <p><b>Email:</b> ${users[i].email}</p>
        <p><b>Password:</b> ${users[i].password}</p>
      </div>
    `;
  }
}
}

// SUBMIT DATA
form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const fullname = document.getElementById("fullname").value;
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  await fetch("http://localhost:3000/submit", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ fullname, email, password }),
  });

  loadUsers(); // update UI
});

// RESET DATA
form.addEventListener("reset", async () => {
  await fetch("http://localhost:3000/reset", { method: "POST" });
  information.innerHTML = "<p>No data available</p>";
});

// Load DB data on page load
loadUsers();
