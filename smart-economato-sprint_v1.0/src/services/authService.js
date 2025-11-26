export const API_URL = 'http://localhost:3000';


export const AuthService = {

  async login(username, password) {
    // Llamada a json-server para buscar usuario
    
    try {
    const response = await fetch(`${API_URL}/usuarios?username=${username}&password=${password}`);
    const data = await response.json();

    if (data.length === 0) {
      throw new Error("Usuario o contraseña incorrectos");
    }

    // Retorna el usuario autenticado
    const user = data[0]; 
    
    return user
  } catch(error) {
    throw new Error(error.message);
  }
  }
};