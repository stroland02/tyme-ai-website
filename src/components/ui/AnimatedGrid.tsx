"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";

export function AnimatedGrid() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Set canvas size
    const setCanvasSize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    setCanvasSize();
    window.addEventListener("resize", setCanvasSize);

    // Grid configuration
    const gridSize = 50;
    const lineWidth = 1;
    let offset = { x: 0, y: 0 };

    // Animate grid offset
    gsap.to(offset, {
      x: gridSize,
      y: gridSize,
      duration: 20,
      repeat: -1,
      ease: "none",
    });

    // Draw grid
    const drawGrid = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Create gradient
      const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
      gradient.addColorStop(0, "rgba(99, 102, 241, 0.1)"); // indigo
      gradient.addColorStop(0.5, "rgba(168, 85, 247, 0.1)"); // purple
      gradient.addColorStop(1, "rgba(59, 130, 246, 0.1)"); // blue

      ctx.strokeStyle = gradient;
      ctx.lineWidth = lineWidth;

      // Draw vertical lines
      for (let x = -gridSize + (offset.x % gridSize); x < canvas.width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
      }

      // Draw horizontal lines
      for (let y = -gridSize + (offset.y % gridSize); y < canvas.height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
      }

      requestAnimationFrame(drawGrid);
    };

    drawGrid();

    return () => {
      window.removeEventListener("resize", setCanvasSize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-none"
      style={{ opacity: 0.3 }}
    />
  );
}
