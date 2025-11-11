const pickBtn = document.getElementById("pickBtn");
const mixerBtn = document.getElementById("mixerBtn");
const mixerPopover = document.getElementById("mixerPopover");
const popoverColor = document.getElementById("popoverColor");
const savePopoverBtn = document.getElementById("savePopoverBtn");
const cancelPopoverBtn = document.getElementById("cancelPopoverBtn");
const clearColor = document.getElementById("clearColor");
const colorsList = document.getElementById("colorsList");

// 🧩 Load saved colors

function loadColors() {
  const colors = JSON.parse(localStorage.getItem("savedColors") || "[]");
  colorsList.innerHTML = "";
  colors.forEach((color) => {
    const listDiv = document.createElement("div");
    listDiv.classList.add("coloritem");
    const div = document.createElement("div");
    div.className = "color-box";
    div.style.background = color;
    div.title = color;

    const p = document.createElement("p");
    p.innerText = color;
    listDiv.appendChild(div);
    listDiv.appendChild(p);
    listDiv.addEventListener("click", () => {
      navigator.clipboard.writeText(color);
    });
    colorsList.appendChild(listDiv);
  });
}

// 💾 Save color to localStorage
function saveColor(color) {
  let colors = JSON.parse(localStorage.getItem("savedColors") || "[]");
  if (!colors.includes(color)) {
    colors.push(color);
    localStorage.setItem("savedColors", JSON.stringify(colors));
    loadColors();
  } else {
    showTempMessage("Color already saved!");
  }
}

// 🧠 Helper: temporary feedback message
function showTempMessage(msg) {
  const div = document.createElement("div");
  div.textContent = msg;
  div.style.position = "fixed";
  div.style.bottom = "10px";
  div.style.left = "50%";
  div.style.transform = "translateX(-50%)";
  div.style.background = "#333";
  div.style.color = "white";
  div.style.padding = "5px 10px";
  div.style.borderRadius = "5px";
  div.style.fontSize = "12px";
  div.style.opacity = "0.9";
  div.style.zIndex = "1000";
  document.body.appendChild(div);
  setTimeout(() => div.remove(), 1200);
}

// 🎯 EyeDropper API
pickBtn.addEventListener("click", async () => {
  if (!window.EyeDropper) {
    alert("Your browser does not support the EyeDropper API.");
    return;
  }
  try {
    const eyeDropper = new EyeDropper();
    const result = await eyeDropper.open();
    saveColor(result.sRGBHex);
  } catch (err) {
    console.warn("Eyedropper canceled or failed:", err);
  }
});

// 🎨 Mixer popover logic
mixerBtn.addEventListener("click", (e) => {
  e.stopPropagation();
  mixerPopover.classList.remove("hidden");
});

// Save inside popover
savePopoverBtn.addEventListener("click", () => {
  const color = popoverColor.value;
  saveColor(color);
  mixerPopover.classList.add("hidden");
});

// Cancel popover
cancelPopoverBtn.addEventListener("click", () => {
  mixerPopover.classList.add("hidden");
});

// Close popover on outside click
document.addEventListener("click", (e) => {
  if (!mixerPopover.classList.contains("hidden")) {
    const isInside = mixerPopover.contains(e.target) || e.target === mixerBtn;
    if (!isInside) mixerPopover.classList.add("hidden");
  }
});

clearColor.addEventListener("click", () => {
  // remove from storage
  localStorage.removeItem("savedColors");

  // refresh UI: prefer calling existing loadColors() if present
  if (typeof loadColors === "function") {
    loadColors();
  } else {
    const list = document.getElementById("colorsList");
    if (list) list.innerHTML = "";
  }

  // show feedback: use existing showTempMessage() if available, otherwise create a small toast
  if (typeof showTempMessage === "function") {
    showTempMessage("Cleared all colors!");
  } else {
    const t = document.createElement("div");
    t.textContent = "Cleared all colors!";
    Object.assign(t.style, {
      position: "fixed",
      bottom: "10px",
      left: "50%",
      transform: "translateX(-50%)",
      background: "#333",
      color: "#fff",
      padding: "6px 10px",
      borderRadius: "6px",
      fontSize: "12px",
      zIndex: 10000,
      opacity: "0.95",
    });
    document.body.appendChild(t);
    setTimeout(() => t.remove(), 1200);
  }
});

loadColors();
