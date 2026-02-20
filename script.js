const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

let drawing = false;
let brushSize = 5;
let brushColor = "#ffffff";
let isEraser = false;

let history = [];

// Resize canvas to full screen
function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight - 150;
}
resizeCanvas();
window.addEventListener("resize", resizeCanvas);

// Save state for undo
function saveState() {
  history.push(canvas.toDataURL());
  if (history.length > 50) history.shift();
}

canvas.addEventListener("mousedown", (e) => {
  drawing = true;
  saveState();
  draw(e);
});

canvas.addEventListener("mouseup", () => drawing = false);
canvas.addEventListener("mouseout", () => drawing = false);

canvas.addEventListener("mousemove", draw);

function draw(e) {
  if (!drawing) return;

  ctx.lineWidth = brushSize;
  ctx.lineCap = "round";
  ctx.strokeStyle = isEraser ? "#0a0f1f" : brushColor;

  ctx.lineTo(e.clientX, e.clientY);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(e.clientX, e.clientY);
}

// Controls
document.getElementById("brushSize").addEventListener("input", (e) => {
  brushSize = e.target.value;
});

document.getElementById("colorPicker").addEventListener("input", (e) => {
  brushColor = e.target.value;
  isEraser = false;
});

document.getElementById("eraser").addEventListener("click", () => {
  isEraser = true;
});

document.getElementById("clear").addEventListener("click", () => {
  saveState();
  ctx.clearRect(0, 0, canvas.width, canvas.height);
});

document.getElementById("undo").addEventListener("click", () => {
  if (history.length === 0) return;
  const img = new Image();
  img.src = history.pop();
  img.onload = () => ctx.drawImage(img, 0, 0);
});

document.getElementById("save").addEventListener("click", () => {
  const link = document.createElement("a");
  link.download = "drawing.png";
  link.href = canvas.toDataURL();
  link.click();
});
