const API_URL = "http://localhost:3000";

export const AuthService = {

    async function login(username, password) {
        const res = await fetch(`${API_URL}/usuarios.`)
    }
}

/*export async function getUser(){
  const res = await fetch(`${API_URL}/usuarios`);
  if (!res.ok) throw new Error("Error al cargar usuarios");
  return await res.json();
} */