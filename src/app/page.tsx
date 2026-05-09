"use client";

import { useState } from "react";
import DiamondSpectrum from "../components/DiamondSpectrum";
import Sidebar from "../components/Sidebar";
import { CentripetalEngine, Coordinate, DataMatrix } from "../lib/engine";

export default function Home() {
  const [dataMatrix, setDataMatrix] = useState<DataMatrix>(
    CentripetalEngine.calculateMatrix({ x: 0, y: 0 }) // Initial state at center
  );

  const handleCoordinateChange = (coord: Coordinate) => {
    const newData = CentripetalEngine.calculateMatrix(coord);
    setDataMatrix(newData);
  };

  return (
    <main className="w-full h-screen bg-black overflow-hidden relative">
      {/* Left side: Sidebar Data Matrix */}
      <div className="absolute top-0 left-0 w-[400px] h-full z-10">
        <Sidebar data={dataMatrix} />
      </div>

      {/* Center: The Spectrum Diagram */}
      <div className="w-full h-full flex items-center justify-center relative" style={{ flexDirection: 'column' }}>
        <DiamondSpectrum onCoordinateChange={handleCoordinateChange} />

        {/* Title or ambient text */}
        <div style={{ marginTop: "40px", textAlign: "center", color: "rgba(255,255,255,0.4)", letterSpacing: "2px" }}>
          <h1 style={{ fontSize: "1.25rem", fontWeight: "bold", color: "white", letterSpacing: "0.1em", margin: 0 }}>DIAMOND CENTRIPETAL CHART</h1>
          <p style={{ fontSize: "0.875rem", margin: "5px 0 0 0" }}>POLITICAL SPECTRUM VISUALISER</p>
        </div>
      </div>
    </main>
  );
}
