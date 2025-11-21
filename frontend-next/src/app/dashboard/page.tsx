"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

export default function Dashboard() {
  const [user, setUser] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }

    // Exemple d'appel à une future route /api/me
    axios.get("http://localhost:8080/api/me", {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(res => setUser(res.data))
    .catch(() => {
      localStorage.removeItem("token");
      router.push("/login");
    });
  }, [router]);

  if (!user) return <div className="min-h-screen bg-gradient-to-br from-[#0C4A6E] to-[#10B981] flex items-center justify-center"><div className="text-white text-2xl">Chargement...</div></div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0C4A6E] to-[#10B981] p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-5xl font-bold text-white mb-4">Bienvenue, {user.prenom || user.nom} !</h1>
        <p className="text-xl text-white/90 mb-10">Voici ton tableau de bord Investore</p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 text-white">
            <h2 className="text-2xl font-bold mb-4">Solde actuel</h2>
            <p className="text-5xl font-bold">{user.balance?.toLocaleString() || "0"} FCFA</p>
          </div>

          <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 text-white">
            <h2 className="text-2xl font-bold mb-4">Épargne recommandée</h2>
            <p className="text-5xl font-bold">150 000 FCFA</p>
            <p className="text-sm mt-2">Ce mois-ci</p>
          </div>

          <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 text-white">
            <h2 className="text-2xl font-bold mb-4">Investissement possible</h2>
            <p className="text-5xl font-bold">80 000 FCFA</p>
            <p className="text-sm mt-2">Risque faible</p>
          </div>
        </div>

        <div className="mt-12 bg-white/10 backdrop-blur-lg rounded-3xl p-8">
          <h2 className="text-3xl font-bold text-white mb-6">Tes prochaines actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-white">
            <a href="/finances" className="bg-[#10B981]/80 hover:bg-[#10B981] p-6 rounded-2xl transition">
              <h3 className="text-2xl font-bold">Gérer mes finances</h3>
              <p>Ajouter revenus & dépenses</p>
            </a>
            <a href="/investments" className="bg-[#0C4A6E]/80 hover:bg-[#0C4A6E] p-6 rounded-2xl transition">
              <h3 className="text-2xl font-bold">Investir maintenant</h3>
              <p>Dès 5000 FCFA</p>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}