const API_URL = "http://localhost:3000";

export const AuthService = {

    async login(username, password) {
        const res = await fetch(`${API_URL}/usuarios?username=${username}&password=${password}`)
        const data = Response.json()

        if(data.lenght === 0){}

        const user = data[0]

        return user;
    }
}

/*export async function getUser(){
  const res = await fetch(`${API_URL}/usuarios`);
  if (!res.ok) throw new Error("Error al cargar usuarios");
  return await res.json();
} */