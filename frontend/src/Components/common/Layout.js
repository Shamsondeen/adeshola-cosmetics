import React from "react";
import { Outlet } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";
import WhatsAppButton from "./WhatsAppButton";

export default function Layout() {
  return (
    <div className="layout">
      <Header />
      <main className="main-content"><Outlet /></main>
      <Footer />
      <WhatsAppButton />
    </div>
  );
}
