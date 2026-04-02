import { useEffect } from "react";

const useDust = (canvasId, color = "200,180,140") => {
  useEffect(() => {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let particles = [];
    let W, H, animId;

    function resize() {
      W = canvas.width = canvas.parentElement.offsetWidth;
      H = canvas.height = canvas.parentElement.offsetHeight;
    }

    function createParticle() {
      return {
        x: Math.random() * W,
        y: Math.random() * H,
        r: Math.random() * 2.5 + 1,
        speedX: (Math.random() - 0.5) * 0.15,
        speedY: -Math.random() * 0.25 - 0.05,
        opacity: Math.random() * 0.8 + 0.4,
        life: 0,
        maxLife: Math.random() * 400 + 200,
      };
    }

    resize();
    for (let i = 0; i < 90; i++) particles.push(createParticle());

    function animate() {
      ctx.clearRect(0, 0, W, H);
      particles.forEach((p, i) => {
        p.x += p.speedX;
        p.y += p.speedY;
        p.life++;
        const fade = p.life < 60 ? p.life / 60
          : p.life > p.maxLife - 60 ? (p.maxLife - p.life) / 60
          : 1;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${color},${p.opacity * fade})`;
        ctx.fill();
        if (p.life >= p.maxLife || p.y < -5) particles[i] = createParticle();
      });
      animId = requestAnimationFrame(animate);
    }
    animate();

    return () => cancelAnimationFrame(animId);
  }, [canvasId, color]);
};

export default useDust;