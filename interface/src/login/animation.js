import { gsap } from "gsap";

export function initAnimation(canvasRef) {
  console.log("✅ initAnimation function is running!");

  if (!canvasRef || !canvasRef.current) {
    console.error("❌ Canvas not found!");
    return;
  }

  const canvas = canvasRef.current;
  const ctx = canvas.getContext("2d");
  const width = window.innerWidth;
  const height = window.innerHeight;
  canvas.width = width;
  canvas.height = height;

  const points = [];
  let lastHoveredPoint = null;

  // ─── Create a Seamless Grid of Points ──────────────────────────────
  for (let x = 0; x <= width; x += width / 10) {
    for (let y = 0; y <= height; y += height / 10) {
      const px = x + Math.random() * (width / 20) - width / 40;
      const py = y + Math.random() * (height / 20) - height / 40;
      const p = {
        x: px,
        y: py,
        originX: px,
        originY: py,
        depth: Math.random() * 1.5 + 0.5, // Depth for 3D effect
        closest: [],
        active: 0.3,
        moving: false,
      };
      points.push(p);
    }
  }

  // ─── Find Nearest Points ─────────────────────────────
  points.forEach((p1) => {
    const sorted = [...points].sort((a, b) => getDistance(p1, a) - getDistance(p1, b));
    p1.closest = sorted.slice(1, 6);
  });

  // ─── Define Circle Function (Fix for "Circle is not defined" Error) ───
  function Circle(pos, radius, color) {
    this.pos = pos;
    this.radius = radius;
    this.color = color;
    this.active = 0.6;
  }

  // ─── Create Circles for Each Point ───────────────────
  points.forEach((p) => {
    p.circle = new Circle(p, 6 + Math.random() * 3, "rgba(255,255,255,0.3)");
    p.circle.active = 0.6;
  });

  // ─── Animation Loop ──────────────────────────────────
  function animate() {
    ctx.clearRect(0, 0, width, height);
    points.forEach((p) => {
      draw3DLines(p);
      draw3DCircle(p);
    });
    requestAnimationFrame(animate);
  }

  // ─── Draw 3D Lines Between Points ───────────────────────
  function draw3DLines(p) {
    if (p.active === 0) return;
    p.closest.forEach((pt) => {
      const gradient = ctx.createLinearGradient(p.x, p.y, pt.x, pt.y);
      gradient.addColorStop(0, `rgba(255, 255, 255, ${p.active * p.depth})`);
      gradient.addColorStop(1, `rgba(50, 150, 255, ${pt.active * pt.depth})`);
      ctx.beginPath();
      ctx.moveTo(p.x, p.y);
      ctx.lineTo(pt.x, pt.y);
      ctx.strokeStyle = gradient;
      ctx.lineWidth = p.active * 5 * p.depth;
      ctx.stroke();
    });
  }

  // ─── Draw 3D Circles ─────────────────────
  function draw3DCircle(p) {
    if (p.active === 0) return;
    const radius = (p.circle.radius * p.active * p.depth) + 2;
    const gradient = ctx.createRadialGradient(p.x, p.y, radius * 0.3, p.x, p.y, radius);
    gradient.addColorStop(0, `rgba(255, 255, 255, 1)`);
    gradient.addColorStop(0.5, `rgba(100, 150, 255, 0.8)`);
    gradient.addColorStop(1, `rgba(20, 50, 150, 0.5)`);
    ctx.beginPath();
    ctx.arc(p.x, p.y, radius, 0, Math.PI * 2);
    ctx.fillStyle = gradient;
    ctx.fill();
  }

  // ─── Calculate Distance ──────────────────────────────
  function getDistance(p1, p2) {
    return (p1.x - p2.x) ** 2 + (p1.y - p2.y) ** 2;
  }

  // ─── Mouse Hover Event ───────────────────────────────
  function onMouseMove(event) {
    const rect = canvas.getBoundingClientRect();
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;
    const hoverRange = 150;
    let nearestPoint = null;
    let minDist = hoverRange;
    points.forEach((p) => {
      const distance = Math.sqrt(getDistance({ x: mouseX, y: mouseY }, p));
      if (distance < minDist) {
        nearestPoint = p;
        minDist = distance;
      }
    });

    if (nearestPoint && nearestPoint !== lastHoveredPoint) {
      lastHoveredPoint = nearestPoint;
      gsap.to(nearestPoint, {
        duration: 1,
        x: nearestPoint.originX + (Math.random() * 80 - 40),
        y: nearestPoint.originY + (Math.random() * 80 - 40),
        ease: "power3.out",
        overwrite: "auto",
      });

      gsap.to(nearestPoint.circle, {
        duration: 0.6,
        active: 1,
        overwrite: "auto",
      });

      setTimeout(() => {
        points.forEach((p) => {
          if (p !== nearestPoint) {
            gsap.to(p, {
              duration: 1.2,
              x: p.originX,
              y: p.originY,
              ease: "power2.out",
              overwrite: "auto",
            });

            gsap.to(p.circle, {
              duration: 1.2,
              active: 0.6,
              overwrite: "auto",
            });
          }
        });
      }, 300);
    }
  }

  // ─── Reset on Mouse Leave ─────────────────────────────
  function onMouseLeave() {
    setTimeout(() => {
      points.forEach((p) => {
        gsap.to(p, {
          duration: 1.5,
          x: p.originX,
          y: p.originY,
          ease: "power2.out",
          overwrite: "auto",
        });

        gsap.to(p.circle, {
          duration: 1,
          active: 0.6,
          overwrite: "auto",
        });
      });
    }, 500);
  }

  // ─── Attach Event Listeners ───────────────────────────
  canvas.addEventListener("mousemove", onMouseMove);
  canvas.addEventListener("mouseleave", onMouseLeave);

  animate();
}
