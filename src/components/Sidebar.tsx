"use client";

import React, { useEffect, useRef } from "react";
import * as d3 from "d3";
import { DataMatrix } from "../lib/engine";

interface Props {
  data: DataMatrix;
}

export default function Sidebar({ data }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current || !data) return;

    // Convert DataMatrix to array for D3
    const dataArray = [
      { key: "Authoritarianism", value: data.authoritarianism, color: "#ffffff" },
      { key: "Supranationalism", value: data.supranationalism, color: "var(--color-supranationalism)" },
      { key: "Anarchism", value: data.anarchism, color: "var(--color-anarchism)" },
      { key: "Nationalism", value: data.nationalism, color: "var(--color-nationalism)" },
      { key: "Communitarianism", value: data.communitarianism, color: "var(--color-communitarianism)" },
      { key: "Surveillance", value: data.surveillance, color: "#ff9900" },
      { key: "Bureaucratic Oversight", value: data.bureaucraticOversight, color: "#ff9900" },
      { key: "Market Deregulation", value: data.marketDeregulation, color: "#ff9900" },
      { key: "Social Conservatism", value: data.socialConservatism, color: "#ff9900" },
      { key: "Wealth Redistribution", value: data.wealthRedistribution, color: "#ff9900" },
      { key: "Military Intervention", value: data.militaryIntervention, color: "#ff9900" },
      { key: "Personal Privacy", value: data.personalPrivacy, color: "#00ff99" },
      { key: "Religious Influence", value: data.religiousInfluence, color: "#ff9900" },
      { key: "Border Control", value: data.borderControl, color: "#ff9900" },
      { key: "Environmental Regulation", value: data.environmentalRegulation, color: "#ff9900" },
    ];

    const margin = { top: 20, right: 30, bottom: 20, left: 160 };
    const width = 400 - margin.left - margin.right;
    const height = 600 - margin.top - margin.bottom;

    // Clear previous SVG
    d3.select(containerRef.current).selectAll("svg").remove();

    const svg = d3.select(containerRef.current)
      .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    // X axis
    const x = d3.scaleLinear()
      .domain([0, 100])
      .range([0, width]);

    svg.append("g")
      .attr("transform", `translate(0,${height})`)
      .call(d3.axisBottom(x).ticks(5))
      .attr("color", "rgba(255,255,255,0.3)");

    // Y axis
    const y = d3.scaleBand()
      .range([0, height])
      .domain(dataArray.map(d => d.key))
      .padding(.2);

    svg.append("g")
      .call(d3.axisLeft(y))
      .attr("color", "rgba(255,255,255,0.7)")
      .selectAll("text")
      .style("font-family", "Inter")
      .style("font-size", "11px");

    // Bars
    svg.selectAll("myRect")
      .data(dataArray)
      .join("rect")
      .attr("x", x(0))
      .attr("y", d => y(d.key) as number)
      .attr("width", d => x(d.value))
      .attr("height", y.bandwidth())
      .attr("fill", d => d.color)
      .style("transition", "width 0.1s linear"); // Smooth D3/CSS transition
      
  }, [data]);

  return (
    <div className="flex flex-col h-full" style={{ background: "var(--panel-bg)", padding: "20px", borderRight: "1px solid var(--panel-border)" }}>
      <h2 style={{ marginBottom: "10px", fontSize: "1.2rem", fontWeight: 600, letterSpacing: "1px" }}>METRICS MATRIX</h2>
      <div ref={containerRef} style={{ flexGrow: 1 }} />
    </div>
  );
}
