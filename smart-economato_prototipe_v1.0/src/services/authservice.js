const API_URL = "http://localhost:3000";

export const AuthService = {

    async login(username, password) {
      try {
        const res = await fetch(`${API_URL}/usuarios?username=${username}&password=${password}`)
        const data = await res.json()

        if(data.length === 0){
          return null;
        }

        const user = data[0]

        return user;
      } catch (error) {
        throw new Error("Error al iniciar sesión");
      }
    }
}

/*export async function getUser(){
  const res = await fetch(`${API_URL}/usuarios`);
  if (!res.ok) throw new Error("Error al cargar usuarios");
  return await res.json();
} */