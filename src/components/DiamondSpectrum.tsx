"use client";

import React, { useRef, useEffect, useState } from "react";
import { Coordinate } from "../lib/engine";

interface Props {
  onCoordinateChange: (coord: Coordinate) => void;
}

export default function DiamondSpectrum({ onCoordinateChange }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  // State for LERP physics
  const targetPos = useRef<Coordinate>({ x: 0, y: 0 });
  const currentPos = useRef<Coordinate>({ x: 0, y: 0 });
  const requestRef = useRef<number>(0);

  const SIZE = 1000;
  const CENTER = SIZE / 2;
  const RADIUS = 300; // 200px padding for labels
  
  // Coordinate mapping: Screen (pixels) <-> Math (-1 to 1)
  const screenToMath = (sx: number, sy: number): Coordinate => {
    // sx is 0 to SIZE, mapped to -1 to 1
    const mx = (sx - CENTER) / RADIUS;
    // sy is 0 to SIZE, mapped to 1 to -1 (North is positive)
    const my = -(sy - CENTER) / RADIUS;
    return { x: mx, y: my };
  };

  const mathToScreen = (mx: number, my: number) => {
    return {
      x: CENTER + (mx * RADIUS),
      y: CENTER - (my * RADIUS)
    };
  };

  // Check if a math coordinate is inside the diamond
  const isInsideDiamond = (x: number, y: number) => {
    return Math.abs(x) + Math.abs(y) <= 1.0;
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const scale = SIZE / rect.width;
    const sx = (e.clientX - rect.left) * scale;
    const sy = (e.clientY - rect.top) * scale;
    
    let { x, y } = screenToMath(sx, sy);
    
    // Clamp to diamond bounds if outside
    if (!isInsideDiamond(x, y)) {
      const absSum = Math.abs(x) + Math.abs(y);
      if (absSum > 0) {
        x = x / absSum;
        y = y / absSum;
      }
    }
    
    targetPos.current = { x, y };
  };

  const updatePhysics = () => {
    // LERP logic (Anti-gravity feel)
    const LERP_FACTOR = 0.08;
    currentPos.current.x += (targetPos.current.x - currentPos.current.x) * LERP_FACTOR;
    currentPos.current.y += (targetPos.current.y - currentPos.current.y) * LERP_FACTOR;

    // Trigger update
    onCoordinateChange({ x: currentPos.current.x, y: currentPos.current.y });

    // Render Canvas Glow
    if (canvasRef.current) {
      const ctx = canvasRef.current.getContext("2d");
      if (ctx) {
        ctx.clearRect(0, 0, SIZE, SIZE);
        
        const { x: sx, y: sy } = mathToScreen(currentPos.current.x, currentPos.current.y);
        
        // Draw sensor glow
        const gradient = ctx.createRadialGradient(sx, sy, 0, sx, sy, 100);
        gradient.addColorStop(0, "rgba(255, 255, 255, 0.4)");
        gradient.addColorStop(0.2, "rgba(255, 255, 255, 0.1)");
        gradient.addColorStop(1, "rgba(0, 0, 0, 0)");
        
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(sx, sy, 100, 0, Math.PI * 2);
        ctx.fill();

        // Draw center dot for probe
        ctx.fillStyle = "#ffffff";
        ctx.beginPath();
        ctx.arc(sx, sy, 4, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    requestRef.current = requestAnimationFrame(updatePhysics);
  };

  useEffect(() => {
    requestRef.current = requestAnimationFrame(updatePhysics);
    return () => cancelAnimationFrame(requestRef.current!);
  }, []);

  // SVG Points for the Diamond
  const diamondPoints = `
    ${CENTER},${CENTER - RADIUS} 
    ${CENTER + RADIUS},${CENTER} 
    ${CENTER},${CENTER + RADIUS} 
    ${CENTER - RADIUS},${CENTER}
  `;

  return (
    <div 
      className="relative w-full" 
      style={{ maxWidth: `${SIZE}px`, aspectRatio: '1/1', cursor: "crosshair", margin: "0 auto" }}
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onTouchMove={(e) => {
        // Touch support for mobile
        if (!containerRef.current) return;
        const touch = e.touches[0];
        const rect = containerRef.current.getBoundingClientRect();
        const scale = SIZE / rect.width;
        const sx = (touch.clientX - rect.left) * scale;
        const sy = (touch.clientY - rect.top) * scale;
        
        let { x, y } = screenToMath(sx, sy);
        if (!isInsideDiamond(x, y)) {
          const absSum = Math.abs(x) + Math.abs(y);
          if (absSum > 0) {
            x = x / absSum;
            y = y / absSum;
          }
        }
        targetPos.current = { x, y };
      }}
    >
      {/* SVG Background Layer */}
      <svg className="absolute top-0 left-0 w-full h-full" viewBox={`0 0 ${SIZE} ${SIZE}`}>
        <defs>
          <radialGradient id="centerGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.2" />
            <stop offset="100%" stopColor="#000000" stopOpacity="0" />
          </radialGradient>
          
          <radialGradient id="gradNorth" cx={CENTER} cy={CENTER - RADIUS} r={RADIUS * 1.2} gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="var(--color-supranationalism)" stopOpacity="0.7" />
            <stop offset="100%" stopColor="var(--color-supranationalism)" stopOpacity="0" />
          </radialGradient>
          
          <radialGradient id="gradSouth" cx={CENTER} cy={CENTER + RADIUS} r={RADIUS * 1.2} gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="var(--color-anarchism)" stopOpacity="0.7" />
            <stop offset="100%" stopColor="var(--color-anarchism)" stopOpacity="0" />
          </radialGradient>
          
          <radialGradient id="gradEast" cx={CENTER + RADIUS} cy={CENTER} r={RADIUS * 1.2} gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="var(--color-nationalism)" stopOpacity="0.7" />
            <stop offset="100%" stopColor="var(--color-nationalism)" stopOpacity="0" />
          </radialGradient>
          
          <radialGradient id="gradWest" cx={CENTER - RADIUS} cy={CENTER} r={RADIUS * 1.2} gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="var(--color-communitarianism)" stopOpacity="0.7" />
            <stop offset="100%" stopColor="var(--color-communitarianism)" stopOpacity="0" />
          </radialGradient>
        </defs>
        
        {/* Diamond Base Background */}
        <polygon 
          points={diamondPoints} 
          fill="#000000" 
          stroke="rgba(255, 255, 255, 0.2)" 
          strokeWidth="2" 
        />
        
        {/* Blended Color Spectrum layers */}
        <polygon points={diamondPoints} fill="url(#gradNorth)" style={{ mixBlendMode: 'screen' }} />
        <polygon points={diamondPoints} fill="url(#gradSouth)" style={{ mixBlendMode: 'screen' }} />
        <polygon points={diamondPoints} fill="url(#gradEast)" style={{ mixBlendMode: 'screen' }} />
        <polygon points={diamondPoints} fill="url(#gradWest)" style={{ mixBlendMode: 'screen' }} />
        
        {/* Center Aura */}
        <circle cx={CENTER} cy={CENTER} r={RADIUS} fill="url(#centerGlow)" />

        {/* Axes */}
        <line x1={CENTER} y1={CENTER - RADIUS} x2={CENTER} y2={CENTER + RADIUS} stroke="rgba(255,255,255,0.1)" strokeWidth="1" strokeDasharray="4 4" />
        <line x1={CENTER - RADIUS} y1={CENTER} x2={CENTER + RADIUS} y2={CENTER} stroke="rgba(255,255,255,0.1)" strokeWidth="1" strokeDasharray="4 4" />

        {/* Labels & Vertices */}
        {/* North */}
        <circle cx={CENTER} cy={CENTER - RADIUS} r="6" fill="var(--color-supranationalism)" />
        <text x={CENTER} y={CENTER - RADIUS - 30} fill="var(--color-supranationalism)" textAnchor="middle" fontSize="12" fontWeight="bold" letterSpacing="2">SUPRANATIONALISM</text>
        
        {/* South (Now Anarchism) */}
        <circle cx={CENTER} cy={CENTER + RADIUS} r="6" fill="var(--color-anarchism)" />
        <text x={CENTER} y={CENTER + RADIUS + 40} fill="var(--color-anarchism)" textAnchor="middle" fontSize="12" fontWeight="bold" letterSpacing="2">ANARCHISM</text>
        
        {/* East */}
        <circle cx={CENTER + RADIUS} cy={CENTER} r="6" fill="var(--color-nationalism)" />
        <text x={CENTER + RADIUS + 30} y={CENTER + 4} fill="var(--color-nationalism)" textAnchor="start" fontSize="12" fontWeight="bold" letterSpacing="2">NATIONALISM</text>
        
        {/* West (Now Communitarianism) */}
        <circle cx={CENTER - RADIUS} cy={CENTER} r="6" fill="var(--color-communitarianism)" />
        <text x={CENTER - RADIUS - 30} y={CENTER + 4} fill="var(--color-communitarianism)" textAnchor="end" fontSize="12" fontWeight="bold" letterSpacing="2">COMMUNITARIANISM</text>

        {/* Center Label */}
        <circle cx={CENTER} cy={CENTER} r="6" fill="#ffffff" />
        <text x={CENTER + 10} y={CENTER - 10} fill="#ffffff" fontSize="10" opacity="0.7">AUTHORITARIANISM</text>

        {/* Edge Arrows & Labels */}
        <defs>
          <marker id="arrow-north" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
            <path d="M 0 0 L 10 5 L 0 10 z" fill="rgba(255,255,255,0.4)" />
          </marker>
          <marker id="arrow-south" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
            <path d="M 0 0 L 10 5 L 0 10 z" fill="rgba(255,255,255,0.4)" />
          </marker>
        </defs>

        {/* Top Left Edge pointing North (Centralization) */}
        <path d={`M ${CENTER - RADIUS - 15} ${CENTER} L ${CENTER} ${CENTER - RADIUS - 15}`} stroke="rgba(255,255,255,0.4)" strokeWidth="1.5" strokeDasharray="4 4" markerEnd="url(#arrow-north)" />
        <g transform={`translate(${CENTER - RADIUS/2 - 7.5}, ${CENTER - RADIUS/2 - 7.5}) rotate(-45)`}>
          <text x="0" y="-8" fill="rgba(255,255,255,0.6)" textAnchor="middle" fontSize="11" fontWeight="bold" letterSpacing="1.5">CENTRALIZATION</text>
        </g>

        {/* Top Right Edge pointing North (Centralization) */}
        <path d={`M ${CENTER + RADIUS + 15} ${CENTER} L ${CENTER} ${CENTER - RADIUS - 15}`} stroke="rgba(255,255,255,0.4)" strokeWidth="1.5" strokeDasharray="4 4" markerEnd="url(#arrow-north)" />
        <g transform={`translate(${CENTER + RADIUS/2 + 7.5}, ${CENTER - RADIUS/2 - 7.5}) rotate(45)`}>
          <text x="0" y="-8" fill="rgba(255,255,255,0.6)" textAnchor="middle" fontSize="11" fontWeight="bold" letterSpacing="1.5">CENTRALIZATION</text>
        </g>

        {/* Bottom Left Edge pointing South (Decentralization) */}
        <path d={`M ${CENTER - RADIUS - 15} ${CENTER} L ${CENTER} ${CENTER + RADIUS + 15}`} stroke="rgba(255,255,255,0.4)" strokeWidth="1.5" strokeDasharray="4 4" markerEnd="url(#arrow-south)" />
        <g transform={`translate(${CENTER - RADIUS/2 - 7.5}, ${CENTER + RADIUS/2 + 7.5}) rotate(45)`}>
          <text x="0" y="16" fill="rgba(255,255,255,0.6)" textAnchor="middle" fontSize="11" fontWeight="bold" letterSpacing="1.5">DECENTRALIZATION</text>
        </g>

        {/* Bottom Right Edge pointing South (Decentralization) */}
        <path d={`M ${CENTER + RADIUS + 15} ${CENTER} L ${CENTER} ${CENTER + RADIUS + 15}`} stroke="rgba(255,255,255,0.4)" strokeWidth="1.5" strokeDasharray="4 4" markerEnd="url(#arrow-south)" />
        <g transform={`translate(${CENTER + RADIUS/2 + 7.5}, ${CENTER + RADIUS/2 + 7.5}) rotate(-45)`}>
          <text x="0" y="16" fill="rgba(255,255,255,0.6)" textAnchor="middle" fontSize="11" fontWeight="bold" letterSpacing="1.5">DECENTRALIZATION</text>
        </g>
      </svg>

      {/* HTML5 Canvas Glow Layer */}
      <canvas 
        className="absolute top-0 left-0 w-full h-full pointer-events-none" 
        width={SIZE} 
        height={SIZE} 
        ref={canvasRef}
      />
    </div>
  );
}
