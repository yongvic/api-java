"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

type Country = {
  id: number;
  code: string;
  name: string;
  flagEmoji: string;
};

export default function Login() {
  const [useEmail, setUseEmail] = useState(true);
  const [countries, setCountries] = useState<Country[]>([]);
  const [selectedCountry, setSelectedCountry] = useState<Country | null>(null);
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    axios.get("http://localhost:8080/api/countries").then((res) => {
      setCountries(res.data);
      const cameroon = res.data.find((c: Country) => c.code === "+237");
      if (cameroon) setSelectedCountry(cameroon);
    });
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const payload = useEmail
      ? { email: identifier, password }
      : { telephone: identifier, countryId: selectedCountry?.id, password };

    try {
      const res = await axios.post("http://localhost:8080/api/auth/login", payload);
      localStorage.setItem("token", res.data);
      alert("Connexion réussie ! 🚀");
      router.push("/dashboard");
    } catch (err: any) {
      alert(err.response?.data || "Identifiant ou mot de passe incorrect");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0C4A6E] to-[#10B981] flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl p-10 w-full max-w-md">
        <h1 className="text-5xl font-bold text-center text-[#0C4A6E] mb-8">Investore</h1>

        <div className="flex justify-center mb-8">
          <button
            onClick={() => setUseEmail(true)}
            className={`px-8 py-3 rounded-l-xl font-medium transition ${useEmail ? "bg-[#0C4A6E] text-white" : "bg-gray-200"}`}
          >
            Email
          </button>
          <button
            onClick={() => setUseEmail(false)}
            className={`px-8 py-3 rounded-r-xl font-medium transition ${!useEmail ? "bg-[#0C4A6E] text-white" : "bg-gray-200"}`}
          >
            Téléphone
          </button>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          {useEmail ? (
            <input
              required
              type="email"
              placeholder="ton@email.com"
              className="w-full p-4 border-2 rounded-xl focus:border-[#0C4A6E] transition"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
            />
          ) : (
            <div className="flex gap-3">
              <select
                value={selectedCountry?.id || ""}
                onChange={(e) => {
                  const country = countries.find((c) => c.id === Number(e.target.value));
                  setSelectedCountry(country || null);
                }}
                className="p-4 border-2 rounded-xl bg-white"
              >
                {countries.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.flagEmoji} {c.code}
                  </option>
                ))}
              </select>
              <input
                required
                placeholder="690123456"
                className="flex-1 p-4 border-2 rounded-xl focus:border-[#0C4A6E] transition"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
              />
            </div>
          )}

          <input
            required
            type="password"
            placeholder="Mot de passe"
            className="w-full p-4 border-2 rounded-xl focus:border-[#0C4A6E] transition"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#10B981] hover:bg-[#0C4A6E] text-white py-5 rounded-xl font-bold text-xl transition disabled:opacity-70"
          >
            {loading ? "Connexion..." : "Se connecter"}
          </button>
        </form>

        <p className="text-center mt-8 text-gray-600">
          Pas de compte ?{" "}
          <a href="/register" className="text-[#0C4A6E] font-bold underline">
            S’inscrire
          </a>
        </p>
      </div>
    </div>
  );
}