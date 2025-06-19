"use client";
import React from "react";
import { Button, Card } from "@mui/material";
import { ArrowForward } from "@mui/icons-material";

const features = [
  "🔐 Token-Based Authentication",
  "📡 CRUD API with Next.js Routes",
  "🧠 State Management (Zustand/Redux Toolkit)",
  "🎨 Tailwind + MUI UI Kit",
  "📱 Fully Responsive Design",
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white text-blue-900">
      {/* Hero Section */}
      <section className="bg-blue-600 text-white py-20 px-6 md:px-20">
        <div className="max-w-5xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Task Manager Dashboard
          </h1>
          <p className="text-lg md:text-xl mb-6">
            A modern dashboard with secure login, local APIs, state management,
            and responsive UI – no external DB needed!
          </p>
          <Button
            variant="contained"
            color="secondary"
            endIcon={<ArrowForward />}
            href="/dashboard"
            sx={{ bgcolor: "white", color: "#1D4ED8", fontWeight: 600 }}
          >
            Get Started
          </Button>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-6 md:px-20 bg-white">
        <h2 className="text-2xl md:text-3xl font-semibold text-center mb-12">
          🚀 Key Features
        </h2>
        <div className="grid md:grid-cols-3 gap-6">
          {features.map((feature, idx) => (
            <Card key={idx} className="p-6 text-center shadow-md">
              <p className="text-lg font-medium">{feature}</p>
            </Card>
          ))}
        </div>
      </section>

      {/* Tech Stack Section */}
      <section className="py-12 bg-blue-50 px-6 md:px-20">
        <h3 className="text-xl md:text-2xl font-semibold text-center mb-8">
          🛠 Tech Stack
        </h3>
        <div className="flex flex-wrap justify-center gap-4 text-blue-800 font-semibold text-sm">
          <span className="bg-white px-4 py-2 rounded shadow">Next.js</span>
          <span className="bg-white px-4 py-2 rounded shadow">
            Tailwind CSS
          </span>
          <span className="bg-white px-4 py-2 rounded shadow">MUI</span>
          <span className="bg-white px-4 py-2 rounded shadow">Zustand</span>
          <span className="bg-white px-4 py-2 rounded shadow">
            Redux Toolkit
          </span>
          <span className="bg-white px-4 py-2 rounded shadow">Token Auth</span>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-6 text-center bg-blue-600 text-white">
        <p>© 2025 Task Manager Dashboard. Built with 💙 by Shivam Jaiswal</p>
      </footer>
    </div>
  );
}
