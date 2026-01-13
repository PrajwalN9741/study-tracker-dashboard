document.addEventListener("DOMContentLoaded", () => {

// -------- DATA (acts like Jinja variables) --------
const tasks = [
  "Number System","HCF & LCM","Percentages","Profit & Loss",
  "Ratios & Proportion","Averages","Ages","Time & Work",
  "Speed & Distance","Allegations","Series",
  "Probability","Permutations","Data Interpretation","Full Revision"
];

// Load state (or init)
let state = JSON.parse(localStorage.getItem("tracker")) ||
  tasks.map(t => ({ task: t, status: "Not Started" }));

let undoState = null;

function save() {
  localStorage.setItem("tracker", JSON.stringify(state));
}

// -------- ELEMENTS --------
const daySelect = document.getElementById("daySelect");
const table = document.getElementById("taskTable");

// -------- RENDER SELECT --------
function renderSelect() {
  if (!daySelect) return;
  daySelect.innerHTML = "";
  state.forEach((t, i) => {
    const opt = document.createElement("option");
    opt.value = i;
    opt.textContent = `Day ${i+1} – ${t.task}`;
    daySelect.appendChild(opt);
  });
}

// -------- RENDER TABLE --------
function renderTable() {
  if (!table) return;
  table.innerHTML = "";
  let completed = 0;

  state.forEach((t, i) => {
    if (t.status === "Completed") completed++;

    table.innerHTML += `
      <tr>
        <td>Day ${i+1}</td>
        <td>${t.task}</td>
        <td>${t.status}</td>
        <td>
          <button ${t.status==="Completed"?"disabled":""}
            onclick="markDone(${i})">
            ${t.status==="Completed"?"✔ Done":"Done"}
          </button>
        </td>
      </tr>`;
  });

  updateChart(completed, state.length - completed);
}

window.markDone = function(i) {
  state[i].status = "Completed";
  save();
  renderTable();
};

// -------- RESET / UNDO --------
window.resetToday = function() {
  undoState = JSON.stringify(state);
  const today = (new Date().getDate()-1) % state.length;
  state[today].status = "Not Started";
  save(); renderTable();
};

window.resetSelected = function() {
  undoState = JSON.stringify(state);
  const i = +daySelect.value;
  state[i].status = "Not Started";
  save(); renderTable();
};

window.resetAll = function() {
  undoState = JSON.stringify(state);
  state.forEach(t => t.status="Not Started");
  save(); renderTable();
};

window.undoReset = function() {
  if (!undoState) return;
  state = JSON.parse(undoState);
  save(); renderTable();
};

// -------- CHART --------
let chart;
function updateChart(done, missed) {
  const percent = Math.round((done/(done+missed))*100);
  document.getElementById("weeklyProgress")
    .innerText = `Weekly Progress: ${percent}%`;

  if (chart) chart.destroy();
  chart = new Chart(document.getElementById("chart"), {
    type: "doughnut",
    data: {
      labels: ["Completed","Missed"],
      datasets: [{
        data: [done, missed],
        backgroundColor: ["#36a2eb","#ff6384"]
      }]
    },
    options: {
      cutout: "70%",
      plugins: { legend: { position: "top" } }
    }
  });
}

// -------- ALERT (Browser-only) --------
function showBrowserAlert(message) {
  const box = document.getElementById("alertBox");
  if (!box) return;

  box.innerText = message;
  box.style.display = "block";

  if ("Notification" in window && Notification.permission === "granted") {
    new Notification("📘 TCS Study Alert", {
      body: message,
      icon: "static/icon-192.png"
    });
  }

  const todayKey = "alertPlayed-" + new Date().toDateString();
  if (!localStorage.getItem(todayKey)) {
    document.getElementById("alertSound").play().catch(()=>{});
    localStorage.setItem(todayKey, "yes");
  }
}

// -------- DAILY CHECK --------
const todayIdx = (new Date().getDate() - 1) % state.length;
if (state[todayIdx].status !== "Completed") {
  showBrowserAlert("You missed today's study task!");
}

// -------- INIT --------
renderSelect();
renderTable();

});
