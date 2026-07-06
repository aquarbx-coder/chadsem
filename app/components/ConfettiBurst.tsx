"use client";

import { useCallback, useRef, useEffect } from "react";

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  color: string;
  size: number;
  rotation: number;
  rotSpeed: number;
}

export function useConfetti() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const particlesRef = useRef<Particle[]>([]);
  const animRef = useRef<number>(0);

  useEffect(() => {
    const canvas = document.createElement("canvas");
    canvas.style.cssText =
      "position:fixed;inset:0;pointer-events:none;z-index:9999;width:100%;height:100%";
    document.body.appendChild(canvas);
    canvasRef.current = canvas;

    function resize() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener("resize", resize);

    const ctx = canvas.getContext("2d")!;

    function animate() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particlesRef.current = particlesRef.current.filter((p) => {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.15;
        p.vx *= 0.99;
        p.life -= 1;
        p.rotation += p.rotSpeed;

        if (p.life <= 0) return false;

        const alpha = Math.min(p.life / 30, 1);
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation);
        ctx.fillStyle = p.color.replace("1)", `${alpha})`);
        ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.6);
        ctx.restore();

        return true;
      });

      animRef.current = requestAnimationFrame(animate);
    }

    animate();

    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(animRef.current);
      canvas.remove();
    };
  }, []);

  const burst = useCallback((x: number, y: number) => {
    const colors = [
      "rgba(0, 255, 136, 1)",
      "rgba(0, 204, 106, 1)",
      "rgba(102, 255, 187, 1)",
      "rgba(255, 255, 255, 1)",
      "rgba(0, 255, 170, 1)",
      "rgba(50, 255, 150, 1)",
    ];

    for (let i = 0; i < 40; i++) {
      const angle = (Math.PI * 2 * i) / 40 + (Math.random() - 0.5) * 0.5;
      const speed = 3 + Math.random() * 8;
      particlesRef.current.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 3,
        life: 50 + Math.random() * 30,
        color: colors[Math.floor(Math.random() * colors.length)],
        size: 4 + Math.random() * 6,
        rotation: Math.random() * Math.PI * 2,
        rotSpeed: (Math.random() - 0.5) * 0.3,
      });
    }
  }, []);

  return burst;
}
