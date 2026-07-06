"use client";

import { useEffect, useRef } from "react";

export default function HoverGrid() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let mouseX = -1000;
    let mouseY = -1000;
    let animId: number;
    const CELL = 50;
    const RADIUS = 180;

    function resize() {
      if (!canvas) return;
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    }

    function onMouseMove(e: MouseEvent) {
      const rect = canvas!.getBoundingClientRect();
      mouseX = e.clientX - rect.left;
      mouseY = e.clientY - rect.top;
    }

    function onMouseLeave() {
      mouseX = -1000;
      mouseY = -1000;
    }

    function draw() {
      if (!ctx || !canvas) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const cols = Math.ceil(canvas.width / CELL) + 1;
      const rows = Math.ceil(canvas.height / CELL) + 1;

      for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
          const x = col * CELL;
          const y = row * CELL;
          const dist = Math.sqrt((x - mouseX) ** 2 + (y - mouseY) ** 2);

          if (dist < RADIUS) {
            const alpha = (1 - dist / RADIUS) * 0.4;
            ctx.beginPath();
            ctx.arc(x, y, 1.5, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(0, 255, 136, ${alpha})`;
            ctx.fill();
          } else {
            ctx.beginPath();
            ctx.arc(x, y, 0.5, 0, Math.PI * 2);
            ctx.fillStyle = "rgba(255, 255, 255, 0.03)";
            ctx.fill();
          }
        }
      }

      animId = requestAnimationFrame(draw);
    }

    resize();
    window.addEventListener("resize", resize);
    canvas.addEventListener("mousemove", onMouseMove);
    canvas.addEventListener("mouseleave", onMouseLeave);
    draw();

    return () => {
      window.removeEventListener("resize", resize);
      canvas.removeEventListener("mousemove", onMouseMove);
      canvas.removeEventListener("mouseleave", onMouseLeave);
      cancelAnimationFrame(animId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-auto z-0"
      style={{ opacity: 0.8 }}
    />
  );
}
