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

// -------- RENDER SELECT --------
const daySelect = document.getElementById("daySelect");
function renderSelect() {
  daySelect.innerHTML = "";
  state.forEach((t, i) => {
    const opt = document.createElement("option");
    opt.value = i;
    opt.textContent = `Day ${i+1} – ${t.task}`;
    daySelect.appendChild(opt);
  });
}

// -------- RENDER TABLE --------
const table = document.getElementById("taskTable");

function renderTable() {
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

function markDone(i) {
  state[i].status = "Completed";
  save();
  renderTable();
}

// -------- RESET / UNDO --------
function resetToday() {
  undoState = JSON.stringify(state);
  const today = (new Date().getDate()-1) % state.length;
  state[today].status = "Not Started";
  save(); renderTable();
}

function resetSelected() {
  undoState = JSON.stringify(state);
  const i = +daySelect.value;
  state[i].status = "Not Started";
  save(); renderTable();
}

function resetAll() {
  undoState = JSON.stringify(state);
  state.forEach(t => t.status="Not Started");
  save(); renderTable();
}

function undoReset() {
  if (!undoState) return;
  state = JSON.parse(undoState);
  save(); renderTable();
}

// -------- CHART + PROGRESS --------
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
function showBrowserAlert(msg) {
  const box = document.getElementById("alertBox");
  box.innerText = msg;
  box.style.display = "block";
  document.getElementById("alertSound").play().catch(()=>{});
}

const todayIdx = (new Date().getDate()-1) % state.length;
if (state[todayIdx].status !== "Completed") {
  setTimeout(()=>showBrowserAlert("You missed today's study task!"), 800);
}

// -------- INIT --------
renderSelect();
renderTable();
