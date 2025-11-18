// app/register/page.tsx
"use client";

import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

export default function Register() {
  const [useEmail, setUseEmail] = useState(true);
  const [form, setForm] = useState({
    nom: "", prenom: "", email: "", telephone: "", password: ""
  });
  const router = useRouter();

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:8080/api/auth/register", form);
      alert("Compte créé avec succès !");
      router.push("/login");
    } catch (err: any) {
      alert(err.response?.data || "Erreur");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0C4A6E] to-[#10B981] flex items-center justify-center p-4">
      <div className="bg-white p-10 rounded-3xl shadow-2xl w-full max-w-md">
        <h1 className="text-4xl font-bold text-center text-[#0C4A6E] mb-8">Investore</h1>

        <div className="flex justify-center mb-6">
          <button onClick={() => setUseEmail(true)} className={`px-6 py-2 rounded-l-lg ${useEmail ? "bg-[#0C4A6E] text-white" : "bg-gray-200"}`}>
            Email
          </button>
          <button onClick={() => setUseEmail(false)} className={`px-6 py-2 rounded-r-lg ${!useEmail ? "bg-[#0C4A6E] text-white" : "bg-gray-200"}`}>
            Téléphone
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input required placeholder="Nom" className="w-full p-4 border rounded-xl" onChange={e => setForm({...form, nom: e.target.value})} />
          <input required placeholder="Prénom" className="w-full p-4 border rounded-xl" onChange={e => setForm({...form, prenom: e.target.value})} />

          {useEmail ? (
            <input required type="email" placeholder="Email" className="w-full p-4 border rounded-xl" onChange={e => setForm({...form, email: e.target.value, telephone: ""})} />
          ) : (
            <input required placeholder="Téléphone (ex: 69012345678)" className="w-full p-4 border rounded-xl" onChange={e => setForm({...form, telephone: e.target.value, email: ""})} />
          )}

          <input required type="password" placeholder="Mot de passe" className="w-full p-4 border rounded-xl" onChange={e => setForm({...form, password: e.target.value})} />

          <button type="submit" className="w-full bg-[#10B981] text-white py-4 rounded-xl font-bold hover:bg-[#0C4A6E] transition text-lg">
            Créer mon compte Investore
          </button>
        </form>
      </div>
    </div>
  );
}