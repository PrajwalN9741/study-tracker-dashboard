// ======================
// DASHBOARD DATA (acts like Jinja)
// ======================
const tasks = [
  "Number System", "HCF & LCM", "Percentages", "Profit & Loss",
  "Ratios & Proportion", "Averages", "Ages", "Time & Work",
  "Speed & Distance", "Allegations", "Series",
  "Probability", "Permutations", "Data Interpretation", "Full Revision"
];

// Load state from localStorage (or default)
let state = JSON.parse(localStorage.getItem("tracker")) ||
  tasks.map(t => ({ task: t, status: "Not Started" }));

function saveState() {
  localStorage.setItem("tracker", JSON.stringify(state));
}

// ======================
// RENDER SELECT DROPDOWN
// ======================
const daySelect = document.getElementById("daySelect");
state.forEach((t, i) => {
  const opt = document.createElement("option");
  opt.value = i + 1;
  opt.textContent = `Day ${i + 1} – ${t.task}`;
  daySelect.appendChild(opt);
});

// ======================
// RENDER TABLE
// ======================
const table = document.getElementById("taskTable");

function renderTable() {
  table.innerHTML = "";
  let completed = 0;

  state.forEach((t, i) => {
    if (t.status === "Completed") completed++;

    table.innerHTML += `
      <tr>
        <td>Day ${i + 1}</td>
        <td>${t.task}</td>
        <td>${t.status}</td>
        <td>
          <button ${t.status === "Completed" ? "disabled" : ""} 
            onclick="markDone(${i})">
            ${t.status === "Completed" ? "✔ Done" : "Done"}
          </button>
        </td>
      </tr>`;
  });

  updateProgress(completed, state.length - completed);
}

function markDone(i) {
  state[i].status = "Completed";
  saveState();
  renderTable();
}

// ======================
// PROGRESS + CHART
// ======================
function updateProgress(done, missed) {
  const percent = Math.round((done / (done + missed)) * 100);
  document.getElementById("weeklyProgress")
    .innerText = `Weekly Progress: ${percent}%`;

  if (window.chart) window.chart.destroy();

  window.chart = new Chart(
    document.getElementById("chart"),
    {
      type: "doughnut",
      data: {
        labels: ["Completed", "Missed"],
        datasets: [{
          data: [done, missed],
          backgroundColor: ["#36a2eb", "#ff6384"]
        }]
      },
      options: {
        cutout: "70%",
        plugins: {
          legend: { position: "top" }
        }
      }
    }
  );
}

// ======================
// ALERT CHECK (Browser only)
// ======================
const today = (new Date().getDate() - 1) % state.length;
if (state[today].status !== "Completed") {
  showBrowserAlert("You missed today's study task!");
}

// ======================
renderTable();
