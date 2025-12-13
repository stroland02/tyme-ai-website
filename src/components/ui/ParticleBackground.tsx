"use client";

import { useEffect, useRef } from "react";

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  opacity: number;
  twinkleSpeed: number;
  twinkleOffset: number;
}

interface ShootingStar {
  x: number;
  y: number;
  vx: number;
  vy: number;
  length: number;
  opacity: number;
  active: boolean;
}

export function ParticleBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let particles: Particle[] = [];
    let shootingStars: ShootingStar[] = [];
    let frameCount = 0;

    // Set canvas size
    const setCanvasSize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    setCanvasSize();
    window.addEventListener("resize", setCanvasSize);

    // Create particles (more stars!)
    const createParticles = () => {
      const particleCount = Math.floor((canvas.width * canvas.height) / 8000); // Doubled density
      particles = [];

      for (let i = 0; i < particleCount; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx: (Math.random() - 0.5) * 0.2,
          vy: (Math.random() - 0.5) * 0.2,
          size: Math.random() * 2.5 + 0.3,
          opacity: Math.random() * 0.7 + 0.3,
          twinkleSpeed: Math.random() * 0.02 + 0.01,
          twinkleOffset: Math.random() * Math.PI * 2,
        });
      }
    };

    createParticles();

    // Create a shooting star
    const createShootingStar = () => {
      const startFromLeft = Math.random() > 0.5;
      const shootingStar: ShootingStar = {
        x: startFromLeft ? -100 : canvas.width + 100,
        y: Math.random() * canvas.height * 0.6, // Upper 60% of screen
        vx: (startFromLeft ? 1 : -1) * (Math.random() * 8 + 12), // Fast movement
        vy: Math.random() * 3 + 2, // Slight downward angle
        length: Math.random() * 80 + 60,
        opacity: 1,
        active: true,
      };
      shootingStars.push(shootingStar);
    };

    // Mouse interaction
    let mouse = { x: 0, y: 0, radius: 150 };

    const handleMouseMove = (e: MouseEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };

    window.addEventListener("mousemove", handleMouseMove);

    // Animation loop
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      frameCount++;

      // Randomly create shooting stars (1 in 180 frames = ~3 seconds at 60fps)
      if (Math.random() < 0.006) {
        createShootingStar();
      }

      // Update and draw particles (stars)
      particles.forEach((particle, i) => {
        // Move particle
        particle.x += particle.vx;
        particle.y += particle.vy;

        // Wrap around edges
        if (particle.x < 0) particle.x = canvas.width;
        if (particle.x > canvas.width) particle.x = 0;
        if (particle.y < 0) particle.y = canvas.height;
        if (particle.y > canvas.height) particle.y = 0;

        // Mouse interaction
        const dx = mouse.x - particle.x;
        const dy = mouse.y - particle.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < mouse.radius) {
          const force = (mouse.radius - distance) / mouse.radius;
          const angle = Math.atan2(dy, dx);
          particle.vx -= Math.cos(angle) * force * 0.1;
          particle.vy -= Math.sin(angle) * force * 0.1;
        }

        // Damping
        particle.vx *= 0.99;
        particle.vy *= 0.99;

        // Twinkling effect
        const twinkle = Math.sin(frameCount * particle.twinkleSpeed + particle.twinkleOffset);
        const currentOpacity = particle.opacity * (0.5 + twinkle * 0.5);

        // Draw particle with glow
        ctx.shadowBlur = particle.size * 2;
        ctx.shadowColor = `rgba(147, 197, 253, ${currentOpacity})`;
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(147, 197, 253, ${currentOpacity})`; // blue-300
        ctx.fill();
        ctx.shadowBlur = 0;

        // Draw connections (fewer to reduce clutter with more stars)
        if (i % 3 === 0) { // Only draw connections for every 3rd star
          for (let j = i + 1; j < particles.length; j += 3) {
            const other = particles[j];
            const dx = particle.x - other.x;
            const dy = particle.y - other.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < 100) {
              ctx.beginPath();
              ctx.moveTo(particle.x, particle.y);
              ctx.lineTo(other.x, other.y);
              ctx.strokeStyle = `rgba(147, 197, 253, ${
                (1 - distance / 100) * 0.15
              })`;
              ctx.lineWidth = 0.3;
              ctx.stroke();
            }
          }
        }
      });

      // Update and draw shooting stars
      shootingStars = shootingStars.filter((star) => {
        if (!star.active) return false;

        // Move shooting star
        star.x += star.vx;
        star.y += star.vy;

        // Fade out
        star.opacity *= 0.97;

        // Deactivate if off screen or faded
        if (
          star.x < -200 ||
          star.x > canvas.width + 200 ||
          star.y > canvas.height + 200 ||
          star.opacity < 0.01
        ) {
          star.active = false;
          return false;
        }

        // Calculate tail start position
        const angle = Math.atan2(star.vy, star.vx);
        const tailX = star.x - Math.cos(angle) * star.length;
        const tailY = star.y - Math.sin(angle) * star.length;

        // Draw shooting star trail with gradient
        const gradient = ctx.createLinearGradient(tailX, tailY, star.x, star.y);
        gradient.addColorStop(0, `rgba(147, 197, 253, 0)`);
        gradient.addColorStop(0.5, `rgba(147, 197, 253, ${star.opacity * 0.5})`);
        gradient.addColorStop(1, `rgba(255, 255, 255, ${star.opacity})`);

        ctx.shadowBlur = 15;
        ctx.shadowColor = `rgba(147, 197, 253, ${star.opacity})`;
        ctx.strokeStyle = gradient;
        ctx.lineWidth = 3;
        ctx.lineCap = "round";
        ctx.beginPath();
        ctx.moveTo(tailX, tailY);
        ctx.lineTo(star.x, star.y);
        ctx.stroke();

        // Draw bright head
        ctx.shadowBlur = 20;
        ctx.shadowColor = `rgba(255, 255, 255, ${star.opacity})`;
        ctx.fillStyle = `rgba(255, 255, 255, ${star.opacity})`;
        ctx.beginPath();
        ctx.arc(star.x, star.y, 2, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;

        return true;
      });

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener("resize", setCanvasSize);
      window.removeEventListener("mousemove", handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-none"
      style={{ opacity: 0.6 }}
    />
  );
}
