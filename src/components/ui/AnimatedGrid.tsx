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
    let mouse = { x: -1000, y: -1000 }; // Start off-screen
    const glowRadius = 300; // Radius of mouse glow effect

    // Track mouse position
    const handleMouseMove = (e: MouseEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };

    const handleMouseLeave = () => {
      mouse.x = -1000;
      mouse.y = -1000;
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseleave", handleMouseLeave);

    // Animate grid offset
    gsap.to(offset, {
      x: gridSize,
      y: gridSize,
      duration: 20,
      repeat: -1,
      ease: "none",
    });

    // Calculate distance from point to mouse
    const getDistanceFromMouse = (x: number, y: number) => {
      const dx = x - mouse.x;
      const dy = y - mouse.y;
      return Math.sqrt(dx * dx + dy * dy);
    };

    // Get glow intensity based on distance
    const getGlowIntensity = (distance: number) => {
      if (distance > glowRadius) return 0;
      return (1 - distance / glowRadius) * 0.8; // Max 80% intensity
    };

    // Draw grid
    const drawGrid = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw vertical lines
      for (let x = -gridSize + (offset.x % gridSize); x < canvas.width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);

        // Draw line in segments for gradient effect
        const segments = 50;
        for (let i = 0; i <= segments; i++) {
          const y = (canvas.height / segments) * i;
          const distance = getDistanceFromMouse(x, y);
          const glowIntensity = getGlowIntensity(distance);

          // Base color
          const baseR = 99, baseG = 102, baseB = 241; // indigo
          const glowR = 139, glowG = 92, glowB = 246; // purple/violet

          // Interpolate between base and glow color
          const r = Math.round(baseR + (glowR - baseR) * glowIntensity);
          const g = Math.round(baseG + (glowG - baseG) * glowIntensity);
          const b = Math.round(baseB + (glowB - baseB) * glowIntensity);
          const a = 0.1 + glowIntensity * 0.5; // Increase opacity near mouse

          ctx.strokeStyle = `rgba(${r}, ${g}, ${b}, ${a})`;
          ctx.lineWidth = lineWidth + glowIntensity * 2; // Thicker near mouse

          if (i > 0) {
            ctx.lineTo(x, y);
            ctx.stroke();
            ctx.beginPath();
            ctx.moveTo(x, y);
          }
        }
        ctx.stroke();
      }

      // Draw horizontal lines
      for (let y = -gridSize + (offset.y % gridSize); y < canvas.height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);

        // Draw line in segments for gradient effect
        const segments = 50;
        for (let i = 0; i <= segments; i++) {
          const x = (canvas.width / segments) * i;
          const distance = getDistanceFromMouse(x, y);
          const glowIntensity = getGlowIntensity(distance);

          // Base color
          const baseR = 99, baseG = 102, baseB = 241; // indigo
          const glowR = 139, glowG = 92, glowB = 246; // purple/violet

          // Interpolate between base and glow color
          const r = Math.round(baseR + (glowR - baseR) * glowIntensity);
          const g = Math.round(baseG + (glowG - baseG) * glowIntensity);
          const b = Math.round(baseB + (glowB - baseB) * glowIntensity);
          const a = 0.1 + glowIntensity * 0.5; // Increase opacity near mouse

          ctx.strokeStyle = `rgba(${r}, ${g}, ${b}, ${a})`;
          ctx.lineWidth = lineWidth + glowIntensity * 2; // Thicker near mouse

          if (i > 0) {
            ctx.lineTo(x, y);
            ctx.stroke();
            ctx.beginPath();
            ctx.moveTo(x, y);
          }
        }
        ctx.stroke();
      }

      // Draw radial glow at mouse position
      if (mouse.x > 0 && mouse.y > 0) {
        const gradient = ctx.createRadialGradient(
          mouse.x, mouse.y, 0,
          mouse.x, mouse.y, glowRadius
        );
        gradient.addColorStop(0, "rgba(139, 92, 246, 0.15)"); // purple center
        gradient.addColorStop(0.5, "rgba(99, 102, 241, 0.08)"); // indigo middle
        gradient.addColorStop(1, "rgba(59, 130, 246, 0)"); // blue fade out

        ctx.fillStyle = gradient;
        ctx.fillRect(
          mouse.x - glowRadius,
          mouse.y - glowRadius,
          glowRadius * 2,
          glowRadius * 2
        );
      }

      requestAnimationFrame(drawGrid);
    };

    drawGrid();

    return () => {
      window.removeEventListener("resize", setCanvasSize);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseleave", handleMouseLeave);
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
