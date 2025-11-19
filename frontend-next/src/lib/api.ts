// lib/api.ts
export async function getCountries() {
  const res = await fetch("http://localhost:8080/api/countries");
  return res.json();
}