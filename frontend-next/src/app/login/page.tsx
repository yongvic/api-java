"use client";

import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

export default function Login() {
  const [useEmail, setUseEmail] = useState(true);
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: any) => {
    e.preventDefault();
    setLoading(true);

    const payload = useEmail 
      ? { email: identifier, password }
      : { telephone: identifier, password };

    try {
      const res = await axios.post("http://localhost:8080/api/auth/login", payload);
      localStorage.setItem("token", res.data);
      alert("Connexion réussie ! Bienvenue sur Investore 🚀");
      router.push("/dashboard");
    } catch (err) {
      alert("Identifiant ou mot de passe incorrect");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0C4A6E] to-[#10B981] flex items-center justify-center p-4">
      <div className="bg-white p-10 rounded-3xl shadow-2xl w-full max-w-md">
        <h1 className="text-4xl font-bold text-center text-[#0C4A6E] mb-8">Investore</h1>

        <div className="flex justify-center mb-8">
          <button onClick={() => setUseEmail(true)} className={`px-8 py-3 rounded-l-xl font-medium transition ${useEmail ? "bg-[#0C4A6E] text-white" : "bg-gray-200"}`}>
            Email
          </button>
          <button onClick={() => setUseEmail(false)} className={`px-8 py-3 rounded-r-xl font-medium transition ${!useEmail ? "bg-[#0C4A6E] text-white" : "bg-gray-200"}`}>
            Téléphone
          </button>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <input
            required
            type={useEmail ? "email" : "tel"}
            placeholder={useEmail ? "ton@email.com" : "69012345678"}
            className="w-full p-4 border-2 border-gray-300 rounded-xl focus:border-[#0C4A6E] transition"
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
          />

          <input
            required
            type="password"
            placeholder="Mot de passe"
            className="w-full p-4 border-2 border-gray-300 rounded-xl focus:border-[#0C4A6E] transition"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#10B981] text-white py-4 rounded-xl font-bold text-lg hover:bg-[#0C4A6E] transition disabled:opacity-70"
          >
            {loading ? "Connexion..." : "Se connecter"}
          </button>
        </form>

        <p className="text-center mt-6 text-gray-600">
          Pas de compte ? <a href="/register" className="text-[#0C4A6E] font-bold underline">S’inscrire</a>
        </p>
      </div>
    </div>
  );
}