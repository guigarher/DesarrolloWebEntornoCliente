const API_URL = "http://localhost:3000";

export async function getUser(){
  const res = await fetch(`${API_URL}/usuarios`);
  if (!res.ok) throw new Error("Error al cargar usuarios");
  return await res.json();
} 