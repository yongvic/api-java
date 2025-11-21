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

export default function Register() {
  const [mode, setMode] = useState<"email" | "phone">("email");
  const [countries, setCountries] = useState<Country[]>([]);
  const [selectedCountry, setSelectedCountry] = useState<Country | null>(null);
  const [form, setForm] = useState({
    nom: "",
    prenom: "",
    email: "",
    telephone: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    axios
      .get("http://localhost:8080/api/countries")
      .then((res) => {
        setCountries(res.data);
        const cameroon = res.data.find((c: Country) => c.code === "+237") || res.data[0];
        setSelectedCountry(cameroon);
      })
      .catch(() => console.log("Pays non chargés – mode téléphone désactivé"));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const payload: any = {
      nom: form.nom.trim(),
      prenom: form.prenom.trim(),
      password: form.password,
    };

    if (mode === "email") {
      payload.email = form.email.trim();
    } else {
      payload.telephone = form.telephone.trim();
      payload.countryId = selectedCountry?.id || 1; // fallback Cameroun
    }

    try {
      await axios.post("http://localhost:8080/api/auth/register", payload);
      alert("Inscription réussie ! Bienvenue sur Investore 🎉");
      router.push("/login");
    } catch (err: any) {
      alert(err.response?.data || "Erreur d'inscription");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4"
      style={{
        backgroundImage: "url('/th.jpeg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div className="absolute inset-0 bg-black/50" />

      <div className="relative z-10 bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl p-10 w-full max-w-lg">
        <h1 className="text-5xl font-bold text-center text-[#0C4A6E] mb-4">Investore</h1>
        <p className="text-center text-gray-600 mb-8">Crée ton compte en 30 secondes</p>

        {/* Toggle Email / Téléphone */}
        <div className="flex justify-center mb-8">
          <button
            onClick={() => setMode("email")}
            className={`px-10 py-4 text-lg font-semibold rounded-l-2xl transition ${
              mode === "email" ? "bg-[#0C4A6E] text-white" : "bg-gray-200 text-gray-700"
            }`}
          >
            Email
          </button>
          <button
            onClick={() => setMode("phone")}
            className={`px-10 py-4 text-lg font-semibold rounded-r-2xl transition ${
              mode === "phone" ? "bg-[#0C4A6E] text-white" : "bg-gray-200 text-gray-700"
            }`}
          >
            Téléphone
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-2 gap-4">
            <input
              required
              placeholder="Nom"
              className="p-4 border-2 rounded-xl focus:border-[#0C4A6E] transition"
              onChange={(e) => setForm({ ...form, nom: e.target.value })}
            />
            <input
              required
              placeholder="Prénom"
              className="p-4 border-2 rounded-xl focus:border-[#0C4A6E] transition"
              onChange={(e) => setForm({ ...form, prenom: e.target.value })}
            />
          </div>

          {mode === "email" ? (
            <input
              required
              type="email"
              placeholder="ton@email.com"
              className="w-full p-4 border-2 rounded-xl focus:border-[#0C4A6E] transition"
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
          ) : (
            <div className="flex gap-3">
              <select
                value={selectedCountry?.id || ""}
                onChange={(e) => {
                  const country = countries.find((c) => c.id === Number(e.target.value));
                  setSelectedCountry(country || null);
                }}
                className="p-4 border-2 rounded-xl bg-white w-40"
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
                onChange={(e) => setForm({ ...form, telephone: e.target.value })}
              />
            </div>
          )}

          <input
            required
            type="password"
            placeholder="Mot de passe"
            className="w-full p-4 border-2 rounded-xl focus:border-[#0C4A6E] transition"
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#10B981] hover:bg-[#0C4A6E] text-white py-5 rounded-xl font-bold text-xl transition disabled:opacity-70"
          >
            {loading ? "Création..." : "Rejoindre Investore"}
          </button>
        </form>

        <p className="text-center mt-8 text-gray-600">
          Déjà membre ?{" "}
          <a href="/login" className="text-[#0C4A6E] font-bold underline">
            Se connecter
          </a>
        </p>
      </div>
    </div>
  );
}