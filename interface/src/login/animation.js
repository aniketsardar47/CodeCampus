import { TweenLite, Circ } from "gsap";

export function initAnimation(canvasRef) {
    console.log("✅ initAnimation function is running!");

    if (!canvasRef || !canvasRef.current) {
        console.log("❌ Canvas not found!");
        return;
    }

    let canvas = canvasRef.current;
    let ctx = canvas.getContext("2d");
    let width = window.innerWidth;
    let height = window.innerHeight;
    let points = [];
    let target = { x: width / 2, y: height / 2 };

    canvas.width = width;
    canvas.height = height;

    // Create points
    for (let x = 0; x < width; x += width / 15) {
        for (let y = 0; y < height; y += height / 15) {
            let px = x + Math.random() * width / 15;
            let py = y + Math.random() * height / 15;
            let p = { x: px, y: py, originX: px, originY: py, closest: [] };
            points.push(p);
        }
    }

    // Find the closest points
    for (let i = 0; i < points.length; i++) {
        let closest = [];
        let p1 = points[i];
        for (let j = 0; j < points.length; j++) {
            let p2 = points[j];
            if (p1 !== p2) {
                closest.push(p2);
            }
        }
        closest.sort((a, b) => getDistance(p1, a) - getDistance(p1, b));
        p1.closest = closest.slice(0, 5);
    }

    // Create circles
    for (let i in points) {
        let c = new Circle(points[i], 6 + Math.random() * 3, "rgba(255,255,255,0.3)");
        points[i].circle = c;
    }

    function mouseMove(e) {
        target.x = e.pageX;
        target.y = e.pageY;
    }

    function animate() {
        ctx.clearRect(0, 0, width, height);
        for (let i in points) {
            let distance = getDistance(target, points[i]);
            if (distance < 8000) {
                points[i].active = 0.7;
                points[i].circle.active = 1.5;
            } else if (distance < 25000) {
                points[i].active = 0.3;
                points[i].circle.active = 0.6;
            } else {
                points[i].active = 0;
                points[i].circle.active = 0;
            }
            drawLines(points[i]);
            points[i].circle.draw();
        }
        requestAnimationFrame(animate);
    }

    function drawLines(p) {
        if (!p.active) return;
        for (let i in p.closest) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p.closest[i].x, p.closest[i].y);
            ctx.strokeStyle = `rgba(156,217,249,${p.active})`;
            ctx.lineWidth = p.active * 3;
            ctx.stroke();
        }
    }

    function shiftPoint(p) {
        TweenLite.to(p, 1 + Math.random(), {
            x: p.originX - 50 + Math.random() * 100,
            y: p.originY - 50 + Math.random() * 100,
            ease: Circ.easeInOut,
            onComplete: () => shiftPoint(p),
        });
    }

    function getDistance(p1, p2) {
        return Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2);
    }

    function Circle(pos, rad, color) {
        this.pos = pos;
        this.radius = rad;
        this.color = color;
        this.draw = function () {
            if (!this.active) return;
            ctx.beginPath();
            ctx.arc(this.pos.x, this.pos.y, this.radius * this.active, 0, 2 * Math.PI);
            ctx.fillStyle = `rgba(156,217,249,${this.active})`;
            ctx.fill();
        };
    }

    window.addEventListener("mousemove", mouseMove);
    animate();
    for (let i in points) {
        shiftPoint(points[i]);
    }
}
