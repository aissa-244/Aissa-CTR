const canvas = document.createElement("canvas");
canvas.style.cssText = "position:fixed;top:0;left:0;pointer-events:none;z-index:9999;";
document.body.appendChild(canvas);
const ctx = canvas.getContext("2d");

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
window.addEventListener("resize", resizeCanvas);
resizeCanvas();

let trail = [];
const trailColor = "black";

document.addEventListener("mousemove", (e) => {
  trail.push({ x: e.clientX, y: e.clientY, alpha: 1 });
});

function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  if (trail.length > 2) {
    drawTrail();
  }

  for (let i = 0; i < trail.length; i++) {
    trail[i].alpha -= 0.04;
  }
  trail = trail.filter(p => p.alpha > 0);

  requestAnimationFrame(animate);
}

function drawTrail() {
  ctx.lineWidth = 2;
  ctx.lineCap = "butt";
  ctx.lineJoin = "round";

  for (let i = 0; i < trail.length - 2; i++) {
    const p0 = trail[i];
    const p1 = trail[i + 1];

    const mx1x = (p0.x + p1.x) / 2;
    const mx1y = (p0.y + p1.y) / 2;
    const mx2x = (p1.x + trail[i + 2].x) / 2;
    const mx2y = (p1.y + trail[i + 2].y) / 2;

    ctx.beginPath();
    ctx.moveTo(mx1x, mx1y);
    ctx.quadraticCurveTo(p1.x, p1.y, mx2x, mx2y);
    ctx.globalAlpha = p0.alpha;
    ctx.strokeStyle = trailColor;
    ctx.stroke();
  }

  ctx.globalAlpha = 1;
}

animate();