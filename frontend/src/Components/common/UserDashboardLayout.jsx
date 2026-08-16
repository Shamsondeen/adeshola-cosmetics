import React, { useState } from "react";
import MiniCartWidget from "./MiniCartWidget";

export default function DashboardLayout({ children }) {
  return (
    <div className="dashboard-container" style={{ display: "flex", minHeight: "100vh" }}>
      {/* Sidebar */}
      <aside style={{
        width: "220px", 
        background: "#f5f5f5",
        padding: "1rem",
        borderRight: "1px solid #ddd"
      }}>
        <h3 style={{ marginBottom: "1rem" }}>Dashboard</h3>
        <ul style={{ listStyle: "none", padding: 0 }}>
          <li><a href="/dashboard">Home</a></li>
          <li><a href="/orders">Orders</a></li>
          <li><a href="/profile">Profile</a></li>
        </ul>
      </aside>

      {/* Main Content */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        
        {/* Header */}
        <header style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "0.8rem 1rem",
          background: "#fff",
          borderBottom: "1px solid #ddd"
        }}>
          <h2>My Dashboard</h2>
          <MiniCartWidget />
        </header>

        {/* Page Content */}
        <main style={{ padding: "1rem", flex: 1, background: "#fafafa" }}>
          {children}
        </main>
      </div>
    </div>
  );
}
