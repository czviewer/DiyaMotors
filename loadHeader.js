function loadHeader(userData) {
  return fetch("header.html")
    .then(res => {
      if (!res.ok) throw new Error("Header not found");
      return res.text();
    })
    .then(html => {
      document.body.insertAdjacentHTML("afterbegin", html);

      return new Promise(resolve => {
        const interval = setInterval(() => {
          const userName = document.getElementById("user-name");
          const adminBtn = document.getElementById("admin-panel-btn");
          const logsBtn = document.getElementById("logs-btn");
          const logoutBtn = document.getElementById("logout-btn");
          const branchInfo = document.getElementById("branch-info");
          const clockEl = document.getElementById("live-clock");

          if (userName && adminBtn && logoutBtn && branchInfo && clockEl) {
            clearInterval(interval);

            // Fill header info
            userName.textContent = `${userData.name} (${userData.role})`;
            branchInfo.textContent = userData.subdivision
              ? `${userData.branch} - ${userData.subdivision}`
              : userData.branch;

            // ✅ Start Smart Clock with getNow()
           

            // ✅ Role Based Display
            if (userData.role === "Dev" || userData.role === "Admin") {
              logsBtn.style.display = "inline-block";
              adminBtn.style.display = "inline-block";
            }

            // ✅ Event Handlers
            adminBtn.addEventListener("click", () => {
              window.location.href = "admin.html";
            });

            logsBtn?.addEventListener("click", () => {
              const logs = document.getElementById("activity-logs");
              if (logs) {
                logs.classList.toggle("hidden");
                logs.scrollIntoView({ behavior: "smooth" });
              }
            });

            logoutBtn.addEventListener("click", () => {
              if (confirm("Are you sure you want to log out?")) {
                firebase.auth().signOut().then(() => {
                  window.location.href = "index.html";
                });
              }
            });

            resolve(); // ✅ Header fully ready
          }
        }, 100);
      });
    });
}
