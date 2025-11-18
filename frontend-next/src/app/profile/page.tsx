"use client";

import { useEffect } from "react";
import axios from "axios";

export default function Profile() {
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      window.location.href = "/";
      return;
    }

    axios
      .get("http://localhost:8080/api/profile", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .catch(() => {
        localStorage.removeItem("token");
        window.location.href = "/";
      });
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-500 to-teal-600 flex items-center justify-center">
      <div className="bg-white p-10 rounded-2xl shadow-2xl text-center">
        <h1 className="text-4xl font-bold mb-4">Bienvenue !</h1>
        <p className="text-xl mb-8">Tu es connecté avec Next.js + Spring Boot</p>
        <button
          onClick={() => {
            localStorage.removeItem("token");
            window.location.href = "/";
          }}
          className="bg-red-600 text-white px-8 py-3 rounded-lg hover:bg-red-700 transition"
        >
          Déconnexion
        </button>
      </div>
    </div>
  );
}