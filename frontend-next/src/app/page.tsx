"use client";

import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

export default function Home() {
  const [username, setUsername] = useState("chocoa");
  const [password, setPassword] = useState("123456");
  const router = useRouter();


  const login = async () => {
  try {
    const res = await axios.post("http://localhost:8080/api/auth/login", {
      username, password
    });
    alert("Connexion OK ! Token reçu");  // ← Tu vois ça = API marche
    localStorage.setItem("token", res.data);
    router.push("/profile");
  } catch (err) {
    alert("API ne répond pas ou mauvais identifiants");
  }
};
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center">
      <div className="bg-white p-10 rounded-2xl shadow-2xl w-96">
        <h1 className="text-3xl font-bold text-center mb-8">Chocoa Auth</h1>
        <input
          className="w-full p-3 border border-gray-300 rounded-lg mb-4"
          placeholder="Utilisateur"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          className="w-full p-3 border border-gray-300 rounded-lg mb-6"
          type="password"
          placeholder="Mot de passe"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button
          onClick={login}
          className="w-full bg-purple-600 text-white py-3 rounded-lg font-semibold hover:bg-purple-700 transition"
        >
          Se connecter
        </button>
        <p className="text-center mt-4 text-sm text-gray-600">
          Essaie : chocoa / 123456
        </p>
      </div>
    </div>
  );
}